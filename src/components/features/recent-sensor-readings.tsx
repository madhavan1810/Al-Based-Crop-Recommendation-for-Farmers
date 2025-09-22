'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getSensorDataForFarm, getFarmsForUser, type SensorData, type Farm } from '@/lib/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoaderCircle, Thermometer, Droplets, Gauge, Sun } from 'lucide-react';
import { format } from 'date-fns';

export function RecentSensorReadings() {
  const { user } = useAuth();
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSensorData() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Get user's farms first
        const farms = await getFarmsForUser(user.uid);
        
        if (farms.length > 0) {
          // Get sensor data for the first farm (or you could aggregate from all farms)
          const readings = await getSensorDataForFarm(farms[0].id!, 10);
          setSensorData(readings);
        }
      } catch (err) {
        console.error('Error fetching sensor data:', err);
        setError('Failed to load sensor readings');
      } finally {
        setLoading(false);
      }
    }

    fetchSensorData();
  }, [user]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'temperature':
        return <Thermometer className="h-4 w-4 text-red-500" />;
      case 'humidity':
        return <Droplets className="h-4 w-4 text-blue-500" />;
      case 'soil_moisture':
        return <Droplets className="h-4 w-4 text-green-500" />;
      case 'ph':
        return <Gauge className="h-4 w-4 text-purple-500" />;
      case 'light':
        return <Sun className="h-4 w-4 text-yellow-500" />;
      default:
        return <Gauge className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatValue = (type: string, value: number, unit: string) => {
    return `${value.toFixed(1)} ${unit}`;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Sensor Readings</CardTitle>
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
          <CardTitle>Recent Sensor Readings</CardTitle>
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
        <CardTitle>Recent Sensor Readings</CardTitle>
      </CardHeader>
      <CardContent>
        {sensorData.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No sensor data available.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Connect IoT sensors to your farm to see real-time data here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sensorData.slice(0, 5).map((reading) => (
              <div key={reading.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getIcon(reading.type)}
                  <div>
                    <p className="font-medium capitalize">{reading.type.replace('_', ' ')}</p>
                    <p className="text-sm text-muted-foreground">
                      {reading.timestamp && format(reading.timestamp.toDate(), 'MMM dd, HH:mm')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatValue(reading.type, reading.value, reading.unit)}</p>
                  {reading.location && (
                    <p className="text-xs text-muted-foreground">{reading.location}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}