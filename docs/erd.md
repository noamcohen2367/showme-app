# ShowME App — Entity Relationship Diagram (v1)

```mermaid
erDiagram

  %% ─── Core Domain ────────────────────────────────────────────────────────────

  THEATER {
    string  id
    string  name
    string  nameHe
    string  nameRu
    string  address
    string  location
    float   lat
    float   lng
    string  imageUrl
    int     seatingCapacity
  }

  HALL {
    string  id
    string  theaterId FK
    string  name
    string  nameHe
    int     capacity
    string  stageType
    string  imageUrl
  }

  HALL_LAYOUT {
    string  id
    string  hallId FK
    int     totalSeats
    int     width
    int     height
    string  stageType
    string  stagePosition
  }

  SEAT {
    string  id
    string  hallLayoutId FK
    string  row
    int     number
    string  zone
    float   price
    string  type
    bool    available
    float   x
    float   y
  }

  SHOW {
    string   id
    string   theaterId FK
    string   hallLayoutId FK
    string   title
    string   titleHe
    string   titleRu
    string   description
    string   imageUrl
    string[] categories
    int      duration
    float    rating
    int      reviewCount
    float    startingPrice
    float    originalPrice
    string[] badges
    bool     isActive
    date     premiereDate
  }

  SHOW_DATE {
    string id
    string showId FK
    date   date
    string availability
  }

  SHOW_TIME {
    string  id
    string  showDateId FK
    string  time
    int     availableSeats
    int     totalSeats
    bool    isLastMinuteDeal
    float   lastMinutePrice
    float   price
    float   originalPrice
    string  purchaseLink
  }

  ACTOR {
    string   id
    string   name
    string   nameHe
    string   nameRu
    string   bio
    string   bioHe
    string   bioRu
    string   imageUrl
    string[] photos
  }

  SHOW_ACTOR {
    string showId FK
    string actorId FK
  }

  %% ─── User Domain ─────────────────────────────────────────────────────────────

  USER {
    string id
    string email
    string phone
    string fullName
    string profileImageUrl
    string level
    int    totalPurchases
    string preferredLocation
    string language
    date   createdAt
  }

  ORDER {
    string  id
    string  userId FK
    string  showId FK
    string  theaterId FK
    float   totalAmount
    float   discountApplied
    bool    subscriptionUsed
    string  paymentMethod
    date    purchaseDate
    string  status
  }

  TICKET {
    string  id
    string  orderId FK
    string  showId FK
    string  seatId FK
    date    showDate
    string  showTime
    string  seatRow
    int     seatNumber
    float   price
    string  barcode
    bool    hasTicketProtect
  }

  PERFORMANCE {
    string  id
    string  orderId FK
    string  showId FK
    string  theaterId FK
    date    date
    string  time
    bool    isPast
    int     userRating
    string  userReview
  }

  USER_SUBSCRIPTION {
    string  id
    string  userId FK
    string  theaterId FK
    string  subscriptionType
    int     totalTickets
    int     remainingTickets
    int     usedCount
    date    validUntil
    string  status
    string  subscriptionCode
  }

  WATCHLIST_ITEM {
    string  id
    string  userId FK
    string  showId FK
    date    addedAt
    bool    notifyOnDiscount
    bool    notifyOnNewDates
  }

  %% ─── Notification Domain ─────────────────────────────────────────────────────

  NOTIFICATION {
    string  id
    string  userId FK
    string  type
    string  title
    string  message
    date    timestamp
    bool    read
    string  actionType
    string  actionId
  }

  %% ─── Auth / Session ──────────────────────────────────────────────────────────

  AUTH_STATE {
    bool    isLoggedIn
    string  identifier
    date    updatedAt
  }

  %% ─── Relationships ────────────────────────────────────────────────────────────

  THEATER         ||--o{ HALL              : "has"
  THEATER         ||--o{ SHOW             : "hosts"
  THEATER         ||--o{ USER_SUBSCRIPTION : "offered to"

  HALL            ||--o{ HALL_LAYOUT      : "has layout"
  HALL_LAYOUT     ||--o{ SEAT             : "contains"

  SHOW            ||--|| HALL_LAYOUT      : "uses"
  SHOW            ||--o{ SHOW_DATE        : "scheduled on"
  SHOW            ||--o{ SHOW_ACTOR       : "features"
  SHOW            ||--o{ WATCHLIST_ITEM   : "saved in"
  SHOW            ||--o{ ORDER            : "purchased via"

  SHOW_DATE       ||--o{ SHOW_TIME        : "has"

  ACTOR           ||--o{ SHOW_ACTOR       : "appears in"

  USER            ||--o{ ORDER            : "places"
  USER            ||--o{ USER_SUBSCRIPTION : "holds"
  USER            ||--o{ WATCHLIST_ITEM   : "maintains"
  USER            ||--o{ PERFORMANCE      : "attends"
  USER            ||--o{ NOTIFICATION     : "receives"
  USER            ||--|| AUTH_STATE       : "authenticated via"

  ORDER           ||--o{ TICKET          : "contains"
  ORDER           ||--|| PERFORMANCE     : "results in"

  TICKET          ||--|| SEAT            : "assigned to"
```

## Legend

| Symbol | Meaning |
|--------|---------|
| `\|\|--\|\|` | One-to-one |
| `\|\|--o{` | One-to-many |
| `o{--o{` | Many-to-many |

## Notes
- **SHOW_ACTOR** is a junction table resolving the many-to-many between Show and Actor
- **AUTH_STATE** is stored locally (AsyncStorage), not on a server
- **HALL_LAYOUT** is denormalised slightly — a Hall has a fixed layout, but a Show can override which layout to use (e.g. thrust vs. proscenium for the same hall)
- **SHOW_TIME.purchaseLink** points to the theater's external ticketing site (no in-app checkout in v1)
- All text fields with `He`/`Ru` suffixes support Hebrew and Russian localisation
