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
import { useShows } from '../hooks/useShows';
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
  isError?: boolean; // "didn't understand" response
}

// ============================================
// Keyword → category mapping (Hebrew + English)
// ============================================
const KEYWORD_MAP: { keywords: string[]; categories: string[] }[] = [
  {
    keywords: ['comedy', 'funny', 'laugh', 'humor', 'comic', 'humorous',
               'קומדיה', 'מצחיק', 'מצחיקה', 'צחוק', 'הומור', 'קומי', 'כיף', 'שמחה'],
    categories: ['comedy'],
  },
  {
    keywords: ['drama', 'dramatic', 'emotional', 'serious', 'intense',
               'דרמה', 'דרמטי', 'רגשי', 'רגשית', 'רציני', 'עמוק', 'עמוקה', 'מרגש', 'מרגשת'],
    categories: ['drama'],
  },
  {
    keywords: ['musical', 'music', 'sing', 'song', 'songs', 'singing', 'dance', 'dancing',
               'מחזמר', 'מוזיקה', 'שיר', 'שירה', 'ריקוד', 'מחול', 'לשיר', 'לרקוד'],
    categories: ['musical', 'dance'],
  },
  {
    keywords: ['romance', 'romantic', 'love', 'date', 'anniversary', 'couple',
               'רומנטי', 'רומנטית', 'רומנס', 'אהבה', 'זוגי', 'זוגית', 'פגישה', 'יחד', 'ערב זוגי', 'דייט'],
    categories: ['romance'],
  },
  {
    keywords: ['family', 'kids', 'children', 'child', 'fun for all', 'all ages',
               'משפחה', 'ילדים', 'ילד', 'ילדה', 'כל הגילאים', 'לכל המשפחה', 'פעוטות', 'נוער'],
    categories: ['family', 'children'],
  },
  {
    keywords: ['suspense', 'thriller', 'mystery', 'scary', 'tense', 'dark', 'crime',
               'מתח', 'מסתורין', 'פשע', 'אימה', 'מפחיד', 'מתוח', 'עלילה', 'חקירה'],
    categories: ['suspense'],
  },
  {
    keywords: ['opera', 'classical', 'symphony',
               'אופרה', 'קלאסי', 'קלאסית', 'סימפוניה', 'פילהרמוני'],
    categories: ['opera'],
  },
  {
    keywords: ['new', 'latest', 'fresh', 'premiere', 'recently',
               'חדש', 'חדשה', 'עדכני', 'פרמיירה', 'עכשיו', 'בימים אלה', 'חדשות'],
    categories: ['new'],
  },
  {
    keywords: ['popular', 'trending', 'hit', 'best', 'top', 'famous', 'classic',
               'פופולרי', 'פופולרית', 'הכי טוב', 'מפורסם', 'מפורסמת', 'קלאסיקה', 'מוכר', 'מומלץ', 'מומלצת'],
    categories: ['popular', 'long_running'],
  },
  {
    keywords: ['short', 'quick', 'brief', 'under', 'hour',
               'קצר', 'קצרה', 'מהיר', 'שעה', 'ישיבה קצרה'],
    categories: ['short'],
  },
  {
    keywords: ['long', 'epic', 'full night', 'evening',
               'ארוך', 'ארוכה', 'ערב שלם', 'ממושך', 'ממושכת'],
    categories: ['long_running'],
  },
];

// Greetings and thanks to detect special intents
const GREETING_WORDS = ['hi', 'hello', 'hey', 'yo', 'sup', 'שלום', 'היי', 'הי', 'בוקר', 'ערב', 'מה נשמע', 'מה קורה'];
const THANKS_WORDS = ['thanks', 'thank you', 'ty', 'תודה', 'תנקיו', 'תודה רבה'];

// Check if text contains Hebrew characters
function containsHebrew(text: string): boolean {
  return /[\u0590-\u05FF]/.test(text);
}

// Check if text is a greeting
function isGreeting(text: string): boolean {
  const lower = text.toLowerCase().trim();
  return GREETING_WORDS.some(g => lower === g || lower.startsWith(g + ' ') || lower.startsWith(g + ','));
}

// Check if text is a thanks
function isThanks(text: string): boolean {
  const lower = text.toLowerCase();
  return THANKS_WORDS.some(t => lower.includes(t));
}

