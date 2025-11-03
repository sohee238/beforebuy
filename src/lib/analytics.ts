// Google Analytics 이벤트 트래킹 유틸리티

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

// Google Analytics 초기화 함수
export function initializeGA(measurementId: string) {
  console.log('🔧 Initializing GA with ID:', measurementId);
  
  if (typeof window === 'undefined') {
    console.warn('⚠️ Window is undefined - running on server?');
    return;
  }

  // 이미 초기화되어 있으면 스킵
  if (window.gtag) {
    console.log('✅ GA already initialized');
    return;
  }

  console.log('📦 Creating gtag function and dataLayer...');
  
  // dataLayer 초기화
  window.dataLayer = window.dataLayer || [];
  window.gtag = function() {
    window.dataLayer?.push(arguments);
  };
  
  console.log('✅ gtag function created:', typeof window.gtag);
  console.log('✅ Test gtag now: window.gtag');

  // GA 스크립트 로드
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  
  console.log('📡 Loading GA script from:', script.src);
  
  document.head.appendChild(script);

  // GA 설정
  script.onload = () => {
    console.log('✅ GA script loaded successfully');
    window.gtag!('js', new Date());
    window.gtag!('config', measurementId, {
      send_page_view: false, // 수동으로 페이지뷰 관리
      debug_mode: true, // DebugView 활성화
    });
    console.log('✅ GA configured with measurement ID:', measurementId);
    console.log('🎉 GA initialization complete! Test with: window.gtag');
    console.log('🐛 Debug mode enabled - Check GA4 DebugView');
  };

  script.onerror = (error) => {
    console.error('❌ Failed to load GA script:', error);
    console.error('This might be due to:');
    console.error('1. Ad blocker blocking the script');
    console.error('2. Network connection issues');
    console.error('3. CORS or CSP policies');
  };
}

// GA가 초기화되었는지 확인
function isGAInitialized(): boolean {
  return typeof window !== 'undefined' && typeof window.gtag === 'function';
}

// GA 이벤트 전송 함수
export function trackEvent(
  eventName: string,
  eventParams?: {
    [key: string]: any;
  }
) {
  if (isGAInitialized()) {
    window.gtag!('event', eventName, eventParams);
    // 항상 로그 출력 (디버깅용)
    console.log('📊 GA Event Sent:', eventName, eventParams);
  } else {
    console.warn('⚠️ GA not initialized - Event NOT sent:', eventName, eventParams);
  }
}

// 페이지뷰 트래킹
export function trackPageView(pagePath: string, pageTitle?: string) {
  if (isGAInitialized()) {
    window.gtag!('event', 'page_view', {
      page_path: pagePath,
      page_title: pageTitle,
    });
    console.log('📊 GA Page View:', pagePath, pageTitle);
  }
}

// Wishvest 앱 전용 이벤트들
export const WishvestEvents = {
  // 위시 추가
  addWish: (wishName: string, price: number) => {
    trackEvent('add_wish', {
      wish_name: wishName,
      price: price,
      currency: 'KRW',
    });
  },

  // 투자 시뮬레이션 조회
  viewSimulation: (wishName: string, price: number, period: number) => {
    trackEvent('view_simulation', {
      wish_name: wishName,
      price: price,
      investment_period: period,
      currency: 'KRW',
    });
  },

  // 투자 상품 선택
  selectProduct: (productName: string, returnRate: number) => {
    trackEvent('select_investment_product', {
      product_name: productName,
      return_rate: returnRate,
    });
  },

  // 투자 기간 변경
  changePeriod: (period: number) => {
    trackEvent('change_investment_period', {
      period_years: period,
    });
  },

  // 위시로 저장
  saveAsWish: (wishName: string, price: number) => {
    trackEvent('save_as_wish', {
      wish_name: wishName,
      price: price,
      currency: 'KRW',
    });
  },

  // 진짜 투자하기 (핵심 전환 이벤트)
  confirmInvestment: (
    wishName: string,
    amount: number,
    period: number,
    expectedReturn: number,
    productName?: string
  ) => {
    trackEvent('confirm_investment', {
      wish_name: wishName,
      investment_amount: amount,
      investment_period: period,
      expected_return: expectedReturn,
      product_name: productName,
      currency: 'KRW',
      value: amount, // GA4의 전자상거래 가치 추적용
    });
  },

  // 위시 클릭
  clickWish: (wishName: string, isInvested: boolean) => {
    trackEvent('click_wish', {
      wish_name: wishName,
      is_invested: isInvested,
    });
  },

  // 대시보드 진입
  viewDashboard: (totalSavings: number, totalReturns: number) => {
    trackEvent('view_dashboard', {
      total_savings: totalSavings,
      total_expected_returns: totalReturns,
      currency: 'KRW',
    });
  },

  // 투자 완료 화면 조회
  viewInvestmentComplete: (amount: number, expectedReturn: number) => {
    trackEvent('view_investment_complete', {
      investment_amount: amount,
      expected_return: expectedReturn,
      currency: 'KRW',
    });
  },
};
