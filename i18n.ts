import {getRequestConfig} from 'next-intl/server';
 
export const allLocales = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi' },
  { code: 'bn', name: 'Bengali' },
  { code: 'mr', name: 'Marathi' },
  { code: 'te', name: 'Telugu' },
  { code: 'ta', name: 'Tamil' },
  { code: 'gu', name: 'Gujarati' },
  { code: 'ur', name: 'Urdu' },
  { code: 'kn', name: 'Kannada' },
  { code: 'or', name: 'Odia' },
  { code: 'ml', name: 'Malayalam' },
  { code: 'pa', name: 'Punjabi' },
  { code: 'as', name: 'Assamese' },
  { code: 'mai', name: 'Maithili' },
  { code: 'sat', name: 'Santali' },
  { code: 'ks', name: 'Kashmiri' },
  { code: 'ne', name: 'Nepali' },
  { code: 'sd', name: 'Sindhi' },
  { code: 'kok', name: 'Konkani' },
  { code: 'dgo', name: 'Dogri' },
  { code: 'mni', name: 'Manipuri (Meitei)' },
  { code: 'brx', name: 'Bodo' },
  { code: 'sa', name: 'Sanskrit' },
];
 
export const defaultLocale = 'en';
export const locales = allLocales.map(l => l.code);

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
