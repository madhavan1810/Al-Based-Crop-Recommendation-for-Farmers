import {getRequestConfig} from 'next-intl/server';
import {allLocales} from './src/lib/languages';
 
export const defaultLocale = 'en';
export const locales = allLocales.map(l => l.code);

export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale)) {
    console.error(`Invalid locale: ${locale}, falling back to ${defaultLocale}`);
    locale = defaultLocale;
  }

  return {
    messages: (await import(`./src/messages/${locale}.json`)).default
  };
});
