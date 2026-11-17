"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { buildCheckoutHref, buildSeatsHref } from "@/shared/routing/flow-urls";
import { newHoldExpiry } from "@/modules/booking/model/hold";
import { computeTotals } from "@/modules/booking/model/totals";
import type { EventItem } from "@/modules/catalog/model/types";
import { MAX_TICKETS, type TierKey, type TierQuantities } from "@/shared/kernel/tier";
import { Button } from "@/shared/ui/Button";
import { OrderSummary } from "@/modules/booking/ui/OrderSummary";
import { TierRow } from "@/modules/booking/ui/TierRow";

/**
 * Cột chính + cột "Đơn của bạn" của trang chi tiết. Số lượng theo hạng dùng chung cho
 * TierRow và OrderSummary. `children` (server) là phần "Giới thiệu", đặt dưới danh sách hạng vé.
 */
export function TierSelector({ event, children }: { event: EventItem; children?: ReactNode }) {
  const router = useRouter();
  const [qty, setQty] = useState<TierQuantities>({});
  const open = event.status === "on-sale" || event.status === "low";
  const lines = event.tiers.map((t) => ({ tier: t, quantity: qty[t.key] ?? 0 }));
  const totals = computeTotals(lines.map((l) => ({ price: l.tier.price, quantity: l.quantity })));
  const set = (key: TierKey, q: number) => setQty((p) => ({ ...p, [key]: q }));

  const checkout = () => {
    if (totals.count === 0) return;
    router.push(buildCheckoutHref({ kind: "tiers", slug: event.slug, quantities: qty, holdExpiresAt: newHoldExpiry() }));
  };

  const emptyLabel = !open ? (event.status === "upcoming" ? "Chưa mở bán" : "Đã hết vé") : "Chọn ít nhất 1 vé";

  return (
    <div className="tx-tier-selector">
      <div className="tx-tier-selector-col">
        <section className="tx-tier-selector-tiers" aria-labelledby="tier-title">
          <div className="tx-tier-selector-head">
            <h2 id="tier-title">Chọn hạng vé</h2>
            {open && <Link href={buildSeatsHref(event.slug)} className="tx-tier-selector-seat-link">Xem sơ đồ ghế →</Link>}
          </div>
          {event.tiers.map((t) => {
            const q = qty[t.key] ?? 0;
            const buyable = open && (t.status === "on-sale" || t.status === "low");
            return (
              <TierRow
                key={t.key}
                tier={t.key}
                name={t.name}
                price={t.price}
                note={t.note}
                soldOut={t.status === "sold-out"}
                lowStock={t.status === "low"}
                quantity={q}
                maxQuantity={buyable ? Math.min(t.remaining, q + MAX_TICKETS - totals.count) : q}
                onQuantityChange={(n) => set(t.key, n)}
              />
            );
          })}
          <p className="tx-tier-selector-note">Giá minh hoạ, đã gồm phí dịch vụ. Tối đa {MAX_TICKETS} vé / tài khoản.</p>
        </section>
        {children}
      </div>
      <div className="tx-tier-selector-aside">
        <OrderSummary
          lines={lines.filter((l) => l.quantity > 0).map((l) => ({ label: l.tier.name, quantity: l.quantity, amount: l.tier.price * l.quantity }))}
          action={
            <Button variant="primary" size="l" arrow fullWidth disabled={totals.count === 0 || !open} onClick={checkout}>
              {totals.count === 0 || !open ? emptyLabel : "Giữ vé & thanh toán"}
            </Button>
          }
        />
      </div>
    </div>
  );
}
