"use client";
import { cx } from "@/shared/lib/cx";
import { formatVND } from "@/shared/lib/format";
import type { TierKey } from "@/shared/kernel/tier";
import { TierSwatch } from "@/shared/ui/Labels";
import { QuantityStepper } from "@/modules/booking/ui/QuantityStepper";

export type TierRowProps = {
  tier: TierKey;
  name: string;
  /** Giá đã gồm phí (VND). */
  price: number;
  note?: string;
  soldOut?: boolean;
  lowStock?: boolean;
  quantity: number;
  /** Số vé còn được thêm (theo giới hạn tài khoản). */
  maxQuantity: number;
  onQuantityChange: (q: number) => void;
};

export function TierRow({ tier, name, price, note, soldOut, lowStock, quantity, maxQuantity, onQuantityChange }: TierRowProps) {
  return (
    <div className={cx("tx-booking-tier", soldOut && "tx-booking-tier--sold")}>
      <TierSwatch tier={tier} soldOut={soldOut} />
      <div className="tx-booking-tier-info">
        <b>{name}</b>
        {note && <span className="tx-booking-tier-note">{note}</span>}
        {soldOut && <span className={cx("tx-booking-tier-flag", "tx-booking-tier-flag--danger")}>✕ Hết vé</span>}
        {!soldOut && lowStock && <span className={cx("tx-booking-tier-flag", "tx-booking-tier-flag--warning")}>▲ Còn ít vé</span>}
      </div>
      <span className="tx-booking-tier-price">{formatVND(price)}</span>
      <QuantityStepper label={name} value={quantity} max={maxQuantity} disabled={soldOut} onChange={onQuantityChange} />
    </div>
  );
}
