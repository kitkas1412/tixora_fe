"use client";
import { cx } from "../../lib/cx";
import s from "./Ticketing.module.css";

/** Bộ đếm − n +. Nút bị khoá thật (disabled) khi chạm min/max hoặc hết vé. */
export function QuantityStepper({ value, onChange, min = 0, max = 4, disabled, label }: {
  value: number; onChange: (v: number) => void; min?: number; max?: number; disabled?: boolean; label: string;
}) {
  return (
    <div className={cx(s.stepper, disabled && s.stepperOff)} role="group" aria-label={`Số lượng ${label}`}>
      <button type="button" aria-label={`Bớt 1 vé ${label}`} disabled={disabled || value <= min} onClick={() => onChange(value - 1)}>−</button>
      <output aria-live="polite">{value}</output>
      <button type="button" aria-label={`Thêm 1 vé ${label}`} disabled={disabled || value >= max} onClick={() => onChange(value + 1)}>+</button>
    </div>
  );
}
