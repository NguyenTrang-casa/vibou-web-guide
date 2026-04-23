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

interface DuanClientProps {
  projectBatches: Batch[];
}

export default function DuanClient({ projectBatches }: DuanClientProps) {
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {projectBatches.map((b) => (
          <div 
            key={b.id} 
            onClick={() => setSelectedBatch(b)}
            className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:border-indigo-500/30 transition-colors cursor-pointer group"
          >
            <div className="font-bold text-sm mb-1 truncate group-hover:text-indigo-400 transition-colors uppercase">{b.skuNameVi}</div>
            <div className="text-xs text-gray-500 font-mono mb-3">{b.lotId}</div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-2xl font-black text-green-400">{(b.available || b.quantity || 0).toLocaleString('vi-VN')}</span>
                <span className="text-xs text-gray-500 ml-1">cây</span>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedBatch(b);
                }}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-wider transition-all">
                Xem Spec
              </button>
            </div>
          </div>
        ))}
      </div>

      <ProductModal 
        batch={selectedBatch} 
        onClose={() => setSelectedBatch(null)} 
        ctaLabel="Tư vấn lô dự án này"
        ctaHref={selectedBatch ? "https://zalo.me/0849866686" : undefined}
      />
    </>
  );
}
