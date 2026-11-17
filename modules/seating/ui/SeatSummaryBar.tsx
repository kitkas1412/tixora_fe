"use client";
import { useRef } from "react";
import { DUR, EASE, gsap, motionMatchMedia, MQ_REDUCE, useGSAP } from "@/shared/motion/motion";
import { AnimatedNumber } from "@/shared/motion/AnimatedNumber";
import { StickyBar } from "@/shared/ui/layout/StickyBar";
import { Button } from "@/shared/ui/Button";
import s from "@/shared/ui/flow/Flow.module.css";

/**
 * Thanh đáy chọn ghế: chip ghế (bấm để bỏ), cảnh báo đủ ghế, tổng tiền (đã gồm phí) và nút "Giữ n ghế".
 * `unitPrice` = giá một ghế, đã gồm phí dịch vụ (tổng = n × unitPrice).
 */
export function SeatSummaryBar({ seats, max, unitPrice, onRemove, onContinue, busy }: {
  seats: string[]; max: number; unitPrice: number; onRemove: (id: string) => void; onContinue: () => void; busy?: boolean;
}) {
  const n = seats.length;
  const chipsRef = useRef<HTMLDivElement>(null);
  const known = useRef<string[] | null>(null);
  // Chip mới trượt/mờ vào (bỏ qua lần render đầu: ghế có sẵn từ URL không hoạt hoạ).
  useGSAP(() => {
    const before = known.current;
    known.current = seats;
    if (!before || !chipsRef.current) return;
    const fresh = seats.filter((id) => !before.includes(id));
    if (!fresh.length) return;
    const els = Array.from(chipsRef.current.querySelectorAll<HTMLElement>("[data-chip]")).filter((el) => fresh.includes(el.dataset.chip ?? ""));
    const mm = motionMatchMedia({
      motion: () => { gsap.from(els, { opacity: 0, x: -10, duration: DUR.base, ease: EASE, clearProps: "transform,opacity" }); },
    });
    return () => mm.revert();
  }, { dependencies: [seats.join("|")] });
  // Bỏ chip: mờ nhanh rồi mới gọi onRemove (giảm chuyển động: gọi ngay).
  // contextSafe: tween bị kill + revert khi unmount nên onComplete không chạy sau unmount.
  const { contextSafe } = useGSAP({ scope: chipsRef });
  const removing = useRef<Set<string>>(new Set()); // mỗi chip chỉ gọi onRemove một lần
  const remove = (el: HTMLElement, id: string) => contextSafe(() => {
    if (removing.current.has(id)) return;
    removing.current.add(id);
    const done = () => { onRemove(id); removing.current.delete(id); };
    if (window.matchMedia(MQ_REDUCE).matches) { done(); return; }
    el.style.pointerEvents = "none";
    gsap.to(el, { opacity: 0, scale: 0.9, duration: DUR.fast, ease: EASE, onComplete: done });
  })();
  return (
    <StickyBar>
      <div ref={chipsRef} className={s.chips} role="status" aria-live="polite">
        {n === 0 && <span className={s.chipsEmpty}>Chưa chọn ghế · tối đa {max}</span>}
        {seats.map((id) => (
          <button key={id} type="button" data-chip={id} className={s.chip} aria-label={`Bỏ ghế ${id}`} onClick={(e) => remove(e.currentTarget, id)}>{id} ✕</button>
        ))}
        {n >= max && <span className={s.full}>▲ Đủ {max} ghế</span>}
      </div>
      <div className={s.totalRow}>
        <div><small>Tổng (đã gồm phí)</small><b><AnimatedNumber value={n * unitPrice} format="vnd" /></b></div>
        <Button size="l" arrow className={s.cta} disabled={n === 0} loading={busy} loadingText="Đang giữ…" onClick={onContinue}>
          {n === 0 ? "Chọn ghế" : `Giữ ${n} ghế`}
        </Button>
      </div>
    </StickyBar>
  );
}
