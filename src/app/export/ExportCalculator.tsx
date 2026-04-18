'use client';
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';

interface Batch {
  id: string;
  lotId: string;
  skuNameVi: string;
  dongGiay: string | null;
  quantity: number;
  available: number;
}

interface Props {
  batches: Batch[];
}

type Lang = 'vi' | 'en' | 'zh' | 'ar';

const T: Record<string, Record<Lang, string>> = {
  quoteTitle:    { vi: 'Bảng Báo Giá Xuất Khẩu', en: 'Export Quotation', zh: '出口报价单', ar: 'عرض سعر التصدير' },
  selectPrompt:  { vi: 'Chọn sản phẩm từ bảng tồn kho bên dưới để bắt đầu tính giá', en: 'Select products from the inventory table below to generate a quotation', zh: '从下方库存表中选择产品以生成报价', ar: 'اختر المنتجات من جدول المخزون أدناه لإنشاء عرض أسعار' },
  inviteSelect:  { vi: '👉 Mời chọn sản phẩm từ bảng tồn kho bên dưới để ra giá ước tính', en: '👉 Select products from inventory below to get an estimated quote', zh: '👉 从下方库存中选择产品以获取估价', ar: '👉 اختر المنتجات من المخزون أدناه للحصول على تقدير' },
  total:         { vi: 'Tổng cộng', en: 'Grand Total', zh: '合计', ar: 'المجموع الكلي' },
  plants:        { vi: 'cây', en: 'plants', zh: '株', ar: 'نبتة' },
  destPort:      { vi: 'Cảng đích', en: 'Destination Port', zh: '目的港', ar: 'ميناء الوصول' },
  packing:       { vi: 'Đóng gói', en: 'Packing', zh: '包装方式', ar: 'التغليف' },
  adjustCost:    { vi: 'Điều chỉnh chi phí (USD)', en: 'Adjust Costs (USD)', zh: '调整费用 (USD)', ar: 'تعديل التكاليف (USD)' },
  prodCost:      { vi: 'Chi phí sản xuất / cây', en: 'Production cost / plant', zh: '生产成本/株', ar: 'تكلفة الإنتاج/نبتة' },
  packCost:      { vi: 'Chi phí đóng gói / cây', en: 'Packing cost / plant', zh: '包装成本/株', ar: 'تكلفة التغليف/نبتة' },
  trucking:      { vi: 'Cước xe tải (Sa Đéc → Cát Lái)', en: 'Inland trucking (Sa Dec → Cat Lai)', zh: '内陆运输 (沙沥→吉莱)', ar: 'النقل الداخلي' },
  customs:       { vi: 'Hải quan & Kiểm dịch', en: 'Customs & Phytosanitary', zh: '海关与检疫', ar: 'الجمارك والحجر الصحي' },
  localCh:       { vi: 'Local Charges (THC, Bill, Seal)', en: 'Local Charges (THC, Bill, Seal)', zh: '当地费用 (THC)', ar: 'الرسوم المحلية' },
  oceanFr:       { vi: 'Ocean Freight (Cước tàu biển)', en: 'Ocean Freight', zh: '海运费', ar: 'الشحن البحري' },
  insuran:       { vi: 'Marine Insurance (Bảo hiểm)', en: 'Marine Insurance', zh: '海运保险', ar: 'التأمين البحري' },
  exwLabel:      { vi: 'EXW — Giao tại xưởng', en: 'EXW — Ex Works', zh: 'EXW — 工厂交货', ar: 'EXW — تسليم المصنع' },
  fobLabel:      { vi: 'FOB — Giao lên tàu (Cát Lái)', en: 'FOB — Free On Board (Cat Lai)', zh: 'FOB — 船上交货 (吉莱)', ar: 'FOB — على ظهر السفينة' },
  cifLabel:      { vi: 'CIF — Giao tại cảng đích', en: 'CIF — Cost Insurance Freight', zh: 'CIF — 到岸价', ar: 'CIF — التكلفة والتأمين والشحن' },
  exwDesc:       { vi: 'Khách tự thu xếp vận chuyển từ Sa Đéc', en: 'Buyer arranges all transport from Sa Dec', zh: '买方自行安排从沙沥的运输', ar: 'يتولى المشتري ترتيب النقل من سا ديك' },
  fobDesc:       { vi: 'Giao lên tàu tại cảng Cát Lái, TP.HCM', en: 'Loaded on vessel at Cat Lai port, HCMC', zh: '在胡志明市吉莱港装船', ar: 'التحميل على السفينة في ميناء كات لاي' },
  cifDesc:       { vi: 'Bao gồm cước tàu & bảo hiểm đến cảng đích', en: 'Includes ocean freight & insurance to destination', zh: '含海运费和保险至目的港', ar: 'يشمل الشحن البحري والتأمين إلى الوجهة' },
  download:      { vi: 'Tải Bảng Báo Giá (Print / PDF)', en: 'Download Quotation (Print / PDF)', zh: '下载报价单 (打印/PDF)', ar: 'تحميل عرض الأسعار (طباعة/PDF)' },
  disclaimer:    { vi: 'Báo giá trên mang tính tham khảo. Giá chính thức sẽ được xác nhận qua hợp đồng thương mại. Tỷ giá USD áp dụng tại thời điểm xuất hóa đơn.', en: 'This quotation is for reference only. Official pricing will be confirmed via commercial contract. USD exchange rate applies at time of invoice.', zh: '以上报价仅供参考。正式价格将通过商业合同确认。美元汇率以开票时为准。', ar: 'هذا العرض للمرجعية فقط. سيتم تأكيد الأسعار الرسمية عبر العقد التجاري.' },
  inventory:     { vi: 'Tồn Kho Sẵn Sàng Xuất Khẩu', en: 'Available Inventory for Export', zh: '可出口库存', ar: 'المخزون المتاح للتصدير' },
  invHint:       { vi: 'Bấm "+ Add" để thêm sản phẩm vào bảng báo giá phía trên', en: 'Click "+ Add" to add products to the quotation above', zh: '点击 "+ Add" 将产品添加到上方报价单', ar: 'انقر "+ Add" لإضافة المنتجات إلى عرض الأسعار أعلاه' },
  variety:       { vi: 'Giống / SKU', en: 'Variety / SKU', zh: '品种 / SKU', ar: 'الصنف / SKU' },
  type:          { vi: 'Dòng', en: 'Type', zh: '类型', ar: 'النوع' },
  available:     { vi: 'Sẵn sàng', en: 'Available', zh: '可用', ar: 'متوفر' },
  add:           { vi: '+ Thêm', en: '+ Add', zh: '+ 添加', ar: '+ إضافة' },
  added:         { vi: '✓ Đã thêm', en: '✓ Added', zh: '✓ 已添加', ar: '✓ تمت الإضافة' },
  costBreak:     { vi: 'Chi tiết cấu thành chi phí', en: 'Cost Breakdown', zh: '费用明细', ar: 'تفصيل التكاليف' },
  item:          { vi: 'Khoản mục', en: 'Line Item', zh: '项目', ar: 'البند' },
  value:         { vi: 'Giá trị (USD)', en: 'Value (USD)', zh: '金额 (USD)', ar: 'القيمة (USD)' },
  heroTitle:     { vi: 'Giải Pháp Xuất Khẩu Hoa Giấy', en: 'Bougainvillea Export Solutions', zh: '三角梅出口方案', ar: 'حلول تصدير الجهنمية' },
  heroDesc:      { vi: 'Giao FOB Cát Lái — Đạt chuẩn xuất khẩu — Đóng gói tối ưu container.', en: 'FOB Ho Chi Minh City — Phytosanitary compliant — Container-ready packing.', zh: '胡志明市FOB — 符合植物检疫标准 — 适用于全球市场的集装箱即用型包装。', ar: 'تسليم FOB مدينة هوتشي منه — متوافق مع معايير الصحة النباتية — تغليف جاهز للحاويات.' },
  plantsAvail:   { vi: 'Cây Sẵn Sàng', en: 'Plants Available', zh: '可用植物', ar: 'النباتات المتاحة' },
  activeBatch:   { vi: 'Lô Sẵn Xuất', en: 'Active Batches', zh: '活动批次', ar: 'الدفعات النشطة' },
  incoterms:     { vi: 'Điều Kiện Bán', en: 'Incoterms', zh: '交货条件', ar: 'شروط الدفع' },
  portLoad:      { vi: 'Cảng Xếp', en: 'Port of Loading', zh: '装货港', ar: 'ميناء التحميل' },
  containerEst:  { vi: 'Ước Tính Sức Chứa Container', en: 'Container Loading Estimate', zh: '集装箱装载估算', ar: 'تقدير حمولة الحاوية' },
  innerDim:      { vi: 'Kích thước trong', en: 'Inner Dimensions', zh: '内部尺寸', ar: 'الأبعاد الداخلية' },
  maxLoad:       { vi: 'Tải trọng tối đa', en: 'Max Payload', zh: '最大载荷', ar: 'أقصى حمولة' },
  estCap:        { vi: 'Ước tính sức chứa', en: 'Estimated Capacity', zh: '预估容量', ar: 'السعة المقدرة' },
  contNote:      { vi: '* Ước tính dựa trên chậu C6–C10, hiệu suất 65%. Số liệu thực tế phụ thuộc kích thước cây.', en: '* Estimate based on C6-C10 pots, 65% efficiency. Actual capacity depends on plant size.', zh: '* 基于C6-C10花盆预估，空间利用率65%。 实际容量取决于植物大小。', ar: '* التقدير بناءً على أواني C6-C10 بكفاءة 65%. السعة الفعلية تعتمد على حجم النبات.' },
  phytoCheck:    { vi: 'Danh Mục Chứng Từ & Kiểm Dịch', en: 'Phytosanitary & Documentation Checklist', zh: '植物检疫及文件清单', ar: 'قائمة الوثائق والصحة النباتية' },
  reqYes:        { vi: 'Bắt Buộc', en: 'Required', zh: '必填', ar: 'مطلوب' },
  reqNo:         { vi: 'Tuỳ Thị Trường', en: 'Optional', zh: '选填', ar: 'اختياري' },
  calcHeading:   { vi: 'Bảng Tính Giá Xuất Khẩu (EXW / FOB / CIF)', en: 'Export Costing Calculator (EXW/FOB/CIF)', zh: '出口成本计算器 (EXW/FOB/CIF)', ar: 'حاسبة تكاليف التصدير' },
  docPhyto:      { vi: 'Giấy chứng nhận Kiểm dịch thực vật (Phytosanitary Certificate)', en: 'Phytosanitary Certificate', zh: '植物检疫证书', ar: 'شهادة الصحة النباتية' },
  docSoil:       { vi: 'Xử lý đất & rễ theo tiêu chuẩn ISPM 15', en: 'Soil & root treatment (ISPM 15)', zh: '符合ISPM 15标准的土壤和根部处理', ar: 'معالجة التربة والجذور' },
  docFumi:       { vi: 'Fumigation Certificate (khử trùng)', en: 'Fumigation Certificate (if required)', zh: '熏蒸证明书', ar: 'شهادة التبخير' },
  docCo:         { vi: 'Certificate of Origin (C/O)', en: 'Certificate of Origin (C/O)', zh: '原产地证明书 (C/O)', ar: 'شهادة المنشأ' },
  docInv:        { vi: 'Commercial Invoice & Packing List', en: 'Commercial Invoice & Packing List', zh: '商业发票及装箱单', ar: 'الفاتورة التجارية وقائمة التعبئة' },
  docBl:         { vi: 'Bill of Lading (B/L) — Vận đơn đường biển', en: 'Ocean Bill of Lading (B/L)', zh: '海运提单 (B/L)', ar: 'بوليصة الشحن البحرية' },
};

