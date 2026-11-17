"use client";
import { RadioGroup } from "@/shared/ui/Field";

export const PAYMENT_METHODS = [
  { value: "momo", label: "Ví MoMo" },
  { value: "zalopay", label: "ZaloPay" },
  { value: "vnpay", label: "VNPay QR" },
  { value: "card", label: "Thẻ ATM / Visa / Master" },
];

/** Danh sách phương thức thanh toán (radio gốc trong fieldset). */
export function PaymentMethods({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return <RadioGroup legend="Phương thức thanh toán" name="payment" value={value} onChange={onChange} options={PAYMENT_METHODS} />;
}
