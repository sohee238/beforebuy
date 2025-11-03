// 복리 수익률 계산 (기본 5%)
export function calculateInvestmentReturn(principal: number, years: number, annualRate: number = 5): number {
  const rate = annualRate / 100;
  return principal * Math.pow(1 + rate, years);
}

// 수익금 계산
export function calculateProfit(principal: number, years: number, annualRate: number = 5): number {
  return calculateInvestmentReturn(principal, years, annualRate) - principal;
}

// 통합 계산 함수
export function calculateReturns(principal: number, years: number, annualRate: number = 5) {
  const finalAmount = Math.round(calculateInvestmentReturn(principal, years, annualRate));
  const profit = Math.round(finalAmount - principal);
  return { finalAmount, profit };
}

// 월별 데이터 생성 (그래프용)
export function generateMonthlyData(principal: number, years: number) {
  const months = years * 12;
  const monthlyRate = 0.05 / 12;
  const data = [];
  
  for (let i = 0; i <= months; i++) {
    const value = principal * Math.pow(1 + monthlyRate, i);
    data.push({
      month: i,
      value: Math.round(value),
      label: i % 12 === 0 ? `${i / 12}년` : ''
    });
  }
  
  return data;
}
