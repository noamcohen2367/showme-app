// ============================================
// ShowME App - Advanced Hall Layouts
// ============================================

import { SeatZone } from '../types/types';

// ============================================
// Types for Visual Seat Map
// ============================================

export interface SeatData {
  id: string;
  row: string;
  number: number;
  x: number;
  y: number;
  zone: SeatZone;
  price: number;
  available: boolean;
  type: 'regular' | 'wheelchair' | 'companion' | 'vip' | 'restricted_view';
}

export interface SectionData {
  id: string;
  name: string;
  nameHe: string;
  zone: SeatZone;
  color: string;
  seats: SeatData[];
}

export interface HallLayoutData {
  id: string;
  name: string;
  nameHe: string;
  width: number;
  height: number;
  stageType: 'proscenium' | 'thrust' | 'arena' | 'amphitheater' | 'black_box';
  stagePosition: { x: number; y: number; width: number; height: number };
  sections: SectionData[];
  totalSeats: number;
}

export const ZONE_COLORS: Record<SeatZone, string> = {
  premium: '#FFD700',
  zone_a: '#A855F7',
  zone_b: '#EC4899',
  zone_c: '#06B6D4',
  economy: '#6B7280',
};

// ============================================
// Layout 1: Arena with Side Wings (Image 1)
// ============================================

export const LAYOUT_ARENA_WINGS: HallLayoutData = {
  id: 'arena-wings',
  name: 'Arena Theater',
  nameHe: 'תיאטרון זירה',
  width: 800,
  height: 600,
  stageType: 'arena',
  stagePosition: { x: 250, y: 20, width: 300, height: 80 },
  totalSeats: 450,
  sections: [
    {
      id: 'left-wing',
      name: 'Left Wing',
      nameHe: 'אגף שמאל',
      zone: 'zone_b',
      color: '#EC4899',
      seats: (() => {
        const seats: SeatData[] = [];
        const rows = [
          { count: 4, y: 100 },
          { count: 4, y: 130 },
          { count: 4, y: 160 },
          { count: 4, y: 190 },
          { count: 3, y: 220 },
          { count: 3, y: 250 },
          { count: 2, y: 280 },
        ];
        rows.forEach((row, r) => {
          for (let s = 0; s < row.count; s++) {
            seats.push({
              id: `lw-${r + 1}-${s + 1}`,
              row: String(r + 1),
              number: s + 1,
              x: 30 + s * 28 + r * 10,
              y: row.y,
              zone: 'zone_b',
              price: 180,
              available: Math.random() > 0.25,
              type: 'regular',
            });
          }
        });
        return seats;
      })(),
    },
    {
      id: 'right-wing',
      name: 'Right Wing',
      nameHe: 'אגף ימין',
      zone: 'zone_b',
      color: '#EC4899',
      seats: (() => {
        const seats: SeatData[] = [];
        const rows = [
          { count: 4, y: 100 },
          { count: 4, y: 130 },
          { count: 4, y: 160 },
          { count: 4, y: 190 },
          { count: 3, y: 220 },
          { count: 3, y: 250 },
          { count: 2, y: 280 },
        ];
        rows.forEach((row, r) => {
          for (let s = 0; s < row.count; s++) {
            seats.push({
              id: `rw-${r + 1}-${s + 1}`,
              row: String(r + 1),
              number: row.count - s,
              x: 770 - s * 28 - r * 10,
              y: row.y,
              zone: 'zone_b',
              price: 180,
              available: Math.random() > 0.25,
              type: 'regular',
            });
          }
        });
        return seats;
      })(),
    },
    {
      id: 'orchestra',
      name: 'Orchestra',
      nameHe: 'אורקסטרה',
      zone: 'zone_a',
      color: '#A855F7',
      seats: (() => {
        const seats: SeatData[] = [];
        const rows = [
          { label: '1', count: 14, y: 380 },
          { label: '2', count: 16, y: 410 },
          { label: '3', count: 18, y: 440 },
          { label: '4', count: 20, y: 470 },
          { label: '5', count: 22, y: 500 },
          { label: '6', count: 24, y: 530 },
        ];
        rows.forEach((row) => {
          const startX = 400 - (row.count * 24) / 2;
          for (let s = 0; s < row.count; s++) {
            seats.push({
              id: `orch-${row.label}-${s + 1}`,
              row: row.label,
              number: s + 1,
              x: startX + s * 24,
              y: row.y,
              zone: 'zone_a',
              price: 250,
              available: Math.random() > 0.3,
              type: 'regular',
            });
          }
        });
        return seats;
      })(),
    },
  ],
};

