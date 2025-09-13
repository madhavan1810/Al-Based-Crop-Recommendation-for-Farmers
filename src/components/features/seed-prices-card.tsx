
'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
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

  useEffect(() => {
    const seedPricesRef = collection(db, 'seed-prices');
    const unsubscribe = onSnapshot(seedPricesRef, (querySnapshot) => {
      const prices: SeedPrice[] = [];
      querySnapshot.forEach((doc) => {
        prices.push(doc.data() as SeedPrice);
      });
      setSeedPrices(prices);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching seed prices: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
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
