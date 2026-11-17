import type { Metadata } from "next";
import { Suspense } from "react";
import { MobileShell } from "@/shared/ui/layout/MobileShell";
import { FlowEmpty, FlowLoading } from "@/shared/ui/flow/FlowState";
import { TicketView } from "@/modules/ticketing/ui/TicketView";
import { getEvent } from "@/modules/catalog/api/events.mock";
import { parseTicketParams, type SearchParamsInput } from "@/shared/routing/flow-urls";
import { buildTicketView } from "@/modules/ticketing/model/ticket";

export const metadata: Metadata = { title: "Vé của tôi · Tixora" };

type Props = { params: Promise<{ code: string }>; searchParams: Promise<Exclude<SearchParamsInput, URLSearchParams>> };

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

  const view = buildTicketView(summary, event);
  return (
    <MobileShell>
      <TicketView title={view.title} category={view.category} tickets={view.tickets} mapsHref={view.mapsHref} justPaid={view.justPaid} />
    </MobileShell>
  );
}
