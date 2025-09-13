import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Leaf, ScanLine, Sprout, Sun } from 'lucide-react';

import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SeedPricesCard from '@/components/features/seed-prices-card';
import CropPricesCard from '@/components/features/crop-prices-card';

export default function DashboardPage() {
  const getImage = (id: string) =>
    PlaceHolderImages.find((img) => img.id === id) || PlaceHolderImages[0];

  const heroImage = getImage('dashboard-hero');

  const featureCards = [
    {
      title: 'AI Crop Recommendation',
      description: 'Get tailored crop suggestions based on your farm\'s data.',
      link: '/crop-recommendation',
      icon: <Sprout className="size-8 text-primary" />,
      image: getImage('crop-recommendation-card'),
    },
    {
      title: 'Plant Disease Detection',
      description: 'Quickly identify plant diseases with our offline-first tool.',
      link: '/disease-detection',
      icon: <ScanLine className="size-8 text-primary" />,
      image: getImage('disease-detection-card'),
    },
    {
      title: 'Personalized Farming Advice',
      description: 'Receive daily advice optimized for your crops and weather.',
      link: '/personalized-advice',
      icon: <Sun className="size-8 text-primary" />,
      image: getImage('personalized-advice-card'),
    },
  ];

  return (
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
            Welcome to FarmBharat.AI
          </h1>
          <p className="mt-2 max-w-2xl text-lg text-foreground/80">
            Your smart partner in modern farming. Powerful AI tools to boost your yield and protect your crops.
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
                  Get Started <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <SeedPricesCard />
        <CropPricesCard />
      </div>
    </div>
  );
}
