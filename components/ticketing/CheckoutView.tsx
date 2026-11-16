"use client";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { DUR, EASE, gsap, MQ_REDUCE, useGSAP } from "../../lib/motion";
import { buildTicketHref, generateOrderCode, HOLD_MINUTES, HOLD_SECONDS, newHoldExpiry, orderToTicketSummary, type CheckoutOrder } from "../../lib/order";
import type { TierKey } from "../../lib/types";
import { MobileAppBar } from "../layout/MobileAppBar";
import { StickyBar } from "../layout/StickyBar";
import { Button } from "../ui/Button";
import { Checkbox, TextField } from "../ui/Field";
import { TierSwatch } from "../ui/Labels";
import { Notice } from "../ui/Notice";
import { HoldTimer } from "./HoldTimer";
import { PaymentMethods } from "./PaymentMethods";
import s from "./Flow.module.css";

export type CheckoutModel = {
  order: CheckoutOrder;
  title: string;
  /** "06.12 · 19:30 · VIP · C-06, C-07" */
  detail: string;
  swatch: TierKey;
  count: number;
  /** "2 × 2.500.000đ" */
  breakdown: string;
  total: number;
  totalText: string;
  /** Quay lại chọn ghế (đơn ghế) hoặc trang sự kiện (đơn theo hạng). */
  backHref: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CCCD_RE = /^\d{12}$/;

/** Màn thanh toán (đảo tương tác): hạn giữ, form, chuyển sang vé. Thời gian/mã đơn chỉ tạo ở client. */
export function CheckoutView({ model }: { model: CheckoutModel }) {
  const router = useRouter();
  const [hold, setHold] = useState<number | null>(model.order.holdExpiresAt);
  const [expired, setExpired] = useState(false);
  const [email, setEmail] = useState("");
  const [cccd, setCccd] = useState("");
  const [pay, setPay] = useState("momo");
  const [vat, setVat] = useState(false);
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; cccd?: string; terms?: string }>({});
  const [busy, setBusy] = useState(false);

  // Không có tham số hold: bắt đầu giữ vé khi vào trang (client, sau mount).
  useEffect(() => {
    if (hold !== null) return;
    const id = setTimeout(() => setHold(newHoldExpiry()), 0);
    return () => clearTimeout(id);
  }, [hold]);
  // Chặn giữ vé vô hạn qua URL: hạn xa hơn HOLD_MINUTES thì kéo về now + HOLD_MINUTES.
  useEffect(() => {
    if (hold === null) return;
    const id = setTimeout(() => {
      const now = Date.now();
      if (hold - now > HOLD_MINUTES * 60_000) setHold(newHoldExpiry(now));
    }, 0);
    return () => clearTimeout(id);
  }, [hold]);
  const onExpire = useCallback(() => setExpired(true), []);

  const { contextSafe } = useGSAP();
  // Nudge ngang 4px đúng một lần; không chạy khi giảm chuyển động.
  const nudge = contextSafe((el: HTMLElement | null) => {
    if (!el || window.matchMedia(MQ_REDUCE).matches) return;
    const target = el instanceof HTMLInputElement && el.type === "checkbox" ? (el.parentElement ?? el) : el;
    gsap.fromTo(target, { x: 4 }, { x: 0, duration: DUR.base, ease: EASE, clearProps: "transform" });
  });
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (expired || busy) return;
    const next = {
      email: EMAIL_RE.test(email.trim()) ? undefined : "Nhập email hợp lệ, ví dụ ten@email.com",
      cccd: CCCD_RE.test(cccd.trim()) ? undefined : "CCCD gồm đúng 12 chữ số",
      terms: terms ? undefined : "Cần đồng ý điều khoản mua vé để tiếp tục",
    };
    setErrors(next);
    const firstId = next.email ? "co-email" : next.cccd ? "co-cccd" : next.terms ? "co-terms" : null;
    if (firstId) { const el = document.getElementById(firstId); el?.focus(); nudge(el); return; }
    setBusy(true);
    const code = generateOrderCode();
    router.push(buildTicketHref(orderToTicketSummary(model.order, code)));
  };

  return (
    <>
      <MobileAppBar backHref={model.backHref} backLabel="Quay lại" title="Thanh toán" right="02 / 03" />
      {hold !== null && (
        <div className={s.hold}>
          <span>Vé được giữ trong</span>
          <HoldTimer compact expiresAt={hold} durationSec={HOLD_SECONDS} onExpire={onExpire} />
        </div>
      )}
      <main className={s.main}>
        {expired ? (
          <>
            <Notice tone="danger" title="Đã hết thời gian giữ vé">Vé đã được trả lại. Hãy chọn lại để tiếp tục thanh toán.</Notice>
            <Button href={model.backHref} arrow fullWidth>{model.order.kind === "seats" ? "Chọn lại ghế" : "Về trang sự kiện"}</Button>
          </>
        ) : (
          <>
            <div className={s.orderLine}>
              <TierSwatch tier={model.swatch} />
              <div className={s.orderInfo}><b>{model.title}</b><span>{model.detail}</span></div>
              <b className={s.orderQty}>× {model.count}</b>
            </div>
            <form id="checkout-form" className={s.form} onSubmit={submit} noValidate>
              <div className={s.fields}>
                <TextField id="co-email" label="Email nhận vé" type="email" autoComplete="email" inputMode="email" placeholder="ten@email.com"
                  value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />
                <TextField id="co-cccd" label="CCCD người dự (vé gắn tên)" inputMode="numeric" autoComplete="off" maxLength={12} placeholder="12 chữ số"
                  value={cccd} onChange={(e) => setCccd(e.target.value.replace(/\D/g, ""))} error={errors.cccd} />
              </div>
              <PaymentMethods value={pay} onChange={setPay} />
              <div className={s.checks}>
                <Checkbox label="Xuất hoá đơn VAT" checked={vat} onChange={(e) => setVat(e.target.checked)} />
                <Checkbox id="co-terms" label="Đồng ý điều khoản mua vé" required checked={terms}
                  aria-invalid={!!errors.terms || undefined} aria-describedby={errors.terms ? "co-terms-msg" : undefined}
                  onChange={(e) => setTerms(e.target.checked)} />
                {errors.terms && <span id="co-terms-msg" className={s.checkError}>✕ {errors.terms}</span>}
              </div>
            </form>
          </>
        )}
      </main>
      <StickyBar>
        <div className={s.sumLine}><span>{model.breakdown}</span><span>đã gồm phí</span></div>
        <div className={s.sumTotal}><b>Tổng cộng</b><b>{model.totalText}</b></div>
        <Button type="submit" form="checkout-form" arrow fullWidth disabled={expired} loading={busy} loadingText="Đang thanh toán…">Thanh toán</Button>
      </StickyBar>
    </>
  );
}
