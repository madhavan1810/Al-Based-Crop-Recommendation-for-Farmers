import {getRequestConfig} from 'next-intl/server';
 
export default getRequestConfig(async ({locale}) => {
  // This can be downloaded from a CMS.
  return {
    messages: (await import(`../messages/${locale}.json`)).default
  };
});