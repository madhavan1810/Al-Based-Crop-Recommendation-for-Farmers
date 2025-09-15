
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
import { getLatestSeedPrices, type SeedPrice } from '@/services/market-service';


export default function SeedPricesCard() {
  const [seedPrices, setSeedPrices] = useState<SeedPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSeedPrices() {
        try {
            setLoading(true);
            setError(null);
            const data = await getLatestSeedPrices();
            // The API can return many results, let's show a few.
            setSeedPrices(data.slice(0, 5));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
            console.error("Error fetching seed prices: ", err);
        } finally {
            setLoading(false);
        }
    }
    
    fetchSeedPrices();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="size-6 text-primary" />
          <span>Live Seed Prices</span>
        </CardTitle>
        <CardDescription>
          Latest prices for common seed varieties from India-wide markets.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <LoaderCircle className="size-8 animate-spin text-primary" />
          </div>
        ) : error ? (
           <div className="flex items-center justify-center h-40">
            <p className="text-destructive text-center">{error}</p>
          </div>
        ) : seedPrices.length === 0 ? (
           <div className="flex items-center justify-center h-40">
            <p className="text-muted-foreground">No seed prices found.</p>
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
              {seedPrices.map((seed, index) => (
                <TableRow key={`${seed.commodity}-${index}`}>
                  <TableCell className="font-medium">{seed.commodity}</TableCell>
                  <TableCell>{seed.variety}</TableCell>
                  <TableCell className="text-right">₹{seed.modal_price.toLocaleString('en-IN')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
