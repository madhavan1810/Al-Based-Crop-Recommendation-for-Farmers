'use client';

import { useState, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { BrainCircuit, LoaderCircle, MessageSquare } from 'lucide-react';

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
      const res = await getPersonalizedFarmingAdvice(data);
      if (res) {
        setResult(res);
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to get advice. Please try again.',
        });
      }
    });
  };

  return (
    <div className="grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Your Farm Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Punjab, India" {...field} />
                    </FormControl>
                    <FormDescription>
                      Your city or region for local weather data.
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
                    <FormLabel>Current Crop</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Wheat" {...field} />
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
                    <FormLabel>Soil Analysis</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., pH: 6.5, Nitrogen: High, Sandy Loam soil"
                        {...field}
                        rows={4}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide your latest soil test results.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? (
                  <>
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    Generating Advice...
                  </>
                ) : (
                  <>
                    <BrainCircuit className="mr-2 h-4 w-4" />
                    Get Advice
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Today's Advice</CardTitle>
          <CardDescription>
            Personalized recommendations based on your input and live weather data.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 items-center justify-center">
          {isPending && (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
              <span>Checking weather and analyzing...</span>
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
              <p className="mt-4">Your personalized advice will be displayed here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
