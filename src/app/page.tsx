import Link from 'next/link';
import Image from 'next/image';

export default function Gateway() {
  return (
    <div className="min-h-screen bg-[#0b1326] flex flex-col items-center justify-start py-10 px-4 sm:px-8 text-center text-white font-sans">
      <nav className="w-full flex items-center justify-center max-w-6xl mx-auto mb-12">
        <div className="flex flex-col items-center justify-center">
          <Image src="/img/logo.webp" width={120} height={120} alt="VIBOU" className="mb-2 rounded-2xl" />
        </div>
      </nav>

      <h1 className="text-5xl md:text-7xl font-black mb-6 uppercase tracking-tight leading-tight">
        Giải pháp hoa giấy<br/>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">công nghiệp hàng đầu</span>
      </h1>
      <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-20 font-light">
        Chọn thông tin phù hợp với nhu cầu để VIBOU tiết kiệm thời gian của bạn.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl mx-auto pb-20">
        <Link href="/duan" className="group rounded-3xl p-4 bg-white/5 border border-white/10 hover:bg-white/10 hover:-translate-y-2 hover:border-indigo-500/50 transition-all duration-300 text-left flex flex-col">
          <div className="h-48 md:h-64 rounded-2xl overflow-hidden mb-6 relative w-full">
            <Image src="/img/resort.webp" fill className="object-cover group-hover:scale-105 transition-transform duration-500" alt="Dự án" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b1326] to-transparent"></div>
          </div>
          <div className="px-2 pb-2 flex-1 flex flex-col">
            <span className="text-[10px] text-indigo-400 font-black uppercase tracking-widest mb-2 block">Architecture & Landscape</span>
            <h3 className="text-2xl font-black text-white uppercase mb-2">Nhóm Dự án</h3>
            <p className="text-gray-400 text-xs leading-relaxed mb-6 flex-1">Gallery phối cảnh, bảng Spec tiêu chuẩn thi công và hệ thống lọc cây lớn.</p>
            <div>
              <span className="text-[11px] font-bold text-white bg-white/10 px-4 py-2 rounded-full inline-block uppercase tracking-widest">Khám phá</span>
            </div>
          </div>
        </Link>

        <Link href="/daily" className="group rounded-3xl p-4 bg-white/5 border border-white/10 hover:bg-white/10 hover:-translate-y-2 hover:border-blue-500/50 transition-all duration-300 text-left flex flex-col relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest z-10 shadow-lg">Khuyên dùng</div>
          <div className="h-48 md:h-64 rounded-2xl overflow-hidden mb-6 relative w-full">
            <Image src="/img/nursery-scale.webp" fill className="object-cover group-hover:scale-105 transition-transform duration-500" alt="Đại lý sỉ" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b1326] to-transparent"></div>
          </div>
          <div className="px-2 pb-2 flex-1 flex flex-col">
            <span className="text-[10px] text-blue-400 font-black uppercase tracking-widest mb-2 block">Wholesale Network</span>
            <h3 className="text-2xl font-black text-white uppercase mb-2">Đại lý & Sỉ</h3>
            <p className="text-gray-400 text-xs leading-relaxed mb-6 flex-1">Theo dõi tồn kho thật, báo giá sỉ niêm yết (Đã mã hóa).</p>
            <div>
              <span className="text-[11px] font-bold text-white bg-blue-600 px-4 py-2 rounded-full inline-block uppercase tracking-widest">Xem Báo Giá</span>
            </div>
          </div>
        </Link>

        <Link href="/premium" className="group rounded-3xl p-4 bg-white/5 border border-white/10 hover:bg-white/10 hover:-translate-y-2 hover:border-yellow-500/50 transition-all duration-300 text-left flex flex-col relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-black px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest z-10 shadow-lg">Mới nhất</div>
          <div className="h-48 md:h-64 rounded-2xl overflow-hidden mb-6 relative w-full">
            <Image src="/img/unique-specimen.png" fill className="object-cover group-hover:scale-105 transition-transform duration-700" alt="Premium" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b1326] to-transparent opacity-80"></div>
            <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:opacity-40 transition-opacity">
               <span className="text-8xl font-black text-white select-none">PREMIUM</span>
            </div>
          </div>
          <div className="px-2 pb-2 flex-1 flex flex-col">
            <span className="text-[10px] text-yellow-500 font-black uppercase tracking-widest mb-2 block">Limited Editions</span>
            <h3 className="text-2xl font-black text-white uppercase mb-2">Hàng Độc Bản</h3>
            <p className="text-gray-400 text-xs leading-relaxed mb-6 flex-1">Chiêm ngưỡng các tác phẩm nghệ thuật duy nhất, được tuyển chọn đặc biệt cho các không gian đẳng cấp.</p>
            <div>
              <span className="text-[11px] font-bold text-black bg-yellow-500 px-4 py-2 rounded-full inline-block uppercase tracking-widest">Xem Bộ Sưu Tập</span>
            </div>
          </div>
        </Link>

        <Link href="/export" className="group rounded-3xl p-4 bg-white/5 border border-white/10 hover:bg-white/10 hover:-translate-y-2 hover:border-emerald-500/50 transition-all duration-300 text-left flex flex-col">
          <div className="h-48 md:h-64 rounded-2xl overflow-hidden mb-6 relative w-full">
            <Image src="/img/export-bougainvillea.png" fill className="object-cover group-hover:scale-105 transition-transform duration-500" alt="Export" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b1326] to-transparent"></div>
          </div>
          <div className="px-2 pb-2 flex-1 flex flex-col">
            <span className="text-[10px] text-emerald-400 font-black uppercase tracking-widest mb-2 block">Global Export</span>
            <h3 className="text-2xl font-black text-white uppercase mb-2">Thị trường Xuất khẩu</h3>
            <p className="text-gray-400 text-xs leading-relaxed mb-6 flex-1">Tính sức chứa Container, thông số Phytosanitary tiêu chuẩn xuất khẩu USDA.</p>
            <div>
              <span className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 bg-white/5 px-4 py-2 rounded-full inline-block uppercase tracking-widest">Bản Global</span>
            </div>
          </div>
        </Link>
      </div>

      {/* Footer */}
      <footer className="w-full max-w-6xl mx-auto pt-8 pb-4 border-t border-white/10 mt-auto">
        <p className="text-xs text-gray-500 tracking-widest uppercase text-center">VIBOU — Hoa Giấy Từ Bàn Tay Người Việt</p>
      </footer>
    </div>
  );
}
