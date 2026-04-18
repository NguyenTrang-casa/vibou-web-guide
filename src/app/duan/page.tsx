import React from 'react';
import Link from 'next/link';

export default function DuanPage() {
  return (
    <div className="min-h-screen bg-[#0b1326] text-white p-8">
      <Link href="/" className="text-indigo-400 font-bold">&larr; Trở về Home</Link>
      <h1 className="text-4xl font-bold mt-8">Nhóm Dự Án (Project)</h1>
      <p className="mt-4 text-gray-400">Đang khởi tạo thư viện cảnh quan dự án nghỉ dưỡng & dân dụng. Vui lòng quay lại sau.</p>
    </div>
  );
}
