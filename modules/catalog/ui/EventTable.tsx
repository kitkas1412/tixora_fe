import Link from "next/link";
import type { ReactNode } from "react";
import { cx } from "@/shared/lib/cx";
import type { SaleStatus } from "@/shared/kernel/sale";
import { StatusLabel } from "@/shared/ui/Labels";

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
  "on-sale": { text: "Mua vé" }, low: { text: "Mua vé" }, upcoming: { text: "Nhắc tôi", cls: "tx-event-table-cta--ghost" }, "sold-out": { text: "Hết", cls: "tx-event-table-cta--muted" },
};

/** Lịch diễn dạng bảng. Trên mobile cuộn ngang trong khung. */
export function EventTable({ children, caption = "Lịch diễn" }: { children: ReactNode; caption?: string }) {
  return (
    <div className="tx-event-table" role="region" aria-label={caption} tabIndex={0}>
      <div className="tx-event-table-inner">
        <div className={cx("tx-event-table-cols", "tx-event-table-head")} aria-hidden="true"><span>Ngày</span><span>Sự kiện</span><span>Địa điểm</span><span>Trạng thái</span><span /></div>
        {children}
      </div>
    </div>
  );
}

export function EventRow({ href, day, month, title, subtitle, venue, status, statusText }: EventRowProps) {
  const cta = CTA[status];
  return (
    <Link href={href} className={cx("tx-event-table-cols", "tx-event-table-row")}>
      <b className="tx-event-table-date">{day}<small>.{month}</small></b>
      <span className="tx-event-table-name"><b>{title}</b>{subtitle && <span>{subtitle}</span>}</span>
      <span>{venue}</span>
      <StatusLabel status={status}>{statusText}</StatusLabel>
      <span className={cx("tx-event-table-cta", cta.cls)} aria-hidden="true">{cta.text}</span>
    </Link>
  );
}
