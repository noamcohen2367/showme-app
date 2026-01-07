// ============================================
// ShowME App - Review & Rating Screen
// ============================================

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
  TextInput,
  Animated,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import { colors, typography, spacing } from '../theme/theme';

interface ShowToReview {
  id: string;
  title: string;
  imageUrl: string;
  date: string;
  venue: string;
}

const MOCK_SHOW: ShowToReview = {
  id: 'show-1',
  title: 'The Phantom of the Opera',
  imageUrl: 'https://picsum.photos/seed/phantom/400/200',
  date: 'January 15, 2025',
  venue: 'Habima Theatre',
};

const RATING_LABELS = ['Terrible', 'Poor', 'Average', 'Good', 'Excellent'];
const RATING_EMOJIS = ['😞', '😕', '😐', '🙂', '🤩'];

const ASPECTS = [
  { id: 'acting', label: 'Acting', icon: 'people' },
  { id: 'story', label: 'Story', icon: 'book' },
  { id: 'music', label: 'Music/Sound', icon: 'musical-notes' },
  { id: 'visuals', label: 'Visuals', icon: 'eye' },
  { id: 'venue', label: 'Venue', icon: 'business' },
];

const QUICK_TAGS = [
  'Amazing performances',
  'Great music',
  'Beautiful set design',
  'Emotional',
  'Funny',
  'Family friendly',
  'Long but worth it',
  'Great seats',
  'Excellent sound',
  'Would see again',
];

