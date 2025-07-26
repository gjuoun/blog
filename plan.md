# Eliminating the White Flash in Dark Mode  
_A plan for blackhodl.xyz (Astro + Tailwind + Bun)_

## Problem statement
When a visitor who prefers dark mode (or has toggled it) navigates to a new page, the browser momentarily paints a white background before the *dark* styles load and the `html.dark` class is applied.  
This “Flash Of Incorrect Theme” (FOIT/FOLD) hurts perceived performance and feels jarring.

Root causes
1. **Class-based theming** — Tailwind’s `dark` utility is in *class* mode, so dark styles are only active once `html.dark` is present.  
2. **Navigation delay** — Each full-page navigation (server render or astro-client hydration) starts with a fresh document lacking the class.  
3. **CSS / JS load time** — Until the external stylesheet and your theme-initialisation script run, the browser uses its default background (white).

---

## Solution overview
1. **Early class injection** – Add a tiny inline script *before* any external JS that applies `html.classList.add('dark')` if the user’s saved preference or `prefers-color-scheme` requires it.  
2. **Inline fallback background** – Add an inline `<style>` immediately after the script setting `html.dark,body.dark { background:#0d1117; }` (or your chosen colour).  
3. **Advertise colour-scheme** – Include `<meta name="color-scheme" content="dark light">` so browsers can pre-choose dark UI surfaces.  
4. **Remove root transitions** – Avoid `transition-*` on `html, body` to prevent visible flickers when the class toggles.  
5. **(Optional) Server-side hint** – In `src/middleware.ts`, peek at `Accept-CH` / `Sec-CH-Prefers-Color-Scheme` headers (supported in Chromium) to render the initial HTML with the right class, eliminating the flash on the very first request.  
6. **Performance tweaks** – Preload your main stylesheet to shorten the interval before the full theme CSS arrives.

---

## Detailed implementation steps

### 1 · Create `theme.ts` helper (optional)
```ts
// src/utils/theme.ts
export const shouldUseDark = (): boolean =>
  localStorage.theme === 'dark' ||
  (!('theme' in localStorage) &&
   window.matchMedia('(prefers-color-scheme: dark)').matches);
```
You may reuse this both client-side and in tests.

### 2 · Inline bootstrap script
Insert the snippet **as the first child of `<head>`** in `src/layouts/Layout.astro`:

```astro
<head>
  <!-- Theme bootstrap -->
  <script>
    /* Avoid FOIT/FOLD: apply dark class before paint */
    (() => {
      const ls = localStorage;
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (ls.theme === 'dark' || (!('theme' in ls) && prefersDark)) {
        document.documentElement.classList.add('dark');
      }
    })();
  </script>

  <!-- Inline fallback bg so first paint is dark -->
  <style>
    html.dark, body.dark { background: #0d1117; } /* match Tailwind dark bg */
  </style>

  <!-- Tell the UA both schemes exist -->
  <meta name="color-scheme" content="dark light">

  …existing tags…
</head>
```
Why inline? Because inline resources are parsed *before* the external CSS/JS download, guaranteeing the class is present for the first paint.

### 2a · Delete redundant `initTheme()` block in `Navbar.astro`
`Navbar.astro` currently repeats the same “detect and apply theme” logic (lines 91-104 & 118-120). Once the **head bootstrap** is in place this duplication is no longer needed and can actually re-introduce a flicker if it runs after the initial class has been set.

Remove or comment-out these sections:

```astro
<!-- REMOVE duplicated initialisation -->
  function initTheme() { … }
  // Initialize theme immediately
  initTheme();
  …
  // Re-setup when navigating between pages
  document.addEventListener('astro:page-load', () => {
    initTheme();          // ← delete this call too
    setupThemeToggle();
  });
```

