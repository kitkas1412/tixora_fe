"use client";
import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { buildCheckoutHref } from "@/shared/routing/flow-urls";
import { HOLD_SECONDS, newHoldExpiry } from "@/modules/booking/model/hold";
import { MAX_TICKETS, type TierKey } from "@/shared/kernel/tier";
import { MobileAppBar } from "@/shared/ui/layout/MobileAppBar";
import { MobileShell } from "@/shared/ui/layout/MobileShell";
import { Notice } from "@/shared/ui/Notice";
import { HoldTimer } from "@/modules/booking/ui/HoldTimer";
import { getSeatRows } from "@/modules/seating/model/seat-layout";
import type { PickerZone } from "@/modules/seating/model/zones";
import { SeatMap } from "@/modules/seating/ui/SeatMap";
import { SeatSummaryBar } from "@/modules/seating/ui/SeatSummaryBar";
import { ZoneTabs } from "@/modules/seating/ui/ZoneTabs";

/**
 * Màn chọn ghế (đảo tương tác). Hạn giữ vé chỉ được tạo khi người dùng chọn ghế đầu tiên (trong event handler),
 * nên không có Date.now() lúc render/prerender.
 */
export function SeatPicker({ slug, eventLine, zones, initialZone }: {
  slug: string; eventLine: string; zones: PickerZone[]; initialZone: TierKey;
}) {
  const router = useRouter();
  const [zone, setZone] = useState<TierKey>(initialZone);
  const [seats, setSeats] = useState<string[]>([]);
  const [hold, setHold] = useState<number | null>(null);
  const [expired, setExpired] = useState(false);
  const [busy, setBusy] = useState(false);

  const current = zones.find((z) => z.key === zone) ?? zones[0];
  const rows = useMemo(() => getSeatRows(current.key), [current.key]);

  const pickZone = (key: TierKey) => { if (key !== zone) { setZone(key); setSeats([]); } };
  const changeSeats = (ids: string[]) => {
    if (ids.length > 0 && hold === null) { setHold(newHoldExpiry()); setExpired(false); }
    setSeats(ids);
  };
  const onExpire = useCallback(() => { setSeats([]); setHold(null); setExpired(true); }, []);
  const next = () => {
    if (seats.length === 0) return;
    setBusy(true);
    router.push(buildCheckoutHref({ kind: "seats", slug, zone: current.key, seats, holdExpiresAt: hold ?? newHoldExpiry() }));
  };

  return (
    <MobileShell className="tx-flow-seat-shell">
      <MobileAppBar
        backHref={`/events/${encodeURIComponent(slug)}`}
        backLabel="Quay lại trang sự kiện"
        title={`Chọn ghế · ${current.name}`}
        subtitle={eventLine}
        right={hold !== null ? <HoldTimer compact expiresAt={hold} durationSec={HOLD_SECONDS} onExpire={onExpire} /> : undefined}
      />
      <main className="tx-flow-seat-main">
        {expired && (
          <Notice tone="warning" title="Hết thời gian giữ ghế">Ghế đã được trả lại. Vui lòng chọn lại.</Notice>
        )}
        <span className="tx-flow-step">01 — Khu</span>
        <ZoneTabs zones={zones} value={current.key} onChange={pickZone} />
        <div className="tx-flow-seat-body">
          <SeatMap
            key={current.key}
            fill
            rows={rows}
            selected={seats}
            onChange={changeSeats}
            max={MAX_TICKETS}
            disableAtMax={false}
            heading="02 — Ghế (vuốt ngang)"
          />
        </div>
      </main>
      <SeatSummaryBar
        seats={seats}
        max={MAX_TICKETS}
        unitPrice={current.price}
        onRemove={(id) => setSeats((p) => p.filter((x) => x !== id))}
        onContinue={next}
        busy={busy}
      />
    </MobileShell>
  );
}
