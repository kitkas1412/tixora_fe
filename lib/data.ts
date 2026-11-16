import type { ArtTone, EventItem, SaleStatus, Tier, TierKey } from "./types";

/** Token CSS cho màu poster đơn sắc. */
export const ART_TONE_VAR: Record<ArtTone, string> = {
  flame: "var(--flame-500)",
  "flame-dark": "var(--flame-900)",
  "flame-light": "var(--flame-100)",
  ink: "var(--ink)",
  volt: "var(--volt-500)",
  gray: "var(--gray-100)",
};

const WEEKDAYS = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
const SHORT = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

function dateParts(iso: string) {
  const [year, month, day] = iso.split("-");
  const d = new Date(Date.UTC(+year, +month - 1, +day)).getUTCDay();
  return { date: iso, year, month, day, weekday: WEEKDAYS[d], dateLabel: `${SHORT[d]}, ${day}.${month}.${year}` };
}

type TierSeed = [key: TierKey, price: number, note: string, remaining: number];
const TIER_NAME: Record<TierKey, string> = { svip: "SVIP", vip: "VIP", cat1: "CAT 1", cat2: "CAT 2" };

function tiers(seeds: TierSeed[], mode: "live" | "upcoming" | "sold-out" = "live"): Tier[] {
  return seeds.map(([key, price, note, remaining]) => {
    let status: SaleStatus;
    if (mode === "upcoming") status = "upcoming";
    else if (mode === "sold-out" || remaining === 0) status = "sold-out";
    else status = remaining <= 60 ? "low" : "on-sale";
    return { key, name: TIER_NAME[key], price, note, status, remaining: mode === "sold-out" ? 0 : remaining };
  });
}

type Seed = Omit<EventItem, "date" | "day" | "month" | "year" | "weekday" | "dateLabel" | "priceFrom" | "zones"> & { iso: string };

function make({ iso, ...rest }: Seed): EventItem {
  const buyable = rest.tiers.filter((t) => t.status === "on-sale" || t.status === "low");
  return {
    ...rest,
    ...dateParts(iso),
    priceFrom: buyable.length ? Math.min(...buyable.map((t) => t.price)) : null,
    zones: rest.tiers.map((t) => ({ key: t.key, name: t.name, remaining: t.remaining })),
  };
}

const REFUND = "Hoàn vé trước 7 ngày so với ngày diễn, phí hoàn 10%. Không hoàn trong 7 ngày cuối.";

