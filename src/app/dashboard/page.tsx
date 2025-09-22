
'use client';

import Image from 'next/image';
import { ArrowRight, Sprout, ScanLine, UserCheck } from 'lucide-react';
import Link from 'next/link';

import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppShell } from '@/components/layout/app-shell';
import CropPricesCard from '@/components/features/crop-prices-card';
import WeatherCard from '@/components/features/weather-card';
import { FarmOverview } from '@/components/features/farm-overview';
import { RecentSensorReadings } from '@/components/features/recent-sensor-readings';
import { CropStatus } from '@/components/features/crop-status';

export default function Page() {
  const t = {
    title: 'Welcome to KrishiFarm.AI',
    description: 'Your smart partner in modern farming. Powerful AI tools to boost your yield and protect your crops.',
    feature1Title: 'AI Crop Recommendation',
    feature1Description: "Get tailored crop suggestions based on your farm's data.",
    feature2Title: 'Plant Disease Detection',
    feature2Description: 'Quickly identify plant diseases with our offline-first tool.',
    feature3Title: 'Personalized Cultivation Space',
    feature3Description: 'Generate a complete week-by-week plan for your crop.',
    getStarted: 'Get Started'
  };
  const getImage = (id: string) =>
    PlaceHolderImages.find((img) => img.id === id) || PlaceHolderImages[0];

  const heroImage = getImage('dashboard-hero');

  const featureCards = [
    {
      title: t.feature1Title,
      description: t.feature1Description,
      link: '/crop-recommendation',
      icon: <Sprout className="size-8 text-primary" />,
    },
    {
      title: t.feature2Title,
      description: t.feature2Description,
      link: '/disease-detection',
      icon: <ScanLine className="size-8 text-primary" />,
    },
    {
      title: t.feature3Title,
      description: t.feature3Description,
      link: '/personalized-space',
      icon: <UserCheck className="size-8 text-primary" />,
    },
  ];

  return (
    <AppShell>
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="relative overflow-hidden rounded-lg">
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            width={1200}
            height={400}
            className="h-auto w-full object-cover"
            data-ai-hint={heroImage.imageHint}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-6">
            <h1 className="font-headline text-3xl font-bold md:text-5xl">
              {t.title}
            </h1>
            <p className="mt-2 max-w-2xl text-lg text-foreground/80">
              {t.description}
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featureCards.map((feature) => (
            <Card key={feature.title} className="flex flex-col overflow-hidden transition-all hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-medium">
                  {feature.title}
                </CardTitle>
                {feature.icon}
              </CardHeader>
              <CardContent className="flex flex-1 flex-col justify-between pt-2">
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
                <Button asChild className="mt-4 w-fit self-end">
                  <Link href={feature.link}>
                    {t.getStarted} <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FarmOverview />
            <RecentSensorReadings />
            <CropStatus />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <WeatherCard location="Punjab" />
            <CropPricesCard />
        </div>
      </div>
    </AppShell>
  );
}
