"use client";
import { useRef, useState } from "react";
import { formatClock, formatVND } from "../../lib/format";
import { DUR, EASE, gsap, MQ_REDUCE, useGSAP } from "../../lib/motion";

export type NumberFormat = "vnd" | "int" | "clock";
const FORMATTERS: Record<NumberFormat, (n: number) => string> = {
  vnd: formatVND,
  int: (n) => n.toLocaleString("vi-VN"),
  clock: formatClock,
};

/**
 * Số đổi giá trị bằng tween (snap về số nguyên). Lần render đầu hiện giá trị cuối, không tween.
 * Chữ chạy là aria-hidden; giá trị thật nằm trong .tx-sr-only và chỉ đổi một lần.
 * `format` là chuỗi (không phải hàm) để dùng được từ server component.
 */
export function AnimatedNumber({ value, format = "vnd", className }: { value: number; format?: NumberFormat; className?: string }) {
  const fmt = FORMATTERS[format];
  const textRef = useRef<HTMLSpanElement>(null);
  const [initial] = useState(() => fmt(value)); // React không bao giờ đổi text này; GSAP ghi trực tiếp vào text node
  const shown = useRef({ v: value });
  const write = (n: number) => { const t = textRef.current?.firstChild; if (t) t.nodeValue = fmt(n); };

  // Không dùng matchMedia/revert: kill tween đang chạy nhưng giữ giá trị giữa chừng làm điểm bắt đầu kế tiếp.
  useGSAP(() => {
    gsap.killTweensOf(shown.current);
    const from = shown.current.v;
    if (from === value) { write(value); return; }
    if (window.matchMedia(MQ_REDUCE).matches) { shown.current.v = value; write(value); return; }
    gsap.to(shown.current, {
      v: value, duration: DUR.slow, ease: EASE, snap: { v: 1 },
      onUpdate: () => write(shown.current.v),
      onComplete: () => write(value),
    });
  }, { dependencies: [value, format] });

  return (
    <span className={className}>
      <span ref={textRef} aria-hidden="true">{initial}</span>
      <span className="tx-sr-only">{fmt(value)}</span>
    </span>
  );
}
