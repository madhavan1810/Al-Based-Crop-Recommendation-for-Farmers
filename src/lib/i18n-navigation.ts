import {
  createLocalizedPathnamesNavigation,
  Pathnames,
} from 'next-intl/navigation';
import { locales } from '@/lib/locales';

export const localePrefix = 'always'; // Default

export const pathnames = {
  '/': '/',
  '/login': '/login',
  '/register': '/register',
  '/dashboard': '/dashboard',
  '/crop-recommendation': '/crop-recommendation',
  '/disease-detection': '/disease-detection',
  '/personalized-space': '/personalized-space',
  '/profile': '/profile',
} satisfies Pathnames<typeof locales>;

export const { Link, redirect, usePathname, useRouter } =
  createLocalizedPathnamesNavigation({ locales, localePrefix, pathnames });
