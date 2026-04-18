import React from 'react';
import Link from 'next/link';

export default function ExportPage() {
  return (
    <div className="min-h-screen bg-[#0b1326] text-white p-8">
      <Link href="/" className="text-emerald-400 font-bold">&larr; Trở về Home</Link>
      <h1 className="text-4xl font-bold mt-8">Cổng Xuất Khẩu (Export)</h1>
      <p className="mt-4 text-gray-400">Đang khởi tạo chức năng tính toán sức chứa cho chuẩn thùng Container. Vui lòng quay lại sau.</p>
    </div>
  );
}
