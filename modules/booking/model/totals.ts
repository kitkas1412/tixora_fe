export type PriceLine = { price: number; quantity: number };

/** Giá đã gồm phí dịch vụ: total = Σ price × quantity, không cộng phí nào khác. */
export function computeTotals(lines: PriceLine[]): { count: number; total: number } {
  const count = lines.reduce((n, l) => n + l.quantity, 0);
  const total = lines.reduce((n, l) => n + l.price * l.quantity, 0);
  return { count, total };
}
