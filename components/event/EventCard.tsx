import Link from "next/link";
import type { ReactNode } from "react";
import s from "./Event.module.css";

export type EventCardProps = {
  href: string;
  title: string;
  /** VD: "24.01 — TP.HCM" */
  meta: ReactNode;
  /** VD: "K-pop" hoặc <StatusLabel/> */
  metaRight?: ReactNode;
  venue: string;
  /** Giá đã gồm phí, đã format. VD: "từ 800.000đ" */
  price: string;
  image?: { src: string; alt: string };
};

/** Thẻ sự kiện dạng lưới (khám phá). Không khung — chỉ kẻ đậm trên. Ảnh đơn sắc, hover hiện màu. */
export function EventCard({ href, title, meta, metaRight, venue, price, image }: EventCardProps) {
  return (
    <Link href={href} className={s.card}>
      <div className={s.meta}><span>{meta}</span>{metaRight && <span>{metaRight}</span>}</div>
      <div className={s.media}>{image && <img src={image.src} alt={image.alt} loading="lazy" />}</div>
      <b className={s.title}>{title}</b>
      <div className={s.foot}><span>{venue}</span><b>{price}</b></div>
    </Link>
  );
}

export function EventGrid({ children }: { children: ReactNode }) {
  return <div className={s.grid}>{children}</div>;
}
