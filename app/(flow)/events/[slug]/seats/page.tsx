import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { FlowEmpty, FlowLoading } from "@/shared/ui/flow/FlowState";
import { SeatPicker } from "@/widgets/SeatPicker";
import { getEvent } from "@/modules/catalog/api/events.mock";
import { pickInitialZone, toPickerZones } from "@/modules/seating/model/zones";
import { parseSeatsParams, type SearchParamsInput } from "@/shared/routing/flow-urls";

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

  const zones = toPickerZones(event);
  const initialZone = pickInitialZone(zones, parseSeatsParams(sp).zone);
  if (!initialZone) {
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
  return <SeatPicker slug={slug} eventLine={`${event.title} · ${event.day}.${event.month}`} zones={zones} initialZone={initialZone} />;
}
