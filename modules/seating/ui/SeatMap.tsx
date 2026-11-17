"use client";
import { useRef, useState, type CSSProperties, type ReactNode } from "react";
import { cx } from "@/shared/lib/cx";
import { DUR, EASE, gsap, MQ_REDUCE, useGSAP } from "@/shared/motion/motion";
import type { SeatRowData } from "@/modules/seating/model/seat-layout";

/**
 * Sơ đồ ghế: ô vuông ≥44px, cuộn ngang trên mobile, có phóng to.
 * Đang chọn = Volt + ✓ · Đã bán = sọc + ✕ · Xe lăn = XL viền xanh.
 */
export function SeatMap({ rows, selected, onChange, max = 4, zoomable = true, stageLabel = "SÂN KHẤU", fill, heading, disableAtMax = true }: {
  rows: SeatRowData[]; selected: string[]; onChange: (ids: string[]) => void; max?: number; zoomable?: boolean; stageLabel?: string;
  /** Lấp đầy chiều cao còn lại của khung cha (cha phải là flex column có chiều cao giới hạn); sơ đồ cuộn bên trong. */
  fill?: boolean;
  /** Tiêu đề bên trái hàng thu phóng, VD "02 — Ghế (vuốt ngang)". */
  heading?: ReactNode;
  /** true (mặc định): khoá các ghế còn lại khi đủ `max`. false: giữ ghế bấm được, chỉ bấm ghế đã chọn để bỏ. */
  disableAtMax?: boolean;
}) {
  const sizes = [44, 52, 60];
  const [zoom, setZoom] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const { contextSafe } = useGSAP({ scope: root });
  // Chọn: nảy 1 → 1.12 → 1; bỏ chọn: lún nhẹ rồi về chỗ. Không tween khi giảm chuyển động.
  const feedback = contextSafe((el: HTMLElement, picking: boolean) => {
    if (window.matchMedia(MQ_REDUCE).matches) return;
    gsap.killTweensOf(el);
    if (picking) gsap.fromTo(el, { scale: 1 }, { keyframes: [{ scale: 1.12, duration: DUR.fast * 0.6 }, { scale: 1, duration: DUR.fast }], ease: EASE, clearProps: "transform" });
    else gsap.fromTo(el, { scale: 0.92 }, { scale: 1, duration: DUR.fast, ease: EASE, clearProps: "transform" });
  });
  const toggle = (id: string) => {
    if (selected.includes(id)) onChange(selected.filter((x) => x !== id));
    else if (selected.length < max) onChange([...selected, id]);
  };
  return (
    <div ref={root} className={cx("tx-seat-map", fill && "tx-seat-map--fill")}>
      {(zoomable || heading) && (
        <div className="tx-seat-map-tools">
          {heading && <span className="tx-seat-map-heading">{heading}</span>}
          {zoomable && (
            <div className="tx-seat-zoom" role="group" aria-label="Thu phóng sơ đồ">
              <button type="button" aria-label="Thu nhỏ" disabled={zoom === 0} onClick={() => setZoom(zoom - 1)}>−</button>
              <button type="button" aria-label="Phóng to" disabled={zoom === sizes.length - 1} onClick={() => setZoom(zoom + 1)}>+</button>
            </div>
          )}
        </div>
      )}
      <div className="tx-seat-map-scroll" tabIndex={0} role="region" aria-label="Sơ đồ ghế, cuộn để xem thêm" style={{ "--seat-size": `${sizes[zoom]}px` } as CSSProperties}>
        <div className="tx-seat-map-inner">
          <div className="tx-seat-map-stage">{stageLabel}</div>
          {rows.map((r) => (
            <div key={r.row} className="tx-seat-map-row">
              <span className="tx-seat-map-row-label">{r.row}</span>
              {r.seats.map((seat, i) => {
                const on = selected.includes(seat.id);
                const taken = seat.status === "taken";
                const acc = seat.status === "accessible";
                const full = disableAtMax && !on && selected.length >= max;
                return (
                  <button
                    key={seat.id}
                    type="button"
                    className={cx("tx-seat", taken && "tx-seat--taken", acc && !on && "tx-seat--accessible", r.aisleAfter === i && "tx-seat--aisle")}
                    aria-pressed={on}
                    aria-label={`Ghế ${seat.id}${taken ? ", đã bán" : on ? ", đang chọn" : acc ? ", ghế xe lăn" : ", còn trống"}`}
                    disabled={taken || full}
                    onClick={(e) => { if (!on && selected.length >= max) return; feedback(e.currentTarget, !on); toggle(seat.id); }}
                  >
                    {on ? "✓" : taken ? "✕" : acc ? "XL" : seat.label}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="tx-seat-legend">
        <span><i />Trống</span>
        <span><i className="tx-seat-legend-sel" />✓ Chọn</span>
        <span><i className="tx-seat-legend-taken" />✕ Đã bán</span>
        <span><i className="tx-seat-legend-acc" />XL Xe lăn</span>
      </div>
    </div>
  );
}
