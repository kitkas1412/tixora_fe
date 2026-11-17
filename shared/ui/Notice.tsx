import type { ReactNode } from "react";
import { cx } from "@/shared/lib/cx";

type Tone = "success" | "danger" | "warning" | "info";
const ICON: Record<Tone, string> = { success: "✓", danger: "✕", warning: "▲", info: "i" };

export function Notice({ tone = "info", title, children, className }: { tone?: Tone; title: ReactNode; children?: ReactNode; className?: string }) {
  return (
    <div role={tone === "danger" ? "alert" : "status"} className={cx("tx-notice", `tx-notice--${tone}`, className)}>
      <span className="tx-notice-icon" aria-hidden="true">{ICON[tone]}</span>
      <div><b>{title}</b>{children}</div>
    </div>
  );
}
