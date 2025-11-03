import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Wish } from '../types';
import { getWishes, getTotalSavings, getTotalExpectedReturns, clearAllData } from '../lib/storage';
import { WishvestEvents } from '../lib/analytics';
import svgPaths from '../imports/svg-3y50gqidvy';

interface DashboardProps {
  onAddWish: () => void;
  onSelectWish: (wish: Wish) => void;
}

export function Dashboard({ onAddWish, onSelectWish }: DashboardProps) {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [investedWishes, setInvestedWishes] = useState<Wish[]>([]);
  const [totalSavings, setTotalSavings] = useState(0);
  const [expectedReturns, setExpectedReturns] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setWishes(getWishes(true).slice(-3).reverse());
    const allWishes = getWishes();
    setInvestedWishes(allWishes.filter(w => w.isInvested).slice(-3).reverse());
    const savings = getTotalSavings();
    const returns = getTotalExpectedReturns();
    setTotalSavings(savings);
    setExpectedReturns(returns);
    
    // 대시보드 진입 이벤트
    WishvestEvents.viewDashboard(savings, returns);
  };

  const handleClearAll = () => {
    if (confirm('모든 데이터를 삭제하시겠습니까?')) {
      clearAllData();
      loadData();
    }
  };

  const handleWishClick = (wish: Wish) => {
    // 위시 클릭 이벤트
    WishvestEvents.clickWish(wish.name, wish.isInvested);
    onSelectWish(wish);
  };

  return (
    <div className="bg-white relative min-h-screen">
      {/* Mobile Navigation */}
      <div className="content-stretch flex flex-col items-start w-full">
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
                    <div className="box-border content-stretch flex items-center justify-between pb-[12px] pl-[20px] pr-[20px] pt-0 relative w-full">
                      <div className="font-['Toss_Product_Sans_OTF:Bold',sans-serif] leading-[31px] not-italic text-[#191f28] text-[22px]">
                        Wishvest
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
      <div className="max-w-[375px] mx-auto">
        {/* Top Section */}
        <div className="box-border content-stretch flex flex-col items-center pb-0 pt-[24px] px-[24px] relative shrink-0 w-full">
          <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
            <div className="content-stretch flex gap-[40px] items-center relative shrink-0 w-full">
              <div className="basis-0 content-stretch flex flex-col gap-[5px] grow items-start min-h-px min-w-px relative shrink-0">
                <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
                  <div className="font-['Toss_Product_Sans_OTF:Bold',sans-serif] leading-[31px] not-italic text-[#191f28] text-[22px] w-full">
                    <p className="mb-0">소비를 투자로 바꾸는</p>
                    <p>습관을 만들어보세요</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="h-[24px] shrink-0 w-full" />
        </div>

        {/* Stats Cards */}
        <div className="px-[24px] pb-[24px]">
          <div className="grid grid-cols-2 gap-[8px]">
            <div className="basis-0 bg-[rgba(49,131,246,0.09)] grow min-h-px min-w-px relative rounded-[18px] shrink-0">
              <div className="flex flex-col items-center size-full">
                <div className="box-border content-stretch flex flex-col gap-[4px] items-center p-[20px] relative w-full">
                  <p className="font-['Toss_Product_Sans_OTF:Semibold',sans-serif] leading-[22.5px] not-italic text-[#191f28] text-[15px] text-nowrap whitespace-pre">절약한 금액</p>
                  <div className="content-stretch flex gap-[2px] items-center">
                    <p className="font-['Toss_Product_Sans_OTF:Bold',sans-serif] leading-[25.5px] not-italic text-[#3183f6] text-[17px] text-nowrap whitespace-pre">₩{totalSavings.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="basis-0 bg-[rgba(49,131,246,0.09)] grow min-h-px min-w-px relative rounded-[18px] shrink-0">
              <div className="flex flex-col items-center size-full">
                <div className="box-border content-stretch flex flex-col gap-[4px] items-center p-[20px] relative w-full">
                  <p className="font-['Toss_Product_Sans_OTF:Semibold',sans-serif] leading-[22.5px] not-italic text-[#191f28] text-[15px] text-nowrap whitespace-pre">예상 수익</p>
                  <div className="content-stretch flex gap-[2px] items-center">
                    <p className="font-['Toss_Product_Sans_OTF:Bold',sans-serif] leading-[25.5px] not-italic text-[#3183f6] text-[17px] text-nowrap whitespace-pre">+₩{Math.round(expectedReturns).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* My Investments */}
        {investedWishes.length > 0 && (
          <div className="px-[24px] pb-[24px]">
            <p className="font-['Toss_Product_Sans_OTF:Bold',sans-serif] leading-[28px] not-italic text-[#333d48] text-[19px] mb-4">나의 투자</p>
            <div className="space-y-[10px]">
              {investedWishes.map((wish) => (
                <div key={wish.id} className="bg-white" onClick={() => handleWishClick(wish)}>
                  <div className="overflow-clip rounded-[inherit] size-full">
                    <div className="box-border content-stretch flex flex-col items-start px-[24px] py-[16px] relative w-full cursor-pointer hover:bg-gray-50">
                      <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full">
                        <div className="basis-0 content-stretch flex grow items-center min-h-px min-w-px relative shrink-0">
                          <div className="basis-0 content-stretch flex flex-col gap-[10px] grow items-start min-h-px min-w-px relative shrink-0">
                            <div className="content-stretch flex gap-[10px] items-center justify-center relative shrink-0 w-full">
                              <div className="basis-0 flex flex-col font-['Toss_Product_Sans_OTF:Medium',sans-serif] grow justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#4e5968] text-[17px]">
                                <p className="leading-[25.5px]">{wish.name}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="basis-0 flex flex-row grow items-center self-stretch shrink-0">
                          <div className="basis-0 content-stretch flex grow h-full items-center justify-end max-w-[140px] min-h-px min-w-px overflow-clip relative shrink-0">
                            <div className="content-stretch flex gap-[4px] items-center justify-end relative shrink-0">
                              <div className="basis-0 content-stretch flex gap-[10px] grow items-center justify-end min-h-px min-w-px relative shrink-0">
                                <div className="basis-0 flex flex-col font-['Toss_Product_Sans_OTF:Regular',sans-serif] grow justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#4e5968] text-[17px] text-right">
                                  <p className="leading-[25.5px]">₩{wish.price.toLocaleString()}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Wishes */}
        <div className="px-[24px] pb-[24px]">
          <p className="font-['Toss_Product_Sans_OTF:Bold',sans-serif] leading-[28px] not-italic text-[#333d48] text-[19px] mb-4">최근 위시</p>
          {wishes.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-[14px]">
              <p className="font-['Toss_Product_Sans_OTF:Regular',sans-serif] text-[#8b95a1] text-[15px] mb-2">아직 위시가 없어요</p>
              <p className="font-['Toss_Product_Sans_OTF:Regular',sans-serif] text-[#b0b8c1] text-[13px]">사고 싶은 물건을 추가해보세요!</p>
            </div>
          ) : (
            <div className="space-y-[10px]">
              {wishes.map((wish) => (
                <div key={wish.id} className="bg-white" onClick={() => handleWishClick(wish)}>
                  <div className="overflow-clip rounded-[inherit] size-full">
                    <div className="box-border content-stretch flex flex-col items-start px-[24px] py-[16px] relative w-full cursor-pointer hover:bg-gray-50">
                      <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full">
                        <div className="basis-0 content-stretch flex grow items-center min-h-px min-w-px relative shrink-0">
                          <div className="basis-0 content-stretch flex flex-col gap-[10px] grow items-start min-h-px min-w-px relative shrink-0">
                            <div className="content-stretch flex gap-[10px] items-center justify-center relative shrink-0 w-full">
                              <div className="basis-0 flex flex-col font-['Toss_Product_Sans_OTF:Medium',sans-serif] grow justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#4e5968] text-[17px]">
                                <p className="leading-[25.5px]">{wish.name}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="basis-0 flex flex-row grow items-center self-stretch shrink-0">
                          <div className="basis-0 content-stretch flex grow h-full items-center justify-end max-w-[140px] min-h-px min-w-px overflow-clip relative shrink-0">
                            <div className="content-stretch flex gap-[4px] items-center justify-end relative shrink-0">
                              <div className="basis-0 content-stretch flex gap-[10px] grow items-center justify-end min-h-px min-w-px relative shrink-0">
                                <div className="basis-0 flex flex-col font-['Toss_Product_Sans_OTF:Regular',sans-serif] grow justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#4e5968] text-[17px] text-right">
                                  <p className="leading-[25.5px]">₩{wish.price.toLocaleString()}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Wish Button */}
        <div className="px-[20px] pb-[20px]">
          <div onClick={onAddWish} className="basis-0 bg-[#3182f6] grow h-[56px] min-h-px min-w-px relative rounded-[16px] shrink-0 cursor-pointer hover:bg-[#2b72d6]">
            <div className="flex flex-row items-center justify-center size-full">
              <div className="box-border content-stretch flex gap-[8px] h-[56px] items-center justify-center px-[20px] py-0 relative w-full">
                <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
                  <div className="flex flex-col font-['Toss_Product_Sans_OTF:Semibold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[17px] text-center text-nowrap text-white">
                    <p className="leading-[25.5px] whitespace-pre">위시 추가하기</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Clear Data Button */}
        <div className="px-[20px] pb-[40px]">
          <button onClick={handleClearAll} className="w-full flex items-center justify-center gap-2 py-2 text-[#8b95a1] text-[13px] font-['Toss_Product_Sans_OTF:Regular',sans-serif]">
            <Trash2 className="w-4 h-4" />
            모든 데이터 삭제
          </button>
        </div>
      </div>
    </div>
  );
}
