/**
 * =============================================================================
 * Cameri Theatre Data Integration Layer
 * =============================================================================
 *
 * Fetches real seat maps and live availability from Cameri Theatre's APIs,
 * normalises everything into a UI-ready structure for the ShowME app.
 *
 * Usage:
 *   npm install
 *   npx ts-node fetchCameriData.ts
 *
 * Output:
 *   cameri-shows-availability.json
 * =============================================================================
 */

import axios, { AxiosError } from 'axios';
import * as fs from 'fs';
import * as path from 'path';

import type {
  RawCameriShow,
  GetShowsResponse,
  RawSeat,
  RawSection,
  RawRow,
  RawSeatplanResponse,
  RawSeatStatusEntry,
  SeatsStatusResponse,
  RawTicketGroup,
  TicketGroupsResponse,
  VenueConfig,
  NormalizedSeat,
  NormalizedSeatStatus,
  SectionGroup,
  RowGroup,
  NormalizedShowAvailability,
} from './types';

// =============================================================================
// Constants
// =============================================================================

const BASE_MAIN    = 'https://www.cameri.co.il';
const BASE_TICKETS = 'https://tickets.cameri.co.il';
const OUTPUT_FILE  = path.join(__dirname, 'cameri-shows-availability.json');

/**
 * Venue name (as returned by get_shows) → API config.
 * Extend here if Cameri adds more halls.
 */
const VENUE_CONFIG_MAP: Record<string, VenueConfig> = {
  'קאמרי 1': { venueId: 59, seatplanId: 54, venueTypeId: 1 },
  'קאמרי 2': { venueId: 82, seatplanId: 25, venueTypeId: 1 },
};

// =============================================================================
// HTTP client with browser-like headers
// =============================================================================

