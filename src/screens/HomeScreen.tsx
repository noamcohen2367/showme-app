// ============================================
// ShowME App - Home Screen (Enhanced with Rich Sections)
// ============================================

import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Animated,
  Modal,
  TouchableWithoutFeedback,
  I18nManager,
} from 'react-native';
import { Image } from 'expo-image';
import { PullToRefreshScrollView } from '../components/PullToRefresh';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, typography, spacing } from '../theme/theme';
import {
  RootStackParamList,
  LocationArea,
  ShowCategory,
  Show,
} from '../types/types';
import { theaters } from '../data/theaters';
import { useShows } from '../hooks/useShows';
import { HomeScreenSkeleton } from '../components/Skeleton';
import NetworkBanner from '../components/NetworkBanner';
import ErrorState from '../components/ErrorState';
import DateFilter, { DateFilterValue } from '../components/DateFilter';
import {
  ShowCard,
  FilterChip,
  LocationFilter,
  CategoryFilter,
  SectionHeader,
} from '../components/components';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type HomeNavigationProp = NativeStackNavigationProp<RootStackParamList>;

// ============================================
// Story Data (Mock)
// ============================================
interface Story {
  id: string;
  theaterId: string;
  theaterName: string;
  theaterNameHe: string;
  avatarUrl: string;
  isNew: boolean;
  slides: StorySlide[];
}

interface StorySlide {
  id: string;
  imageUrl: string;
  title?: string;
  titleHe?: string;
  subtitle?: string;
  subtitleHe?: string;
  showId?: string;
  duration: number;
}

const STORIES: Story[] = [
  {
    id: 'story-1',
    theaterId: 'theater-1',
    theaterName: 'Habima',
    theaterNameHe: 'הבימה',
    avatarUrl:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZReAnESfqfJUwbR7u88KM4buO3HKZS9G3AA&s',
    isNew: true,
    slides: [
      {
        id: 'slide-1-1',
        imageUrl: 'https://picsum.photos/seed/habima1/1080/1920',
        title: 'New Season Opening!',
        titleHe: 'פתיחת עונה חדשה!',
        subtitle: 'Get 20% off on all shows this week',
        subtitleHe: '20% הנחה על כל ההצגות השבוע',
        showId: 'show-1',
        duration: 5000,
      },
      {
        id: 'slide-1-2',
        imageUrl: 'https://picsum.photos/seed/habima2/1080/1920',
        title: 'The Phantom Returns',
        titleHe: 'הפנטום חוזר',
        subtitle: 'Limited performances - Book now!',
        subtitleHe: 'הופעות מוגבלות - הזמינו עכשיו!',
        showId: 'show-4',
        duration: 5000,
      },
    ],
  },
  {
    id: 'story-2',
    theaterId: 'theater-2',
    theaterName: 'Cameri',
    theaterNameHe: 'קאמרי',
    avatarUrl:
      'https://instagram.ftlv6-1.fna.fbcdn.net/v/t51.2885-19/504825389_18512042338048398_8220540474925462190_n.jpg?efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLmRqYW5nby44OTguYzIifQ&_nc_ht=instagram.ftlv6-1.fna.fbcdn.net&_nc_cat=106&_nc_oc=Q6cZ2QFd7qBTJ2forCSRf5sCMD5anhJV3LN1WLkGpcYPUX5WV648h7RBpnKpuJY7DjQ1An67AhrFTToJVyaZ6P1y00gg&_nc_ohc=YlnsDRi0NjUQ7kNvwENdWxI&_nc_gid=8H0UynCQ-9EQjmCC0s-jGw&edm=ALGbJPMBAAAA&ccb=7-5&oh=00_AfsGq8m1gqPTwP-m7cVlTNxt-KkdZM2x06UdlkrWkTb4Kw&oe=69A22B7D&_nc_sid=7d3ac5',
    isNew: true,
    slides: [
      {
        id: 'slide-2-1',
        imageUrl: 'https://picsum.photos/seed/cameri1/1080/1920',
        title: 'Comedy Night Special',
        titleHe: 'ערב קומדיה מיוחד',
        subtitle: 'Laugh until you cry!',
        subtitleHe: 'לצחוק עד דמעות!',
        showId: 'show-1',
        duration: 5000,
      },
    ],
  },
  {
    id: 'story-3',
    theaterId: 'theater-3',
    theaterName: 'Gesher',
    theaterNameHe: 'גשר',
    avatarUrl:
      'https://instagram.ftlv5-1.fna.fbcdn.net/v/t51.2885-19/431240385_445052554525139_9079172447912972365_n.jpg?efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLmRqYW5nby4zMjAuYzIifQ&_nc_ht=instagram.ftlv5-1.fna.fbcdn.net&_nc_cat=111&_nc_oc=Q6cZ2QGOiix0sGmGn5sie9a92c3yXMPfcKNugfD0wgotfnt7n96C1MLLMa196T3xs3tTjH2rlM_IqJyI_XRcg_nrrZ2n&_nc_ohc=MmnJNRoJVsoQ7kNvwFeSoTP&_nc_gid=41X3OUT9geCQ-3yDhzLF5w&edm=ALGbJPMBAAAA&ccb=7-5&oh=00_AfshR0DEVmZc_hMBjaJ8xNHvQp2-_hswaGo9tmpPku79Xw&oe=69A2198E&_nc_sid=7d3ac5',
    isNew: false,
    slides: [
      {
        id: 'slide-3-1',
        imageUrl: 'https://picsum.photos/seed/gesher1/1080/1920',
        title: 'Drama Festival 2025',
        titleHe: 'פסטיבל דרמה 2025',
        subtitle: '10 days of amazing performances',
        subtitleHe: '10 ימים של הופעות מדהימות',
        duration: 5000,
      },
    ],
  },
  {
    id: 'story-4',
    theaterId: 'theater-4',
    theaterName: 'Beit Lessin',
    theaterNameHe: 'בית לסין',
    avatarUrl:
      'https://instagram.ftlv6-1.fna.fbcdn.net/v/t51.2885-19/414679194_1427841121419458_2142738653125387011_n.jpg?efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLmRqYW5nby42MDEuYzIifQ&_nc_ht=instagram.ftlv6-1.fna.fbcdn.net&_nc_cat=102&_nc_oc=Q6cZ2QEc81seHN2lKD0VU8h_lUJFKYEKZc9Eu5ZIbxfxJXXAmTnemU7MnYjNbEh2sm4mBT5LReYLc1yGwCG9sTM46q3F&_nc_ohc=TMHBlw5TD0wQ7kNvwHpT7KV&_nc_gid=SCamWSY4D2jDMAU6pAeJoQ&edm=AP4sbd4BAAAA&ccb=7-5&oh=00_AfsvqC1NioM_zCygH2peS52jBBXPuS0M09Ju98x9yoEglQ&oe=69A23113&_nc_sid=7a9f4b',
    isNew: true,
    slides: [
      {
        id: 'slide-4-1',
        imageUrl: 'https://picsum.photos/seed/lessin1/1080/1920',
        title: 'Family Weekend',
        titleHe: 'סופ"ש משפחתי',
        subtitle: 'Kids go free with adult ticket!',
        subtitleHe: 'ילדים חינם עם כרטיס מבוגר!',
        showId: 'show-5',
        duration: 5000,
      },
      {
        id: 'slide-4-2',
        imageUrl: 'https://picsum.photos/seed/lessin2/1080/1920',
        title: 'Behind the Scenes',
        titleHe: 'מאחורי הקלעים',
        subtitle: 'Exclusive backstage tour',
        subtitleHe: 'סיור בלעדי מאחורי הקלעים',
        duration: 5000,
      },
    ],
  },
  {
    id: 'story-5',
    theaterId: 'theater-5',
    theaterName: 'Khan',
    theaterNameHe: 'חאן',
    avatarUrl: 'https://picsum.photos/seed/khan/100/100',
    isNew: false,
    slides: [
      {
        id: 'slide-5-1',
        imageUrl: 'https://picsum.photos/seed/khan1/1080/1920',
        title: 'Jerusalem Nights',
        titleHe: 'לילות ירושלים',
        subtitle: 'Experience the magic',
        subtitleHe: 'חוו את הקסם',
        duration: 5000,
      },
    ],
  },
];

