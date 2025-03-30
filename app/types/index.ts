export interface Store {
  id: string;
  number: string;
  address: string;
  group: string;
  staffCount: number;
  name: string; // ТО
  region?: string;
}

export interface BasePlan {
  gsm: number;
  gadgets: number;
  digital: number;
  orders: number;
  household: number;
  tech: number;
  photo: number;
  sp: number;
  service: number;
  smart: number;
  sim: number;
}

export interface AdditionalPlan {
  skill: number;
  click: number;
  vp: number;
  nayavu: number;
  spice: number;
  auto: number;
}

export interface MonthlyPlan {
  id: string;
  storeId: string;
  month: string; // Format: YYYY-MM
  basePlan: BasePlan;
  additionalPlan: AdditionalPlan;
} 