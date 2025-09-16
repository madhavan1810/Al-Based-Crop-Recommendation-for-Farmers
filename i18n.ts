import {getRequestConfig} from 'next-intl/server';
import {locales} from 'src/lib/languages';
 
export const defaultLocale = 'en';

export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
    // Optionally, you could redirect to a default locale
    // or show a 404 page. For now, we'll just log an error.
    console.error(`Invalid locale: ${locale}`);
  }

  return {
    messages: (await import(`./src/messages/${locale}.json`)).default
  };
});
