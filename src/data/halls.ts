// ============================================
// ShowME App - Hall Library Data
// ============================================

import { SeatZone } from '../types/types';

// ============================================
// Hall Types
// ============================================

export interface HallSection {
  id: string;
  name: string;
  nameHe: string;
  zone: SeatZone;
  rows: HallRow[];
  color: string;
}

export interface HallRow {
  id: string;
  label: string; // A, B, C, etc.
  seats: HallSeat[];
  curve?: number; // 0 = straight, positive = curved toward stage
  offsetX?: number; // horizontal offset for balcony sections
  offsetY?: number; // vertical offset
}

export interface HallSeat {
  id: string;
  number: number;
  type: 'regular' | 'wheelchair' | 'companion' | 'vip' | 'restricted_view';
  available: boolean;
  price: number;
}

export interface HallLayout {
  id: string;
  hallId: string;
  totalSeats: number;
  sections: HallSection[];
  stage: StageConfig;
  aisles: Aisle[];
}

export interface StageConfig {
  type: 'proscenium' | 'thrust' | 'arena' | 'black_box' | 'amphitheater';
  width: number; // percentage of hall width
  depth: number; // percentage  
  position: 'front' | 'center' | 'end';
}

export interface Aisle {
  id: string;
  type: 'vertical' | 'horizontal';
  position: number; // percentage from left/top
}

export interface Hall {
  id: string;
  name: string;
  nameHe: string;
  theaterId: string;
  theaterName: string;
  description: string;
  descriptionHe: string;
  capacity: number;
  imageUrl: string;
  photos: string[];
  layout: HallLayout;
  amenities: HallAmenity[];
  accessibility: AccessibilityFeature[];
  audioSystems: string[];
  established?: number;
}

export interface HallAmenity {
  id: string;
  name: string;
  icon: string;
}

export interface AccessibilityFeature {
  id: string;
  name: string;
  description: string;
  icon: string;
}

// ============================================
// Price Multipliers by Zone
// ============================================

export const ZONE_PRICE_MULTIPLIERS: Record<SeatZone, number> = {
  premium: 1.5,
  zone_a: 1.2,
  zone_b: 1.0,
  zone_c: 0.8,
  economy: 0.6,
};

export const ZONE_COLORS: Record<SeatZone, string> = {
  premium: '#FFD700',
  zone_a: '#A855F7',
  zone_b: '#EC4899',
  zone_c: '#06B6D4',
  economy: '#6B7280',
};

export const ZONE_LABELS: Record<SeatZone, { en: string; he: string }> = {
  premium: { en: 'Premium', he: 'פרימיום' },
  zone_a: { en: 'Zone A', he: 'איזור א' },
  zone_b: { en: 'Zone B', he: 'איזור ב' },
  zone_c: { en: 'Zone C', he: 'איזור ג' },
  economy: { en: 'Economy', he: 'חיסכון' },
};

// ============================================
// Helper Functions
// ============================================

function generateRows(
  sectionId: string,
  rowLabels: string[],
  seatsPerRow: number | number[],
  zone: SeatZone,
  basePrice: number,
  options?: {
    curve?: number;
    startNumber?: number;
    restrictedViewSeats?: number[];
    wheelchairRow?: string;
  }
): HallRow[] {
  return rowLabels.map((label, rowIndex) => {
    const numSeats = Array.isArray(seatsPerRow) ? seatsPerRow[rowIndex] : seatsPerRow;
    const startNum = options?.startNumber || 1;
    
    const seats: HallSeat[] = [];
    for (let i = 0; i < numSeats; i++) {
      const seatNum = startNum + i;
      const isWheelchair = options?.wheelchairRow === label && (i === 0 || i === numSeats - 1);
      const isRestrictedView = options?.restrictedViewSeats?.includes(seatNum);
      
      seats.push({
        id: `${sectionId}-${label}-${seatNum}`,
        number: seatNum,
        type: isWheelchair ? 'wheelchair' : isRestrictedView ? 'restricted_view' : 'regular',
        available: Math.random() > 0.3, // 70% available for mock
        price: Math.round(basePrice * ZONE_PRICE_MULTIPLIERS[zone]),
      });
    }
    
    return {
      id: `${sectionId}-row-${label}`,
      label,
      seats,
      curve: options?.curve,
    };
  });
}

