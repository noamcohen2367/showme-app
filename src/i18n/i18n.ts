// ============================================
// ShowME App - i18n Configuration
// ============================================

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';
import { I18nManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from './locales/en';
import he from './locales/he';
import ru from './locales/ru';

const LANGUAGE_KEY = '@showmi_language';

// Define supported languages
export const SUPPORTED_LANGUAGES = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    rtl: false,
  },
  he: {
    code: 'he',
    name: 'Hebrew',
    nativeName: 'עברית',
    rtl: true,
  },
  ru: {
    code: 'ru',
    name: 'Russian',
    nativeName: 'Русский',
    rtl: false,
  },
} as const;

export type LanguageCode = keyof typeof SUPPORTED_LANGUAGES;

// Get device language
const getDeviceLanguage = (): LanguageCode => {
  const locales = getLocales();
  const deviceLang = locales[0]?.languageCode;

  // Check if device language is supported
  if (deviceLang && deviceLang in SUPPORTED_LANGUAGES) {
    return deviceLang as LanguageCode;
  }

  // Default to English
  return 'en';
};

// Load persisted language (synchronous fallback to device language on first load)
export const loadPersistedLanguage = async (): Promise<LanguageCode> => {
  try {
    const saved = await AsyncStorage.getItem(LANGUAGE_KEY);
    if (saved && saved in SUPPORTED_LANGUAGES) {
      return saved as LanguageCode;
    }
  } catch {
    // ignore storage errors
  }
  return getDeviceLanguage();
};

// Initialize i18n (synchronously with device language; call initLanguage() after)
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      he: { translation: he },
      ru: { translation: ru },
    },
    lng: getDeviceLanguage(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already escapes
    },
    react: {
      useSuspense: false,
    },
  });

// Call this once at app startup (after AsyncStorage is ready) to apply saved language
export const initLanguage = async (): Promise<void> => {
  const lang = await loadPersistedLanguage();
  await i18n.changeLanguage(lang);
  configureRTL(lang);
};

// RTL Configuration Helper
// Returns true if RTL direction changed (app needs restart to apply layout)
export const configureRTL = (languageCode: LanguageCode): boolean => {
  const shouldBeRTL = SUPPORTED_LANGUAGES[languageCode].rtl;

  if (I18nManager.isRTL !== shouldBeRTL) {
    I18nManager.allowRTL(shouldBeRTL);
    I18nManager.forceRTL(shouldBeRTL);
    return true; // layout direction changed – restart required
  }
  return false;
};

// Change language function
// Returns true if RTL direction changed (app restart needed)
export const changeLanguage = async (languageCode: LanguageCode): Promise<boolean> => {
  await i18n.changeLanguage(languageCode);
  const needsRestart = configureRTL(languageCode);
  try {
    await AsyncStorage.setItem(LANGUAGE_KEY, languageCode);
  } catch {
    // ignore storage errors
  }
  return needsRestart;
};

// Get current language info
export const getCurrentLanguageInfo = () => {
  const currentLang = i18n.language as LanguageCode;
  return SUPPORTED_LANGUAGES[currentLang] || SUPPORTED_LANGUAGES.en;
};

// Check if current language is RTL
export const isRTL = (): boolean => {
  const currentLang = i18n.language as LanguageCode;
  return SUPPORTED_LANGUAGES[currentLang]?.rtl || false;
};

// Initialize RTL on app start
export const initializeRTL = (): void => {
  const currentLang = getDeviceLanguage();
  configureRTL(currentLang);
};

export default i18n;
