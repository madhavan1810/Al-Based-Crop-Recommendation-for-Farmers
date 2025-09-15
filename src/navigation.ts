import {
  createLocalizedPathnamesNavigation,
  Pathnames
} from 'next-intl/navigation';
import {locales as allLocales} from './i18n';

export const locales = allLocales;
export const localePrefix = 'as-needed';

// The `pathnames` object holds pairs of internal
// and external paths, separated by locale.
export const pathnames = {
  // If all locales use the same pathname, a single
  // external path can be used for all locales.
  '/': '/',
  '/crop-recommendation': '/crop-recommendation',
  '/disease-detection': '/disease-detection',
  '/personalized-advice': '/personalized-advice',

} satisfies Pathnames<typeof locales>;

export const {Link, redirect, usePathname, useRouter, getPathname} =
  createLocalizedPathnamesNavigation({locales, localePrefix, pathnames});
