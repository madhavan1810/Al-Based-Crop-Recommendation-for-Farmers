
import { LoginForm } from '@/components/features/login-form';
import { AppShell } from '@/components/layout/app-shell';

export default function LoginPage() {
  const t = {
    title: 'Welcome to KrishiFarm.AI',
    description: 'Access your account to get started.'
  };

  return (
    <AppShell>
      <div className="flex min-h-[calc(100vh-3.5rem)] flex-1 flex-col items-center justify-center p-4 md:p-6">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-6 text-center">
            <h1 className="font-headline text-3xl font-bold">
              {t.title}
            </h1>
            <p className="text-muted-foreground">
              {t.description}
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </AppShell>
  );
}
