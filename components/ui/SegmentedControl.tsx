"use client";
import type { ReactNode } from "react";
import { cx } from "../../lib/cx";
import s from "./SegmentedControl.module.css";

export type Option<T extends string> = { value: T; label: ReactNode; disabled?: boolean };

/** Bộ lọc dạng thanh chữ nhật liền (thể loại, khu ghế…). */
export function SegmentedControl<T extends string>({ options, value, onChange, fullWidth, label, className }: {
  options: Option<T>[]; value: T; onChange: (v: T) => void; fullWidth?: boolean; label?: string; className?: string;
}) {
  return (
    <div role="group" aria-label={label} className={cx(s.group, fullWidth && s.full, className)}>
      {options.map((o) => (
        <button key={o.value} type="button" className={s.item} aria-pressed={value === o.value} disabled={o.disabled} onClick={() => onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** Tab gạch chân Flame 3px. Nội dung tab do trang tự render theo `value`. */
export function Tabs<T extends string>({ options, value, onChange, label }: { options: Option<T>[]; value: T; onChange: (v: T) => void; label?: string }) {
  return (
    <div role="tablist" aria-label={label} className={s.tabs}>
      {options.map((o) => (
        <button key={o.value} type="button" role="tab" className={s.tab} aria-selected={value === o.value} disabled={o.disabled} onClick={() => onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}
