import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { FlowEmpty, FlowLoading } from "@/components/ticketing/FlowState";
import { SeatPicker, type PickerZone } from "@/components/ticketing/SeatPicker";
import { getEvent, getTier } from "@/lib/data";
import { parseSeatsParams, type SearchParamsInput } from "@/lib/order";

export const metadata: Metadata = { title: "Chọn ghế · Tixora" };

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<Exclude<SearchParamsInput, URLSearchParams>> };

export default function SeatsPage({ params, searchParams }: Props) {
  return (
    <Suspense fallback={<FlowLoading title="Chọn ghế" />}>
      <SeatsContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function SeatsContent({ params, searchParams }: Props) {
  const [{ slug }, sp] = await Promise.all([params, searchParams]);
  const event = getEvent(slug);
  if (!event) notFound();

  const zones: PickerZone[] = event.zones.map((z) => {
    const tier = getTier(event, z.key);
    const buyable = !!tier && (tier.status === "on-sale" || tier.status === "low") && z.remaining > 0;
    const left = buyable ? String(z.remaining) : tier?.status === "upcoming" ? "Sắp mở" : "✕ Hết";
    return { key: z.key, name: z.name, left, disabled: !buyable, price: tier?.price ?? 0 };
  });
  const open = zones.filter((z) => !z.disabled);
  if (open.length === 0) {
    return (
      <FlowEmpty
        title="Chưa thể chọn ghế"
        message="Sự kiện này hiện không có khu nào mở bán. Bạn có thể quay lại trang sự kiện để xem các hạng vé khác."
        backHref={`/events/${encodeURIComponent(slug)}`}
        ctaHref={`/events/${encodeURIComponent(slug)}`}
        ctaLabel="Về trang sự kiện"
      />
    );
  }
  const wanted = parseSeatsParams(sp).zone;
  const initialZone = open.find((z) => z.key === wanted)?.key ?? open[0].key;
  return <SeatPicker slug={slug} eventLine={`${event.title} · ${event.day}.${event.month}`} zones={zones} initialZone={initialZone} />;
}