// Promotional Banner Data
interface PromoBanner {
  id: string;
  title: string;
  titleHe: string;
  subtitle: string;
  subtitleHe: string;
  imageUrl: string;
  showId?: string;
  gradient: [string, string];
  badge?: string;
  badgeHe?: string;
}

const PROMO_BANNERS: PromoBanner[] = [
  {
    id: 'promo-1',
    title: 'The Phantom of the Opera',
    titleHe: 'הפנטום של האופרה',
    subtitle: 'Final performances! Get 20% off this week only',
    subtitleHe: 'הופעות אחרונות! 20% הנחה השבוע בלבד',
    imageUrl: 'https://picsum.photos/seed/phantom/800/400',
    showId: 'show-4',
    gradient: ['rgba(168, 85, 247, 0.9)', 'rgba(236, 72, 153, 0.9)'],
    badge: '🔥 HOT',
    badgeHe: '🔥 חם',
  },
  {
    id: 'promo-2',
    title: 'Summer Festival 2025',
    titleHe: 'פסטיבל קיץ 2025',
    subtitle: 'Over 50 shows at special prices',
    subtitleHe: 'מעל 50 הצגות במחירים מיוחדים',
    imageUrl: 'https://picsum.photos/seed/festival/800/400',
    showId: 'show-1',
    gradient: ['rgba(245, 158, 11, 0.9)', 'rgba(239, 68, 68, 0.9)'],
    badge: '🎭 NEW',
    badgeHe: '🎭 חדש',
  },
  {
    id: 'promo-3',
    title: 'Family Weekend Special',
    titleHe: 'סופ"ש משפחתי מיוחד',
    subtitle: 'Kids go free with 2 adult tickets',
    subtitleHe: 'ילדים חינם עם 2 כרטיסים למבוגרים',
    imageUrl: 'https://picsum.photos/seed/family/800/400',
    showId: 'show-5',
    gradient: ['rgba(16, 185, 129, 0.9)', 'rgba(59, 130, 246, 0.9)'],
    badge: '👨‍👩‍👧‍👦 FAMILY',
    badgeHe: '👨‍👩‍👧‍👦 משפחה',
  },
];

// ============================================
// Story Viewer Component
// ============================================
interface StoryViewerProps {
  visible: boolean;
  stories: Story[];
  initialStoryIndex: number;
  onClose: () => void;
  onNavigateToShow: (showId: string) => void;
  isHebrew: boolean;
}

