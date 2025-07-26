# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Astro-based personal blog for Jun's posts about Software, AI, Web3, Blockchain, and Fintech. The site uses TypeScript, TailwindCSS v4, and is deployed to https://blackhodl.xyz.

## Development Commands

All commands use Bun as the package manager:

- `bun install` - Install dependencies
- `bun dev` - Start development server at localhost:4321
- `bun build` - Build production site to ./dist/
- `bun preview` - Preview production build locally
- `bun astro check` - Type check the project

Note: The package.json uses npm scripts, but Bun is the preferred runtime for this project.

## Architecture

### Layout System
- **Main Layout** (`src/layouts/Layout.astro`): Base template with metadata, dark mode support, and grid layout (navbar, main, footer)
- **Markdown Layout** (`src/layouts/MarkdownLayout.astro`): Blog post template with frontmatter support, author info, publication date, tags, and image handling

### Content Structure
- **Blog Posts**: Markdown files in `src/pages/posts/` with frontmatter metadata
- **Pages**: `.astro` files in `src/pages/` for static routes
- **Components**: Reusable Astro components in `src/components/`

### Key Features
- Blog post listing with dynamic import (`import.meta.glob("./posts/*.md")`)
- Tag-based categorization system (`src/pages/tags/`)
- Bilingual content support (English/Chinese variants with `src/pages/zh/` structure)
- SEO-optimized with Open Graph metadata
- Dark mode styling with TailwindCSS (flash-free thanks to inline theme script)
- Automatic locale detection via middleware (`src/middleware.ts`)
- Astro i18n configuration with English default and Chinese prefix routing

### Frontmatter Schema
Blog posts require:
```yaml
layout: ../../layouts/MarkdownLayout.astro
title: string
description: string
author: string
pubDate: Date
tags: string[]
image?: { url: string, alt: string }
```

### Styling
- TailwindCSS v4 with Vite integration
- Typography plugin for prose content
- Global styles in `src/styles/global.css`
- Dark mode classes: `dark:bg-gray-800`, `dark:text-gray-100`

### Dark-mode implementation

The `dark` class is applied by `src/components/ThemeScript.astro`. The script is
marked with `is:inline`, ensuring it runs before first paint and prevents a
white flash for dark-theme visitors.

If you change or relocate this script, remember to keep `is:inline`; otherwise
Astro will bundle it as a separate file that executes too late.

## File Organization

- Blog posts go in `src/pages/posts/` as `.md` files
- Chinese variants in `src/pages/zh/posts/` with identical structure
- Static assets in `public/`
- Icons in `src/icons/` (SVG format)
- Components follow naming convention: PascalCase.astro

## Internationalization (i18n)

The site supports English (default) and Chinese locales:

- **Translation System**: `src/utils/i18n.ts` provides `useTranslations()` function
- **Middleware**: `src/middleware.ts` handles automatic redirect to Chinese for zh-preferring browsers
- **URL Structure**: English uses root paths, Chinese uses `/zh/` prefix
- **Content Duplication**: Each page/post needs both English and Chinese versions
- **Astro i18n Config**: Set in `astro.config.mjs` with `prefixDefaultLocale: false`

When creating new content:
1. Create English version in standard location (e.g., `src/pages/posts/`)
2. Create Chinese version in `src/pages/zh/` equivalent path
3. Use `getRelativeLocaleUrl()` for locale-aware internal links
