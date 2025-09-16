
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
import { LoaderCircle, LineChart } from 'lucide-react';
import { getLatestCropPrices, type CropPrice } from '@/services/market-service';
import {useTranslations} from 'next-intl';


export default function CropPricesCard() {
  const t = useTranslations('CropPricesCard');
  const [cropPrices, setCropPrices] = useState<CropPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCropPrices() {
      try {
        setLoading(true);
        setError(null);
        const data = await getLatestCropPrices();
        // The API returns many records, so we'll just show the first 5 for a clean UI.
        setCropPrices(data.slice(0, 5));
      } catch (err) {
        setError(err instanceof Error ? err.message : t('error'));
        console.error("Error fetching crop prices: ", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCropPrices();
  }, [t]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LineChart className="size-6 text-primary" />
          <span>{t('title')}</span>
        </CardTitle>
        <CardDescription>
          {t('description')}
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
        ) : cropPrices.length === 0 ? (
          <div className="flex items-center justify-center h-40">
            <p className="text-muted-foreground">{t('noPrices')}</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('crop')}</TableHead>
                <TableHead>{t('market')}</TableHead>
                <TableHead className="text-right">{t('price')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cropPrices.map((crop, index) => (
                <TableRow key={`${crop.commodity}-${index}`}>
                  <TableCell className="font-medium">{crop.commodity}</TableCell>
                  <TableCell>{crop.market}</TableCell>
                  <TableCell className="text-right">₹{crop.modal_price.toLocaleString('en-IN')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
