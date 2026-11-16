export type TierKey = "svip" | "vip" | "cat1" | "cat2";
export type SaleStatus = "on-sale" | "low" | "upcoming" | "sold-out";

/** Màu nền poster đơn sắc (map sang token trong ART_TONE_VAR ở lib/data.ts). */
export type ArtTone = "flame" | "flame-dark" | "flame-light" | "ink" | "volt" | "gray";

/** Hạng vé / khu của một sự kiện. `price` là giá niêm yết cuối cùng, đã gồm phí dịch vụ. */
export type Tier = {
  key: TierKey;
  /** Tên hiển thị: "SVIP", "VIP", "CAT 1", "CAT 2". */
  name: string;
  price: number;
  note: string;
  status: SaleStatus;
  /** Số vé còn lại (0 khi hết). */
  remaining: number;
};

/** Khu trên sơ đồ ghế (1 khu = 1 hạng vé). */
export type Zone = { key: TierKey; name: string; remaining: number };

export type EventItem = {
  slug: string;
  title: string;
  /** Bộ lọc thể loại: "K-pop", "EDM", "Indie", "V-pop". */
  genre: string;
  /** Phụ đề: "Fan concert". */
  subtitle: string;
  /** Nhóm đầu menu: concert | festival | liveshow. */
  category: "concert" | "festival" | "liveshow";
  status: SaleStatus;
  /** Chữ trạng thái hiển thị ("Đang bán", "Còn ít vé", "Mở 22.11", "Hết vé"). */
  statusText: string;
  /** ISO yyyy-mm-dd. */
  date: string;
  day: string;
  month: string;
  year: string;
  /** "Chủ Nhật". */
  weekday: string;
  /** "CN, 06.12.2026". */
  dateLabel: string;
  /** "19:30". */
  showtime: string;
  doors: string;
  venue: string;
  city: string;
  /** "Độ tuổi" */
  age: string;
  refund: string;
  /** Các đoạn mô tả. */
  description: string[];
  artTone: ArtTone;
  /** Giá thấp nhất còn mua được (đã gồm phí); null nếu hết/chưa mở. */
  priceFrom: number | null;
  tiers: Tier[];
  zones: Zone[];
};
