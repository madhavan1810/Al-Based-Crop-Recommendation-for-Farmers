import createMiddleware from 'next-intl/middleware';
import {locales, defaultLocale} from './lib/locales';
import {pathnames, localePrefix} from './lib/i18n-navigation';

export default createMiddleware({
  defaultLocale,
  locales,
  pathnames,
  localePrefix,
});
 
export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(hi|en|bn|mr|te|ta|gu|ur|kn|or|ml|pa|as|mai|sat|ks|ne|sd|kok|dgo|mni|brx|sa)/:path*']
};