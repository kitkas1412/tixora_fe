"use client";
import { useRef, useState } from "react";
import { DUR, EASE, gsap, motionMatchMedia, useGSAP } from "@/shared/motion/motion";
import type { TicketModel } from "@/modules/ticketing/model/ticket";
import { MobileAppBar } from "@/shared/ui/layout/MobileAppBar";
import { Button } from "@/shared/ui/Button";
import { FakeQr } from "@/modules/ticketing/ui/FakeQr";
import { TicketCard } from "@/modules/ticketing/ui/TicketCard";

/** Màn "Vé của tôi": phân trang giữa các vé trong cùng đơn. Thuần trình bày, không có thao tác thật. */
export function TicketView({ title, category, tickets, mapsHref, justPaid = false }: {
  title: string; category: string; tickets: TicketModel[]; mapsHref: string; justPaid?: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [wallet, setWallet] = useState(false);
  const n = tickets.length;
  const t = tickets[index];
  const cardRef = useRef<HTMLDivElement>(null);
  const last = useRef({ index, dir: 1 });
  // Đổi vé (sau mount): vé mới mờ/trượt vào theo hướng bấm. Lần đầu dùng keyframe CSS.
  useGSAP(() => {
    const dir = index >= last.current.index ? 1 : -1;
    const changed = index !== last.current.index;
    last.current = { index, dir };
    if (!changed || !cardRef.current) return;
    const el = cardRef.current;
    const mm = motionMatchMedia({
      motion: () => { gsap.fromTo(el, { opacity: 0, x: 24 * dir }, { opacity: 1, x: 0, duration: DUR.base, ease: EASE, clearProps: "transform,opacity" }); },
    });
    return () => mm.revert();
  }, { dependencies: [index] });
  return (
    <>
      <MobileAppBar backHref="/" backLabel="Về trang chủ" title="Vé của tôi" right={`Vé ${index + 1} / ${n}`} />
      {justPaid && <div role="status" className="tx-flow-paid">✓ Thanh toán thành công · đã gửi vé về email</div>}
      <main className="tx-flow-main">
        <div ref={cardRef} className="tx-flow-card-enter">
          <TicketCard title={title} category={category} tier={t.tier} facts={t.facts} code={t.code} qr={<FakeQr value={t.code} />} />
        </div>
        {n > 1 && (
          <nav className="tx-flow-pager" aria-label="Chọn vé">
            <Button variant="secondary" size="m" disabled={index === 0} onClick={() => setIndex(index - 1)}>← Vé trước</Button>
            <Button variant="secondary" size="m" disabled={index === n - 1} onClick={() => setIndex(index + 1)}>Vé sau →</Button>
          </nav>
        )}
      </main>
      <div className="tx-flow-actions">
        <Button variant="secondary" aria-pressed={wallet} onClick={() => setWallet(true)}>{wallet ? "✓ Đã thêm vào Ví" : "Thêm vào Ví"}</Button>
        <Button href={mapsHref} target="_blank" rel="noopener noreferrer" arrow aria-label="Chỉ đường (mở trong tab mới)">Chỉ đường</Button>
      </div>
    </>
  );
}
