import type { ArtTone, EventItem } from "@/modules/catalog/model/types";

/** Trang chủ: sự kiện nổi bật (đầu danh sách) và tối đa 4 sự kiện còn bán cho mục "Khám phá". */
export function selectHomeEvents(events: EventItem[]): { hero: EventItem; explore: EventItem[] } {
  return { hero: events[0], explore: events.slice(1).filter((e) => e.status !== "sold-out").slice(0, 4) };
}

/** Poster nền tối thì chữ sáng. */
export const isDarkTone = (tone: ArtTone): boolean => tone === "ink" || tone === "flame-dark";

/** Bảng thông tin nhanh trên trang chi tiết sự kiện. */
export function eventFacts(event: EventItem): { k: string; v: string }[] {
  return [
    { k: "Ngày", v: event.dateLabel },
    { k: "Giờ diễn", v: event.showtime },
    { k: "Mở cổng", v: event.doors },
    { k: "Địa điểm", v: `${event.venue}, ${event.city}` },
    { k: "Độ tuổi", v: event.age },
    { k: "Hoàn vé", v: event.refund },
  ];
}
