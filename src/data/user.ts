// ============================================
// ShowME App - Dummy Data: User & Orders
// ============================================

import {
  User,
  UserSubscription,
  Performance,
  Order,
  WatchlistItem,
} from '../types/types';

// Current logged-in user
export const currentUser: User = {
  id: 'user-1',
  email: 'noamcohen2367@gmail.com',
  phone: '+972-54-345-9191',
  fullName: 'Noam Cohen',
  profileImageUrl: '',
  level: 'silver',
  totalPurchases: 12,
  preferredLocation: 'tel_aviv',
  language: 'he',
  createdAt: '2023-06-15',
};

// User subscriptions
export const userSubscriptions: UserSubscription[] = [
  {
    id: 'sub-1',
    userId: 'user-1',
    theaterId: 'theater-1',
    theaterName: 'Habima Theatre',
    subscriptionType: 'Gold Season Pass',
    totalTickets: 10,
    remainingTickets: 6,
    validUntil: '2025-06-30',
    status: 'active',
    subscriptionCode: 'HAB-2024-1234',
  },
  {
    id: 'sub-2',
    userId: 'user-1',
    theaterId: 'theater-2',
    theaterName: 'Beit Lessin Theatre',
    subscriptionType: 'Basic Membership',
    totalTickets: 4,
    remainingTickets: 2,
    validUntil: '2025-03-31',
    status: 'active',
    subscriptionCode: 'LES-2024-5678',
  },
  {
    id: 'sub-3',
    userId: 'user-1',
    theaterId: 'theater-3',
    theaterName: 'Cameri Theatre',
    subscriptionType: 'Premium Pass',
    totalTickets: 6,
    remainingTickets: 0,
    validUntil: '2024-12-31',
    status: 'expired',
    subscriptionCode: 'CAM-2024-9012',
  },
];

// User's watchlist
export const userWatchlist: WatchlistItem[] = [
  {
    id: 'watch-1',
    showId: 'show-2', // Romeo and Juliet
    addedAt: '2024-10-15',
    notifyOnDiscount: true,
    notifyOnNewDates: true,
  },
  {
    id: 'watch-2',
    showId: 'show-7', // The Band's Visit
    addedAt: '2024-11-01',
    notifyOnDiscount: true,
    notifyOnNewDates: false,
  },
  {
    id: 'watch-3',
    showId: 'show-12', // The Color Purple
    addedAt: '2024-11-20',
    notifyOnDiscount: false,
    notifyOnNewDates: true,
  },
];

// Generate dates relative to today
const getRelativeDate = (daysFromNow: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
};

// User's orders/performances
export const userOrders: Order[] = [
  // Upcoming show 1
  {
    id: 'order-1',
    userId: 'user-1',
    showId: 'show-1',
    theaterId: 'theater-2',
    tickets: [
      {
        id: 'ticket-1',
        oderId: 'order-1',
        showId: 'show-1',
        showDate: getRelativeDate(5),
        showTime: '20:00',
        seatId: 'seat-a-15',
        seatRow: 'A',
        seatNumber: 15,
        price: 175,
        barcode: '1234567890123',
        hasTicketProtect: true,
      },
      {
        id: 'ticket-2',
        oderId: 'order-1',
        showId: 'show-1',
        showDate: getRelativeDate(5),
        showTime: '20:00',
        seatId: 'seat-a-16',
        seatRow: 'A',
        seatNumber: 16,
        price: 175,
        barcode: '1234567890124',
        hasTicketProtect: true,
      },
    ],
    totalAmount: 380,
    discountApplied: 20,
    paymentMethod: 'credit',
    purchaseDate: '2024-11-15',
    status: 'confirmed',
  },
  // Upcoming show 2
  {
    id: 'order-2',
    userId: 'user-1',
    showId: 'show-3',
    theaterId: 'theater-3',
    tickets: [
      {
        id: 'ticket-3',
        oderId: 'order-2',
        showId: 'show-3',
        showDate: getRelativeDate(12),
        showTime: '19:30',
        seatId: 'seat-c-8',
        seatRow: 'C',
        seatNumber: 8,
        price: 189,
        barcode: '2345678901234',
        hasTicketProtect: false,
      },
    ],
    totalAmount: 189,
    subscriptionUsed: 'sub-1',
    paymentMethod: 'apple_pay',
    purchaseDate: '2024-11-10',
    status: 'confirmed',
  },
  // Past show 1
  {
    id: 'order-3',
    userId: 'user-1',
    showId: 'show-5',
    theaterId: 'theater-1',
    tickets: [
      {
        id: 'ticket-4',
        oderId: 'order-3',
        showId: 'show-5',
        showDate: getRelativeDate(-30),
        showTime: '20:00',
        seatId: 'seat-b-22',
        seatRow: 'B',
        seatNumber: 22,
        price: 159,
        barcode: '3456789012345',
        hasTicketProtect: false,
      },
      {
        id: 'ticket-5',
        oderId: 'order-3',
        showId: 'show-5',
        showDate: getRelativeDate(-30),
        showTime: '20:00',
        seatId: 'seat-b-23',
        seatRow: 'B',
        seatNumber: 23,
        price: 159,
        barcode: '3456789012346',
        hasTicketProtect: false,
      },
    ],
    totalAmount: 318,
    paymentMethod: 'credit',
    purchaseDate: '2024-10-01',
    status: 'confirmed',
  },
  // Past show 2
  {
    id: 'order-4',
    userId: 'user-1',
    showId: 'show-7',
    theaterId: 'theater-3',
    tickets: [
      {
        id: 'ticket-6',
        oderId: 'order-4',
        showId: 'show-7',
        showDate: getRelativeDate(-60),
        showTime: '21:00',
        seatId: 'seat-d-5',
        seatRow: 'D',
        seatNumber: 5,
        price: 199,
        barcode: '4567890123456',
        hasTicketProtect: true,
      },
    ],
    totalAmount: 219,
    paymentMethod: 'google_pay',
    purchaseDate: '2024-09-15',
    status: 'confirmed',
  },
];

