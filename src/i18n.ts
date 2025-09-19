import {getRequestConfig} from 'next-intl/server';
 
export default getRequestConfig(async ({locale}) => {
  // This function is now only responsible for loading messages.
  // The locale validation is handled in the middleware.
  return {
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
