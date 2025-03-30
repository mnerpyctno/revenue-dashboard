import { NextResponse } from 'next/server';
import { getPlans, savePlan } from '@/lib/edge-config';

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

    const plans = await getPlans(month);
    return NextResponse.json(plans);
  } catch (error) {
    console.error('Error fetching plans:', error);
    return NextResponse.json({ error: 'Failed to fetch plans' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const plan = await request.json();
    const savedPlan = await savePlan(plan);
    return NextResponse.json(savedPlan);
  } catch (error) {
    console.error('Error saving plan:', error);
    return NextResponse.json({ error: 'Failed to save plan' }, { status: 500 });
  }
} 