import createMiddleware from 'next-intl/middleware';
import { locales } from './i18n';

export default createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale: 'en',

  // Don't use a locale prefix in the URL
  localePrefix: 'never',
});

export const config = {
  // Match only internationalized pathnames
  matcher: [
    '/',
    '/(hi|en)/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
