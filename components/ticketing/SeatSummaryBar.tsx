"use client";
import { formatVND } from "../../lib/format";
import { StickyBar } from "../layout/StickyBar";
import { Button } from "../ui/Button";
import s from "./Flow.module.css";

/**
 * Thanh đáy chọn ghế: chip ghế (bấm để bỏ), cảnh báo đủ ghế, tổng tiền (đã gồm phí) và nút "Giữ n ghế".
 * `unitPrice` = giá một ghế, đã gồm phí dịch vụ (tổng = n × unitPrice).
 */
export function SeatSummaryBar({ seats, max, unitPrice, onRemove, onContinue, busy }: {
  seats: string[]; max: number; unitPrice: number; onRemove: (id: string) => void; onContinue: () => void; busy?: boolean;
}) {
  const n = seats.length;
  return (
    <StickyBar>
      <div className={s.chips} role="status" aria-live="polite">
        {n === 0 && <span className={s.chipsEmpty}>Chưa chọn ghế · tối đa {max}</span>}
        {seats.map((id) => (
          <button key={id} type="button" className={s.chip} aria-label={`Bỏ ghế ${id}`} onClick={() => onRemove(id)}>{id} ✕</button>
        ))}
        {n >= max && <span className={s.full}>▲ Đủ {max} ghế</span>}
      </div>
      <div className={s.totalRow}>
        <div><small>Tổng (đã gồm phí)</small><b>{formatVND(n * unitPrice)}</b></div>
        <Button size="l" arrow className={s.cta} disabled={n === 0} loading={busy} loadingText="Đang giữ…" onClick={onContinue}>
          {n === 0 ? "Chọn ghế" : `Giữ ${n} ghế`}
        </Button>
      </div>
    </StickyBar>
  );
}
