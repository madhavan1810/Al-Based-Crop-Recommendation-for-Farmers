import { Wheat } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-2 p-2">
      <Wheat className="h-8 w-8 text-primary" />
      <h2 className="font-headline text-xl font-semibold text-foreground group-data-[collapsible=icon]:hidden">
        FarmBharat.AI
      </h2>
    </div>
  );
}
