import { useEffect } from 'react';
import { WishvestEvents } from '../lib/analytics';
import svgPaths from '../imports/svg-moyr54sz5y';

interface InvestmentCompleteProps {
  wishName: string;
  amount: number;
  period: number;
  expectedReturn: number;
  onBackToDashboard: () => void;
}

export function InvestmentComplete({ 
  wishName, 
  amount, 
  period, 
  expectedReturn,
  onBackToDashboard 
}: InvestmentCompleteProps) {
  const finalAmount = amount + expectedReturn;
  const returnRate = ((expectedReturn / amount) * 100).toFixed(1);

  // 투자 완료 페이지 진입 이벤트
  useEffect(() => {
    WishvestEvents.viewInvestmentComplete(amount, expectedReturn);
  }, []);

  return (
    <div className="bg-white relative min-h-screen flex items-center justify-center">
      {/* Mobile Navigation */}
      <div className="absolute top-0 left-0 right-0 content-stretch flex flex-col items-start w-full">
        <div className="content-stretch flex flex-col items-start relative shrink-0 w-full max-w-[375px] mx-auto">
          <div className="bg-white content-stretch flex flex-col items-start relative shrink-0 w-full">
            <div className="content-stretch flex flex-col h-[88px] items-start overflow-clip relative shrink-0 w-full">
              <div className="basis-0 content-stretch flex flex-col gap-[12px] grow items-center justify-center min-h-px min-w-px relative shrink-0 w-full">
                <div className="relative shrink-0 w-full">
                  <div className="flex flex-row items-center size-full">
                    <div className="box-border content-stretch flex items-center justify-between pb-[6px] pl-[23px] pr-[15px] pt-[12px] relative w-full h-[40px]">
                    </div>
                  </div>
                </div>
                <div className="relative shrink-0 w-full">
                  <div className="flex flex-row items-center size-full">
                    <div className="box-border content-stretch flex items-center justify-center pb-[12px] px-[20px] pt-0 relative w-full">
                      <div className="font-['Toss_Product_Sans_OTF:Bold',sans-serif] leading-[31px] not-italic text-[#191f28] text-[22px]">
                        투자 완료
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[375px] mx-auto w-full px-[20px] py-[120px]">
        {/* Success Icon */}
        <div className="text-center mb-[40px]">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[rgba(49,131,246,0.09)] rounded-full mb-4">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="#3183F6" strokeWidth="2" fill="none" />
              <path d="M8 12L11 15L16 9" stroke="#3183F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="font-['Toss_Product_Sans_OTF:Bold',sans-serif] leading-[31px] not-italic text-[#191f28] text-[22px] mb-2">
            투자 완료!
          </div>
          <p className="font-['Toss_Product_Sans_OTF:Regular',sans-serif] leading-[22.5px] not-italic text-[#6b7684] text-[15px]">
            당신의 소비가 투자로 바뀌었어요
          </p>
        </div>

        {/* Investment Details */}
        <div className="bg-white border border-[rgba(2,32,71,0.05)] rounded-[20px] p-[24px] mb-[16px]">
          <div className="mb-[16px]">
            <p className="font-['Toss_Product_Sans_OTF:Regular',sans-serif] text-[#8b95a1] text-[13px] mb-1">투자 상품</p>
            <p className="font-['Toss_Product_Sans_OTF:Bold',sans-serif] text-[#191f28] text-[17px]">{wishName}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[rgba(2,32,71,0.05)]">
            <div>
              <p className="font-['Toss_Product_Sans_OTF:Regular',sans-serif] text-[#8b95a1] text-[13px] mb-1">투자 금액</p>
              <p className="font-['Toss_Product_Sans_OTF:Bold',sans-serif] text-[#3183f6] text-[17px]">₩{amount.toLocaleString()}</p>
            </div>
            <div>
              <p className="font-['Toss_Product_Sans_OTF:Regular',sans-serif] text-[#8b95a1] text-[13px] mb-1">투자 기간</p>
              <p className="font-['Toss_Product_Sans_OTF:Bold',sans-serif] text-[#191f28] text-[17px]">{period}년</p>
            </div>
          </div>
        </div>

        {/* Expected Returns */}
        <div className="bg-[rgba(49,131,246,0.09)] rounded-[20px] p-[24px] mb-[16px]">
          <p className="font-['Toss_Product_Sans_OTF:Semibold',sans-serif] text-[#191f28] text-[15px] mb-4">예상 수익</p>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-['Toss_Product_Sans_OTF:Regular',sans-serif] text-[#4e5968] text-[15px]">투자 금액</span>
              <span className="font-['Toss_Product_Sans_OTF:Semibold',sans-serif] text-[#191f28] text-[15px]">₩{amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-['Toss_Product_Sans_OTF:Regular',sans-serif] text-[#4e5968] text-[15px]">예상 수익</span>
              <span className="font-['Toss_Product_Sans_OTF:Bold',sans-serif] text-[#3183f6] text-[15px]">+₩{Math.round(expectedReturn).toLocaleString()}</span>
            </div>
            <div className="pt-2 border-t border-[rgba(49,131,246,0.16)] flex justify-between items-center">
              <span className="font-['Toss_Product_Sans_OTF:Semibold',sans-serif] text-[#191f28] text-[15px]">최종 예상 금액</span>
              <span className="font-['Toss_Product_Sans_OTF:Bold',sans-serif] text-[#3183f6] text-[17px]">₩{Math.round(finalAmount).toLocaleString()}</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-[rgba(49,131,246,0.16)] text-center">
            <p className="font-['Toss_Product_Sans_OTF:Regular',sans-serif] text-[#4e5968] text-[13px] mb-1">예상 수익률</p>
            <p className="font-['Toss_Product_Sans_OTF:Bold',sans-serif] text-[#3183f6] text-[24px]">+{returnRate}%</p>
          </div>
        </div>

        {/* Message */}
        <div className="bg-[rgba(49,131,246,0.05)] border border-[rgba(49,131,246,0.1)] rounded-[20px] p-[20px] mb-[24px]">
          <p className="font-['Toss_Product_Sans_OTF:Semibold',sans-serif] text-[#3183f6] text-[15px] text-center">
            🎉 축하합니다!<br />
            충동구매를 참고 현명한 투자를 선택하셨어요
          </p>
        </div>

        {/* Survey Button */}
        <a 
          href="https://docs.google.com/forms/d/e/1FAIpQLSfgvbuuWbzv6OtN641VqmzJ5QGV0bom-Gvaz0WIQuAJfagVrQ/viewform?usp=header"
          target="_blank"
          rel="noopener noreferrer"
          className="block mb-[12px]"
        >
          <div className="basis-0 bg-[#3182f6] grow h-[56px] min-h-px min-w-px relative rounded-[16px] shrink-0 cursor-pointer hover:bg-[#2b72d6]">
            <div className="flex flex-row items-center justify-center size-full">
              <div className="box-border content-stretch flex gap-[8px] h-[56px] items-center justify-center px-[20px] py-0 relative w-full">
                <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
                  <div className="flex flex-col font-['Toss_Product_Sans_OTF:Semibold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[17px] text-center text-nowrap text-white">
                    <p className="leading-[25.5px] whitespace-pre">설문조사하기</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </a>

        {/* Back Button */}
        <div onClick={onBackToDashboard} className="basis-0 bg-white border-2 border-[#3182f6] grow h-[56px] min-h-px min-w-px relative rounded-[16px] shrink-0 cursor-pointer hover:bg-[rgba(49,131,246,0.05)]">
          <div className="flex flex-row items-center justify-center size-full">
            <div className="box-border content-stretch flex gap-[8px] h-[56px] items-center justify-center px-[20px] py-0 relative w-full">
              <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
                <div className="flex flex-col font-['Toss_Product_Sans_OTF:Semibold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[17px] text-center text-nowrap text-[#3182f6]">
                  <p className="leading-[25.5px] whitespace-pre">대시보드로 돌아가기</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
