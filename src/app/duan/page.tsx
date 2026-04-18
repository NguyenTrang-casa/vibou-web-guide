import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

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

const PROJECTS = [
  { name: 'Resort Nghỉ Dưỡng Biển', img: 'resort.webp', desc: 'Hoa giấy trưởng thành tạo hàng rào sinh thái tự nhiên, giảm 40% chi phí cảnh quan so với cây ngoại nhập.', tags: ['Hàng rào', 'Giàn leo', '500+ cây'] },
  { name: 'Biệt Thự Sân Vườn', img: 'villa.webp', desc: 'Giải pháp phủ xanh mái hiên, tường rào và lối đi với hoa giấy ghép đa sắc chịu nắng 12 tháng.', tags: ['Sân vườn', 'Ghép đa sắc', '50–200 cây'] },
  { name: 'Vườn Ươm Quy Mô Lớn', img: 'nursery-scale.webp', desc: 'Cung ứng giống đầu dòng và cây bán thành phẩm với cam kết tỷ lệ sống >95% theo hợp đồng.', tags: ['OEM', 'Giống gốc', '1000+ cây'] },
];

export default async function DuanPage() {
  const batches = await getProducts();
  // Lọc các lô lớn phù hợp dự án (>100 cây)
  const projectBatches = batches.filter((b: any) => (b.available || b.quantity || 0) >= 100);

  return (
    <div className="min-h-screen bg-[#0b1326] text-white font-sans pb-32">
      <nav className="flex items-center justify-between p-4 sm:p-8 max-w-6xl mx-auto">
        <Link href="/" className="p-2 border border-white/20 rounded-xl hover:bg-white/10 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </Link>
        <div className="flex flex-col items-center">
          <Image src="/img/logo.webp" width={80} height={80} alt="VIBOU" className="mb-1" />
          <span className="text-[10px] text-gray-400 tracking-widest mt-1">CẢNH QUAN & CÔNG TRÌNH</span>
        </div>
        <div className="w-10"></div>
      </nav>

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 mb-12">
        <div className="relative h-64 md:h-80 rounded-3xl overflow-hidden">
          <Image src="/img/resort.webp" fill className="object-cover" alt="Dự án cảnh quan" sizes="100vw" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b1326] via-[#0b1326]/60 to-transparent"></div>
          <div className="absolute bottom-8 left-8 right-8">
            <h2 className="text-3xl md:text-5xl font-black uppercase mb-2">Giải Pháp<br/>Cảnh Quan Công Trình</h2>
            <p className="text-gray-300 text-sm max-w-xl">Cung ứng hoa giấy quy mô lớn cho Resort, Khu đô thị, Biệt thự và Dự án hạ tầng xanh trên toàn quốc.</p>
          </div>
        </div>
      </div>

      {/* Portfolio Gallery */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 mb-12">
        <h3 className="text-xs text-indigo-400 font-black uppercase tracking-widest mb-6">Portfolio Ứng Dụng</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PROJECTS.map((p) => (
            <div key={p.name} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-indigo-500/50 transition-all group">
              <div className="h-48 relative">
                <Image src={`/img/${p.img}`} fill className="object-cover group-hover:scale-105 transition-transform duration-500" alt={p.name} sizes="(max-width: 768px) 100vw, 33vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b1326] to-transparent"></div>
              </div>
              <div className="p-4">
                <h4 className="font-black text-lg mb-2">{p.name}</h4>
                <p className="text-xs text-gray-400 leading-relaxed mb-4">{p.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {p.tags.map(t => (
                    <span key={t} className="text-[9px] bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-full font-bold uppercase tracking-wider">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Spec Sheet */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 mb-12">
        <h3 className="text-xs text-indigo-400 font-black uppercase tracking-widest mb-6">Tiêu Chuẩn Kỹ Thuật Cây Dự Án</h3>
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-[10px] text-gray-400 uppercase tracking-wider">
                <th className="p-4">Thông số</th>
                <th className="p-4">Size A (Nhỏ)</th>
                <th className="p-4">Size B (Trung)</th>
                <th className="p-4">Size C (Lớn)</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-white/5">
              <tr><td className="p-4 text-gray-400">Chiều cao thân</td><td className="p-4">30–50 cm</td><td className="p-4">60–100 cm</td><td className="p-4">120–200 cm</td></tr>
              <tr><td className="p-4 text-gray-400">Đường kính tán</td><td className="p-4">20–30 cm</td><td className="p-4">40–60 cm</td><td className="p-4">80–120 cm</td></tr>
              <tr><td className="p-4 text-gray-400">Loại chậu</td><td className="p-4">C6 / Nhựa dẻo</td><td className="p-4">C8 / C10</td><td className="p-4">C15 / Bầu đất</td></tr>
              <tr><td className="p-4 text-gray-400">Tuổi cây tối thiểu</td><td className="p-4">3 tháng</td><td className="p-4">6 tháng</td><td className="p-4">12+ tháng</td></tr>
              <tr><td className="p-4 text-gray-400">Cam kết tỷ lệ sống</td><td className="p-4 text-green-400 font-bold">&ge; 90%</td><td className="p-4 text-green-400 font-bold">&ge; 93%</td><td className="p-4 text-green-400 font-bold">&ge; 95%</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Tồn kho dự án lớn */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 mb-12">
        <h3 className="text-xs text-indigo-400 font-black uppercase tracking-widest mb-6">Tồn Kho Sẵn Sàng Cho Dự Án ({projectBatches.length} lô &ge; 100 cây)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {projectBatches.map((b: any) => (
            <div key={b.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:border-indigo-500/30 transition-colors">
              <div className="font-bold text-sm mb-1 truncate">{b.skuNameVi}</div>
              <div className="text-xs text-gray-500 font-mono mb-3">{b.lotId}</div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-black text-green-400">{(b.available || b.quantity || 0).toLocaleString('vi-VN')}</span>
                  <span className="text-xs text-gray-500 ml-1">cây</span>
                </div>
                <a href={`https://zalo.me/vibou?text=Dự án cần báo giá: ${b.skuNameVi} - SL: ${b.available || b.quantity}`}
                   target="_blank" rel="noreferrer"
                   className="bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold px-3 py-2 rounded-full uppercase tracking-wider">
                  Liên hệ
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="fixed bottom-6 right-6 z-50">
        <a href="https://zalo.me/vibou" target="_blank" rel="noreferrer"
           className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-500/40 rounded-full px-6 py-4 font-bold flex items-center gap-3 transition-transform hover:-translate-y-2 border border-indigo-400/50">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
          <span className="uppercase tracking-wider text-sm">Tư Vấn Dự Án</span>
        </a>
      </div>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-4 sm:px-8 pt-8 pb-4 border-t border-white/10">
        <p className="text-xs text-gray-500 tracking-widest uppercase text-center">VIBOU — Hoa Giấy Từ Bàn Tay Người Việt</p>
      </footer>
    </div>
  );
}
