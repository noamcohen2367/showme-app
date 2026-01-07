# ShowME - Israeli Theater Booking App 🎭

ShowME is a React Native (Expo) application for discovering and booking theater shows and cultural performances across Israel.

## Stage 1 Complete ✅

### What's Included

#### Project Structure
```
showme-app/
├── App.tsx                    # Main entry point
├── app.json                   # Expo configuration
├── babel.config.js            # Babel config with reanimated
├── src/
│   ├── components/            # Reusable UI components (empty - Stage 2)
│   ├── context/               # React context providers (empty - Stage 4)
│   ├── data/                  # Dummy data
│   │   ├── actors.ts          # Actor profiles
│   │   ├── shows.ts           # Show listings
│   │   ├── theaters.ts        # Theater venues
│   │   ├── user.ts            # User data, subscriptions, orders
│   │   └── index.ts           # Data exports
│   ├── hooks/                 # Custom hooks (empty - Stage 2+)
│   ├── i18n/                  # Internationalization
│   │   ├── index.ts           # i18n configuration
│   │   └── locales/
│   │       ├── en.ts          # English translations
│   │       ├── he.ts          # Hebrew translations
│   │       └── ru.ts          # Russian translations
│   ├── navigation/            # React Navigation setup
│   │   ├── BottomTabNavigator.tsx
│   │   ├── RootNavigator.tsx
│   │   └── index.ts
│   ├── screens/               # All app screens
│   │   ├── HomeScreen.tsx
│   │   ├── SearchScreen.tsx
│   │   ├── MyPerformancesScreen.tsx
│   │   ├── MySubscriptionsScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   ├── ShowDetailsScreen.tsx
│   │   ├── ActorProfileScreen.tsx
│   │   ├── DateSelectionScreen.tsx
│   │   ├── TimeSelectionScreen.tsx
│   │   ├── SeatSelectionScreen.tsx
│   │   ├── CheckoutScreen.tsx
│   │   ├── OrderConfirmationScreen.tsx
│   │   ├── SettingsScreen.tsx
│   │   └── index.ts
│   ├── theme/                 # Design system
│   │   └── index.ts           # Colors, typography, spacing
│   ├── types/                 # TypeScript definitions
│   │   └── index.ts           # All type definitions
│   └── utils/                 # Utility functions (empty - Stage 2+)
```

### Features Implemented

1. **Navigation Setup**
   - Bottom tab navigation (Home, Search, My Shows, Subscriptions, Profile)
   - Stack navigation for booking flow
   - RTL-aware animations

2. **Internationalization (i18n)**
   - Full Hebrew (עברית) support
   - Full English support
   - Full Russian (Русский) support
   - RTL layout support for Hebrew
   - Language switching in Settings

3. **Design System**
   - Theater-inspired color palette (burgundy & gold)
   - Typography scale
   - Spacing system
   - Shadows & border radius
   - Seat zone colors for interactive maps

4. **Dummy Data**
   - 8 Theaters across Israel
   - 8 Actors with bios
   - 12 Shows with full details
   - User profile with subscriptions
   - Sample orders and watchlist

5. **Screen Placeholders**
   - All screens have basic UI
   - MyPerformances shows upcoming/past tabs
   - MySubscriptions displays real subscription data
   - Profile with user level progress
   - Settings with language switching

### How to Run

```bash
# Navigate to project
cd showme-app

# Install dependencies
npm install

# Start Expo
npx expo start

# Run on specific platform
npx expo start --ios
npx expo start --android
npx expo start --web
```

### Key Dependencies

- `expo` - Development platform
- `@react-navigation/native` - Navigation
- `@react-navigation/bottom-tabs` - Tab navigation
- `@react-navigation/native-stack` - Stack navigation
- `i18next` & `react-i18next` - Internationalization
- `expo-localization` - Device locale detection
- `react-native-reanimated` - Animations
- `react-native-gesture-handler` - Gestures

### Design Tokens

#### Colors
- **Primary**: `#8B2635` (Burgundy)
- **Secondary**: `#C9A227` (Gold)
- **Background**: `#FAFAF8` (Warm off-white)

#### User Levels
- Bronze: 0-9 shows
- Silver: 10-19 shows
- Gold: 20+ shows

#### Seat Zones
- Premium (Gold) - 100% price
- Zone A (Burgundy) - 85% price
- Zone B (Sage) - 70% price
- Zone C (Steel Blue) - 55% price
- Economy (Gray) - 60% price

---

## Next Steps

### Stage 2: Home & Search Features
- [ ] Filter components (location, date, category)
- [ ] Show card component with badges
- [ ] Search with fuzzy matching
- [ ] Full show details page
- [ ] Actor profile page
- [ ] Gallery/carousel components

### Stage 3: Booking Flow
- [ ] Calendar date picker
- [ ] Time slot selection
- [ ] Interactive seat map with zones
- [ ] Checkout form
- [ ] Payment method UI
- [ ] Order confirmation

### Stage 4: User Profile & My Tickets
- [ ] Ticket card with flip animation
- [ ] Barcode display
- [ ] Rating system with review modal
- [ ] Share functionality
- [ ] Subscription management
- [ ] Watchlist functionality

---

## Type Definitions

All types are defined in `src/types/index.ts`:

- `Show`, `ShowDate`, `ShowTime`
- `Theater`, `Actor`
- `User`, `UserSubscription`
- `Ticket`, `Order`, `Performance`
- `Seat`, `SeatZone`, `HallLayout`
- `ShowFilters`, `WatchlistItem`
- Navigation param lists

---

Confirm this stage is complete and reply "continue" to proceed to Stage 2!
