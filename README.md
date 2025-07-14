# Jun's Blog

Personal blog built with Astro, featuring posts about Software, AI, Web3, Blockchain, and Fintech. Deployed at [blackhodl.xyz](https://blackhodl.xyz).

## Features

- **Bilingual Support**: English and Chinese content
- **Dark Mode**: TailwindCSS v4 with dark theme
- **Tag System**: Categorized blog posts
- **SEO Optimized**: Open Graph metadata
- **Responsive Design**: Mobile-friendly layout

## Development

```bash
bun install    # Install dependencies
bun dev        # Start dev server (localhost:4321)
bun build      # Build for production
bun preview    # Preview production build
bun astro check # Type checking
```

## Content

Blog posts are Markdown files in `src/pages/posts/` with frontmatter:

```yaml
layout: ../../layouts/MarkdownLayout.astro
title: "Post Title"
description: "Post description"
author: "Jun"
pubDate: 2024-01-01
tags: ["software", "ai"]
image: { url: "/image.jpg", alt: "Alt text" }
```

## Tech Stack

- **Framework**: Astro
- **Styling**: TailwindCSS v4
- **Runtime**: Bun
- **Language**: TypeScript