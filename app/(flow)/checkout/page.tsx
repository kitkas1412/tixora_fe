import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckoutScreen } from "@/widgets/CheckoutScreen";
import { FlowEmpty, FlowLoading } from "@/shared/ui/flow/FlowState";
import { MobileShell } from "@/shared/ui/layout/MobileShell";
import { getEvent } from "@/modules/catalog/api/events.mock";
import { parseCheckoutParams, type SearchParamsInput } from "@/shared/routing/flow-urls";
import { resolveCheckout, toCheckoutModel } from "@/modules/booking/model/checkout";

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
  const params = parseCheckoutParams(await searchParams);
  const event = params && getEvent(params.slug);
  const resolved = params && event ? resolveCheckout(params, event) : null;
  if (!resolved || !event) return invalid;
  const model = toCheckoutModel(resolved, event);
  return (
    <MobileShell>
      <CheckoutScreen model={model} />
    </MobileShell>
  );
}
