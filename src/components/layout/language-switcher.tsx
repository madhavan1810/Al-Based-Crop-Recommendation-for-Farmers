'use client';

import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Globe } from 'lucide-react';
import { languages } from '@/i18n';
import { usePathname } from '@/navigation';

export default function LanguageSwitcher() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const locale = useLocale();
  const pathname = usePathname();

  function onSelectChange(value: string) {
    startTransition(() => {
      router.replace(pathname, {locale: value});
    });
  }

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-5 w-5 text-muted-foreground" />
      <Select
        defaultValue={locale}
        onValueChange={onSelectChange}
        disabled={isPending}
      >
        <SelectTrigger className="w-auto border-none bg-transparent shadow-none focus:ring-0">
          <SelectValue placeholder="Language" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(languages).map(([langCode, langName]) => (
            <SelectItem key={langCode} value={langCode}>
              {langName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
