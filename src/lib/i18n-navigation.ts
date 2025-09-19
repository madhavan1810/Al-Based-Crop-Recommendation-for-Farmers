import {
  createLocalizedPathnamesNavigation,
  Pathnames,
} from 'next-intl/navigation';
import {locales as allLocales} from './locales';

export const locales = allLocales;
export const defaultLocale = 'en';
export const localePrefix = 'as-needed';

// The `pathnames` object holds pairs of internal
// and external paths, separated by locale.
export const pathnames: Pathnames<typeof locales> = {
  // If all locales use the same pathname, a single
  // external path can be used for all locales.
  '/': '/',
  '/login': '/login',
  '/register': '/register',
  '/dashboard': '/dashboard',
  '/crop-recommendation': '/crop-recommendation',
  '/disease-detection': '/disease-detection',
  '/personalized-space': '/personalized-space',
  '/profile': '/profile',
};

export const {Link, redirect, usePathname, useRouter, getPathname} =
  createLocalizedPathnamesNavigation({locales, localePrefix, pathnames});
