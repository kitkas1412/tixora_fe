import type { ReactNode } from "react";
import { cx } from "@/shared/lib/cx";
import s from "./Notice.module.css";

type Tone = "success" | "danger" | "warning" | "info";
const ICON: Record<Tone, string> = { success: "✓", danger: "✕", warning: "▲", info: "i" };

export function Notice({ tone = "info", title, children, className }: { tone?: Tone; title: ReactNode; children?: ReactNode; className?: string }) {
  return (
    <div role={tone === "danger" ? "alert" : "status"} className={cx(s.notice, s[tone], className)}>
      <span className={s.icon} aria-hidden="true">{ICON[tone]}</span>
      <div><b>{title}</b>{children}</div>
    </div>
  );
}
