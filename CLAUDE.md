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
- Bilingual content support (English/Chinese variants)
- SEO-optimized with Open Graph metadata
- Dark mode styling with TailwindCSS

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

## File Organization

- Blog posts go in `src/pages/posts/` as `.md` files
- Static assets in `public/`
- Icons in `src/icons/` (SVG format)
- Components follow naming convention: PascalCase.astro