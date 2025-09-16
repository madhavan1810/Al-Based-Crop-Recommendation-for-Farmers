
import { AppShell } from '@/components/layout/app-shell';
import { useTranslations } from 'next-intl';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function ProfilePage() {
  const t = useTranslations('ProfilePage');

  // Mock user data
  const user = {
    name: 'Bharat Kumar',
    email: 'bharat@example.com',
    location: 'Punjab, India',
    avatarUrl: 'https://picsum.photos/seed/user-avatar/200/200',
  };

  // Mock soil health records
  const soilRecords = [
    {
      year: 2024,
      n: '120',
      p: '55',
      k: '45',
      ph: 6.8,
      status: 'Active',
    },
    {
      year: 2023,
      n: '110',
      p: '50',
      k: '48',
      ph: 6.5,
      status: 'Archived',
    },
    {
      year: 2022,
      n: '115',
      p: '48',
      k: '50',
      ph: 6.7,
      status: 'Archived',
    },
  ];

  return (
    <AppShell>
      <div className="flex-1 space-y-6 p-4 md:p-6">
        <div className="mb-6">
          <h1 className="font-headline text-3xl font-bold">{t('title')}</h1>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-1">
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
                <p className="text-sm font-medium text-muted-foreground">
                  {t('email')}
                </p>
                <p>{user.email}</p>
              </div>
              <div className="grid gap-1">
                <p className="text-sm font-medium text-muted-foreground">
                  {t('location')}
                </p>
                <p>{user.location}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{t('soilHealthTitle')}</CardTitle>
                <CardDescription>{t('soilHealthDescription')}</CardDescription>
              </div>
              <Button>
                <Upload className="mr-2" />
                {t('uploadReportButton')}
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('reportYear')}</TableHead>
                    <TableHead>N (kg/ha)</TableHead>
                    <TableHead>P (kg/ha)</TableHead>
                    <TableHead>K (kg/ha)</TableHead>
                    <TableHead>pH</TableHead>
                    <TableHead className="text-right">{t('status')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {soilRecords.map((record) => (
                    <TableRow key={record.year}>
                      <TableCell className="font-medium">
                        {record.year}
                      </TableCell>
                      <TableCell>{record.n}</TableCell>
                      <TableCell>{record.p}</TableCell>
                      <TableCell>{record.k}</TableCell>
                      <TableCell>{record.ph}</TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant={
                            record.status === 'Active' ? 'default' : 'outline'
                          }
                        >
                          {record.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
