import { useState, useEffect } from 'react';
import { calculateReturns } from '../lib/calculations';
import { WishvestEvents } from '../lib/analytics';
import svgPaths from '../imports/svg-moyr54sz5y';
import img1 from 'figma:asset/aa8025152ea28884023d956a0c9be52cb6000f32.png';

interface SimulationProps {
  wishName: string;
  price: number;
  wishImage: string;
  onBack: () => void;
  onSaveWish: () => void;
  onInvest: (period: number, expectedReturn: number) => void;
}

// Mock investment products
const investmentProducts = [
  { id: 1, name: 'SK하이닉스', type: '단기 성장형', returnRate: 12, icon: 'stock' },
  { id: 2, name: 'TIGER 미국S&P500', type: '장기 성장형', returnRate: 5, icon: 'etf' },
  { id: 3, name: '먼저 이자받는 정기예금', type: '안정형', returnRate: 2.4, icon: 'savings' },
];

export function Simulation({ wishName, price, wishImage, onBack, onSaveWish, onInvest }: SimulationProps) {
  const [selectedPeriod, setSelectedPeriod] = useState(3);
  const [selectedProduct, setSelectedProduct] = useState<number>(1);

  // 시뮬레이션 페이지 진입 이벤트
  useEffect(() => {
    WishvestEvents.viewSimulation(wishName, price, selectedPeriod);
  }, []);

  const selectProduct = (id: number) => {
    setSelectedProduct(id);
    const product = investmentProducts.find(p => p.id === id);
    if (product) {
      // 투자 상품 선택 이벤트
      WishvestEvents.selectProduct(product.name, product.returnRate);
    }
  };

  const handlePeriodChange = (newPeriod: number) => {
    setSelectedPeriod(newPeriod);
    // 투자 기간 변경 이벤트
    WishvestEvents.changePeriod(newPeriod);
  };

  // Get return rate from selected product
  const selectedProductData = investmentProducts.find(p => p.id === selectedProduct);
  const returnRate = selectedProductData?.returnRate || 7;

  const returns = calculateReturns(price, selectedPeriod, returnRate);
  const profitRate = ((returns.finalAmount - price) / price * 100).toFixed(1);

  const handleSaveWish = () => {
    console.log('handleSaveWish called');
    // 위시로 저장 이벤트
    WishvestEvents.saveAsWish(wishName, price);
    onSaveWish();
  };

  const handleInvest = () => {
    console.log('handleInvest called');
    // 진짜 투자하기 이벤트 (핵심 전환 이벤트)
    WishvestEvents.confirmInvestment(
      wishName,
      price,
      selectedPeriod,
      returns.profit,
      selectedProductData?.name
    );
    onInvest(selectedPeriod, returns.profit);
  };

  return (
    <div className="bg-white relative min-h-screen overflow-x-hidden">
      {/* Mobile Navigation */}
      <div className="content-stretch flex flex-col items-start w-full relative z-10">
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
                    <div className="box-border content-stretch flex items-center justify-between pb-[12px] pl-[6px] pr-[20px] pt-0 relative w-full">
                      <div className="basis-0 content-stretch flex grow items-center min-h-px min-w-px relative shrink-0">
                        <div className="basis-0 content-stretch flex grow items-center min-h-px min-w-px relative shrink-0">
                          <div className="relative shrink-0 size-[24px] cursor-pointer" onClick={onBack}>
                            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                              <g>
                                <path d={svgPaths.pd434e40} fill="#191F28" />
                              </g>
                            </svg>
                          </div>
                        </div>
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
      <div className="max-w-[375px] mx-auto pb-[200px] relative z-0">
        {/* Top Section */}
        <div className="box-border content-stretch flex flex-col items-center pb-0 pt-[24px] px-[24px] relative shrink-0 w-full">
          <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
            <div className="content-stretch flex gap-[40px] items-center relative shrink-0 w-full">
              <div className="basis-0 content-stretch flex flex-col gap-[5px] grow items-start min-h-px min-w-px relative shrink-0">
                <div className="content-stretch flex items-start relative shrink-0 w-full">
                  <div className="content-stretch flex items-center relative shrink-0">
                    <p className="font-['Toss_Product_Sans_OTF:Regular',sans-serif] leading-[19.5px] not-italic relative shrink-0 text-[#4e5968] text-[13px] text-nowrap whitespace-pre">
                      투자 시뮬레이션
                    </p>
                  </div>
                </div>
                <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
                  <div className="font-['Toss_Product_Sans_OTF:Bold',sans-serif] leading-[31px] not-italic text-[#191f28] text-[22px] w-full">
                    <p className="mb-0">{wishName}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="h-[24px] shrink-0 w-full" />
        </div>

        {/* Product Info */}
        <div className="pb-[16px] relative">
          <div className="bg-white content-stretch flex flex-col gap-[10px] items-start">
            <div className="bg-white shrink-0 w-full">
              <div className="overflow-clip rounded-[inherit] size-full">
                <div className="box-border content-stretch flex flex-col items-start px-[24px] py-[16px] relative w-full">
                  <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full">
                    {wishImage && (
                      <div className="content-stretch flex gap-[12px] items-center relative shrink-0">
                        <div className="overflow-clip relative rounded-[8px] shrink-0 size-[54px]">
                          <img 
                            src={wishImage} 
                            alt={wishName} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}
                    <div className="basis-0 content-stretch flex grow items-center min-h-px min-w-px relative shrink-0">
                      <div className="basis-0 content-stretch flex flex-col gap-[10px] grow items-start min-h-px min-w-px relative shrink-0">
                        <div className="content-stretch flex gap-[10px] items-center justify-center relative shrink-0 w-full">
                          <div className="basis-0 flex flex-col font-['Toss_Product_Sans_OTF:Medium',sans-serif] grow justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#4e5968] text-[17px]">
                            <p className="leading-[25.5px]">{wishName}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="basis-0 flex flex-row grow items-center self-stretch shrink-0">
                      <div className="basis-0 content-stretch flex grow h-full items-center justify-end max-w-[140px] min-h-px min-w-px overflow-clip relative shrink-0">
                        <div className="content-stretch flex gap-[4px] items-center justify-end relative shrink-0">
                          <div className="basis-0 content-stretch flex gap-[10px] grow items-center justify-end min-h-px min-w-px relative shrink-0">
                            <div className="basis-0 flex flex-col font-['Toss_Product_Sans_OTF:Regular',sans-serif] grow justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#4e5968] text-[17px] text-right">
                              <p className="leading-[25.5px]">₩{price.toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Investment Products Section */}
        <p className="font-['Toss_Product_Sans_OTF:Bold',sans-serif] leading-[28px] px-[20px] not-italic text-[#333d48] text-[19px] text-nowrap pb-[16px]">투자 상품</p>

        {/* Product List */}
        <div className="space-y-[10px] px-0">
          {investmentProducts.map((product) => {
            const isSelected = selectedProduct === product.id;
            return (
              <div key={product.id} className="content-stretch flex flex-col gap-[10px] items-start w-full" onClick={() => selectProduct(product.id)}>
                <div className="bg-white relative shrink-0 w-full">
                  <div className="overflow-clip rounded-[inherit] size-full">
                    <div className="box-border content-stretch flex flex-col items-start px-[24px] py-[12px] relative w-full cursor-pointer hover:bg-gray-50">
                      <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full">
                        <div className="basis-0 content-stretch flex grow items-center min-h-px min-w-px relative shrink-0">
                          <div className="flex flex-row items-center self-stretch">
                            <div className="content-stretch flex gap-[10px] h-full items-center relative shrink-0">
                              <div className="box-border content-stretch flex flex-col gap-[10px] items-start justify-center overflow-clip pl-0 pr-[16px] py-0 relative shrink-0">
                                <div className="content-stretch flex gap-[10px] items-center overflow-clip relative rounded-[4px] shrink-0">
                                  <div className="bg-white overflow-clip relative shrink-0 size-[54px]">
                                    {product.icon === 'stock' && (
                                      <div className="absolute inset-[17.04%_12.5%_12.5%_12.5%]">
                                        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 17">
                                          <g>
                                            <path clipRule="evenodd" d={svgPaths.p2dffc280} fill="#FF607E" fillRule="evenodd" opacity="0.5" />
                                            <path clipRule="evenodd" d={svgPaths.p17374b80} fill="#FF274A" fillRule="evenodd" />
                                          </g>
                                        </svg>
                                      </div>
                                    )}
                                    {product.icon === 'etf' && (
                                      <>
                                        <div className="absolute inset-[29.17%_60.46%_14.08%_8.33%]">
                                          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 14">
                                            <path d={svgPaths.p34a8ba00} fill="#00A19F" />
                                          </svg>
                                        </div>
                                        <div className="absolute inset-[8.33%_8.33%_8.37%_28.92%]">
                                          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 20">
                                            <path d={svgPaths.p37b572d0} fill="#30B5B5" />
                                          </svg>
                                        </div>
                                        <div className="absolute bottom-[60.42%] left-[13.92%] right-1/2 top-[8.33%]">
                                          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9 8">
                                            <path d={svgPaths.p1af49d80} fill="#097575" />
                                          </svg>
                                        </div>
                                      </>
                                    )}
                                    {product.icon === 'savings' && (
                                      <>
                                        <div className="absolute inset-[23.51%_8.35%_8.35%_8.34%]">
                                          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 17">
                                            <path d={svgPaths.p82a6c80} fill="#00BD6F" />
                                          </svg>
                                        </div>
                                        <div className="absolute inset-[8.28%_30.17%_74.67%_29.89%]">
                                          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 5">
                                            <path d={svgPaths.p1656f600} fill="#00A45B" />
                                          </svg>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="basis-0 content-stretch flex flex-col gap-[10px] grow items-start min-h-px min-w-px relative shrink-0">
                            <div className="content-stretch flex flex-col gap-[2px] items-start relative shrink-0 w-full">
                              <div className="bg-[rgba(49,131,246,0.16)] box-border content-stretch flex gap-[10px] items-center justify-center min-h-[18px] min-w-[18px] px-[4px] py-0 relative rounded-[4px] shrink-0">
                                <div className="basis-0 flex flex-col font-['Toss_Product_Sans_OTF:Semibold',sans-serif] grow justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#1b64da] text-[10px] text-center">
                                  <p className="leading-[15px]">연 {product.returnRate}% 예상</p>
                                </div>
                              </div>
                              <div className="content-stretch flex gap-[10px] items-center justify-center relative shrink-0 w-full">
                                <div className="basis-0 flex flex-col font-['Toss_Product_Sans_OTF:Bold',sans-serif] grow justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#4e5968] text-[17px]">
                                  <p className="leading-[25.5px]">{product.name}</p>
                                </div>
                              </div>
                              <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
                                <div className="basis-0 flex flex-col font-['Toss_Product_Sans_OTF:Regular',sans-serif] grow justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#8b95a1] text-[13px]">
                                  <p className="leading-[19.5px]">{product.type}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-row items-center self-stretch">
                          <div className="content-stretch flex h-full items-center justify-end overflow-clip relative shrink-0">
                            <div className="overflow-clip relative shrink-0 size-[24px]">
                              {isSelected && (
                                <div className="absolute bottom-[33.33%] left-1/4 right-1/4 top-[35.84%]">
                                  <div className="absolute inset-[-16.22%_-10%]">
                                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 10">
                                      <path d="M1.2 4.1L5.8 8.6L13.2 1.2" stroke="#3183F6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.4" />
                                    </svg>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Period Section */}
        <p className="font-['Toss_Product_Sans_OTF:Bold',sans-serif] leading-[28px] px-[20px] pt-[40px] not-italic text-[#333d48] text-[19px] text-nowrap pb-[16px]">투자 기간</p>

        {/* Slider */}
        <div className="content-stretch flex flex-col items-start w-full px-0">
          <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
            <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
              <div className="relative shrink-0 w-full">
                <div className="flex flex-col justify-center size-full">
                  <div className="box-border content-stretch flex flex-col gap-[10px] items-start justify-center px-[24px] py-[18.5px] relative w-full">
                    <div className="relative w-full pt-[18.5px] pb-[18.5px]">
                      {/* Track background */}
                      <div className="bg-[#e5e8eb] h-[5px] relative rounded-[2.5px] w-full">
                        {/* Active track (filled portion) */}
                        <div 
                          className="absolute left-0 top-0 h-[5px] rounded-[2.5px] transition-all duration-150"
                          style={{ width: `${((selectedPeriod - 1) / 4) * 100}%` }}
                        >
                          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 194 5">
                            <path d={svgPaths.pbbe3180} fill="#3183F6" />
                          </svg>
                        </div>
                        
                        {/* Slider thumb */}
                        <div 
                          className="absolute top-1/2 -translate-y-1/2 size-[37px] transition-all duration-150 pointer-events-none"
                          style={{ left: `calc(${((selectedPeriod - 1) / 4) * 100}% - 18.5px)` }}
                        >
                          <div className="absolute inset-[-10.81%_-21.62%_-32.43%_-21.62%]">
                            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 53 53">
                              <g filter="url(#filter0_dd_4_14980)">
                                <circle cx="26.5" cy="22.5" fill="white" r="18.5" />
                              </g>
                              <defs>
                                <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="53" id="filter0_dd_4_14980" width="53" x="0" y="0">
                                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                                  <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                                  <feOffset dy="2" />
                                  <feGaussianBlur stdDeviation="2" />
                                  <feComposite in2="hardAlpha" operator="out" />
                                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0.113725 0 0 0 0 0.227451 0 0 0 0.18 0" />
                                  <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_4_14980" />
                                  <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                                  <feOffset dy="4" />
                                  <feGaussianBlur stdDeviation="4" />
                                  <feComposite in2="hardAlpha" operator="out" />
                                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0.113725 0 0 0 0 0.227451 0 0 0 0.18 0" />
                                  <feBlend in2="effect1_dropShadow_4_14980" mode="normal" result="effect2_dropShadow_4_14980" />
                                  <feBlend in="SourceGraphic" in2="effect2_dropShadow_4_14980" mode="normal" result="shape" />
                                </filter>
                              </defs>
                            </svg>
                          </div>
                        </div>
                      </div>
                      
                      {/* Actual range input */}
                      <input
                        type="range"
                        min="1"
                        max="5"
                        step="1"
                        value={selectedPeriod}
                        onChange={(e) => handlePeriodChange(parseInt(e.target.value))}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                        style={{ margin: 0 }}
                      />
                    </div>
                    
                    {/* Period labels */}
                    <div className="flex justify-between w-full px-[2px]">
                      {[1, 2, 3, 4, 5].map((year) => (
                        <div 
                          key={year}
                          className={`font-['Toss_Product_Sans_OTF:${selectedPeriod === year ? 'Bold' : 'Regular'}',sans-serif] text-[13px] leading-[19.5px] transition-colors ${
                            selectedPeriod === year ? 'text-[#3183f6]' : 'text-[#8b95a1]'
                          }`}
                        >
                          {year}년
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="font-['Toss_Product_Sans_OTF:Bold',sans-serif] leading-[28px] px-[20px] not-italic text-[#333d48] text-[19px] pt-[40px]">
          <p className="mb-0">지금 {wishName} 사는 대신</p>
          <p>투자하면 더 큰 기회가 와요</p>
        </div>

        {/* Result Card */}
        <div className="px-[20px] pt-[24px]">
          <div className="bg-[rgba(49,131,246,0.09)] box-border content-stretch flex flex-col gap-[6px] items-center p-[20px] rounded-[20px]">
            <p className="font-['Toss_Product_Sans_OTF:Semibold',sans-serif] leading-[25.5px] not-italic text-[#191f28] text-[17px] text-nowrap whitespace-pre">{selectedPeriod}년 후 예상금액</p>
            <div className="bg-[rgba(49,131,246,0.16)] box-border content-stretch flex gap-[10px] items-center justify-center min-h-[20px] min-w-[20px] px-[4px] py-px relative rounded-[4px] shrink-0">
              <div className="basis-0 flex flex-col font-['Toss_Product_Sans_OTF:Semibold',sans-serif] grow justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#1b64da] text-[12px] text-center">
                <p className="leading-[18px]">+{profitRate}% 총 수익률 (연 {returnRate}%)</p>
              </div>
            </div>
            <div className="content-stretch flex font-['Toss_Product_Sans_OTF:Bold',sans-serif] items-center leading-[40px] not-italic text-[#3183f6] text-[30px] text-nowrap whitespace-pre">
              <p>{returns.finalAmount.toLocaleString()}</p>
              <p>원</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="px-[20px] pt-[16px]">
          <div className="content-stretch flex gap-[8px] items-center">
            <div className="basis-0 bg-[rgba(49,131,246,0.09)] grow min-h-px min-w-px relative rounded-[18px] shrink-0">
              <div className="flex flex-col items-center size-full">
                <div className="box-border content-stretch flex flex-col gap-[4px] items-center p-[20px] relative w-full">
                  <p className="font-['Toss_Product_Sans_OTF:Semibold',sans-serif] leading-[22.5px] not-italic text-[#191f28] text-[15px] text-nowrap whitespace-pre">투자금액</p>
                  <div className="content-stretch flex gap-[2px] items-center">
                    <p className="font-['Toss_Product_Sans_OTF:Bold',sans-serif] leading-[25.5px] not-italic text-[#3183f6] text-[17px] text-nowrap whitespace-pre">₩{price.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="basis-0 bg-[rgba(49,131,246,0.09)] grow min-h-px min-w-px relative rounded-[18px] shrink-0">
              <div className="flex flex-col items-center size-full">
                <div className="box-border content-stretch flex flex-col gap-[4px] items-center p-[20px] relative w-full">
                  <p className="font-['Toss_Product_Sans_OTF:Semibold',sans-serif] leading-[22.5px] not-italic text-[#191f28] text-[15px] text-nowrap whitespace-pre">예상 수익</p>
                  <div className="content-stretch flex gap-[2px] items-center">
                    <p className="font-['Toss_Product_Sans_OTF:Bold',sans-serif] leading-[25.5px] not-italic text-[#3183f6] text-[17px] text-nowrap whitespace-pre">+₩{returns.profit.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="px-[20px] pt-[16px]">
          <div className="font-['Toss_Product_Sans_OTF:Regular',sans-serif] leading-[19.5px] not-italic text-[#6b7684] text-[13px]">
            <p className="mb-0">
              <span>·</span>
              <span>실제 투자가 아닌 가상 시뮬레이션이며, 실제 투자 시 수익률, 예상금액은 차이가 있을 수 있습니다. </span>
            </p>
            <p>·예상 수익률은 이전 수익률 기반으로 계산됩니다.</p>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div 
        className="fixed bottom-0 left-0 right-0 z-[9999]"
        style={{ pointerEvents: 'auto' }}
      >
        <div className="max-w-[375px] mx-auto">
          <div className="h-[36px] w-full">
            <img alt="" className="w-full h-full object-cover" src={img1} style={{ pointerEvents: 'none' }} />
          </div>
          <div className="bg-white px-[20px] pb-[17px]">
            <div className="flex gap-[8px] items-center w-full">
              <div 
                onClick={handleSaveWish}
                className="flex-1 bg-[#f2f4f6] h-[56px] rounded-[16px] cursor-pointer hover:bg-[#e5e8eb] active:bg-[#d1d5db] flex items-center justify-center"
                style={{ WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
              >
                <p className="font-['Toss_Product_Sans_OTF:Semibold',sans-serif] leading-[25.5px] text-[#4e5968] text-[17px]" style={{ pointerEvents: 'none' }}>위시로 저장</p>
              </div>
              <div 
                onClick={handleInvest}
                className="flex-1 bg-[#3182f6] h-[56px] rounded-[16px] cursor-pointer hover:bg-[#2b72d6] active:bg-[#1d5fbd] flex items-center justify-center"
                style={{ WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
              >
                <p className="font-['Toss_Product_Sans_OTF:Semibold',sans-serif] leading-[25.5px] text-white text-[17px]" style={{ pointerEvents: 'none' }}>진짜 투자하기</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
