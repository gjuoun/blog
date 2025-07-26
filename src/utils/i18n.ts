// Dynamic import of all locale files
const localeFiles = import.meta.glob('../locales/**/*.json', { eager: true });

// Build the ui object from loaded files
const ui: Record<string, Record<string, string>> = {};

for (const [path, module] of Object.entries(localeFiles)) {
  const localeMatch = path.match(/\/locales\/([^\/]+)\//);
  if (localeMatch) {
    const locale = localeMatch[1];
    if (!ui[locale]) {
      ui[locale] = {};
    }
    // Merge translations from this file
    Object.assign(ui[locale], (module as any).default || module);
  }
}

export function useTranslations(lang: string) {
  return function t(key: string) {
    const langObject = ui[lang];
    const englishObject = ui.en;

    return langObject?.[key] || englishObject?.[key] || key;
  }
}