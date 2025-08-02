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

### Deployment
The site automatically deploys to GitHub Pages via GitHub Actions on push to main branch. The workflow uses Bun for all operations and deploys to https://blackhodl.xyz.

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
- Tag-based categorization system (`src/pages/tags/`) with dynamic routing via `[tag].astro`
- Projects page with ProjectCard components and color-coded technology tags
- Bilingual content support (English/Chinese variants with `src/pages/zh/` structure)
- SEO-optimized with Open Graph metadata
- Dark mode styling with TailwindCSS (flash-free thanks to inline theme script)
- Color theme toggle with persisted preference (`src/components/ThemeToggle.astro`)
- Language switcher in navbar (`src/components/LangSwitcher.astro`)
- Astro i18n configuration with English default and Chinese prefix routing
- Centralized route management via `src/utils/routes.ts`

### Frontmatter Schema
Blog posts require:
```yaml
layout: ../../layouts/MarkdownLayout.astro
title: string
description: string
author: string
pubDate: Date
tags: string[]
image: { url: string, alt: string }
location?: string
```

The `image` field is required in the MarkdownLayout type definition, and `location` is optional for additional context.

### Styling
- TailwindCSS v4 with Vite integration
- Typography plugin for prose content
- Global styles in `src/styles/global.css`
- Dark mode classes: `dark:bg-gray-800`, `dark:text-gray-100`

### Component Patterns
- **Card Component**: Reusable wrapper with props for `prose` (typography) and `grid` layouts
- **ProjectCard Component**: Specialized card for project showcase with color-coded technology tags
- **BlogPost Component**: Renders blog post previews with metadata and links
- All components use TypeScript interfaces and support `class` prop for custom styling

### Route Management
- Centralized route definitions in `src/utils/routes.ts`
- Supports both English and Chinese route variants
- Exported as `Routes` and `route` for easy access
- Used throughout the application for consistent navigation

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

## Implementation Details

### Blog Post System
- Posts are dynamically loaded using `import.meta.glob("./posts/*.md", { eager: true })`
- Each markdown file is processed to extract frontmatter and URL
- Blog listing page uses Card component with `grid` prop for responsive layout
- Posts use `MarkdownLayout.astro` for consistent styling and metadata

### Tag System
- Dynamic tag pages via `[tag].astro` in both `/tags/` and `/zh/tags/`
- ProjectCard includes color-coded technology tags (TypeScript: blue, JavaScript: yellow, etc.)
- Tag links in blog posts use `getRelativeLocaleUrl()` for locale-aware routing
- Tag index pages show all available tags with post counts

### Date Formatting
- Locale-aware date formatting using Intl.DateTimeFormat
- English: "Written on January 1, 2024" format
- Chinese: "写于 2024年1月1日" format
- Handles both Date objects and string date formats

### TypeScript Configuration
- Extends Astro's strict TypeScript config (`astro/tsconfigs/strict`)
- Includes `.astro/types.d.ts` for Astro component types
- Excludes `dist` directory from compilation

## Internationalization (i18n)

The site supports English (default) and Chinese locales:

- **Translation System**: `src/utils/i18n.ts` provides `useTranslations()` function with fallback to English
- **Translation Data**: static key–value pairs live in `src/locales/translations.ts`
- **Translation Keys**: Follow pattern like `nav.home`, `site.title` for organization
- **URL Structure**: English uses root paths, Chinese uses `/zh/` prefix
- **Content Duplication**: Each page/post needs both English and Chinese versions
- **Astro i18n Config**: Set in `astro.config.mjs` with `prefixDefaultLocale: false`

When creating new content:
1. Create English version in standard location (e.g., `src/pages/posts/`)
2. Create Chinese version in `src/pages/zh/` equivalent path
3. Use `getRelativeLocaleUrl()` for locale-aware internal links
