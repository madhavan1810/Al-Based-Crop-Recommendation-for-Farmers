'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
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

  useEffect(() => {
    const fetchCropPrices = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'crop-prices'));
        const prices: CropPrice[] = [];
        querySnapshot.forEach((doc) => {
          prices.push(doc.data() as CropPrice);
        });
        setCropPrices(prices);
      } catch (error) {
        console.error("Error fetching crop prices: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCropPrices();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LineChart className="size-6 text-primary" />
          <span>Today Crop Prices</span>
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
