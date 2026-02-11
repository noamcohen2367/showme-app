// ============================================
// ShowME App - Share Ticket Screen
// ============================================

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Share,
  TextInput,
  Alert,
  Animated,
} from 'react-native';
import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, typography, spacing } from '../theme/theme';

interface TicketToShare {
  id: string;
  showTitle: string;
  date: string;
  time: string;
  venue: string;
  seat: string;
  imageUrl: string;
}

const MOCK_TICKET: TicketToShare = {
  id: 'ticket-123',
  showTitle: 'The Phantom of the Opera',
  date: 'January 15, 2025',
  time: '20:00',
  venue: 'Habima Theatre',
  seat: 'A12',
  imageUrl: 'https://picsum.photos/seed/phantom/400/200',
};

export default function ShareTicketScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  
  const [shareMethod, setShareMethod] = useState<'link' | 'qr' | 'contact' | null>(null);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [personalMessage, setPersonalMessage] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleShare = async () => {
    try {
      await Share.share({
        title: `Ticket for ${MOCK_TICKET.showTitle}`,
        message: `I'm sharing my ticket for ${MOCK_TICKET.showTitle} on ${MOCK_TICKET.date} at ${MOCK_TICKET.time}. Seat: ${MOCK_TICKET.seat}. Download ShowME app to view: https://showme.app/ticket/${MOCK_TICKET.id}`,
        url: `https://showme.app/ticket/${MOCK_TICKET.id}`,
      });
    } catch (error) {
      console.log('Share error:', error);
    }
  };

  const handleSendToContact = () => {
    if (!recipientEmail || !recipientName) {
      Alert.alert('Missing Information', 'Please enter recipient name and email');
      return;
    }

    setIsSharing(true);
    
    // Simulate sending
    setTimeout(() => {
      setIsSharing(false);
      setShareSuccess(true);
      
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.1, duration: 150, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
      ]).start();
    }, 1500);
  };

  const renderShareOptions = () => (
    <View style={styles.shareOptions}>
      <TouchableOpacity
        style={[styles.shareOption, shareMethod === 'link' && styles.shareOptionActive]}
        onPress={() => setShareMethod('link')}
      >
        <View style={[styles.shareOptionIcon, { backgroundColor: 'rgba(168, 85, 247, 0.2)' }]}>
          <Ionicons name="link" size={24} color={colors.primary.main} />
        </View>
        <Text style={styles.shareOptionTitle}>Share Link</Text>
        <Text style={styles.shareOptionDesc}>Copy or share via apps</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.shareOption, shareMethod === 'qr' && styles.shareOptionActive]}
        onPress={() => setShareMethod('qr')}
      >
        <View style={[styles.shareOptionIcon, { backgroundColor: 'rgba(236, 72, 153, 0.2)' }]}>
          <Ionicons name="qr-code" size={24} color={colors.secondary.main} />
        </View>
        <Text style={styles.shareOptionTitle}>QR Code</Text>
        <Text style={styles.shareOptionDesc}>Scan to transfer</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.shareOption, shareMethod === 'contact' && styles.shareOptionActive]}
        onPress={() => setShareMethod('contact')}
      >
        <View style={[styles.shareOptionIcon, { backgroundColor: 'rgba(6, 182, 212, 0.2)' }]}>
          <Ionicons name="person-add" size={24} color={colors.accent.main} />
        </View>
        <Text style={styles.shareOptionTitle}>Send to Contact</Text>
        <Text style={styles.shareOptionDesc}>Email directly</Text>
      </TouchableOpacity>
    </View>
  );

  const renderLinkShare = () => (
    <View style={styles.shareContent}>
      <View style={styles.linkContainer}>
        <Text style={styles.linkText} numberOfLines={1}>
          https://showme.app/ticket/{MOCK_TICKET.id}
        </Text>
        <TouchableOpacity style={styles.copyButton}>
          <Ionicons name="copy-outline" size={20} color={colors.primary.main} />
        </TouchableOpacity>
      </View>

      <Text style={styles.shareViaText}>Or share via</Text>

      <View style={styles.socialButtons}>
        <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#25D366' }]} onPress={handleShare}>
          <Ionicons name="logo-whatsapp" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#0088cc' }]} onPress={handleShare}>
          <Ionicons name="paper-plane" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#1DA1F2' }]} onPress={handleShare}>
          <Ionicons name="chatbubble-ellipses" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.socialButton, { backgroundColor: colors.dark[600] }]} onPress={handleShare}>
          <Ionicons name="ellipsis-horizontal" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderQRShare = () => (
    <View style={styles.shareContent}>
      <View style={styles.qrContainer}>
        {/* Simulated QR Code */}
        <View style={styles.qrCode}>
          <View style={styles.qrPattern}>
            {[...Array(10)].map((_, row) => (
              <View key={row} style={styles.qrRow}>
                {[...Array(10)].map((_, col) => (
                  <View
                    key={col}
                    style={[
                      styles.qrCell,
                      Math.random() > 0.5 && styles.qrCellFilled
                    ]}
                  />
                ))}
              </View>
            ))}
          </View>
          <View style={styles.qrLogo}>
            <Ionicons name="ticket" size={24} color={colors.primary.main} />
          </View>
        </View>
        <Text style={styles.qrHint}>Scan this code to receive the ticket</Text>
      </View>

      <View style={styles.qrActions}>
        <TouchableOpacity style={styles.qrActionButton}>
          <Ionicons name="download-outline" size={20} color={colors.primary.main} />
          <Text style={styles.qrActionText}>Save QR</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.qrActionButton} onPress={handleShare}>
          <Ionicons name="share-outline" size={20} color={colors.primary.main} />
          <Text style={styles.qrActionText}>Share QR</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderContactShare = () => (
    <View style={styles.shareContent}>
      {shareSuccess ? (
        <Animated.View style={[styles.successContainer, { transform: [{ scale: scaleAnim }] }]}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={64} color={colors.semantic.success} />
          </View>
          <Text style={styles.successTitle}>Ticket Sent!</Text>
          <Text style={styles.successDesc}>
            {recipientName} will receive an email with the ticket details.
          </Text>
          <TouchableOpacity
            style={styles.doneButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </Animated.View>
      ) : (
        <>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Recipient's Name</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter name"
              placeholderTextColor={colors.neutral.textTertiary}
              value={recipientName}
              onChangeText={setRecipientName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Recipient's Email</Text>
            <TextInput
              style={styles.textInput}
              placeholder="email@example.com"
              placeholderTextColor={colors.neutral.textTertiary}
              value={recipientEmail}
              onChangeText={setRecipientEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Personal Message (Optional)</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="Add a personal note..."
              placeholderTextColor={colors.neutral.textTertiary}
              value={personalMessage}
              onChangeText={setPersonalMessage}
              multiline
              numberOfLines={3}
            />
          </View>

          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSendToContact}
            disabled={isSharing}
          >
            <LinearGradient
              colors={[colors.primary.main, colors.secondary.main]}
              style={styles.sendButtonGradient}
            >
              {isSharing ? (
                <Text style={styles.sendButtonText}>Sending...</Text>
              ) : (
                <>
                  <Ionicons name="send" size={20} color={colors.neutral.white} />
                  <Text style={styles.sendButtonText}>Send Ticket</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.neutral.background} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.neutral.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Share Ticket</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Ticket Preview */}
        <View style={styles.ticketPreview}>
          <Image source={{ uri: MOCK_TICKET.imageUrl }} style={styles.ticketImage} contentFit="cover" transition={300} />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.ticketGradient}
          />
          <View style={styles.ticketInfo}>
            <Text style={styles.ticketTitle}>{MOCK_TICKET.showTitle}</Text>
            <View style={styles.ticketDetails}>
              <View style={styles.ticketDetail}>
                <Ionicons name="calendar-outline" size={14} color={colors.neutral.textSecondary} />
                <Text style={styles.ticketDetailText}>{MOCK_TICKET.date}</Text>
              </View>
              <View style={styles.ticketDetail}>
                <Ionicons name="time-outline" size={14} color={colors.neutral.textSecondary} />
                <Text style={styles.ticketDetailText}>{MOCK_TICKET.time}</Text>
              </View>
              <View style={styles.ticketDetail}>
                <Ionicons name="location-outline" size={14} color={colors.neutral.textSecondary} />
                <Text style={styles.ticketDetailText}>Seat {MOCK_TICKET.seat}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Share Method Selection */}
        <Text style={styles.sectionTitle}>How would you like to share?</Text>
        {renderShareOptions()}

        {/* Share Content based on method */}
        {shareMethod === 'link' && renderLinkShare()}
        {shareMethod === 'qr' && renderQRShare()}
        {shareMethod === 'contact' && renderContactShare()}

        {/* Warning */}
        <View style={styles.warningCard}>
          <Ionicons name="warning" size={20} color={colors.semantic.warning} />
          <Text style={styles.warningText}>
            Once shared, this ticket will be transferred to the recipient. You will no longer be able to use it.
          </Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
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
  ticketPreview: { borderRadius: 16, overflow: 'hidden', marginBottom: spacing.xl, height: 160, position: 'relative' },
  ticketImage: { width: '100%', height: '100%' },
  ticketGradient: { ...StyleSheet.absoluteFillObject },
  ticketInfo: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: spacing.md },
  ticketTitle: { ...typography.headingSmall, color: colors.neutral.white, marginBottom: spacing.xs },
  ticketDetails: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  ticketDetail: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ticketDetailText: { ...typography.caption, color: colors.neutral.textSecondary },
  sectionTitle: { ...typography.labelLarge, color: colors.neutral.text, marginBottom: spacing.md },
  shareOptions: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.xl },
  shareOption: { flex: 1, backgroundColor: colors.dark[700], borderRadius: 16, padding: spacing.md, alignItems: 'center', borderWidth: 2, borderColor: colors.dark[500] },
  shareOptionActive: { borderColor: colors.primary.main },
  shareOptionIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  shareOptionTitle: { ...typography.labelSmall, color: colors.neutral.text, marginBottom: 2 },
  shareOptionDesc: { ...typography.caption, color: colors.neutral.textTertiary, textAlign: 'center' },
  shareContent: { backgroundColor: colors.dark[700], borderRadius: 16, padding: spacing.lg, marginBottom: spacing.xl, borderWidth: 1, borderColor: colors.dark[500] },
  linkContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.dark[600], borderRadius: 10, padding: spacing.md, marginBottom: spacing.lg },
  linkText: { flex: 1, ...typography.bodySmall, color: colors.neutral.textSecondary },
  copyButton: { padding: spacing.xs },
  shareViaText: { ...typography.labelSmall, color: colors.neutral.textTertiary, textAlign: 'center', marginBottom: spacing.md },
  socialButtons: { flexDirection: 'row', justifyContent: 'center', gap: spacing.md },
  socialButton: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  qrContainer: { alignItems: 'center', marginBottom: spacing.lg },
  qrCode: { width: 200, height: 200, backgroundColor: colors.neutral.white, borderRadius: 16, padding: spacing.md, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  qrPattern: {},
  qrRow: { flexDirection: 'row' },
  qrCell: { width: 16, height: 16, margin: 1, backgroundColor: 'transparent' },
  qrCellFilled: { backgroundColor: colors.dark[900] },
  qrLogo: { position: 'absolute', backgroundColor: colors.neutral.white, padding: spacing.sm, borderRadius: 8 },
  qrHint: { ...typography.bodySmall, color: colors.neutral.textSecondary, marginTop: spacing.md },
  qrActions: { flexDirection: 'row', justifyContent: 'center', gap: spacing.xl },
  qrActionButton: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  qrActionText: { ...typography.labelMedium, color: colors.primary.main },
  inputGroup: { marginBottom: spacing.md },
  inputLabel: { ...typography.labelSmall, color: colors.neutral.textSecondary, marginBottom: spacing.xs },
  textInput: { backgroundColor: colors.dark[600], borderRadius: 10, paddingHorizontal: spacing.md, paddingVertical: spacing.md, ...typography.bodyMedium, color: colors.neutral.text, borderWidth: 1, borderColor: colors.dark[500] },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  sendButton: { borderRadius: 12, overflow: 'hidden', marginTop: spacing.md },
  sendButtonGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.lg, gap: spacing.sm },
  sendButtonText: { ...typography.labelLarge, color: colors.neutral.white },
  successContainer: { alignItems: 'center', paddingVertical: spacing.xl },
  successIcon: { marginBottom: spacing.lg },
  successTitle: { ...typography.headingMedium, color: colors.neutral.text, marginBottom: spacing.sm },
  successDesc: { ...typography.bodyMedium, color: colors.neutral.textSecondary, textAlign: 'center', marginBottom: spacing.xl },
  doneButton: { backgroundColor: colors.primary.main, paddingHorizontal: spacing.xxl, paddingVertical: spacing.md, borderRadius: 10 },
  doneButtonText: { ...typography.labelMedium, color: colors.neutral.white },
  warningCard: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: 'rgba(245, 158, 11, 0.1)', padding: spacing.md, borderRadius: 12, gap: spacing.sm },
  warningText: { ...typography.bodySmall, color: colors.semantic.warning, flex: 1 },
});
