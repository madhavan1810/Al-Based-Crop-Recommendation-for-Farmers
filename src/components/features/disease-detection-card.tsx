'use client';

import Image from 'next/image';
import { useState, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { LoaderCircle, ScanLine, Upload } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { SpeakButton } from './speak-button';

type DetectionResult = {
  disease: string;
  confidence: number;
  treatment: string;
};

export default function DiseaseDetectionCard() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const placeholderImage = PlaceHolderImages.find(img => img.id === 'plant-preview') || PlaceHolderImages[0];

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
          setResult(null);
          setError(null);
        };
        reader.readAsDataURL(file);
      } else {
        setError('Please upload a valid image file.');
        setImagePreview(null);
      }
    }
  };

  const handleAnalyze = () => {
    if (!imagePreview) {
      setError('Please upload an image first.');
      return;
    }
    setIsAnalyzing(true);
    setResult(null);
    setError(null);

    // Simulate model analysis
    setTimeout(() => {
      // Mock result
      const mockResult: DetectionResult = {
        disease: 'Late Blight',
        confidence: 92,
        treatment: 'Apply a fungicide containing mancozeb or chlorothalonil. Ensure proper spacing between plants for better air circulation. Water at the base of the plant to avoid wet foliage.',
      };
      setResult(mockResult);
      setIsAnalyzing(false);
    }, 2500);
  };

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Upload Plant Image</span>
          <Badge variant="outline">Offline Capable</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="mx-auto w-full max-w-lg">
          <div className="mb-4 aspect-video w-full overflow-hidden rounded-lg border-2 border-dashed">
            <Image
              src={imagePreview || placeholderImage.imageUrl}
              alt="Plant preview"
              width={600}
              height={400}
              className="h-full w-full object-cover"
              data-ai-hint={imagePreview ? "plant leaf" : placeholderImage.imageHint}
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="picture">Plant Image</Label>
            <div className="flex gap-2">
              <Input
                id="picture"
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Choose File
              </Button>
              <Button onClick={handleAnalyze} disabled={isAnalyzing || !imagePreview}>
                {isAnalyzing ? (
                  <>
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <ScanLine className="mr-2 h-4 w-4" />
                    Analyze Plant
                  </>
                )}
              </Button>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        </div>

        {isAnalyzing && (
          <div className="pt-4">
            <Progress value={undefined} className="h-2 animate-pulse" />
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Running on-device model...
            </p>
          </div>
        )}

        {result && (
          <div className="pt-4">
            <Alert>
              <ScanLine className="h-4 w-4" />
              <AlertTitle className="flex items-center justify-between">
                <span>Detection Complete</span>
                <SpeakButton textToSpeak={`Disease detected: ${result.disease}. Confidence: ${result.confidence} percent. Recommended treatment: ${result.treatment}`} />
              </AlertTitle>
              <AlertDescription>
                <div className="mt-4 space-y-4">
                  <div>
                    <h3 className="font-semibold">Detected Disease:</h3>
                    <p>{result.disease}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Confidence:</h3>
                    <div className="flex items-center gap-2">
                      <Progress value={result.confidence} className="w-48" />
                      <span>{result.confidence}%</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold">Recommended Treatment:</h3>
                    <p>{result.treatment}</p>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          Disclaimer: This tool is for informational purposes only. Always consult with a local agricultural expert for definitive diagnosis.
        </p>
      </CardFooter>
    </Card>
  );
}
