"use client";
import { useState, type CSSProperties } from "react";
import { cx } from "../../lib/cx";
import s from "./Ticketing.module.css";

export type Seat = { id: string; label: string; status: "available" | "taken" | "accessible" };
export type SeatRowData = { row: string; seats: Seat[]; /** chỉ số ghế bắt đầu lối đi */ aisleAfter?: number };

/**
 * Sơ đồ ghế: ô vuông ≥44px, cuộn ngang trên mobile, có phóng to.
 * Đang chọn = Volt + ✓ · Đã bán = sọc + ✕ · Xe lăn = XL viền xanh.
 */
export function SeatMap({ rows, selected, onChange, max = 4, zoomable = true, stageLabel = "SÂN KHẤU" }: {
  rows: SeatRowData[]; selected: string[]; onChange: (ids: string[]) => void; max?: number; zoomable?: boolean; stageLabel?: string;
}) {
  const sizes = [44, 52, 60];
  const [zoom, setZoom] = useState(0);
  const toggle = (id: string) => {
    if (selected.includes(id)) onChange(selected.filter((x) => x !== id));
    else if (selected.length < max) onChange([...selected, id]);
  };
  return (
    <div className={s.seatMap}>
      {zoomable && (
        <div className={s.zoom} role="group" aria-label="Thu phóng sơ đồ">
          <button type="button" aria-label="Thu nhỏ" disabled={zoom === 0} onClick={() => setZoom(zoom - 1)}>−</button>
          <button type="button" aria-label="Phóng to" disabled={zoom === sizes.length - 1} onClick={() => setZoom(zoom + 1)}>+</button>
        </div>
      )}
      <div className={s.seatScroll} style={{ "--seat-size": `${sizes[zoom]}px` } as CSSProperties}>
        <div className={s.seatInner}>
          <div className={s.stage}>{stageLabel}</div>
          {rows.map((r) => (
            <div key={r.row} className={s.seatRow}>
              <span className={s.rowLabel}>{r.row}</span>
              {r.seats.map((seat, i) => {
                const on = selected.includes(seat.id);
                const taken = seat.status === "taken";
                const acc = seat.status === "accessible";
                const full = !on && selected.length >= max;
                return (
                  <button
                    key={seat.id}
                    type="button"
                    className={cx(s.seat, taken && s.seatTaken, acc && !on && s.seatAccessible, r.aisleAfter === i && s.aisle)}
                    aria-pressed={on}
                    aria-label={`Ghế ${seat.id}${taken ? ", đã bán" : on ? ", đang chọn" : acc ? ", ghế xe lăn" : ", còn trống"}`}
                    disabled={taken || full}
                    onClick={() => toggle(seat.id)}
                  >
                    {on ? "✓" : taken ? "✕" : acc ? "XL" : seat.label}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div className={s.legend}>
        <span><i />Trống</span>
        <span><i className={s.lgSel} />✓ Bạn chọn</span>
        <span><i className={s.lgTaken} />✕ Đã bán</span>
        <span><i className={s.lgAcc} />XL Xe lăn</span>
      </div>
    </div>
  );
}