const COST_DEFAULTS = {
  productionCost: 2.5,
  packingCost: 0.5,
  trucking: 300,
  customs: 150,
  localCharges: 250,
  oceanFreight: 3500,
  insurance: 100,
};

const CONTAINER_SPECS = [
  { type: '20ft Dry', lengthM: 5.9, widthM: 2.35, heightM: 2.39, maxKg: 21770 },
  { type: '40ft Dry', lengthM: 12.03, widthM: 2.35, heightM: 2.39, maxKg: 26680 },
  { type: '40ft HC', lengthM: 12.03, widthM: 2.35, heightM: 2.69, maxKg: 26460 },
];

const PHYTO_CHECKLIST = [
  { itemKey: 'docPhyto', icon: '📋', required: true },
  { itemKey: 'docSoil', icon: '🌱', required: true },
  { itemKey: 'docFumi', icon: '💨', required: false },
  { itemKey: 'docCo', icon: '🏛️', required: true },
  { itemKey: 'docInv', icon: '📦', required: true },
  { itemKey: 'docBl', icon: '🚢', required: true },
];

const LANGS: { code: Lang; flag: string; name: string }[] = [
  { code: 'vi', flag: '🇻🇳', name: 'Tiếng Việt' },
  { code: 'en', flag: '🇬🇧', name: 'English' },
  { code: 'zh', flag: '🇨🇳', name: '中文' },
  { code: 'ar', flag: '🇸🇦', name: 'العربية' },
];

