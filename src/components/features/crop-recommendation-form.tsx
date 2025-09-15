
'use client';

import { useState, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  BrainCircuit,
  Leaf,
  LoaderCircle,
  ShieldAlert,
  Thermometer,
} from 'lucide-react';

import { getCropRecommendations, type CropRecommendationOutput } from '@/ai/flows/crop-recommendations';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';
import { SpeakButton } from './speak-button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { indianDistricts } from '@/lib/indian-districts';
import { useTranslations } from 'next-intl';

const formSchema = z.object({
  soilAnalysis: z
    .string()
    .min(10, { message: 'Please provide detailed soil analysis.' }),
  weatherData: z
    .string()
    .min(10, { message: 'Please provide detailed weather data.' }),
  district: z.string().min(1, { message: 'Please select a district.' }),
  season: z.string().min(1, { message: 'Please select a season.' }),
});

type FormData = z.infer<typeof formSchema>;

export default function CropRecommendationForm() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<CropRecommendationOutput | null>(null);
  const { toast } = useToast();
  const t = useTranslations('CropRecommendationPage.form');

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      soilAnalysis: '',
      weatherData: '',
      district: '',
      season: '',
    },
  });

  const onSubmit = (data: FormData) => {
    startTransition(async () => {
      setResult(null);
      const res = await getCropRecommendations(data);
      if (res) {
        setResult(res);
      } else {
        toast({
          variant: 'destructive',
          title: t('error.title'),
          description: t('error.description'),
        });
      }
    });
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>{t('title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="district"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('district.label')}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('district.placeholder')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {indianDistricts.map(d => <SelectItem key={d} value={d.split(',')[0]}>{d}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="season"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('season.label')}</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('season.placeholder')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Kharif">{t('season.options.kharif')}</SelectItem>
                          <SelectItem value="Rabi">{t('season.options.rabi')}</SelectItem>
                          <SelectItem value="Summer">{t('season.options.summer')}</SelectItem>
                          <SelectItem value="Whole Year">{t('season.options.wholeYear')}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="soilAnalysis"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('soilAnalysis.label')}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t('soilAnalysis.placeholder')}
                        {...field}
                        rows={4}
                      />
                    </FormControl>
                    <FormDescription>
                      {t('soilAnalysis.description')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="weatherData"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('weatherData.label')}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t('weatherData.placeholder')}
                        {...field}
                        rows={4}
                      />
                    </FormControl>
                    <FormDescription>
                      {t('weatherData.description')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? (
                  <>
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    {t('submit.loading')}
                  </>
                ) : (
                  <>
                    <BrainCircuit className="mr-2 h-4 w-4" />
                    {t('submit.idle')}
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <div className="space-y-4">
        <h2 className="font-headline text-2xl font-bold">{t('results.title')}</h2>
        {isPending && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-center">
                <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-4 text-muted-foreground">{t('results.loading')}</p>
              </div>
            </CardContent>
          </Card>
        )}
        {result && (
          <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg font-semibold">
                <Leaf className="mr-2 size-5 text-green-600" />{t('results.recommendedCrops')}
              </AccordionTrigger>
              <AccordionContent className="prose prose-sm max-w-none p-2 text-foreground">
                <div className="flex items-start gap-2">
                  <p className="flex-1">{result.recommendedCrops}</p>
                  <SpeakButton textToSpeak={result.recommendedCrops} />
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-lg font-semibold">
                <Thermometer className="mr-2 size-5 text-red-500" />{t('results.plantingInstructions')}
              </AccordionTrigger>
              <AccordionContent className="prose prose-sm max-w-none p-2 text-foreground">
                <div className="flex items-start gap-2">
                  <p className="flex-1">{result.plantingInstructions}</p>
                  <SpeakButton textToSpeak={result.plantingInstructions} />
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-lg font-semibold">
                <ShieldAlert className="mr-2 size-5 text-yellow-600" />{t('results.riskAssessment')}
              </AccordionTrigger>
              <AccordionContent className="prose prose-sm max-w-none p-2 text-foreground">
                <div className="flex items-start gap-2">
                  <p className="flex-1">{result.riskAssessment}</p>
                  <SpeakButton textToSpeak={result.riskAssessment} />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
        {!isPending && !result && (
            <Card className="flex h-64 items-center justify-center">
              <CardContent className="p-6 text-center text-muted-foreground">
                <BrainCircuit className="mx-auto h-12 w-12" />
                <p className="mt-4">{t('results.placeholder')}</p>
              </CardContent>
            </Card>
        )}
      </div>
    </div>
  );
}
