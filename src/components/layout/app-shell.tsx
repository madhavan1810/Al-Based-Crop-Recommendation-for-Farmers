
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  ScanLine,
  Sprout,
  Sun,
} from 'lucide-react';

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


export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: "Dashboard", icon: LayoutDashboard },
    { href: '/crop-recommendation', label: "Crop Recommendation", icon: Sprout },
    { href: '/disease-detection', label: "Disease Detection", icon: ScanLine },
    { href: '/personalized-advice', label: "Personalized Advice", icon: Sun },
  ];

  // Helper to get the current page's label
  const getCurrentLabel = () => {
    const currentItem = navItems.find(item => item.href === pathname);
    return currentItem?.label || "Dashboard";
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
            {/* The LanguageSwitcher was here */}
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
