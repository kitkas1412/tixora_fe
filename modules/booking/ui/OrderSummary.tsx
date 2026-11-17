import type { ReactNode } from "react";
import { formatVND } from "@/shared/lib/format";
import { AnimatedNumber } from "@/shared/motion/AnimatedNumber";

export type OrderLine = { label: string; quantity: number; amount: number };

/** Tóm tắt đơn: kẻ Flame 8px trên, tổng cỡ 40px. Giá đã gồm phí dịch vụ; tổng = tổng các dòng. */
export function OrderSummary({ lines, action, title = "Đơn của bạn", footnote = "Vé được giữ 10 phút sau khi bấm." }: {
  lines: OrderLine[]; action: ReactNode; title?: string; footnote?: string;
}) {
  const total = lines.reduce((sum, l) => sum + l.amount, 0);
  return (
    <aside className="tx-booking-summary" aria-label={title}>
      <h2>{title}</h2>
      {lines.length === 0 ? (
        <span className="tx-booking-summary-empty">Chưa chọn vé. Bấm + ở hạng vé bạn muốn.</span>
      ) : (
        lines.map((l) => (
          <div key={l.label} className="tx-booking-summary-line"><span>{l.quantity} × {l.label}</span><b>{formatVND(l.amount)}</b></div>
        ))
      )}
      <div className="tx-booking-summary-line tx-booking-summary-line--muted"><span>Phí dịch vụ (đã gồm)</span><span>—</span></div>
      <div className="tx-booking-summary-total"><span>Tổng cộng</span><b><AnimatedNumber value={total} format="vnd" className="tx-motion-inherit" /></b></div>
      {action}
      {footnote && <span className="tx-booking-summary-foot">{footnote}</span>}
    </aside>
  );
}
