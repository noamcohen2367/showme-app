// ============================================
// ShowME App - Live Chat Support Screen
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
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, typography, spacing } from '../theme/theme';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent' | 'bot';
  timestamp: Date;
  agentName?: string;
  agentAvatar?: string;
}

interface QuickAction {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const QUICK_ACTIONS: QuickAction[] = [
  { id: 'booking', label: 'Booking Help', icon: 'ticket' },
  { id: 'refund', label: 'Refund Request', icon: 'cash' },
  { id: 'seats', label: 'Seat Change', icon: 'grid' },
  { id: 'other', label: 'Other Issue', icon: 'help-circle' },
];

const BOT_RESPONSES: Record<string, string> = {
  booking: "I can help with your booking! Please share your order number or describe the issue you're experiencing.",
  refund: "For refund requests, I'll need your order number. Please note that refunds are processed within 5-7 business days. What's your order number?",
  seats: "I'd be happy to help you change your seats! Please provide your order number and the date of your show.",
  other: "I'm here to help! Please describe your issue and I'll do my best to assist you.",
  default: "Thanks for your message! Let me connect you with a support agent who can help you better.",
};

export default function LiveChatScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);
  const typingAnim = useRef(new Animated.Value(0)).current;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! 👋 I'm ShowMI's support assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isAgentConnected, setIsAgentConnected] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

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
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleQuickAction = (action: QuickAction) => {
    setSelectedTopic(action.id);
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: action.label,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    scrollToBottom();

    // Simulate bot response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: BOT_RESPONSES[action.id] || BOT_RESPONSES.default,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
      scrollToBottom();
    }, 1500);
  };

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    scrollToBottom();

    // Simulate response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      
      if (!isAgentConnected && messages.length > 3) {
        // Connect to agent after some messages
        setIsAgentConnected(true);
        const agentMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: "Hi! I'm Sarah from the support team. I've reviewed your conversation. How can I assist you further?",
          sender: 'agent',
          timestamp: new Date(),
          agentName: 'Sarah',
          agentAvatar: 'https://picsum.photos/seed/sarah/100/100',
        };
        setMessages(prev => [...prev, agentMessage]);
      } else if (isAgentConnected) {
        const agentMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: "I understand. Let me check that for you. This might take a moment...",
          sender: 'agent',
          timestamp: new Date(),
          agentName: 'Sarah',
          agentAvatar: 'https://picsum.photos/seed/sarah/100/100',
        };
        setMessages(prev => [...prev, agentMessage]);
      } else {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: BOT_RESPONSES.default,
          sender: 'bot',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, botResponse]);
      }
      scrollToBottom();
    }, 2000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = (message: Message) => {
    const isUser = message.sender === 'user';
    const isAgent = message.sender === 'agent';

    return (
      <View
        key={message.id}
        style={[
          styles.messageContainer,
          isUser ? styles.userMessageContainer : styles.otherMessageContainer,
        ]}
      >
        {!isUser && (
          <View style={styles.avatarContainer}>
            {isAgent ? (
              <Image source={{ uri: message.agentAvatar }} style={styles.avatar} contentFit="cover" transition={200} />
            ) : (
              <View style={styles.botAvatar}>
                <Ionicons name="sparkles" size={16} color={colors.primary.main} />
              </View>
            )}
          </View>
        )}
        <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.otherBubble]}>
          {isAgent && (
            <Text style={styles.agentName}>{message.agentName}</Text>
          )}
          <Text style={[styles.messageText, isUser && styles.userMessageText]}>
            {message.text}
          </Text>
          <Text style={[styles.messageTime, isUser && styles.userMessageTime]}>
            {formatTime(message.timestamp)}
          </Text>
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
          <Text style={styles.headerTitle}>Support Chat</Text>
          <View style={styles.statusContainer}>
            <View style={[styles.statusDot, isAgentConnected && styles.statusDotOnline]} />
            <Text style={styles.statusText}>
              {isAgentConnected ? 'Sarah is helping you' : 'Bot Assistant'}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-vertical" size={20} color={colors.neutral.text} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Quick Actions */}
          {messages.length === 1 && (
            <View style={styles.quickActionsContainer}>
              <Text style={styles.quickActionsTitle}>What do you need help with?</Text>
              <View style={styles.quickActions}>
                {QUICK_ACTIONS.map((action) => (
                  <TouchableOpacity
                    key={action.id}
                    style={styles.quickAction}
                    onPress={() => handleQuickAction(action)}
                  >
                    <View style={styles.quickActionIcon}>
                      <Ionicons name={action.icon} size={20} color={colors.primary.main} />
                    </View>
                    <Text style={styles.quickActionLabel}>{action.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Messages */}
          {messages.map(renderMessage)}

          {/* Typing Indicator */}
          {isTyping && (
            <View style={[styles.messageContainer, styles.otherMessageContainer]}>
              <View style={styles.avatarContainer}>
                {isAgentConnected ? (
                  <Image
                    source={{ uri: 'https://picsum.photos/seed/sarah/100/100' }}
                    style={styles.avatar}
                    contentFit="cover"
                    transition={200}
                  />
                ) : (
                  <View style={styles.botAvatar}>
                    <Ionicons name="sparkles" size={16} color={colors.primary.main} />
                  </View>
                )}
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
            <TouchableOpacity style={styles.attachButton}>
              <Ionicons name="attach" size={24} color={colors.neutral.textTertiary} />
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="Type a message..."
              placeholderTextColor={colors.neutral.textTertiary}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
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
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, paddingBottom: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.dark[500] },
  backButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { ...typography.labelLarge, color: colors.neutral.text },
  statusContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.neutral.textTertiary, marginRight: spacing.xs },
  statusDotOnline: { backgroundColor: colors.semantic.success },
  statusText: { ...typography.caption, color: colors.neutral.textTertiary },
  moreButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  keyboardView: { flex: 1 },
  messagesContainer: { flex: 1 },
  messagesContent: { padding: spacing.lg },
  quickActionsContainer: { marginBottom: spacing.xl },
  quickActionsTitle: { ...typography.labelMedium, color: colors.neutral.textSecondary, marginBottom: spacing.md, textAlign: 'center' },
  quickActions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, justifyContent: 'center' },
  quickAction: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.dark[700], borderRadius: 20, paddingVertical: spacing.sm, paddingHorizontal: spacing.md, borderWidth: 1, borderColor: colors.dark[500], gap: spacing.sm },
  quickActionIcon: { width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(168, 85, 247, 0.2)', alignItems: 'center', justifyContent: 'center' },
  quickActionLabel: { ...typography.labelSmall, color: colors.neutral.text },
  messageContainer: { flexDirection: 'row', marginBottom: spacing.md },
  userMessageContainer: { justifyContent: 'flex-end' },
  otherMessageContainer: { justifyContent: 'flex-start' },
  avatarContainer: { marginRight: spacing.sm },
  avatar: { width: 32, height: 32, borderRadius: 16 },
  botAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(168, 85, 247, 0.2)', alignItems: 'center', justifyContent: 'center' },
  messageBubble: { maxWidth: '75%', borderRadius: 16, padding: spacing.md },
  userBubble: { backgroundColor: colors.primary.main, borderBottomRightRadius: 4 },
  otherBubble: { backgroundColor: colors.dark[700], borderBottomLeftRadius: 4 },
  agentName: { ...typography.caption, color: colors.primary.main, marginBottom: spacing.xxs },
  messageText: { ...typography.bodyMedium, color: colors.neutral.text },
  userMessageText: { color: colors.neutral.white },
  messageTime: { ...typography.caption, color: colors.neutral.textTertiary, marginTop: spacing.xs, alignSelf: 'flex-end' },
  userMessageTime: { color: 'rgba(255,255,255,0.7)' },
  typingBubble: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, gap: spacing.xs },
  typingDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.neutral.textTertiary },
  inputContainer: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.dark[500], backgroundColor: colors.dark[800] },
  inputWrapper: { flexDirection: 'row', alignItems: 'flex-end', backgroundColor: colors.dark[700], borderRadius: 24, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderWidth: 1, borderColor: colors.dark[500] },
  attachButton: { padding: spacing.sm },
  input: { flex: 1, ...typography.bodyMedium, color: colors.neutral.text, maxHeight: 100, paddingVertical: spacing.sm },
  sendButton: { padding: spacing.xs },
  sendButtonDisabled: { opacity: 0.5 },
  sendButtonGradient: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
});
