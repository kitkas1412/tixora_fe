"use client";
/*
 * Nền tảng chuyển động (GSAP). Chỉ import từ file "use client".
 * Hằng số giây phản chiếu token trong app/styles/tokens.css (--dur-*, --ease-out, --stagger).
 * ScrollTrigger / Flip KHÔNG đăng ký ở đây để không kéo vào mọi bundle:
 * file nào cần thì tự `import { ScrollTrigger } from "gsap/ScrollTrigger"; gsap.registerPlugin(ScrollTrigger)`.
 */
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export { gsap, useGSAP };

export const DUR = { fast: 0.15, base: 0.24, slow: 0.4 } as const;
export const EASE = "power2.out";
export const EASE_STRONG = "power3.out";
export const STAGGER = 0.06;
export const REVEAL_Y = 14; // px

export const MQ_REDUCE = "(prefers-reduced-motion: reduce)";
export const MQ_MOTION = "(prefers-reduced-motion: no-preference)";

/**
 * gsap.matchMedia() với hai điều kiện `reduce` / `motion`. Gọi trong useGSAP và trả về mm.revert làm cleanup.
 * Khi `reduce`: không tween (hoặc duration 0), nội dung luôn hiển thị.
 */
export function motionMatchMedia(handlers: {
  motion?: () => void | (() => void);
  reduce?: () => void | (() => void);
}): gsap.MatchMedia {
  const mm = gsap.matchMedia();
  mm.add({ reduce: MQ_REDUCE, motion: MQ_MOTION }, (ctx) => {
    const c = ctx.conditions as { reduce?: boolean; motion?: boolean };
    return c.reduce ? handlers.reduce?.() : handlers.motion?.();
  });
  return mm;
}
