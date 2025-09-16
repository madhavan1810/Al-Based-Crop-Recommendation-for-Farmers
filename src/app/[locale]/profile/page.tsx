
import { AppShell } from '@/components/layout/app-shell';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';

export default function ProfilePage() {
  const t = useTranslations('ProfilePage');

  // Mock user data
  const user = {
    name: 'Bharat Kumar',
    email: 'bharat@example.com',
    location: 'Punjab, India',
    avatarUrl: 'https://picsum.photos/seed/user-avatar/200/200',
  };

  return (
    <AppShell>
      <div className="flex-1 p-4 md:p-6">
        <div className="mb-6">
          <h1 className="font-headline text-3xl font-bold">{t('title')}</h1>
        </div>
        <Card className="mx-auto max-w-lg">
          <CardHeader>
            <div className="flex flex-col items-center gap-4 text-center">
              <Avatar className="h-24 w-24 border-2 border-primary">
                <AvatarImage src={user.avatarUrl} alt={user.name} />
                <AvatarFallback>
                  <User className="h-12 w-12" />
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-2xl">{user.name}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-1">
              <p className="text-sm font-medium text-muted-foreground">{t('email')}</p>
              <p>{user.email}</p>
            </div>
            <div className="grid gap-1">
              <p className="text-sm font-medium text-muted-foreground">{t('location')}</p>
              <p>{user.location}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
