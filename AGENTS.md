# AGENTS Guide
Build/dev: `bun install`, `bun dev`, `bun build`, `bun preview`, `bun astro check`
Single test: `bun test path/to/file.test.ts` (vitest once added)
Lint/format: `npx prettier --write .` (2-space, 100-col, semicolons, single quotes)
Group imports: builtin, external, `@/*`, relative; alphabetize within groups
TypeScript: strict mode, explicit types for public APIs, infer internal
Exports: prefer named; default only for .astro pages/components
Naming: PascalCase components, camelCase helpers, SCREAMING_SNAKE env vars
Error handling: async/await + try/catch, add contextual messages, no silent fails
UI: TailwindCSS v4 utilities, dark-mode classes, `clsx` for conditional styles
Content: follow frontmatter schema in CLAUDE.md (layout/title/desc/author/date/tags/image)
i18n: use `useTranslations()`, build links with `getRelativeLocaleUrl()`, mirror /zh/ paths
File structure: posts in `src/pages/posts`, assets in `public`, icons in `src/icons`
Tests: keep fast & deterministic; use vitest + @astrojs/test-runner when integrated
Commits: one logical change, run `bun astro check` + lint/format before PR
Docs: update README & CLAUDE.md when public APIs change
Performance: avoid blocking I/O in middleware, leverage Astro streaming
Security: validate user input; never trust frontmatter blindly
No Cursor or Copilot rules found – this doc is authoritative
Always run `bun build && bun astro check` before pushing to keep main green
