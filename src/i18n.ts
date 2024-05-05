import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEN from './locales/enUS/translation.json';
import translationUA from './locales/ukUA/translation.json';
// don't want to use this?
// have a look at the Quick start guide
// for passing in lng and translations on init

export const resources = {
  enUS: {
    translation: translationEN,
  },
  ukUA: {
    translation: translationUA,
  },
};

i18n.use(initReactI18next).init({
  resources,
  fallbackLng: 'enUS',
  lng: localStorage.getItem('language') || 'enUS',
  debug: true,
  keySeparator: false,
  interpolation: { escapeValue: false },
});

export default i18n;
