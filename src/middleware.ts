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
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
};
