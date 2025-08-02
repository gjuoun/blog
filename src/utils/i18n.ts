import { translations } from '../locales/translations';

type TranslationKey = keyof typeof translations.en;
type Locale = keyof typeof translations;

export function useTranslations(lang: Locale) {
  return (key: TranslationKey) => {
    const langTranslations = translations[lang];
    const englishTranslations = translations.en;

    if (langTranslations?.[key]) {
      return langTranslations[key];
    }

    if (englishTranslations?.[key]) {
      return englishTranslations[key];
    }

    return '';
  };
}