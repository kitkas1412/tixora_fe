import type { ArtTone } from "@/modules/catalog/model/types";

/** Token CSS cho màu poster đơn sắc. */
export const ART_TONE_VAR: Record<ArtTone, string> = {
  flame: "var(--flame-500)",
  "flame-dark": "var(--flame-900)",
  "flame-light": "var(--flame-100)",
  ink: "var(--ink)",
  volt: "var(--volt-500)",
  gray: "var(--gray-100)",
};
