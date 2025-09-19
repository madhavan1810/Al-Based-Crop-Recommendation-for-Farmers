
'use client';

import React, { useState, useTransition, useRef } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { BrainCircuit, LoaderCircle, Calendar, FileDown, Upload } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import { getPersonalizedCultivationPlan } from '@/ai/flows/personalized-space-flow';
import { generatePdfFlow } from '@/ai/flows/generate-pdf-flow';
import { 
    type PersonalizedCultivationPlanOutput,
    type WeeklyTask,
} from '@/ai/schemas/personalized-space-schema';

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
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import {indianDistricts} from '@/lib/indian-districts';

const formSchema = z.object({
  crop: z.string().min(2, { message: 'Please specify the crop.' }),
  district: z.string().min(1, { message: 'Please select a district.' }),
  sowingDate: z.string().min(1, { message: 'Please select a sowing date.' }),
  soilReport: z.any().optional(),
});

type FormData = z.infer<typeof formSchema>;

function getWeekOfSowing(sowingDate: string): number {
    const start = new Date(sowingDate);
    const now = new Date();
    const diff = now.getTime() - start.getTime();
    if (diff < 0) return 1;
    const week = Math.floor(diff / (1000 * 60 * 60 * 24 * 7)) + 1;
    return week;
}

export default function PersonalizedSpace() {
  const t = {
    formTitle: "Cultivation Details",
    formDescription: "Provide your farm's details to generate a plan.",
    cropLabel: "Crop to Cultivate",
    cropPlaceholder: "e.g., Tomato, Wheat",
    districtLabel: "District",
    districtPlaceholder: "Select your district",
    sowingDateLabel: "Planned Sowing Date",
    sowingDateDescription: "This helps track your weekly progress.",
    soilReportLabel: "Soil Health Report (Optional)",
    soilReportPlaceholder: "Upload PDF or Image",
    soilReportDescription: "Uploading a report provides more accurate advice.",
    getPlan: "Generate Cultivation Plan",
    generatingPlan: "Generating Plan...",
    planTitle: "Your Cultivation Plan",
    planDescription: "A weekly guide from sowing to harvest.",
    downloadPdf: "Download as PDF",
    downloading: "Downloading...",
    week: "Week",
    currentWeek: "Current Week",
    placeholder: "Your personalized cultivation plan will appear here once generated.",
    disclaimer: "This is an AI-generated plan. Always adapt based on real-world field conditions and consult local experts.",
    error: {
      title: "Error",
      planFailed: "Failed to generate cultivation plan. Please try again.",
      pdfFailed: "Failed to generate PDF. Please try again later.",
      unexpected: "An unexpected error occurred. Please try again."
    }
  };
  const locale = 'en';
  const [isPending, startTransition] = useTransition();
  const [isDownloading, setIsDownloading] = useState(false);
  const [result, setResult] = useState<PersonalizedCultivationPlanOutput | null>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState('');
  const planContentRef = useRef<HTMLDivElement>(null);


  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      crop: '',
      district: '',
      sowingDate: '',
    },
  });
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/') || file.type === 'application/pdf') {
        const reader = new FileReader();
        reader.onloadend = () => {
          form.setValue('soilReport', reader.result as string);
          setFileName(file.name);
        };
        reader.readAsDataURL(file);
      } else {
        toast({
          variant: 'destructive',
          title: 'Invalid File Type',
          description: 'Please upload a PDF or an image file.',
        });
      }
    }
  };

  const onSubmit = (data: FormData) => {
    startTransition(async () => {
      setResult(null);
      try {
        const res = await getPersonalizedCultivationPlan({
          ...data,
          userProfile: "User from " + data.district + ", growing " + data.crop, // Mock profile
        });
        if (res) {
          setResult(res);
        } else {
          toast({
            variant: 'destructive',
            title: t.error.title,
            description: t.error.planFailed,
          });
        }
      } catch (error) {
        console.error(error);
        toast({
          variant: 'destructive',
          title: t.error.title,
          description: t.error.unexpected,
        });
      }
    });
  };
  
  const handleDownloadPdf = async () => {
    if (!planContentRef.current || !result) return;
    setIsDownloading(true);

    try {
        // 1. Get the HTML content
        const htmlContent = planContentRef.current.innerHTML;

        // 2. Call the AI flow to get the PDF content
        const pdfResponse = await generatePdfFlow({
            htmlContent: htmlContent,
            language: locale, // Pass the current locale
            cultivationPlan: result // Pass the full plan data
        });

        if (pdfResponse.pdfBase64) {
            // 3. Decode Base64 and trigger download
            const byteCharacters = atob(pdfResponse.pdfBase64);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `KrishiFarmAI_Cultivation_Plan_${form.getValues('crop')}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            throw new Error('PDF generation failed, no content returned.');
        }

    } catch (error) {
        console.error('PDF Download Error:', error);
        toast({
            variant: 'destructive',
            title: t.error.title,
            description: t.error.pdfFailed,
        });
    } finally {
        setIsDownloading(false);
    }
  };
  
  const currentWeek = result ? getWeekOfSowing(form.getValues('sowingDate')) : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>{t('formTitle')}</CardTitle>
            <CardDescription>{t('formDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="crop"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('cropLabel')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('cropPlaceholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="district"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('districtLabel')}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('districtPlaceholder')} />
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
                  name="sowingDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('sowingDateLabel')}</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                       <FormDescription>{t('sowingDateDescription')}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                    control={form.control}
                    name="soilReport"
                    render={() => (
                        <FormItem>
                        <FormLabel>{t('soilReportLabel')}</FormLabel>
                        <FormControl>
                            <>
                            <Input
                                type="file"
                                accept=".pdf,image/*"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full justify-start"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Upload className="mr-2" />
                                {fileName || t('soilReportPlaceholder')}
                            </Button>
                            </>
                        </FormControl>
                        <FormDescription>{t('soilReportDescription')}</FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={isPending} className="w-full">
                  {isPending ? (
                    <><LoaderCircle className="mr-2 h-4 w-4 animate-spin" />{t('generatingPlan')}</>
                  ) : (
                    <><BrainCircuit className="mr-2 h-4 w-4" />{t('getPlan')}</>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      
      <div className="lg:col-span-2">
        <Card className="h-full">
          <CardHeader>
            <div className="flex justify-between items-center">
                <div>
                    <CardTitle>{t('planTitle')}</CardTitle>
                    <CardDescription>{t('planDescription')}</CardDescription>
                </div>
                 {result && (
                    <Button onClick={handleDownloadPdf} disabled={isDownloading}>
                        {isDownloading ? (
                            <><LoaderCircle className="mr-2 h-4 w-4 animate-spin" />{t('downloading')}</>
                        ) : (
                            <><FileDown className="mr-2 h-4 w-4" />{t('downloadPdf')}</>
                        )}
                    </Button>
                )}
            </div>
          </CardHeader>
          <CardContent ref={planContentRef}>
            {isPending && (
              <div className="flex h-96 flex-col items-center justify-center gap-2 text-muted-foreground">
                <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
                <span>{t('generatingPlan')}</span>
              </div>
            )}
            {result && result.cultivationPlan && (
              <div className="relative space-y-6">
                {/* Timeline line */}
                <div className="absolute left-5 top-0 h-full w-0.5 bg-border -translate-x-1/2"></div>

                {result.cultivationPlan.map((week: WeeklyTask, index) => (
                  <div key={index} className="relative flex items-start gap-4">
                     <div className="z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 bg-background font-bold"
                        style={{borderColor: (index + 1) === currentWeek ? 'hsl(var(--primary))' : 'hsl(var(--border))'}}>
                        {index + 1}
                     </div>
                    <div className="flex-1 pt-1.5">
                       <p className={cn("font-bold", (index + 1) === currentWeek ? "text-primary" : "")}>
                            {t('week')} {index + 1}: {week.stage}
                            {(index + 1) === currentWeek && <span className="ml-2 text-xs font-normal text-muted-foreground">({t('currentWeek')})</span>}
                        </p>
                      <p className="text-sm text-muted-foreground mt-1">{week.tasks}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {!isPending && !result && (
              <div className="flex h-96 flex-col items-center justify-center text-center text-muted-foreground">
                <Calendar className="mx-auto h-12 w-12" />
                <p className="mt-4">{t('placeholder')}</p>
              </div>
            )}
          </CardContent>
          {result && (
            <CardFooter>
                <p className="text-xs text-muted-foreground">{t('disclaimer')}</p>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