const http = axios.create({
  timeout: 15_000,
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
      '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    Accept: 'application/json, text/plain, */*',
    'Accept-Language': 'he-IL,he;q=0.9,en;q=0.8',
    Origin: BASE_TICKETS,
  },
});

/**
 * GET with exponential-backoff retry.
 * 4xx responses are NOT retried (client error – retrying won't help).
 * 5xx / network errors are retried up to `retries` times.
 */
async function getWithRetry<T>(
  url: string,
  referer: string,
  retries = 3,
): Promise<T> {
  let lastErr: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const { data } = await http.get<T>(url, {
        headers: { Referer: referer },
      });
      return data;
    } catch (err) {
      lastErr = err as Error;
      const status = (err as AxiosError).response?.status;
      console.warn(`    [attempt ${attempt + 1}/${retries + 1}] ${url} → ${status ?? 'network'}`);

      if (status && status >= 400 && status < 500) break; // 4xx: stop immediately
      if (attempt < retries) await sleep(500 * 2 ** attempt);
    }
  }
  throw lastErr ?? new Error(`Failed to fetch: ${url}`);
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// =============================================================================
// 1. getAllShows()
// =============================================================================

/**
 * Fetches all upcoming shows from Cameri and returns a flat array.
 *
 * The API may return one of several shapes:
 *   A) A date-keyed object: { "2024-02-15": [...], "2024-02-16": [...] }
 *   B) A wrapped object:    { shows: [...] }  or  { data: [...] }
 *   C) A flat array:        [...]
 */
export async function getAllShows(): Promise<RawCameriShow[]> {
  const url = `${BASE_MAIN}/na_ajax.php?action=get_shows`;
  console.log(`📡  GET ${url}`);

  const raw = await getWithRetry<GetShowsResponse>(url, `${BASE_MAIN}/`);

  let shows: RawCameriShow[] = [];

  if (Array.isArray(raw)) {
    // Shape C
    shows = raw;
  } else if (raw && typeof raw === 'object') {
    const obj = raw as Record<string, unknown>;

    if (Array.isArray(obj.shows)) {
      // Shape B – { shows: [...] }
      shows = obj.shows as RawCameriShow[];
    } else if (Array.isArray(obj.data)) {
      // Shape B – { data: [...] }
      shows = obj.data as RawCameriShow[];
    } else {
      // Shape A – date-keyed object
      for (const key of Object.keys(obj)) {
        const value = obj[key];
        if (Array.isArray(value)) {
          shows.push(...(value as RawCameriShow[]));
        }
      }
    }
  }

  // Deduplicate by event_id (dates may duplicate the same show)
  const seen = new Set<string>();
  const deduped = shows.filter(s => {
    const id = String(s.event_id ?? s.show_id ?? s.presentation_id ?? Math.random());
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });

  console.log(`✅  ${shows.length} raw show entries → ${deduped.length} unique shows`);
  return deduped;
}

// =============================================================================
// 2. resolvePresentationId()
// =============================================================================

/**
 * Dynamically resolves the correct presentationId for a show.
 *
 * Strategy:
 *   1. Extract the candidate integer from event_id / show_id / presentation_id.
 *   2. If purchase_link is present, verify it contains that ID
 *      (e.g. "https://tickets.cameri.co.il/order/12345").
 *      If the link contains a DIFFERENT id, test that one first.
 *   3. Confirm the candidate by calling ticketGroups – if it returns data,
 *      the id is valid as a presentationId.
 *   4. Log every decision so failures are easy to debug.
 *
 * Returns null (and logs why) if the id cannot be confirmed.
 */
export async function resolvePresentationId(
  show: RawCameriShow,
): Promise<{ presentationId: number; source: string } | null> {
  const title = String(show.name ?? show.show_name ?? show.title ?? '');

  // ── Step 1: Extract candidate ID ──────────────────────────────────────────
  const candidateRaw =
    show.event_id ??
    show.presentation_id ??
    show.presentationId ??
    show.show_id;

  if (candidateRaw == null) {
    console.warn(`  ⚠️  "${title}": no event_id-like field found. Raw keys: ${Object.keys(show).join(', ')}`);
    return null;
  }

  const candidateId = Number(candidateRaw);
  if (isNaN(candidateId) || candidateId <= 0) {
    console.warn(`  ⚠️  "${title}": event_id "${candidateRaw}" is not a valid positive integer`);
    return null;
  }

  // ── Step 2: Cross-check with purchase_link ────────────────────────────────
  const purchaseLink = String(
    show.purchase_link ?? show.link ?? show.order_link ?? '',
  );

  const linkMatch = purchaseLink.match(/\/order\/(\d+)/);
  const linkId = linkMatch ? Number(linkMatch[1]) : null;

  console.log(
    `  🔑 event_id=${candidateId}` +
    ` | purchase_link="${purchaseLink}"` +
    ` | link contains ID: ${purchaseLink.includes(String(candidateId))}`,
  );

  // If purchase_link contains a different integer, try that one first
  if (linkId && linkId !== candidateId) {
    console.log(`  🔀  event_id (${candidateId}) ≠ purchase_link id (${linkId}) — testing purchase_link id first`);
    const linkIdValid = await tryTicketGroups(linkId);
    if (linkIdValid) {
      console.log(`  ✅  presentationId=${linkId} confirmed via purchase_link`);
      return { presentationId: linkId, source: 'purchase_link' };
    }
    console.log(`  ↩️  purchase_link id ${linkId} not valid, falling back to event_id ${candidateId}`);
  }

  // ── Step 3: Validate candidate via ticketGroups ───────────────────────────
  const valid = await tryTicketGroups(candidateId);
  if (valid) {
    const src = purchaseLink.includes(String(candidateId)) ? 'event_id+purchase_link' : 'event_id';
    console.log(`  ✅  presentationId=${candidateId} confirmed via ticketGroups (source: ${src})`);
    return { presentationId: candidateId, source: src };
  }

  console.warn(
    `  ❌  Cannot confirm presentationId for "${title}" (event_id=${candidateId}). Skipping.`,
  );
  return null;
}

/** Calls fetchTicketGroups and returns true if the response is non-empty. */
async function tryTicketGroups(presentationId: number): Promise<boolean> {
  try {
    const groups = await fetchTicketGroups(presentationId);
    return groups.length > 0;
  } catch {
    return false;
  }
}

// =============================================================================
// 3. getVenueConfig()
// =============================================================================

/**
 * Maps a venue name string to its API config.
 * Tries exact match first, then partial contains-match.
 * Returns null for unrecognised venues.
 */
export function getVenueConfig(venueName: string | undefined): VenueConfig | null {
  if (!venueName) return null;

  if (VENUE_CONFIG_MAP[venueName]) return VENUE_CONFIG_MAP[venueName];

  for (const [key, cfg] of Object.entries(VENUE_CONFIG_MAP)) {
    if (venueName.includes(key) || key.includes(venueName)) return cfg;
  }

  return null;
}

// =============================================================================
// 4. fetchSeatplan()
// =============================================================================

/**
 * Fetches seatplanV2 for a venue and extracts ALL seats into a flat array
 * regardless of how deeply they are nested (sections→rows→seats, etc.).
 *
 * The seat objects are augmented with `_section` and `_row` string helpers
 * so downstream code doesn't have to re-traverse the tree.
 *
 * @param venueConfig   - { venueId, seatplanId, venueTypeId }
 * @param presentationId - used only to construct a realistic Referer header
 */
export async function fetchSeatplan(
  venueConfig: VenueConfig,
  presentationId: number,
): Promise<{ meta: Record<string, unknown>; seats: RawSeat[] }> {
  const { venueId, seatplanId } = venueConfig;
  const url = `${BASE_TICKETS}/api/seats/seatplanV2?venueId=${venueId}&seatplanId=${seatplanId}`;
  const referer = `${BASE_TICKETS}/order/${presentationId}`;

  console.log(`  📐  Fetching seatplan: venueId=${venueId} seatplanId=${seatplanId}`);
  const raw = await getWithRetry<RawSeatplanResponse>(url, referer);

  // The root may be wrapped in a "seatplan" key or exposed directly
  const root = (raw.seatplan ?? raw) as Record<string, unknown>;

  // Collect meta (all non-seat fields)
  const meta: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(root)) {
    if (!['seats', 'rows', 'sections'].includes(k)) meta[k] = v;
  }

  const seats: RawSeat[] = [];

  // ── Detect nesting shape ──────────────────────────────────────────────────
  if (Array.isArray(root.seats)) {
    // Shape: flat seats[] at root
    seats.push(...(root.seats as RawSeat[]));

  } else if (Array.isArray(root.sections)) {
    // Shape: sections[] → (rows[] →) seats[]
    for (const section of root.sections as RawSection[]) {
      const sName = String(section.name ?? section.label ?? section.id ?? '');

      if (Array.isArray(section.seats)) {
        for (const seat of section.seats) {
          seats.push({ ...seat, _section: sName });
        }
      } else if (Array.isArray(section.rows)) {
        for (const row of section.rows as RawRow[]) {
          const rName = String(row.label ?? row.name ?? row.rowLabel ?? row.id ?? '');
          for (const seat of (row.seats ?? []) as RawSeat[]) {
            seats.push({ ...seat, _section: sName, _row: rName });
          }
        }
      }
    }

  } else if (Array.isArray(root.rows)) {
    // Shape: rows[] → seats[]
    for (const row of root.rows as RawRow[]) {
      const rName = String(row.label ?? row.name ?? row.rowLabel ?? row.id ?? '');
      for (const seat of (row.seats ?? []) as RawSeat[]) {
        seats.push({ ...seat, _row: rName });
      }
    }
  }

  console.log(`  📊  Seatplan: ${seats.length} seats extracted`);
  return { meta, seats };
}

