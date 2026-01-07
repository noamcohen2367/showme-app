// ============================================
// ShowME App - Type Definitions
// ============================================

// Location types for filtering
export type LocationArea =
  | 'tel_aviv'
  | 'sharon'
  | 'south'
  | 'north'
  | 'jerusalem'
  | 'herzliya'
  | 'beer_sheva'
  | 'haifa';

// Show categories
export type ShowCategory =
  | 'musical'
  | 'drama'
  | 'comedy'
  | 'popular'
  | 'short' // Less than 90 minutes
  | 'lgbt'
  | 'suspense'
  | 'romance'
  | 'new'
  | 'family'
  | 'children'
  | 'dance'
  | 'opera'
  | 'long_running';

// Badge types for show cards
export type ShowBadge =
  | 'popular_in_area'
  | 'selling_fast'
  | 'special_price'
  | 'last_chance'
  | 'new';

// User subscription levels
export type UserLevel = 'bronze' | 'silver' | 'gold';

// Seat zone types for pricing
export type SeatZone = 'premium' | 'zone_a' | 'zone_b' | 'zone_c' | 'economy';

// Seat status
export type SeatStatus = 'available' | 'occupied' | 'selected' | 'limited_view';

// Payment method types
export type PaymentMethod = 'credit' | 'apple_pay' | 'google_pay' | 'paypal';

// Subscription types (theater subscriptions)
export type SubscriptionStatus = 'active' | 'expired' | 'pending_renewal';

// ============================================
// Main Data Models
// ============================================

export interface Theater {
  id: string;
  name: string;
  nameHe: string;
  nameRu: string;
  address: string;
  addressHe: string;
  addressRu: string;
  location: LocationArea;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  imageUrl: string;
  seatingCapacity: number;
}

export interface Actor {
  id: string;
  name: string;
  nameHe: string;
  nameRu: string;
  bio: string;
  bioHe: string;
  bioRu: string;
  imageUrl: string;
  photos: string[];
  showIds: string[]; // Shows they've been in
}

export interface Show {
  id: string;
  title: string;
  titleHe: string;
  titleRu: string;
  description: string;
  descriptionHe: string;
  descriptionRu: string;
  imageUrl: string;
  galleryImages: string[];
  theaterId: string;
  hallLayoutId?: string; // Links to hall layout for seat selection
  categories: ShowCategory[];
  duration: number; // in minutes
  rating: number; // 1-5
  reviewCount: number;
  startingPrice: number; // in NIS
  originalPrice?: number; // for showing discounts
  badges: ShowBadge[];
  actorIds: string[];
  availableDates: ShowDate[];
  isActive: boolean;
  premiereDate: string;
}

export interface ShowDate {
  date: string; // ISO date string
  times: ShowTime[];
  availability: 'available' | 'limited' | 'sold_out' | 'high_demand';
}

export interface ShowTime {
  id: string;
  time: string; // HH:mm format
  availableSeats: number;
  totalSeats: number;
  isLastMinuteDeal?: boolean;
  lastMinutePrice?: number;
  price: number;
  originalPrice?: number;
}

export interface Seat {
  id: string;
  row: string;
  number: number;
  zone: SeatZone;
  price: number;
  isAvailable: boolean; // Add this property
  isAccessible: boolean;
  status: SeatStatus;
  x: number; // Position for interactive map
  y: number;
}

export interface HallLayout {
  theaterId: string;
  rows: number;
  seatsPerRow: number;
  zones: ZoneConfig[];
  stage: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface ZoneConfig {
  zone: SeatZone;
  color: string;
  priceMultiplier: number; // 1.0 = base price, 0.6 = 60% of premium
  label: string;
  labelHe: string;
  labelRu: string;
}

// ============================================
// User Related Types
// ============================================

export interface User {
  id: string;
  email: string;
  phone: string;
  fullName: string;
  profileImageUrl?: string;
  level: UserLevel;
  totalPurchases: number;
  preferredLocation?: LocationArea;
  language: 'en' | 'he' | 'ru';
  createdAt: string;
}

export interface UserSubscription {
  id: string;
  userId: string;
  theaterId: string;
  theaterName: string;
  subscriptionType: string;
  totalTickets: number;
  remainingTickets: number;
  validUntil: string;
  status: SubscriptionStatus;
  subscriptionCode: string;
}

export interface Ticket {
  id: string;
  oderId: string;
  showId: string;
  showDate: string;
  showTime: string;
  seatId: string;
  seatRow: string;
  seatNumber: number;
  price: number;
  barcode: string;
  hasTicketProtect: boolean;
}

export interface Order {
  id: string;
  userId: string;
  showId: string;
  theaterId: string;
  tickets: Ticket[];
  totalAmount: number;
  discountApplied?: number;
  subscriptionUsed?: string;
  paymentMethod: PaymentMethod;
  purchaseDate: string;
  status: 'confirmed' | 'cancelled' | 'pending';
}

export interface Performance {
  id: string;
  orderId: string;
  show: Show;
  theater: Theater;
  date: string;
  time: string;
  tickets: Ticket[];
  userRating?: number;
  userReview?: string;
  isPast: boolean;
}

// ============================================
// Watchlist
// ============================================

export interface WatchlistItem {
  id: string;
  showId: string;
  addedAt: string;
  notifyOnDiscount: boolean;
  notifyOnNewDates: boolean;
}

// ============================================
// Filter Types
// ============================================

export interface ShowFilters {
  location?: LocationArea;
  dateFrom?: string;
  dateTo?: string;
  categories?: ShowCategory[];
  priceMin?: number;
  priceMax?: number;
  showWatchlistOnly?: boolean;
}

// ============================================
// Navigation Types
// ============================================

export type RootStackParamList = {
  MainTabs: { screen?: string } | undefined;
  ShowDetails: { showId: string };
  ActorProfile: { actorId: string };
  DateSelection: { showId: string };
  TimeSelection: { showId: string; date: string };
  SeatSelection: { showId: string; date: string; time: string };
  Checkout: {
    showId: string;
    date: string;
    time: string;
    seats: string[];
    totalPrice: number;
  };
  OrderConfirmation: {
    orderId: string;
    showId: string;
    date: string;
    time: string;
    seats: string[];
    totalPrice: number;
  };
  TicketDetail: { performanceId: string };
  Settings: undefined;
  EditProfile: undefined;
  // PaymentMethods: undefined;
  FAQ: undefined;
  // New screens (Stage 8-14)
  Notifications: undefined;
  Rewards: undefined;
  Analytics: undefined;
  Social: undefined;
  Appearance: undefined;
  Map: undefined;
  // New screens (Stage 15-17)
  EnhancedSearch: undefined;
  GroupBooking: { showId?: string } | undefined;
  SpecialOccasions: undefined;
  // Additional screens
  Onboarding: undefined;
  // Stage 18 screens
  DigitalWallet: { ticketId?: string } | undefined;
  PaymentMethods: undefined;
  ShareTicket: { ticketId?: string } | undefined;
  Review: { showId?: string; performanceId?: string } | undefined;
  AddToCalendar: { ticketId?: string } | undefined;
  NotificationPreferences: undefined;
  LiveChat: undefined;
  // Stage 19 screens - Hall Library
  HallLibrary: undefined;
  HallDetails: { hallId: string };
};

export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  MyPerformances: undefined;
  MySubscriptions: undefined;
  Profile: undefined;
};
