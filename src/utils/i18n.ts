export const ui = {
  en: {
    'nav.home': 'Home',
    'nav.blog': 'Blog',
    'nav.about': 'About',
    'nav.tags': 'Tags',
    'site.title': "Jun's Blog - Blackhodl Universe",
    'site.description': 'This is my blog about my journey learning Astro.',
    'site.ogTitle': "Jun's Blog - Blackhodl Universe",
  },
  zh: {
    'nav.home': '首页',
    'nav.blog': '博客',
    'nav.about': '关于',
    'nav.tags': '标签',
    'site.title': 'Jun 的博客 - Blackhodl Universe',
    'site.description': '这是我的博客，记录我学习 Astro 的旅程。',
    'site.ogTitle': 'Jun 的博客 - Blackhodl Universe',
  },
} as const;

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof typeof ui['en']) {
    const langObject = ui[lang];
    const englishObject = ui.en;

    return langObject[key] || englishObject[key];
  }
}