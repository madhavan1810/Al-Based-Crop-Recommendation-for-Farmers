import PersonalizedAdviceForm from "@/components/features/personalized-advice-form";

export default function PersonalizedAdvicePage() {
  return (
    <div className="flex-1 p-4 md:p-6">
      <div className="mb-6">
        <h1 className="font-headline text-3xl font-bold">
          Personalized Farming Advice
        </h1>
        <p className="text-muted-foreground">
          Get daily, AI-generated advice based on your farm's specifics and local weather forecasts.
        </p>
      </div>
      <PersonalizedAdviceForm />
    </div>
  );
}
