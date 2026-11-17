import type { SaleStatus } from "@/shared/kernel/sale";
import type { TierKey } from "@/shared/kernel/tier";

export type ZoneTabItem = { key: TierKey; name: string; /** Chữ hiển thị dưới tên khu, VD "46", "✕ Hết", "Sắp mở" */ left: string; disabled?: boolean };

export type PickerZone = ZoneTabItem & { price: number };

/** Phần dữ liệu sự kiện mà màn chọn ghế cần (EventItem của catalog thoả mãn về cấu trúc). */
export type SeatingEvent = {
  zones: readonly { key: TierKey; name: string; remaining: number }[];
  tiers: readonly { key: TierKey; price: number; status: SaleStatus }[];
};

/** Khu chọn ghế: khu mua được khi hạng tương ứng đang mở bán (on-sale/low) và còn chỗ. */
export function toPickerZones(event: SeatingEvent): PickerZone[] {
  return event.zones.map((z) => {
    const tier = event.tiers.find((t) => t.key === z.key);
    const buyable = !!tier && (tier.status === "on-sale" || tier.status === "low") && z.remaining > 0;
    const left = buyable ? String(z.remaining) : tier?.status === "upcoming" ? "Sắp mở" : "✕ Hết";
    return { key: z.key, name: z.name, left, disabled: !buyable, price: tier?.price ?? 0 };
  });
}

/** Khu mở ban đầu: khu trong URL nếu mua được, không thì khu mua được đầu tiên; null nếu không còn khu nào. */
export function pickInitialZone(zones: PickerZone[], wanted?: TierKey): TierKey | null {
  const open = zones.filter((z) => !z.disabled);
  if (open.length === 0) return null;
  return open.find((z) => z.key === wanted)?.key ?? open[0].key;
}
