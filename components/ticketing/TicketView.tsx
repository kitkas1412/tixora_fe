"use client";
import { useState } from "react";
import type { TierKey } from "../../lib/types";
import { MobileAppBar } from "../layout/MobileAppBar";
import { Button } from "../ui/Button";
import { FakeQr } from "./FakeQr";
import { TicketCard } from "./TicketCard";
import s from "./Flow.module.css";

export type TicketModel = {
  tier: TierKey;
  /** Mã hiển thị trên vé, duy nhất cho từng vé. */
  code: string;
  facts: { label: string; value: string }[];
};

/** Màn "Vé của tôi": phân trang giữa các vé trong cùng đơn. Thuần trình bày, không có thao tác thật. */
export function TicketView({ title, category, tickets, mapsHref, justPaid = false }: {
  title: string; category: string; tickets: TicketModel[]; mapsHref: string; justPaid?: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [wallet, setWallet] = useState(false);
  const n = tickets.length;
  const t = tickets[index];
  return (
    <>
      <MobileAppBar backHref="/" backLabel="Về trang chủ" title="Vé của tôi" right={`Vé ${index + 1} / ${n}`} />
      {justPaid && <div role="status" className={s.paid}>✓ Thanh toán thành công · đã gửi vé về email</div>}
      <main className={s.main}>
        <TicketCard title={title} category={category} tier={t.tier} facts={t.facts} code={t.code} qr={<FakeQr value={t.code} />} />
        {n > 1 && (
          <nav className={s.pager} aria-label="Chọn vé">
            <Button variant="secondary" size="m" disabled={index === 0} onClick={() => setIndex(index - 1)}>← Vé trước</Button>
            <Button variant="secondary" size="m" disabled={index === n - 1} onClick={() => setIndex(index + 1)}>Vé sau →</Button>
          </nav>
        )}
      </main>
      <div className={s.actions}>
        <Button variant="secondary" aria-pressed={wallet} onClick={() => setWallet(true)}>{wallet ? "✓ Đã thêm vào Ví" : "Thêm vào Ví"}</Button>
        <Button href={mapsHref} target="_blank" rel="noopener noreferrer" arrow aria-label="Chỉ đường (mở trong tab mới)">Chỉ đường</Button>
      </div>
    </>
  );
}
