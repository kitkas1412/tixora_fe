import type { ReactNode } from "react";
import { cx } from "@/shared/lib/cx";
import s from "./Layout.module.css";

/** Thanh hành động dính đáy (kẻ đậm 2px trên, tôn trọng safe-area). Đặt cuối MobileShell. */
export function StickyBar({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx(s.sticky, className)}>{children}</div>;
}