const StoryViewer: React.FC<StoryViewerProps> = ({
  visible,
  stories,
  initialStoryIndex,
  onClose,
  onNavigateToShow,
  isHebrew,
}) => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(initialStoryIndex);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  const currentStory = stories[currentStoryIndex];
  const currentSlide = currentStory?.slides[currentSlideIndex];

  useEffect(() => {
    if (visible) {
      setCurrentStoryIndex(initialStoryIndex);
      setCurrentSlideIndex(0);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.9);
    }
  }, [visible, initialStoryIndex]);

  useEffect(() => {
    if (!visible || !currentSlide) return;
    progressAnim.setValue(0);
    const animation = Animated.timing(progressAnim, {
      toValue: 1,
      duration: currentSlide.duration,
      useNativeDriver: false,
    });
    animation.start(({ finished }) => {
      if (finished) goToNextSlide();
    });
    return () => animation.stop();
  }, [visible, currentStoryIndex, currentSlideIndex]);

  const goToNextSlide = () => {
    if (currentSlideIndex < currentStory.slides.length - 1) {
      setCurrentSlideIndex((prev) => prev + 1);
    } else if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex((prev) => prev + 1);
      setCurrentSlideIndex(0);
    } else {
      handleClose();
    }
  };

  const goToPrevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prev) => prev - 1);
    } else if (currentStoryIndex > 0) {
      setCurrentStoryIndex((prev) => prev - 1);
      setCurrentSlideIndex(stories[currentStoryIndex - 1].slides.length - 1);
    }
  };

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => onClose());
  };

  const handlePress = (event: any) => {
    const { locationX } = event.nativeEvent;
    const isLeft = locationX < SCREEN_WIDTH / 3;
    const isRight = locationX > (SCREEN_WIDTH * 2) / 3;
    if (I18nManager.isRTL) {
      if (isLeft) goToNextSlide();
      else if (isRight) goToPrevSlide();
    } else {
      if (isLeft) goToPrevSlide();
      else if (isRight) goToNextSlide();
    }
  };

  const handleShowPress = () => {
    if (currentSlide?.showId) {
      handleClose();
      setTimeout(() => onNavigateToShow(currentSlide.showId!), 200);
    }
  };

  if (!visible || !currentStory || !currentSlide) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <Animated.View
        style={[
          styles.storyViewerContainer,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        <TouchableWithoutFeedback onPress={handlePress}>
          <View style={styles.storyViewerContent}>
            <Image
              source={{ uri: currentSlide.imageUrl }}
              style={styles.storyViewerImage}
              contentFit="cover"
              transition={300}
            />
            <LinearGradient
              colors={['rgba(0,0,0,0.6)', 'transparent', 'rgba(0,0,0,0.8)']}
              locations={[0, 0.3, 1]}
              style={styles.storyViewerGradient}
            />
            <View style={styles.storyProgressContainer}>
              {currentStory.slides.map((slide, index) => (
                <View key={slide.id} style={styles.storyProgressBar}>
                  <Animated.View
                    style={[
                      styles.storyProgressFill,
                      {
                        width:
                          index < currentSlideIndex
                            ? '100%'
                            : index === currentSlideIndex
                              ? progressAnim.interpolate({
                                  inputRange: [0, 1],
                                  outputRange: ['0%', '100%'],
                                })
                              : '0%',
                      },
                    ]}
                  />
                </View>
              ))}
            </View>
            <View style={styles.storyViewerHeader}>
              <View style={styles.storyViewerProfile}>
                <Image
                  source={{ uri: currentStory.avatarUrl }}
                  style={styles.storyViewerAvatar}
                  contentFit="cover"
                  transition={200}
                />
                <Text style={styles.storyViewerName}>
                  {isHebrew
                    ? currentStory.theaterNameHe
                    : currentStory.theaterName}
                </Text>
              </View>
              <TouchableOpacity
                onPress={handleClose}
                style={styles.storyCloseButton}
              >
                <Ionicons name="close" size={28} color="white" />
              </TouchableOpacity>
            </View>
            <View style={styles.storyViewerTextContent}>
              {currentSlide.title && (
                <Text style={styles.storyViewerTitle}>
                  {isHebrew ? currentSlide.titleHe : currentSlide.title}
                </Text>
              )}
              {currentSlide.subtitle && (
                <Text style={styles.storyViewerSubtitle}>
                  {isHebrew ? currentSlide.subtitleHe : currentSlide.subtitle}
                </Text>
              )}
              {currentSlide.showId && (
                <TouchableOpacity
                  style={styles.storyViewerButton}
                  onPress={handleShowPress}
                >
                  <Text style={styles.storyViewerButtonText}>
                    {isHebrew ? 'לפרטים נוספים' : 'View Show'}
                  </Text>
                  <Ionicons
                    name={I18nManager.isRTL ? 'chevron-back' : 'chevron-forward'}
                    size={18}
                    color="white"
                  />
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.storyNavIndicators}>
              {stories.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.storyNavDot,
                    index === currentStoryIndex && styles.storyNavDotActive,
                  ]}
                />
              ))}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Animated.View>
    </Modal>
  );
};

