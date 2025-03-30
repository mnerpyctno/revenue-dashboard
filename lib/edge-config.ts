import { Redis } from '@upstash/redis';
import { Store, MonthlyPlan } from '@/app/types';

const redis = new Redis({
  url: process.env.REDIS_URL || '',
  token: process.env.KV_REST_API_TOKEN || '',
});

export async function getStores(): Promise<Store[]> {
  try {
    const stores = await redis.get<Store[]>('stores');
    return stores || [];
  } catch (error) {
    console.error('Error fetching stores:', error);
    return [];
  }
}

export async function getPlans(month: string): Promise<MonthlyPlan[]> {
  try {
    const plans = await redis.get<MonthlyPlan[]>(`plans_${month}`);
    return plans || [];
  } catch (error) {
    console.error('Error fetching plans:', error);
    return [];
  }
}

export async function savePlan(plan: Omit<MonthlyPlan, 'id'>): Promise<MonthlyPlan> {
  try {
    const month = plan.month;
    const plans = await getPlans(month);
    const existingIndex = plans.findIndex((p) => p.id === (plan as MonthlyPlan).id);

    let updatedPlans: MonthlyPlan[];
    if (existingIndex >= 0) {
      updatedPlans = [...plans];
      updatedPlans[existingIndex] = plan as MonthlyPlan;
    } else {
      const newPlan: MonthlyPlan = {
        ...plan,
        id: crypto.randomUUID()
      };
      updatedPlans = [...plans, newPlan];
    }

    await redis.set(`plans_${month}`, updatedPlans);
    return existingIndex >= 0 ? (plan as MonthlyPlan) : updatedPlans[updatedPlans.length - 1];
  } catch (error) {
    console.error('Error saving plan:', error);
    throw error;
  }
}

export async function saveStore(storeOrStores: Omit<Store, 'id'> | { stores: Store[] }): Promise<Store | void> {
  try {
    if ('stores' in storeOrStores) {
      await redis.set('stores', storeOrStores.stores);
      return;
    }

    const stores = await getStores();
    const existingIndex = stores.findIndex((s) => s.id === (storeOrStores as Store).id);

    let updatedStores: Store[];
    if (existingIndex >= 0) {
      updatedStores = [...stores];
      updatedStores[existingIndex] = storeOrStores as Store;
    } else {
      const newStore: Store = {
        ...storeOrStores,
        id: crypto.randomUUID()
      };
      updatedStores = [...stores, newStore];
    }

    await redis.set('stores', updatedStores);
    return existingIndex >= 0 ? (storeOrStores as Store) : updatedStores[updatedStores.length - 1];
  } catch (error) {
    console.error('Error saving store:', error);
    throw error;
  }
} 