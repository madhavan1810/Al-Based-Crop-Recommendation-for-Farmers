import createMiddleware from 'next-intl/middleware';
import {locales, localePrefix, pathnames, defaultLocale} from './lib/i18n-navigation';
 
export default createMiddleware({
  defaultLocale,
  locales,
  pathnames,
  localePrefix
});
 
export const config = {
  // Match only internationalized pathnames
  matcher: [
    // Enable a redirect to a matching locale at the root
    '/',

    // Set a cookie to remember the previous locale for
    // all requests that have a locale prefix
    '/(hi|bn|mr|te|ta|gu|ur|kn|or|ml|pa|as|mai|sat|ks|ne|sd|kok|dgo|mni|brx|sa|en)/:path*',

    // Enable redirects that add a locale prefix
    '/((?!_next|.*\\..*|api).*)'
  ]
};
