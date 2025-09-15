import createMiddleware from 'next-intl/middleware';
import { locales, localePrefix } from './navigation';

export default createMiddleware({
  defaultLocale: 'en',
  locales,
  localePrefix,
});

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(hi|en)/:path*'],
};
