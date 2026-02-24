// ============================================
// ShowME App - Show Recommendation Assistant (Live Chat)
// ============================================

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { Image } from 'expo-image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, typography, spacing } from '../theme/theme';
import { shows } from '../data/shows';
import { RootStackParamList, Show } from '../types/types';

type LiveChatNavProp = NativeStackNavigationProp<RootStackParamList>;

const STORAGE_KEY = 'showmi.mvp.liveChat';

// ============================================
// Chat message type
// ============================================
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  createdAt: string;
  recommendedShowIds?: string[];
}

// ============================================
// Keyword → category mapping for recommendations
// ============================================
const KEYWORD_MAP: { keywords: string[]; categories: string[] }[] = [
  { keywords: ['comedy', 'funny', 'laugh', 'humor', 'comic', 'humorous'], categories: ['comedy'] },
  { keywords: ['drama', 'dramatic', 'emotional', 'serious', 'intense'], categories: ['drama'] },
  { keywords: ['musical', 'music', 'sing', 'song', 'songs', 'singing', 'dance', 'dancing'], categories: ['musical', 'dance'] },
  { keywords: ['romance', 'romantic', 'love', 'date', 'anniversary', 'couple'], categories: ['romance'] },
  { keywords: ['family', 'kids', 'children', 'child', 'fun for all', 'all ages'], categories: ['family', 'children'] },
  { keywords: ['suspense', 'thriller', 'mystery', 'scary', 'tense', 'dark', 'crime'], categories: ['suspense'] },
  { keywords: ['opera', 'classical', 'symphony'], categories: ['opera'] },
  { keywords: ['new', 'latest', 'fresh', 'premiere', 'recently'], categories: ['new'] },
  { keywords: ['popular', 'trending', 'hit', 'best', 'top', 'famous', 'classic'], categories: ['popular', 'long_running'] },
  { keywords: ['short', 'quick', 'brief', 'under', 'hour'], categories: ['short'] },
  { keywords: ['long', 'epic', 'full night', 'evening'], categories: ['long_running'] },
];

function getRecommendations(query: string): Show[] {
  const lower = query.toLowerCase();

  // Collect matching categories
  const matchedCategories = new Set<string>();
  for (const mapping of KEYWORD_MAP) {
    if (mapping.keywords.some(k => lower.includes(k))) {
      mapping.categories.forEach(c => matchedCategories.add(c));
    }
  }

  let results: { show: Show; score: number }[] = [];

  if (matchedCategories.size > 0) {
    results = shows
      .filter(s => s.isActive)
      .map(s => {
        const catMatches = s.categories.filter(c => matchedCategories.has(c)).length;
        const titleMatch = s.title.toLowerCase().includes(lower) ? 3 : 0;
        const score = catMatches * 2 + titleMatch + s.rating;
        return { show: s, score };
      })
      .filter(r => r.score > 0);
  }

  if (results.length === 0) {
    // Fallback: return top-rated active shows
    results = shows
      .filter(s => s.isActive)
      .map(s => ({ show: s, score: s.rating }));
  }

  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(r => r.show);
}

function buildAssistantText(recs: Show[]): string {
  if (recs.length === 0) {
    return "I couldn't find a perfect match right now, but check back soon — we add new shows regularly! 🎭";
  }
  const intro =
    recs.length === 1
      ? "Here's something I think you'll love:"
      : `Here are ${recs.length} shows that match what you're looking for:`;
  return `${intro}\n\n${recs.map((s, i) => `${i + 1}. ${s.title} — ${s.categories.slice(0, 2).join(', ')} • ₪${s.startingPrice}+`).join('\n')}`;
}

const QUICK_PROMPTS = [
  { label: '😂 Comedy', query: 'funny comedy' },
  { label: '❤️ Date Night', query: 'romantic love date' },
  { label: '👨‍👩‍👧 Family', query: 'family kids' },
  { label: '🎵 Musical', query: 'musical singing' },
];

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  text: "Hi! 👋 I'm your Showmi assistant. Tell me what you're in the mood for and I'll suggest the perfect show.\n\nTry: \"funny comedy\", \"romantic date night\", or \"family show with kids\".",
  createdAt: new Date().toISOString(),
};