const EVENTS: EventItem[] = [
  make({
    slug: "starlight-k-night-2026", title: "Starlight K-Night 2026", genre: "K-pop", subtitle: "Fan concert", category: "concert",
    status: "on-sale", statusText: "Đang bán", iso: "2026-12-06", showtime: "19:30", doors: "17:00",
    venue: "SVĐ Quân khu 7", city: "TP.HCM", age: "Từ 12 tuổi (dưới 16 có người lớn đi cùng)", refund: REFUND, artTone: "flame",
    description: [
      "Một đêm fan concert dành riêng cho cộng đồng K-pop với dàn nghệ sĩ Hàn Quốc và Việt Nam, sân khấu LED 360° và phần tương tác trực tiếp cùng fan.",
      "Chương trình kéo dài khoảng 3 giờ, có phần fan meeting ngắn dành cho khu SVIP và VIP. Cổng mở từ 17:00, vui lòng đến sớm để kiểm vé.",
    ],
    tiers: tiers([["svip", 3500000, "Hàng ghế đầu · quà tặng giới hạn", 0], ["vip", 2500000, "Ghế trung tâm · kèm lightstick", 46], ["cat1", 1200000, "Khán đài hai bên", 312], ["cat2", 800000, "Khán đài xa", 540]]),
  }),
  make({
    slug: "neon-bloom-festival", title: "Neon Bloom Festival", genre: "EDM", subtitle: "Festival 2 ngày", category: "festival",
    status: "low", statusText: "Còn ít vé", iso: "2026-12-13", showtime: "16:00", doors: "14:00",
    venue: "CV Yên Sở", city: "Hà Nội", age: "Từ 18 tuổi, mang theo CCCD", refund: "Không hoàn vé. Được đổi tên người nhận vé trước 48 giờ.", artTone: "volt",
    description: [
      "Hai ngày, ba sân khấu, hơn 30 DJ trong và ngoài nước giữa không gian ánh sáng neon ở công viên Yên Sở.",
      "Có khu ẩm thực, khu nghỉ chill-out và tàu điện đưa đón từ trung tâm. Vé hai ngày dùng cho cả hai buổi.",
    ],
    tiers: tiers([["svip", 3000000, "Khu riêng · quầy bar riêng", 24], ["vip", 1800000, "Sát sân khấu chính", 38], ["cat1", 1100000, "Khu đứng chung", 52], ["cat2", 700000, "Khu đứng phía sau", 410]]),
  }),
  make({
    slug: "chieu-hong-acoustic", title: "Chiều Hồng Acoustic", genre: "Indie", subtitle: "Acoustic", category: "liveshow",
    status: "upcoming", statusText: "Mở 22.11", iso: "2026-12-20", showtime: "17:00", doors: "16:00",
    venue: "Đồi Mộng Mơ", city: "Đà Lạt", age: "Mọi lứa tuổi", refund: REFUND, artTone: "flame-light",
    description: [
      "Buổi chiều acoustic giữa đồi thông, nhạc indie Việt cùng những câu chuyện sau mỗi bài hát.",
      "Chỗ ngồi trên thảm, mang theo áo ấm vì chiều Đà Lạt rất lạnh. Vé mở bán từ 22.11.",
    ],
    tiers: tiers([["vip", 1500000, "Hàng đầu · kèm đồ uống", 80], ["cat1", 900000, "Khu giữa", 160], ["cat2", 550000, "Khu sau", 240]], "upcoming"),
  }),
  make({
    slug: "countdown-song-dem", title: "Countdown Sóng Đêm", genre: "V-pop", subtitle: "Countdown", category: "concert",
    status: "sold-out", statusText: "Hết vé", iso: "2026-12-31", showtime: "21:00", doors: "19:30",
    venue: "Phố đi bộ", city: "Đà Nẵng", age: "Từ 12 tuổi", refund: "Không hoàn vé.", artTone: "flame-dark",
    description: [
      "Đêm countdown đón năm mới bên bờ sông Hàn với dàn nghệ sĩ V-pop quen thuộc và pháo hoa lúc 00:00.",
      "Toàn bộ vé đã bán hết. Theo dõi Tixora để nhận thông báo nếu có vé trả lại.",
    ],
    tiers: tiers([["vip", 2200000, "Khu xem pháo hoa", 0], ["cat1", 1000000, "Khu giữa", 0], ["cat2", 600000, "Khu ngoài", 0]], "sold-out"),
  }),
  make({
    slug: "underground-cypher", title: "Underground Cypher", genre: "Indie", subtitle: "Hip-hop showcase", category: "liveshow",
    status: "on-sale", statusText: "Đang bán", iso: "2027-01-10", showtime: "20:00", doors: "19:00",
    venue: "Hầm Sài Gòn", city: "TP.HCM", age: "Từ 16 tuổi", refund: REFUND, artTone: "ink",
    description: [
      "Đêm cypher với các rapper underground, DJ set và battle mở dành cho khán giả đăng ký tại chỗ.",
      "Không gian nhỏ, sức chứa giới hạn. Vé khu đứng không có chỗ ngồi.",
    ],
    tiers: tiers([["vip", 900000, "Sát sân khấu", 90], ["cat1", 600000, "Khu đứng giữa", 180], ["cat2", 400000, "Khu đứng sau", 220]]),
  }),
  make({
    slug: "mua-xuan-ben-nhau", title: "Mùa Xuân Bên Nhau", genre: "V-pop", subtitle: "Liveshow", category: "liveshow",
    status: "on-sale", statusText: "Đang bán", iso: "2027-01-17", showtime: "19:30", doors: "18:30",
    venue: "Nhà hát Lớn", city: "Hà Nội", age: "Mọi lứa tuổi", refund: REFUND, artTone: "gray",
    description: [
      "Liveshow đón Tết với những ca khúc V-pop về mùa xuân, đoàn tụ và hy vọng, cùng dàn nhạc giao hưởng sống.",
      "Phù hợp cả gia đình. Khán phòng có chỗ ngồi đánh số, vui lòng đến trước giờ diễn 30 phút.",
    ],
    tiers: tiers([["svip", 2800000, "Hàng đầu · tặng quà Tết", 40], ["vip", 1800000, "Tầng trệt giữa", 120], ["cat1", 1000000, "Tầng trệt hai bên", 260], ["cat2", 600000, "Tầng lửng", 300]]),
  }),
];

export function getEvents(): EventItem[] { return EVENTS; }
export function getEvent(slug: string): EventItem | undefined { return EVENTS.find((e) => e.slug === slug); }
export function getEventSlugs(): string[] { return EVENTS.map((e) => e.slug); }
export function getTier(event: EventItem, key: TierKey): Tier | undefined { return event.tiers.find((t) => t.key === key); }

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