// ============================================
// Layout 2: Traditional Theater (Image 2)
// ============================================

export const LAYOUT_TRADITIONAL: HallLayoutData = {
  id: 'traditional',
  name: 'Classic Theater',
  nameHe: 'תיאטרון קלאסי',
  width: 700,
  height: 700,
  stageType: 'proscenium',
  stagePosition: { x: 100, y: 10, width: 500, height: 50 },
  totalSeats: 520,
  sections: [
    {
      id: 'balcony',
      name: 'Balcony',
      nameHe: 'יציע',
      zone: 'zone_c',
      color: '#6B7280',
      seats: (() => {
        const seats: SeatData[] = [];
        const rows = [
          { label: '1', count: 20, y: 80 },
          { label: '2', count: 22, y: 106 },
          { label: '3', count: 22, y: 132 },
          { label: '4', count: 24, y: 158 },
          { label: '5', count: 22, y: 184 },
          { label: '6', count: 24, y: 210 },
          { label: '7', count: 24, y: 236 },
          { label: '8', count: 26, y: 262 },
          { label: '9', count: 26, y: 288 },
          { label: '10', count: 26, y: 314 },
          { label: '11', count: 26, y: 340 },
          { label: '12', count: 10, y: 366 },
          { label: '13', count: 18, y: 392 },
        ];
        rows.forEach((row) => {
          const startX = 350 - (row.count * 24) / 2;
          for (let s = 0; s < row.count; s++) {
            seats.push({
              id: `bal-${row.label}-${s + 1}`,
              row: row.label,
              number: s + 1,
              x: startX + s * 24,
              y: row.y,
              zone: 'zone_c',
              price: 150,
              available: Math.random() > 0.3,
              type: 'regular',
            });
          }
        });
        return seats;
      })(),
    },
    {
      id: 'orchestra',
      name: 'Orchestra',
      nameHe: 'אורקסטרה',
      zone: 'premium',
      color: '#06B6D4',
      seats: (() => {
        const seats: SeatData[] = [];
        const rows = [
          { label: '1', count: 32, y: 490 },
          { label: '2', count: 33, y: 518 },
          { label: '3', count: 30, y: 546 },
          { label: '4', count: 16, y: 574 },
        ];
        rows.forEach((row) => {
          const startX = 350 - (row.count * 20) / 2;
          for (let s = 0; s < row.count; s++) {
            seats.push({
              id: `orch-${row.label}-${s + 1}`,
              row: row.label,
              number: s + 1,
              x: startX + s * 20,
              y: row.y,
              zone: 'premium',
              price: 320,
              available: Math.random() > 0.35,
              type: 'regular',
            });
          }
        });
        return seats;
      })(),
    },
  ],
};

// ============================================
// Layout 3: Curved Amphitheater (Image 3)
// ============================================

