import { defineMiddleware } from "astro:middleware";
import { getRelativeLocaleUrl } from "astro:i18n";

export const onRequest = defineMiddleware((context, next) => {
  // Only redirect on the home page to avoid infinite redirects
  if (context.url.pathname === "/") {
    const preferredLocale = context.preferredLocale;
    
    // If browser prefers Chinese and it's not already the Chinese version
    if (preferredLocale === "zh") {
      const zhUrl = getRelativeLocaleUrl("zh", "/");
      return context.redirect(zhUrl);
    }
  }
  
  return next();
});