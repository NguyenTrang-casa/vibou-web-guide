import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export const revalidate = 300;

const ERP_URL = 'https://vibou-erp.vercel.app';

// Map dongGiay → Ảnh
const IMAGE_MAP: Record<string, string> = {
  'Thái': 'thai.webp',
  'Lửa': 'fire.webp',
  'Đổi màu': 'chameleon.webp',
  'Cẩm thạch': 'marble.webp',
  'Cao bồi': 'cowboy.webp',
  'Mỹ lá nhỏ': 'sakura.webp',
  'Mỹ lá lớn': 'native.webp',
  'Murayama': 'murayama.webp',
};

function getImage(dongGiay: string | null): string {
  if (!dongGiay) return 'nursery.webp';
  return IMAGE_MAP[dongGiay] || 'nursery.webp';
}

async function getProducts() {
  try {
    const res = await fetch(`${ERP_URL}/api/public/batches`, {
      next: { revalidate: 300 }
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
          <span className="text-[10px] text-gray-400 tracking-widest mt-1">ĐẠI LÝ & SỈ — Dữ liệu thật từ ERP</span>
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

      {/* Danh sách sản phẩm theo nhóm */}
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
                <span className="text-xs text-gray-400">{(items as any[]).length} lô · {(items as any[]).reduce((s: number, b: any) => s + (b.available || 0), 0).toLocaleString('vi-VN')} cây</span>
              </div>
            </div>

            {/* Các lô trong nhóm */}
            <div className="divide-y divide-white/5">
              {(items as any[]).map((batch: any) => (
                <div key={batch.id} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-white text-sm truncate">{batch.skuNameVi}</div>
                    <div className="text-xs text-gray-500 font-mono mt-1">{batch.lotId}</div>
                  </div>
                  <div className="flex items-center gap-6 shrink-0">
                    <div className="text-right">
                      <div className="font-bold text-green-400 text-sm">{(batch.available || batch.quantity || 0).toLocaleString('vi-VN')}</div>
                      <div className="text-[9px] text-gray-500 uppercase">Tồn kho</div>
                    </div>
                    <div className="text-right w-24">
                      <div className="text-yellow-400 font-bold text-sm blur-sm select-none">45,000 ₫</div>
                      <div className="text-[9px] text-gray-500 uppercase">Giá sỉ</div>
                    </div>
                    {/* CTA Button */}
                    <a href={`https://zalo.me/vibou?text=Tôi muốn báo giá: ${batch.skuNameVi} (${batch.lotId})`}
                       target="_blank" rel="noreferrer"
                       className="bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold px-3 py-2 rounded-full uppercase tracking-wider transition-all hover:-translate-y-0.5 whitespace-nowrap">
                      Báo giá
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Zalo CTA cố định */}
      <div className="fixed bottom-6 right-6 z-50">
        <a href="https://zalo.me/vibou" target="_blank" rel="noreferrer"
           className="bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-500/40 rounded-full px-6 py-4 font-bold flex items-center gap-3 transition-transform hover:-translate-y-2 border border-blue-400/50">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
          <span className="uppercase tracking-wider text-sm">Zalo Yêu Cầu Báo Giá</span>
        </a>
      </div>
    </div>
  );
}
