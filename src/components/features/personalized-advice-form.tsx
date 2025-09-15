'use client';

import { useState, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { BrainCircuit, LoaderCircle, MessageSquare } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { getPersonalizedFarmingAdvice, type PersonalizedFarmingAdviceOutput } from '@/ai/flows/personalized-farming-advice';
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { SpeakButton } from './speak-button';

const formSchema = z.object({
  location: z.string().min(2, { message: 'Please provide a valid location.' }),
  soilAnalysis: z.string().min(10, { message: 'Please provide detailed soil analysis.' }),
  crop: z.string().min(2, { message: 'Please specify the crop.' }),
});

type FormData = z.infer<typeof formSchema>;

export default function PersonalizedAdviceForm() {
  const t = useTranslations('PersonalizedAdviceForm');
  const tErrors = useTranslations('ToastErrors');
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<PersonalizedFarmingAdviceOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: '',
      soilAnalysis: '',
      crop: '',
    },
  });

  const onSubmit = (data: FormData) => {
    startTransition(async () => {
      setResult(null);
      try {
        const res = await getPersonalizedFarmingAdvice(data);
        if (res) {
          setResult(res);
        } else {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: tErrors('personalizedAdviceError'),
          });
        }
      } catch (error) {
        console.error(error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: tErrors('personalizedAdviceWeatherError'),
        });
      }
    });
  };

  return (
    <div className="grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>{t('formTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('location')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('locationPlaceholder')} {...field} />
                    </FormControl>
                    <FormDescription>
                      {t('locationDescription')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="crop"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('currentCrop')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('cropPlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="soilAnalysis"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('soilAnalysis')}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t('soilPlaceholder')}
                        {...field}
                        rows={4}
                      />
                    </FormControl>
                    <FormDescription>
                      {t('soilDescription')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? (
                  <>
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    {t('generatingAdvice')}
                  </>
                ) : (
                  <>
                    <BrainCircuit className="mr-2 h-4 w-4" />
                    {t('getAdvice')}
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>{t('adviceTitle')}</CardTitle>
          <CardDescription>
            {t('adviceDescription')}
          </CardDescription>
        </Header>
        <CardContent className="flex flex-1 items-center justify-center">
          {isPending && (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
              <span>{t('analyzingWeather')}</span>
            </div>
          )}
          {result && (
            <div className="relative w-full">
              <p className="text-foreground">{result.advice}</p>
              <div className="absolute -right-2 -top-2">
                <SpeakButton textToSpeak={result.advice} />
              </div>
            </div>
          )}
          {!isPending && !result && (
            <div className="text-center text-muted-foreground">
              <MessageSquare className="mx-auto h-12 w-12" />
              <p className="mt-4">{t('resultsPlaceholder')}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
