// ============================================
// ShowME App - Ticket Detail Screen (Dark Aurora Theme)
// ============================================

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Animated,
  Dimensions,
  Share,
} from 'react-native';
import { getAppWidth } from '../utils/dimensions';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, typography, spacing } from '../theme/theme';
import { RootStackParamList } from '../types/types';
import { userPerformances } from '../data/user';
import { getShowById } from '../data/shows';
import { getTheaterById } from '../data/theaters';

const SCREEN_WIDTH = getAppWidth();

type TicketDetailNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'TicketDetail'
>;
type TicketDetailRouteProp = RouteProp<RootStackParamList, 'TicketDetail'>;

// Generate fake barcode bars
const generateBarcode = (): number[] => {
  const bars: number[] = [];
  for (let i = 0; i < 50; i++) {
    bars.push(Math.random() > 0.5 ? 3 : 1);
  }
  return bars;
};

export default function TicketDetailScreen() {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation<TicketDetailNavigationProp>();
  const route = useRoute<TicketDetailRouteProp>();
  const insets = useSafeAreaInsets();
  const isHebrew = i18n.language === 'he';

  const { performanceId } = route.params;
  const performance = userPerformances.find((p) => p.id === performanceId);
  const show = performance ? getShowById(performance.showId) : null;
  const theater = show ? getTheaterById(show.theaterId) : null;

  const [isFlipped, setIsFlipped] = useState(false);
  const flipAnimation = useRef(new Animated.Value(0)).current;
  const barcodeBars = useRef(generateBarcode()).current;

  if (!performance || !show || !theater) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{t('common.error')}</Text>
      </View>
    );
  }

  const showTitle = isHebrew ? show.titleHe : show.title;
  const theaterName = isHebrew ? theater.nameHe : theater.name;

  const handleFlip = () => {
    Animated.spring(flipAnimation, {
      toValue: isFlipped ? 0 : 1,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
    setIsFlipped(!isFlipped);
  };

  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  const handleShare = async () => {
    try {
      await Share.share({
        message: `🎭 ${showTitle}\n📍 ${theaterName}\n📅 ${performance.date} at ${performance.time}\n\nJoin me at the show!`,
      });
    } catch (error) {
      console.log('Share error:', error);
    }
  };

  const formattedDate = new Date(performance.date).toLocaleDateString(
    isHebrew ? 'he-IL' : 'en-US',
    {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }
  );

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.neutral.background}
      />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.neutral.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('ticket.title')}</Text>
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Ionicons
            name="share-outline"
            size={24}
            color={colors.neutral.text}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Flip Instructions */}
        <View style={styles.flipInstructions}>
          <Ionicons
            name="sync-outline"
            size={16}
            color={colors.neutral.textSecondary}
          />
          <Text style={styles.flipText}>{t('ticket.tapToFlip')}</Text>
        </View>

        {/* Ticket Card */}
        <TouchableOpacity onPress={handleFlip} activeOpacity={1}>
          <View style={styles.ticketContainer}>
            {/* Front of Ticket */}
            <Animated.View
              style={[
                styles.ticketCard,
                styles.ticketFront,
                { transform: [{ rotateY: frontInterpolate }] },
              ]}
            >
              <LinearGradient
                colors={[colors.dark[600], colors.dark[700]]}
                style={styles.ticketGradient}
              >
                {/* Show Info */}
                <View style={styles.ticketHeader}>
                  <View style={styles.showMeLogo}>
                    <Text style={styles.logoText}>Showmi</Text>
                  </View>
                  <View style={styles.ticketType}>
                    <Text style={styles.ticketTypeText}>
                      {t('ticket.eTicket')}
                    </Text>
                  </View>
                </View>

                <View style={styles.ticketBody}>
                  <Text style={styles.showTitle}>{showTitle}</Text>
                  <Text style={styles.theaterName}>{theaterName}</Text>

                  <View style={styles.ticketDivider}>
                    <View style={styles.dividerDot} />
                    <View style={styles.dividerLine} />
                    <View style={styles.dividerDot} />
                  </View>

                  <View style={styles.detailsGrid}>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>{t('ticket.date')}</Text>
                      <Text style={styles.detailValue}>{formattedDate}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>{t('ticket.time')}</Text>
                      <Text style={styles.detailValue}>{performance.time}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>
                        {t('ticket.seats')}
                      </Text>
                      <Text style={styles.detailValue}>
                        {performance.seats.join(', ')}
                      </Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>
                        {t('ticket.ticketCount')}
                      </Text>
                      <Text style={styles.detailValue}>
                        {performance.seats.length}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Barcode Area */}
                <View style={styles.barcodeSection}>
                  <View style={styles.barcodeContainer}>
                    {barcodeBars.map((width, index) => (
                      <View
                        key={index}
                        style={[
                          styles.barcodeBar,
                          {
                            width,
                            backgroundColor:
                              index % 3 === 0
                                ? colors.neutral.white
                                : colors.dark[800],
                          },
                        ]}
                      />
                    ))}
                  </View>
                  <Text style={styles.barcodeNumber}>
                    {performance.ticketCode}
                  </Text>
                </View>
              </LinearGradient>
            </Animated.View>

            {/* Back of Ticket */}
            <Animated.View
              style={[
                styles.ticketCard,
                styles.ticketBack,
                { transform: [{ rotateY: backInterpolate }] },
              ]}
            >
              <LinearGradient
                colors={[colors.dark[600], colors.dark[700]]}
                style={styles.ticketGradient}
              >
                <View style={styles.backContent}>
                  <Text style={styles.backTitle}>
                    {t('ticket.importantInfo')}
                  </Text>

                  <View style={styles.infoItem}>
                    <Ionicons
                      name="time-outline"
                      size={20}
                      color={colors.primary.main}
                    />
                    <Text style={styles.infoText}>
                      {t('ticket.arriveEarly')}
                    </Text>
                  </View>

                  <View style={styles.infoItem}>
                    <Ionicons
                      name="phone-portrait-outline"
                      size={20}
                      color={colors.primary.main}
                    />
                    <Text style={styles.infoText}>
                      {t('ticket.showTicket')}
                    </Text>
                  </View>

                  <View style={styles.infoItem}>
                    <Ionicons
                      name="volume-mute-outline"
                      size={20}
                      color={colors.primary.main}
                    />
                    <Text style={styles.infoText}>
                      {t('ticket.silencePhone')}
                    </Text>
                  </View>

                  <View style={styles.infoItem}>
                    <Ionicons
                      name="camera-outline"
                      size={20}
                      color={colors.primary.main}
                    />
                    <Text style={styles.infoText}>
                      {t('ticket.noRecording')}
                    </Text>
                  </View>

                  <View style={styles.qrPlaceholder}>
                    <View style={styles.qrCode}>
                      {/* Simplified QR code pattern */}
                      {[...Array(7)].map((_, row) => (
                        <View key={row} style={styles.qrRow}>
                          {[...Array(7)].map((_, col) => (
                            <View
                              key={col}
                              style={[
                                styles.qrCell,
                                (row + col) % 2 === 0 && styles.qrCellFilled,
                              ]}
                            />
                          ))}
                        </View>
                      ))}
                    </View>
                    <Text style={styles.qrText}>{t('ticket.scanQR')}</Text>
                  </View>
                </View>
              </LinearGradient>
            </Animated.View>
          </View>
        </TouchableOpacity>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton}>
            <LinearGradient
              colors={['rgba(168, 85, 247, 0.2)', 'rgba(168, 85, 247, 0.1)']}
              style={styles.actionButtonGradient}
            >
              <Ionicons
                name="download-outline"
                size={22}
                color={colors.primary.main}
              />
            </LinearGradient>
            <Text style={styles.actionButtonText}>{t('ticket.download')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <LinearGradient
              colors={['rgba(236, 72, 153, 0.2)', 'rgba(236, 72, 153, 0.1)']}
              style={styles.actionButtonGradient}
            >
              <Ionicons
                name="calendar-outline"
                size={22}
                color={colors.secondary.main}
              />
            </LinearGradient>
            <Text style={styles.actionButtonText}>
              {t('ticket.addCalendar')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <LinearGradient
              colors={['rgba(6, 182, 212, 0.2)', 'rgba(6, 182, 212, 0.1)']}
              style={styles.actionButtonGradient}
            >
              <Ionicons
                name="navigate-outline"
                size={22}
                color={colors.accent.main}
              />
            </LinearGradient>
            <Text style={styles.actionButtonText}>
              {t('ticket.directions')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Venue Info */}
        <View style={styles.venueSection}>
          <Text style={styles.sectionTitle}>{t('ticket.venueInfo')}</Text>
          <View style={styles.venueCard}>
            <View style={styles.venueRow}>
              <Ionicons name="location" size={18} color={colors.primary.main} />
              <Text style={styles.venueText}>
                {isHebrew ? theater.addressHe : theater.address}
              </Text>
            </View>
            <View style={styles.venueRow}>
              <Ionicons name="car" size={18} color={colors.primary.main} />
              <Text style={styles.venueText}>
                {t('ticket.parkingAvailable')}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  errorText: {
    ...typography.bodyLarge,
    color: colors.neutral.text,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark[500],
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...typography.headingMedium,
    color: colors.neutral.text,
  },
  shareButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  flipInstructions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  flipText: {
    ...typography.bodySmall,
    color: colors.neutral.textSecondary,
    marginStart: spacing.xs,
  },
  ticketContainer: {
    height: 480,
  },
  ticketCard: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    borderRadius: 20,
    overflow: 'hidden',
  },
  ticketFront: {},
  ticketBack: {},
  ticketGradient: {
    flex: 1,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.dark[500],
    borderRadius: 20,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  showMeLogo: {
    backgroundColor: colors.primary.main,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 8,
  },
  logoText: {
    ...typography.labelMedium,
    color: colors.neutral.white,
    fontWeight: '700',
  },
  ticketType: {
    backgroundColor: 'rgba(168, 85, 247, 0.2)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 8,
  },
  ticketTypeText: {
    ...typography.labelSmall,
    color: colors.primary.main,
  },
  ticketBody: {
    flex: 1,
  },
  showTitle: {
    ...typography.headingLarge,
    color: colors.neutral.text,
    marginBottom: spacing.xs,
  },
  theaterName: {
    ...typography.bodyMedium,
    color: colors.neutral.textSecondary,
  },
  ticketDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  dividerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.dark[500],
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.dark[500],
    marginHorizontal: spacing.sm,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  detailItem: {
    width: '50%',
    marginBottom: spacing.md,
  },
  detailLabel: {
    ...typography.labelSmall,
    color: colors.neutral.textTertiary,
    marginBottom: spacing.xxs,
  },
  detailValue: {
    ...typography.bodyMedium,
    color: colors.neutral.text,
    fontWeight: '600',
  },
  barcodeSection: {
    alignItems: 'center',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.dark[500],
  },
  barcodeContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 50,
    marginBottom: spacing.sm,
  },
  barcodeBar: {
    height: '100%',
    marginHorizontal: 1,
  },
  barcodeNumber: {
    ...typography.labelMedium,
    color: colors.neutral.textSecondary,
    letterSpacing: 2,
    fontFamily: 'monospace',
  },
  backContent: {
    flex: 1,
  },
  backTitle: {
    ...typography.headingMedium,
    color: colors.neutral.text,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    backgroundColor: colors.dark[700],
    padding: spacing.md,
    borderRadius: 12,
  },
  infoText: {
    ...typography.bodyMedium,
    color: colors.neutral.text,
    marginStart: spacing.md,
    flex: 1,
  },
  qrPlaceholder: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  qrCode: {
    width: 100,
    height: 100,
    padding: spacing.xs,
    backgroundColor: colors.neutral.white,
    borderRadius: 8,
  },
  qrRow: {
    flexDirection: 'row',
    flex: 1,
  },
  qrCell: {
    flex: 1,
    backgroundColor: colors.neutral.white,
  },
  qrCellFilled: {
    backgroundColor: '#0A0514',
  },
  qrText: {
    ...typography.bodySmall,
    color: colors.neutral.textSecondary,
    marginTop: spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionButtonGradient: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  actionButtonText: {
    ...typography.labelSmall,
    color: colors.neutral.textSecondary,
  },
  venueSection: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.headingSmall,
    color: colors.neutral.text,
    marginBottom: spacing.md,
  },
  venueCard: {
    backgroundColor: colors.dark[700],
    borderRadius: 12,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.dark[500],
  },
  venueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  venueText: {
    ...typography.bodyMedium,
    color: colors.neutral.text,
    marginStart: spacing.md,
    flex: 1,
  },
});
