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
import { seedPrices } from '@/lib/market-data';
import { Package } from 'lucide-react';

export default function SeedPricesCard() {
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Crop</TableHead>
              <TableHead>Variety</TableHead>
              <TableHead className="text-right">Price (per Quintal)</TableHead>
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
      </CardContent>
    </Card>
  );
}
