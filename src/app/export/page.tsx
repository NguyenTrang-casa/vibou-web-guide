import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ExportCalculator from './ExportCalculator';

export const revalidate = 300;

const ERP_URL = 'https://vibou-erp.vercel.app';

async function getProducts() {
  try {
    const res = await fetch(`${ERP_URL}/api/public/batches`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.batches || [];
  } catch { return []; }
}

export default async function ExportPage() {
  const batches = await getProducts();

  return (
    <div className="min-h-screen bg-[#0b1326] text-white font-sans pb-32">
      <nav className="flex items-center justify-between p-4 sm:p-8 max-w-6xl mx-auto relative">
        <Link href="/" className="p-2 border border-white/20 rounded-xl hover:bg-white/10 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </Link>
        <div className="flex flex-col items-center">
          <Image src="/img/logo.webp" width={80} height={80} alt="VIBOU" className="mb-1" />
          <span className="text-[10px] text-gray-400 tracking-widest mt-1">EXPORT & PHYTOSANITARY</span>
        </div>
        <div id="language-switcher-target" className="sm:w-32 flex justify-end"></div>
      </nav>

      <div className="px-4 sm:px-8">
        <ExportCalculator batches={batches} />
      </div>

      {/* CTA */}
      <div className="fixed bottom-6 right-6 z-50">
        <a href="mailto:export@vibou.vn" className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-500/40 rounded-full px-6 py-4 font-bold flex items-center gap-3 transition-transform hover:-translate-y-2 border border-emerald-400/50">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          <span className="uppercase tracking-wider text-sm">Email Export Team</span>
        </a>
      </div>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-4 sm:px-8 pt-8 pb-4 border-t border-white/10">
        <p className="text-xs text-gray-500 tracking-widest uppercase text-center">VIBOU — Hoa Giấy Từ Bàn Tay Người Việt</p>
      </footer>
    </div>
  );
}
