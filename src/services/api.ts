// ============================================
// ShowME App - API Service Layer
// ============================================

import { Show, ShowDate, ShowCategory, ShowBadge } from '../types/types';

// ============================================
// Cameri API Types (raw response)
// ============================================

interface CameriImage {
  desktop: string | null;
  mobile: string | null;
  preview: string | null;
}

interface CameriShowEvent {
  show_id: string;
  event_id: string;
  venue: string;
  title: string;
  subtitle: string | null;
  dateTime: string; // "YYYY-MM-DD HH:MM"
  timestamp: number;
  sold_out: boolean;
  groups: string[];
  archive: boolean;
  new: boolean;
  summary: string; // HTML
  order: string;
  coffee: boolean;
  link: string;
  purchase_link: string;
  image: CameriImage;
  mobile_image: string | null;
}

interface CameriApiResponse {
  status: number;
  data: {
    featured: unknown[];
    shows: Record<string, CameriShowEvent[]>;
  };
}

// ============================================
// Category Mapping (Hebrew -> App Categories)
// ============================================

const CATEGORY_MAP: Record<string, ShowCategory> = {
  'קומדיה': 'comedy',
  'דרמה': 'drama',
  'מוזיקלי': 'musical',
  'חדש': 'new',
  'ישראלי': 'popular',
  'קלאסי': 'long_running',
};

const CAMERI_IMAGE_BASE = 'https://www.cameri.co.il/prdPics/shows/';

// ============================================
// Data Transformation
// ============================================

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

function mapCategories(groups: string[]): ShowCategory[] {
  const categories: ShowCategory[] = [];
  for (const group of groups) {
    const mapped = CATEGORY_MAP[group];
    if (mapped) categories.push(mapped);
  }
  return categories.length > 0 ? categories : ['drama'];
}

function buildImageUrl(image: CameriImage, showId: string): string {
  if (image.desktop) {
    // If it's a full URL, use as-is; otherwise prepend base
    if (image.desktop.startsWith('http')) return image.desktop;
    return CAMERI_IMAGE_BASE + image.desktop;
  }
  if (image.mobile) {
    if (image.mobile.startsWith('http')) return image.mobile;
    return CAMERI_IMAGE_BASE + image.mobile;
  }
  if (image.preview) {
    if (image.preview.startsWith('http')) return image.preview;
    return CAMERI_IMAGE_BASE + image.preview;
  }
  // Fallback: construct from show_id pattern
  const numId = showId.replace('show_', '');
  return `${CAMERI_IMAGE_BASE}desktop_${showId}_show_image.jpg`;
}

function buildGalleryImages(image: CameriImage): string[] {
  const images: string[] = [];
  if (image.desktop) {
    images.push(image.desktop.startsWith('http') ? image.desktop : CAMERI_IMAGE_BASE + image.desktop);
  }
  if (image.mobile && image.mobile !== image.desktop) {
    images.push(image.mobile.startsWith('http') ? image.mobile : CAMERI_IMAGE_BASE + image.mobile);
  }
  return images;
}

function computeBadges(events: CameriShowEvent[]): ShowBadge[] {
  const badges: ShowBadge[] = [];
  const isNew = events.some(e => e.new);
  const hasSoldOut = events.some(e => e.sold_out);
  const totalEvents = events.length;

  if (isNew) badges.push('new');
  if (hasSoldOut && totalEvents > 5) badges.push('selling_fast');
  if (totalEvents > 20) badges.push('popular_in_area');

  return badges;
}

