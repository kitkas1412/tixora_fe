"use client";
import { useRef, type ComponentPropsWithoutRef, type ElementType, type ReactNode } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EASE, DUR, REVEAL_Y, STAGGER, gsap, motionMatchMedia, useGSAP } from "../../lib/motion";
import "./Motion.module.css";

gsap.registerPlugin(ScrollTrigger);

const NOSCRIPT_CSS = "[data-reveal]>*{opacity:1!important}";

/**
 * Hiện dần các phần tử con TRỰC TIẾP (opacity + y nhỏ, so le). Con có thể là server component.
 * Con bị ẩn bằng CSS (opacity 0) từ paint đầu, chỉ khi prefers-reduced-motion: no-preference,
 * rồi GSAP đưa về visible. <noscript> gỡ ẩn cho no-JS; reduced motion không bao giờ bị ẩn.
 * `onScroll`: chờ tới "top 85%" rồi chạy một lần. Chỉ dùng cho nội dung dưới/gần nếp gấp, không cho hero.
 * Con phải ổn định (không thêm/bớt sau mount).
 */
export function Reveal({ as = "div", className, stagger = STAGGER, delay = 0, onScroll = false, children, ...rest }: {
  as?: ElementType; className?: string; stagger?: number; delay?: number; onScroll?: boolean; children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<"div">, "className" | "children" | "onScroll">) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(() => {
    const el = ref.current;
    if (!el || el.children.length === 0) return;
    const kids = Array.from(el.children);
    const mm = motionMatchMedia({
      motion: () => {
        gsap.fromTo(kids, { opacity: 0, y: REVEAL_Y }, {
          opacity: 1, y: 0, duration: DUR.slow, ease: EASE, stagger, delay,
          clearProps: "transform", // giữ opacity inline 1 để CSS ẩn không chiếm lại
          ...(onScroll ? { scrollTrigger: { trigger: el, start: "top 85%", once: true } } : {}),
        });
      },
    });
    return () => { mm.revert(); gsap.set(kids, { opacity: 1, clearProps: "transform" }); };
  }, { scope: ref, dependencies: [stagger, delay, onScroll] });
  const Tag = as;
  return (
    <>
      <noscript><style dangerouslySetInnerHTML={{ __html: NOSCRIPT_CSS }} /></noscript>
      <Tag ref={ref} className={className} data-reveal="" {...rest}>{children}</Tag>
    </>
  );
}