// ============================================
// Recommendation engine
// ============================================
interface RecResult {
  shows: Show[];
  confidence: number; // 0 = no keywords matched
  type: 'recs' | 'greeting' | 'thanks' | 'unknown';
}

function analyzeQuery(query: string, allShows: Show[]): RecResult {
  if (isGreeting(query)) return { shows: [], confidence: 0, type: 'greeting' };
  if (isThanks(query)) return { shows: [], confidence: 0, type: 'thanks' };

  const lower = query.toLowerCase();
  const activeShows = allShows.filter(s => s.isActive);

  // Keyword matching
  const matchedCategories = new Set<string>();
  let keywordScore = 0;
  for (const mapping of KEYWORD_MAP) {
    if (mapping.keywords.some(k => lower.includes(k))) {
      mapping.categories.forEach(c => matchedCategories.add(c));
      keywordScore++;
    }
  }

  // Direct title matching (e.g. user types the show name)
  if (matchedCategories.size === 0) {
    const titleMatches = activeShows.filter(s =>
      s.title.toLowerCase().includes(lower) && lower.length >= 3
    );
    if (titleMatches.length > 0) {
      return { shows: titleMatches.slice(0, 3), confidence: 2, type: 'recs' };
    }
    // Nothing matched
    return { shows: [], confidence: 0, type: 'unknown' };
  }

  // Score all shows by category overlap + rating
  const scored = activeShows
    .map(s => {
      const catMatches = s.categories.filter(c => matchedCategories.has(c)).length;
      const titleBonus = s.title.toLowerCase().includes(lower) ? 3 : 0;
      const score = catMatches * 2 + titleBonus + (s.rating ?? 0);
      return { show: s, score };
    })
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  if (scored.length === 0) {
    return { shows: [], confidence: 0, type: 'unknown' };
  }

  return { shows: scored.map(r => r.show), confidence: keywordScore, type: 'recs' };
}

// ============================================
// Response text builder
// ============================================
function buildResponseText(
  result: RecResult,
  inHebrew: boolean,
  clarificationCount: number,
): string {
  if (result.type === 'greeting') {
    return inHebrew
      ? 'שלום! 👋 אני כאן לעזור לך למצוא הצגות.\nתאר לי מה בא לך — ז׳אנר, מצב רוח, עם מי אתה הולך — ואמליץ לך.'
      : "Hi! 👋 I'm here to help you find the perfect show.\nTell me what you're in the mood for — genre, occasion, who you're going with!";
  }

  if (result.type === 'thanks') {
    return inHebrew
      ? 'בשמחה! 🎭 אם תרצה עוד המלצות, פשוט תשאל.'
      : "You're welcome! 🎭 Feel free to ask anytime for more recommendations.";
  }

  if (result.type === 'unknown' || result.shows.length === 0) {
    const heMessages = [
      'לא הבנתי 🤔 תוכל לתאר יותר מה אתה מחפש?\nלמשל: "משהו מצחיק", "ערב רומנטי" או "הצגת ילדים".',
      'עדיין לא הצלחתי להבין. נסה לציין ז׳אנר — קומדיה, דרמה, מחזמר — או למי ההצגה מיועדת.',
      'לא מצאתי התאמה. נסה שוב עם מילים כמו "מצחיק", "רומנטי", "ילדים" או שם הצגה.',
    ];
    const enMessages = [
      "I didn't quite get that 🤔 Try describing a genre or mood —\n\"funny comedy\", \"romantic evening\", or \"family show\".",
      "Still not sure what you're looking for. Try mentioning: comedy, drama, musical, family, thriller...",
      "I couldn't find a match. Try rephrasing with a genre, mood, or show name.",
    ];
    const msgs = inHebrew ? heMessages : enMessages;
    return msgs[Math.min(clarificationCount, msgs.length - 1)];
  }

  // Successful recommendation
  const heIntros = ['הנה מה שמצאתי בשבילך:', 'יש לי כמה המלצות:', 'אלה ההצגות שמתאימות לך:'];
  const enIntros = ['Here are my picks:', "Here's what I found for you:", 'Check these out:'];
  const intros = inHebrew ? heIntros : enIntros;
  return intros[Math.floor(Math.random() * intros.length)];
}

