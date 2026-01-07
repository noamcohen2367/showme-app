// ============================================
// ShowME App - i18n Configuration
// ============================================

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';
import { I18nManager } from 'react-native';

import en from './locales/en';
import he from './locales/he';
import ru from './locales/ru';

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

// Initialize i18n
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

// RTL Configuration Helper
export const configureRTL = (languageCode: LanguageCode): void => {
  const isRTL = SUPPORTED_LANGUAGES[languageCode].rtl;
  
  if (I18nManager.isRTL !== isRTL) {
    I18nManager.allowRTL(isRTL);
    I18nManager.forceRTL(isRTL);
    // Note: App needs to reload for RTL changes to take effect
  }
};

// Change language function
export const changeLanguage = async (languageCode: LanguageCode): Promise<void> => {
  await i18n.changeLanguage(languageCode);
  configureRTL(languageCode);
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
