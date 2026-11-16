"use client";
import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from "react";
import { cx } from "../../lib/cx";
import s from "./Field.module.css";

type FieldBase = { label: string; hint?: ReactNode; error?: ReactNode };

/** Nhãn trên, gợi ý/lỗi dưới. Lỗi luôn có chữ (✕ …), không chỉ đổi màu viền. */
export function TextField({ label, hint, error, className, id, ...rest }: FieldBase & InputHTMLAttributes<HTMLInputElement>) {
  const auto = useId();
  const inputId = id ?? auto;
  const msgId = `${inputId}-msg`;
  return (
    <div className={cx(s.field, className)}>
      <label htmlFor={inputId}>{label}</label>
      <input id={inputId} className={cx(s.control, error && s.invalid)} aria-invalid={!!error || undefined} aria-describedby={hint || error ? msgId : undefined} {...rest} />
      {error ? <span id={msgId} className={s.error}>✕ {error}</span> : hint ? <span id={msgId} className={s.hint}>{hint}</span> : null}
    </div>
  );
}

export function Select({ label, hint, error, className, id, children, ...rest }: FieldBase & SelectHTMLAttributes<HTMLSelectElement>) {
  const auto = useId();
  const selectId = id ?? auto;
  return (
    <div className={cx(s.field, className)}>
      <label htmlFor={selectId}>{label}</label>
      <select id={selectId} className={cx(s.control, error && s.invalid)} aria-invalid={!!error || undefined} {...rest}>{children}</select>
      {error ? <span className={s.error}>✕ {error}</span> : hint ? <span className={s.hint}>{hint}</span> : null}
    </div>
  );
}

/** Ô tìm kiếm kiểu Swiss: chữ lớn, chỉ kẻ dưới. */
export function SearchField({ label = "Tìm kiếm", className, ...rest }: { label?: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={cx(s.search, className)}>
      <span className="tx-sr-only">{label}</span>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>
      <input type="search" placeholder="Nghệ sĩ, sự kiện, địa điểm" {...rest} />
    </label>
  );
}

export function Checkbox({ label, className, ...rest }: { label: ReactNode } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={cx(s.check, className)}>
      <input type="checkbox" {...rest} />
      <span>{label}</span>
    </label>
  );
}