// ============================================
// Quick prompts (bilingual)
// ============================================
const QUICK_PROMPTS_HE = [
  { label: '😂 קומדיה', query: 'קומדיה מצחיקה' },
  { label: '❤️ ערב זוגי', query: 'ערב רומנטי זוגי' },
  { label: '👨‍👩‍👧 משפחה', query: 'הצגה לכל המשפחה עם ילדים' },
  { label: '🎵 מחזמר', query: 'מחזמר שירה' },
];

const QUICK_PROMPTS_EN = [
  { label: '😂 Comedy', query: 'funny comedy' },
  { label: '❤️ Date Night', query: 'romantic love date' },
  { label: '👨‍👩‍👧 Family', query: 'family kids' },
  { label: '🎵 Musical', query: 'musical singing' },
];

export default function LiveChatScreen() {
  const { i18n } = useTranslation();
  const navigation = useNavigation<LiveChatNavProp>();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);
  const typingAnim = useRef(new Animated.Value(0)).current;
  const clarificationCountRef = useRef(0);

  const isHe = i18n.language === 'he';
  const { shows: allShows } = useShows();

  const QUICK_PROMPTS = isHe ? QUICK_PROMPTS_HE : QUICK_PROMPTS_EN;

  const getWelcomeMessage = (): ChatMessage => ({
    id: 'welcome',
    role: 'assistant',
    text: isHe
      ? 'שלום! 👋 אני העוזר שלך למציאת הצגות.\nתאר לי מה בא לך לראות — ז׳אנר, מצב רוח, עם מי — ואמליץ לך על ההצגה המתאימה.'
      : "Hi! 👋 I'm your show assistant.\nTell me what you're in the mood for and I'll suggest the perfect show.\n\nTry: \"funny comedy\", \"romantic date night\", or \"family show\".",
    createdAt: new Date().toISOString(),
  });

  const [messages, setMessages] = useState<ChatMessage[]>([getWelcomeMessage()]);
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
            setMessages([getWelcomeMessage(), ...saved.filter(m => m.id !== 'welcome')]);
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

    const inHebrew = isHe || containsHebrew(trimmed);

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
    // Slight delay to feel natural (faster for greeting/thanks)
    const delay = 900 + Math.random() * 400;
    setTimeout(() => {
      setIsTyping(false);

      const result = analyzeQuery(trimmed, allShows);

      // Update clarification counter
      if (result.type === 'unknown') {
        clarificationCountRef.current += 1;
      } else if (result.type === 'recs') {
        clarificationCountRef.current = 0;
      }

      const responseText = buildResponseText(result, inHebrew, clarificationCountRef.current - 1);
      const isError = result.type === 'unknown';

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: responseText,
        createdAt: new Date().toISOString(),
        recommendedShowIds: result.shows.map(s => s.id),
        isError,
      };
      setMessages(prev => [...prev, assistantMsg]);
      scrollToBottom();
    }, delay);
  };

  const handleSend = () => sendMessage(inputText);
  const handleQuickPrompt = (query: string) => sendMessage(query);

  const formatTime = (iso: string) => {
    try {
      return new Date(iso).toLocaleTimeString(isHe ? 'he-IL' : 'en-US', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  const renderMessage = (message: ChatMessage) => {
    const isUser = message.role === 'user';
    const recShows = message.recommendedShowIds && message.recommendedShowIds.length > 0
      ? allShows.filter(s => message.recommendedShowIds!.includes(s.id))
      : [];

    return (
      <View
        key={message.id}
        style={[styles.messageContainer, isUser ? styles.userMessageContainer : styles.otherMessageContainer]}
      >
        {!isUser && (
          <View style={[styles.botAvatar, message.isError && styles.botAvatarError]}>
            <Ionicons
              name={message.isError ? 'help-circle' : 'sparkles'}
              size={16}
              color={message.isError ? colors.semantic.warning : colors.primary.main}
            />
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
          <Text style={styles.headerTitle}>{isHe ? 'עוזר ההצגות' : 'Show Assistant'}</Text>
          <View style={styles.statusContainer}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>{isHe ? 'מחפש הצגות בשבילך' : 'Finding shows for you'}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.clearButton}
          onPress={() => {
            setMessages([getWelcomeMessage()]);
            clarificationCountRef.current = 0;
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
              <Text style={styles.quickPromptsTitle}>
                {isHe ? 'הצעות מהירות:' : 'Quick suggestions:'}
              </Text>
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
              placeholder={isHe ? 'תאר מה בא לך לראות...' : "Describe what you're in the mood for..."}
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
  botAvatarError: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
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
