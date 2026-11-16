"use client";
import { useEffect, useId, useRef, type ReactNode } from "react";
import s from "./Dialog.module.css";

/** Hộp thoại dùng <dialog> gốc: tự khoá focus, Esc để đóng. */
export function Dialog({ open, onClose, title, children, actions }: { open: boolean; onClose: () => void; title: ReactNode; children?: ReactNode; actions?: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog ref={ref} className={s.dialog} aria-labelledby={titleId} onClose={onClose} onCancel={onClose}>
      <h2 id={titleId} className={s.title}>{title}</h2>
      {children && <div className={s.body}>{children}</div>}
      {actions && <div className={s.actions}>{actions}</div>}
    </dialog>
  );
}
