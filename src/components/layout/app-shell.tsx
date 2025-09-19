
'use client';

import { usePathname } from '@/lib/i18n-navigation';
import {
  LayoutDashboard,
  ScanLine,
  Sprout,
  Sun,
  User,
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
} from '@/components/ui/sidebar';
import { Logo } from './logo';
import Chatbot from '../features/chatbot';
import LanguageSwitcher from './language-switcher';
import { Link } from '@/lib/i18n-navigation';
import { Button } from '../ui/button';

export function AppShell({ children }: { children: React.ReactNode }) {
  const t = useTranslations('AppShell');
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { href: '/crop-recommendation', label: t('cropRecommendation'), icon: Sprout },
    { href: '/disease-detection', label: t('diseaseDetection'), icon: ScanLine },
    { href: '/personalized-advice', label: t('personalizedAdvice'), icon: Sun },
  ];

  const isAuthPage = pathname === '/login' || pathname === '/register';

  // Helper to get the current page's label
  const getCurrentLabel = () => {
    if (pathname === '/login') return t('login');
    if (pathname === '/register') return t('register');
    if (pathname.includes('/profile')) return t('profile');
    const currentItem = navItems.find(item => pathname.startsWith(item.href));
    return currentItem?.label || 'KrishiFarm.AI';
  }

  return (
    <SidebarProvider>
      <Sidebar hidden={isAuthPage}>
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith(item.href)}
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
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
          <div className="flex items-center gap-4">
            <SidebarTrigger className={isAuthPage ? "invisible" : "md:hidden"} />
            <h1 className="font-headline text-lg font-semibold">
              {getCurrentLabel()}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            {!isAuthPage && (
              <Button asChild variant="ghost" size="icon">
                <Link href="/profile">
                  <User />
                  <span className="sr-only">{t('profile')}</span>
                </Link>
              </Button>
            )}
          </div>
        </header>
        <main className="flex-1 bg-background">{children}</main>
        {!isAuthPage && <Chatbot />}
      </SidebarInset>
    </SidebarProvider>
  );
}