// =============================================================================
// 5. fetchTicketGroups()
// =============================================================================

/**
 * Returns ticket/price-zone groups for a presentation.
 * Used both for validation (is the presentationId real?) and for pricing.
 */
export async function fetchTicketGroups(
  presentationId: number,
): Promise<RawTicketGroup[]> {
  const url =
    `${BASE_TICKETS}/api/presentations/${presentationId}/ticketGroups` +
    `?membershipLoyaltyId=0&referralMiniSiteId=0`;
  const referer = `${BASE_TICKETS}/order/${presentationId}`;

  const raw = await getWithRetry<TicketGroupsResponse>(url, referer);

  if (Array.isArray(raw)) return raw;
  const obj = raw as Record<string, unknown>;
  if (Array.isArray(obj.ticketGroups)) return obj.ticketGroups as RawTicketGroup[];
  if (Array.isArray(obj.data))         return obj.data as RawTicketGroup[];
  return [];
}

// =============================================================================
// 6. fetchSeatsStatus()
// =============================================================================

/**
 * Returns live availability records for every seat in a presentation.
 * `isReserved=1` requests the full status including reserved/held seats.
 */
export async function fetchSeatsStatus(
  presentationId: number,
  venueTypeId: number,
): Promise<RawSeatStatusEntry[]> {
  const url =
    `${BASE_TICKETS}/api/seats/seats-statusV2` +
    `?presentationId=${presentationId}&venueTypeId=${venueTypeId}&isReserved=1`;
  const referer = `${BASE_TICKETS}/order/${presentationId}`;

  console.log(`  🔄  Fetching seat status: presentationId=${presentationId}`);
  const raw = await getWithRetry<SeatsStatusResponse>(url, referer);

  if (Array.isArray(raw)) return raw;
  const obj = raw as Record<string, unknown>;
  if (Array.isArray(obj.seats)) return obj.seats as RawSeatStatusEntry[];
  if (Array.isArray(obj.data))  return obj.data  as RawSeatStatusEntry[];
  return [];
}

