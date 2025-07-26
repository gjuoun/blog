# Internationalization (i18n) Improvement Roadmap

This living document tracks the work required to bring the multilingual experience of the site from *minimum-viable* to *production-grade*.  Every task is small enough to fit into a single pull-request and contains clear **acceptance criteria** so that reviewers instantly know when a ticket is done.

If you see something missing – add it!  Treat this file as the single source of truth for our i18n backlog.

## Legend

| Priority | Meaning |
| -------- | ------- |
| 🟥 High  | SEO or UX is *actively broken* – must be picked up in the very next sprint. |
| 🟧 Med   | Noticeable improvement for users or developers – schedule once all 🟥 items are closed. |
| 🟩 Low   | Forward-looking polish / refactor opportunities – add only when capacity allows. |

---

## Task Board

Tick the check-box once a PR that closes the task is merged into `main`.

| Done | # | Priority | Goal | Acceptance Criteria | Owner |
|------|---|----------|------|--------------------|-------|
| [ ] | 1 | 🟥 | Make search engines aware of language variants | Every HTML page includes one `<link rel="alternate" hreflang>` tag **per available locale**.  Validation: run `pnpm run build` and inspect the generated HTML for at least two random pages. | @you |
| [ ] | 2 | 🟥 | Avoid duplicate-content penalty | Each page contains a locale-specific `<link rel="canonical">`.  The canonical URL must exactly match the current language version (no cross-locale links). | @you |
| [ ] | 3 | 🟥 | Localised meta descriptions | `description` meta tag is read from the translation files.  Audit: Lighthouse no longer reports “Missing or non-descriptive <meta description>” for either locale. | @you |
| [ ] | 4 | 🟧 | Scalable translation storage | Introduce dynamic loader `import.meta.glob('./locales/**/*.json')` so every locale has its own JSON.  Adding a new language should not require touching TypeScript files. | @you |
| [ ] | 5 | 🟧 | Robust language switch | Clicking the language toggle never yields a 404.  If a page is not translated we gracefully fallback to the locale home (`/`, `/zh`, …). | @you |
| [ ] | 6 | 🟧 | Locale-aware dates & numbers | All hard-coded `toLocaleDateString` / manual formatting removed.  Use `Intl.DateTimeFormat` and `Intl.NumberFormat` with the current locale. | @you |
| [ ] | 7 | 🟩 | First-visit language detection | First-time visitors are redirected according to the `Accept-Language` header.  Existing users keep their explicit locale preference (stored in cookie). | @future |
| [ ] | 8 | 🟩 | Regression guard for missing translations | Vitest fails when a page exists only in one locale directory (`/src/pages` vs `/src/pages/zh`). | @future |

---

### Milestones & Rough Timeline

1. **Sprint 1 (current week)** — tackle tasks **1–3** (critical SEO & UX).  
2. **Sprint 2 (next week)** — focus on tasks **4–6** (developer experience & polish).  
3. **Backlog** — tasks **7–8** (nice-to-have / safeguard).

> Time estimates: each 🟥 task ≈ 1–2h, each 🟧 task ≈ 4h, 🟩 tasks are research-heavy and may expand.

---

### Definition of Done

For every item a PR must:

1. Satisfy the **acceptance criteria** above.
2. Include unit or integration tests when feasible.
3. Pass `bun astro check` and the pre-commit hooks.
4. Update this document (tick the box, add notes / follow-ups).

---

### Risk & Mitigation

* **SEO regressions** – run Google Lighthouse on each deployment preview and watch Search Console.
* **Broken links** – keep the vitest translation parity guard enabled once task 8 is shipped.
* **Untranslated UI** – PR reviewers must check the UI at `/` and `/zh` before approving.

---

### References

* Astro i18n docs: https://docs.astro.build/en/guides/internationalization/
* Google Search Central – Multilingual sites: https://developers.google.com/search/docs/specialty/international/localized-versions
* MDN Intl.DateTimeFormat: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
