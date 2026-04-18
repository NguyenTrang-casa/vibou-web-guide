import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Thêm cấu hình tái tạo cache mỗi 5 phút (300s) để giảm tải ERP (Headless ISR)
export const revalidate = 300; 

async function getCatalogueData() {
  try {
    const res = await fetch('https://vibou-erp.vercel.app/api/public/catalogue', {
      // ISR config cho fetch trực tiếp
      next: { revalidate: 300 }
    });
    if (!res.ok) return { varieties: [] };
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Lỗi khi tải dữ liệu từ ERP', err);
    return { varieties: [] };
  }
}

export default async function WholesalePage() {
  const { varieties } = await getCatalogueData();

  return (
    <div className="min-h-screen bg-[#0b1326] text-white p-4 sm:p-8 font-sans pb-32">
      <nav className="flex items-center justify-between mb-8 max-w-6xl mx-auto">
        <Link href="/" className="p-2 border border-white/20 rounded-xl hover:bg-white/10 transition-colors">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </Link>
        <div className="flex flex-col items-center">
            <h1 className="text-xl font-black tracking-[0.2em] uppercase">VIBOU SUPPLY</h1>
            <span className="text-[10px] text-gray-400 tracking-widest">ĐẠI LÝ & SỈ</span>
        </div>
        <div className="w-10"></div>
      </nav>

      {/* Cổng Báo Giá Sỉ (Mặc định bị ẩn bằng khóa Bảo Mật) */}
      <div className="max-w-4xl mx-auto mb-8 bg-blue-900/30 border border-blue-500/30 p-6 rounded-2xl flex flex-col items-center text-center">
          <h2 className="text-xl font-bold mb-2">Yêu Cầu Đăng Nhập Hệ Thống Đại Lý</h2>
          <p className="text-sm text-blue-200 mb-4 max-w-lg">
            Dữ liệu giá sỉ, chiết khấu và tồn kho chi tiết được bảo mật kết nối trực tiếp đến hệ thống ERP. Bạn cần sử dụng tài khoản Đối tác để xem các thông số này.
          </p>
          <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-full transition-all shadow-lg shadow-blue-500/20">
            Login via Supabase Auth
          </button>
      </div>

      <div className="max-w-6xl mx-auto bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-xs font-bold text-gray-400 uppercase tracking-wider">
                <th className="p-4 w-20">Ảnh</th>
                <th className="p-4">SKU / Giống</th>
                <th className="p-4 hidden md:table-cell">Đặc tính</th>
                <th className="p-4 text-center">Tồn Kho</th>
                <th className="p-4 text-right">Giá Sỉ</th>
              </tr>
            </thead>
            <tbody>
              {varieties?.map((v: any) => (
                <tr key={v.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden relative border border-white/10">
                      {v.imageFile ? (
                          <Image src={`/img/${v.imageFile}`} fill className="object-cover" alt={v.nameVi} />
                      ) : (
                          <div className="w-full h-full bg-white/10"></div>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-white mb-1">{v.nameVi}</div>
                    <div className="text-xs text-blue-400 font-mono bg-blue-900/30 px-2 py-0.5 rounded inline-block">{v.skuCode}</div>
                  </td>
                  <td className="p-4 hidden md:table-cell text-xs text-gray-400 max-w-[300px] truncate">
                    {v.descVi}
                  </td>
                  {/* Dữ liệu luôn bị khóa trên bản Cache Public */}
                  <td className="p-4 text-center">
                    <div className="blur border border-white/10 select-none opacity-50 px-2 inline-block rounded font-mono">1,000</div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="blur border border-white/10 select-none opacity-50 px-2 inline-block rounded font-mono text-yellow-500">45,000 ₫</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Nút Zalo CTA Cố Định Góc Màn Hình */}
      <div className="fixed bottom-6 right-6 z-50">
        <a href="https://zalo.me/vibou" target="_blank" rel="noreferrer" className="bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-500/40 rounded-full px-6 py-4 font-bold flex items-center gap-3 transition-transform hover:-translate-y-2 border border-blue-400/50">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
          <span className="uppercase tracking-wider text-sm">Zalo Yêu cầu báo giá</span>
        </a>
      </div>
    </div>
  );
}
