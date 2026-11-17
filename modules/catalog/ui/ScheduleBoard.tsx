"use client";
import { Flip } from "gsap/Flip";
import { useRef, useState } from "react";
import { ALL_GENRES, GENRES } from "@/shared/content/site";
import { DUR, EASE, gsap, MQ_REDUCE, useGSAP } from "@/shared/motion/motion";
import type { EventItem } from "@/modules/catalog/model/types";
import { SectionHeader } from "@/shared/ui/Section";
import { SegmentedControl } from "@/shared/ui/SegmentedControl";
import { EventRow, EventTable } from "@/modules/catalog/ui/EventTable";
import s from "./ScheduleBoard.module.css";

gsap.registerPlugin(Flip);

const ROW = "[data-flip-id]";

/**
 * "Lịch diễn": bộ lọc thể loại + bảng sự kiện. Island client duy nhất của trang chủ.
 * Đổi bộ lọc: dòng bị loại mờ đi nhanh (còn trong DOM) -> chụp Flip state -> React đổi danh sách
 * -> Flip.from dời dòng còn lại, dòng mới mờ vào. Reduced motion: đổi tức thì, không Flip.
 */
export function ScheduleBoard({ events }: { events: EventItem[] }) {
  const [genre, setGenre] = useState<string>(ALL_GENRES);
  const scope = useRef<HTMLElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);
  const shown = genre === ALL_GENRES ? events : events.filter((e) => e.genre === genre);

  // contextSafe: tween bị kill + revert khi unmount nên onComplete (setGenre) không chạy sau unmount.
  const { contextSafe } = useGSAP({ scope });
  const changeGenre = (next: string) => contextSafe(() => {
    const root = scope.current;
    if (next === genre || !root) return;
    const rows = Array.from(root.querySelectorAll<HTMLElement>(ROW));
    Flip.killFlipsOf(rows);
    gsap.killTweensOf(rows);
    gsap.set(rows, { clearProps: "opacity,transform" });
    if (window.matchMedia(MQ_REDUCE).matches) { setGenre(next); return; }
    const leaving = rows.filter((r) => next !== ALL_GENRES && r.dataset.genre !== next);
    const commit = () => {
      flipState.current = Flip.getState(rows.filter((r) => !leaving.includes(r)));
      setGenre(next);
    };
    if (leaving.length === 0) commit();
    else gsap.to(leaving, { opacity: 0, duration: DUR.fast, ease: EASE, onComplete: commit });
  })();

  useGSAP(() => {
    const state = flipState.current;
    flipState.current = null;
    if (!state) return;
    const rows = gsap.utils.toArray<HTMLElement>(ROW);
    gsap.set(rows, { clearProps: "opacity" });
    Flip.from(state, {
      targets: rows, duration: DUR.base, ease: EASE, stagger: 0.02,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0 }, { opacity: 1, duration: DUR.base, ease: EASE, clearProps: "opacity" }),
    });
  }, { scope, dependencies: [genre] });

  return (
    <section ref={scope} id="lich-dien" className={s.wrap} aria-labelledby="lich-dien-title">
      <SectionHeader
        title={<span id="lich-dien-title">Lịch diễn</span>}
        actions={
          <SegmentedControl
            label="Lọc theo thể loại"
            value={genre}
            onChange={changeGenre}
            className={s.filter}
            options={GENRES.map((g) => ({ value: g, label: g }))}
          />
        }
      />
      <p className="tx-sr-only" role="status">{shown.length} sự kiện</p>
      {shown.length === 0 ? (
        <p className={s.empty}>Chưa có sự kiện thể loại {genre}. Chọn thể loại khác hoặc quay lại “Tất cả”.</p>
      ) : (
        <EventTable caption="Bảng lịch diễn">
          {shown.map((e) => (
            <div key={e.slug} data-flip-id={e.slug} data-genre={e.genre}>
              <EventRow
                href={`/events/${e.slug}`}
                day={e.day}
                month={e.month}
                title={e.title}
                subtitle={`${e.genre} · ${e.subtitle}`}
                venue={`${e.city} · ${e.venue}`}
                status={e.status}
                statusText={e.statusText}
              />
            </div>
          ))}
        </EventTable>
      )}
    </section>
  );
}
