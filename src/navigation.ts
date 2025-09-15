import {createLocalizedPathnamesNavigation} from 'next-intl/navigation';
import {locales as allLocales} from './i18n';

export const locales = allLocales;
export const localePrefix = 'always'; // Or 'as-needed'

// The `pathnames` object holds pairs of internal
// and external paths, separated by locale.
export const pathnames = {
  '/': '/',
  '/crop-recommendation': '/crop-recommendation',
  '/disease-detection': '/disease-detection',
  '/personalized-advice': '/personalized-advice',
};

export const {Link, redirect, usePathname, useRouter} =
  createLocalizedPathnamesNavigation({
    locales,
    pathnames,
    localePrefix,
  });
