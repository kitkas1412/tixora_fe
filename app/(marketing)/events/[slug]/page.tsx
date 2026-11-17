import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TierSelector } from "@/widgets/TierSelector";
import { Reveal } from "@/shared/motion/Reveal";
import { SiteFooter } from "@/widgets/SiteFooter";
import { SiteHeader } from "@/widgets/SiteHeader";
import { StatusLabel } from "@/shared/ui/Labels";
import { getEvent, getEventSlugs } from "@/modules/catalog/api/events.mock";
import { ART_TONE_VAR } from "@/modules/catalog/model/art-tone";
import { eventFacts, isDarkTone } from "@/modules/catalog/model/event-view";
import s from "./page.module.css";

export function generateStaticParams() {
  return getEventSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/events/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const event = getEvent(slug);
  return event ? { title: `${event.title} · Tixora`, description: event.description[0] } : { title: "Không tìm thấy sự kiện · Tixora" };
}

export default async function EventPage({ params }: PageProps<"/events/[slug]">) {
  const { slug } = await params;
  const event = getEvent(slug);
  if (!event) notFound();

  const dark = isDarkTone(event.artTone);
  const facts = eventFacts(event);

  return (
    <>
      <div className={`tx-container ${s.page}`}>
        <SiteHeader variant="slim" crumbs={[{ label: "Lịch diễn", href: "/" }, { label: event.genre }, { label: event.title }]} />
        <main>
          <header className={s.header}>
            <div className={s.headMain}>
              <StatusLabel status={event.status}>{event.statusText} · {event.genre} · {event.subtitle}</StatusLabel>
              <h1 className={s.h1}>{event.title}</h1>
            </div>
            <div className={s.poster} style={{ background: ART_TONE_VAR[event.artTone], color: dark ? "var(--canvas)" : "var(--ink)" }} aria-hidden="true">
              <b>{event.day}.{event.month}</b>
            </div>
          </header>

          <dl className={s.facts} aria-label="Thông tin sự kiện">
            {facts.map((f) => (
              <div key={f.k}><dt>{f.k}</dt><dd>{f.v}</dd></div>
            ))}
          </dl>

          <TierSelector event={event}>
            <Reveal as="section" className={s.about} aria-labelledby="about-title" onScroll>
              <h2 id="about-title">Giới thiệu</h2>
              <div className={s.aboutText}>
                {event.description.map((p) => <p key={p}>{p}</p>)}
              </div>
            </Reveal>
          </TierSelector>
        </main>
      </div>
      <div className={s.footGap} />
      <SiteFooter />
    </>
  );
}
