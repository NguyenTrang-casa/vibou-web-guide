'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { getVarietySpec } from '@/data/varieties';

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
  images?: string[];  // Mảng ảnh từ ERP (nếu có)
}

interface ProductModalProps {
  batch: Batch | null;
  onClose: () => void;
  ctaLabel?: string;
  onCtaClick?: (batch: Batch) => void;
}

// Bảng ánh xạ ảnh gallery fallback theo dòng giống (khớp ERP + ảnh tham chiếu)
const GALLERY_MAP: Record<string, string[]> = {
  'Thái':              ['thai.webp', 'thai2.webp', 'thai3.webp'],
  'Lửa':               ['fire.webp', 'fire2.webp'],
  'Đổi màu':           ['goldensunshine.jpg'],
  'Cẩm thạch':         ['marble.webp'],
  'Cẩm thạch lá trung':['camthachlatrung.jpg'],
  'Cao bồi':           ['caoboilem.jpg'],
  'Mỹ lá nhỏ':         ['mylanho.jpg'],
  'Mỹ lá lớn':         ['mylalon.jpg'],
  'Dưa hấu':           ['duahau.jpg'],
  'Sakura':             ['sakura.webp'],
  'Tím tuyết':          ['snow.webp'],
  'Rượu vang':          ['ruouvang.webp'],
  'Socola':             ['socola.webp'],
  'Hồng gân':           ['nursery.webp'],
};

function getGalleryImages(batch: Batch): string[] {
  // 1. Ưu tiên ảnh thực tế từ ERP
  if (batch.images && batch.images.length > 0) {
    return batch.images;
  }
  // 2. Ảnh đại diện từ ERP (nếu không phải placeholder)
  const hasRealCover = batch.coverImageUrl && !batch.coverImageUrl.includes('shape_ball');
  // 3. Fallback gallery từ local
  let localGallery = (batch.dongGiay && GALLERY_MAP[batch.dongGiay]) 
    ? GALLERY_MAP[batch.dongGiay].map(f => `/img/${f}`)
    : ['/img/nursery.webp'];
    
  if (batch.skuNameVi && (batch.skuNameVi.toLowerCase().includes('moduring') || batch.skuNameVi.toLowerCase().includes('monduring'))) {
    localGallery = ['/img/moduring.jpg', ...localGallery.filter(f => !f.includes('moduring.jpg'))];
  }
  
  if (hasRealCover) {
    // Đặt ảnh ERP đầu tiên, rồi thêm local gallery
    return [batch.coverImageUrl!, ...localGallery];
  }
  return localGallery;
}