export const LAYOUT_AMPHITHEATER: HallLayoutData = {
  id: 'amphitheater',
  name: 'Amphitheater',
  nameHe: 'אמפיתיאטרון',
  width: 700,
  height: 800,
  stageType: 'amphitheater',
  stagePosition: { x: 150, y: 10, width: 400, height: 50 },
  totalSeats: 680,
  sections: [
    {
      id: 'upper-tier',
      name: 'Upper Tier',
      nameHe: 'יציע עליון',
      zone: 'zone_b',
      color: '#DC2626',
      seats: (() => {
        const seats: SeatData[] = [];
        for (let r = 0; r < 16; r++) {
          const rowLabel = String(r + 1);
          const baseCount = 16 + Math.floor(r * 1.2);
          const y = 80 + r * 26;
          const curve = 30 - r * 1.5;
          for (let s = 0; s < baseCount; s++) {
            const totalWidth = baseCount * 22;
            const startX = 350 - totalWidth / 2;
            const seatX = startX + s * 22;
            const distFromCenter =
              Math.abs(s - baseCount / 2) / (baseCount / 2);
            const curveOffset = curve * distFromCenter * distFromCenter;
            seats.push({
              id: `up-${rowLabel}-${s + 1}`,
              row: rowLabel,
              number: s + 1,
              x: seatX,
              y: y + curveOffset,
              zone: 'zone_b',
              price: 200,
              available: Math.random() > 0.25,
              type: 'regular',
            });
          }
        }
        return seats;
      })(),
    },
    {
      id: 'lower-tier',
      name: 'Lower Tier',
      nameHe: 'יציע תחתון',
      zone: 'zone_a',
      color: '#22C55E',
      seats: (() => {
        const seats: SeatData[] = [];
        for (let r = 0; r < 9; r++) {
          const rowLabel = String(r + 1);
          const baseCount = 28 + r * 2;
          const y = 530 + r * 28;
          const curve = 25 - r * 2;
          for (let s = 0; s < baseCount; s++) {
            const totalWidth = baseCount * 20;
            const startX = 350 - totalWidth / 2;
            const seatX = startX + s * 20;
            const distFromCenter =
              Math.abs(s - baseCount / 2) / (baseCount / 2);
            const curveOffset = curve * distFromCenter * distFromCenter;
            seats.push({
              id: `low-${rowLabel}-${s + 1}`,
              row: rowLabel,
              number: s + 1,
              x: seatX,
              y: y + curveOffset,
              zone: 'zone_a',
              price: 280,
              available: Math.random() > 0.3,
              type: 'regular',
            });
          }
        }
        return seats;
      })(),
    },
  ],
};

// ============================================
// Layout 4: Grand Opera House (Image 4)
// ============================================

export const LAYOUT_OPERA_HOUSE: HallLayoutData = {
  id: 'opera-house',
  name: 'Grand Opera House',
  nameHe: 'בית האופרה הגדול',
  width: 800,
  height: 900,
  stageType: 'proscenium',
  stagePosition: { x: 150, y: 10, width: 500, height: 50 },
  totalSeats: 1200,
  sections: [
    {
      id: 'orchestra',
      name: 'Orchestra',
      nameHe: 'אורקסטרה',
      zone: 'zone_a',
      color: '#A855F7',
      seats: (() => {
        const seats: SeatData[] = [];
        for (let r = 0; r < 18; r++) {
          const rowLabel = String(r + 1);
          const count = r < 2 ? 20 : r < 10 ? 30 + Math.floor(r / 2) : 34;
          const y = 80 + r * 24;
          for (let s = 0; s < count; s++) {
            const startX = 400 - (count * 22) / 2;
            seats.push({
              id: `orch-${rowLabel}-${s + 1}`,
              row: rowLabel,
              number: s + 1,
              x: startX + s * 22,
              y: y,
              zone: 'zone_a',
              price: 350,
              available: Math.random() > 0.3,
              type:
                r === 17 && (s < 3 || s >= count - 3)
                  ? 'wheelchair'
                  : 'regular',
            });
          }
        }
        return seats;
      })(),
    },
    {
      id: 'mezzanine',
      name: 'Mezzanine',
      nameHe: 'מזנין',
      zone: 'zone_b',
      color: '#06B6D4',
      seats: (() => {
        const seats: SeatData[] = [];
        for (let r = 0; r < 7; r++) {
          const rowLabel = String(r + 1);
          const count = 28 + r;
          const y = 540 + r * 26;
          for (let s = 0; s < count; s++) {
            const startX = 400 - (count * 21) / 2;
            seats.push({
              id: `mezz-${rowLabel}-${s + 1}`,
              row: rowLabel,
              number: s + 1,
              x: startX + s * 21,
              y: y,
              zone: 'zone_b',
              price: 250,
              available: Math.random() > 0.3,
              type: 'regular',
            });
          }
        }
        return seats;
      })(),
    },
    {
      id: 'balcony',
      name: 'Balcony',
      nameHe: 'יציע',
      zone: 'zone_c',
      color: '#6B7280',
      seats: (() => {
        const seats: SeatData[] = [];
        for (let r = 0; r < 3; r++) {
          const rowLabel = String(r + 1);
          const count = 28;
          const y = 750 + r * 26;
          for (let s = 0; s < count; s++) {
            const startX = 400 - (count * 22) / 2;
            seats.push({
              id: `bal-${rowLabel}-${s + 1}`,
              row: rowLabel,
              number: s + 1,
              x: startX + s * 22,
              y: y,
              zone: 'zone_c',
              price: 180,
              available: Math.random() > 0.3,
              type: 'regular',
            });
          }
        }
        return seats;
      })(),
    },
    {
      id: 'left-boxes',
      name: 'Left Boxes',
      nameHe: 'תאים שמאל',
      zone: 'premium',
      color: '#FFD700',
      seats: (() => {
        const seats: SeatData[] = [];
        for (let b = 0; b < 9; b++) {
          for (let s = 0; s < 2; s++) {
            seats.push({
              id: `lb-${b + 1}-${s + 1}`,
              row: `L${b + 1}`,
              number: s + 1,
              x: 50 + s * 26,
              y: 550 + b * 35,
              zone: 'premium',
              price: 450,
              available: Math.random() > 0.4,
              type: 'vip',
            });
          }
        }
        return seats;
      })(),
    },
    {
      id: 'right-boxes',
      name: 'Right Boxes',
      nameHe: 'תאים ימין',
      zone: 'premium',
      color: '#FFD700',
      seats: (() => {
        const seats: SeatData[] = [];
        for (let b = 0; b < 9; b++) {
          for (let s = 0; s < 2; s++) {
            seats.push({
              id: `rb-${b + 1}-${s + 1}`,
              row: `R${b + 1}`,
              number: s + 1,
              x: 750 - s * 26,
              y: 550 + b * 35,
              zone: 'premium',
              price: 450,
              available: Math.random() > 0.4,
              type: 'vip',
            });
          }
        }
        return seats;
      })(),
    },
  ],
};

