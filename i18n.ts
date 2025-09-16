import {getRequestConfig} from 'next-intl/server';
import {allLocales} from './src/lib/languages';
 
export const defaultLocale = 'en';
export const locales = allLocales.map(l => l.code);

export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale)) {
    // Optionally, you could redirect to a default locale
    // or show a 404 page. For now, we'll just log an error.
    console.error(`Invalid locale: ${locale}`);
  }

  return {
    messages: (await import(`./src/messages/${locale}.json`)).default
  };
});
