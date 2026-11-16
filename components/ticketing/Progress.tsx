"use client";
import { useEffect, useState } from "react";
import { cx } from "../../lib/cx";
import s from "./Ticketing.module.css";

/** Tiến trình mua vé: vạch 6px — đen = xong, Flame = đang ở, xám = chưa tới. */
export function Steps({ steps, current }: { steps: string[]; current: number }) {
  return (
    <ol className={s.steps}>
      {steps.map((label, i) => (
        <li key={label} className={cx(i < current && s.stepDone, i === current && s.stepCurrent)} aria-current={i === current ? "step" : undefined}>
          <small>{String(i + 1).padStart(2, "0")}{i < current ? " ✓" : ""}</small>{label}
        </li>
      ))}
    </ol>
  );
}

/** Đếm ngược tới giờ mở bán. */
export function Countdown({ target }: { target: number }) {
  const [now, setNow] = useState<number | null>(null); // null tới khi mount: tránh Date.now() lúc prerender/hydrate
  useEffect(() => {
    const tick = () => setNow(Date.now());
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 1000);
    return () => { clearTimeout(first); clearInterval(id); };
  }, []);
  const t = now === null ? 0 : Math.max(0, Math.ceil((target - now) / 1000));
  const parts = [[Math.floor(t / 86400), "ngày"], [Math.floor((t % 86400) / 3600), "giờ"], [Math.floor((t % 3600) / 60), "phút"], [t % 60, "giây"]] as const;
  return (
    <div className={s.countdown} role="timer">
      {parts.map(([n, unit]) => <div key={unit}><b>{now === null ? "--" : String(n).padStart(2, "0")}</b><span>{unit}</span></div>)}
    </div>
  );
}
