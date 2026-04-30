import React from 'react';
import PremiumClient from './PremiumClient';

const ERP_URL = 'https://vibou-erp.vercel.app';

async function getPremiumProducts() {
  try {
    const res = await fetch(`${ERP_URL}/api/public/unique-catalogue`, {
      next: { revalidate: 60 }, // Cache 1 phút
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.products || [];
  } catch (error) {
    console.error('Fetch premium error:', error);
    return [];
  }
}

export default async function PremiumPage() {
  const products = await getPremiumProducts();

  return (
    <main className="min-h-screen bg-[#060b18]">
      <PremiumClient products={products} />
    </main>
  );
}
