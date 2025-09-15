
'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Package, LoaderCircle } from 'lucide-react';

type SeedPrice = {
  name: string;
  variety: string;
  price: number;
};

export default function SeedPricesCard() {
  const [seedPrices, setSeedPrices] = useState<SeedPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSeedPrices() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/prices/seeds');
        if (!response.ok) {
          throw new Error('Failed to fetch seed prices');
        }
        const data = await response.json();
        setSeedPrices(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error("Error fetching seed prices: ", err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchSeedPrices();

    // Refresh data every 30 seconds
    const interval = setInterval(fetchSeedPrices, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="size-6 text-primary" />
          <span>Seed Variety Prices</span>
        </CardTitle>
        <CardDescription>
          Current market prices for popular seed varieties.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <LoaderCircle className="size-8 animate-spin text-primary" />
          </div>
        ) : error ? (
           <div className="flex items-center justify-center h-40">
            <p className="text-destructive">{error}</p>
          </div>
        ) : seedPrices.length === 0 ? (
           <div className="flex items-center justify-center h-40">
            <p className="text-muted-foreground">No seed prices found. Please refresh.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Crop</TableHead>
                <TableHead>Variety</TableHead>
                <TableHead className="text-right">Price (₹ per Quintal)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {seedPrices.map((seed) => (
                <TableRow key={`${seed.name}-${seed.variety}`}>
                  <TableCell className="font-medium">{seed.name}</TableCell>
                  <TableCell>{seed.variety}</TableCell>
                  <TableCell className="text-right">₹{seed.price.toLocaleString('en-IN')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
