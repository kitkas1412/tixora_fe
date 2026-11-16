import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckoutView, type CheckoutModel } from "@/components/ticketing/CheckoutView";
import { FlowEmpty, FlowLoading } from "@/components/ticketing/FlowState";
import { MobileShell } from "@/components/layout/MobileShell";
import { getEvent, getTier } from "@/lib/data";
import { formatVND } from "@/lib/format";
import { buildSeatsHref, computeTotals, parseCheckoutParams, type SearchParamsInput } from "@/lib/order";
import type { TierKey } from "@/lib/types";

export const metadata: Metadata = { title: "Thanh toán · Tixora" };

type Props = { searchParams: Promise<Exclude<SearchParamsInput, URLSearchParams>> };

export default function CheckoutPage({ searchParams }: Props) {
  return (
    <Suspense fallback={<FlowLoading title="Thanh toán" />}>
      <CheckoutContent searchParams={searchParams} />
    </Suspense>
  );
}

const invalid = (
  <FlowEmpty
    title="Không tìm thấy đơn hàng"
    message="Liên kết thanh toán thiếu hoặc sai thông tin sự kiện, khu hay ghế. Hãy chọn vé lại từ trang chủ."
  />
);

async function CheckoutContent({ searchParams }: Props) {
  const order = parseCheckoutParams(await searchParams);
  const event = order && getEvent(order.slug);
  if (!order || !event) return invalid;

  const date = `${event.day}.${event.month}`;
  const lines: { key: TierKey; name: string; price: number; quantity: number }[] = [];
  const entries: [TierKey, number][] = order.kind === "seats"
    ? [[order.zone, order.seats.length]]
    : (Object.entries(order.quantities) as [TierKey, number][]);
  for (const [key, quantity] of entries) {
    const tier = getTier(event, key);
    if (!tier || (tier.status !== "on-sale" && tier.status !== "low")) return invalid;
    lines.push({ key, name: tier.name, price: tier.price, quantity });
  }

  const totals = computeTotals(lines);
  const breakdown = `${lines.map((l) => `${l.quantity} × ${formatVND(l.price)}`).join(" + ")}`;
  const tierText = lines.map((l) => (order.kind === "tiers" ? `${l.name} × ${l.quantity}` : l.name)).join(", ");
  const detail = [date, event.showtime, tierText, order.kind === "seats" ? order.seats.join(", ") : null].filter(Boolean).join(" · ");

  const model: CheckoutModel = {
    order,
    title: event.title,
    detail,
    swatch: lines[0].key,
    count: totals.count,
    breakdown,
    total: totals.total,
    totalText: formatVND(totals.total),
    backHref: order.kind === "seats" ? buildSeatsHref(order.slug, { zone: order.zone }) : `/events/${encodeURIComponent(order.slug)}`,
  };
  return (
    <MobileShell>
      <CheckoutView model={model} />
    </MobileShell>
  );
}
