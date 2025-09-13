export type WeatherData = {
  temperature: number;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  forecast: string;
};

export async function getWeatherData(location: string): Promise<WeatherData> {
  console.log(`Fetching weather for ${location}...`);

  const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
  if (!apiKey) {
    console.error('WEATHER_API_KEY is not set in the environment variables.');
    throw new Error('Server configuration error: Weather service is not available.');
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Failed to fetch weather data:', response.statusText, errorData);
      throw new Error(`Could not fetch weather data for ${location}. Reason: ${errorData.message}`);
    }
    const data = await response.json();

    const weatherData: WeatherData = {
      temperature: data.main.temp,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed * 3.6, // m/s to km/h
      precipitation: data.rain?.['1h'] || 0, // rain volume for the last 1 hour in mm
      forecast: data.weather[0]?.description || 'No forecast available.',
    };

    return weatherData;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unknown error occurred while fetching weather data.');
  }
}
