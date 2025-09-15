
'use client';

import { usePathname, useRouter } from '@/navigation';
import { Link } from '@/navigation';
import {
  LayoutDashboard,
  ScanLine,
  Sprout,
  Sun,
  Languages,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
  useSidebar,
} from '@/components/ui/sidebar';
import { Logo } from './logo';
import Chatbot from '../features/chatbot';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useLocale } from 'next-intl';
import { useTransition } from 'react';


function LanguageSwitcher() {
  const t = useTranslations('LanguageSwitcher');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const { state } = useSidebar();


  const onSelectChange = (value: string) => {
    startTransition(() => {
      router.replace(pathname, {locale: value});
    });
  };

  return (
     <div className="flex items-center gap-2 p-2">
      <Languages className="size-8 text-primary" />
       {state === 'expanded' && (
          <Select onValueChange={onSelectChange} defaultValue={locale} disabled={isPending}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t('placeholder')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">{t('english')}</SelectItem>
              <SelectItem value="hi">{t('hindi')}</SelectItem>
            </SelectContent>
          </Select>
       )}
    </div>
  );
}


export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const t = useTranslations('AppShell');

  const navItems = [
    { href: '/', label: t('dashboard'), icon: LayoutDashboard },
    { href: '/crop-recommendation', label: t('cropRecommendation'), icon: Sprout },
    { href: '/disease-detection', label: t('diseaseDetection'), icon: ScanLine },
    { href: '/personalized-advice', label: t('personalizedAdvice'), icon: Sun },
  ];

  // Helper to get the current page's label
  const getCurrentLabel = () => {
    const currentItem = navItems.find(item => item.href === pathname);
    return currentItem?.label || t('dashboard');
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={{
                    children: item.label,
                    className: 'bg-primary text-primary-foreground',
                  }}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
            <LanguageSwitcher />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
          <SidebarTrigger className="md:hidden" />
          <div className="flex-1">
            <h1 className="font-headline text-lg font-semibold">
              {getCurrentLabel()}
            </h1>
          </div>
        </header>
        <main className="flex-1 bg-background">{children}</main>
        <Chatbot />
      </SidebarInset>
    </SidebarProvider>
  );
}