// ============================================
// Layout 5: Intimate Studio
// ============================================

export const LAYOUT_STUDIO: HallLayoutData = {
  id: 'studio',
  name: 'Intimate Studio',
  nameHe: 'סטודיו אינטימי',
  width: 500,
  height: 400,
  stageType: 'black_box',
  stagePosition: { x: 100, y: 10, width: 300, height: 50 },
  totalSeats: 120,
  sections: [
    {
      id: 'main',
      name: 'Main Floor',
      nameHe: 'אולם ראשי',
      zone: 'zone_a',
      color: '#A855F7',
      seats: (() => {
        const seats: SeatData[] = [];
        for (let r = 0; r < 8; r++) {
          const rowLabel = String.fromCharCode(65 + r);
          for (let s = 0; s < 15; s++) {
            seats.push({
              id: `main-${rowLabel}-${s + 1}`,
              row: rowLabel,
              number: s + 1,
              x: 75 + s * 24,
              y: 100 + r * 35,
              zone: 'zone_a',
              price: 150,
              available: Math.random() > 0.25,
              type: r === 7 && (s === 0 || s === 14) ? 'wheelchair' : 'regular',
            });
          }
        }
        return seats;
      })(),
    },
  ],
};

// ============================================
// Layout 6: Thrust Stage
// ============================================

