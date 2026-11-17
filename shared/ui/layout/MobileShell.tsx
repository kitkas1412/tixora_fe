import type { ReactNode } from "react";
import { cx } from "@/shared/lib/cx";

/** Cột di động căn giữa, rộng tối đa 480px, cao tối thiểu toàn màn hình. Đặt MobileAppBar, <main>, StickyBar bên trong. */
export function MobileShell({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx("tx-mobile-shell", className)}>{children}</div>;
}