// ============================================
// Hall Library - Mock Data
// ============================================

export const HALLS: Hall[] = [
  // ============================================
  // Habima Theatre - Main Hall
  // ============================================
  {
    id: 'habima-main',
    name: 'Habima Main Hall',
    nameHe: 'האולם הראשי - הבימה',
    theaterId: 'habima',
    theaterName: 'Habima Theatre',
    description: 'The iconic main hall of Israel\'s national theater, featuring world-class acoustics and a classic proscenium stage. Renovated in 2011, it combines historic elegance with modern technology.',
    descriptionHe: 'האולם הראשי האיקוני של התיאטרון הלאומי של ישראל, הכולל אקוסטיקה ברמה עולמית ובמה פרוסניום קלאסית.',
    capacity: 950,
    imageUrl: 'https://picsum.photos/seed/habima-main/800/400',
    photos: [
      'https://picsum.photos/seed/habima1/800/600',
      'https://picsum.photos/seed/habima2/800/600',
      'https://picsum.photos/seed/habima3/800/600',
    ],
    layout: {
      id: 'habima-main-layout',
      hallId: 'habima-main',
      totalSeats: 950,
      sections: [
        {
          id: 'habima-orchestra',
          name: 'Orchestra',
          nameHe: 'אורקסטרה',
          zone: 'premium',
          color: ZONE_COLORS.premium,
          rows: generateRows('habima-orch', ['A', 'B', 'C', 'D', 'E'], 28, 'premium', 350, { curve: 5 }),
        },
        {
          id: 'habima-parterre',
          name: 'Parterre',
          nameHe: 'פרטר',
          zone: 'zone_a',
          color: ZONE_COLORS.zone_a,
          rows: generateRows('habima-part', ['F', 'G', 'H', 'I', 'J', 'K', 'L'], 32, 'zone_a', 280, { curve: 3, wheelchairRow: 'L' }),
        },
        {
          id: 'habima-mezzanine',
          name: 'Mezzanine',
          nameHe: 'יציע ראשון',
          zone: 'zone_b',
          color: ZONE_COLORS.zone_b,
          rows: generateRows('habima-mezz', ['M', 'N', 'O', 'P'], 34, 'zone_b', 220, { curve: 2 }),
        },
        {
          id: 'habima-balcony',
          name: 'Balcony',
          nameHe: 'יציע עליון',
          zone: 'zone_c',
          color: ZONE_COLORS.zone_c,
          rows: generateRows('habima-balc', ['Q', 'R', 'S', 'T', 'U'], 36, 'zone_c', 150, { restrictedViewSeats: [1, 2, 35, 36] }),
        },
      ],
      stage: {
        type: 'proscenium',
        width: 70,
        depth: 25,
        position: 'front',
      },
      aisles: [
        { id: 'aisle-1', type: 'vertical', position: 33 },
        { id: 'aisle-2', type: 'vertical', position: 66 },
      ],
    },
    amenities: [
      { id: 'ac', name: 'Air Conditioning', icon: 'snow-outline' },
      { id: 'bar', name: 'Lobby Bar', icon: 'wine-outline' },
      { id: 'coat', name: 'Coat Check', icon: 'shirt-outline' },
      { id: 'parking', name: 'Underground Parking', icon: 'car-outline' },
      { id: 'cafe', name: 'Café', icon: 'cafe-outline' },
    ],
    accessibility: [
      { id: 'wheelchair', name: 'Wheelchair Accessible', description: 'Ramp access and designated seating', icon: 'accessibility-outline' },
      { id: 'hearing', name: 'Hearing Loop', description: 'Induction loop system available', icon: 'ear-outline' },
      { id: 'elevator', name: 'Elevator Access', description: 'Elevators to all levels', icon: 'arrow-up-outline' },
    ],
    audioSystems: ['Dolby Atmos', 'Hearing Loop', 'Live Translation'],
    established: 1945,
  },

  // ============================================
  // Habima Theatre - Small Hall
  // ============================================
  {
    id: 'habima-small',
    name: 'Habima Studio',
    nameHe: 'אולם הסטודיו - הבימה',
    theaterId: 'habima',
    theaterName: 'Habima Theatre',
    description: 'An intimate black box theater perfect for experimental and contemporary productions. Flexible seating arrangements allow for unique staging possibilities.',
    descriptionHe: 'תיאטרון קופסה שחורה אינטימי, מושלם להפקות ניסיוניות ועכשוויות.',
    capacity: 150,
    imageUrl: 'https://picsum.photos/seed/habima-small/800/400',
    photos: [
      'https://picsum.photos/seed/habima-s1/800/600',
      'https://picsum.photos/seed/habima-s2/800/600',
    ],
    layout: {
      id: 'habima-small-layout',
      hallId: 'habima-small',
      totalSeats: 150,
      sections: [
        {
          id: 'studio-front',
          name: 'Front Section',
          nameHe: 'מגרש קדמי',
          zone: 'zone_a',
          color: ZONE_COLORS.zone_a,
          rows: generateRows('studio-front', ['A', 'B', 'C'], 15, 'zone_a', 180),
        },
        {
          id: 'studio-middle',
          name: 'Middle Section',
          nameHe: 'מגרש אמצעי',
          zone: 'zone_b',
          color: ZONE_COLORS.zone_b,
          rows: generateRows('studio-mid', ['D', 'E', 'F', 'G'], 18, 'zone_b', 150, { wheelchairRow: 'G' }),
        },
        {
          id: 'studio-back',
          name: 'Back Section',
          nameHe: 'מגרש אחורי',
          zone: 'zone_c',
          color: ZONE_COLORS.zone_c,
          rows: generateRows('studio-back', ['H', 'I', 'J'], 16, 'zone_c', 120),
        },
      ],
      stage: {
        type: 'black_box',
        width: 60,
        depth: 30,
        position: 'front',
      },
      aisles: [
        { id: 'aisle-center', type: 'vertical', position: 50 },
      ],
    },
    amenities: [
      { id: 'ac', name: 'Air Conditioning', icon: 'snow-outline' },
      { id: 'intimate', name: 'Intimate Setting', icon: 'heart-outline' },
    ],
    accessibility: [
      { id: 'wheelchair', name: 'Wheelchair Accessible', description: 'Ground floor access', icon: 'accessibility-outline' },
    ],
    audioSystems: ['Professional Sound System'],
    established: 1980,
  },

  // ============================================
  // Cameri Theatre - Main Hall
  // ============================================
  {
    id: 'cameri-main',
    name: 'Cameri Main Stage',
    nameHe: 'הבמה הראשית - הקאמרי',
    theaterId: 'cameri',
    theaterName: 'Cameri Theatre',
    description: 'Tel Aviv\'s municipal theater featuring a modern thrust stage design that brings audiences closer to the action. Known for innovative productions and excellent sightlines.',
    descriptionHe: 'התיאטרון העירוני של תל אביב הכולל עיצוב במה תראסט מודרני המקרב את הקהל לפעולה.',
    capacity: 900,
    imageUrl: 'https://picsum.photos/seed/cameri-main/800/400',
    photos: [
      'https://picsum.photos/seed/cameri1/800/600',
      'https://picsum.photos/seed/cameri2/800/600',
      'https://picsum.photos/seed/cameri3/800/600',
    ],
    layout: {
      id: 'cameri-main-layout',
      hallId: 'cameri-main',
      totalSeats: 900,
      sections: [
        {
          id: 'cameri-vip',
          name: 'VIP Front',
          nameHe: 'VIP קדמי',
          zone: 'premium',
          color: ZONE_COLORS.premium,
          rows: generateRows('cameri-vip', ['AA', 'BB', 'CC'], 20, 'premium', 400, { curve: 8 }),
        },
        {
          id: 'cameri-orchestra',
          name: 'Orchestra',
          nameHe: 'אורקסטרה',
          zone: 'zone_a',
          color: ZONE_COLORS.zone_a,
          rows: generateRows('cameri-orch', ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'], 30, 'zone_a', 320, { curve: 5 }),
        },
        {
          id: 'cameri-circle',
          name: 'Dress Circle',
          nameHe: 'מעגל ראשון',
          zone: 'zone_b',
          color: ZONE_COLORS.zone_b,
          rows: generateRows('cameri-circle', ['J', 'K', 'L', 'M', 'N'], 32, 'zone_b', 250, { curve: 3, wheelchairRow: 'N' }),
        },
        {
          id: 'cameri-upper',
          name: 'Upper Circle',
          nameHe: 'מעגל עליון',
          zone: 'zone_c',
          color: ZONE_COLORS.zone_c,
          rows: generateRows('cameri-upper', ['P', 'Q', 'R', 'S'], 34, 'zone_c', 180),
        },
      ],
      stage: {
        type: 'thrust',
        width: 65,
        depth: 35,
        position: 'front',
      },
      aisles: [
        { id: 'aisle-l', type: 'vertical', position: 25 },
        { id: 'aisle-r', type: 'vertical', position: 75 },
      ],
    },
    amenities: [
      { id: 'ac', name: 'Air Conditioning', icon: 'snow-outline' },
      { id: 'bar', name: 'Theater Bar', icon: 'wine-outline' },
      { id: 'restaurant', name: 'Restaurant', icon: 'restaurant-outline' },
      { id: 'parking', name: 'Parking', icon: 'car-outline' },
    ],
    accessibility: [
      { id: 'wheelchair', name: 'Wheelchair Accessible', description: 'Full accessibility', icon: 'accessibility-outline' },
      { id: 'hearing', name: 'Assisted Listening', description: 'Personal devices available', icon: 'ear-outline' },
      { id: 'visual', name: 'Audio Description', description: 'Available for select shows', icon: 'eye-outline' },
    ],
    audioSystems: ['Meyer Sound', 'Hearing Assistance', 'Audio Description'],
    established: 1970,
  },

  // ============================================
  // Gesher Theatre
  // ============================================
  {
    id: 'gesher-main',
    name: 'Gesher Theatre Hall',
    nameHe: 'אולם תיאטרון גשר',
    theaterId: 'gesher',
    theaterName: 'Gesher Theatre',
    description: 'A modern theater space known for bridging cultures through multilingual performances. Features state-of-the-art sound and lighting systems.',
    descriptionHe: 'מרחב תיאטרון מודרני הידוע בגישור בין תרבויות באמצעות הפקות רב-לשוניות.',
    capacity: 500,
    imageUrl: 'https://picsum.photos/seed/gesher/800/400',
    photos: [
      'https://picsum.photos/seed/gesher1/800/600',
      'https://picsum.photos/seed/gesher2/800/600',
    ],
    layout: {
      id: 'gesher-layout',
      hallId: 'gesher-main',
      totalSeats: 500,
      sections: [
        {
          id: 'gesher-stalls',
          name: 'Stalls',
          nameHe: 'אולם תחתון',
          zone: 'zone_a',
          color: ZONE_COLORS.zone_a,
          rows: generateRows('gesher-stalls', ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'], 25, 'zone_a', 250, { curve: 4, wheelchairRow: 'J' }),
        },
        {
          id: 'gesher-balcony',
          name: 'Balcony',
          nameHe: 'יציע',
          zone: 'zone_b',
          color: ZONE_COLORS.zone_b,
          rows: generateRows('gesher-balc', ['K', 'L', 'M', 'N', 'O'], 26, 'zone_b', 180),
        },
      ],
      stage: {
        type: 'proscenium',
        width: 75,
        depth: 28,
        position: 'front',
      },
      aisles: [
        { id: 'aisle-1', type: 'vertical', position: 40 },
        { id: 'aisle-2', type: 'vertical', position: 60 },
      ],
    },
    amenities: [
      { id: 'ac', name: 'Air Conditioning', icon: 'snow-outline' },
      { id: 'bar', name: 'Lobby Bar', icon: 'wine-outline' },
      { id: 'translation', name: 'Live Translation', icon: 'language-outline' },
    ],
    accessibility: [
      { id: 'wheelchair', name: 'Wheelchair Accessible', description: 'Elevator and ramp access', icon: 'accessibility-outline' },
      { id: 'hearing', name: 'Hearing Loop', description: 'Available throughout', icon: 'ear-outline' },
    ],
    audioSystems: ['d&b Audiotechnik', 'Translation System'],
    established: 1991,
  },

  // ============================================
  // Opera House - Main Hall
  // ============================================
  {
    id: 'opera-main',
    name: 'Israeli Opera Hall',
    nameHe: 'אולם האופרה הישראלית',
    theaterId: 'opera',
    theaterName: 'Israeli Opera',
    description: 'The premier venue for opera in Israel, featuring exceptional acoustics, a grand orchestra pit, and luxurious seating across multiple tiers.',
    descriptionHe: 'המקום המוביל לאופרה בישראל, הכולל אקוסטיקה יוצאת דופן, בור תזמורת מפואר וישיבה יוקרתית.',
    capacity: 1500,
    imageUrl: 'https://picsum.photos/seed/opera/800/400',
    photos: [
      'https://picsum.photos/seed/opera1/800/600',
      'https://picsum.photos/seed/opera2/800/600',
      'https://picsum.photos/seed/opera3/800/600',
      'https://picsum.photos/seed/opera4/800/600',
    ],
    layout: {
      id: 'opera-main-layout',
      hallId: 'opera-main',
      totalSeats: 1500,
      sections: [
        {
          id: 'opera-premium',
          name: 'Premium Stalls',
          nameHe: 'אולם פרימיום',
          zone: 'premium',
          color: ZONE_COLORS.premium,
          rows: generateRows('opera-prem', ['A', 'B', 'C', 'D'], 30, 'premium', 500, { curve: 6 }),
        },
        {
          id: 'opera-stalls',
          name: 'Stalls',
          nameHe: 'אולם תחתון',
          zone: 'zone_a',
          color: ZONE_COLORS.zone_a,
          rows: generateRows('opera-stalls', ['E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'], 34, 'zone_a', 380, { curve: 4, wheelchairRow: 'M' }),
        },
        {
          id: 'opera-tier1',
          name: 'First Tier',
          nameHe: 'קומה ראשונה',
          zone: 'zone_b',
          color: ZONE_COLORS.zone_b,
          rows: generateRows('opera-t1', ['N', 'O', 'P', 'Q', 'R'], 36, 'zone_b', 300, { curve: 3 }),
        },
        {
          id: 'opera-tier2',
          name: 'Second Tier',
          nameHe: 'קומה שנייה',
          zone: 'zone_c',
          color: ZONE_COLORS.zone_c,
          rows: generateRows('opera-t2', ['S', 'T', 'U', 'V', 'W'], 38, 'zone_c', 220, { curve: 2 }),
        },
        {
          id: 'opera-gallery',
          name: 'Gallery',
          nameHe: 'גלריה',
          zone: 'economy',
          color: ZONE_COLORS.economy,
          rows: generateRows('opera-gal', ['X', 'Y', 'Z'], 40, 'economy', 120, { restrictedViewSeats: [1, 2, 3, 38, 39, 40] }),
        },
      ],
      stage: {
        type: 'proscenium',
        width: 80,
        depth: 30,
        position: 'front',
      },
      aisles: [
        { id: 'aisle-l', type: 'vertical', position: 30 },
        { id: 'aisle-r', type: 'vertical', position: 70 },
        { id: 'aisle-mid', type: 'horizontal', position: 50 },
      ],
    },
    amenities: [
      { id: 'ac', name: 'Climate Control', icon: 'snow-outline' },
      { id: 'champagne', name: 'Champagne Bar', icon: 'wine-outline' },
      { id: 'restaurant', name: 'Fine Dining', icon: 'restaurant-outline' },
      { id: 'valet', name: 'Valet Parking', icon: 'car-sport-outline' },
      { id: 'vip', name: 'VIP Lounge', icon: 'star-outline' },
    ],
    accessibility: [
      { id: 'wheelchair', name: 'Wheelchair Accessible', description: 'All tiers accessible', icon: 'accessibility-outline' },
      { id: 'hearing', name: 'Hearing Loop', description: 'Full coverage', icon: 'ear-outline' },
      { id: 'visual', name: 'Audio Description', description: 'Available', icon: 'eye-outline' },
      { id: 'surtitles', name: 'Surtitles', description: 'Hebrew & English', icon: 'text-outline' },
    ],
    audioSystems: ['Concert Hall Acoustics', 'Surtitle System', 'Orchestra Pit Sound'],
    established: 1994,
  },

  // ============================================
  // Beit Lessin Theatre
  // ============================================
  {
    id: 'lessin-main',
    name: 'Beit Lessin Main Hall',
    nameHe: 'האולם הראשי - בית לסין',
    theaterId: 'lessin',
    theaterName: 'Beit Lessin Theatre',
    description: 'A beloved Tel Aviv theater known for quality drama and comedy productions in an intimate setting.',
    descriptionHe: 'תיאטרון תל אביבי אהוב הידוע בהפקות דרמה וקומדיה איכותיות בסביבה אינטימית.',
    capacity: 400,
    imageUrl: 'https://picsum.photos/seed/lessin/800/400',
    photos: [
      'https://picsum.photos/seed/lessin1/800/600',
      'https://picsum.photos/seed/lessin2/800/600',
    ],
    layout: {
      id: 'lessin-layout',
      hallId: 'lessin-main',
      totalSeats: 400,
      sections: [
        {
          id: 'lessin-front',
          name: 'Front Rows',
          nameHe: 'שורות קדמיות',
          zone: 'zone_a',
          color: ZONE_COLORS.zone_a,
          rows: generateRows('lessin-front', ['A', 'B', 'C', 'D', 'E'], 20, 'zone_a', 220, { curve: 3 }),
        },
        {
          id: 'lessin-middle',
          name: 'Center Section',
          nameHe: 'מרכז האולם',
          zone: 'zone_b',
          color: ZONE_COLORS.zone_b,
          rows: generateRows('lessin-mid', ['F', 'G', 'H', 'I', 'J', 'K'], 22, 'zone_b', 180, { wheelchairRow: 'K' }),
        },
        {
          id: 'lessin-back',
          name: 'Back Section',
          nameHe: 'חלק אחורי',
          zone: 'zone_c',
          color: ZONE_COLORS.zone_c,
          rows: generateRows('lessin-back', ['L', 'M', 'N', 'O'], 24, 'zone_c', 140),
        },
      ],
      stage: {
        type: 'proscenium',
        width: 70,
        depth: 25,
        position: 'front',
      },
      aisles: [
        { id: 'aisle-center', type: 'vertical', position: 50 },
      ],
    },
    amenities: [
      { id: 'ac', name: 'Air Conditioning', icon: 'snow-outline' },
      { id: 'bar', name: 'Theater Bar', icon: 'wine-outline' },
      { id: 'cafe', name: 'Café', icon: 'cafe-outline' },
    ],
    accessibility: [
      { id: 'wheelchair', name: 'Wheelchair Accessible', description: 'Ramp access available', icon: 'accessibility-outline' },
    ],
    audioSystems: ['Professional Sound'],
    established: 1982,
  },
];

// ============================================
// Helper Functions for Hall Data
// ============================================

export function getHallById(hallId: string): Hall | undefined {
  return HALLS.find(hall => hall.id === hallId);
}

export function getHallsByTheaterId(theaterId: string): Hall[] {
  return HALLS.filter(hall => hall.theaterId === theaterId);
}

export function getHallCapacity(hallId: string): number {
  const hall = getHallById(hallId);
  return hall?.capacity || 0;
}

export function getHallSections(hallId: string): HallSection[] {
  const hall = getHallById(hallId);
  return hall?.layout.sections || [];
}

export function getSeatById(hallId: string, seatId: string): HallSeat | undefined {
  const hall = getHallById(hallId);
  if (!hall) return undefined;
  
  for (const section of hall.layout.sections) {
    for (const row of section.rows) {
      const seat = row.seats.find(s => s.id === seatId);
      if (seat) return seat;
    }
  }
  return undefined;
}

export function getAvailableSeatsCount(hallId: string): number {
  const hall = getHallById(hallId);
  if (!hall) return 0;
  
  let count = 0;
  for (const section of hall.layout.sections) {
    for (const row of section.rows) {
      count += row.seats.filter(s => s.available).length;
    }
  }
  return count;
}

export function getPriceRange(hallId: string): { min: number; max: number } {
  const hall = getHallById(hallId);
  if (!hall) return { min: 0, max: 0 };
  
  let min = Infinity;
  let max = 0;
  
  for (const section of hall.layout.sections) {
    for (const row of section.rows) {
      for (const seat of row.seats) {
        if (seat.price < min) min = seat.price;
        if (seat.price > max) max = seat.price;
      }
    }
  }
  
  return { min: min === Infinity ? 0 : min, max };
}
