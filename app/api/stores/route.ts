import { NextRequest, NextResponse } from 'next/server';
import { getStores, saveStore } from '@/lib/edge-config';

export async function GET() {
  try {
    const stores = await getStores();
    return NextResponse.json(stores);
  } catch (error) {
    console.error('Error fetching stores:', error);
    return NextResponse.json({ error: 'Failed to fetch stores' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const store = await request.json();
    const savedStore = await saveStore(store);
    return NextResponse.json(savedStore);
  } catch (error) {
    console.error('Error saving store:', error);
    return NextResponse.json({ error: 'Failed to save store' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();

    if (!data.id || !data.name || !data.group) {
      return NextResponse.json(
        { error: 'ID, name and group are required' },
        { status: 400 }
      );
    }

    const savedStore = await saveStore(data);
    return NextResponse.json(savedStore);
  } catch (error) {
    console.error('Error updating store:', error);
    return NextResponse.json(
      { error: 'Failed to update store' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Store ID is required' },
        { status: 400 }
      );
    }

    const stores = await getStores();
    const updatedStores = stores.filter(store => store.id !== id);
    await saveStore({ stores: updatedStores });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting store:', error);
    return NextResponse.json(
      { error: 'Failed to delete store' },
      { status: 500 }
    );
  }
} 