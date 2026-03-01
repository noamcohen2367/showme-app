// =============================================================================
// Cameri Theatre Data Integration – TypeScript Interfaces
// =============================================================================

// ─── Raw API: get_shows ───────────────────────────────────────────────────────

/**
 * A single show entry as returned by:
 *   GET https://www.cameri.co.il/na_ajax.php?action=get_shows
 *
 * Field names are guessed from common Israeli ticketing conventions;
 * all are optional because we haven't observed the live response yet.
 * Unknown extra fields pass through via the index signature.
 */
export interface RawCameriShow {
  event_id?: string | number;
  show_id?: string | number;
  presentation_id?: string | number;
  presentationId?: string | number;

  name?: string;
  show_name?: string;
  title?: string;
  subtitle?: string;

  venue?: string;
  venue_name?: string;
  hall?: string;

  date?: string;
  time?: string;
  datetime?: string;
  start_date?: string;
  performance_date?: string;

  purchase_link?: string;
  link?: string;
  order_link?: string;

  image?: string;
  thumbnail?: string;

  [key: string]: unknown;
}

/**
 * get_shows can return:
 *   - A date-keyed object: { "2024-02-15": [...], "2024-02-16": [...] }
 *   - A wrapped object:    { shows: [...] } or { data: [...] }
 *   - A flat array:        [...]
 */
export type GetShowsResponse =
  | Record<string, RawCameriShow[]>
  | { shows?: RawCameriShow[]; data?: RawCameriShow[] }
  | RawCameriShow[];

// ─── Raw API: seatplanV2 ──────────────────────────────────────────────────────

/**
 * A single seat record inside the seatplan.
 * Coordinate fields may be x/y, posX/posY, position_x/position_y, left/top, etc.
 * We try all variants in the parser.
 */
export interface RawSeat {
  // ID (the field that joins with seats-statusV2)
  id?: string | number;
  seat_id?: string | number;
  seatId?: string | number;
  objectId?: string | number;

  // Row reference
  row?: string | number;
  row_id?: string | number;
  rowId?: string | number;
  row_label?: string;
  rowLabel?: string;

  // Seat number within the row
  number?: string | number;
  seat_number?: string | number;
  seatNumber?: string | number;
  num?: string | number;

  // Position (whichever the API uses)
  x?: number;
  y?: number;
  posX?: number;
  posY?: number;
  position_x?: number;
  position_y?: number;
  left?: number;
  top?: number;

  // Section / category reference
  section?: string | number;
  section_id?: string | number;
  sectionId?: string | number;
  section_name?: string;
  sectionName?: string;
  category?: string;
  categoryId?: string | number;

  // Type (regular, wheelchair, vip, …)
  type?: string | number;
  seat_type?: string | number;
  seatType?: string | number;

  // Internal helpers injected during parsing (prefixed with _)
  _section?: string | number;
  _row?: string | number;

  [key: string]: unknown;
}

export interface RawRow {
  id?: string | number;
  label?: string;
  name?: string;
  rowLabel?: string;
  row_label?: string;
  seats?: RawSeat[];
  [key: string]: unknown;
}

export interface RawSection {
  id?: string | number;
  name?: string;
  label?: string;
  section_name?: string;
  sectionName?: string;
  color?: string;
  rows?: RawRow[];
  seats?: RawSeat[];
  [key: string]: unknown;
}

/**
 * seatplanV2 can be nested in different ways:
 *   { seatplan: { sections: [...] } }
 *   { sections: [...] }
 *   { rows: [...] }
 *   { seats: [...] }
 *   (or the whole object IS the seatplan root)
 */
export interface RawSeatplanResponse {
  seatplan?: {
    id?: number;
    name?: string;
    venueId?: number;
    width?: number;
    height?: number;
    sections?: RawSection[];
    rows?: RawRow[];
    seats?: RawSeat[];
    [key: string]: unknown;
  };
  id?: number;
  name?: string;
  venueId?: number;
  width?: number;
  height?: number;
  sections?: RawSection[];
  rows?: RawRow[];
  seats?: RawSeat[];
  data?: unknown;
  [key: string]: unknown;
}

// ─── Raw API: seats-statusV2 ──────────────────────────────────────────────────

