"use client";
import { useEffect, useState } from "react";
import { cx } from "../../lib/cx";
import { formatClock } from "../../lib/format";
import s from "./Ticketing.module.css";

/**
 * Đồng hồ giữ chỗ. Dưới `urgentAt` giây → nền Lỗi và đọc to MỘT lần (aria-live assertive).
 * `expiresAt`: mốc hết hạn (ms). `durationSec`: tổng thời gian giữ để tính thanh tiến độ.
 */
export function HoldTimer({ expiresAt, durationSec = 600, urgentAt = 120, compact, onExpire }: {
  expiresAt: number; durationSec?: number; urgentAt?: number; compact?: boolean; onExpire?: () => void;
}) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const left = Math.max(0, Math.round((expiresAt - now) / 1000));
  const expired = left === 0;
  const urgent = !expired && left <= urgentAt;
  useEffect(() => { if (expired) onExpire?.(); }, [expired, onExpire]);

  const label = expired ? "✕ Hết giờ — vé đã trả lại" : urgent ? "▲ Sắp hết giờ" : "Đang giữ vé";
  if (compact) {
    return <span role="timer" aria-label={`${label} ${formatClock(left)}`} className={cx(s.timerCompact, urgent && s.timerUrgent)}>{formatClock(left)}</span>;
  }
  return (
    <div role="timer" className={cx(s.timer, urgent && s.timerUrgent, expired && s.timerExpired)}>
      <b>{label}</b>
      <b>{formatClock(left)}</b>
      <div className={s.track}><div className={s.bar} style={{ width: `${(left / durationSec) * 100}%` }} /></div>
      <span className="tx-sr-only" aria-live="assertive">{urgent && left === urgentAt ? `Còn ${Math.round(urgentAt / 60)} phút để thanh toán` : ""}</span>
    </div>
  );
}
