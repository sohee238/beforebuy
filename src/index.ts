export interface Wish {
  id: string;
  name: string;
  price: number;
  image: string;
  createdAt: string;
  isInvested: boolean;
}

export interface Investment {
  id: string;
  wishId: string;
  amount: number;
  period: number;
  expectedReturn: number;
  date: string;
}
