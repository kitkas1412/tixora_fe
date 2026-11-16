import type { ReactNode } from "react";
import { formatVND } from "../../lib/format";
import s from "./Ticketing.module.css";

export type OrderLine = { label: string; quantity: number; amount: number };

/** Tóm tắt đơn: kẻ Flame 8px trên, tổng cỡ 40px. Giá đã gồm phí dịch vụ; tổng = tổng các dòng. */
export function OrderSummary({ lines, action, title = "Đơn của bạn", footnote = "Vé được giữ 10 phút sau khi bấm." }: {
  lines: OrderLine[]; action: ReactNode; title?: string; footnote?: string;
}) {
  const total = lines.reduce((sum, l) => sum + l.amount, 0);
  return (
    <aside className={s.summary} aria-label={title}>
      <h2>{title}</h2>
      {lines.length === 0 ? (
        <span className={s.empty}>Chưa chọn vé. Bấm + ở hạng vé bạn muốn.</span>
      ) : (
        lines.map((l) => (
          <div key={l.label} className={s.line}><span>{l.quantity} × {l.label}</span><b>{formatVND(l.amount)}</b></div>
        ))
      )}
      <div className={`${s.line} ${s.lineMuted}`}><span>Phí dịch vụ (đã gồm)</span><span>—</span></div>
      <div className={s.total}><span>Tổng cộng</span><b>{formatVND(total)}</b></div>
      {action}
      {footnote && <span className={s.foot}>{footnote}</span>}
    </aside>
  );
}