function transformCameriShows(apiResponse: CameriApiResponse): Show[] {
  const allEvents: CameriShowEvent[] = [];

  // Flatten all events from all date keys
  for (const dateKey of Object.keys(apiResponse.data.shows)) {
    const events = apiResponse.data.shows[dateKey];
    if (Array.isArray(events)) {
      allEvents.push(...events);
    }
  }

  // Filter out archived and coffee events
  const activeEvents = allEvents.filter(e => !e.archive && !e.coffee);

  // Group events by show_id
  const showGroups = new Map<string, CameriShowEvent[]>();
  for (const event of activeEvents) {
    const existing = showGroups.get(event.show_id) || [];
    existing.push(event);
    showGroups.set(event.show_id, existing);
  }

  // Transform each group into a Show
  const shows: Show[] = [];

  for (const [showId, events] of showGroups) {
    const firstEvent = events[0];

    // Build available dates grouped by date
    const dateMap = new Map<string, { times: ShowDate['times']; hasSoldOut: boolean }>();

    for (const event of events) {
      const [datePart, timePart] = event.dateTime.split(' ');
      const existing = dateMap.get(datePart) || { times: [], hasSoldOut: false };

      existing.times.push({
        id: event.event_id,
        time: timePart,
        availableSeats: event.sold_out ? 0 : 100, // API doesn't provide exact count
        totalSeats: 200,
        price: 0, // API doesn't provide pricing
        isLastMinuteDeal: false,
      });

      if (event.sold_out) existing.hasSoldOut = true;
      dateMap.set(datePart, existing);
    }

    const availableDates: ShowDate[] = Array.from(dateMap.entries())
      .map(([date, data]) => ({
        date,
        times: data.times,
        availability: data.hasSoldOut
          ? 'sold_out' as const
          : data.times.length <= 1
          ? 'limited' as const
          : 'available' as const,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    const imageUrl = buildImageUrl(firstEvent.image, showId);
    const galleryImages = buildGalleryImages(firstEvent.image);
    if (galleryImages.length === 0) galleryImages.push(imageUrl);

    const description = stripHtml(firstEvent.summary || '');

    const show: Show = {
      id: showId,
      title: firstEvent.title, // Hebrew title as default
      titleHe: firstEvent.title,
      titleRu: firstEvent.title, // Fallback to Hebrew
      description: description,
      descriptionHe: description,
      descriptionRu: description, // Fallback to Hebrew
      imageUrl,
      galleryImages,
      theaterId: 'theater-3', // Cameri Theatre
      categories: mapCategories(firstEvent.groups),
      duration: 120, // Default, API doesn't provide
      rating: 0,
      reviewCount: 0,
      startingPrice: 0, // API doesn't provide pricing
      badges: computeBadges(events),
      actorIds: [],
      availableDates,
      isActive: true,
      premiereDate: availableDates[0]?.date || new Date().toISOString().split('T')[0],
    };

    shows.push(show);
  }

  // Sort by number of available dates (popularity proxy)
  shows.sort((a, b) => b.availableDates.length - a.availableDates.length);

  return shows;
}

// ============================================
// Habima API Types (raw response)
// ============================================

interface HabimaPresentation {
  id: number;
  time: number; // Unix timestamp
  venue_id: number;
  subtitles: string[];
}

interface HabimaShow {
  ID: number;
  title: string;
  url: string;
  s_img: string; // Banner image (1920x280)
  img: string;   // Display image (500x575)
  mob_img: string;
  excerpt: string;
  tags: string[];
}

interface HabimaApiResponse {
  presentations: {
    en: Record<string, HabimaPresentation[]>;
    he: Record<string, HabimaPresentation[]>;
  };
  venues: {
    en: Record<string, string>;
    he: Record<string, string>;
  };
  shows: {
    en: Record<string, HabimaShow>;
    he: Record<string, HabimaShow>;
  };
}

// ============================================
// Habima Data Transformation
// ============================================

function transformHabimaShows(apiResponse: HabimaApiResponse): Show[] {
  const showsEn = apiResponse.shows.en;
  const showsHe = apiResponse.shows.he;
  const presentationsHe = apiResponse.presentations.he;
  const venuesHe = apiResponse.venues.he;

  const shows: Show[] = [];

  // Iterate over Hebrew shows (more complete dataset)
  for (const [showId, showHe] of Object.entries(showsHe)) {
    const showEn = showsEn[showId];
    const presentations = presentationsHe[showId] || [];

    if (presentations.length === 0) continue;

    // Build available dates from presentations
    const dateMap = new Map<string, { times: ShowDate['times']; }>();

    for (const pres of presentations) {
      const dateObj = new Date(pres.time * 1000);
      const datePart = dateObj.toISOString().split('T')[0];
      const timePart = dateObj.toLocaleTimeString('he-IL', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });

      const existing = dateMap.get(datePart) || { times: [] };
      existing.times.push({
        id: String(pres.id),
        time: timePart,
        availableSeats: 100,
        totalSeats: 200,
        price: 0,
        isLastMinuteDeal: false,
      });
      dateMap.set(datePart, existing);
    }

    const availableDates: ShowDate[] = Array.from(dateMap.entries())
      .map(([date, data]) => ({
        date,
        times: data.times,
        availability: 'available' as const,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    const imageUrl = showHe.img || showHe.s_img || '';
    const galleryImages: string[] = [];
    if (showHe.img) galleryImages.push(showHe.img);
    if (showHe.s_img && showHe.s_img !== showHe.img) galleryImages.push(showHe.s_img);
    if (galleryImages.length === 0 && imageUrl) galleryImages.push(imageUrl);

    const descriptionHe = stripHtml(showHe.excerpt || '');
    const descriptionEn = showEn ? stripHtml(showEn.excerpt || '') : descriptionHe;

    const badges: ShowBadge[] = [];
    if (presentations.length > 15) badges.push('popular_in_area');
    if (presentations.length > 25) badges.push('selling_fast');

    const show: Show = {
      id: `habima_${showId}`,
      title: showEn?.title || showHe.title,
      titleHe: showHe.title,
      titleRu: showEn?.title || showHe.title, // Fallback to English
      description: descriptionEn,
      descriptionHe: descriptionHe,
      descriptionRu: descriptionEn, // Fallback to English
      imageUrl,
      galleryImages,
      theaterId: 'theater-1', // Habima Theatre
      categories: ['drama'], // API doesn't provide categories
      duration: 120,
      rating: 0,
      reviewCount: 0,
      startingPrice: 0,
      badges,
      actorIds: [],
      availableDates,
      isActive: true,
      premiereDate: availableDates[0]?.date || new Date().toISOString().split('T')[0],
    };

    shows.push(show);
  }

  shows.sort((a, b) => b.availableDates.length - a.availableDates.length);
  return shows;
}

// ============================================
// Haifa Theater Types (HTML scraping)
// ============================================

interface HaifaEvent {
  dayOfWeek: string;   // Hebrew day letter (ש, א, ב, etc.)
  date: string;        // DD.MM.YY format
  title: string;
  time: string;        // HH:MM format
  venue: string;
  eventId: string;     // From /Event/Index/{id}
  ticketLink: string;
}

interface HaifaShowDetail {
  imageUrl: string;
  description: string;
}

// ============================================
// Haifa Theater HTML Parsing
// ============================================

function parseHaifaScheduleHtml(html: string): HaifaEvent[] {
  const events: HaifaEvent[] = [];

  // Split by schedule items
  const items = html.split('shedule_item');

  for (let i = 1; i < items.length; i++) {
    const item = items[i];

    // Extract day of week
    const dayMatch = item.match(/schedule_date day">\s*([^<]+)/);
    const dayOfWeek = dayMatch?.[1]?.trim() || '';

    // Extract date (DD.MM.YY)
    const dateMatch = item.match(/schedule_date">\s*(\d{2}\.\d{2}\.\d{2})/);
    const date = dateMatch?.[1] || '';

    // Extract title and event ID
    const titleMatch = item.match(/Event\/Index\/(\d+)"[^>]*class="shedule_show_name">([^<]+)/);
    const eventId = titleMatch?.[1] || '';
    const title = titleMatch?.[2]?.trim() || '';

    // Extract time
    const timeMatch = item.match(/<div>\s*(\d{2}:\d{2})\s*<\/div>/);
    const time = timeMatch?.[1] || '';

    // Extract venue
    const venueMatch = item.match(/schedule_block place">\s*<div>\s*([^<]+)/);
    const venue = venueMatch?.[1]?.trim() || '';

    // Extract ticket link
    const ticketMatch = item.match(/href=(https?:\/\/[^\s>]+)\s/);
    const ticketLink = ticketMatch?.[1] || '';

    if (title && date && eventId) {
      events.push({ dayOfWeek, date, title, time, venue, eventId, ticketLink });
    }
  }

  return events;
}

function parseHaifaDateToISO(dateStr: string): string {
  // Convert DD.MM.YY to YYYY-MM-DD
  const [day, month, year] = dateStr.split('.');
  const fullYear = parseInt(year, 10) < 50 ? `20${year}` : `19${year}`;
  return `${fullYear}-${month}-${day}`;
}

async function fetchHaifaShowDetail(eventId: string): Promise<HaifaShowDetail> {
  try {
    const response = await fetch(`https://www.ht1.co.il/Event/Index/${eventId}`);
    if (!response.ok) return { imageUrl: '', description: '' };

    const html = await response.text();

    // Extract og:image
    const imageMatch = html.match(/og:image"\s*content="([^"]+)"/);
    const imageUrl = imageMatch?.[1] || '';

    // Extract description from <p> tags after show content
    const descMatch = html.match(/<p>([^<]{20,})<\/p>/);
    const description = descMatch?.[1]
      ? stripHtml(descMatch[1]).replace(/<br\s*\/?>/g, ' ')
      : '';

    return { imageUrl, description };
  } catch {
    return { imageUrl: '', description: '' };
  }
}

async function transformHaifaShows(allEvents: HaifaEvent[]): Promise<Show[]> {
  // Group events by eventId (unique show identifier)
  const showGroups = new Map<string, HaifaEvent[]>();
  for (const event of allEvents) {
    const existing = showGroups.get(event.eventId) || [];
    existing.push(event);
    showGroups.set(event.eventId, existing);
  }

  // Fetch detail pages for each unique show (in parallel, limited batch)
  const showIds = Array.from(showGroups.keys());
  const detailMap = new Map<string, HaifaShowDetail>();

  // Fetch in batches of 5 to avoid overwhelming the server
  for (let i = 0; i < showIds.length; i += 5) {
    const batch = showIds.slice(i, i + 5);
    const details = await Promise.allSettled(
      batch.map(id => fetchHaifaShowDetail(id))
    );
    batch.forEach((id, idx) => {
      if (details[idx].status === 'fulfilled') {
        detailMap.set(id, details[idx].value);
      }
    });
  }

  const shows: Show[] = [];

  for (const [eventId, events] of showGroups) {
    const firstEvent = events[0];
    const detail = detailMap.get(eventId) || { imageUrl: '', description: '' };

    // Build available dates
    const dateMap = new Map<string, { times: ShowDate['times'] }>();

    for (const event of events) {
      const isoDate = parseHaifaDateToISO(event.date);
      const existing = dateMap.get(isoDate) || { times: [] };

      existing.times.push({
        id: `haifa_${eventId}_${event.date}_${event.time}`,
        time: event.time,
        availableSeats: 100,
        totalSeats: 200,
        price: 0,
        isLastMinuteDeal: false,
      });
      dateMap.set(isoDate, existing);
    }

    const availableDates: ShowDate[] = Array.from(dateMap.entries())
      .map(([date, data]) => ({
        date,
        times: data.times,
        availability: 'available' as const,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    const imageUrl = detail.imageUrl;
    const galleryImages = imageUrl ? [imageUrl] : [];

    const show: Show = {
      id: `haifa_${eventId}`,
      title: firstEvent.title,
      titleHe: firstEvent.title,
      titleRu: firstEvent.title,
      description: detail.description,
      descriptionHe: detail.description,
      descriptionRu: detail.description,
      imageUrl,
      galleryImages,
      theaterId: 'theater-6', // Haifa Theatre
      categories: ['drama'],
      duration: 120,
      rating: 0,
      reviewCount: 0,
      startingPrice: 0,
      badges: events.length > 5 ? ['popular_in_area'] : [],
      actorIds: [],
      availableDates,
      isActive: true,
      premiereDate: availableDates[0]?.date || new Date().toISOString().split('T')[0],
    };

    shows.push(show);
  }

  shows.sort((a, b) => b.availableDates.length - a.availableDates.length);
  return shows;
}

// ============================================
// API Fetching
// ============================================

const CAMERI_API_URL = 'https://www.cameri.co.il/na_ajax.php?action=get_shows';
const HABIMA_API_URL = 'https://www.habima.co.il/wp-content/themes/tyco-wp/cache/allData.json';
const HAIFA_SCHEDULE_URL = 'https://www.ht1.co.il/Show/_ShowList';

export async function fetchCameriShows(): Promise<Show[]> {
  const response = await fetch(CAMERI_API_URL);

  if (!response.ok) {
    throw new Error(`Cameri API error: ${response.status}`);
  }

  const data: CameriApiResponse = await response.json();

  if (data.status !== 1) {
    throw new Error('Cameri API returned error status');
  }

  return transformCameriShows(data);
}

export async function fetchHabimaShows(): Promise<Show[]> {
  const response = await fetch(HABIMA_API_URL);

  if (!response.ok) {
    throw new Error(`Habima API error: ${response.status}`);
  }

  const data: HabimaApiResponse = await response.json();
  return transformHabimaShows(data);
}

export async function fetchHaifaShows(): Promise<Show[]> {
  // Fetch weekly schedule pages 1-10 in parallel
  const pageNumbers = Array.from({ length: 10 }, (_, i) => i + 1);
  const pageResults = await Promise.allSettled(
    pageNumbers.map(async (page) => {
      const response = await fetch(`${HAIFA_SCHEDULE_URL}?NumberOfShows=${page}`);
      if (!response.ok) throw new Error(`Haifa page ${page} error: ${response.status}`);
      return response.text();
    })
  );

  // Parse all HTML pages into events
  const allEvents: HaifaEvent[] = [];
  for (const result of pageResults) {
    if (result.status === 'fulfilled') {
      const events = parseHaifaScheduleHtml(result.value);
      allEvents.push(...events);
    }
  }

  if (allEvents.length === 0) {
    throw new Error('No shows found from Haifa Theater');
  }

  return transformHaifaShows(allEvents);
}

export async function fetchAllShows(): Promise<Show[]> {
  const results = await Promise.allSettled([
    fetchCameriShows(),
    fetchHabimaShows(),
    fetchHaifaShows(),
  ]);

  const allShows: Show[] = [];

  for (const result of results) {
    if (result.status === 'fulfilled') {
      allShows.push(...result.value);
    } else {
      console.warn('Failed to fetch from one source:', result.reason);
    }
  }

  if (allShows.length === 0) {
    throw new Error('All API sources failed');
  }

  return allShows;
}
