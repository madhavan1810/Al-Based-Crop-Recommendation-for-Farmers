import createMiddleware from 'next-intl/middleware';
import {locales, defaultLocale} from './lib/locales';
import {pathnames, localePrefix} from './lib/i18n-navigation';
import {NextRequest, NextResponse} from 'next/server';

export default createMiddleware({
  defaultLocale,
  locales,
  pathnames,
  localePrefix,
});

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};