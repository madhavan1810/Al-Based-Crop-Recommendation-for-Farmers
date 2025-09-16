'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useTransition } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { allLocales } from '@/i18n';

export default function LanguageSwitcher() {
  const t = useTranslations('LanguageSwitcher');
  const [isPending, startTransition] = useTransition();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function onSelectChange(value: string) {
    const newPath = pathname.replace(`/${locale}`, `/${value}`);
    document.cookie = `NEXT_LOCALE=${value};path=/;max-age=31536000`;
    startTransition(() => {
      router.replace(newPath);
    });
  }

  return (
    <Select defaultValue={locale} onValueChange={onSelectChange} disabled={isPending}>
      <SelectTrigger className="w-fit">
        <SelectValue placeholder={t('selectLanguage')} />
      </SelectTrigger>
      <SelectContent>
        {allLocales.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>{lang.name}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
