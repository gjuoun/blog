export const Routes = {
  home: "/",
  blog: "/blog",
  about: "/about",
  tags: "/tags",
  point1BitcoinForLife: "/posts/point1-bitcoin-for-life",
  zh: {
    home: "/zh",
    blog: "/zh/blog",
    about: "/zh/about",
    tags: "/zh/tags",
    point1BitcoinForLife: "/zh/posts/point1-bitcoin-for-life",
  }
} as const;

// Helper to get all routes as a flat object for easy access
export const route = Routes;