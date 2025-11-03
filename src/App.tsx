import { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { AddWish } from './components/AddWish';
import { Simulation } from './components/Simulation';
import { InvestmentComplete } from './components/InvestmentComplete';
import { Wish } from './types';
import { saveWish, saveInvestment, getInvestmentByWishId, updateWish } from './lib/storage';
import { initializeGA } from './lib/analytics';

type Screen = 'dashboard' | 'add-wish' | 'simulation' | 'investment-complete';

interface SimulationData {
  wishId?: string;
  wishName: string;
  price: number;
  image: string;
}

interface InvestmentData {
  wishName: string;
  amount: number;
  period: number;
  expectedReturn: number;
}

// Google Analytics 즉시 초기화 (컴포넌트 마운트 전)
const GA_MEASUREMENT_ID = 'G-3BE18ZH7N0';
if (typeof window !== 'undefined') {
  initializeGA(GA_MEASUREMENT_ID);
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard');
  const [simulationData, setSimulationData] = useState<SimulationData | null>(null);
  const [investmentData, setInvestmentData] = useState<InvestmentData | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAddWish = () => {
    setCurrentScreen('add-wish');
  };

  const handleAddWishSubmit = (name: string, price: number, image: string) => {
    setSimulationData({ wishName: name, price, image });
    setCurrentScreen('simulation');
  };

  const handleSelectWish = (wish: Wish) => {
    // If the wish is already invested, show the investment complete screen
    if (wish.isInvested) {
      const investment = getInvestmentByWishId(wish.id);
      if (investment) {
        setInvestmentData({
          wishName: wish.name,
          amount: investment.amount,
          period: investment.period,
          expectedReturn: investment.expectedReturn,
        });
        setCurrentScreen('investment-complete');
        return;
      }
    }
    
    // Otherwise, show the simulation screen
    setSimulationData({ wishId: wish.id, wishName: wish.name, price: wish.price, image: wish.image });
    setCurrentScreen('simulation');
  };

  const handleSaveWish = () => {
    if (!simulationData) return;
    
    const wish: Wish = {
      id: Date.now().toString(),
      name: simulationData.wishName,
      price: simulationData.price,
      image: simulationData.image,
      createdAt: new Date().toISOString(),
      isInvested: false,
    };
    
    saveWish(wish);
    setRefreshKey(prev => prev + 1);
    setCurrentScreen('dashboard');
  };

  const handleInvest = (period: number, expectedReturn: number) => {
    if (!simulationData) return;

    let wishId: string;

    // If this is an existing wish, update it to mark as invested
    if (simulationData.wishId) {
      wishId = simulationData.wishId;
      updateWish(wishId, { isInvested: true });
    } else {
      // Otherwise, create a new wish
      const wish: Wish = {
        id: Date.now().toString(),
        name: simulationData.wishName,
        price: simulationData.price,
        image: simulationData.image,
        createdAt: new Date().toISOString(),
        isInvested: true,
      };
      wishId = wish.id;
      saveWish(wish);
    }

    const investment = {
      id: Date.now().toString(),
      wishId: wishId,
      amount: simulationData.price,
      period,
      expectedReturn,
      date: new Date().toISOString(),
    };
    
    saveInvestment(investment);

    setInvestmentData({
      wishName: simulationData.wishName,
      amount: simulationData.price,
      period,
      expectedReturn,
    });

    setRefreshKey(prev => prev + 1);
    setCurrentScreen('investment-complete');
  };

  const handleBackToDashboard = () => {
    setCurrentScreen('dashboard');
    setSimulationData(null);
    setInvestmentData(null);
  };

  return (
    <div className="min-h-screen">
      {currentScreen === 'dashboard' && (
        <Dashboard
          key={refreshKey}
          onAddWish={handleAddWish}
          onSelectWish={handleSelectWish}
        />
      )}

      {currentScreen === 'add-wish' && (
        <AddWish
          onBack={handleBackToDashboard}
          onSubmit={handleAddWishSubmit}
        />
      )}

      {currentScreen === 'simulation' && simulationData && (
        <Simulation
          wishName={simulationData.wishName}
          price={simulationData.price}
          wishImage={simulationData.image}
          onBack={() => setCurrentScreen('add-wish')}
          onSaveWish={handleSaveWish}
          onInvest={handleInvest}
        />
      )}

      {currentScreen === 'investment-complete' && investmentData && (
        <InvestmentComplete
          wishName={investmentData.wishName}
          amount={investmentData.amount}
          period={investmentData.period}
          expectedReturn={investmentData.expectedReturn}
          onBackToDashboard={handleBackToDashboard}
        />
      )}
    </div>
  );
}
