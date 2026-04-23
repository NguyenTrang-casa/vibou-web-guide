import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import WholesaleClient from './WholesaleClient';

export const revalidate = 0;

const ERP_URL = 'https://vibou-erp.vercel.app';



async function getProducts() {
  try {
    const res = await fetch(`${ERP_URL}/api/public/batches`, {
      cache: 'no-store'
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.batches || [];
  } catch (err) {
    console.error('Lỗi kết nối ERP:', err);
    return [];
  }
}

export default async function WholesalePage() {
  const batches = await getProducts();

  // Gom nhóm theo dòng giấy để hiển thị gọn
  const grouped = batches.reduce((acc: Record<string, any[]>, b: any) => {
    const key = b.dongGiay || 'Khác';
    if (!acc[key]) acc[key] = [];
    acc[key].push(b);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#0b1326] text-white font-sans pb-32">
      {/* Nav */}
      <nav className="flex items-center justify-between p-4 sm:p-8 max-w-6xl mx-auto">
        <Link href="/" className="p-2 border border-white/20 rounded-xl hover:bg-white/10 transition-colors">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </Link>
        <div className="flex flex-col items-center">
          <Image src="/img/logo.webp" width={80} height={80} alt="VIBOU" className="mb-1" />
          <span className="text-[10px] text-gray-400 tracking-widest mt-1 uppercase">Đại lý & Sỉ — Dữ liệu vườn thực tế</span>
        </div>
        <div className="w-10"></div>
      </nav>

      {/* Thống kê nhanh */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 mb-8">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
            <div className="text-3xl font-black text-blue-400">{batches.length}</div>
            <div className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Lô hàng</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
            <div className="text-3xl font-black text-green-400">{batches.reduce((s: number, b: any) => s + (b.available || 0), 0).toLocaleString('vi-VN')}</div>
            <div className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Cây sẵn sàng</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
            <div className="text-3xl font-black text-yellow-400">{Object.keys(grouped).length}</div>
            <div className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Dòng giống</div>
          </div>
        </div>
      </div>

      <WholesaleClient grouped={grouped} />

      {/* Zalo CTA cố định */}
      <div className="fixed bottom-6 right-6 z-[60]">
        <a href="https://zalo.me/vibou" target="_blank" rel="noreferrer"
           className="bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-500/40 rounded-full px-6 py-4 font-black flex items-center gap-3 transition-transform hover:-translate-y-2 border border-blue-400/50">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
          <span className="uppercase tracking-wider text-xs">Liên hệ VIBOU</span>
        </a>
      </div>
    </div>
  );
}