// =============================================================================
// 7. mergeSeatplanWithAvailability()
// =============================================================================

/**
 * Joins seatplan seats with seats-status records and ticketGroup pricing.
 *
 * Join strategy (tried in order for each seatplan seat):
 *   1. seatplan.seat.(id | seat_id | seatId | objectId)
 *        === status.(seatId | seat_id | id | objectId)
 *   2. Composite fallback: `row:seatNumber` key built from both sides.
 *      (Useful if the ticketing system uses integer seat ids that differ
 *       between the seatplan and the status endpoint.)
 *
 * Status code normalisation:
 *   Numeric   0 = available
 *             1 = sold / occupied
 *             2 = reserved / held
 *             3 = blocked / house hold
 *             4 = wheelchair (still available)
 *   String    "available" | "free" | "open"    → available
 *             "sold" | "occupied" | "booked"    → occupied
 *             "reserved" | "held"               → reserved
 *             "blocked" | "house" | "comp"      → blocked
 *
 * Coordinate normalisation:
 *   Finds the bounding box of all seats and maps each coordinate to [0, 1].
 *   This makes the output resolution-independent for the mobile canvas.
 *
 * Debug summary is printed and also returned for logging.
 */
export function mergeSeatplanWithAvailability(
  seatplanSeats: RawSeat[],
  statusRecords: RawSeatStatusEntry[],
  ticketGroups: RawTicketGroup[],
): { seats: NormalizedSeat[]; debugSummary: Record<string, number> } {

  // ── Build lookup maps ─────────────────────────────────────────────────────

  // Status lookups: by each possible ID field variant
  const statusById = new Map<string | number, RawSeatStatusEntry>();
  const statusByRowNum = new Map<string, RawSeatStatusEntry>();

  for (const s of statusRecords) {
    const ids = [s.seatId, s.seat_id, s.id, s.objectId].filter(v => v != null);
    for (const id of ids) {
      if (!statusById.has(id!))               statusById.set(id!, s);
      if (!statusById.has(String(id!)))        statusById.set(String(id!), s);
      if (!isNaN(Number(id)) && !statusById.has(Number(id!)))
                                               statusById.set(Number(id!), s);
    }
    // Composite row:number key
    const row = s.row ?? (s as Record<string, unknown>).row_label;
    const num = s.number ?? (s as Record<string, unknown>).seatNumber ?? (s as Record<string, unknown>).seat_number;
    if (row != null && num != null) statusByRowNum.set(`${row}:${num}`, s);
  }

  // Ticket groups by id
  const tgById = new Map<string | number, RawTicketGroup>();
  for (const tg of ticketGroups) {
    const id = tg.id ?? tg.ticket_group_id;
    if (id != null) {
      tgById.set(id, tg);
      tgById.set(String(id), tg);
      if (!isNaN(Number(id))) tgById.set(Number(id), tg);
    }
  }

  // ── Coordinate bounding box ───────────────────────────────────────────────
  const xs = seatplanSeats.map(extractX).filter((v): v is number => v != null);
  const ys = seatplanSeats.map(extractY).filter((v): v is number => v != null);
  const minX = xs.length ? Math.min(...xs) : 0;
  const maxX = xs.length ? Math.max(...xs) : 1;
  const minY = ys.length ? Math.min(...ys) : 0;
  const maxY = ys.length ? Math.max(...ys) : 1;
  const rangeX = maxX - minX || 1;
  const rangeY = maxY - minY || 1;

  // ── Merge ─────────────────────────────────────────────────────────────────
  let matched = 0;
  let unmatched = 0;
  const normalised: NormalizedSeat[] = [];

  for (const seat of seatplanSeats) {
    const seatId   = seat.id ?? seat.seat_id ?? seat.seatId ?? seat.objectId;
    const rowLabel = String(seat.row ?? seat._row ?? seat.row_id ?? seat.rowId ?? seat.rowLabel ?? seat.row_label ?? '');
    const seatNum  = String(seat.number ?? seat.seat_number ?? seat.seatNumber ?? seat.num ?? '');
    const section  = String(seat.section ?? seat.section_name ?? seat.sectionName ?? seat._section ?? seat.category ?? '');

    // ── Join attempt 1: by seat id ──
    let statusEntry: RawSeatStatusEntry | undefined;
    if (seatId != null) {
      statusEntry =
        statusById.get(seatId) ??
        statusById.get(String(seatId)) ??
        statusById.get(Number(seatId));
    }

    // ── Join attempt 2: by composite row:number ──
    if (!statusEntry && rowLabel && seatNum) {
      statusEntry = statusByRowNum.get(`${rowLabel}:${seatNum}`);
    }

    if (statusEntry) matched++; else unmatched++;

    // ── Resolve pricing from ticketGroups ──
    let priceZoneName: string | null = null;
    let price: number | null = null;
    if (statusEntry) {
      const tgId = statusEntry.ticketGroupId ?? statusEntry.ticket_group_id;
      if (tgId != null) {
        const tg = tgById.get(tgId) ?? tgById.get(String(tgId));
        if (tg) {
          priceZoneName = tg.name ?? tg.label ?? null;
          price = tg.price ?? tg.original_price ?? tg.originalPrice ?? null;
        }
      }
      if (price == null && statusEntry.price != null) price = statusEntry.price;
    }

    const origX = extractX(seat) ?? 0;
    const origY = extractY(seat) ?? 0;

    normalised.push({
      seatId: seatId ?? `${rowLabel}-${seatNum}`,
      row: rowLabel,
      seatNumber: seatNum,
      section,
      x: origX,
      y: origY,
      originalX: origX,
      originalY: origY,
      normalizedX: (origX - minX) / rangeX,
      normalizedY: (origY - minY) / rangeY,
      status: resolveStatus(statusEntry),
      priceZoneName,
      price,
    });
  }

  // ── Debug summary ──────────────────────────────────────────────────────────
  const debugSummary: Record<string, number> = {
    totalSeatplanSeats:    seatplanSeats.length,
    totalStatusSeats:      statusRecords.length,
    matchedSeats:          matched,
    unmatchedSeatplanSeats: unmatched,
    unmatchedStatusSeats:  statusRecords.length - matched,
  };

  console.log('  📋  Join summary:');
  console.log(`       seatplan seats:       ${debugSummary.totalSeatplanSeats}`);
  console.log(`       status seats:         ${debugSummary.totalStatusSeats}`);
  console.log(`       matched:              ${debugSummary.matchedSeats}`);
  console.log(`       unmatched (plan):     ${debugSummary.unmatchedSeatplanSeats}`);
  console.log(`       unmatched (status):   ${debugSummary.unmatchedStatusSeats}`);

  // Warn if join rate is poor – usually means IDs differ between endpoints
  const matchRate = seatplanSeats.length
    ? (matched / seatplanSeats.length) * 100
    : 0;
  if (matchRate < 50 && seatplanSeats.length > 0) {
    console.warn(
      `  ⚠️   Low join rate (${matchRate.toFixed(1)}%). ` +
      `Possible ID mismatch between seatplan and seats-status. ` +
      `Inspect raw payloads to find the correct join field.`,
    );
  }

  return { seats: normalised, debugSummary };
}

