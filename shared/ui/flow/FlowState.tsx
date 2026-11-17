import type { ReactNode } from "react";
import { MobileAppBar } from "@/shared/ui/layout/MobileAppBar";
import { MobileShell } from "@/shared/ui/layout/MobileShell";
import { Button } from "@/shared/ui/Button";
import { Notice } from "@/shared/ui/Notice";

/** Khung chờ khi trang đang đọc tham số URL (Suspense fallback). */
export function FlowLoading({ title, backHref = "/" }: { title: string; backHref?: string }) {
  return (
    <MobileShell>
      <MobileAppBar backHref={backHref} title={title} />
      <main className="tx-flow-main" aria-busy="true">
        <p role="status" className="tx-flow-chips-empty">Đang tải…</p>
      </main>
    </MobileShell>
  );
}

/** Trạng thái rỗng/lỗi thân thiện: giải thích ngắn + một lối đi tiếp. */
export function FlowEmpty({ title, message, tone = "warning", backHref = "/", ctaHref = "/", ctaLabel = "Về trang chủ", children }: {
  title: string; message: string; tone?: "warning" | "danger" | "info"; backHref?: string; ctaHref?: string; ctaLabel?: string; children?: ReactNode;
}) {
  return (
    <MobileShell>
      <MobileAppBar backHref={backHref} title={title} />
      <main className="tx-flow-main tx-flow-state">
        <Notice tone={tone} title={title}>{message}</Notice>
        {children}
        <Button href={ctaHref} arrow fullWidth>{ctaLabel}</Button>
      </main>
    </MobileShell>
  );
}
