export const HOLD_MINUTES = 10;
export const HOLD_SECONDS = HOLD_MINUTES * 60;

/** Hạn giữ vé (epoch ms) tính từ bây giờ. Gọi ở client khi người dùng bấm. */
export const newHoldExpiry = (now: number = Date.now()): number => now + HOLD_MINUTES * 60_000;
