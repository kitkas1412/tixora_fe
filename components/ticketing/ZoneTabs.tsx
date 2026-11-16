"use client";
import type { TierKey } from "../../lib/types";
import s from "./Flow.module.css";

export type ZoneTabItem = { key: TierKey; name: string; /** Chữ hiển thị dưới tên khu, VD "46", "✕ Hết", "Sắp mở" */ left: string; disabled?: boolean };

/** Chọn khu: các nút ngang chia đều, khu hết vé bị khoá (chữ "Hết", không chỉ đổi màu). */
export function ZoneTabs({ zones, value, onChange, label = "Chọn khu" }: {
  zones: ZoneTabItem[]; value: TierKey; onChange: (key: TierKey) => void; label?: string;
}) {
  return (
    <div className={s.zones} role="group" aria-label={label}>
      {zones.map((z) => (
        <button
          key={z.key}
          type="button"
          className={s.zone}
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