// ── Coordinate helpers ─────────────────────────────────────────────────────────
function extractX(seat: RawSeat): number | null {
  const v = seat.x ?? seat.posX ?? seat.position_x ?? seat.left;
  return v != null ? Number(v) : null;
}
function extractY(seat: RawSeat): number | null {
  const v = seat.y ?? seat.posY ?? seat.position_y ?? seat.top;
  return v != null ? Number(v) : null;
}

// ── Status normalisation ───────────────────────────────────────────────────────
/**
 * Converts any raw status representation into one of our four canonical values.
 *
 * NOTE: if no statusEntry was matched (seat is "unknown" from our perspective),
 * we default to 'unknown' rather than assuming available. This is intentional –
 * the UI should surface unmatched seats distinctly so data issues are visible.
 */
function resolveStatus(entry: RawSeatStatusEntry | undefined): NormalizedSeatStatus {
  if (!entry) return 'unknown';

  // Boolean shorthand fields (some APIs expose these instead of a status code)
  if (entry.is_available === true  || entry.available === true  || entry.is_available === 1) return 'available';
  if (entry.is_sold      === true  || entry.sold      === true  || entry.is_sold      === 1) return 'occupied';
  if (entry.is_reserved  === true  || entry.reserved  === true  || entry.is_reserved  === 1) return 'reserved';
  if (entry.is_blocked   === true  || entry.blocked   === true  || entry.is_blocked   === 1) return 'blocked';

  const raw = entry.status ?? entry.availability ?? entry.state;
  if (raw == null) return 'unknown';

  if (typeof raw === 'number') {
    switch (raw) {
      case 0:  return 'available';
      case 1:  return 'occupied';
      case 2:  return 'reserved';
      case 3:  return 'blocked';
      case 4:  return 'available'; // wheelchair spot – still bookable
      default: return 'unknown';
    }
  }

  const s = String(raw).toLowerCase().trim();
  if (['available', 'free', 'open', '0'].includes(s))          return 'available';
  if (['sold', 'occupied', 'booked', '1'].includes(s))         return 'occupied';
  if (['reserved', 'held', '2'].includes(s))                   return 'reserved';
  if (['blocked', 'house', 'comp', 'na', '3'].includes(s))     return 'blocked';
  return 'unknown';
}

