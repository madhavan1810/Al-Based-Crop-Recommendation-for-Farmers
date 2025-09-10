export type WeatherData = {
  temperature: number;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  forecast: string;
};

export async function getWeatherData(location: string): Promise<WeatherData> {
  console.log(`Fetching weather for ${location}...`);

  // In a real application, you would fetch this data from a weather API.
  // For this example, we'll return mock data.
  const mockData: WeatherData = {
    temperature: 28, // Celsius
    humidity: 75, // Percent
    windSpeed: 10, // km/h
    precipitation: 5, // mm
    forecast: 'Partly cloudy with a chance of afternoon showers.',
  };

  return mockData;
}
