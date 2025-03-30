import { NextResponse } from 'next/server';
import { getStores, saveStore } from '@/lib/edge-config';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const stores = await getStores();
    const storeIndex = stores.findIndex(store => store.id === params.id);
    
    if (storeIndex === -1) {
      return NextResponse.json(
        { error: 'Store not found' },
        { status: 404 }
      );
    }

    const updatedStore = {
      ...stores[storeIndex],
      ...data,
      id: params.id
    };

    await saveStore(updatedStore);
    return NextResponse.json(updatedStore);
  } catch (error) {
    console.error('Error updating store:', error);
    return NextResponse.json(
      { error: 'Failed to update store' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const stores = await getStores();
    const filteredStores = stores.filter(store => store.id !== params.id);
    
    if (filteredStores.length === stores.length) {
      return NextResponse.json(
        { error: 'Store not found' },
        { status: 404 }
      );
    }

    await saveStore({ stores: filteredStores });
    return NextResponse.json({ message: 'Store deleted successfully' });
  } catch (error) {
    console.error('Error deleting store:', error);
    return NextResponse.json(
      { error: 'Failed to delete store' },
      { status: 500 }
    );
  }
} 