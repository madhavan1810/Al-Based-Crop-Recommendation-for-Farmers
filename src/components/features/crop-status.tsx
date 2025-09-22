'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getCropsForUser, type Crop } from '@/lib/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoaderCircle, Sprout, Calendar, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

export function CropStatus() {
  const { user } = useAuth();
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCrops() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const userCrops = await getCropsForUser(user.uid);
        setCrops(userCrops);
      } catch (err) {
        console.error('Error fetching crops:', err);
        setError('Failed to load crop data');
      } finally {
        setLoading(false);
      }
    }

    fetchCrops();
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planned':
        return 'bg-blue-100 text-blue-800';
      case 'planted':
        return 'bg-green-100 text-green-800';
      case 'growing':
        return 'bg-yellow-100 text-yellow-800';
      case 'harvested':
        return 'bg-purple-100 text-purple-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Crop Status</CardTitle>
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
          <CardTitle>Crop Status</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-32">
          <p className="text-destructive">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crop Status</CardTitle>
      </CardHeader>
      <CardContent>
        {crops.length === 0 ? (
          <div className="text-center py-8">
            <Sprout className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No crops planted yet.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Start by adding a farm and planting your first crop.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {crops.slice(0, 5).map((crop) => (
              <div key={crop.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold">{crop.cropType}</h3>
                    {crop.variety && (
                      <p className="text-sm text-muted-foreground">{crop.variety}</p>
                    )}
                  </div>
                  <Badge className={getStatusColor(crop.status)}>
                    {crop.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground">Planted</p>
                      <p className="font-medium">
                        {format(crop.plantingDate.toDate(), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground">Expected Harvest</p>
                      <p className="font-medium">
                        {format(crop.expectedHarvestDate.toDate(), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                </div>

                {crop.expectedYield && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-sm">
                      <span className="text-muted-foreground">Expected Yield:</span>{' '}
                      <span className="font-medium">{crop.expectedYield} kg</span>
                      {crop.actualYield && (
                        <>
                          {' | '}
                          <span className="text-muted-foreground">Actual:</span>{' '}
                          <span className="font-medium">{crop.actualYield} kg</span>
                        </>
                      )}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}