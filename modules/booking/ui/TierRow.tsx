"use client";
import { cx } from "@/shared/lib/cx";
import { formatVND } from "@/shared/lib/format";
import type { TierKey } from "@/shared/kernel/tier";
import { TierSwatch } from "@/shared/ui/Labels";
import { QuantityStepper } from "@/modules/booking/ui/QuantityStepper";
import s from "./Booking.module.css";

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
    <div className={cx(s.tier, soldOut && s.tierSold)}>
      <TierSwatch tier={tier} soldOut={soldOut} />
      <div className={s.tierInfo}>
        <b>{name}</b>
        {note && <span className={s.tierNote}>{note}</span>}
        {soldOut && <span className={cx(s.tierFlag, s.flagDanger)}>✕ Hết vé</span>}
        {!soldOut && lowStock && <span className={cx(s.tierFlag, s.flagWarning)}>▲ Còn ít vé</span>}
      </div>
      <span className={s.tierPrice}>{formatVND(price)}</span>
      <QuantityStepper label={name} value={quantity} max={maxQuantity} disabled={soldOut} onChange={onQuantityChange} />
    </div>
  );
}
