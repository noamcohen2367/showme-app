// ============================================
// ShowME App - Visual Seat Selection Screen
// ============================================

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { getAppWidth } from '../utils/dimensions';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, {
  Rect,
  Circle,
  Text as SvgText,
  G,
  Defs,
  LinearGradient as SvgGradient,
  Stop,
} from 'react-native-svg';

import { colors, typography, spacing } from '../theme/theme';
import { RootStackParamList } from '../types/types';
import { useShow } from '../hooks/useShows';
import {
  ALL_LAYOUTS,
  SeatData,
  SectionData,
  HallLayoutData,
} from '../data/hallLayouts';

const SCREEN_WIDTH = getAppWidth();

type SeatSelectionNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'SeatSelection'
>;
type SeatSelectionRouteProp = RouteProp<RootStackParamList, 'SeatSelection'>;

interface SelectedSeat extends SeatData {
  sectionName: string;
}

export default function SeatSelectionScreen() {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation<SeatSelectionNavigationProp>();
  const route = useRoute<SeatSelectionRouteProp>();
  const insets = useSafeAreaInsets();

  const { showId, date, time } = route.params;
  const { show } = useShow(showId);

  // Get the hall layout from the show's hallLayoutId
  const layoutId = show?.hallLayoutId || 'traditional';
  const layout = ALL_LAYOUTS[layoutId] || ALL_LAYOUTS['traditional'];

  const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>([]);
  const [scale, setScale] = useState(1);

  const isHebrew = i18n.language === 'he';

  // Calculate scale to fit layout in screen
  const containerWidth = SCREEN_WIDTH - 32;
  const scaleX = containerWidth / layout.width;
  const scaledHeight = layout.height * scaleX;

  const toggleSeat = (seat: SeatData, section: SectionData) => {
    if (!seat.available) return;

    const seatWithSection: SelectedSeat = {
      ...seat,
      sectionName: isHebrew ? section.nameHe : section.name,
    };

    const isSelected = selectedSeats.some((s) => s.id === seat.id);

    if (isSelected) {
      setSelectedSeats((prev) => prev.filter((s) => s.id !== seat.id));
    } else {
      if (selectedSeats.length >= 10) return;
      setSelectedSeats((prev) => [...prev, seatWithSection]);
    }
  };

  const isSeatSelected = (seatId: string) =>
    selectedSeats.some((s) => s.id === seatId);

  const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

  const handleContinue = () => {
    if (selectedSeats.length > 0) {
      navigation.navigate('Checkout', {
        showId,
        date,
        time,
        seats: selectedSeats.map((s) => s.id),
        totalPrice,
      });
    }
  };

  const renderSeat = (seat: SeatData, section: SectionData) => {
    const selected = isSeatSelected(seat.id);
    const seatSize = 18 * scaleX;
    const x = seat.x * scaleX;
    const y = seat.y * scaleX;

    let fillColor = seat.available ? section.color : '#374151';
    if (selected) fillColor = '#10B981';
    if (!seat.available) fillColor = '#1F2937';

    return (
      <G key={seat.id}>
        <Rect
          x={x - seatSize / 2}
          y={y - seatSize / 2}
          width={seatSize}
          height={seatSize * 0.85}
          rx={3}
          fill={fillColor}
          opacity={seat.available ? 1 : 0.3}
          onPress={() => toggleSeat(seat, section)}
          stroke={selected ? '#fff' : 'transparent'}
          strokeWidth={selected ? 2 : 0}
        />
        {seat.type === 'wheelchair' && seat.available && !selected && (
          <SvgText
            x={x}
            y={y + 2}
            fontSize={seatSize * 0.5}
            fill="#fff"
            textAnchor="middle"
          >
            ♿
          </SvgText>
        )}
        {selected && (
          <SvgText
            x={x}
            y={y + 3}
            fontSize={seatSize * 0.6}
            fill="#fff"
            textAnchor="middle"
            fontWeight="bold"
          >
            ✓
          </SvgText>
        )}
      </G>
    );
  };

  const renderStage = () => {
    const { x, y, width, height } = layout.stagePosition;
    const scaledX = x * scaleX;
    const scaledY = y * scaleX;
    const scaledW = width * scaleX;
    const scaledH = height * scaleX;

    return (
      <G>
        <Defs>
          <SvgGradient id="stageGradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#A855F7" stopOpacity="0.4" />
            <Stop offset="1" stopColor="#A855F7" stopOpacity="0.1" />
          </SvgGradient>
        </Defs>
        <Rect
          x={scaledX}
          y={scaledY}
          width={scaledW}
          height={scaledH}
          rx={8}
          fill="url(#stageGradient)"
        />
        <SvgText
          x={scaledX + scaledW / 2}
          y={scaledY + scaledH / 2 + 5}
          fontSize={14}
          fill="#A855F7"
          textAnchor="middle"
          fontWeight="bold"
          letterSpacing={2}
        >
          {isHebrew ? 'בָּמָה' : 'STAGE'}
        </SvgText>
      </G>
    );
  };

  // Get unique sections for legend
  const uniqueSections = layout.sections.reduce((acc, section) => {
    if (!acc.find((s) => s.zone === section.zone)) {
      acc.push(section);
    }
    return acc;
  }, [] as SectionData[]);

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
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{t('booking.selectSeats')}</Text>
          <Text style={styles.hallName}>
            {isHebrew ? layout.nameHe : layout.name}
          </Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Progress */}
      <View style={styles.progressContainer}>
        {['date', 'time', 'seats', 'payment'].map((step, index) => (
          <React.Fragment key={step}>
            <View
              style={[
                styles.progressStep,
                index <= 2 && styles.progressStepActive,
                index < 2 && styles.progressStepCompleted,
              ]}
            >
              {index < 2 ? (
                <Ionicons
                  name="checkmark"
                  size={16}
                  color={colors.neutral.white}
                />
              ) : index === 2 ? (
                <LinearGradient
                  colors={[colors.primary.main, colors.secondary.main]}
                  style={styles.progressStepGradient}
                >
                  <Text style={styles.progressStepTextActive}>{index + 1}</Text>
                </LinearGradient>
              ) : (
                <Text style={styles.progressStepText}>{index + 1}</Text>
              )}
            </View>
            {index < 3 && (
              <View
                style={[
                  styles.progressLine,
                  index < 2 && styles.progressLineActive,
                ]}
              />
            )}
          </React.Fragment>
        ))}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Seat Map */}
        <View style={styles.seatMapWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.seatMapScroll}
            maximumZoomScale={2}
            minimumZoomScale={1}
          >
            <Svg
              width={containerWidth}
              height={scaledHeight}
              viewBox={`0 0 ${containerWidth} ${scaledHeight}`}
            >
              {/* Stage */}
              {renderStage()}

              {/* All Sections */}
              {layout.sections.map((section) => (
                <G key={section.id}>
                  {section.seats.map((seat) => renderSeat(seat, section))}
                </G>
              ))}
            </Svg>
          </ScrollView>
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          <Text style={styles.legendTitle}>Seating Zones</Text>
          <View style={styles.legendGrid}>
            {uniqueSections.map((section) => (
              <View key={section.id} style={styles.legendItem}>
                <View
                  style={[styles.legendDot, { backgroundColor: section.color }]}
                />
                <Text style={styles.legendText}>
                  {isHebrew ? section.nameHe : section.name}
                </Text>
                <Text style={styles.legendPrice}>
                  ₪{section.seats[0]?.price || 0}
                </Text>
              </View>
            ))}
          </View>

          <Text style={[styles.legendTitle, { marginTop: spacing.md }]}>
            Status
          </Text>
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendDot,
                  { backgroundColor: '#1F2937', opacity: 0.5 },
                ]}
              />
              <Text style={styles.legendText}>Unavailable</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: '#10B981' }]}
              />
              <Text style={styles.legendText}>Selected</Text>
            </View>
          </View>
        </View>

        {/* Selected Seats */}
        {selectedSeats.length > 0 && (
          <View style={styles.selectedInfo}>
            <Text style={styles.selectedTitle}>Selected Seats</Text>
            <View style={styles.selectedSeatsGrid}>
              {selectedSeats.map((seat) => (
                <View key={seat.id} style={styles.selectedSeatTag}>
                  <View style={styles.selectedSeatInfo}>
                    <Text style={styles.selectedSeatText}>
                      {seat.row}-{seat.number}
                    </Text>
                    <Text style={styles.selectedSeatSection}>
                      {seat.sectionName}
                    </Text>
                  </View>
                  <Text style={styles.selectedSeatPrice}>₪{seat.price}</Text>
                  <TouchableOpacity
                    onPress={() =>
                      setSelectedSeats((prev) =>
                        prev.filter((s) => s.id !== seat.id)
                      )
                    }
                  >
                    <Ionicons
                      name="close-circle"
                      size={18}
                      color={colors.semantic.error}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Hall Info */}
        <View style={styles.hallInfoCard}>
          <Ionicons name="business" size={18} color={colors.primary.main} />
          <View style={styles.hallInfoContent}>
            <Text style={styles.hallInfoName}>
              {isHebrew ? layout.nameHe : layout.name}
            </Text>
            <Text style={styles.hallInfoCapacity}>
              {layout.totalSeats} seats • {layout.stageType.replace('_', ' ')}{' '}
              stage
            </Text>
          </View>
        </View>

        <View style={{ height: 140 }} />
      </ScrollView>

      {/* Bottom Bar */}
      <View
        style={[
          styles.bottomContainer,
          { paddingBottom: insets.bottom + spacing.md },
        ]}
      >
        <View style={styles.bottomInfo}>
          <View>
            <Text style={styles.seatCount}>
              {selectedSeats.length}{' '}
              {selectedSeats.length === 1 ? 'seat' : 'seats'} selected
            </Text>
            {selectedSeats.length > 0 && (
              <Text style={styles.seatSummary}>
                {selectedSeats.map((s) => `${s.row}-${s.number}`).join(', ')}
              </Text>
            )}
          </View>
          <Text style={styles.totalPrice}>₪{totalPrice.toLocaleString()}</Text>
        </View>
        <TouchableOpacity
          style={[
            styles.continueButton,
            selectedSeats.length === 0 && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={selectedSeats.length === 0}
        >
          <LinearGradient
            colors={
              selectedSeats.length > 0
                ? [colors.primary.main, colors.secondary.main]
                : [colors.dark[600], colors.dark[600]]
            }
            style={styles.continueButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text
              style={[
                styles.continueButtonText,
                selectedSeats.length === 0 && styles.continueButtonTextDisabled,
              ]}
            >
              {t('common.continue')}
            </Text>
            <Ionicons
              name="arrow-forward"
              size={20}
              color={
                selectedSeats.length > 0
                  ? colors.neutral.white
                  : colors.neutral.textTertiary
              }
            />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
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
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { ...typography.headingMedium, color: colors.neutral.text },
  hallName: { ...typography.caption, color: colors.primary.main, marginTop: 2 },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  progressStep: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.dark[700],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.dark[500],
  },
  progressStepActive: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    overflow: 'hidden',
  },
  progressStepCompleted: { backgroundColor: colors.primary.main },
  progressStepGradient: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressStepText: {
    ...typography.labelSmall,
    color: colors.neutral.textTertiary,
  },
  progressStepTextActive: {
    ...typography.labelSmall,
    color: colors.neutral.white,
  },
  progressLine: {
    width: 32,
    height: 2,
    backgroundColor: colors.dark[500],
    marginHorizontal: spacing.xs,
  },
  progressLineActive: { backgroundColor: colors.primary.main },
  content: { flex: 1 },
  seatMapWrapper: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    borderRadius: 12,
    backgroundColor: colors.dark[800],
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.dark[500],
  },
  seatMapScroll: { padding: spacing.md },
  legend: {
    marginTop: spacing.lg,
    marginHorizontal: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.dark[700],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.dark[500],
  },
  legendTitle: {
    ...typography.labelMedium,
    color: colors.neutral.text,
    marginBottom: spacing.sm,
  },
  legendGrid: { gap: spacing.xs },
  legendRow: { flexDirection: 'row', gap: spacing.lg },
  legendItem: { flexDirection: 'row', alignItems: 'center' },
  legendDot: {
    width: 14,
    height: 14,
    borderRadius: 3,
    marginEnd: spacing.sm,
  },
  legendText: {
    ...typography.bodySmall,
    color: colors.neutral.textSecondary,
    flex: 1,
  },
  legendPrice: { ...typography.labelSmall, color: colors.neutral.textTertiary },
  selectedInfo: {
    marginTop: spacing.lg,
    marginHorizontal: spacing.lg,
    padding: spacing.md,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  selectedTitle: {
    ...typography.labelMedium,
    color: '#10B981',
    marginBottom: spacing.sm,
  },
  selectedSeatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  selectedSeatTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark[700],
    padding: spacing.sm,
    borderRadius: 8,
    gap: spacing.sm,
  },
  selectedSeatInfo: { flex: 1, minWidth: 60 },
  selectedSeatText: { ...typography.labelSmall, color: colors.neutral.text },
  selectedSeatSection: {
    ...typography.caption,
    color: colors.neutral.textTertiary,
  },
  selectedSeatPrice: { ...typography.labelSmall, color: '#10B981' },
  hallInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
    marginHorizontal: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.dark[700],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.dark[500],
    gap: spacing.md,
  },
  hallInfoContent: { flex: 1 },
  hallInfoName: { ...typography.labelMedium, color: colors.neutral.text },
  hallInfoCapacity: {
    ...typography.caption,
    color: colors.neutral.textTertiary,
  },
  bottomContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.dark[500],
    backgroundColor: colors.dark[800],
  },
  bottomInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  seatCount: { ...typography.bodyMedium, color: colors.neutral.textSecondary },
  seatSummary: {
    ...typography.caption,
    color: colors.neutral.textTertiary,
    marginTop: 2,
  },
  totalPrice: { ...typography.headingMedium, color: colors.neutral.text },
  continueButton: { borderRadius: 12, overflow: 'hidden' },
  continueButtonDisabled: { opacity: 0.5 },
  continueButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  continueButtonText: { ...typography.labelLarge, color: colors.neutral.white },
  continueButtonTextDisabled: { color: colors.neutral.textTertiary },
});