export default function LiveChatScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<LiveChatNavProp>();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);
  const typingAnim = useRef(new Animated.Value(0)).current;

  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Load persisted chat history
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const saved: ChatMessage[] = JSON.parse(raw);
          if (Array.isArray(saved) && saved.length > 0) {
            setMessages([WELCOME_MESSAGE, ...saved.filter(m => m.id !== 'welcome')]);
          }
        }
      } catch {
        // ignore parse errors
      }
    })();
  }, []);

  // Persist chat on change
  useEffect(() => {
    const toSave = messages.filter(m => m.id !== 'welcome');
    if (toSave.length > 0) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave)).catch(() => {});
    }
  }, [messages]);

  // Typing animation
  useEffect(() => {
    if (isTyping) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(typingAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
          Animated.timing(typingAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
        ])
      ).start();
    } else {
      typingAnim.setValue(0);
    }
  }, [isTyping]);

  const scrollToBottom = () => {
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: trimmed,
      createdAt: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    scrollToBottom();

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const recs = getRecommendations(trimmed);
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: buildAssistantText(recs),
        createdAt: new Date().toISOString(),
        recommendedShowIds: recs.map(s => s.id),
      };
      setMessages(prev => [...prev, assistantMsg]);
      scrollToBottom();
    }, 1200);
  };

  const handleSend = () => sendMessage(inputText);
  const handleQuickPrompt = (query: string) => sendMessage(query);

  const formatTime = (iso: string) => {
    try {
      return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  const renderMessage = (message: ChatMessage) => {
    const isUser = message.role === 'user';
    const recShows = message.recommendedShowIds
      ? shows.filter(s => message.recommendedShowIds!.includes(s.id))
      : [];

    return (
      <View
        key={message.id}
        style={[styles.messageContainer, isUser ? styles.userMessageContainer : styles.otherMessageContainer]}
      >
        {!isUser && (
          <View style={styles.botAvatar}>
            <Ionicons name="sparkles" size={16} color={colors.primary.main} />
          </View>
        )}
        <View style={{ maxWidth: '78%' }}>
          <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.otherBubble]}>
            <Text style={[styles.messageText, isUser && styles.userMessageText]}>
              {message.text}
            </Text>
            <Text style={[styles.messageTime, isUser && styles.userMessageTime]}>
              {formatTime(message.createdAt)}
            </Text>
          </View>
          {recShows.length > 0 && (
            <View style={styles.recsContainer}>
              {recShows.map(show => (
                <TouchableOpacity
                  key={show.id}
                  style={styles.recCard}
                  onPress={() => navigation.navigate('ShowDetails', { showId: show.id })}
                  activeOpacity={0.8}
                >
                  <Image
                    source={{ uri: show.imageUrl }}
                    style={styles.recImage}
                    contentFit="cover"
                    transition={200}
                    recyclingKey={show.id}
                  />
                  <View style={styles.recInfo}>
                    <Text style={styles.recTitle} numberOfLines={1}>{show.title}</Text>
                    <Text style={styles.recMeta} numberOfLines={1}>
                      {show.categories.slice(0, 2).join(' · ')} · ₪{show.startingPrice}+
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={colors.neutral.textTertiary} />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.neutral.background} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.neutral.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Show Assistant</Text>
          <View style={styles.statusContainer}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Powered by local shows</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.clearButton}
          onPress={() => {
            setMessages([WELCOME_MESSAGE]);
            AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
          }}
        >
          <Ionicons name="refresh-outline" size={20} color={colors.neutral.textTertiary} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Quick prompts – shown only at start */}
          {messages.length === 1 && (
            <View style={styles.quickPromptsContainer}>
              <Text style={styles.quickPromptsTitle}>Quick suggestions:</Text>
              <View style={styles.quickPrompts}>
                {QUICK_PROMPTS.map(p => (
                  <TouchableOpacity
                    key={p.label}
                    style={styles.quickPromptChip}
                    onPress={() => handleQuickPrompt(p.query)}
                  >
                    <Text style={styles.quickPromptText}>{p.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {messages.map(renderMessage)}

          {/* Typing indicator */}
          {isTyping && (
            <View style={[styles.messageContainer, styles.otherMessageContainer]}>
              <View style={styles.botAvatar}>
                <Ionicons name="sparkles" size={16} color={colors.primary.main} />
              </View>
              <View style={[styles.messageBubble, styles.otherBubble, styles.typingBubble]}>
                <Animated.View style={[styles.typingDot, { opacity: typingAnim }]} />
                <Animated.View style={[styles.typingDot, { opacity: typingAnim }]} />
                <Animated.View style={[styles.typingDot, { opacity: typingAnim }]} />
              </View>
            </View>
          )}

          <View style={{ height: 20 }} />
        </ScrollView>

        {/* Input */}
        <View style={[styles.inputContainer, { paddingBottom: insets.bottom + spacing.sm }]}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Describe what you're in the mood for..."
              placeholderTextColor={colors.neutral.textTertiary}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={300}
              onSubmitEditing={handleSend}
            />
            <TouchableOpacity
              style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
              onPress={handleSend}
              disabled={!inputText.trim()}
            >
              <LinearGradient
                colors={inputText.trim() ? [colors.primary.main, colors.secondary.main] : [colors.dark[500], colors.dark[500]]}
                style={styles.sendButtonGradient}
              >
                <Ionicons name="send" size={18} color={colors.neutral.white} />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.neutral.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark[500],
  },
  backButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { ...typography.labelLarge, color: colors.neutral.text },
  statusContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.semantic.success,
    marginEnd: spacing.xs,
  },
  statusText: { ...typography.caption, color: colors.neutral.textTertiary },
  clearButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  keyboardView: { flex: 1 },
  messagesContainer: { flex: 1 },
  messagesContent: { padding: spacing.lg },
  quickPromptsContainer: { marginBottom: spacing.xl },
  quickPromptsTitle: {
    ...typography.labelSmall,
    color: colors.neutral.textTertiary,
    marginBottom: spacing.sm,
  },
  quickPrompts: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  quickPromptChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.dark[700],
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.dark[500],
  },
  quickPromptText: { ...typography.labelSmall, color: colors.neutral.text },
  messageContainer: { flexDirection: 'row', marginBottom: spacing.md, alignItems: 'flex-start' },
  userMessageContainer: { justifyContent: 'flex-end' },
  otherMessageContainer: { justifyContent: 'flex-start', gap: spacing.sm },
  botAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(168, 85, 247, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  messageBubble: { borderRadius: 16, padding: spacing.md },
  userBubble: { backgroundColor: colors.primary.main, borderBottomRightRadius: 4 },
  otherBubble: { backgroundColor: colors.dark[700], borderBottomLeftRadius: 4 },
  messageText: { ...typography.bodyMedium, color: colors.neutral.text },
  userMessageText: { color: colors.neutral.white },
  messageTime: { ...typography.caption, color: colors.neutral.textTertiary, marginTop: spacing.xs, alignSelf: 'flex-end' },
  userMessageTime: { color: 'rgba(255,255,255,0.7)' },
  typingBubble: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, gap: spacing.xs },
  typingDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.neutral.textTertiary },
  recsContainer: { marginTop: spacing.sm, gap: spacing.sm },
  recCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark[800],
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.dark[500],
    paddingEnd: spacing.md,
  },
  recImage: { width: 56, height: 56 },
  recInfo: { flex: 1, paddingHorizontal: spacing.sm },
  recTitle: { ...typography.labelSmall, color: colors.neutral.text },
  recMeta: { ...typography.caption, color: colors.neutral.textTertiary, marginTop: 2 },
  inputContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.dark[500],
    backgroundColor: colors.dark[800],
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.dark[700],
    borderRadius: 24,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: colors.dark[500],
  },
  input: {
    flex: 1,
    ...typography.bodyMedium,
    color: colors.neutral.text,
    maxHeight: 100,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  sendButton: { padding: spacing.xs },
  sendButtonDisabled: { opacity: 0.5 },
  sendButtonGradient: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
});