// =============================================================================
// Grouping helper: flat seats[] → sections → rows
// =============================================================================

/**
 * Groups a flat NormalizedSeat[] into the tree structure the React Native
 * UI needs to render rows of seats per section.
 */
function buildSectionsGrouping(seats: NormalizedSeat[]): SectionGroup[] {
  // section name → row label → seats
  const sectionMap = new Map<string, Map<string, NormalizedSeat[]>>();

  for (const seat of seats) {
    const sec = seat.section || 'General';
    const row = String(seat.row || '');
    if (!sectionMap.has(sec)) sectionMap.set(sec, new Map());
    const rowMap = sectionMap.get(sec)!;
    if (!rowMap.has(row)) rowMap.set(row, []);
    rowMap.get(row)!.push(seat);
  }

  let secIdx = 0;
  const sections: SectionGroup[] = [];

  for (const [sectionName, rowMap] of sectionMap) {
    const rows: RowGroup[] = [];

    for (const [rowLabel, rowSeats] of rowMap) {
      // Sort seats left-to-right by seat number
      const sorted = [...rowSeats].sort(
        (a, b) => Number(a.seatNumber) - Number(b.seatNumber),
      );
      rows.push({ rowId: rowLabel || secIdx, rowLabel, seats: sorted });
    }

    // Sort rows: numeric before alpha, then alpha
    rows.sort((a, b) => {
      const na = Number(a.rowLabel), nb = Number(b.rowLabel);
      if (!isNaN(na) && !isNaN(nb)) return na - nb;
      return a.rowLabel.localeCompare(b.rowLabel);
    });

    sections.push({ sectionId: `section-${secIdx++}`, sectionName, rows });
  }

  return sections;
}

// =============================================================================
// 8. fetchShowAvailability()
// =============================================================================

/**
 * Full pipeline for a single show:
 *   1. Check venue is supported
 *   2. Resolve presentationId (dynamic, per show)
 *   3. Fetch seatplan + ticketGroups + seats-status in parallel
 *   4. Merge and normalise
 *   5. Return NormalizedShowAvailability
 *
 * Returns null if the show is unsupported or data cannot be fetched.
 */
