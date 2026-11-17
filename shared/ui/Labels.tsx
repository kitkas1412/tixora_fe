import type { ReactNode } from "react";
import { cx } from "@/shared/lib/cx";
import type { SaleStatus } from "@/shared/kernel/sale";
import type { TierKey } from "@/shared/kernel/tier";

const STATUS_TEXT: Record<SaleStatus, string> = { "on-sale": "Đang bán", low: "Còn ít vé", upcoming: "Sắp mở bán", "sold-out": "Hết vé" };

/** Trạng thái bán = ô vuông 8px + chữ. Không bao giờ chỉ dùng màu. */
export function StatusLabel({ status, children, className }: { status: SaleStatus; children?: ReactNode; className?: string }) {
  return (
    <span className={cx("tx-status", `tx-status--${status}`, className)}>
      <span className="tx-status-dot" aria-hidden="true" />
      {children ?? STATUS_TEXT[status]}
    </span>
  );
}

/** Nhãn nổi bật nền Volt (Early bird, Mới…). Dùng tiết kiệm — đây là phần 10%. */
export function HighlightTag({ children }: { children: ReactNode }) {
  return <span className="tx-highlight">{children}</span>;
}

const TIER_TEXT: Record<TierKey, string> = { svip: "SVIP", vip: "VIP", cat1: "CAT 1", cat2: "CAT 2" };

export function TierBadge({ tier, soldOut, children }: { tier: TierKey; soldOut?: boolean; children?: ReactNode }) {
  if (soldOut) return <span className={cx("tx-tier", "tx-tier--soldout")}>✕ {children ?? TIER_TEXT[tier]}</span>;
  return <span className={cx("tx-tier", `tx-tier--${tier}`)}>{children ?? TIER_TEXT[tier]}</span>;
}

/** Dải màu dọc 16px ở đầu hàng hạng vé. */
export function TierSwatch({ tier, soldOut }: { tier: TierKey; soldOut?: boolean }) {
  return <span aria-hidden="true" className={cx("tx-tier-swatch", soldOut ? "tx-tier--soldout" : `tx-tier--${tier}`)} />;
}
