import s from "./Ticketing.module.css";

/** Phòng chờ ảo khi mở bán. Nền Ink → focus dùng Volt (class tx-on-dark). */
export function QueuePanel({ position, progress, etaText }: { position: number; progress: number; etaText: string }) {
  return (
    <div className={`${s.queue} tx-on-dark`} role="status" aria-live="polite">
      <small>PHÒNG CHỜ</small>
      <strong>{position.toLocaleString("vi-VN")}</strong>
      <span>người đứng trước bạn · {etaText}</span>
      <div className={s.queueTrack}><div className={s.queueBar} style={{ width: `${Math.round(progress * 100)}%` }} /></div>
      <span className={s.queueNote}>Đừng tải lại trang. Khi tới lượt, bạn có 10 phút để chọn vé.</span>
    </div>
  );
}