// User ratings for past shows
export const userRatings: Map<string, { rating: number; review?: string }> =
  new Map([
    [
      'order-3',
      { rating: 5, review: 'Amazing performance! The cast was incredible.' },
    ],
    ['order-4', { rating: 4 }],
  ]);

// Generate dates relative to today
const getRelativeDateString = (daysFromNow: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
};

// User performances (for My Tickets screen)
export interface UserPerformance {
  id: string;
  showId: string;
  date: string;
  time: string;
  seats: string[];
  ticketCode: string;
  totalPrice: number;
}

export const userPerformances: UserPerformance[] = [
  // Upcoming performance 1 - in 3 days
  {
    id: 'perf-1',
    showId: 'show-1',
    date: getRelativeDateString(3),
    time: '20:00',
    seats: ['A15', 'A16'],
    ticketCode: 'TKT-2024-001234',
    totalPrice: 380,
  },
  // Upcoming performance 2 - in 10 days
  {
    id: 'perf-2',
    showId: 'show-3',
    date: getRelativeDateString(10),
    time: '19:30',
    seats: ['C8'],
    ticketCode: 'TKT-2024-005678',
    totalPrice: 189,
  },
  // Upcoming performance 3 - tomorrow
  {
    id: 'perf-3',
    showId: 'show-5',
    date: getRelativeDateString(1),
    time: '21:00',
    seats: ['B10', 'B11', 'B12'],
    ticketCode: 'TKT-2024-009012',
    totalPrice: 450,
  },
  // Past performance 1 - 30 days ago
  {
    id: 'perf-4',
    showId: 'show-2',
    date: getRelativeDateString(-30),
    time: '20:00',
    seats: ['D5', 'D6'],
    ticketCode: 'TKT-2024-003456',
    totalPrice: 320,
  },
  // Past performance 2 - 60 days ago
  {
    id: 'perf-5',
    showId: 'show-7',
    date: getRelativeDateString(-60),
    time: '19:00',
    seats: ['E20'],
    ticketCode: 'TKT-2024-007890',
    totalPrice: 199,
  },
];

// Helper functions
export const getUpcomingPerformances = (): Order[] => {
  const today = new Date().toISOString().split('T')[0];
  return userOrders.filter(
    (order) =>
      order.status === 'confirmed' && order.tickets[0]?.showDate >= today,
  );
};

export const getPastPerformances = (): Order[] => {
  const today = new Date().toISOString().split('T')[0];
  return userOrders.filter(
    (order) =>
      order.status === 'confirmed' && order.tickets[0]?.showDate < today,
  );
};

export const isShowInWatchlist = (showId: string): boolean => {
  return userWatchlist.some((item) => item.showId === showId);
};

export const getSubscriptionByTheaterId = (
  theaterId: string,
): UserSubscription | undefined => {
  return userSubscriptions.find(
    (sub) => sub.theaterId === theaterId && sub.status === 'active',
  );
};

// User level thresholds
export const USER_LEVEL_THRESHOLDS = {
  bronze: { min: 0, max: 9 },
  silver: { min: 10, max: 19 },
  gold: { min: 20, max: Infinity },
};

export const getNextLevel = (
  currentLevel: string,
): { level: string; showsNeeded: number } | null => {
  const levels = ['bronze', 'silver', 'gold'];
  const currentIndex = levels.indexOf(currentLevel);

  if (currentIndex < levels.length - 1) {
    const nextLevel = levels[currentIndex + 1];
    const threshold =
      USER_LEVEL_THRESHOLDS[nextLevel as keyof typeof USER_LEVEL_THRESHOLDS];
    return {
      level: nextLevel,
      showsNeeded: threshold.min - currentUser.totalPurchases,
    };
  }

  return null;
};

export default {
  currentUser,
  userSubscriptions,
  userWatchlist,
  userOrders,
  userRatings,
  userPerformances,
};
