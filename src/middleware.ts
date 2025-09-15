// This file is intentionally left blank to disable the middleware.
// The presence of this file can cause issues if not configured correctly.
// We are leaving it empty to resolve routing errors after removing next-intl.
export default function middleware() {}
export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};
