import { Wish, Investment } from '../types';

const WISHES_KEY = 'wishvest_wishes';
const INVESTMENTS_KEY = 'wishvest_investments';

// Wishes
export function getWishes(onlyNotInvested = false): Wish[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(WISHES_KEY);
  const wishes = data ? JSON.parse(data) : [];
  
  if (onlyNotInvested) {
    return wishes.filter((wish: Wish) => !wish.isInvested);
  }
  
  return wishes;
}

export function saveWish(wish: Wish): void {
  const wishes = getWishes();
  wishes.push(wish);
  localStorage.setItem(WISHES_KEY, JSON.stringify(wishes));
}

export function updateWish(id: string, updates: Partial<Wish>): void {
  const wishes = getWishes();
  const updatedWishes = wishes.map(w => w.id === id ? { ...w, ...updates } : w);
  localStorage.setItem(WISHES_KEY, JSON.stringify(updatedWishes));
}

export function deleteWish(id: string): void {
  const wishes = getWishes();
  const filtered = wishes.filter(w => w.id !== id);
  localStorage.setItem(WISHES_KEY, JSON.stringify(filtered));
}

// Investments
export function getInvestments(): Investment[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(INVESTMENTS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveInvestment(investment: Investment): void {
  const investments = getInvestments();
  investments.push(investment);
  localStorage.setItem(INVESTMENTS_KEY, JSON.stringify(investments));
}

export function getInvestmentByWishId(wishId: string): Investment | null {
  const investments = getInvestments();
  return investments.find(inv => inv.wishId === wishId) || null;
}

export function getTotalSavings(): number {
  const wishes = getWishes();
  return wishes.reduce((sum, wish) => sum + wish.price, 0);
}

export function getTotalExpectedReturns(): number {
  const investments = getInvestments();
  return investments.reduce((sum, inv) => sum + inv.expectedReturn, 0);
}

// Clear all data
export function clearAllData(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(WISHES_KEY);
  localStorage.removeItem(INVESTMENTS_KEY);
}
