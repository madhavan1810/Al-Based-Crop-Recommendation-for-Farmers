
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { UserPlus, Upload } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import React from 'react';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
  soilType: z.string().min(1, { message: 'Please select a soil type.' }),
  soilReport: z.any().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function RegisterForm() {
  const t = {
    nameLabel: "Full Name",
    namePlaceholder: "Your Name",
    emailLabel: "Email",
    emailPlaceholder: "name@example.com",
    passwordLabel: "Password",
    registerButton: "Create an account",
    loginPrompt: "Already have an account?",
    loginLink: "Login",
    soilTypeLabel: "Primary Soil Type",
    soilTypePlaceholder: "Select your farm's soil type",
    alluvial: "Alluvial",
    black: "Black (Regur)",
    redAndYellow: "Red and Yellow",
    laterite: "Laterite",
    other: "Other / I don't know",
    soilReportLabel: "Soil Health Report (Optional)",
    soilReportPlaceholder: "Upload PDF or Image"
  };
  const { toast } = useToast();
  const router = useRouter();
  const { signUpWithEmail } = useAuth();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = React.useState('');

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      soilType: '',
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      form.setValue('soilReport', file);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      await signUpWithEmail(data.email, data.password, data.name, {
        soilType: data.soilType,
      });
      toast({
        title: 'Registration Successful',
        description: 'Your account has been created.',
      });
      router.push('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        variant: 'destructive',
        title: 'Registration Failed',
        description: 'Failed to create account. Please try again.',
      });
    }
  };

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4 pt-6">
             <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.nameLabel}</FormLabel>
                  <FormControl>
                    <Input placeholder={t.namePlaceholder} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.emailLabel}</FormLabel>
                  <FormControl>
                    <Input placeholder={t.emailPlaceholder} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.passwordLabel}</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="soilType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.soilTypeLabel}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t.soilTypePlaceholder} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Alluvial">{t.alluvial}</SelectItem>
                      <SelectItem value="Black">{t.black}</SelectItem>
                      <SelectItem value="Red and Yellow">{t.redAndYellow}</SelectItem>
                      <SelectItem value="Laterite">{t.laterite}</SelectItem>
                      <SelectItem value="Other">{t.other}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="soilReport"
              render={() => (
                <FormItem>
                  <FormLabel>{t.soilReportLabel}</FormLabel>
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
                        {fileName || t.soilReportPlaceholder}
                      </Button>
                    </>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <Button type="submit" className="w-full">
              <UserPlus className="mr-2 h-4 w-4" /> {t.registerButton}
            </Button>
          </CardContent>
          <CardFooter className="flex justify-center text-sm">
             <p className="text-muted-foreground">
              {t.loginPrompt}{' '}
              <Button variant="link" asChild className="p-0">
                <Link href="/login">{t.loginLink}</Link>
              </Button>
            </p>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
