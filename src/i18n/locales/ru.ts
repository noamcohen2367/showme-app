// ============================================
// ShowME App - Russian Translations (Русский)
// ============================================

export default {
  // Common
  common: {
    appName: 'Showmi',
    loading: 'Загрузка...',
    error: 'Что-то пошло не так',
    retry: 'Попробовать снова',
    cancel: 'Отмена',
    save: 'Сохранить',
    done: 'Готово',
    ok: 'ОК',
    yes: 'Да',
    no: 'Нет',
    close: 'Закрыть',
    back: 'Назад',
    next: 'Далее',
    search: 'Поиск',
    filter: 'Фильтр',
    apply: 'Применить',
    reset: 'Сбросить',
    all: 'Все',
    none: 'Нет',
    today: 'Сегодня',
    tomorrow: 'Завтра',
    seeAll: 'Все',
    noResults: 'Ничего не найдено',
    currency: '₪',
    startingAt: 'От',
    minutes: 'мин',
  },

  // Navigation
  navigation: {
    home: 'Главная',
    search: 'Поиск',
    myPerformances: 'Список просмотра',
    mySubscriptions: 'Подписки',
    profile: 'Профиль',
  },

  // Home Screen
  home: {
    title: 'Откройте для себя',
    subtitle: 'Найдите ваш следующий театральный опыт',
    locationFilter: 'Место',
    dateFilter: 'Дата',
    categoryFilter: 'Категория',
    watchlistFilter: 'Избранное',
    topInYourArea: 'Популярное рядом',
    trendingNow: 'В тренде',
    lastMinuteDeals: 'Горящие предложения',
    newShows: 'Новые спектакли',
    enableLocation: 'Включите геолокацию для персональных рекомендаций',
    permissionDenied:
      'Доступ к местоположению запрещен. Показаны общие результаты.',
  },

  // Locations
  locations: {
    tel_aviv: 'Тель-Авив',
    sharon: 'Район Шарон',
    south: 'Юг',
    north: 'Север',
    jerusalem: 'Иерусалим',
    haifa: 'Хайфа',
    allLocations: 'Все регионы',
  },

  // Categories
  categories: {
    musical: 'Мюзиклы',
    drama: 'Драма',
    comedy: 'Комедия',
    popular: 'Все говорят',
    short: 'До 90 мин',
    lgbt: 'ЛГБТК+',
    suspense: 'Триллер',
    romance: 'Романтика',
    new: 'Новое',
    long_running: 'Долгоиграющие',
  },

  // Show Badges
  badges: {
    popular_in_area: 'Популярно рядом',
    selling_fast: 'Быстро раскупают',
    special_price: 'Спецпредложение',
    last_chance: 'Последний шанс',
    new: 'Новое',
  },

  // Search Screen
  search: {
    title: 'Поиск',
    placeholder: 'Спектакли, актеры, театры...',
    recentSearches: 'Недавние поиски',
    clearRecent: 'Очистить',
    browseCategories: 'Категории',
    noSearchResults: 'Ничего не найдено по запросу "{{query}}"',
    tryDifferent: 'Попробуйте другой поисковый запрос',
  },

  // Show Details
  show: {
    bookNow: 'Забронировать',
    addToWatchlist: 'В избранное',
    removeFromWatchlist: 'Удалить из избранного',
    about: 'О спектакле',
    cast: 'Актёры',
    reviews: 'Отзывы',
    photos: 'Фото',
    duration: 'Длительность',
    theater: 'Театр',
    categories: 'Категории',
    rating: '{{rating}} ({{count}} отзывов)',
    selectDate: 'Выбрать дату',
    selectTime: 'Выбрать время',
    selectSeats: 'Выбрать места',
    noAvailableDates: 'Нет доступных дат',
    nextShows: 'Ближайшие показы',
    highDemand: 'Высокий спрос',
    limitedAvailability: 'Ограничено',
    soldOut: 'Распродано',
  },

  // Actor Profile
  actor: {
    about: 'Об актёре',
    currentShows: 'Сейчас играет',
    pastShows: 'Прошлые роли',
    photos: 'Фото',
  },

  // Seat Selection
  seats: {
    title: 'Выбор мест',
    stage: 'Сцена',
    selected: 'Выбрано',
    available: 'Свободно',
    occupied: 'Занято',
    limitedView: 'Огранич. обзор',
    zone: 'Зона',
    filterByZone: 'Фильтр по зоне',
    selectedSeats: 'Выбрано мест: {{count}}',
    totalPrice: 'Итого: {{price}}',
    continue: 'Продолжить',
    row: 'Ряд',
    seat: 'Место',
    zones: {
      premium: 'Премиум',
      a: 'Зона А',
      b: 'Зона Б',
      c: 'Зона В',
      economy: 'Эконом',
    },
  },

  // Checkout
  checkout: {
    title: 'Оплата',
    orderSummary: 'Ваш заказ',
    tickets: 'Билеты',
    subtotal: 'Подитог',
    discount: 'Скидка',
    total: 'Итого',
    paymentMethod: 'Способ оплаты',
    addCoupon: 'Добавить купон',
    couponPlaceholder: 'Введите код купона',
    useSubscription: 'Использовать подписку',
    selectSubscription: 'Выбрать подписку',
    ticketProtect: 'Защита билета',
    ticketProtectDesc: 'Полный возврат, если не сможете прийти',
    personalDetails: 'Личные данные',
    fullName: 'Полное имя',
    email: 'Email',
    phone: 'Телефон',
    pay: 'Оплатить {{amount}}',
    processing: 'Обработка...',
    applePay: 'Apple Pay',
    googlePay: 'Google Pay',
    paypal: 'PayPal',
    creditCard: 'Банковская карта',
    cardNumber: 'Номер карты',
    expiry: 'Срок',
    cvv: 'CVV',
    saveCard: 'Сохранить карту',
  },

  // Order Confirmation
  confirmation: {
    title: 'Бронирование подтверждено!',
    subtitle: 'Ваши билеты готовы',
    orderNumber: 'Заказ №{{number}}',
    emailSent: 'Подтверждение отправлено на {{email}}',
    viewTickets: 'Мои билеты',
    backToHome: 'На главную',
    shareTickets: 'Поделиться',
  },

  // My Performances
  performances: {
    title: 'Список просмотра',
    upcoming: 'Предстоящие',
    past: 'Прошедшие',
    noUpcoming: 'Нет предстоящих шоу',
    noPast: 'Пока нет прошедших шоу',
    countdown: '{{days}}д {{hours}}ч',
    daysUntil: 'через {{days}} дней',
    hoursUntil: 'через {{hours}} часов',
    today: 'Сегодня!',
    viewTicket: 'Показать билет',
    options: 'Опции',
    cancelBooking: 'Отменить',
    shareShow: 'Поделиться',
    sendToFriend: 'Отправить другу',
    rateShow: 'Оценить',
    ratePrompt: 'Как вам {{showName}}?',
    writeReview: 'Написать отзыв (опционально)',
    submitRating: 'Отправить',
    noThanks: 'Нет, спасибо',
    shareCaption: 'Иду на {{show}} через {{days}} дней! 🎭\nСоздано в ShowMI',
  },

  // My Subscriptions
  subscriptions: {
    title: 'Мои подписки',
    noSubscriptions: 'Пока нет подписок',
    addSubscription: 'Добавить подписку',
    remaining: 'Осталось билетов: {{count}}',
    validUntil: 'Действует до {{date}}',
    renew: 'Продлить',
    expired: 'Истекла',
    active: 'Активна',
    useTickets: 'Использовать билеты',
    subscriptionCode: 'Код подписки',
  },

  // Profile
  profile: {
    title: 'Профиль',
    level: 'Участник {{level}}',
    totalShows: 'Посещено шоу: {{count}}',
    settings: 'Настройки',
    editProfile: 'Редактировать профиль',
    paymentMethods: 'Способы оплаты',
    notifications: 'Уведомления',
    language: 'Язык',
    faq: 'Частые вопросы',
    contactUs: 'Связаться с нами',
    termsOfUse: 'Условия использования',
    privacyPolicy: 'Политика конфиденциальности',
    logout: 'Выйти',
    logoutConfirm: 'Вы уверены, что хотите выйти?',
    levels: {
      bronze: 'Бронза',
      silver: 'Серебро',
      gold: 'Золото',
    },
    levelProgress: '{{current}}/{{needed}} шоу до {{nextLevel}}',
  },

  // Settings
  settings: {
    title: 'Настройки',
    personalDetails: 'Личные данные',
    fullName: 'Полное имя',
    email: 'Email',
    phone: 'Телефон',
    location: 'Предпочтительный регион',
    locationDesc: 'Шоу из этого региона будут показаны первыми',
    notifications: 'Уведомления',
    pushNotifications: 'Push-уведомления',
    emailNotifications: 'Email-уведомления',
    discountAlerts: 'Оповещения о скидках',
    newShowAlerts: 'Новые спектакли',
    reminderAlerts: 'Напоминания о шоу',
    saved: 'Настройки сохранены',
  },

  // FAQ
  faq: {
    title: 'Частые вопросы',
    q1: 'Как отменить бронирование?',
    a1: 'Если вы приобрели защиту билета, вы можете отменить бронирование за 24 часа до шоу в разделе "Мои шоу".',
    q2: 'Как использовать подписку театра?',
    a2: 'При оплате выберите "Использовать подписку" и выберите вашу подписку. Стоимость билета будет списана с оставшихся билетов.',
    q3: 'Что такое защита билета?',
    a3: 'Защита билета - это дополнительная опция, которая позволяет получить полный возврат, если вы не сможете посетить шоу.',
    q4: 'Как стать золотым участником?',
    a4: 'Посетите 20 или более шоу, чтобы получить золотой статус и эксклюзивные преимущества.',
    q5: 'Можно ли передать билеты?',
    a5: 'Да! Используйте опцию "Отправить другу" в разделе "Мои шоу".',
  },

  // Errors
  errors: {
    network: 'Ошибка сети. Проверьте подключение.',
    generic: 'Что-то пошло не так. Попробуйте снова.',
    paymentFailed: 'Оплата не прошла. Попробуйте снова.',
    seatsUnavailable: 'Некоторые места больше недоступны. Выберите другие.',
    sessionExpired: 'Сессия истекла. Войдите снова.',
    showingCachedData: 'Показаны сохранённые данные. Потяните для обновления.',
    tapToRetry: 'Нажмите для повтора',
    noShows: 'Нет доступных спектаклей',
  },

  // Date/Time
  datetime: {
    today: 'Сегодня',
    tomorrow: 'Завтра',
    thisWeek: 'На этой неделе',
    thisMonth: 'В этом месяце',
    selectDate: 'Выбрать дату',
    selectTime: 'Выбрать время',
  },

  // Watchlist
  watchlist: {
    title: 'Список просмотра',
    tabWatchlist: 'Хочу посмотреть',
    tabWatched: 'Просмотрено',
    emptyWatchlist: 'Список просмотра пуст',
    emptyWatchlistDesc: 'Нажмите на сердечко на странице спектакля, чтобы добавить его',
    emptyWatched: 'Нет просмотренных спектаклей',
    emptyWatchedDesc: 'Здесь появятся спектакли, которые вы отметили как просмотренные',
    browseShows: 'Смотреть спектакли',
    markWatched: 'Отметить как просмотрено',
    addedToWatchlist: 'Добавлено в список',
    removedFromWatchlist: 'Удалено из списка',
    countShows: '{{count}} спектаклей',
    countWatched: '{{count}} просмотрено',
    swipeLeftDelete: 'влево для удаления',
    swipeRightWatched: 'вправо — просмотрено',
  },
};
