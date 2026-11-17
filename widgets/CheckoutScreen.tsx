"use client";
import { useState } from "react";
import { buildTicketHref } from "@/shared/routing/flow-urls";
import type { CheckoutModel } from "@/modules/booking/model/checkout";
import { CheckoutView } from "@/modules/booking/ui/CheckoutView";
import { PaymentMethods } from "@/modules/payment/ui/PaymentMethods";
import { orderToTicketSummary } from "@/modules/ticketing/model/ticket";

/** Ghép màn thanh toán (booking) với phương thức thanh toán (payment) và đường dẫn vé (ticketing). */
export function CheckoutScreen({ model }: { model: CheckoutModel }) {
  const [pay, setPay] = useState("momo");
  return (
    <CheckoutView
      model={model}
      payment={<PaymentMethods value={pay} onChange={setPay} />}
      ticketHref={(code) => buildTicketHref(orderToTicketSummary(model.order, code))}
    />
  );
}
