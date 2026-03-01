// ============================================
// ShowME App - Mock Notifications Data
// ============================================

export interface AppNotification {
  id: string;
  type: 'reminder' | 'discount' | 'new_show' | 'review' | 'system' | 'social';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  image?: string;
  actionData?: {
    type: 'show' | 'ticket' | 'profile';
    id: string;
  };
}

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: '1',
    type: 'reminder',
    title: 'Show Tomorrow!',
    message: 'Don\'t forget! "The Phantom of the Opera" is tomorrow at 20:00 at Habima Theatre.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    read: false,
    image: 'https://picsum.photos/seed/show1/100/100',
    actionData: { type: 'ticket', id: 'perf-1' },
  },
  {
    id: '2',
    type: 'discount',
    title: '30% Off This Weekend!',
    message: 'Exclusive deal: Get 30% off on "Romeo and Juliet" tickets. Limited time only!',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    read: false,
    image: 'https://picsum.photos/seed/show2/100/100',
    actionData: { type: 'show', id: 'show-2' },
  },
  {
    id: '3',
    type: 'new_show',
    title: 'New Show Added',
    message: '"Les Misérables" is now available for booking! Be the first to get tickets.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    read: true,
    image: 'https://picsum.photos/seed/show3/100/100',
    actionData: { type: 'show', id: 'show-3' },
  },
  {
    id: '4',
    type: 'review',
    title: 'Rate Your Experience',
    message: 'How was "The Band\'s Visit"? Share your thoughts and help others discover great shows.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    read: true,
    actionData: { type: 'show', id: 'show-7' },
  },
  {
    id: '5',
    type: 'social',
    title: 'Sarah liked your review',
    message: 'Your review of "Fiddler on the Roof" received 5 likes!',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    read: true,
  },
  {
    id: '6',
    type: 'system',
    title: 'Subscription Expiring Soon',
    message: 'Your Habima Theatre subscription expires in 7 days. Renew now to keep your benefits!',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    read: true,
  },
];