export default function ReviewScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [overallRating, setOverallRating] = useState(0);
  const [aspectRatings, setAspectRatings] = useState<Record<string, number>>({});
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [reviewText, setReviewText] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const scaleAnims = useRef([...Array(5)].map(() => new Animated.Value(1))).current;
  const successAnim = useRef(new Animated.Value(0)).current;

  const handleStarPress = (rating: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setOverallRating(rating);

    // Animate the selected star
    Animated.sequence([
      Animated.timing(scaleAnims[rating - 1], { toValue: 1.3, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnims[rating - 1], { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const handleAspectRating = (aspectId: string, rating: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setAspectRatings({ ...aspectRatings, [aspectId]: rating });
  };

  const toggleTag = (tag: string) => {
    Haptics.selectionAsync();
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    if (overallRating === 0) {
      Alert.alert('Rating Required', 'Please select an overall rating');
      return;
    }

    setIsSubmitting(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);

      Animated.spring(successAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();
    }, 1500);
  };

  const renderStarRating = () => (
    <View style={styles.starContainer}>
      <View style={styles.stars}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => handleStarPress(star)}>
            <Animated.View style={{ transform: [{ scale: scaleAnims[star - 1] }] }}>
              <Ionicons
                name={star <= overallRating ? 'star' : 'star-outline'}
                size={44}
                color={star <= overallRating ? colors.accent.main : colors.dark[400]}
              />
            </Animated.View>
          </TouchableOpacity>
        ))}
      </View>
      {overallRating > 0 && (
        <View style={styles.ratingLabel}>
          <Text style={styles.ratingEmoji}>{RATING_EMOJIS[overallRating - 1]}</Text>
          <Text style={styles.ratingText}>{RATING_LABELS[overallRating - 1]}</Text>
        </View>
      )}
    </View>
  );

  const renderAspectRatings = () => (
    <View style={styles.aspectsContainer}>
      <Text style={styles.sectionTitle}>Rate specific aspects</Text>
      {ASPECTS.map((aspect) => (
        <View key={aspect.id} style={styles.aspectRow}>
          <View style={styles.aspectLabel}>
            <Ionicons name={aspect.icon as any} size={18} color={colors.neutral.textSecondary} />
            <Text style={styles.aspectText}>{aspect.label}</Text>
          </View>
          <View style={styles.aspectStars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => handleAspectRating(aspect.id, star)}
                hitSlop={{ top: 10, bottom: 10, left: 5, right: 5 }}
              >
                <Ionicons
                  name={star <= (aspectRatings[aspect.id] || 0) ? 'star' : 'star-outline'}
                  size={24}
                  color={star <= (aspectRatings[aspect.id] || 0) ? colors.accent.main : colors.dark[400]}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}
    </View>
  );

  const renderQuickTags = () => (
    <View style={styles.tagsContainer}>
      <Text style={styles.sectionTitle}>Quick highlights</Text>
      <View style={styles.tags}>
        {QUICK_TAGS.map((tag) => (
          <TouchableOpacity
            key={tag}
            style={[styles.tag, selectedTags.includes(tag) && styles.tagSelected]}
            onPress={() => toggleTag(tag)}
          >
            <Text style={[styles.tagText, selectedTags.includes(tag) && styles.tagTextSelected]}>
              {tag}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderSuccessScreen = () => (
    <Animated.View
      style={[
        styles.successContainer,
        {
          opacity: successAnim,
          transform: [{ scale: successAnim }],
        },
      ]}
    >
      <View style={styles.successIcon}>
        <LinearGradient
          colors={[colors.primary.main, colors.secondary.main]}
          style={styles.successIconGradient}
        >
          <Ionicons name="checkmark" size={48} color={colors.neutral.white} />
        </LinearGradient>
      </View>
      <Text style={styles.successTitle}>Thank You!</Text>
      <Text style={styles.successDesc}>
        Your review helps other theater lovers find great shows.
      </Text>

      <View style={styles.rewardCard}>
        <Ionicons name="gift" size={24} color={colors.accent.main} />
        <View style={styles.rewardContent}>
          <Text style={styles.rewardTitle}>+50 Points Earned!</Text>
          <Text style={styles.rewardDesc}>For sharing your experience</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.doneButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.doneButtonText}>Done</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  if (submitted) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={colors.neutral.background} />
        {renderSuccessScreen()}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.neutral.background} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color={colors.neutral.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Write a Review</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Show Info */}
        <View style={styles.showCard}>
          <Image source={{ uri: MOCK_SHOW.imageUrl }} style={styles.showImage} />
          <View style={styles.showInfo}>
            <Text style={styles.showTitle}>{MOCK_SHOW.title}</Text>
            <Text style={styles.showMeta}>{MOCK_SHOW.date} • {MOCK_SHOW.venue}</Text>
          </View>
        </View>

        {/* Overall Rating */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How was your experience?</Text>
          {renderStarRating()}
        </View>

        {/* Aspect Ratings */}
        {renderAspectRatings()}

        {/* Quick Tags */}
        {renderQuickTags()}

        {/* Written Review */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Share your thoughts</Text>
          <TextInput
            style={styles.reviewInput}
            placeholder="What did you love? What could be better? Help others know what to expect..."
            placeholderTextColor={colors.neutral.textTertiary}
            value={reviewText}
            onChangeText={setReviewText}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>{reviewText.length}/500</Text>
        </View>

        {/* Anonymous Toggle */}
        <TouchableOpacity
          style={styles.anonymousToggle}
          onPress={() => setIsAnonymous(!isAnonymous)}
        >
          <View style={[styles.checkbox, isAnonymous && styles.checkboxActive]}>
            {isAnonymous && <Ionicons name="checkmark" size={16} color={colors.neutral.white} />}
          </View>
          <View style={styles.anonymousText}>
            <Text style={styles.anonymousTitle}>Post anonymously</Text>
            <Text style={styles.anonymousDesc}>Your name won't be shown with this review</Text>
          </View>
        </TouchableOpacity>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Submit Button */}
      <View style={[styles.bottomCTA, { paddingBottom: insets.bottom + spacing.md }]}>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <LinearGradient
            colors={[colors.primary.main, colors.secondary.main]}
            style={styles.submitButtonGradient}
          >
            {isSubmitting ? (
              <Text style={styles.submitButtonText}>Submitting...</Text>
            ) : (
              <>
                <Ionicons name="send" size={20} color={colors.neutral.white} />
                <Text style={styles.submitButtonText}>Submit Review</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.neutral.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingBottom: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.dark[500] },
  backButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { ...typography.headingMedium, color: colors.neutral.text },
  content: { flex: 1 },
  contentContainer: { padding: spacing.lg },
  showCard: { flexDirection: 'row', backgroundColor: colors.dark[700], borderRadius: 12, padding: spacing.md, marginBottom: spacing.xl, borderWidth: 1, borderColor: colors.dark[500] },
  showImage: { width: 60, height: 80, borderRadius: 8 },
  showInfo: { flex: 1, marginLeft: spacing.md, justifyContent: 'center' },
  showTitle: { ...typography.labelLarge, color: colors.neutral.text, marginBottom: spacing.xxs },
  showMeta: { ...typography.bodySmall, color: colors.neutral.textSecondary },
  section: { marginBottom: spacing.xl },
  sectionTitle: { ...typography.labelMedium, color: colors.neutral.text, marginBottom: spacing.md },
  starContainer: { alignItems: 'center' },
  stars: { flexDirection: 'row', gap: spacing.md },
  ratingLabel: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.md, gap: spacing.sm },
  ratingEmoji: { fontSize: 24 },
  ratingText: { ...typography.labelLarge, color: colors.neutral.text },
  aspectsContainer: { marginBottom: spacing.xl },
  aspectRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.dark[600] },
  aspectLabel: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  aspectText: { ...typography.bodyMedium, color: colors.neutral.textSecondary },
  aspectStars: { flexDirection: 'row', gap: spacing.xs },
  tagsContainer: { marginBottom: spacing.xl },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  tag: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: 20, backgroundColor: colors.dark[700], borderWidth: 1, borderColor: colors.dark[500] },
  tagSelected: { backgroundColor: 'rgba(168, 85, 247, 0.2)', borderColor: colors.primary.main },
  tagText: { ...typography.labelSmall, color: colors.neutral.textSecondary },
  tagTextSelected: { color: colors.primary.main },
  reviewInput: { backgroundColor: colors.dark[700], borderRadius: 12, padding: spacing.md, ...typography.bodyMedium, color: colors.neutral.text, minHeight: 120, borderWidth: 1, borderColor: colors.dark[500] },
  charCount: { ...typography.caption, color: colors.neutral.textTertiary, textAlign: 'right', marginTop: spacing.xs },
  anonymousToggle: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.dark[700], borderRadius: 12, padding: spacing.md, borderWidth: 1, borderColor: colors.dark[500] },
  checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: colors.dark[400], alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  checkboxActive: { backgroundColor: colors.primary.main, borderColor: colors.primary.main },
  anonymousText: { flex: 1 },
  anonymousTitle: { ...typography.labelMedium, color: colors.neutral.text },
  anonymousDesc: { ...typography.caption, color: colors.neutral.textTertiary },
  bottomCTA: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: spacing.lg, paddingTop: spacing.md, backgroundColor: colors.dark[800], borderTopWidth: 1, borderTopColor: colors.dark[500] },
  submitButton: { borderRadius: 12, overflow: 'hidden' },
  submitButtonGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.lg, gap: spacing.sm },
  submitButtonText: { ...typography.labelLarge, color: colors.neutral.white },
  successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  successIcon: { marginBottom: spacing.xl },
  successIconGradient: { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center' },
  successTitle: { ...typography.displaySmall, color: colors.neutral.text, marginBottom: spacing.sm },
  successDesc: { ...typography.bodyMedium, color: colors.neutral.textSecondary, textAlign: 'center', marginBottom: spacing.xl },
  rewardCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.dark[700], borderRadius: 12, padding: spacing.lg, marginBottom: spacing.xl, borderWidth: 1, borderColor: colors.dark[500], gap: spacing.md },
  rewardContent: {},
  rewardTitle: { ...typography.labelLarge, color: colors.accent.main },
  rewardDesc: { ...typography.bodySmall, color: colors.neutral.textSecondary },
  doneButton: { backgroundColor: colors.primary.main, paddingHorizontal: spacing.xxl, paddingVertical: spacing.md, borderRadius: 10 },
  doneButtonText: { ...typography.labelMedium, color: colors.neutral.white },
});
