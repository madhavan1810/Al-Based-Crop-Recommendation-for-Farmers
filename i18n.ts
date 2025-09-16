import {getRequestConfig} from 'next-intl/server';
import {locales, defaultLocale} from './src/lib/locales';
 
export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
    console.error(`Invalid locale: ${locale}, falling back to ${defaultLocale}`);
    locale = defaultLocale;
  }

  return {
    messages: (await import(`./src/messages/${locale}.json`)).default
  };
});
