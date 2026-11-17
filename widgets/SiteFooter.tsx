import Link from "next/link";
import { FOOTER_GROUPS } from "@/shared/content/site";
import s from "./Site.module.css";

/** Footer nền Flame, 4 cột (logo + 3 nhóm liên kết). Đặt ngoài `.tx-container`; tự bọc container bên trong. */
export function SiteFooter() {
  return (
    <footer className={s.footer}>
      <div className={`tx-container ${s.footerInner}`}>
        <b className={s.footerLogo}>tixora</b>
        {FOOTER_GROUPS.map((g, i) => {
          const last = i === FOOTER_GROUPS.length - 1;
          return (
            <nav key={g.title} className={s.col} aria-label={g.title}>
              <h2>{g.title}</h2>
              <ul>
                {g.links.map((l) => (
                  <li key={l.label}>{l.href.startsWith("/") ? <Link href={l.href}>{l.label}</Link> : <a href={l.href}>{l.label}</a>}</li>
                ))}
                {last && <li className={s.copy}>© 2026 Tixora</li>}
              </ul>
            </nav>
          );
        })}
      </div>
    </footer>
  );
}
