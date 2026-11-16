import Link from "next/link";
import type { ReactNode } from "react";
import s from "./Layout.module.css";

export type MobileAppBarProps = {
  backHref: string;
  /** Nhãn đọc màn hình cho nút quay lại. */
  backLabel?: string;
  title: string;
  subtitle?: string;
  /** VD: "02 / 03" hoặc <HoldTimer/>. */
  right?: ReactNode;
};

/** Thanh tiêu đề dính trên cùng của màn hình di động. */
export function MobileAppBar({ backHref, backLabel = "Quay lại", title, subtitle, right }: MobileAppBarProps) {
  return (
    <header className={s.appBar}>
      <Link href={backHref} className={s.back} aria-label={backLabel}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="square" aria-hidden="true"><path d="M19 12H5M11 5l-7 7 7 7" /></svg>
      </Link>
      <div className={s.titles}>
        <h1 className={s.title}>{title}</h1>
        {subtitle && <span className={s.subtitle}>{subtitle}</span>}
      </div>
      {right && <div className={s.right}>{right}</div>}
    </header>
  );
}
