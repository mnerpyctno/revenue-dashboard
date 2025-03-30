export interface Store {
  id: string;
  name: string;
  group: string;
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
  month: string;
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
  skill: number;
  click: number;
  vp: number;
  nayavu: number;
  spice: number;
  auto: number;
  createdAt: string;
  updatedAt: string;
} 