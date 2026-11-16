"use client";
import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { buildCheckoutHref, HOLD_SECONDS, MAX_TICKETS, newHoldExpiry } from "../../lib/order";
import type { TierKey } from "../../lib/types";
import { MobileAppBar } from "../layout/MobileAppBar";
import { MobileShell } from "../layout/MobileShell";
import { Notice } from "../ui/Notice";
import { HoldTimer } from "./HoldTimer";
import { SeatMap } from "./SeatMap";
import { SeatSummaryBar } from "./SeatSummaryBar";
import { getSeatRows } from "./seatLayout";
import { ZoneTabs, type ZoneTabItem } from "./ZoneTabs";
import s from "./Flow.module.css";

export type PickerZone = ZoneTabItem & { price: number };

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
    <MobileShell className={s.seatShell}>
      <MobileAppBar
        backHref={`/events/${encodeURIComponent(slug)}`}
        backLabel="Quay lại trang sự kiện"
        title={`Chọn ghế · ${current.name}`}
        subtitle={eventLine}
        right={hold !== null ? <HoldTimer compact expiresAt={hold} durationSec={HOLD_SECONDS} onExpire={onExpire} /> : undefined}
      />
      <main className={s.seatMain}>
        {expired && (
          <Notice tone="warning" title="Hết thời gian giữ ghế">Ghế đã được trả lại. Vui lòng chọn lại.</Notice>
        )}
        <span className={s.step}>01 — Khu</span>
        <ZoneTabs zones={zones} value={current.key} onChange={pickZone} />
        <div className={s.seatBody}>
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