export default function ProductModal({ batch, onClose, ctaLabel, onCtaClick }: ProductModalProps) {
  const [mounted, setMounted] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [zoomActive, setZoomActive] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (batch) {
      document.body.style.overflow = 'hidden';
      setActiveImageIndex(0);
      setZoomActive(false);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [batch]);

  // Keyboard navigation
  useEffect(() => {
    if (!batch) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { zoomActive ? setZoomActive(false) : onClose(); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [batch, zoomActive, onClose]);

  if (!mounted || !batch) return null;

  const spec = getVarietySpec(batch.dongGiay);
  const gallery = getGalleryImages(batch);
  const activeImage = gallery[activeImageIndex] || gallery[0];

  // Bóc tách size chậu từ SKU
  let potSize = 'Chưa xác định';
  if (batch.skuNameVi.includes('C6')) potSize = 'C6 (Nhựa dẻo nhỏ)';
  else if (batch.skuNameVi.includes('C10')) potSize = 'C10 (Nhựa dẻo trung)';
  else if (batch.skuNameVi.includes('C12')) potSize = 'C12 (Nhựa dẻo lớn)';
  else if (batch.skuNameVi.includes('C15')) potSize = 'C15 (Bầu đất/Thùng)';

  const isGrafted = batch.skuNameVi.toLowerCase().includes('ghép');
  const erpEditUrl = `https://vibou-erp.vercel.app/batches`;

  return createPortal(
    <>
      {/* Fullscreen Zoom Overlay */}
      {zoomActive && (
        <div className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center cursor-zoom-out"
             onClick={() => setZoomActive(false)}>
          <Image src={activeImage} fill className="object-contain p-8" alt="Zoom" sizes="100vw" />
          <button onClick={() => setZoomActive(false)} 
                  className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          {/* Gallery nav in zoom mode */}
          {gallery.length > 1 && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
              {gallery.map((_, i) => (
                <button key={i} onClick={(e) => { e.stopPropagation(); setActiveImageIndex(i); }}
                        className={`w-3 h-3 rounded-full transition-all ${i === activeImageIndex ? 'bg-white scale-125' : 'bg-white/30 hover:bg-white/60'}`} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose} />

        {/* Main Modal */}
        <div className="relative w-full max-w-5xl bg-[#0b1326] border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
          
          {/* Left: Image Gallery */}
          <div className="w-full md:w-1/2 flex flex-col bg-black/30">
            {/* Main Image */}
            <div className="relative flex-1 min-h-[250px] md:min-h-[400px] group cursor-zoom-in overflow-hidden"
                 onClick={() => setZoomActive(true)}>
              <Image 
                src={activeImage} 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                alt={batch.skuNameVi}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {/* Badge */}
              <div className="absolute top-4 left-4">
                <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg ${isGrafted ? 'bg-indigo-600 text-white' : 'bg-emerald-600 text-white'}`}>
                  {isGrafted ? 'Cây Ghép' : 'Cây Nguyên Bản'}
                </span>
              </div>
              {/* Zoom hint */}
              <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full text-white/60 text-[10px] font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                Phóng to
              </div>
            </div>

            {/* Thumbnail Strip */}
            {gallery.length > 1 && (
              <div className="flex gap-1.5 p-3 bg-black/40 overflow-x-auto">
                {gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageIndex(i)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      i === activeImageIndex ? 'border-emerald-400 ring-2 ring-emerald-400/30' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} fill className="object-cover" alt={`Ảnh ${i + 1}`} sizes="64px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white leading-tight mb-1">{batch.skuNameVi}</h2>
                <p className="text-gray-500 font-mono text-xs tracking-wider uppercase">{batch.lotId}</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors shrink-0">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                <div className="text-[9px] text-gray-500 uppercase tracking-widest mb-1">Tồn kho</div>
                <div className="text-lg font-black text-emerald-400">{batch.available.toLocaleString('vi-VN')} <span className="text-[10px] font-normal text-gray-400">cây</span></div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                <div className="text-[9px] text-gray-500 uppercase tracking-widest mb-1">Quy cách</div>
                <div className="text-sm font-bold text-white">{potSize}</div>
              </div>
            </div>

            {/* Technical Specs from Master Table */}
            {spec && (
              <div className="mb-6">
                <div className="border-l-2 border-indigo-500 pl-4 py-1">
                  <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3">Thông số chuyên môn — {batch.dongGiay}</h3>
                  <div className="space-y-2.5 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="text-gray-500 text-xs w-20 shrink-0">Lá & Cành:</span>
                      <span className="text-white leading-relaxed">{spec.leafSize}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-gray-500 text-xs w-20 shrink-0">Đốt lá:</span>
                      <span className="text-white leading-relaxed">{spec.internodes}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-gray-500 text-xs w-20 shrink-0">Nở hoa:</span>
                      <span className="text-white leading-relaxed">{spec.floweringStyle}</span>
                    </div>
                    {spec.usage && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {spec.usage.map(u => (
                          <span key={u} className="text-[9px] bg-indigo-500/15 text-indigo-300 px-2 py-1 rounded-full font-bold uppercase tracking-wider">{u}</span>
                        ))}
                      </div>
                    )}
                    {/* Bảng màu hoa thực tế */}
                    {spec.colors && spec.colors.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-white/5">
                        <div className="text-[9px] text-gray-500 uppercase tracking-widest mb-2 font-bold">Bảng màu hoa</div>
                        <div className="flex flex-wrap gap-2">
                          {spec.colors.map(c => (
                            <div key={c.name} className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1.5 rounded-lg">
                              <div className="w-4 h-4 rounded-full border border-white/20 shrink-0" style={{ background: c.hex }} />
                              <span className="text-[10px] text-gray-300 font-medium">{c.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {spec.notes && (
                  <div className="bg-blue-900/20 border border-blue-500/20 rounded-xl p-3 mt-3">
                    <p className="text-xs text-blue-300 leading-relaxed italic">&quot;{spec.notes}&quot;</p>
                  </div>
                )}
              </div>
            )}

            {/* Description / Public Note from ERP */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mô tả từ vườn</h3>
                <a href={`http://localhost:3000/unique-products?search=${batch.lotId}`} target="_blank" rel="noreferrer"
                   className="flex items-center gap-1.5 text-[9px] text-yellow-400/80 hover:text-yellow-300 font-bold uppercase tracking-wider bg-yellow-500/10 hover:bg-yellow-500/20 px-3 py-1.5 rounded-full transition-colors">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  Chỉnh sửa trên ERP
                </a>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line bg-white/5 p-4 rounded-xl border border-white/5">
                {batch.publicNote || "Hiện tại vườn chưa cập nhật mô tả cụ thể cho lô hàng này. Bấm \"Chỉnh sửa trên ERP\" để thêm ghi chú và ảnh thực tế."}
              </p>
            </div>

            {/* CTAs */}
            <div className="mt-auto pt-4 flex flex-col sm:flex-row gap-3">
              <button 
                onClick={() => onCtaClick && onCtaClick(batch)}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black py-3.5 px-6 rounded-xl uppercase tracking-widest text-[10px] shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5">
                {ctaLabel || 'Yêu cầu tư vấn'}
              </button>
              <a 
                href={`https://zalo.me/vibou?text=Tôi muốn tư vấn chi tiết lô hàng: ${batch.skuNameVi} (${batch.lotId})`}
                target="_blank" rel="noreferrer"
                className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black py-3.5 px-6 rounded-xl uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2">
                Trao đổi qua Zalo
              </a>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
