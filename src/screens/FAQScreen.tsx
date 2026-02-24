// ============================================
// ShowME App - FAQ Screen
// ============================================

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, typography, spacing } from '../theme/theme';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    id: '1',
    question: 'How do I book a show?',
    answer:
      'Browse shows on the Home or Search screen, tap on a show you like, choose a date and time, select your seats, and complete payment. Your ticket will be saved under My Tickets.',
  },
  {
    id: '2',
    question: 'Can I cancel or exchange my tickets?',
    answer:
      'Cancellations and exchanges depend on the theater\'s policy. As a general rule, tickets can be exchanged up to 24 hours before the show. Contact the theater directly or reach out to us via Instagram @showmiapp for assistance.',
  },
  {
    id: '3',
    question: 'What is a Subscription?',
    answer:
      'A subscription gives you a bundle of tickets you can use across shows at a specific theater. You can track your remaining tickets, add new subscriptions, and update usage manually in the Subscriptions tab.',
  },
  {
    id: '4',
    question: 'How do I add a subscription?',
    answer:
      'Go to the Subscriptions tab, tap the "+" button, fill in the subscription name, theater, and total tickets. Your subscription will be saved locally on your device.',
  },
  {
    id: '5',
    question: 'What languages does the app support?',
    answer:
      'The app supports English, Hebrew (עברית), and Russian (Русский). You can change the language from Profile → Language. Hebrew includes full RTL layout support.',
  },
  {
    id: '6',
    question: 'How do I change the app appearance (dark/light mode)?',
    answer:
      'Go to Profile → Settings → Appearance. You can toggle between light and dark theme. Your preference is saved automatically.',
  },
  {
    id: '7',
    question: 'I found a bug or have a suggestion. How do I contact support?',
    answer:
      'We\'d love to hear from you! Contact us on Instagram @showmiapp. Tap "Contact Us" in Profile → Support to open our Instagram directly.',
  },
  {
    id: '8',
    question: 'Is my data stored securely?',
    answer:
      'All personal data — subscriptions, preferences, and login state — is stored locally on your device only. We do not upload or share your data with third parties.',
  },
  {
    id: '9',
    question: 'What is the Live Chat / Show Assistant?',
    answer:
      'The Show Assistant helps you discover shows based on your mood or preferences. Type something like "family comedy" or "romantic drama" and it will suggest matching shows from our catalog.',
  },
  {
    id: '10',
    question: 'How do I reset my account?',
    answer:
      'To reset your local data, go to Profile → Settings → Delete Account. This will clear all locally stored data including subscriptions and preferences.',
  },
];

export default function FAQScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleItem = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.neutral.background} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.neutral.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>FAQ</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.subtitle}>Frequently Asked Questions</Text>

        {FAQ_ITEMS.map((item, index) => {
          const isExpanded = expandedId === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.faqItem, index > 0 && styles.faqItemBorder]}
              onPress={() => toggleItem(item.id)}
              activeOpacity={0.7}
            >
              <View style={styles.faqRow}>
                <Text style={styles.question}>{item.question}</Text>
                <Ionicons
                  name={isExpanded ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={isExpanded ? colors.primary.main : colors.neutral.textTertiary}
                />
              </View>
              {isExpanded && (
                <Text style={styles.answer}>{item.answer}</Text>
              )}
            </TouchableOpacity>
          );
        })}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.background,
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
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
  },
  subtitle: {
    ...typography.bodyMedium,
    color: colors.neutral.textSecondary,
    marginBottom: spacing.xl,
  },
  faqItem: {
    paddingVertical: spacing.lg,
  },
  faqItemBorder: {
    borderTopWidth: 1,
    borderTopColor: colors.dark[500],
  },
  faqRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  question: {
    ...typography.labelMedium,
    color: colors.neutral.text,
    flex: 1,
    lineHeight: 22,
  },
  answer: {
    ...typography.bodyMedium,
    color: colors.neutral.textSecondary,
    marginTop: spacing.md,
    lineHeight: 22,
  },
});
