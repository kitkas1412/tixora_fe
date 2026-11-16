import Link from "next/link";
import { DEMO_TICKET_HREF } from "../../lib/order";
import s from "./Layout.module.css";

export type Crumb = { label: string; href?: string };
export type SiteHeaderProps =
  | { variant?: "full" }
  /** Breadcrumb: mục cuối không cần href (hiện là trang hiện tại). */
  | { variant: "slim"; crumbs: Crumb[] };

function Logo() {
  return (
    <Link href="/" className={s.logo} aria-label="Tixora, về trang chủ">
      tixora<span className={s.logoMark} aria-hidden="true" />
    </Link>
  );
}

/** Thanh điều hướng trên cùng. "full": trang chủ; "slim": trang chi tiết. Tìm kiếm và Đăng nhập chỉ là giao diện. */
export function SiteHeader(props: SiteHeaderProps) {
  if (props.variant === "slim") {
    return (
      <header className={s.header}>
        <div className={s.nav}>
          <Logo />
          <nav aria-label="Đường dẫn">
            <ol className={s.crumbs}>
              {props.crumbs.map((c, i) => {
                const last = i === props.crumbs.length - 1;
                return (
                  <li key={`${c.label}-${i}`}>
                    {c.href && !last ? <Link href={c.href}>{c.label}</Link> : <span aria-current={last ? "page" : undefined}>{c.label}</span>}
                  </li>
                );
              })}
            </ol>
          </nav>
          <nav aria-label="Chính" className={s.push}>
            <Link href={DEMO_TICKET_HREF} className={s.link}>Vé của tôi</Link>
          </nav>
        </div>
      </header>
    );
  }
  return (
    <header className={s.header}>
      <div className={s.nav}>
        <Logo />
        <nav aria-label="Chính">
          <ul className={s.links}>
            <li><Link href="/" className={s.link}>Concert</Link></li>
            <li><Link href="/" className={s.link}>Festival</Link></li>
            <li><Link href="/" className={s.link}>Liveshow</Link></li>
            <li><Link href={DEMO_TICKET_HREF} className={s.link}>Vé của tôi</Link></li>
          </ul>
        </nav>
        <div role="search" className={s.search}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>
          <input type="search" aria-label="Tìm kiếm" placeholder="Nghệ sĩ, sự kiện, địa điểm" />
        </div>
        <button type="button" className={s.login}>Đăng nhập</button>
      </div>
    </header>
  );
}
