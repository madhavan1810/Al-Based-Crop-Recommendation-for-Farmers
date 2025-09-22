'use client';

import { AppShell } from '@/components/layout/app-shell';
import { FarmOverview } from '@/components/features/farm-overview';

export default function FarmsPage() {
  return (
    <AppShell>
      <div className="flex-1 p-4 md:p-6">
        <div className="mb-6">
          <h1 className="font-headline text-3xl font-bold">My Farms</h1>
          <p className="text-muted-foreground">
            Manage your farms and track their performance.
          </p>
        </div>
        <FarmOverview />
      </div>
    </AppShell>
  );
}