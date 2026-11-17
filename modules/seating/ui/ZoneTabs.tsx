"use client";
import type { TierKey } from "@/shared/kernel/tier";
import type { ZoneTabItem } from "@/modules/seating/model/zones";

/** Chọn khu: các nút ngang chia đều, khu hết vé bị khoá (chữ "Hết", không chỉ đổi màu). */
export function ZoneTabs({ zones, value, onChange, label = "Chọn khu" }: {
  zones: ZoneTabItem[]; value: TierKey; onChange: (key: TierKey) => void; label?: string;
}) {
  return (
    <div className="tx-flow-zones" role="group" aria-label={label}>
      {zones.map((z) => (
        <button
          key={z.key}
          type="button"
          className="tx-flow-zone"
          aria-pressed={value === z.key}
          disabled={z.disabled}
          onClick={() => onChange(z.key)}
        >
          <span>{z.name}</span>
          <small>{z.left}</small>
        </button>
      ))}
    </div>
  );
}