export async function fetchShowAvailability(
  show: RawCameriShow,
): Promise<NormalizedShowAvailability | null> {
  const venue   = String(show.venue ?? show.venue_name ?? show.hall ?? '');
  const title   = String(show.name ?? show.show_name ?? show.title ?? 'Unknown');
  const dateTime = String(
    show.datetime ?? show.date ?? show.start_date ?? show.performance_date ?? '',
  );

  console.log(`\n🎭  "${title}"  |  venue: "${venue}"  |  date: ${dateTime}`);

  // ── Venue config ───────────────────────────────────────────────────────────
  const venueConfig = getVenueConfig(venue);
  if (!venueConfig) {
    console.log(`  ⏩  Skipping: venue "${venue}" is not supported`);
    return null;
  }

  // ── PresentationId resolution ──────────────────────────────────────────────
  const resolved = await resolvePresentationId(show);
  if (!resolved) {
    console.log(`  ⏩  Skipping: could not confirm presentationId`);
    return null;
  }
  const { presentationId } = resolved;

  // ── Parallel fetch ──────────────────────────────────────────────────────────
  let seatplanResult: Awaited<ReturnType<typeof fetchSeatplan>>;
  let ticketGroups: RawTicketGroup[];
  let statusRecords: RawSeatStatusEntry[];

  try {
    [seatplanResult, ticketGroups, statusRecords] = await Promise.all([
      fetchSeatplan(venueConfig, presentationId),
      fetchTicketGroups(presentationId),
      fetchSeatsStatus(presentationId, venueConfig.venueTypeId),
    ]);
  } catch (err) {
    console.error(`  ❌  Fetch failed for "${title}": ${(err as Error).message}`);
    return null;
  }

  console.log(`  🎟️   Ticket groups: ${ticketGroups.length}`);
  console.log(`  💺  Status records: ${statusRecords.length}`);

  // ── Merge ──────────────────────────────────────────────────────────────────
  const { seats } = mergeSeatplanWithAvailability(
    seatplanResult.seats,
    statusRecords,
    ticketGroups,
  );

  // ── Build output ───────────────────────────────────────────────────────────
  const countOf = (s: NormalizedSeatStatus) => seats.filter(x => x.status === s).length;

  return {
    presentationId,
    title,
    dateTime,
    venue,
    venueConfig,
    seatplanMeta: seatplanResult.meta,
    ticketGroups,
    seats,
    sections: buildSectionsGrouping(seats),
    summary: {
      totalSeats: seats.length,
      available:  countOf('available'),
      occupied:   countOf('occupied'),
      reserved:   countOf('reserved'),
      blocked:    countOf('blocked'),
      unknown:    countOf('unknown'),
    },
  };
}

// =============================================================================
// 9. fetchAllShowsAvailability()
// =============================================================================

/**
 * Fetches and normalises availability for ALL supported Cameri shows.
 * Saves everything to cameri-shows-availability.json.
 *
 * Shows are processed sequentially (300 ms gap) to avoid rate-limiting.
 */
export async function fetchAllShowsAvailability(): Promise<NormalizedShowAvailability[]> {
  const allShows = await getAllShows();

  const supported = allShows.filter(s => {
    const v = String(s.venue ?? s.venue_name ?? s.hall ?? '');
    return getVenueConfig(v) !== null;
  });

  console.log(
    `\n📌  ${supported.length} / ${allShows.length} shows are in supported venues ` +
    `(קאמרי 1 / קאמרי 2)\n`,
  );

  const results: NormalizedShowAvailability[] = [];

  for (const show of supported) {
    const result = await fetchShowAvailability(show);
    if (result) {
      results.push(result);
      await sleep(300); // be polite to the server
    }
  }

  console.log(`\n✅  Processed ${results.length} shows successfully`);

  // ── Write output ───────────────────────────────────────────────────────────
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2), 'utf-8');
  console.log(`💾  Saved → ${OUTPUT_FILE}`);

  return results;
}

// =============================================================================
// Entry point
// =============================================================================

async function main(): Promise<void> {
  console.log('══════════════════════════════════════════════════════');
  console.log('  Cameri Theatre Data Integration Layer');
  console.log('══════════════════════════════════════════════════════');

  const results = await fetchAllShowsAvailability();

  if (results.length === 0) {
    console.log('\n⚠️  No results produced. Possible reasons:');
    console.log('   • get_shows returned a different JSON shape than expected');
    console.log('   • API requires auth cookies (open a show page in browser first, copy cookies)');
    console.log('   • presentationId could not be confirmed via ticketGroups');
    console.log('\n   Run with a single show to debug:');
    console.log('   e.g. change fetchAllShowsAvailability() → fetchShowAvailability(someShow)');
    return;
  }

  // Print a sample (first show, first 5 seats only to keep output readable)
  console.log('\n── Sample output (first show, first 5 seats) ──');
  const sample = {
    ...results[0],
    seats: results[0].seats.slice(0, 5),
    sections: results[0].sections.slice(0, 2).map(sec => ({
      ...sec,
      rows: sec.rows.slice(0, 2).map(row => ({
        ...row,
        seats: row.seats.slice(0, 4),
      })),
    })),
  };
  console.log(JSON.stringify(sample, null, 2));
}

main().catch(err => {
  console.error('\n💥  Fatal error:', err);
  process.exit(1);
});
