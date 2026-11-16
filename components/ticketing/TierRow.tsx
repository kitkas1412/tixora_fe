"use client";
import { cx } from "../../lib/cx";
import { formatVND } from "../../lib/format";
import type { TierKey } from "../../lib/types";
import { TierSwatch } from "../ui/Labels";
import { QuantityStepper } from "./QuantityStepper";
import s from "./Ticketing.module.css";

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
