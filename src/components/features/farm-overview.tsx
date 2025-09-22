'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getFarmsForUser, type Farm } from '@/lib/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoaderCircle, Plus, MapPin, Ruler } from 'lucide-react';
import Link from 'next/link';

export function FarmOverview() {
  const { user } = useAuth();
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFarms() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const userFarms = await getFarmsForUser(user.uid);
        setFarms(userFarms);
      } catch (err) {
        console.error('Error fetching farms:', err);
        setError('Failed to load farms');
      } finally {
        setLoading(false);
      }
    }

    fetchFarms();
  }, [user]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Farm Overview</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-32">
          <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Farm Overview</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-32">
          <p className="text-destructive">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Farm Overview</CardTitle>
        <Button asChild size="sm">
          <Link href="/farms/add">
            <Plus className="h-4 w-4 mr-2" />
            Add Farm
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {farms.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No farms registered yet.</p>
            <Button asChild>
              <Link href="/farms/add">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Farm
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {farms.map((farm) => (
              <div key={farm.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">{farm.farmName}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{farm.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Ruler className="h-4 w-4" />
                        <span>{farm.sizeAcres} acres</span>
                      </div>
                    </div>
                    <p className="text-sm">
                      <span className="font-medium">Soil:</span> {farm.soilType} | 
                      <span className="font-medium"> Water:</span> {farm.waterSource}
                    </p>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/farms/${farm.id}`}>
                      View Details
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}