import { prisma } from '@/app/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { storeId, month, ...planData } = data;

    // Проверяем существование плана для данного магазина и месяца
    const existingPlan = await prisma.monthlyPlan.findUnique({
      where: {
        storeId_month: {
          storeId,
          month
        }
      }
    });

    let plan;
    if (existingPlan) {
      // Обновляем существующий план
      plan = await prisma.monthlyPlan.update({
        where: {
          id: existingPlan.id
        },
        data: planData
      });
    } else {
      // Создаем новый план
      plan = await prisma.monthlyPlan.create({
        data: {
          storeId,
          month,
          ...planData
        }
      });
    }

    return NextResponse.json(plan);
  } catch (error) {
    console.error('Error saving plan:', error);
    return NextResponse.json(
      { error: 'Failed to save plan' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');

    if (!month) {
      return NextResponse.json(
        { error: 'Month parameter is required' },
        { status: 400 }
      );
    }

    const plans = await prisma.monthlyPlan.findMany({
      where: {
        month: month,
      },
      include: {
        store: true
      },
      orderBy: [
        { store: { group: 'asc' } },
        { store: { name: 'asc' } }
      ]
    });

    return NextResponse.json(plans);
  } catch (error) {
    console.error('Error fetching plans:', error);
    return NextResponse.json(
      { error: 'Failed to fetch plans' },
      { status: 500 }
    );
  }
} 