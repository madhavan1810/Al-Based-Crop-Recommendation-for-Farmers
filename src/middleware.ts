import createMiddleware from 'next-intl/middleware';
import {locales, defaultLocale, pathnames, localePrefix} from './lib/i18n-navigation';

export default createMiddleware({
  defaultLocale,
  locales,
  pathnames,
  localePrefix,
});

export const config = {
  // Skip all paths that should not be internationalized
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
