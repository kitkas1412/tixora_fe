import type { ReactNode } from "react";
import type { TierKey } from "@/shared/kernel/tier";
import { TierBadge } from "@/shared/ui/Labels";

/**
 * Vé điện tử. Truyền mã QR thật qua `qr` (VD: <QRCodeSVG value={code}/> từ thư viện qrcode.react).
 * QR luôn nằm trên nền trắng tuyệt đối.
 */
export function TicketCard({ title, category, tier, facts, code, qr }: {
  title: string; category: string; tier: TierKey; facts: { label: string; value: string }[]; code: string; qr: ReactNode;
}) {
  return (
    <article className="tx-ticket" aria-label={`Vé ${title}`}>
      <div className="tx-ticket-head">
        <div className="tx-ticket-top"><span>{category}</span><TierBadge tier={tier} /></div>
        <strong>{title}</strong>
      </div>
      <div className="tx-ticket-facts">
        {facts.map((f) => <div key={f.label}><small>{f.label}</small><b>{f.value}</b></div>)}
      </div>
      <div className="tx-ticket-qr">
        {qr}
        <b>{code}</b>
        <span>Tăng độ sáng khi quét · mở được khi không có mạng</span>
      </div>
    </article>
  );
}
