import {createLocalizedPathnamesNavigation} from 'next-intl/navigation';
import {locales} from './i18n';

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
    localePrefix: 'as-needed',
  });
