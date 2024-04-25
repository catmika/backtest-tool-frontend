import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEN from './locales/en/translation.json';
import translationUA from './locales/ua/translation.json';
// don't want to use this?
// have a look at the Quick start guide
// for passing in lng and translations on init

export const resources = {
  en: {
    translation: translationEN,
  },
  ua: {
    translation: translationUA,
  },
};

i18n.use(initReactI18next).init({
  resources,
  fallbackLng: 'en',
  lng: localStorage.getItem('language') || 'en',
  debug: true,
  keySeparator: false,
  interpolation: { escapeValue: false },
});

export default i18n;
