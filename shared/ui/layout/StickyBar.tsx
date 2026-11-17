import type { ReactNode } from "react";
import { cx } from "@/shared/lib/cx";

/** Thanh hành động dính đáy (kẻ đậm 2px trên, tôn trọng safe-area). Đặt cuối MobileShell. */
export function StickyBar({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx("tx-sticky-bar", className)}>{children}</div>;
}
