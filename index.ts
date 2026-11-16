// tixora design system — điểm import duy nhất: import { Button, TierRow } from "@/tixora";
export { Button, IconButton } from "./components/ui/Button";
export type { ButtonProps, ButtonLinkProps } from "./components/ui/Button";
export { TextField, Select, SearchField, Checkbox } from "./components/ui/Field";
export { SegmentedControl, Tabs } from "./components/ui/SegmentedControl";
export type { Option } from "./components/ui/SegmentedControl";
export { StatusLabel, HighlightTag, TierBadge, TierSwatch } from "./components/ui/Labels";
export { Notice } from "./components/ui/Notice";
export { Dialog } from "./components/ui/Dialog";
export { Section, SectionHeader } from "./components/ui/Section";

export { EventCard, EventGrid } from "./components/event/EventCard";
export type { EventCardProps } from "./components/event/EventCard";
export { EventTable, EventRow } from "./components/event/EventTable";
export type { EventRowProps } from "./components/event/EventTable";

export { QuantityStepper } from "./components/ticketing/QuantityStepper";
export { TierRow } from "./components/ticketing/TierRow";
export type { TierRowProps } from "./components/ticketing/TierRow";
export { OrderSummary } from "./components/ticketing/OrderSummary";
export type { OrderLine } from "./components/ticketing/OrderSummary";
export { HoldTimer } from "./components/ticketing/HoldTimer";
export { QueuePanel } from "./components/ticketing/QueuePanel";
export { SeatMap } from "./components/ticketing/SeatMap";
export type { Seat, SeatRowData } from "./components/ticketing/SeatMap";
export { TicketCard } from "./components/ticketing/TicketCard";
export { Steps, Countdown } from "./components/ticketing/Progress";

export { formatVND, formatClock } from "./lib/format";
export { cx } from "./lib/cx";
export type { TierKey, SaleStatus } from "./lib/types";
