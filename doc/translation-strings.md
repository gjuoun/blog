# Scaling Translation Strings

This document outlines a practical roadmap for growing from a handful of UI strings to **thousands** while keeping performance, maintainability and localisation quality high.

## 1. Information Architecture

### 1 a. Namespace your strings  
Split each locale into multiple JSON files organised by feature or page.

```
locales/
  en/
    common.json
    nav.json
    blog.json
    post.json
  zh/
    common.json
    nav.json
    blog.json
    post.json
```

* `common.json` → truly global labels (site-title, footer, 404, …).
* Page/feature files keep keys short because the file path already scopes them.

### 1 b. Shared phrases
Store frequently reused phrases (e.g. "Read more", "Back to home") in `common.json` to avoid duplication.

---

## 2. Loading Strategy

### 2 a. Code-split by namespace

```ts
// utils/i18n.ts
export const loadNamespace = async (locale: string, ns: string) =>
  (await import(`../locales/${locale}/${ns}.json`)).default;
```

* Navbar imports only `nav.json`.
* Blog listing imports `blog.json`.
* Keeps bundles ultra-light; unused namespaces are never shipped.

### 2 b. Pre-load critical namespaces
Use `import.meta.globEager` during build for must-have namespaces and lazy-load the rest.

---

## 3. Runtime Helpers

```ts
// utils/i18n.ts (continued)
const cache: Record<string, Record<string, string>> = {};

export async function t(locale: string, ns: string, key: string) {
  cache[locale] ??= {};
  cache[locale][ns] ??= await loadNamespace(locale, ns);
  return (
    cache[locale][ns][key] ?? // 1️⃣ locale specific
    cache.en?.[ns]?.[key] ??  // 2️⃣ fall back to English
    key                        // 3️⃣ show key when missing (dev)
  );
}
```

* In **dev** mode, log a warning when a key is missing.
* Optionally send missing-key events to Sentry to spot gaps in production.

---

## 4. Type-Safety & Linting

1. Validate every JSON file at build time with Zod or a custom schema.
2. Add a Vitest that compares key sets between `en/*` and `zh/*` to ensure parity.

---

## 5. Pluralisation & Formatting

* Store ICU MessageFormat strings inside JSON values:

  ```json
  {
    "comments": "{count, plural, one {1 comment} other {{count} comments}}"
  }
  ```

* At runtime, run values through `IntlMessageFormat` (adds ~3 KB gzip) for grammatical plural, gender, select, etc.

---

## 6. Collaboration Workflow

### 6 a. External Translation Management System (TMS)
When strings exceed a few hundred, consider Crowdin, Lokalise, Phrase, etc. Their GitHub integrations:

* Devs push keys ➜ TMS.
* Translators fill them in via web UI.
* TMS opens a PR with updated JSON.

### 6 b. Extraction tooling
Use **i18next-scanner**, **babel-plugin-react-intl** or a custom AST script to auto-extract keys from code into the master JSON so nothing is forgotten.

---

## 7. Performance Guard-Rails

* Keep each namespace under **5–10 KB** gzip.
* Use built-in `Intl` APIs for dates/numbers to avoid extra libraries.
* Consider `<link rel="prefetch">` for the user’s secondary locale if a language switch is likely.

---

## 8. Continuous Integration Checklist

☑  JSON lint (no trailing commas, duplicate keys).  
☑  Unit tests for missing keys & malformed ICU strings.  
☑  Lighthouse run on `/` and `/zh/` to track bundle size + SEO.  
☑  Fail the build on any validation error.

---

## Incremental Adoption Plan

1. **Phase 1 (now)** – start namespacing + code-splitting (no behavioural change).  
2. **Phase 2** – add plural/format support and missing-key warnings.  
3. **Phase 3** – integrate a TMS once translators join or key count > 500.  
4. **Phase 4** – wire up CI validation to prevent regressions.

---

### References

* Astro i18n guide – <https://docs.astro.build/en/guides/internationalization/>
* ICU MessageFormat – <https://unicode-org.github.io/icu/userguide/format_parse/messages/>
* Crowdin for Open-Source – <https://support.crowdin.com/github-integration/>

