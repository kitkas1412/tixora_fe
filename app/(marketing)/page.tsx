import type { Metadata } from "next";
import { EventCard, EventGrid } from "@/modules/catalog/ui/EventCard";
import { ScheduleBoard } from "@/modules/catalog/ui/ScheduleBoard";
import { SiteFooter } from "@/widgets/SiteFooter";
import { SiteHeader } from "@/widgets/SiteHeader";
import { Reveal } from "@/shared/motion/Reveal";
import { Button } from "@/shared/ui/Button";
import { StatusLabel } from "@/shared/ui/Labels";
import { SectionHeader } from "@/shared/ui/Section";
import { getEvents } from "@/modules/catalog/api/events.mock";
import { ART_TONE_VAR } from "@/modules/catalog/model/art-tone";
import { selectHomeEvents } from "@/modules/catalog/model/event-view";
import { TRUST_ITEMS } from "@/shared/content/site";
import { formatVND } from "@/shared/lib/format";

export const metadata: Metadata = {
  title: "Tixora · Vé concert, festival, liveshow",
  description: "Giá đã gồm phí, giữ vé 10 phút, vé QR dùng được khi mất sóng.",
};

export default function HomePage() {
  const events = getEvents();
  const { hero, explore } = selectHomeEvents(events);
  const [titleHead, ...titleRest] = hero.title.split(" ");

  return (
    <>
      <div className="tx-container tx-home-page">
        <SiteHeader />
        <main>
          <section className="tx-home-hero" aria-labelledby="hero-title">
            <div className="tx-home-hero-main">
              <StatusLabel status="on-sale">Đang mở bán — Tuần 49</StatusLabel>
              <h1 id="hero-title" className="tx-home-h1">{titleHead}<br />{titleRest.join(" ")}</h1>
              <dl className="tx-home-facts">
                <div><dt>Ngày</dt><dd>{hero.weekday}, {hero.day}.{hero.month}</dd></div>
                <div><dt>Địa điểm</dt><dd>{hero.venue}</dd></div>
                <div><dt>Giá từ</dt><dd>{hero.priceFrom ? formatVND(hero.priceFrom) : "Sắp công bố"}</dd></div>
              </dl>
              <div className="tx-home-actions">
                <Button href={`/events/${hero.slug}`} arrow className="tx-home-primary">Mua vé</Button>
                <Button href={`/events/${hero.slug}`} variant="secondary">Chi tiết</Button>
              </div>
            </div>
            <div className="tx-home-poster" aria-hidden="true">
              <b className="tx-home-poster-day">{hero.day}</b>
              <b className="tx-home-poster-meta">Tháng {Number(hero.month)}<br />{hero.showtime}</b>
            </div>
          </section>

          <ScheduleBoard events={events} />

          <section className="tx-home-explore" aria-labelledby="explore-title">
            <SectionHeader
              title={<span id="explore-title">Khám phá</span>}
              actions={<a href="#lich-dien" className="tx-home-all">Tất cả sự kiện →</a>}
            />
            <EventGrid>
              {explore.map((e) => (
                <EventCard
                  key={e.slug}
                  href={`/events/${e.slug}`}
                  title={e.title}
                  meta={`${e.day}.${e.month}`}
                  metaRight={e.genre}
                  venue={e.city}
                  price={e.priceFrom ? `từ ${formatVND(e.priceFrom)}` : e.statusText}
                  art={ART_TONE_VAR[e.artTone]}
                />
              ))}
            </EventGrid>
          </section>

          <section aria-label="Vì sao chọn Tixora">
            <Reveal className="tx-home-trust" onScroll>
            {TRUST_ITEMS.map((t, i) => (
              <div key={t.title} className="tx-home-trust-item">
                <b className="tx-home-trust-no">{String(i + 1).padStart(2, "0")}</b>
                <h2>{t.title}</h2>
                <p>{t.text}</p>
              </div>
            ))}
            </Reveal>
          </section>
        </main>
      </div>
      <SiteFooter />
    </>
  );
}
