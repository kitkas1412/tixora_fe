"use client";
import { useState } from "react";
import { ALL_GENRES, GENRES } from "../../lib/data";
import type { EventItem } from "../../lib/types";
import { SectionHeader } from "../ui/Section";
import { SegmentedControl } from "../ui/SegmentedControl";
import { EventRow, EventTable } from "./EventTable";
import s from "./ScheduleBoard.module.css";

/** "Lịch diễn": bộ lọc thể loại + bảng sự kiện. Island client duy nhất của trang chủ. */
export function ScheduleBoard({ events }: { events: EventItem[] }) {
  const [genre, setGenre] = useState<string>(ALL_GENRES);
  const shown = genre === ALL_GENRES ? events : events.filter((e) => e.genre === genre);
  return (
    <section id="lich-dien" className={s.wrap} aria-labelledby="lich-dien-title">
      <SectionHeader
        title={<span id="lich-dien-title">Lịch diễn</span>}
        actions={
          <SegmentedControl
            label="Lọc theo thể loại"
            value={genre}
            onChange={setGenre}
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
            <EventRow
              key={e.slug}
              href={`/events/${e.slug}`}
              day={e.day}
              month={e.month}
              title={e.title}
              subtitle={`${e.genre} · ${e.subtitle}`}
              venue={`${e.city} · ${e.venue}`}
              status={e.status}
              statusText={e.statusText}
            />
          ))}
        </EventTable>
      )}
    </section>
  );
}