/**
 * One entry from seats-statusV2.
 * Status can be numeric (0=available, 1=sold, 2=reserved, 3=blocked)
 * or string ("available", "sold", "reserved", "blocked").
 */
export interface RawSeatStatusEntry {
  // ID (must match seatplan seat ID for the join to work)
  id?: string | number;
  seat_id?: string | number;
  seatId?: string | number;
  objectId?: string | number;

  // Status field (numeric or string)
  status?: string | number;
  availability?: string | number;
  state?: string | number;

  // Boolean shortcuts (some APIs expose these instead of a single status)
  is_available?: boolean | number;
  available?: boolean | number;
  is_sold?: boolean | number;
  sold?: boolean | number;
  is_reserved?: boolean | number;
  reserved?: boolean | number;
  is_blocked?: boolean | number;
  blocked?: boolean | number;

  // Row/number (fallback join key if seat IDs don't match)
  row?: string | number;
  row_label?: string;
  number?: string | number;
  seatNumber?: string | number;

  // Pricing / zone link
  ticket_group_id?: string | number;
  ticketGroupId?: string | number;
  price?: number;

  [key: string]: unknown;
}

export type SeatsStatusResponse =
  | RawSeatStatusEntry[]
  | { seats?: RawSeatStatusEntry[]; data?: RawSeatStatusEntry[] };

// ─── Raw API: ticketGroups ────────────────────────────────────────────────────

export interface RawTicketGroup {
  id?: string | number;
  ticket_group_id?: string | number;
  name?: string;
  label?: string;
  description?: string;
  price?: number;
  original_price?: number;
  originalPrice?: number;
  color?: string;
  hex_color?: string;
  currency?: string;
  [key: string]: unknown;
}

export type TicketGroupsResponse =
  | RawTicketGroup[]
  | { ticketGroups?: RawTicketGroup[]; data?: RawTicketGroup[] };

// ─── Config ───────────────────────────────────────────────────────────────────

export interface VenueConfig {
  venueId: number;
  seatplanId: number;
  venueTypeId: number;
}

// ─── Normalized output ────────────────────────────────────────────────────────

export type NormalizedSeatStatus =
  | 'available'
  | 'occupied'
  | 'reserved'
  | 'blocked'
  | 'unknown';

export interface NormalizedSeat {
  seatId: string | number;
  row: string | number;
  seatNumber: string | number;
  /** Section/category name as returned by seatplan (e.g. "אורקסטרה קדמית") */
  section: string;
  /** Raw x coordinate from seatplan */
  x: number;
  /** Raw y coordinate from seatplan */
  y: number;
  /** Alias of x (kept for spec compatibility) */
  originalX: number;
  /** Alias of y (kept for spec compatibility) */
  originalY: number;
  /** x normalised to [0,1] across the whole hall bounding box */
  normalizedX: number;
  /** y normalised to [0,1] across the whole hall bounding box */
  normalizedY: number;
  status: NormalizedSeatStatus;
  priceZoneName: string | null;
  price: number | null;
}

export interface RowGroup {
  rowId: string | number;
  /** Human-readable row label ("A", "B", "1", "2", …) */
  rowLabel: string;
  seats: NormalizedSeat[];
}

export interface SectionGroup {
  sectionId: string | number;
  sectionName: string;
  rows: RowGroup[];
}

export interface AvailabilitySummary {
  totalSeats: number;
  available: number;
  occupied: number;
  reserved: number;
  blocked: number;
  unknown: number;
}

export interface NormalizedShowAvailability {
  presentationId: number;
  title: string;
  dateTime: string;
  venue: string;
  venueConfig: VenueConfig;
  /** Everything from seatplanV2 except seats/rows/sections */
  seatplanMeta: Record<string, unknown>;
  ticketGroups: RawTicketGroup[];
  /** Flat list – good for lookup by seatId */
  seats: NormalizedSeat[];
  /** Grouped tree – good for rendering rows in the UI */
  sections: SectionGroup[];
  summary: AvailabilitySummary;
}

/** Internal helper – a show after presentationId has been resolved */
export interface ProcessedShow {
  rawShow: RawCameriShow;
  eventId: number;
  presentationId: number;
  presentationIdSource: 'event_id' | 'purchase_link' | 'validated';
  title: string;
  dateTime: string;
  venue: string;
  purchaseLink: string;
  venueConfig: VenueConfig;
}
