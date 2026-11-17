"use client";
import { useRef } from "react";
import { cx } from "@/shared/lib/cx";
import { DUR, EASE, gsap, motionMatchMedia, useGSAP } from "@/shared/motion/motion";
import s from "./Booking.module.css";

/** Bộ đếm − n +. Nút bị khoá thật (disabled) khi chạm min/max hoặc hết vé. */
export function QuantityStepper({ value, onChange, min = 0, max = 4, disabled, label }: {
  value: number; onChange: (v: number) => void; min?: number; max?: number; disabled?: boolean; label: string;
}) {
  const out = useRef<HTMLOutputElement>(null);
  const prev = useRef(value);
  // Tick nhẹ khi số đổi (không chạy ở lần render đầu).
  useGSAP(() => {
    const dir = value - prev.current;
    prev.current = value;
    if (!dir || !out.current) return;
    const el = out.current;
    const mm = motionMatchMedia({
      motion: () => { gsap.fromTo(el, { y: dir > 0 ? 6 : -6, opacity: 0.4 }, { y: 0, opacity: 1, duration: DUR.fast, ease: EASE, clearProps: "transform,opacity" }); },
    });
    return () => mm.revert();
  }, { dependencies: [value] });
  return (
    <div className={cx(s.stepper, disabled && s.stepperOff)} role="group" aria-label={`Số lượng ${label}`}>
      <button type="button" aria-label={`Bớt 1 vé ${label}`} disabled={disabled || value <= min} onClick={() => onChange(value - 1)}>−</button>
      <output ref={out} aria-live="polite">{value}</output>
      <button type="button" aria-label={`Thêm 1 vé ${label}`} disabled={disabled || value >= max} onClick={() => onChange(value + 1)}>+</button>
    </div>
  );
}
