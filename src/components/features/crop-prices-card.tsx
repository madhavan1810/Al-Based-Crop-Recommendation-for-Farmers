'use client';

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
import { cropPrices } from '@/lib/market-data';
import { cn } from '@/lib/utils';
import { LineChart, TrendingDown, TrendingUp } from 'lucide-react';

export default function CropPricesCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LineChart className="size-6 text-primary" />
          <span>Live Crop Prices</span>
        </CardTitle>
        <CardDescription>
          Today's Mandi prices for key agricultural commodities.
        </CardDescription>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
}
