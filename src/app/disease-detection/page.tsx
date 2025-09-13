import DiseaseDetection from '@/components/features/disease-detection-card';
import { AppShell } from '@/components/layout/app-shell';

export default function DiseaseDetectionPage() {
  return (
    <AppShell>
      <div className="flex-1 p-4 md:p-6">
        <div className="mb-6">
          <h1 className="font-headline text-3xl font-bold">
            Plant Disease Detection
          </h1>
          <p className="text-muted-foreground">
            Upload an image of a plant leaf to detect diseases using AI. This feature works even when you are offline.
          </p>
        </div>
        <DiseaseDetection />
      </div>
    </AppShell>
  );
}
