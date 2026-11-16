"use client";
import { useEffect, useState } from "react";
import { cx } from "../../lib/cx";
import { formatClock, holdSecondsLeft } from "../../lib/format";
import s from "./Ticketing.module.css";

/**
 * Đồng hồ giữ chỗ. Dưới `urgentAt` giây → nền Lỗi và đọc to MỘT lần (aria-live assertive).
 * `expiresAt`: mốc hết hạn (ms). `durationSec`: tổng thời gian giữ để tính thanh tiến độ.
 */
export function HoldTimer({ expiresAt, durationSec = 600, urgentAt = 120, criticalAt = 60, compact, onExpire }: {
  expiresAt: number; durationSec?: number; urgentAt?: number; criticalAt?: number; compact?: boolean; onExpire?: () => void;
}) {
  // `now` = null cho tới khi mount: tránh Date.now() lúc prerender/hydrate (lệch giây giữa server và client).
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 1000);
    return () => { clearTimeout(first); clearInterval(id); };
  }, []);
  const ready = now !== null;
  const left = ready ? holdSecondsLeft(expiresAt, now) : durationSec;
  const expired = ready && left === 0;
  const urgent = !expired && left <= urgentAt;
  const critical = urgent && left <= criticalAt; // ≤ 60s: nhấp nháy opacity chậm (CSS, tắt khi giảm chuyển động)
  useEffect(() => { if (expired) onExpire?.(); }, [expired, onExpire]);

  const clock = ready ? formatClock(left) : "--:--";
  const label = expired ? "✕ Hết giờ — vé đã trả lại" : urgent ? "▲ Sắp hết giờ" : "Đang giữ vé";
  if (compact) {
    return <span role="timer" aria-label={`${label} ${clock}`} className={cx(s.timerCompact, urgent && s.timerUrgent, critical && s.timerCritical)}>{clock}</span>;
  }
  return (
    <div role="timer" className={cx(s.timer, urgent && s.timerUrgent, critical && s.timerCritical, expired && s.timerExpired)}>
      <b>{label}</b>
      <b>{clock}</b>
      <div className={s.track}><div className={s.bar} style={{ width: `${(left / durationSec) * 100}%` }} /></div>
      <span className="tx-sr-only" aria-live="assertive">{urgent && left === urgentAt ? `Còn ${Math.round(urgentAt / 60)} phút để thanh toán` : ""}</span>
    </div>
  );
}
