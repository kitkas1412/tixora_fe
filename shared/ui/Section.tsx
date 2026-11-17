import type { ReactNode } from "react";
import s from "./Section.module.css";

/** Bố cục Swiss: nhãn 3 cột + nội dung 9 cột, mở đầu bằng kẻ 2px. Dưới 1280px xếp chồng. */
export function Section({ title, description, children }: { title: ReactNode; description?: ReactNode; children: ReactNode }) {
  return (
    <section className={s.section}>
      <div className={s.aside}><h2>{title}</h2>{description && <p>{description}</p>}</div>
      <div className={s.content}>{children}</div>
    </section>
  );
}

/** Tiêu đề section toàn chiều rộng + vùng hành động bên phải (bộ lọc, link "Xem tất cả"). */
export function SectionHeader({ title, actions }: { title: ReactNode; actions?: ReactNode }) {
  return (
    <div className={s.header}><h2>{title}</h2>{actions}</div>
  );
}
