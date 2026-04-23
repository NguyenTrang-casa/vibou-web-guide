'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import ProductModal from '@/components/shared/ProductModal';

interface Batch {
  id: string;
  lotId: string;
  skuNameVi: string;
  dongGiay: string | null;
  mauSac?: string | null;
  quantity: number;
  available: number;
  publicNote?: string;
  status?: string;
  coverImageUrl?: string;
  expectedExportDate?: string;
}

// Map dongGiay → Ảnh đại diện (khớp với dữ liệu ERP + ảnh tham chiếu thực tế)
const IMAGE_MAP: Record<string, string> = {
  'Thái': 'thai.webp',
  'Lửa': 'fire.webp',
  'Đổi màu': 'goldensunshine.jpg',
  'Cẩm thạch': 'marble.webp',
  'Cẩm thạch lá trung': 'camthachlatrung.jpg',
  'Cao bồi': 'caoboilem.jpg',
  'Mỹ lá nhỏ': 'mylanho.jpg',
  'Mỹ lá lớn': 'mylalon.jpg',
  'Dưa hấu': 'duahau.jpg',
  'Murayama': 'murayama.webp',
  'Sakura': 'sakura.webp',
  'Tím tuyết': 'snow.webp',
  'Rượu vang': 'ruouvang.webp',
  'Socola': 'socola.webp',
  'Hồng gân': 'nursery.webp',
};

function getImage(dongGiay: string | null): string {
  if (!dongGiay) return 'nursery.webp';
  return IMAGE_MAP[dongGiay] || 'nursery.webp';
}

interface WholesaleClientProps {
  grouped: Record<string, Batch[]>;
}

export default function WholesaleClient({ grouped }: WholesaleClientProps) {
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 sm:px-8 space-y-6">
        {Object.entries(grouped).map(([dongGiay, items]) => (
          <div key={dongGiay} className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
            {/* Header nhóm */}
            <div className="flex items-center gap-4 p-4 bg-white/5 border-b border-white/10">
              <div className="w-12 h-12 rounded-xl overflow-hidden relative border border-white/20 shrink-0">
                <Image src={`/img/${getImage(dongGiay)}`} fill className="object-cover" alt={dongGiay} sizes="48px" />
              </div>
              <div>
                <h2 className="font-black text-lg uppercase tracking-wider">{dongGiay}</h2>
                <span className="text-xs text-gray-400">
                  {items.length} lô · {items.reduce((s, b) => s + (b.available || 0), 0).toLocaleString('vi-VN')} cây
                </span>
              </div>
            </div>

            {/* Các lô trong nhóm */}
            <div className="divide-y divide-white/5">
              {items.map((batch) => (
                <div 
                  key={batch.id} 
                  onClick={() => setSelectedBatch(batch)}
                  className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors cursor-pointer group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-white text-sm truncate group-hover:text-blue-400 transition-colors uppercase">{batch.skuNameVi}</div>
                    <div className="text-xs text-gray-500 font-mono mt-1 flex items-center gap-2">
                       {batch.lotId} 
                       <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-gray-400">Xem chi tiết</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 shrink-0">
                    <div className="text-right">
                      <div className="font-bold text-green-400 text-sm">{(batch.available || batch.quantity || 0).toLocaleString('vi-VN')}</div>
                      <div className="text-[9px] text-gray-500 uppercase">Tồn kho</div>
                    </div>
                    <div className="text-right w-24 hidden sm:block">
                      <div className="text-yellow-400 font-bold text-sm blur-sm select-none">45,000 ₫</div>
                      <div className="text-[9px] text-gray-500 uppercase">Giá sỉ</div>
                    </div>
                    {/* CTA Button */}
                    <button 
                       onClick={(e) => {
                         e.stopPropagation();
                         window.open(`https://zalo.me/vibou?text=Tôi muốn báo giá: ${batch.skuNameVi} (${batch.lotId})`, '_blank');
                       }}
                       className="bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-wider transition-all hover:-translate-y-0.5 whitespace-nowrap">
                      Hỏi giá
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <ProductModal 
        batch={selectedBatch} 
        onClose={() => setSelectedBatch(null)} 
        ctaLabel="Hỏi giá sỉ lô này"
        onCtaClick={(b) => window.open(`https://zalo.me/vibou?text=Tôi muốn báo giá lô này: ${b.skuNameVi} (${b.lotId})`, '_blank')}
      />
    </>
  );
}
