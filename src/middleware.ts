import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale, allLocales } from './lib/locales';
import { pathnames, localePrefix } from './lib/i18n-navigation';
import { NextRequest, NextResponse } from 'next/server';

const handleI18nRouting = createMiddleware({
  defaultLocale,
  locales,
  pathnames,
  localePrefix,
});

export default function middleware(request: NextRequest) {
  // Check if there is any supported locale in the pathname
  const pathname = request.nextUrl.pathname;

  if (pathname === '/') {
    // Redirect root to the default locale's dashboard
    const url = new URL(`/${defaultLocale}/login`, request.url);
    return NextResponse.redirect(url);
  }

  const pathnameIsMissingLocale = allLocales.every(
    (lang) => !pathname.startsWith(`/${lang.code}/`) && pathname !== `/${lang.code}`
  );

  // If the path is missing a locale, and it's not a special Next.js path,
  // redirect to the default locale.
  if (pathnameIsMissingLocale && !pathname.startsWith('/_next')) {
     const url = new URL(`/${defaultLocale}${pathname}`, request.url);
     return NextResponse.redirect(url);
  }

  // Otherwise, let the next-intl middleware handle it.
  return handleI18nRouting(request);
}

export const config = {
  // Match all paths except for static files and the API folder.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