export const LAYOUT_THRUST: HallLayoutData = {
  id: 'thrust',
  name: 'Thrust Stage Theater',
  nameHe: 'תיאטרון במה בולטת',
  width: 700,
  height: 600,
  stageType: 'thrust',
  stagePosition: { x: 250, y: 150, width: 200, height: 150 },
  totalSeats: 380,
  sections: [
    {
      id: 'front',
      name: 'Front Center',
      nameHe: 'מרכז קדמי',
      zone: 'premium',
      color: '#FFD700',
      seats: (() => {
        const seats: SeatData[] = [];
        for (let r = 0; r < 5; r++) {
          const rowLabel = String.fromCharCode(65 + r);
          const count = 12 + r * 2;
          const y = 330 + r * 30;
          for (let s = 0; s < count; s++) {
            const startX = 350 - (count * 26) / 2;
            seats.push({
              id: `fr-${rowLabel}-${s + 1}`,
              row: rowLabel,
              number: s + 1,
              x: startX + s * 26,
              y: y,
              zone: 'premium',
              price: 320,
              available: Math.random() > 0.3,
              type: 'regular',
            });
          }
        }
        return seats;
      })(),
    },
    {
      id: 'left',
      name: 'Left Section',
      nameHe: 'מגרש שמאל',
      zone: 'zone_a',
      color: '#A855F7',
      seats: (() => {
        const seats: SeatData[] = [];
        for (let r = 0; r < 6; r++) {
          for (let s = 0; s < 5; s++) {
            seats.push({
              id: `left-${r + 1}-${s + 1}`,
              row: `L${r + 1}`,
              number: s + 1,
              x: 60 + s * 28 + r * 10,
              y: 180 + r * 35,
              zone: 'zone_a',
              price: 250,
              available: Math.random() > 0.3,
              type: 'regular',
            });
          }
        }
        return seats;
      })(),
    },
    {
      id: 'right',
      name: 'Right Section',
      nameHe: 'מגרש ימין',
      zone: 'zone_a',
      color: '#A855F7',
      seats: (() => {
        const seats: SeatData[] = [];
        for (let r = 0; r < 6; r++) {
          for (let s = 0; s < 5; s++) {
            seats.push({
              id: `right-${r + 1}-${s + 1}`,
              row: `R${r + 1}`,
              number: s + 1,
              x: 640 - s * 28 - r * 10,
              y: 180 + r * 35,
              zone: 'zone_a',
              price: 250,
              available: Math.random() > 0.3,
              type: 'regular',
            });
          }
        }
        return seats;
      })(),
    },
    {
      id: 'back',
      name: 'Back Section',
      nameHe: 'מגרש אחורי',
      zone: 'zone_b',
      color: '#EC4899',
      seats: (() => {
        const seats: SeatData[] = [];
        for (let r = 0; r < 4; r++) {
          const count = 10;
          const y = 70 + r * 28;
          for (let s = 0; s < count; s++) {
            const startX = 350 - (count * 28) / 2;
            seats.push({
              id: `back-${r + 1}-${s + 1}`,
              row: `B${r + 1}`,
              number: s + 1,
              x: startX + s * 28,
              y: y,
              zone: 'zone_b',
              price: 180,
              available: Math.random() > 0.3,
              type: 'regular',
            });
          }
        }
        return seats;
      })(),
    },
  ],
};

// ============================================
// All Layouts & Mapping
// ============================================

export const ALL_LAYOUTS: Record<string, HallLayoutData> = {
  'arena-wings': LAYOUT_ARENA_WINGS,
  traditional: LAYOUT_TRADITIONAL,
  amphitheater: LAYOUT_AMPHITHEATER,
  'opera-house': LAYOUT_OPERA_HOUSE,
  studio: LAYOUT_STUDIO,
  thrust: LAYOUT_THRUST,
};

// ============================================
// Show to Layout Mapping
// Each show is associated with a specific hall layout
// ============================================

export const SHOW_LAYOUT_MAP: Record<string, string> = {
  // Dathilonim → Traditional theater (comedy suits classic venue)
  'show-1': 'traditional',

  // Romeo and Juliet → Grand Opera House (dramatic, prestigious)
  'show-2': 'opera-house',

  // Chabadniks → Arena with wings (big musical, lively atmosphere)
  'show-3': 'arena-wings',

  // The Dybbuk → Intimate Studio (dark, atmospheric)
  'show-4': 'studio',

  // Sallah Shabati → Amphitheater (big crowd-pleaser)
  'show-5': 'amphitheater',

  // Midsummer Night's Dream → Thrust stage (immersive Shakespeare)
  'show-6': 'thrust',

  // The Band's Visit → Traditional (intimate story, classic setting)
  'show-7': 'traditional',

  // Speed Dating → Studio (small comedy)
  'show-8': 'studio',

  // Ghetto → Opera House (powerful drama, grand setting)
  'show-9': 'opera-house',

  // Pride and Prejudice → Traditional (period drama)
  'show-10': 'traditional',

  // Laugh Factory → Studio (stand-up comedy)
  'show-11': 'studio',

  // The Color Purple → Amphitheater (big musical)
  'show-12': 'amphitheater',
};

export function getLayoutForShow(showId: string): HallLayoutData {
  const layoutId = SHOW_LAYOUT_MAP[showId] || 'traditional';
  return ALL_LAYOUTS[layoutId];
}

// Helper to get all shows for a specific layout
export function getShowsForLayout(layoutId: string): string[] {
  return Object.entries(SHOW_LAYOUT_MAP)
    .filter(([_, layout]) => layout === layoutId)
    .map(([showId, _]) => showId);
}
