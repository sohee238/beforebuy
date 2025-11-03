import { useState, useRef } from 'react';
import { calculateReturns } from '../lib/calculations';
import { WishvestEvents } from '../lib/analytics';
import svgPaths from '../imports/svg-8ql2fpql11';

interface AddWishProps {
  onBack: () => void;
  onSubmit: (name: string, price: number, image: string) => void;
}

export function AddWish({ onBack, onSubmit }: AddWishProps) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 이미지 파일만 허용 (MIME type이 없는 HEIC/HEIF도 허용)
    const isImageFile = file.type.startsWith('image/') || 
                       file.name.match(/\.(heic|heif)$/i);
    
    if (!isImageFile) {
      alert('이미지 파일만 업로드 가능합니다');
      return;
    }

    // 이미지 압축 및 리사이즈
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      
      img.onload = () => {
        // Canvas를 사용하여 이미지 리사이즈
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // 최대 크기 설정 (400px)
        const maxSize = 400;
        let width = img.width;
        let height = img.height;
        
        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // 이미지 그리기
        ctx?.drawImage(img, 0, 0, width, height);
        
        // PNG는 투명도 유지, 나머지는 JPEG로 변환
        const isPNG = file.type === 'image/png';
        const compressedImage = isPNG 
          ? canvas.toDataURL('image/png', 0.9)
          : canvas.toDataURL('image/jpeg', 0.8);
        
        setUploadedImage(compressedImage);
      };
      
      img.onerror = () => {
        alert('이미지를 불러올 수 없습니다. 다른 이미지를 선택해주세요.');
      };
      
      img.src = reader.result as string;
    };
    
    reader.onerror = () => {
      alert('파일을 읽을 수 없습니다. 다시 시도해주세요.');
    };
    
    reader.readAsDataURL(file);
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = () => {
    if (!name || !price) {
      alert('상품명과 가격을 입력해주세요');
      return;
    }

    const priceNum = parseInt(price.replace(/,/g, ''));
    if (isNaN(priceNum) || priceNum <= 0) {
      alert('올바른 가격을 입력해주세요');
      return;
    }

    // 위시 추가 이벤트
    WishvestEvents.addWish(name, priceNum);
    onSubmit(
      name, 
      priceNum, 
      uploadedImage || ''
    );
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setPrice(value ? parseInt(value).toLocaleString() : '');
  };

  const priceNum = parseInt(price.replace(/,/g, '')) || 0;
  const oneYearReturn = calculateReturns(priceNum, 1);

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
      <div className="max-w-[375px] mx-auto">
        {/* Top Section */}
        <div className="box-border content-stretch flex flex-col items-center pb-0 pt-[24px] px-[24px] relative shrink-0 w-full">
          <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
            <div className="content-stretch flex gap-[40px] items-center relative shrink-0 w-full">
              <div className="basis-0 content-stretch flex flex-col gap-[5px] grow items-start min-h-px min-w-px relative shrink-0">
                <div className="content-stretch flex items-start relative shrink-0 w-full">
                  <div className="content-stretch flex items-center relative shrink-0">
                    <p className="font-['Toss_Product_Sans_OTF:Regular',sans-serif] leading-[19.5px] not-italic relative shrink-0 text-[#4e5968] text-[13px] text-nowrap whitespace-pre">
                      위시 추가하기
                    </p>
                  </div>
                </div>
                <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
                  <div className="font-['Toss_Product_Sans_OTF:Bold',sans-serif] leading-[31px] not-italic text-[#191f28] text-[22px] w-full">
                    <p className="mb-0">사고 싶은 물건의</p>
                    <p>정보를 입력해주세요</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="h-[24px] shrink-0 w-full" />
        </div>

        {/* Image Upload Area */}
        <div className="px-[24px] pb-[24px]">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.heic,.heif"
            onChange={handleImageUpload}
            className="hidden"
          />
          <div 
            onClick={handleImageClick}
            className="bg-[#f3f5f7] relative rounded-[20px] size-[100px] border border-[rgba(2,32,71,0.05)] cursor-pointer hover:bg-[#e8ebed] transition-colors overflow-hidden"
          >
            {uploadedImage ? (
              <img 
                src={uploadedImage} 
                alt="Uploaded preview" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-clip size-[24px]">
                <div className="absolute inset-[9.375%]">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
                    <path clipRule="evenodd" d={svgPaths.p1ef96280} fill="#B0B8C1" fillRule="evenodd" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Name Field */}
        <div className="content-stretch flex flex-col items-start w-full">
          <div className="box-border content-stretch flex flex-col gap-[10px] items-start overflow-clip px-0 py-[17px] relative shrink-0 w-full">
            <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full">
              <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full">
                <div className="relative shrink-0 w-full">
                  <div className="overflow-clip rounded-[inherit] size-full">
                    <div className="box-border content-stretch flex flex-col gap-[10px] items-start px-[24px] py-0 relative w-full">
                      <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full">
                        <p className="basis-0 font-['Toss_Product_Sans_OTF:Regular',sans-serif] grow leading-[19.5px] min-h-px min-w-px not-italic relative shrink-0 text-[#333d48] text-[13px]">상품명</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="relative shrink-0 w-full">
                  <div className="overflow-clip rounded-[inherit] size-full">
                    <div className="box-border content-stretch flex flex-col gap-[10px] items-start px-[20px] py-0 relative w-full">
                      <div className="bg-gray-50 relative rounded-[14px] shrink-0 w-full">
                        <div aria-hidden="true" className="absolute border border-[rgba(2,32,71,0.05)] border-solid inset-0 pointer-events-none rounded-[14px]" />
                        <div className="flex flex-row items-center size-full">
                          <div className="box-border content-stretch flex gap-[10px] items-center px-[17px] py-[14px] relative w-full">
                            <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px overflow-clip relative shrink-0">
                              <input
                                type="text"
                                placeholder="예: 에어팟 프로 2세대"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="font-['Toss_Product_Sans_OTF:Regular',sans-serif] leading-[25.5px] not-italic w-full bg-transparent border-none outline-none text-[#191f28] text-[17px] placeholder:text-[#8b95a1]"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="relative shrink-0 w-full">
                  <div className="overflow-clip rounded-[inherit] size-full">
                    <div className="box-border content-stretch flex flex-col gap-[10px] items-start px-[24px] py-0 relative w-full">
                      <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full">
                        <p className="basis-0 font-['Toss_Product_Sans_OTF:Regular',sans-serif] grow leading-[19.5px] min-h-px min-w-px not-italic relative shrink-0 text-[#6b7684] text-[13px]">사고 싶은 상품의 이름을 입력해주세요</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Price Field */}
        <div className="content-stretch flex flex-col items-start w-full">
          <div className="box-border content-stretch flex flex-col gap-[10px] items-start overflow-clip px-0 py-[17px] relative shrink-0 w-full">
            <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full">
              <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full">
                <div className="relative shrink-0 w-full">
                  <div className="overflow-clip rounded-[inherit] size-full">
                    <div className="box-border content-stretch flex flex-col gap-[10px] items-start px-[24px] py-0 relative w-full">
                      <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full">
                        <p className="basis-0 font-['Toss_Product_Sans_OTF:Regular',sans-serif] grow leading-[19.5px] min-h-px min-w-px not-italic relative shrink-0 text-[#333d48] text-[13px]">가격</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="relative shrink-0 w-full">
                  <div className="overflow-clip rounded-[inherit] size-full">
                    <div className="box-border content-stretch flex flex-col gap-[10px] items-start px-[20px] py-0 relative w-full">
                      <div className="bg-gray-50 relative rounded-[14px] shrink-0 w-full">
                        <div aria-hidden="true" className="absolute border border-[rgba(2,32,71,0.05)] border-solid inset-0 pointer-events-none rounded-[14px]" />
                        <div className="flex flex-row items-center size-full">
                          <div className="box-border content-stretch flex gap-[10px] items-center px-[17px] py-[14px] relative w-full">
                            <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px overflow-clip relative shrink-0">
                              <input
                                type="text"
                                placeholder="예: 350,000"
                                value={price}
                                onChange={handlePriceChange}
                                className="font-['Toss_Product_Sans_OTF:Regular',sans-serif] leading-[25.5px] not-italic w-full bg-transparent border-none outline-none text-[#191f28] text-[17px] placeholder:text-[#8b95a1]"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="relative shrink-0 w-full">
                  <div className="overflow-clip rounded-[inherit] size-full">
                    <div className="box-border content-stretch flex flex-col gap-[10px] items-start px-[24px] py-0 relative w-full">
                      <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full">
                        <p className="basis-0 font-['Toss_Product_Sans_OTF:Regular',sans-serif] grow leading-[19.5px] min-h-px min-w-px not-italic relative shrink-0 text-[#6b7684] text-[13px]">상품의 가격을 입력해주세요 (원)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Investment Preview */}
        {priceNum > 0 && (
          <div className="px-[20px] pb-[24px] pt-[20px]">
            <div className="bg-[rgba(49,131,246,0.09)] box-border content-stretch flex flex-col gap-[6px] items-center p-[20px] rounded-[20px]">
              <p className="font-['Toss_Product_Sans_OTF:Semibold',sans-serif] leading-[25.5px] not-italic text-[#191f28] text-[17px] text-nowrap whitespace-pre">사지말고 투자한다면?</p>
              <p className="font-['Toss_Product_Sans_OTF:Bold',sans-serif] leading-[19.5px] not-italic text-[#3183f6] text-[13px] text-nowrap whitespace-pre">1년후</p>
              <div className="content-stretch flex font-['Toss_Product_Sans_OTF:Bold',sans-serif] items-center leading-[40px] not-italic text-[#3183f6] text-[30px] text-nowrap whitespace-pre">
                <p>{oneYearReturn.finalAmount.toLocaleString()}</p>
                <p>원</p>
              </div>
              <div className="bg-[rgba(49,131,246,0.16)] box-border content-stretch flex gap-[10px] items-center justify-center min-h-[20px] min-w-[20px] px-[4px] py-px rounded-[4px]">
                <div className="basis-0 flex flex-col font-['Toss_Product_Sans_OTF:Semibold',sans-serif] grow justify-center leading-[0] min-h-px min-w-px not-italic text-[#1b64da] text-[12px] text-center">
                  <p className="leading-[18px]">연 5% 수익률 가정</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="fixed bottom-0 left-0 right-0 content-stretch flex flex-col items-start w-full">
          <div className="bg-white relative shrink-0 w-full max-w-[375px] mx-auto">
            <div className="flex flex-row items-center size-full">
              <div className="box-border content-stretch flex gap-[8px] items-center px-[20px] py-0 relative w-full">
                <div 
                  onClick={name && price ? handleSubmit : undefined} 
                  className={`basis-0 grow h-[56px] min-h-px min-w-px relative rounded-[16px] shrink-0 transition-colors ${
                    name && price 
                      ? 'bg-[#3182f6] cursor-pointer hover:bg-[#2b72d6]' 
                      : 'bg-[#e5e8eb] cursor-not-allowed'
                  }`}
                >
                  <div className="flex flex-row items-center justify-center size-full">
                    <div className="box-border content-stretch flex gap-[8px] h-[56px] items-center justify-center px-[20px] py-0 relative w-full">
                      <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
                        <div className={`flex flex-col font-['Toss_Product_Sans_OTF:Semibold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[17px] text-center text-nowrap ${
                          name && price ? 'text-white' : 'text-[#8b95a1]'
                        }`}>
                          <p className="leading-[25.5px] whitespace-pre">투자 시뮬레이션 보기</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white content-stretch flex flex-col items-start relative shrink-0 w-full max-w-[375px] mx-auto">
            <div className="bg-white h-[17px] shrink-0 w-full" />
          </div>
        </div>
      </div>

      {/* Spacer for fixed bottom */}
      <div className="h-[100px]" />
    </div>
  );
}