export default function ExportCalculator({ batches }: Props) {
  const [lang, setLang] = useState<Lang>('vi');
  const [selectedItems, setSelectedItems] = useState<{ batch: Batch; qty: number }[]>([]);
  const [costs, setCosts] = useState(COST_DEFAULTS);
  const [destPort, setDestPort] = useState('Miami / Long Beach — USA');
  const [containerType, setContainerType] = useState('Container 40ft — Carton/Pallet');
  const calcRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const t = (key: string) => T[key]?.[lang] || T[key]?.['en'] || key;
  const totalQty = selectedItems.reduce((s, i) => s + i.qty, 0);
  const hasItems = selectedItems.length > 0;

  const calc = useMemo(() => {
    const exw = totalQty * (costs.productionCost + costs.packingCost);
    const fob = exw + costs.trucking + costs.customs + costs.localCharges;
    const cif = fob + costs.oceanFreight + costs.insurance;
    return {
      exw, fob, cif,
      exwUnit: totalQty > 0 ? exw / totalQty : 0,
      fobUnit: totalQty > 0 ? fob / totalQty : 0,
      cifUnit: totalQty > 0 ? cif / totalQty : 0,
      prodTotal: totalQty * costs.productionCost,
      packTotal: totalQty * costs.packingCost,
    };
  }, [totalQty, costs]);

  const fmt = (n: number) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const fmtUnit = (n: number) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const today = new Date();
  const quoteNo = `VB-${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;
  const dateStr = today.toLocaleDateString('vi-VN');

  const addItem = (batch: Batch) => {
    if (selectedItems.find(i => i.batch.id === batch.id)) return;
    setSelectedItems(prev => [...prev, { batch, qty: batch.available || batch.quantity || 100 }]);
    setTimeout(() => calcRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  };
  const removeItem = (id: string) => setSelectedItems(prev => prev.filter(i => i.batch.id !== id));
  const updateQty = (id: string, qty: number) => setSelectedItems(prev => prev.map(i => i.batch.id === id ? { ...i, qty } : i));
  const updateCost = (key: string, val: string) => setCosts(prev => ({ ...prev, [key]: parseFloat(val) || 0 }));

  const handleDownload = () => {
    const printWindow = window.open('', '_blank', 'width=900,height=1200');
    if (!printWindow) { alert('Popup bị chặn. Vui lòng cho phép popup.'); return; }
    const varieties = selectedItems.map(i => i.batch.dongGiay || 'Mixed').filter((v, i, a) => a.indexOf(v) === i).join(', ');
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>VIBOU Quotation ${quoteNo}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Segoe UI',system-ui,sans-serif;background:#fff;color:#1a1a2e;padding:40px;max-width:800px;margin:0 auto;font-size:13px}
.hdr{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #4f46e5;padding-bottom:20px;margin-bottom:24px}
.logo{display:flex;align-items:center;gap:12px}
.logo-img{width:50px;height:50px;border-radius:10px;object-fit:cover}
.co{font-size:24px;font-weight:900}
.co-sub{font-size:10px;color:#666}
.qi{text-align:right}
.qt{font-size:20px;font-weight:900;color:#4f46e5}
.qm{font-size:10px;color:#666;margin-top:4px;line-height:1.6}
.st{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#4f46e5;margin:20px 0 10px}
.ig{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px}
.ib{border:1px solid #e5e7eb;border-radius:8px;padding:10px}
.il{font-size:9px;color:#999;text-transform:uppercase;letter-spacing:1px}
.iv{font-size:13px;font-weight:700;margin-top:3px}
.pc{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin:16px 0}
.p{border-radius:10px;padding:14px;text-align:center}
.p.exw{background:#eef2ff;border:1px solid #c7d2fe}
.p.fob{background:#ecfdf5;border:1px solid #6ee7b7}
.p.cif{background:#fef9c3;border:1px solid #fde047}
.pl{font-size:8px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px}
.p.exw .pl{color:#4f46e5}.p.fob .pl{color:#059669}.p.cif .pl{color:#b45309}
.pa{font-size:24px;font-weight:900;margin:4px 0 2px}
.pu{font-size:11px;color:#666}
.pd{font-size:8px;color:#999;margin-top:4px}
table{width:100%;border-collapse:collapse;margin:10px 0}
th{background:#f8fafc;text-align:left;padding:8px 10px;font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:#4f46e5;border-bottom:2px solid #e5e7eb}
td{padding:8px 10px;font-size:12px;border-bottom:1px solid #f1f5f9}
.tr{text-align:right}
.tot td{font-weight:800;font-size:13px;border-top:2px solid #1a1a2e;border-bottom:none}
.tot.exw td{color:#4f46e5}.tot.fob td{color:#059669}.tot.cif td{color:#b45309}
.sep{text-align:center;color:#aaa;font-size:9px;padding:4px 0;font-style:italic;border-bottom:1px dashed #e5e7eb}
.disc{background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:12px;margin:20px 0;font-size:9px;color:#92400e;line-height:1.6}
.disc strong{color:#b45309}
.ftr{display:flex;justify-content:space-between;align-items:flex-end;margin-top:24px;padding-top:14px;border-top:1px solid #e5e7eb;font-size:10px;color:#666}
.ftr-r{text-align:right;font-style:italic}
@media print{body{padding:20px}}
</style></head><body>
<div class="hdr"><div class="logo"><img src="/img/logo.webp" class="logo-img" alt="VIBOU" /><div><div class="co">VIBOU</div><div class="co-sub">Bougainvillea Export — Sa Đéc, Đồng Tháp, Việt Nam</div></div></div><div class="qi"><div class="qt">BẢNG BÁO GIÁ</div><div class="qm">Số: ${quoteNo}<br/>Ngày: ${dateStr}<br/>Hiệu lực: 30 ngày</div></div></div>
<div class="st">Thông tin lô hàng</div>
<div class="ig">
<div class="ib"><div class="il">Sản phẩm</div><div class="iv">Hoa Giấy Rễ Trần (Bare Root Bougainvillea)</div></div>
<div class="ib"><div class="il">Quy cách</div><div class="iv">Phôi cây — ${varieties}</div></div>
<div class="ib"><div class="il">Tổng số lượng</div><div class="iv">${totalQty.toLocaleString()} cây</div></div>
<div class="ib"><div class="il">Đóng gói</div><div class="iv">${containerType}</div></div>
<div class="ib"><div class="il">Xuất xứ</div><div class="iv">Sa Đéc, Đồng Tháp — Việt Nam</div></div>
<div class="ib"><div class="il">Cảng đích</div><div class="iv">${destPort}</div></div>
</div>
<div class="st">Tổng hợp giá theo điều kiện giao hàng</div>
<div class="pc">
<div class="p exw"><div class="pl">EXW — Giao tại xưởng</div><div class="pa">${fmt(calc.exw)}</div><div class="pu">${fmtUnit(calc.exwUnit)}/cây</div><div class="pd">Khách tự thu xếp vận chuyển từ Sa Đéc</div></div>
<div class="p fob"><div class="pl">FOB — Giao lên tàu</div><div class="pa">${fmt(calc.fob)}</div><div class="pu">${fmtUnit(calc.fobUnit)}/cây</div><div class="pd">Giao lên tàu tại cảng Cát Lái, TP.HCM</div></div>
<div class="p cif"><div class="pl">CIF — Giao tại cảng đích</div><div class="pa">${fmt(calc.cif)}</div><div class="pu">${fmtUnit(calc.cifUnit)}/cây</div><div class="pd">Bao gồm cước tàu & bảo hiểm</div></div>
</div>
<div class="st">Chi tiết cấu thành chi phí</div>
<table><thead><tr><th>Khoản mục</th><th></th><th class="tr">Giá trị (USD)</th></tr></thead><tbody>
<tr><td>Chi phí sản xuất phôi cây (${totalQty.toLocaleString()} cây × $${costs.productionCost})</td><td></td><td class="tr">${fmt(calc.prodTotal)}</td></tr>
<tr><td>Chi phí đóng gói (${totalQty.toLocaleString()} cây × $${costs.packingCost})</td><td></td><td class="tr">${fmt(calc.packTotal)}</td></tr>
<tr class="tot exw"><td><strong>Tổng EXW</strong></td><td></td><td class="tr">${fmt(calc.exw)}</td></tr>
<tr><td colspan="3" class="sep">— Phí nội địa & cảng xuất —</td></tr>
<tr><td>Cước xe tải nội địa (Sa Đéc → Cát Lái)</td><td></td><td class="tr">${fmt(costs.trucking)}</td></tr>
<tr><td>Phí Hải quan & Kiểm dịch thực vật</td><td></td><td class="tr">${fmt(costs.customs)}</td></tr>
<tr><td>Phụ phí cảng đi — Local Charges</td><td></td><td class="tr">${fmt(costs.localCharges)}</td></tr>
<tr class="tot fob"><td><strong>Tổng FOB</strong></td><td></td><td class="tr">${fmt(calc.fob)}</td></tr>
<tr><td colspan="3" class="sep">— Phí quốc tế —</td></tr>
<tr><td>Cước tàu biển quốc tế (Ocean Freight)</td><td></td><td class="tr">${fmt(costs.oceanFreight)}</td></tr>
<tr><td>Phí bảo hiểm hàng hóa (Marine Insurance)</td><td></td><td class="tr">${fmt(costs.insurance)}</td></tr>
<tr class="tot cif"><td><strong>Tổng CIF</strong></td><td></td><td class="tr"><strong>${fmt(calc.cif)}</strong></td></tr>
</tbody></table>
<div class="disc"><strong>⚠ Lưu ý:</strong> ${t('disclaimer')}</div>
<div class="ftr"><div><strong>VIBOU — Hoa Giấy Từ Bàn Tay Người Việt</strong><br/>📍 Sa Đéc, Đồng Tháp, Việt Nam<br/>🌐 vibou.vn | 📧 export@vibou.vn</div><div class="ftr-r"><strong>Đại diện VIBOU</strong><br/>Chữ ký & Đóng dấu</div></div>
</body></html>`;
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.onload = () => printWindow.print();
  };

  const costInputs: { label: string; key: string }[] = [
    { label: t('prodCost'), key: 'productionCost' },
    { label: t('packCost'), key: 'packingCost' },
    { label: t('trucking'), key: 'trucking' },
    { label: t('customs'), key: 'customs' },
    { label: t('localCh'), key: 'localCharges' },
    { label: t('oceanFr'), key: 'oceanFreight' },
    { label: t('insuran'), key: 'insurance' },
  ];

  const switcher = (
    <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 p-1.5 rounded-full shadow-lg">
      {LANGS.map(l => (
        <button key={l.code} onClick={() => setLang(l.code)}
          className={`text-[10px] px-3 py-1.5 rounded-full font-bold transition-all ${lang === l.code ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>
          {l.flag} {l.code.toUpperCase()}
        </button>
      ))}
    </div>
  );

  return (
    <div className="space-y-8">
      {mounted && document.getElementById('language-switcher-target') && createPortal(switcher, document.getElementById('language-switcher-target')!)}

      {/* Hero */}
      <div className="max-w-6xl mx-auto mb-12">
        <div className="relative h-64 md:h-80 rounded-3xl overflow-hidden">
          <Image src="/img/cowboy.webp" fill className="object-cover" alt="Export" sizes="100vw" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b1326] via-[#0b1326]/60 to-transparent"></div>
          <div className="absolute bottom-8 left-8 right-8">
            <h2 className="text-3xl md:text-5xl font-black uppercase mb-2">{t('heroTitle')}</h2>
            <p className="text-gray-300 text-sm max-w-xl">{t('heroDesc')}</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="max-w-6xl mx-auto mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
            <div className="text-3xl font-black text-emerald-400">{(batches.reduce((s, b) => s + (b.available || 0), 0)).toLocaleString('vi-VN')}</div>
            <div className="text-[9px] text-gray-400 uppercase tracking-widest mt-1">{t('plantsAvail')}</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
            <div className="text-3xl font-black text-emerald-400">{batches.length}</div>
            <div className="text-[9px] text-gray-400 uppercase tracking-widest mt-1">{t('activeBatch')}</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
            <div className="text-3xl font-black text-yellow-400">FOB</div>
            <div className="text-[9px] text-gray-400 uppercase tracking-widest mt-1">{t('incoterms')}</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
            <div className="text-3xl font-black text-blue-400">HCM</div>
            <div className="text-[9px] text-gray-400 uppercase tracking-widest mt-1">{t('portLoad')}</div>
          </div>
        </div>
      </div>

      {/* Container Simulator */}
      <div className="max-w-6xl mx-auto mb-12">
        <h3 className="text-xs text-emerald-400 font-black uppercase tracking-widest mb-6">{t('containerEst')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CONTAINER_SPECS.map((c) => {
            const volM3 = c.lengthM * c.widthM * c.heightM;
            const estPlants = Math.floor(volM3 / 0.003 * 0.65);
            return (
              <div key={c.type} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-emerald-500/30 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-black text-lg">{c.type}</h4>
                  <span className="text-emerald-400 text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded-full">{volM3.toFixed(0)} m³</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-400"><span>{t('innerDim')}</span><span className="text-white">{c.lengthM} × {c.widthM} × {c.heightM}m</span></div>
                  <div className="flex justify-between text-gray-400"><span>{t('maxLoad')}</span><span className="text-white">{c.maxKg.toLocaleString()} kg</span></div>
                  <div className="flex justify-between text-gray-400 border-t border-white/10 pt-2 mt-2"><span>{t('estCap')}</span><span className="text-emerald-400 font-black text-lg">~{estPlants.toLocaleString()}</span></div>
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-[10px] text-gray-500 mt-3">{t('contNote')}</p>
      </div>

      {/* Phytosanitary Checklist */}
      <div className="max-w-6xl mx-auto mb-12">
        <h3 className="text-xs text-emerald-400 font-black uppercase tracking-widest mb-6">{t('phytoCheck')}</h3>
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden divide-y divide-white/5">
          {PHYTO_CHECKLIST.map((doc) => (
            <div key={doc.itemKey} className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors">
              <span className="text-2xl">{doc.icon}</span>
              <div className="flex-1">
                <div className="font-bold text-sm">{t(doc.itemKey)}</div>
              </div>
              <span className={`text-[9px] px-3 py-1 rounded-full font-bold uppercase tracking-wider ${doc.required ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                {doc.required ? t('reqYes') : t('reqNo')}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Actual Export Calculator */}
      <div className="max-w-6xl mx-auto mb-12">
        <h3 className="text-xs text-emerald-400 font-black uppercase tracking-widest mb-6">{t('calcHeading')}</h3>

      {/* Quotation Header */}
      <div ref={calcRef} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="p-5 bg-gradient-to-r from-indigo-900/40 to-emerald-900/40 border-b border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h4 className="font-black text-lg uppercase tracking-wider">{t('quoteTitle')}</h4>
            <p className="text-xs text-gray-400 mt-1">{t('selectPrompt')}</p>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <span className="text-xs text-gray-400 font-mono tracking-wider">{quoteNo}</span>
          </div>
        </div>

        <div className="divide-y divide-white/5">
          {!hasItems && (
            <div className="p-4 bg-emerald-900/20 border-b border-emerald-500/20 text-center">
              <p className="text-sm text-emerald-300 font-bold">{t('inviteSelect')}</p>
            </div>
          )}
          {selectedItems.map(({ batch, qty }) => (
            <div key={batch.id} className="flex items-center gap-4 p-4">
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm truncate">{batch.skuNameVi}</div>
                <div className="text-[10px] text-gray-500 font-mono">{batch.lotId} · {batch.dongGiay || 'Mixed'}</div>
              </div>
              <input type="number" value={qty} min={1}
                onChange={e => updateQty(batch.id, parseInt(e.target.value) || 1)}
                className="w-24 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-right text-white font-mono text-sm focus:outline-none focus:border-emerald-500" />
              <span className="text-xs text-gray-500 w-8">{t('plants')}</span>
              <button onClick={() => removeItem(batch.id)} className="text-red-400 hover:text-red-300 text-lg font-bold p-1 leading-none">✕</button>
            </div>
          ))}
          <div className="flex items-center justify-between p-4 bg-white/5">
            <span className="font-black text-sm uppercase">{t('total')}</span>
            <span className="font-black text-lg text-emerald-400">{totalQty.toLocaleString()} {t('plants')}</span>
          </div>
        </div>
      </div>

      {/* Calculator always visible */}
        <>
          {/* Shipment fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <label className="text-[10px] text-gray-400 uppercase tracking-widest block mb-2">{t('destPort')}</label>
              <input value={destPort} onChange={e => setDestPort(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500" />
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <label className="text-[10px] text-gray-400 uppercase tracking-widest block mb-2">{t('packing')}</label>
              <select value={containerType} onChange={e => setContainerType(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500">
                <option value="Container 20ft — Carton/Pallet">Container 20ft — Carton/Pallet</option>
                <option value="Container 40ft — Carton/Pallet">Container 40ft — Carton/Pallet</option>
                <option value="Container 40ft HC — Carton/Pallet">Container 40ft HC — Carton/Pallet</option>
              </select>
            </div>
          </div>

          {/* Cost Inputs */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <h5 className="text-[10px] text-gray-400 uppercase tracking-widest mb-4">{t('adjustCost')}</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {costInputs.map(inp => (
                <div key={inp.key} className="flex items-center gap-3">
                  <label className="flex-1 text-xs text-gray-300">{inp.label}</label>
                  <input type="number" step="0.01" value={(costs as any)[inp.key]}
                    onChange={e => updateCost(inp.key, e.target.value)}
                    className="w-24 bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-right text-white font-mono text-sm focus:outline-none focus:border-emerald-500" />
                </div>
              ))}
            </div>
          </div>

          {/* Price Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-indigo-900/30 border border-indigo-500/30 rounded-2xl p-5 text-center">
              <div className="text-[9px] text-indigo-400 font-black uppercase tracking-widest">{t('exwLabel')}</div>
              <div className="text-3xl font-black text-indigo-300 mt-2">{fmt(calc.exw)}</div>
              <div className="text-sm text-gray-400 mt-1">{fmtUnit(calc.exwUnit)}/{t('plants')}</div>
              <div className="text-[9px] text-gray-500 mt-2">{t('exwDesc')}</div>
            </div>
            <div className="bg-emerald-900/30 border border-emerald-500/30 rounded-2xl p-5 text-center">
              <div className="text-[9px] text-emerald-400 font-black uppercase tracking-widest">{t('fobLabel')}</div>
              <div className="text-3xl font-black text-emerald-300 mt-2">{fmt(calc.fob)}</div>
              <div className="text-sm text-gray-400 mt-1">{fmtUnit(calc.fobUnit)}/{t('plants')}</div>
              <div className="text-[9px] text-gray-500 mt-2">{t('fobDesc')}</div>
            </div>
            <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-2xl p-5 text-center">
              <div className="text-[9px] text-yellow-400 font-black uppercase tracking-widest">{t('cifLabel')}</div>
              <div className="text-3xl font-black text-yellow-300 mt-2">{fmt(calc.cif)}</div>
              <div className="text-sm text-gray-400 mt-1">{fmtUnit(calc.cifUnit)}/{t('plants')}</div>
              <div className="text-[9px] text-gray-500 mt-2">{t('cifDesc')}</div>
            </div>
          </div>

          {/* Cost Breakdown */}
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-white/10 bg-white/5">
              <h5 className="text-[10px] text-indigo-400 uppercase tracking-widest font-black">{t('costBreak')}</h5>
            </div>
            <table className="w-full text-left text-sm">
              <thead><tr className="bg-white/5 border-b border-white/10 text-[10px] text-gray-400 uppercase tracking-wider"><th className="p-3 px-4">{t('item')}</th><th className="p-3 px-4 text-right">{t('value')}</th></tr></thead>
              <tbody className="divide-y divide-white/5">
                <tr><td className="p-3 px-4 text-gray-300">{t('prodCost')} ({totalQty.toLocaleString()} × ${costs.productionCost})</td><td className="p-3 px-4 text-right">{fmt(calc.prodTotal)}</td></tr>
                <tr><td className="p-3 px-4 text-gray-300">{t('packCost')} ({totalQty.toLocaleString()} × ${costs.packingCost})</td><td className="p-3 px-4 text-right">{fmt(calc.packTotal)}</td></tr>
                <tr className="bg-indigo-500/10"><td className="p-3 px-4 font-black">{t('exwLabel')} <span className="text-[9px] bg-indigo-500/30 text-indigo-300 px-2 py-0.5 rounded ml-2">EXW</span></td><td className="p-3 px-4 text-right font-black text-indigo-300">{fmt(calc.exw)}</td></tr>
                <tr><td className="p-3 px-4 text-gray-300">{t('trucking')}</td><td className="p-3 px-4 text-right">{fmt(costs.trucking)}</td></tr>
                <tr><td className="p-3 px-4 text-gray-300">{t('customs')}</td><td className="p-3 px-4 text-right">{fmt(costs.customs)}</td></tr>
                <tr><td className="p-3 px-4 text-gray-300">{t('localCh')}</td><td className="p-3 px-4 text-right">{fmt(costs.localCharges)}</td></tr>
                <tr className="bg-emerald-500/10"><td className="p-3 px-4 font-black">{t('fobLabel')} <span className="text-[9px] bg-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded ml-2">FOB</span></td><td className="p-3 px-4 text-right font-black text-emerald-300">{fmt(calc.fob)}</td></tr>
                <tr><td className="p-3 px-4 text-gray-300">{t('oceanFr')}</td><td className="p-3 px-4 text-right">{fmt(costs.oceanFreight)}</td></tr>
                <tr><td className="p-3 px-4 text-gray-300">{t('insuran')}</td><td className="p-3 px-4 text-right">{fmt(costs.insurance)}</td></tr>
                <tr className="bg-yellow-500/10"><td className="p-3 px-4 font-black text-lg">{t('cifLabel')} <span className="text-[9px] bg-yellow-500/30 text-yellow-300 px-2 py-0.5 rounded ml-2">CIF</span></td><td className="p-3 px-4 text-right font-black text-yellow-300 text-lg">{fmt(calc.cif)}</td></tr>
              </tbody>
            </table>
          </div>

          {/* Disclaimer */}
          <div className="bg-yellow-900/20 border border-yellow-500/20 rounded-2xl p-4 text-xs text-yellow-200/80 leading-relaxed">
            <strong className="text-yellow-400">⚠</strong> {t('disclaimer')}
          </div>

          {/* Download — only when products selected */}
          {hasItems && (
            <div className="flex justify-center">
              <button onClick={handleDownload}
                className="bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white font-black py-4 px-8 rounded-full uppercase tracking-widest text-sm shadow-xl shadow-indigo-500/30 transition-all hover:-translate-y-1 flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                {t('download')}
              </button>
            </div>
          )}
        </>

      {/* Inventory Table */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-white/10">
          <h4 className="text-xs text-emerald-400 font-black uppercase tracking-widest">{t('inventory')}</h4>
          <p className="text-[10px] text-gray-500 mt-1">{t('invHint')}</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-[10px] text-gray-400 uppercase tracking-wider">
                <th className="p-4">{t('variety')}</th>
                <th className="p-4">{t('type')}</th>
                <th className="p-4 text-right">{t('available')}</th>
                <th className="p-4 text-center w-28"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {batches.map((b: any) => {
                const isAdded = selectedItems.some(i => i.batch.id === b.id);
                return (
                  <tr key={b.id} className={`transition-colors ${isAdded ? 'bg-emerald-500/10' : 'hover:bg-white/5'}`}>
                    <td className="p-4"><div className="font-bold text-sm">{b.skuNameVi}</div><div className="text-[10px] text-gray-500 font-mono">{b.lotId}</div></td>
                    <td className="p-4 text-xs text-gray-400">{b.dongGiay || '—'}</td>
                    <td className="p-4 text-right font-bold text-green-400">{(b.available || b.quantity || 0).toLocaleString('vi-VN')}</td>
                    <td className="p-4 text-center">
                      {isAdded ? (
                        <span className="text-emerald-400 text-[10px] font-bold">{t('added')}</span>
                      ) : (
                        <button onClick={() => addItem(b)} className="bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider transition-all">{t('add')}</button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </div>
  );
}
