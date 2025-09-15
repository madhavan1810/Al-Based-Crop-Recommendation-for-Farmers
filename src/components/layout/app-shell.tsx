
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  ScanLine,
  Sprout,
  Sun,
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


export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const t = useTranslations('AppShell');

  const navItems = [
    { href: '/', label: t('nav.dashboard'), icon: LayoutDashboard },
    { href: '/crop-recommendation', label: t('nav.cropRecommendation'), icon: Sprout },
    { href: '/disease-detection', label: t('nav.diseaseDetection'), icon: ScanLine },
    { href: '/personalized-advice', label: t('nav.personalizedAdvice'), icon: Sun },
  ];

  // Helper to get the current page's label
  const getCurrentLabel = () => {
    // We remove the locale from the pathname for comparison
    const currentPath = pathname.replace(/^\/[a-z]{2}\/?/, '/');
    const currentItem = navItems.find(item => {
      if (item.href === '/') return currentPath === '/';
      return currentPath.startsWith(item.href);
    });
    return currentItem?.label || t('nav.dashboard');
  }

  const isCurrentPage = (href: string) => {
    const currentPath = pathname.replace(/^\/[a-z]{2}\/?/, '/');
    if (href === '/') return currentPath === '/';
    return currentPath.startsWith(href);
  };

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
                  isActive={isCurrentPage(item.href)}
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
            <SidebarTrigger className="md:hidden" />
            <h1 className="font-headline text-lg font-semibold">
              {getCurrentLabel()}
            </h1>
          </div>
          <LanguageSwitcher />
        </header>
        <main className="flex-1 bg-background">{children}</main>
        <Chatbot />
      </SidebarInset>
    </SidebarProvider>
  );
}
