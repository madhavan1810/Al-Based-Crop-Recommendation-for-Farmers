
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
import { cn } from '@/lib/utils';
import { LineChart, TrendingDown, TrendingUp, LoaderCircle } from 'lucide-react';

type CropPrice = {
  name: string;
  price: number;
  change: number;
};

export default function CropPricesCard() {
  const [cropPrices, setCropPrices] = useState<CropPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCropPrices() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/prices/crops');
        if (!response.ok) {
          throw new Error('Failed to fetch crop prices');
        }
        const data = await response.json();
        setCropPrices(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error("Error fetching crop prices: ", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCropPrices();
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchCropPrices, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LineChart className="size-6 text-primary" />
          <span>Today's Crop Prices</span>
        </CardTitle>
        <CardDescription>
          Today's Mandi prices for key agricultural commodities.
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
        ) : cropPrices.length === 0 ? (
          <div className="flex items-center justify-center h-40">
            <p className="text-muted-foreground">No crop prices found. Please refresh.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Crop</TableHead>
                <TableHead className="text-right">Price (₹ per Quintal)</TableHead>
                <TableHead className="text-right">24h Change</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cropPrices.map((crop) => (
                <TableRow key={crop.name}>
                  <TableCell className="font-medium">{crop.name}</TableCell>
                  <TableCell className="text-right">₹{crop.price.toLocaleString('en-IN')}</TableCell>
                  <TableCell className="text-right">
                    <span
                      className={cn(
                        'flex items-center justify-end gap-1 text-sm',
                        crop.change > 0 ? 'text-green-600' : 'text-red-600'
                      )}
                    >
                      {crop.change > 0 ? (
                        <TrendingUp className="size-4" />
                      ) : (
                        <TrendingDown className="size-4" />
                      )}
                      {Math.abs(crop.change)}%
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
