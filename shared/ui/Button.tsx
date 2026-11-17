import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "@/shared/lib/cx";

type Variant = "primary" | "onBrand" | "secondary" | "link";
type Size = "l" | "m" | "s";
const VARIANT_CLASS: Record<Variant, string> = { primary: "tx-btn--primary", onBrand: "tx-btn--on-brand", secondary: "tx-btn--secondary", link: "tx-btn--link" };

type Common = {
  variant?: Variant;
  size?: Size;
  /** Hiện mũi tên → ở cuối (Swiss: báo hiệu "đi tiếp"). */
  arrow?: boolean;
  fullWidth?: boolean;
  loading?: boolean;
  loadingText?: string;
  children: ReactNode;
  className?: string;
};

export type ButtonProps = Common & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
export type ButtonLinkProps = Common & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; disabled?: boolean };

/**
 * Nút tixora. `primary` (Flame) trên nền sáng, `onBrand` (Ink) khi nằm trên khối Flame.
 * Truyền `href` để render thành link (next/link).
 */
export function Button(props: ButtonProps | ButtonLinkProps) {
  const { variant = "primary", size = "l", arrow, fullWidth, loading, loadingText = "Đang xử lý…", children, className, ...rest } = props;
  const cls = cx("tx-btn", VARIANT_CLASS[variant], variant !== "link" && `tx-btn--${size}`, fullWidth && "tx-btn--full", className);
  const content = loading ? (
    <span style={{ display: "inline-flex", alignItems: "center" }}>
      <span className="tx-btn-dots" aria-hidden="true"><span /><span /><span /></span>
      {loadingText}
    </span>
  ) : (
    <>
      <span>{children}</span>
      {arrow && <span className="tx-btn-arrow" aria-hidden="true">→</span>}
    </>
  );

  if (typeof props.href === "string") {
    const { href, disabled, ...a } = rest as ButtonLinkProps;
    if (disabled) {
      return <span role="link" aria-disabled="true" className={cls}>{content}</span>;
    }
    return <Link href={href} className={cls} {...a}>{content}</Link>;
  }

  const b = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button type="button" {...b} className={cls} disabled={b.disabled || loading} aria-busy={loading || undefined}>
      {content}
    </button>
  );
}

/** Nút vuông 48px chỉ có icon — luôn cần `label` cho trình đọc màn hình. */
export function IconButton({ label, children, className, ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button type="button" aria-label={label} className={cx("tx-btn-icon", className)} {...rest}>
      {children}
    </button>
  );
}
