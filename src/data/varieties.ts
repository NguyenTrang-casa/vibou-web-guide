export interface VarietySpec {
  leafSize?: string;
  internodes?: string;
  floweringStyle?: string;
  usage?: string[];
  notes?: string;
  // Bảng màu thực tế của dòng hoa
  colors?: { name: string; hex: string }[];
}

export const VARIETY_SPECS: Record<string, VarietySpec> = {
  'Thái': {
    leafSize: '2-3.5cm, gần tròn, mọc sít',
    internodes: 'Ngắn (0.5-1cm), tạo tán dày đặc',
    floweringStyle: 'Nở chi chít phủ kín ~100% diện tích tán',
    usage: ['Hàng rào dự án', 'Dải phân cách', 'Cây bụi trang trí'],
    notes: 'Khả năng phục hồi form cực nhanh sau cắt tỉa (2-3 tuần).',
    colors: [
      { name: 'Đỏ', hex: '#DC2626' },
      { name: 'Vàng', hex: '#EAB308' },
      { name: 'Cam', hex: '#EA580C' },
      { name: 'Trắng', hex: '#F5F5F4' },
      { name: 'Hồng phấn', hex: '#F9A8D4' },
    ]
  },
  'Lửa': {
    leafSize: 'Dày, xanh đậm, chịu nhiệt tuyệt đối',
    internodes: 'Trung bình, cành khỏe gân guốc',
    floweringStyle: 'Nở rộ thành từng "quả cầu" màu sắc rực rỡ',
    usage: ['Cổng chào', 'Resort ven biển', 'Tầng thượng gắt nắng'],
    notes: 'Càng nắng gắt màu hoa càng đậm, không bị héo bạc màu.',
    colors: [
      { name: 'Đỏ', hex: '#B91C1C' },
      { name: 'Cam', hex: '#C2410C' },
    ]
  },
  'Cao bồi': {
    leafSize: 'Trung bình, xanh đậm, dày bóng',
    internodes: 'Trung bình, cành uốn lượn tự nhiên',
    floweringStyle: 'Hoa nở thành chùm dày, cánh dày và bền',
    usage: ['Cây tạo dáng', 'Bonsai hoa giấy', 'Cây độc lập sân vườn'],
    notes: 'Dòng hoa cứng cáp, dễ tạo form, giữ hoa rất lâu trên cành.',
    colors: [
      { name: 'Lem', hex: 'linear-gradient(135deg, #F472B6 50%, #FFFFFF 50%)' },
      { name: 'Son môi hồng', hex: '#DB2777' },
    ]
  },
  'Đổi màu': {
    leafSize: 'Trung bình, xanh sáng, mềm mại',
    internodes: 'Trung bình-dài, tán mở rộng',
    floweringStyle: 'Hoa đổi sắc theo thời gian: từ đậm sang nhạt',
    usage: ['Tiểu cảnh sân vườn', 'Cafe check-in', 'Khu nghỉ dưỡng'],
    notes: 'Điểm nhấn đặc biệt: cùng 1 cây nhưng cho ra nhiều tông màu khác nhau.',
    colors: [
      { name: 'Golden Sunshine', hex: 'linear-gradient(135deg, #FBBF24 50%, #F472B6 50%)' },
      { name: 'Moduring', hex: 'linear-gradient(135deg, #EF4444 50%, #FFFFFF 50%)' },
    ]
  },
  'Mỹ lá nhỏ': {
    leafSize: 'Nhỏ, xanh đậm, hình trứng',
    internodes: 'Ngắn-trung bình, tán compact tự nhiên',
    floweringStyle: 'Nở đồng loạt, phủ rộng, hoa nhỏ dày đặc',
    usage: ['Hàng rào thấp', 'Viền lối đi', 'Phủ mái hiên'],
    notes: 'Dòng Mỹ lá nhỏ rất dễ chăm, hoa ra quanh năm ở vùng nắng nóng.',
    colors: [
      { name: 'Hồng sen', hex: '#C2185B' },
    ]
  },
  'Mỹ lá lớn': {
    leafSize: 'Lớn (5-8cm), xanh thẫm, lá dày',
    internodes: 'Dài, cành leo mạnh mẽ',
    floweringStyle: 'Hoa to bản, cánh dày, nở thành chùm lớn',
    usage: ['Leo giàn', 'Leo tường rào', 'Cổng vòm'],
    notes: 'Sức leo vượt trội, phù hợp phủ kín diện tích lớn nhanh chóng.',
    colors: [
      { name: 'Trắng', hex: '#F5F5F4' },
    ]
  },
  'Cẩm thạch lá trung': {
    leafSize: 'Trung bình, biên lá vàng/trắng nghệ thuật',
    internodes: 'Đồng đều, dễ tạo dáng búp tròn',
    floweringStyle: 'Hoa nở xen kẽ, nổi bật trên nền lá màu',
    usage: ['Villa cao cấp', 'Lobby resort', 'Tiểu cảnh kiểng lá'],
    notes: 'Vẻ đẹp thẩm mỹ 365 ngày/năm ngay cả khi không vào mùa hoa.',
    colors: [
      { name: 'Thái vàng', hex: '#F59E0B' },
      { name: 'Perdo', hex: '#E91E63' },
      { name: 'Red Brizza', hex: '#D32F2F' },
    ]
  },
  'Dưa hấu': {
    leafSize: 'Trung bình, xanh sáng, mềm',
    internodes: 'Trung bình, cành dẻo dai',
    floweringStyle: 'Hoa hai tông — trắng xen hồng đỏ như ruột dưa hấu',
    usage: ['Sân vườn biệt thự', 'Tiểu cảnh check-in', 'Resort'],
    notes: 'Màu hoa độc đáo, bắt mắt, rất ít vườn có giống chuẩn.',
    colors: [
      { name: 'Đỏ', hex: '#E84393' },
    ]
  },
  // Giữ lại các dòng chưa nhập ERP nhưng đã có content marketing
  'Cẩm thạch': {
    leafSize: 'Biên vàng hoặc trắng nghệ thuật',
    internodes: 'Đồng đều, dễ tạo dáng búp tròn',
    floweringStyle: 'Hoa nở xen kẽ, nổi bật trên nền lá màu',
    usage: ['Villa cao cấp', 'Lobby resort', 'Tiểu cảnh kiểng lá'],
    notes: 'Vẻ đẹp thẩm mỹ 365 ngày/năm ngay cả khi không vào mùa hoa.',
    colors: [
      { name: 'Thái vàng', hex: '#F59E0B' },
      { name: 'Perdo', hex: '#D946EF' },
    ]
  },
  'Sakura': {
    leafSize: 'Nhỏ, sáng màu, nhạy cảm ánh sáng',
    internodes: 'Dày đặc, phù hợp tạo tán mâm xôi',
    floweringStyle: 'Sắc hồng phớt trắng (Gradient) như hoa anh đào',
    usage: ['Cafe check-in', 'Homestay', 'Boutique Hotel'],
    notes: 'Cần điều tiết nắng vừa phải để giữ độ loang màu đẹp nhất.',
    colors: [
      { name: 'Hồng phớt', hex: '#FBCFE8' },
    ]
  },
  'Tím tuyết': {
    leafSize: 'Nhỏ, xanh bóng, thoát thân tốt',
    internodes: 'Vươn dài thanh thoát',
    floweringStyle: 'Sắc đốm tím trên nền tuyết trắng tinh khôi',
    usage: ['Kiến trúc Minimalist', 'Biệt thự hiện đại', 'Cảnh quan trung tâm'],
    notes: 'Sắc màu thanh lãnh, cực kỳ tôn mảng tường bê tông/gỗ tối màu.',
    colors: [
      { name: 'Tím tuyết', hex: '#A855F7' },
    ]
  },
  'Rượu vang': {
    leafSize: 'Mờ, tối màu, gân guốc',
    internodes: 'Gần nhau, tạo cảm giác cổ điển già cỗi',
    floweringStyle: 'Đỏ thẫm sâu lắng, không rực rỡ phô trương',
    usage: ['Cigar Lounge', 'Kiến trúc Âu Châu', 'Rooftop Bar'],
    notes: 'Sắc hoa thẫm sâu nhất, giữ màu bền bỉ dưới nắng gắt.',
    colors: [
      { name: 'Đỏ thẫm', hex: '#7F1D1D' },
    ]
  },
  'Socola': {
    leafSize: 'Xanh thẫm, cứng cáp',
    internodes: 'Trung bình, tạo dáng Rustic',
    floweringStyle: 'Đỏ nâu trầm mặc, mang hơi hướng hội họa',
    usage: ['Studio nghệ thuật', 'Art Gallery', 'Industrial Style'],
    notes: 'Mã màu hiếm, dành cho những không gian cần sự độc bản.',
    colors: [
      { name: 'Nâu socola', hex: '#78350F' },
    ]
  },
  'Hồng gân': {
    leafSize: 'Trung bình, vân lá rõ',
    internodes: 'Dài, phù hợp leo giàn/vòm',
    floweringStyle: 'Hồng loang vân rõ nét, dịu dàng',
    usage: ['Leo vòm cổng', 'Mass planting (mảng lớn)', 'Resort & Villa'],
    notes: 'Được mệnh danh là "nàng thơ của nắng", loang màu tự nhiên đẹp nhất.',
    colors: [
      { name: 'Hồng gân', hex: '#F472B6' },
    ]
  }
};

export function getVarietySpec(dongGiay: string | null): VarietySpec | undefined {
  if (!dongGiay) return undefined;
  // Tìm kiếm mờ (fuzzy match) để khớp với dữ liệu ERP (thường có nhiều text thừa)
  const key = Object.keys(VARIETY_SPECS).find(k => dongGiay.toLowerCase().includes(k.toLowerCase()));
  return key ? VARIETY_SPECS[key] : undefined;
}
