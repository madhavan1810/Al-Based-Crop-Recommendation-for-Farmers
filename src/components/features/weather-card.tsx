
'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { LoaderCircle, Sun, Droplets, Wind, Thermometer } from 'lucide-react';
import { getWeatherData, type WeatherData } from '@/services/weather-service';

interface WeatherCardProps {
  location: string;
}

export default function WeatherCard({ location }: WeatherCardProps) {
  const t = {
    title: "Current Weather",
    loading: "Loading weather...",
    error: "Could not fetch weather data.",
    temperature: "Temperature",
    humidity: "Humidity",
    windSpeed: "Wind Speed",
    forecast: "Forecast"
  };
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWeather() {
      if (!location) {
        setLoading(false);
        setError("Location not provided.");
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const data = await getWeatherData(location);
        setWeather(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : t.error);
        console.error("Error fetching weather: ", err);
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
  }, [location, t.error]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sun className="size-6 text-primary" />
          <span>{t.title} - {location}</span>
        </CardTitle>
        <CardDescription>
          Real-time weather conditions and forecast.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-24">
            <LoaderCircle className="size-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-24">
            <p className="text-destructive text-center">{error}</p>
          </div>
        ) : weather ? (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
                <Thermometer className="size-5 text-muted-foreground" />
                <div>
                    <p className="text-muted-foreground">{t.temperature}</p>
                    <p className="font-bold text-lg">{weather.temperature.toFixed(1)}°C</p>
                </div>
            </div>
             <div className="flex items-center gap-2">
                <Droplets className="size-5 text-muted-foreground" />
                <div>
                    <p className="text-muted-foreground">{t.humidity}</p>
                    <p className="font-bold text-lg">{weather.humidity}%</p>
                </div>
            </div>
             <div className="flex items-center gap-2">
                <Wind className="size-5 text-muted-foreground" />
                <div>
                    <p className="text-muted-foreground">{t.windSpeed}</p>
                    <p className="font-bold text-lg">{weather.windSpeed.toFixed(1)} km/h</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Sun className="size-5 text-muted-foreground" />
                <div>
                    <p className="text-muted-foreground">{t.forecast}</p>
                    <p className="font-bold text-lg capitalize">{weather.forecast}</p>
                </div>
            </div>
          </div>
        ) : (
             <div className="flex items-center justify-center h-24">
                <p className="text-muted-foreground">No weather data available.</p>
             </div>
        )}
      </CardContent>
    </Card>
  );
}
