import type { Metadata } from "next";
import { Suspense } from "react";
import { MobileShell } from "@/components/layout/MobileShell";
import { FlowEmpty, FlowLoading } from "@/components/ticketing/FlowState";
import { TicketView, type TicketModel } from "@/components/ticketing/TicketView";
import { getEvent } from "@/lib/data";
import { expandTickets, parseTicketParams, type SearchParamsInput } from "@/lib/order";
import type { TierKey } from "@/lib/types";

export const metadata: Metadata = { title: "Vé của tôi · Tixora" };

type Props = { params: Promise<{ code: string }>; searchParams: Promise<Exclude<SearchParamsInput, URLSearchParams>> };

/** Cổng vào demo theo hạng vé (dữ liệu minh hoạ). */
const GATE: Record<TierKey, string> = { svip: "A1", vip: "B2", cat1: "C3", cat2: "D4" };

export default function TicketPage({ params, searchParams }: Props) {
  return (
    <Suspense fallback={<FlowLoading title="Vé của tôi" />}>
      <TicketContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function TicketContent({ params, searchParams }: Props) {
  const [{ code }, sp] = await Promise.all([params, searchParams]);
  let summary = null;
  try { summary = parseTicketParams(code, sp); } catch { summary = null; } // decodeURIComponent có thể ném lỗi với mã sai
  const event = summary && getEvent(summary.slug);
  if (!summary || !event) {
    return (
      <FlowEmpty
        title="Không tìm thấy vé"
        message="Liên kết vé thiếu hoặc sai thông tin. Kiểm tra lại email xác nhận hoặc quay về trang chủ."
      />
    );
  }

  const names = Object.fromEntries(event.tiers.map((t) => [t.key, t.name]));
  const list = expandTickets(summary);
  const tickets: TicketModel[] = list.map(({ tier, seat }, i) => {
    const [row, num] = seat ? seat.split("-") : [];
    return {
      tier,
      code: list.length > 1 ? `${summary.code}-${i + 1}` : summary.code,
      facts: [
        { label: "NGÀY", value: `${event.dateLabel}` },
        { label: "MỞ CỔNG", value: event.doors },
        { label: "CỔNG · KHU", value: `${GATE[tier]} · ${names[tier] ?? tier.toUpperCase()}` },
        { label: "HÀNG · GHẾ", value: seat ? `${row} · ${num}` : "Tự do" },
      ],
    };
  });

  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${event.venue}, ${event.city}`)}`;
  return (
    <MobileShell>
      <TicketView title={event.title.replace(/-/g, "\u2011")} category={`${event.genre} · ${event.subtitle}`} tickets={tickets} mapsHref={mapsHref} justPaid={summary.paid} />
    </MobileShell>
  );
}
