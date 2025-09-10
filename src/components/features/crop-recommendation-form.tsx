'use client';

import { useState, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  BrainCircuit,
  CloudRain,
  Leaf,
  LoaderCircle,
  ShieldAlert,
  Thermometer,
  Wind,
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

const formSchema = z.object({
  soilAnalysis: z
    .string()
    .min(10, { message: 'Please provide detailed soil analysis.' }),
  weatherData: z
    .string()
    .min(10, { message: 'Please provide detailed weather data.' }),
  historicalYields: z
    .string()
    .min(10, { message: 'Please provide some historical yield data.' }),
});

type FormData = z.infer<typeof formSchema>;

export default function CropRecommendationForm() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<CropRecommendationOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      soilAnalysis: '',
      weatherData: '',
      historicalYields: '',
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
          title: 'Error',
          description: 'Failed to get recommendations. Please try again.',
        });
      }
    });
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Farm Data</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="soilAnalysis"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Soil Analysis</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., pH: 6.5, Nitrogen: High, Phosphorus: Medium, Potassium: Low"
                        {...field}
                        rows={4}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter the results from your latest soil test.
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
                    <FormLabel>Weather & Climate Data</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Avg. Temp: 25°C, Annual Rainfall: 1200mm, Sunny days: ~280"
                        {...field}
                        rows={4}
                      />
                    </FormControl>
                    <FormDescription>
                      Describe your local climate conditions.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="historicalYields"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Historical Yields</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Last year: Corn, 4 tons/acre. Two years ago: Soybeans, 1.5 tons/acre."
                        {...field}
                        rows={4}
                      />
                    </FormControl>
                    <FormDescription>
                      What have you grown before and how did it perform?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? (
                  <>
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <BrainCircuit className="mr-2 h-4 w-4" />
                    Get Recommendations
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <div className="space-y-4">
        <h2 className="font-headline text-2xl font-bold">Recommendations</h2>
        {isPending && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-center">
                <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-4 text-muted-foreground">Generating recommendations...</p>
              </div>
            </CardContent>
          </Card>
        )}
        {result && (
          <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg font-semibold">
                <Leaf className="mr-2 size-5 text-green-600" />Recommended Crops
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
                <Thermometer className="mr-2 size-5 text-red-500" />Planting Instructions
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
                <ShieldAlert className="mr-2 size-5 text-yellow-600" />Risk Assessment
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
                <p className="mt-4">Your personalized crop recommendations will appear here.</p>
              </CardContent>
            </Card>
        )}
      </div>
    </div>
  );
}