// ============================================
// Main HomeScreen Component
// ============================================
export default function HomeScreen() {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation<HomeNavigationProp>();
  const insets = useSafeAreaInsets();
  const isHebrew = i18n.language === 'he';

  const { shows, loading, error, isUsingFallback, refetch } = useShows();
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const [selectedLocation, setSelectedLocation] = useState<LocationArea | null>(
    null,
  );
  const [selectedCategories, setSelectedCategories] = useState<ShowCategory[]>(
    [],
  );
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [storyViewerVisible, setStoryViewerVisible] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);
  const [activePromoIndex, setActivePromoIndex] = useState(0);
  const promoScrollRef = useRef<FlatList>(null);
  const [showDateModal, setShowDateModal] = useState(false);
  const [dateFilter, setDateFilter] = useState<DateFilterValue | null>(null);

  // ─── Collapsible header animation ─────────────────────────────────
  const STICKY_BAR_CONTENT_HEIGHT = 10;
  const COLLAPSE_START = 30;
  const COLLAPSE_END = 120;
  const STORIES_FADE_START = 120;
  const STORIES_FADE_END = 200;

  const scrollY = useRef(new Animated.Value(0)).current;

  const heroOpacity = scrollY.interpolate({
    inputRange: [COLLAPSE_START, COLLAPSE_END],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  const stickyBgOpacity = scrollY.interpolate({
    inputRange: [COLLAPSE_START, COLLAPSE_END],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  const stickyContentOpacity = scrollY.interpolate({
    inputRange: [COLLAPSE_START, COLLAPSE_END],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  const storiesOpacity = scrollY.interpolate({
    inputRange: [STORIES_FADE_START, STORIES_FADE_END],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  const storiesTranslateY = scrollY.interpolate({
    inputRange: [STORIES_FADE_START, STORIES_FADE_END],
    outputRange: [0, -20],
    extrapolate: 'clamp',
  });
  // ──────────────────────────────────────────────────────────────────

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (activePromoIndex + 1) % PROMO_BANNERS.length;
      promoScrollRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
      setActivePromoIndex(nextIndex);
    }, 5000);
    return () => clearInterval(interval);
  }, [activePromoIndex]);

  const theaterLocationMap = useMemo(() => {
    const map = new Map<string, LocationArea>();
    theaters.forEach((theater) => map.set(theater.id, theater.location));
    return map;
  }, []);

  const filteredShows = useMemo(() => {
    return shows.filter((show) => {
      // Location filter
      if (selectedLocation) {
        const theaterLocation = theaterLocationMap.get(show.theaterId);
        if (theaterLocation !== selectedLocation) return false;
      }
      // Category filter
      if (selectedCategories.length > 0) {
        if (!show.categories.some((cat) => selectedCategories.includes(cat)))
          return false;
      }
      // Date filter
      if (dateFilter) {
        if (!show.availableDates || show.availableDates.length === 0)
          return false;

        if (dateFilter.type === 'today' || dateFilter.type === 'specific') {
          // Check if show has the specific date
          const hasDate = show.availableDates.some(
            (d) => d.date === dateFilter.date,
          );
          if (!hasDate) return false;
        } else if (
          dateFilter.type === 'range' &&
          dateFilter.startDate &&
          dateFilter.endDate
        ) {
          // Check if show has any date in range
          const hasDateInRange = show.availableDates.some((d) => {
            return (
              d.date >= dateFilter.startDate! && d.date <= dateFilter.endDate!
            );
          });
          if (!hasDateInRange) return false;
        }
      }
      return true;
    });
  }, [
    shows,
    selectedLocation,
    selectedCategories,
    dateFilter,
    theaterLocationMap,
  ]);

  const topShows = useMemo(
    () =>
      filteredShows
        .filter((s) => s.badges?.includes('popular_in_area'))
        .slice(0, 8),
    [filteredShows],
  );
  const lastMinuteDeals = useMemo(
    () =>
      filteredShows
        .filter((s) => s.originalPrice && s.startingPrice < s.originalPrice)
        .slice(0, 6),
    [filteredShows],
  );
  const trendingShows = useMemo(
    () =>
      filteredShows
        .filter((s) => s.badges?.includes('selling_fast') || s.rating >= 4.5)
        .slice(0, 8),
    [filteredShows],
  );

  const newShows = useMemo(() => {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    return filteredShows
      .filter(
        (s) => s.premiereDate && new Date(s.premiereDate) >= threeMonthsAgo,
      )
      .slice(0, 6);
  }, [filteredShows]);

  const comingSoonShows = useMemo(() => {
    const today = new Date();
    return filteredShows
      .filter(
        (s) =>
          s.availableDates?.length &&
          new Date(s.availableDates[0].date) > today,
      )
      .slice(0, 6);
  }, [filteredShows]);

  const thisWeekendShows = useMemo(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const friday = new Date(today);
    friday.setDate(today.getDate() + (dayOfWeek <= 5 ? 5 - dayOfWeek : 0));
    friday.setHours(0, 0, 0, 0);
    const sunday = new Date(today);
    sunday.setDate(today.getDate() + (dayOfWeek === 0 ? 0 : 7 - dayOfWeek));
    sunday.setHours(23, 59, 59, 999);
    return filteredShows
      .filter((s) =>
        s.availableDates?.some((d) => {
          const showDate = new Date(d.date);
          return showDate >= friday && showDate <= sunday;
        }),
      )
      .slice(0, 8);
  }, [filteredShows]);

  const recommendedShows = useMemo(
    () =>
      filteredShows
        .filter((s) => s.rating >= 4.3)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 8),
    [filteredShows],
  );

  const toggleCategory = (category: ShowCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  const getDateFilterLabel = () => {
    if (!dateFilter) return t('common.date');

    if (dateFilter.type === 'today') {
      return t('common.today');
    }
    if (dateFilter.type === 'specific' && dateFilter.date) {
      const date = new Date(dateFilter.date);
      return date.toLocaleDateString(isHebrew ? 'he-IL' : 'en-US', {
        day: 'numeric',
        month: 'short',
      });
    }
    if (
      dateFilter.type === 'range' &&
      dateFilter.startDate &&
      dateFilter.endDate
    ) {
      const start = new Date(dateFilter.startDate);
      const end = new Date(dateFilter.endDate);
      const startStr = start.toLocaleDateString(isHebrew ? 'he-IL' : 'en-US', {
        day: 'numeric',
        month: 'short',
      });
      const endStr = end.toLocaleDateString(isHebrew ? 'he-IL' : 'en-US', {
        day: 'numeric',
        month: 'short',
      });
      return `${startStr} - ${endStr}`;
    }
    return t('common.date');
  };

  const navigateToShow = (showId: string) =>
    navigation.navigate('ShowDetails', { showId });
  const renderShowCard = ({ item }: { item: Show }) => (
    <ShowCard show={item} onPress={() => navigateToShow(item.id)} />
  );
  const getLocationLabel = () =>
    selectedLocation
      ? t(`locations.${selectedLocation}`)
      : t('locations.allLocations');
  const openStoryViewer = (index: number) => {
    setSelectedStoryIndex(index);
    setStoryViewerVisible(true);
  };

  const renderStoryItem = ({ item, index }: { item: Story; index: number }) => (
    <TouchableOpacity
      style={styles.storyItem}
      onPress={() => openStoryViewer(index)}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={
          item.isNew
            ? [colors.primary.main, colors.secondary.main]
            : [colors.dark[500], colors.dark[600]]
        }
        style={styles.storyRing}
      >
        <View style={styles.storyAvatarContainer}>
          <Image
            source={{ uri: item.avatarUrl }}
            style={styles.storyAvatar}
            contentFit="cover"
            transition={200}
          />
        </View>
      </LinearGradient>
      <Text style={styles.storyName} numberOfLines={1}>
        {isHebrew ? item.theaterNameHe : item.theaterName}
      </Text>
      {item.isNew && <View style={styles.storyNewDot} />}
    </TouchableOpacity>
  );

  const renderPromoBanner = ({ item }: { item: PromoBanner }) => (
    <TouchableOpacity
      style={styles.promoBanner}
      activeOpacity={0.9}
      onPress={() => item.showId && navigateToShow(item.showId)}
    >
      <View style={styles.promoImage}>
        <Image
          source={{ uri: item.imageUrl }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={400}
        />
        <LinearGradient
          colors={item.gradient}
          style={styles.promoGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {item.badge && (
            <View style={styles.promoBadge}>
              <Text style={styles.promoBadgeText}>
                {isHebrew ? item.badgeHe : item.badge}
              </Text>
            </View>
          )}
          <View style={styles.promoContent}>
            <Text style={styles.promoTitle}>
              {isHebrew ? item.titleHe : item.title}
            </Text>
            <Text style={styles.promoSubtitle}>
              {isHebrew ? item.subtitleHe : item.subtitle}
            </Text>
            <View style={styles.promoButton}>
              <Text style={styles.promoButtonText}>{t('common.bookNow')}</Text>
              <Ionicons
                name={I18nManager.isRTL ? 'arrow-back' : 'arrow-forward'}
                size={16}
                color={colors.neutral.white}
              />
            </View>
          </View>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );

  const renderComingSoonCard = ({ item }: { item: Show }) => {
    const firstDate = item.availableDates?.[0]?.date;
    const formattedDate = firstDate
      ? new Date(firstDate).toLocaleDateString(isHebrew ? 'he-IL' : 'en-US', {
          month: 'short',
          day: 'numeric',
        })
      : '';
    return (
      <TouchableOpacity
        style={styles.comingSoonCard}
        onPress={() => navigateToShow(item.id)}
      >
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.comingSoonImage}
          contentFit="cover"
          transition={300}
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.9)']}
          style={styles.comingSoonGradient}
        >
          <View style={styles.comingSoonBadge}>
            <Ionicons name="calendar" size={12} color={colors.primary.main} />
            <Text style={styles.comingSoonDate}>{formattedDate}</Text>
          </View>
          <Text style={styles.comingSoonTitle} numberOfLines={2}>
            {isHebrew ? item.titleHe : item.title}
          </Text>
          <TouchableOpacity style={styles.notifyButton}>
            <Ionicons
              name="notifications-outline"
              size={14}
              color={colors.primary.main}
            />
            <Text style={styles.notifyButtonText}>{t('home.notifyMe')}</Text>
          </TouchableOpacity>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.dark[900]} />
      <View style={styles.auroraBackground}>
        <LinearGradient
          colors={[
            'rgba(168, 85, 247, 0.15)',
            'rgba(75, 27, 91, 0.05)',
            colors.dark[900],
            'transparent',
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.auroraGradient}
        />
      </View>

      {/* ── Sticky bar ── absolute overlay, always on top ── */}
      {(loading && shows.length === 0) ||
      (!loading && shows.length === 0 && error) ? (
        /* Static header shown during loading / error states */
        <View style={[styles.staticHeader, { paddingTop: insets.top }]}>
          <Image
            source={require('../../assets/wordmark.png')}
            style={styles.wordmark}
            contentFit="contain"
          />
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Ionicons
              name="notifications-outline"
              size={24}
              color={colors.neutral.white}
            />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>
      ) : (
        /* Animated sticky bar for normal scroll state */
        <Animated.View
          style={[styles.stickyBar, { paddingTop: insets.top }]}
          pointerEvents="box-none"
        >
          {/* Solid background fades in as header collapses */}
          <Animated.View
            style={[styles.stickyBarBg, { opacity: stickyBgOpacity }]}
          />
          {/* Compact content row fades in */}
          <Animated.View
            style={[styles.stickyBarContent, { opacity: stickyContentOpacity }]}
          >
            <Image
              source={require('../../assets/wordmark.png')}
              style={styles.compactWordmark}
              contentFit="contain"
            />
            <View style={styles.stickyFiltersRow}>
              <FilterChip
                label={getLocationLabel()}
                icon="location-outline"
                selected={selectedLocation !== null}
                onPress={() => setShowLocationModal(true)}
                showClear={selectedLocation !== null}
                onClear={() => setSelectedLocation(null)}
              />
              <FilterChip
                label={
                  selectedCategories.length > 0
                    ? `${t('common.category')} (${selectedCategories.length})`
                    : t('common.category')
                }
                icon="grid-outline"
                selected={selectedCategories.length > 0}
                onPress={() => setShowCategoryModal(true)}
                showClear={selectedCategories.length > 0}
                onClear={() => setSelectedCategories([])}
              />
              <FilterChip
                label={getDateFilterLabel()}
                icon="calendar-outline"
                selected={dateFilter !== null}
                onPress={() => setShowDateModal(true)}
                showClear={dateFilter !== null}
                onClear={() => setDateFilter(null)}
              />
            </View>
            <TouchableOpacity
              style={styles.notificationButton}
              onPress={() => navigation.navigate('Notifications')}
            >
              <Ionicons
                name="notifications-outline"
                size={20}
                color={colors.neutral.white}
              />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      )}

      {!loading && shows.length === 0 && error ? (
        <View style={{ paddingTop: insets.top + STICKY_BAR_CONTENT_HEIGHT }}>
          <ErrorState message={t('errors.network')} onRetry={refetch} />
        </View>
      ) : loading && shows.length === 0 ? (
        <View style={{ paddingTop: insets.top + STICKY_BAR_CONTENT_HEIGHT }}>
          <HomeScreenSkeleton />
        </View>
      ) : (
        <PullToRefreshScrollView
          onRefresh={refetch}
          style={styles.content}
          contentContainerStyle={[
            styles.contentContainer,
            { paddingTop: insets.top + STICKY_BAR_CONTENT_HEIGHT },
          ]}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false },
          )}
          scrollEventThrottle={16}
        >
          {/* Network banner — first child, inside scroll */}
          <NetworkBanner
            visible={isUsingFallback && !bannerDismissed}
            onRetry={refetch}
            onDismiss={() => setBannerDismissed(true)}
          />

          {/* Hero section — wordmark + subtitle + filters, scrolls away */}
          <Animated.View style={[styles.heroSection, { opacity: heroOpacity }]}>
            <View style={styles.heroHeader}>
              <View>
                <Image
                  source={require('../../assets/wordmark.png')}
                  style={styles.wordmark}
                  contentFit="contain"
                />
                <Text style={styles.subtitle}>{t('home.subtitle')}</Text>
              </View>
              <TouchableOpacity
                style={styles.notificationButton}
                onPress={() => navigation.navigate('Notifications')}
              >
                <Ionicons
                  name="notifications-outline"
                  size={24}
                  color={colors.neutral.white}
                />
                <View style={styles.notificationDot} />
              </TouchableOpacity>
            </View>
            <View style={styles.heroFiltersRow}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filtersContent}
              >
                <FilterChip
                  label={getLocationLabel()}
                  icon="location-outline"
                  selected={selectedLocation !== null}
                  onPress={() => setShowLocationModal(true)}
                  showClear={selectedLocation !== null}
                  onClear={() => setSelectedLocation(null)}
                />
                <FilterChip
                  label={
                    selectedCategories.length > 0
                      ? `${t('common.category')} (${selectedCategories.length})`
                      : t('common.category')
                  }
                  icon="grid-outline"
                  selected={selectedCategories.length > 0}
                  onPress={() => setShowCategoryModal(true)}
                  showClear={selectedCategories.length > 0}
                  onClear={() => setSelectedCategories([])}
                />
                <FilterChip
                  label={getDateFilterLabel()}
                  icon="calendar-outline"
                  selected={dateFilter !== null}
                  onPress={() => setShowDateModal(true)}
                  showClear={dateFilter !== null}
                  onClear={() => setDateFilter(null)}
                />
              </ScrollView>
            </View>
          </Animated.View>

          {/* Stories — fade + slide out as header collapses */}
          <Animated.View
            style={{
              opacity: storiesOpacity,
              transform: [{ translateY: storiesTranslateY }],
            }}
          >
            <View style={styles.storiesSection}>
              <FlatList
                data={STORIES}
                renderItem={renderStoryItem}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.storiesList}
              />
            </View>
          </Animated.View>

          {/* Promo Banners */}
          <View style={styles.promoSection}>
            <FlatList
              ref={promoScrollRef}
              data={PROMO_BANNERS}
              renderItem={renderPromoBanner}
              keyExtractor={(item) => item.id}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(e) =>
                setActivePromoIndex(
                  Math.round(
                    e.nativeEvent.contentOffset.x /
                      (SCREEN_WIDTH - spacing.lg * 2),
                  ),
                )
              }
              contentContainerStyle={styles.promoList}
              getItemLayout={(_, index) => ({
                length: SCREEN_WIDTH - spacing.lg * 2,
                offset: (SCREEN_WIDTH - spacing.lg * 2) * index,
                index,
              })}
            />
            <View style={styles.promoPagination}>
              {PROMO_BANNERS.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.promoDot,
                    index === activePromoIndex && styles.promoDotActive,
                  ]}
                />
              ))}
            </View>
          </View>

          {/* Top in Your Area */}
          <View style={styles.section}>
            <SectionHeader
              title={t('home.topInYourArea')}
              onSeeAll={() =>
                navigation.navigate('ShowList', {
                  title: t('home.topInYourArea'),
                  section: 'top',
                })
              }
            />
            {topShows.length > 0 ? (
              <FlatList
                data={topShows}
                renderItem={renderShowCard}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalList}
              />
            ) : (
              <View style={styles.emptySection}>
                <Text style={styles.emptyText}>{t('common.noResults')}</Text>
              </View>
            )}
          </View>

          {/* This Weekend */}
          {thisWeekendShows.length > 0 && (
            <View style={styles.section}>
              <SectionHeader
                title={t('home.thisWeekend')}
                onSeeAll={() =>
                  navigation.navigate('ShowList', {
                    title: t('home.thisWeekend'),
                    section: 'weekend',
                  })
                }
              />
              <View style={styles.infoBanner}>
                <LinearGradient
                  colors={[
                    'rgba(59, 130, 246, 0.2)',
                    'rgba(59, 130, 246, 0.05)',
                  ]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.infoBannerGradient}
                />
                <Ionicons name="calendar" size={20} color="#3B82F6" />
                <Text style={styles.infoBannerText}>
                  {t('home.weekendInfo')}
                </Text>
              </View>
              <FlatList
                data={thisWeekendShows}
                renderItem={renderShowCard}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalList}
              />
            </View>
          )}

          {/* Last Minute Deals */}
          {lastMinuteDeals.length > 0 && (
            <View style={styles.section}>
              <SectionHeader
                title={t('home.lastMinuteDeals')}
                onSeeAll={() =>
                  navigation.navigate('ShowList', {
                    title: t('home.lastMinuteDeals'),
                    section: 'deals',
                  })
                }
              />
              <View
                style={[
                  styles.infoBanner,
                  { borderColor: 'rgba(245, 158, 11, 0.3)' },
                ]}
              >
                <LinearGradient
                  colors={[
                    'rgba(245, 158, 11, 0.2)',
                    'rgba(245, 158, 11, 0.05)',
                  ]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.infoBannerGradient}
                />
                <Ionicons
                  name="flash"
                  size={20}
                  color={colors.semantic.warning}
                />
                <Text style={styles.infoBannerText}>
                  {t('home.lastMinuteInfo')}
                </Text>
              </View>
              <FlatList
                data={lastMinuteDeals}
                renderItem={renderShowCard}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalList}
              />
            </View>
          )}

          {/* New Shows */}
          {newShows.length > 0 && (
            <View style={styles.section}>
              <SectionHeader
                title={t('home.newShows')}
                onSeeAll={() =>
                  navigation.navigate('ShowList', {
                    title: t('home.newShows'),
                    section: 'new',
                  })
                }
              />
              <View
                style={[
                  styles.infoBanner,
                  { borderColor: 'rgba(16, 185, 129, 0.3)' },
                ]}
              >
                <LinearGradient
                  colors={[
                    'rgba(16, 185, 129, 0.2)',
                    'rgba(16, 185, 129, 0.05)',
                  ]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.infoBannerGradient}
                />
                <Ionicons name="sparkles" size={20} color="#10B981" />
                <Text style={styles.infoBannerText}>
                  {t('home.newShowsInfo')}
                </Text>
              </View>
              <FlatList
                data={newShows}
                renderItem={renderShowCard}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalList}
              />
            </View>
          )}

          {/* Recommended For You */}
          <View style={styles.section}>
            <SectionHeader
              title={t('home.recommendedForYou')}
              onSeeAll={() =>
                navigation.navigate('ShowList', {
                  title: t('home.recommendedForYou'),
                  section: 'recommended',
                })
              }
            />
            <View
              style={[
                styles.infoBanner,
                { borderColor: 'rgba(168, 85, 247, 0.3)' },
              ]}
            >
              <LinearGradient
                colors={['rgba(168, 85, 247, 0.2)', 'rgba(168, 85, 247, 0.05)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.infoBannerGradient}
              />
              <Ionicons name="heart" size={20} color={colors.primary.main} />
              <Text style={styles.infoBannerText}>
                {t('home.recommendedInfo')}
              </Text>
            </View>
            {recommendedShows.length > 0 ? (
              <FlatList
                data={recommendedShows}
                renderItem={renderShowCard}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalList}
              />
            ) : (
              <View style={styles.emptySection}>
                <Text style={styles.emptyText}>{t('common.noResults')}</Text>
              </View>
            )}
          </View>

          {/* Coming Soon */}
          {comingSoonShows.length > 0 && (
            <View style={styles.section}>
              <SectionHeader
                title={t('home.comingSoon')}
                onSeeAll={() =>
                  navigation.navigate('ShowList', {
                    title: t('home.comingSoon'),
                    section: 'coming_soon',
                  })
                }
              />
              <FlatList
                data={comingSoonShows}
                renderItem={renderComingSoonCard}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalList}
              />
            </View>
          )}

          {/* Trending Now */}
          <View style={styles.section}>
            <SectionHeader
              title={t('home.trendingNow')}
              onSeeAll={() =>
                navigation.navigate('ShowList', {
                  title: t('home.trendingNow'),
                  section: 'trending',
                })
              }
            />
            {trendingShows.length > 0 ? (
              <FlatList
                data={trendingShows}
                renderItem={({ item }) => (
                  <ShowCard
                    show={item}
                    onPress={() => navigateToShow(item.id)}
                    size="small"
                  />
                )}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalList}
              />
            ) : (
              <View style={styles.emptySection}>
                <Text style={styles.emptyText}>{t('common.noResults')}</Text>
              </View>
            )}
          </View>

          {/* Browse by Category */}
          <View style={styles.section}>
            <SectionHeader
              title={t('home.browseByCategory')}
              onSeeAll={() =>
                navigation.navigate('MainTabs', { screen: 'Search' })
              }
            />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryQuickAccess}
            >
              {[
                {
                  id: 'musical',
                  emoji: '🎵',
                  gradient: ['#A855F7', '#7C3AED'],
                },
                { id: 'drama', emoji: '🎭', gradient: ['#EC4899', '#DB2777'] },
                { id: 'comedy', emoji: '😂', gradient: ['#F59E0B', '#D97706'] },
                { id: 'family', emoji: '👨‍👩‍👧‍👦', gradient: ['#10B981', '#059669'] },
                { id: 'dance', emoji: '💃', gradient: ['#EF4444', '#DC2626'] },
                { id: 'opera', emoji: '🎤', gradient: ['#3B82F6', '#2563EB'] },
              ].map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={styles.categoryQuickCard}
                  onPress={() => {
                    setSelectedCategories([cat.id as ShowCategory]);
                    navigation.navigate('MainTabs', { screen: 'Search' });
                  }}
                >
                  <LinearGradient
                    colors={cat.gradient as [string, string]}
                    style={styles.categoryGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
                  </LinearGradient>
                  <Text style={styles.categoryLabel}>
                    {t(`categories.${cat.id}`)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* MVP hidden temporarily – planned for future release */}
          {/* Special Features (Group Booking, Special Occasions) hidden for MVP */}

          <View style={{ height: 120 }} />
        </PullToRefreshScrollView>
      )}

      <LocationFilter
        visible={showLocationModal}
        selectedLocation={selectedLocation}
        onSelectLocation={(location) => {
          setSelectedLocation(location);
          setShowLocationModal(false);
        }}
        onClose={() => setShowLocationModal(false)}
      />

      <CategoryFilter
        visible={showCategoryModal}
        selectedCategories={selectedCategories}
        onSelectCategory={toggleCategory}
        onClose={() => setShowCategoryModal(false)}
        onClearAll={() => setSelectedCategories([])}
      />

      <DateFilter
        visible={showDateModal}
        onClose={() => setShowDateModal(false)}
        onApply={(filter) => setDateFilter(filter)}
        currentFilter={dateFilter}
      />

      <StoryViewer
        visible={storyViewerVisible}
        stories={STORIES}
        initialStoryIndex={selectedStoryIndex}
        onClose={() => setStoryViewerVisible(false)}
        onNavigateToShow={navigateToShow}
        isHebrew={isHebrew}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.dark[900] },
  auroraBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT * 0.4,
  },
  auroraGradient: { flex: 1 },
  // ─── Sticky bar ───────────────────────────────────────────────────
  stickyBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  stickyBarBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.dark[900],
    borderBottomWidth: 1,
    borderBottomColor: colors.dark[500],
  },
  stickyBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
    gap: spacing.sm,
  },
  compactWordmark: {
    width: 80,
    height: 36,
    flexShrink: 0,
  },
  stickyFiltersRow: {
    flex: 1,
    flexDirection: 'row',
    gap: spacing.xs,
    overflow: 'hidden',
    transform: [{ scale: 0.88 }],
  },
  // ─── Static header (loading / error states) ───────────────────────
  staticHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  // ─── Hero section (inside scroll, scrolls away) ───────────────────
  heroSection: {
    paddingBottom: spacing.md,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  heroFiltersRow: {
    marginBottom: spacing.md,
  },
  // ──────────────────────────────────────────────────────────────────
  wordmark: {
    width: 158,
    height: 70,
  },
  subtitle: {
    ...typography.bodyMedium,
    color: colors.neutral.textSecondary,
    // marginTop: spacing.xl,
    marginStart: spacing.xs,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.dark[700],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.dark[500],
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.semantic.error,
  },
  filtersContent: { paddingHorizontal: spacing.lg, gap: spacing.sm },
  content: { flex: 1 },
  contentContainer: { paddingBottom: spacing.xxl },
  storiesSection: { marginBottom: spacing.lg },
  storiesList: { paddingHorizontal: spacing.lg, gap: spacing.md },
  storyItem: { alignItems: 'center', width: 72 },
  storyRing: {
    width: 68,
    height: 68,
    borderRadius: 34,
    padding: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyAvatarContainer: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: colors.dark[900],
    padding: 2,
  },
  storyAvatar: { width: '100%', height: '100%', borderRadius: 29 },
  storyName: {
    ...typography.caption,
    color: colors.neutral.textSecondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  storyNewDot: {
    position: 'absolute',
    top: 0,
    right: 8,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary.main,
    borderWidth: 2,
    borderColor: colors.dark[900],
  },
  storyViewerContainer: { flex: 1, backgroundColor: 'black' },
  storyViewerContent: { flex: 1 },
  storyViewerImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  storyViewerGradient: { ...StyleSheet.absoluteFillObject },
  storyProgressContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingTop: 50,
    gap: 4,
  },
  storyProgressBar: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  storyProgressFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 2,
  },
  storyViewerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  storyViewerProfile: { flexDirection: 'row', alignItems: 'center' },
  storyViewerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: 'white',
  },
  storyViewerName: {
    ...typography.labelMedium,
    color: 'white',
    marginStart: spacing.sm,
  },
  storyCloseButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyViewerTextContent: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.lg,
  },
  storyViewerTitle: {
    ...typography.bodyMedium,
    color: 'white',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    marginBottom: spacing.xs,
  },
  storyViewerSubtitle: {
    ...typography.bodyMedium,
    color: 'rgba(255,255,255,0.9)',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
    marginBottom: spacing.md,
  },
  storyViewerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    gap: spacing.xs,
  },
  storyViewerButtonText: { ...typography.labelMedium, color: 'white' },
  storyNavIndicators: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  storyNavDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  storyNavDotActive: { backgroundColor: 'white', width: 20 },
  promoSection: { marginBottom: spacing.lg },
  promoList: { paddingHorizontal: spacing.lg },
  promoBanner: {
    width: SCREEN_WIDTH - spacing.lg * 2,
    height: 180,
    borderRadius: 20,
    overflow: 'hidden',
    marginEnd: spacing.md,
  },
  promoImage: { width: '100%', height: '100%' },
  promoGradient: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'space-between',
  },
  promoBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: 12,
  },
  promoBadgeText: {
    ...typography.labelSmall,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  promoContent: { gap: spacing.xs },
  promoTitle: {
    ...typography.bodyMedium,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  promoSubtitle: {
    ...typography.bodyMedium,
    color: 'rgba(255,255,255,0.9)',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  promoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 20,
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  promoButtonText: { ...typography.labelMedium, color: '#FFFFFF' },
  promoPagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.md,
    gap: spacing.xs,
  },
  promoDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.dark[500],
  },
  promoDotActive: { backgroundColor: colors.primary.main, width: 24 },
  section: { marginBottom: spacing.xl },
  horizontalList: { paddingHorizontal: spacing.lg },
  emptySection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xxl,
    alignItems: 'center',
  },
  emptyText: { ...typography.bodyMedium, color: colors.neutral.textTertiary },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    padding: spacing.md,
    borderRadius: 12,
    backgroundColor: colors.dark[700],
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    overflow: 'hidden',
  },
  infoBannerGradient: { ...StyleSheet.absoluteFillObject },
  infoBannerText: {
    ...typography.bodySmall,
    color: colors.neutral.text,
    marginStart: spacing.sm,
    flex: 1,
  },
  comingSoonCard: {
    width: 160,
    height: 220,
    borderRadius: 16,
    overflow: 'hidden',
    marginEnd: spacing.md,
    backgroundColor: colors.dark[700],
  },
  comingSoonImage: { width: '100%', height: '100%' },
  comingSoonGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.md,
    paddingTop: spacing.xxl,
  },
  comingSoonBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(168, 85, 247, 0.2)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: 8,
    marginBottom: spacing.xs,
    gap: spacing.xxs,
  },
  comingSoonDate: {
    ...typography.caption,
    color: colors.primary.main,
    fontWeight: '600',
  },
  comingSoonTitle: {
    ...typography.labelMedium,
    color: colors.neutral.text,
    marginBottom: spacing.xs,
  },
  notifyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
  },
  notifyButtonText: { ...typography.caption, color: colors.primary.main },
  categoryQuickAccess: { paddingHorizontal: spacing.lg, gap: spacing.lg },
  categoryQuickCard: { alignItems: 'center' },
  categoryGradient: {
    width: 70,
    height: 70,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  categoryEmoji: { fontSize: 32 },
  categoryLabel: {
    ...typography.labelSmall,
    color: colors.neutral.textSecondary,
  },
  featuresGrid: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  featureCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.dark[500],
  },
  featureGradient: { padding: spacing.lg, alignItems: 'center' },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.dark[700],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  featureTitle: {
    ...typography.labelMedium,
    color: colors.neutral.text,
    marginBottom: spacing.xxs,
    textAlign: 'center',
  },
  featureDesc: {
    ...typography.caption,
    color: colors.neutral.textTertiary,
    textAlign: 'center',
  },
});
