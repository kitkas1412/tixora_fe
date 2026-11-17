import Link from "next/link";
import type { ReactNode } from "react";
import { cx } from "@/shared/lib/cx";
import type { SaleStatus } from "@/shared/kernel/sale";
import { StatusLabel } from "@/shared/ui/Labels";
import s from "./Event.module.css";

export type EventRowProps = {
  href: string;
  day: string;   // "06"
  month: string; // "12"
  title: string;
  subtitle?: string; // thể loại
  venue: string;
  status: SaleStatus;
  statusText?: string;
};

const CTA: Record<SaleStatus, { text: string; cls?: string }> = {
  "on-sale": { text: "Mua vé" }, low: { text: "Mua vé" }, upcoming: { text: "Nhắc tôi", cls: s.ctaGhost }, "sold-out": { text: "Hết", cls: s.ctaMuted },
};

/** Lịch diễn dạng bảng. Trên mobile cuộn ngang trong khung. */
export function EventTable({ children, caption = "Lịch diễn" }: { children: ReactNode; caption?: string }) {
  return (
    <div className={s.table} role="region" aria-label={caption} tabIndex={0}>
      <div className={s.tableInner}>
        <div className={cx(s.cols, s.head)} aria-hidden="true"><span>Ngày</span><span>Sự kiện</span><span>Địa điểm</span><span>Trạng thái</span><span /></div>
        {children}
      </div>
    </div>
  );
}

export function EventRow({ href, day, month, title, subtitle, venue, status, statusText }: EventRowProps) {
  const cta = CTA[status];
  return (
    <Link href={href} className={cx(s.cols, s.row)}>
      <b className={s.date}>{day}<small>.{month}</small></b>
      <span className={s.name}><b>{title}</b>{subtitle && <span>{subtitle}</span>}</span>
      <span>{venue}</span>
      <StatusLabel status={status}>{statusText}</StatusLabel>
      <span className={cx(s.cta, cta.cls)} aria-hidden="true">{cta.text}</span>
    </Link>
  );
}