### 2b · Keep (or refactor) the toggle logic
The `toggleTheme()` function and its event-wiring (`setupThemeToggle`) stay as-is because they respond to user clicks after hydration. If you prefer, move these two small helpers into `src/utils/theme.ts` so all theme code lives in one place, e.g.:

```ts
// utils/theme.ts
export const toggleTheme = () => { /* …existing code… */ };
export const setupThemeToggle = () => { /* …existing code… */ };
```

Then in `Navbar.astro`:

```astro
---
import { toggleTheme, setupThemeToggle } from "../../utils/theme";
---
<script client:load>
  setupThemeToggle();
</script>
```

Either way, the only responsibility left in `Navbar.astro` is *toggling* the class, not deciding the initial theme.

### 3 · Remove global colour transitions
Search your styles for:
```css
html,body { transition: background-color … }
```
and delete or scope the transition to non-root elements. This prevents a lingering fade after the class toggle.

### 4 · Preload the main stylesheet
In the same layout (below the above tags):
```astro
<link rel="preload"
      as="style"
      href={Astro.resolve('../../styles/global.css')}
      onload="this.rel='stylesheet'">
<noscript><link rel="stylesheet" href={Astro.resolve('../../styles/global.css')}></noscript>
```
Adjust the path to match your build output.

### 5 · Middleware enhancement (optional but nice)
```ts
// src/middleware.ts
import type { MiddlewareHandler } from 'astro';

export const onRequest: MiddlewareHandler = async (context, next) => {
  const res = await next();

  // Only add the class on HTML responses
  if (res.headers.get('Content-Type')?.startsWith('text/html')) {
    const clone = new Response(res.body, res);
    const text = await clone.text();

    const prefers = context.request.headers.get('Sec-CH-Prefers-Color-Scheme');
    const dark = prefers === 'dark';

    return new Response(
      text.replace('<html', `<html${dark ? ' class="dark"' : ''}`),
      clone
    );
  }
  return res;
};
```
Note: Requires `Accept-CH: Prefers-Color-Scheme` header to be sent in earlier responses (Chromium 119+).

### 6 · Testing matrix
| Scenario | Expected result |
| -------- | --------------- |
| Fresh incognito with dark OS pref | No white flash; page loads in dark theme |
| Fresh incognito with light OS pref | Normal light load |
| User toggles to dark, reloads | No flash |
| User toggles to light, reloads | No flash |
| Slow-network throttling | Background remains dark while CSS/JS download |
| JS disabled | Still gets light (or dark if server-side hint added) |

Automated tests (Vitest + @astrojs/test-runner):
```ts
import { expect, test } from 'vitest';
import { shouldUseDark } from '../../src/utils/theme';

test('detects dark via localStorage', () => {
  localStorage.theme = 'dark';
  expect(shouldUseDark()).toBe(true);
});
```

---

## Roll-out checklist
- [ ] Add inline bootstrap script, style, and meta tag.
- [ ] Remove root-level colour transitions.
- [ ] Delete duplicated `initTheme()` logic from `Navbar.astro`.
- [ ] Ensure theme toggle still works after `astro:page-load`.
- [ ] Preload stylesheet (optional optimisation).
- [ ] Validate no Lighthouse “flash of unstyled content” warnings.
- [ ] Cross-browser test (Chrome, Safari, Firefox, Mobile).
- [ ] Commit & push; run `bun build && bun astro check` before merging.

---

## References
- Chrome Docs – Preventing Flash of Unstyled Text/Theme  
  https://developer.chrome.com/docs/css-ui/color-scheme  
- Addy Osmani – “Eliminating Flash of Unstyled Dark Mode”  
  https://addyosmani.com/blog/eliminating-dark-mode-flicker/  
- Tailwind CSS Docs – Dark Mode Strategies  
  https://tailwindcss.com/docs/dark-mode  
- W3C – Prefers-Color-Scheme Media Query  
  https://drafts.csswg.org/mediaqueries-5/#prefers-color-scheme

---

*Last updated: 2025-07-26*