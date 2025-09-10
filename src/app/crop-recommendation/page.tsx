import CropRecommendationForm from '@/components/features/crop-recommendation-form';

export default function CropRecommendationPage() {
  return (
    <div className="flex-1 p-4 md:p-6">
      <div className="mb-6">
        <h1 className="font-headline text-3xl font-bold">
          AI Crop Recommendation
        </h1>
        <p className="text-muted-foreground">
          Fill in the details below to receive AI-powered crop recommendations tailored to your farm.
        </p>
      </div>
      <CropRecommendationForm />
    </div>
  );
}
