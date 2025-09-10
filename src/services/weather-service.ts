export type WeatherData = {
  temperature: number;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  forecast: string;
};

export async function getWeatherData(location: string): Promise<WeatherData> {
  console.log(`Fetching weather for ${location}...`);

  const apiKey = process.env.WEATHER_API_KEY;
  if (!apiKey) {
    throw new Error('WEATHER_API_KEY is not set in the environment variables.');
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error('Failed to fetch weather data:', response.statusText);
      // Return a default/error state if API fails
      return {
        temperature: 0,
        humidity: 0,
        windSpeed: 0,
        precipitation: 0,
        forecast: 'Could not fetch weather data.',
      };
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
    throw new Error('Failed to fetch weather data.');
  }
}
