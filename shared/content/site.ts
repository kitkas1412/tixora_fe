/** Lọc thể loại ở trang chủ; "Tất cả" = không lọc. */
export const ALL_GENRES = "Tất cả";
export const GENRES: string[] = [ALL_GENRES, "K-pop", "V-pop", "EDM", "Indie"];

export const TRUST_ITEMS: { title: string; text: string }[] = [
  { title: "Giá đã gồm phí", text: "Con số bạn thấy là con số bạn trả." },
  { title: "Phòng chờ công bằng", text: "Xếp hàng theo thứ tự, chặn bot khi mở bán." },
  { title: "Vé QR offline", text: "Mở được khi mất sóng ở sân vận động." },
];

export const FOOTER_GROUPS: { title: string; links: { label: string; href: string }[] }[] = [
  { title: "Khám phá", links: [{ label: "Concert", href: "/" }, { label: "Festival", href: "/" }, { label: "Liveshow", href: "/" }] },
  { title: "Hỗ trợ", links: [{ label: "Chính sách hoàn vé", href: "#" }, { label: "Câu hỏi thường gặp", href: "#" }, { label: "Liên hệ", href: "#" }] },
  { title: "Đối tác", links: [{ label: "Dành cho nhà tổ chức", href: "#" }] },
];
