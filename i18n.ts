import {getRequestConfig} from 'next-intl/server';
import {locales, defaultLocale} from './src/lib/locales';
 
export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming `locale` parameter is valid.
  if (!locales.includes(locale as any)) {
    // If the locale is invalid, use the default locale.
    return {
      locale: defaultLocale,
      messages: (await import(`./src/messages/${defaultLocale}.json`)).default
    };
  }

  return {
    locale,
    messages: (await import(`./src/messages/${locale}.json`)).default
  };
});
