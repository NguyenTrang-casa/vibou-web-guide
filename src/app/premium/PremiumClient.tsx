'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import ProductModal from '@/components/shared/ProductModal';

interface UniqueProduct {
  id: string;
  sku: string;
  name: string;
  category: string;
  description: string;
  publicPrice: number;
  locationStatus: string;
  locationLabel: string;
  gardenLabel: string;
  height: number | null;
  trunkDiameter: number | null;
  age: string | null;
  potType: string | null;
  coverImageUrl: string;
  displayImages: string[];
}

interface PremiumClientProps {
  products: UniqueProduct[];
}

export default function PremiumClient({ products }: PremiumClientProps) {
  const [selectedProduct, setSelectedProduct] = useState<UniqueProduct | null>(null);

  // Chuyển đổi UniqueProduct sang dạng Batch để dùng chung ProductModal
  const mapToBatch = (p: UniqueProduct) => {
    return {
      id: p.id,
      lotId: p.sku,
      skuNameVi: p.name,
      dongGiay: p.category,
      quantity: 1,
      available: 1,
      publicNote: p.description,
      coverImageUrl: p.coverImageUrl,
      images: p.displayImages,
      gardenLabel: p.gardenLabel,
    } as any;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 uppercase tracking-tighter">
          Hàng Độc Bản
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base font-medium">
          Những tác phẩm hoa giấy nghệ thuật, được tuyển chọn kỹ lưỡng, mang vẻ đẹp duy nhất và đẳng cấp cho không gian của bạn.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <div 
            key={product.id}
            onClick={() => setSelectedProduct(product)}
            className="group relative bg-[#0b1326] border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-yellow-500/30 transition-all duration-500 cursor-pointer shadow-2xl hover:shadow-yellow-500/5"
          >
            {/* Image Container */}
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image 
                src={product.coverImageUrl || '/img/nursery.webp'} 
                fill 
                className="object-cover group-hover:scale-110 transition-transform duration-700" 
                alt={product.name}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b1326] via-transparent to-transparent opacity-60" />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <span className="bg-yellow-500 text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                  Premium
                </span>
                <span className="bg-white/10 backdrop-blur-md text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-white/10">
                  {product.gardenLabel}
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="p-6 space-y-4">
              <div>
                <div className="text-[10px] text-yellow-500/80 font-black uppercase tracking-widest mb-1">{product.category}</div>
                <h3 className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors leading-tight">{product.name}</h3>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-2xl font-black text-white">
                  {product.publicPrice ? `${(product.publicPrice / 1000).toLocaleString('vi-VN')}Tr` : 'Liên hệ'}
                </div>
                <button className="bg-white/5 group-hover:bg-yellow-500 group-hover:text-black text-white p-3 rounded-2xl transition-all duration-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-20 bg-white/5 rounded-[3rem] border border-dashed border-white/10">
          <p className="text-gray-500 italic">Hiện tại chưa có sản phẩm độc bản nào được đăng tải. Vui lòng quay lại sau.</p>
        </div>
      )}

      <ProductModal 
        batch={selectedProduct ? mapToBatch(selectedProduct) : null} 
        onClose={() => setSelectedProduct(null)}
        ctaLabel="Tư vấn sở hữu tác phẩm"
      />
    </div>
  );
}
