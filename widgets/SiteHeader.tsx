import Link from "next/link";
import { DEMO_TICKET_HREF } from "@/shared/routing/flow-urls";

export type Crumb = { label: string; href?: string };
export type SiteHeaderProps =
  | { variant?: "full" }
  /** Breadcrumb: mục cuối không cần href (hiện là trang hiện tại). */
  | { variant: "slim"; crumbs: Crumb[] };

function Logo() {
  return (
    <Link href="/" className="tx-site-logo" aria-label="Tixora, về trang chủ">
      tixora<span className="tx-site-logo-mark" aria-hidden="true" />
    </Link>
  );
}

/** Thanh điều hướng trên cùng. "full": trang chủ; "slim": trang chi tiết. Tìm kiếm và Đăng nhập chỉ là giao diện. */
export function SiteHeader(props: SiteHeaderProps) {
  if (props.variant === "slim") {
    return (
      <header className="tx-site-header">
        <div className="tx-site-nav">
          <Logo />
          <nav aria-label="Đường dẫn">
            <ol className="tx-site-crumbs">
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
          <nav aria-label="Chính" className="tx-site-push">
            <Link href={DEMO_TICKET_HREF} className="tx-site-link">Vé của tôi</Link>
          </nav>
        </div>
      </header>
    );
  }
  return (
    <header className="tx-site-header">
      <div className="tx-site-nav">
        <Logo />
        <nav aria-label="Chính">
          <ul className="tx-site-links">
            <li><Link href="/" className="tx-site-link">Concert</Link></li>
            <li><Link href="/" className="tx-site-link">Festival</Link></li>
            <li><Link href="/" className="tx-site-link">Liveshow</Link></li>
            <li><Link href={DEMO_TICKET_HREF} className="tx-site-link">Vé của tôi</Link></li>
          </ul>
        </nav>
        <div role="search" className="tx-site-search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>
          <input type="search" aria-label="Tìm kiếm" placeholder="Nghệ sĩ, sự kiện, địa điểm" />
        </div>
        <button type="button" className="tx-site-login">Đăng nhập</button>
      </div>
    </header>
  );
}
