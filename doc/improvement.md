# Multilingual Improvement Plan

This document captures actionable steps to harden and polish the i18n layer of the blog.  Each item is split into **priority**, **goal**, **action** and **notes** so that we can track progress with minimal overhead.

## Legend

| Priority | Meaning |
| -------- | ------- |
| 🟥 High  | SEO / UX regression until it’s fixed – tackle in the next sprint. |
| 🟧 Med   | Nice-to-have; schedule once the 🔴 items are complete. |
| 🟩 Low   | Future-proofing / refactor opportunities. |

---

## Task List

| # | Priority | Goal | Action | Owner |
|---|----------|------|--------|-------|
| 1 | 🟥 | Make search engines aware of language variants | Inject `<link rel="alternate" hreflang="…">` into every page.<br/>Implementation: use `getLocaleAlternates(Astro.url)` inside `layouts/Layout.astro`. | @you |
| 2 | 🟥 | Avoid duplicate-content penalty | Add `<link rel="canonical">` that always points to the locale-specific URL. | @you |
| 3 | 🟥 | Translate meta description per locale | Move `description` into the dictionary and reference via `useTranslations()`. | @you |
| 4 | 🟧 | Keep translation keys scalable | Replace flat `ui` object with `import.meta.glob('./locales/*.json')` loader; one JSON file per locale. | @you |
| 5 | 🟧 | Ensure language switch never 404s | Create helper: if target locale version of current page is missing, fall back to locale root (`/` or `/zh`). | @you |
| 6 | 🟧 | Correctly format dates & numbers | Wrap all date output with `Intl.DateTimeFormat(locale).format(date)`. | @you |
| 7 | 🟩 | Automatic first-visit locale detection | On first request, inspect `Accept-Language` header and redirect accordingly (edge function/server middleware). | @future |
| 8 | 🟩 | Protect against regressions | Add vitest that asserts each file in `/src/pages` has a counterpart in `/src/pages/zh` and vice-versa. | @future |

---

### Milestones & Rough Timeline

1. **Sprint 1 (this week)** – tasks 1-3 (critical SEO/UX).  
2. **Sprint 2 (next)** – tasks 4-6 (scalability + polish).  
3. **Backlog** – tasks 7-8.

---

### References

* Astro i18n docs: https://docs.astro.build/en/guides/internationalization/
* Google Search Central – Multilingual sites: https://developers.google.com/search/docs/specialty/international/localized-versions
* MDN Intl.DateTimeFormat: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat

