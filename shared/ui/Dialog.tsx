"use client";
import { useId, useRef, type ReactNode } from "react";
import { DUR, EASE, gsap, MQ_REDUCE, useGSAP } from "@/shared/motion/motion";
import s from "./Dialog.module.css";

const RESET = "transform,opacity";

/**
 * Hộp thoại dùng <dialog> gốc: tự khoá focus, Esc để đóng.
 * Esc: mờ ra rồi luôn gọi d.close() (kể cả khi cha không đổi `open`), onClose chỉ được báo một lần
 * (qua sự kiện `close` gốc). Đóng do cha đổi `open=false` thì không báo lại onClose.
 */
export function Dialog({ open, onClose, title, children, actions }: { open: boolean; onClose: () => void; title: ReactNode; children?: ReactNode; actions?: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const closing = useRef(false); // đang mờ ra: chặn bấm lại và chặn chạy chồng
  const silent = useRef(false); // lần `close` kế tiếp do cha khởi tạo: không báo onClose

  const finish = () => {
    const d = ref.current;
    closing.current = false;
    if (!d) return;
    d.inert = false;
    gsap.set(d, { clearProps: RESET });
    if (d.open) d.close();
  };
  // Tween tạo trong context: bị kill + revert khi unmount nên onComplete không chạy sau unmount.
  const fadeOut = (d: HTMLDialogElement) => {
    closing.current = true;
    d.inert = true; // không bấm được nút trong lúc mờ
    gsap.to(d, { opacity: 0, y: 8, duration: DUR.fast, ease: EASE, onComplete: finish });
  };

  const { contextSafe } = useGSAP({ scope: ref });
  const onCancel = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const d = ref.current;
    if (!d || closing.current) return;
    if (window.matchMedia(MQ_REDUCE).matches) finish();
    else contextSafe(() => fadeOut(d))();
  };

  useGSAP(() => {
    const d = ref.current;
    if (!d) return;
    const reduce = window.matchMedia(MQ_REDUCE).matches;
    if (open) {
      silent.current = false;
      if (closing.current) { gsap.killTweensOf(d); closing.current = false; d.inert = false; gsap.set(d, { clearProps: RESET }); }
      if (!d.open) {
        d.showModal();
        if (!reduce) gsap.fromTo(d, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: DUR.base, ease: EASE, clearProps: RESET });
      } else gsap.set(d, { clearProps: RESET });
      return;
    }
    if (!d.open || closing.current) return;
    silent.current = true;
    if (reduce) finish();
    else fadeOut(d);
  }, { scope: ref, dependencies: [open] });

  return (
    <dialog
      ref={ref}
      className={s.dialog}
      aria-labelledby={titleId}
      onClose={() => { if (silent.current) { silent.current = false; return; } onClose(); }}
      onCancel={onCancel}
    >
      <h2 id={titleId} className={s.title}>{title}</h2>
      {children && <div className={s.body}>{children}</div>}
      {actions && <div className={s.actions}>{actions}</div>}
    </dialog>
  );
}
