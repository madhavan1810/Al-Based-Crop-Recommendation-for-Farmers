import {unstable_setRequestLocale} from 'next-intl/server';
import { ReactNode } from 'react';
import { locales } from '../../i18n';

type Props = {
  children: ReactNode;
  params: {locale: string};
};

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export default function LocaleLayout({children, params: {locale}}: Props) {
  // Enable static rendering
  unstable_setRequestLocale(locale);

  return <>{children}</>;
}
