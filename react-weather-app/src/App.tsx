import {useState} from 'react';

//interfaces
interface WeatherData {
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  main: {
    temp: number;
    humidity: number;
    pressure: number;
    temp_min: number;
    temp_max: number;
    feels_like: number;
  };
  wind: {
    speed: number;
  };
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  name: string;
}

interface ForecastItem {
  dt: number;
  main: {
    temp: number;
    humidity: number;
    pressure: number;
    temp_min: number;
    temp_max: number;
    feels_like: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
  };
  dt_txt: string;
}

interface ForecastData {
  list: ForecastItem[];
  city: {
    name: string;
    country: string;
  };
}

// Словник для перекладів
const translations = {
  uk: {
    title: 'TintWave',
    placeholder: 'Введіть назву міста',
    button: 'Отримати погоду',
    currentWeather: 'Поточна погода',
    forecast: '5-денний прогноз',
    temperature: 'Температура:',
    humidity: 'Вологість:',
    pressure: 'Тиск:',
    windSpeed: 'Швидкість вітру:',
    weather: 'Погода:',
    wind: 'Вітер:',
    loading: 'Завантаження...',
    errorCity: 'Будь ласка, введіть назву міста',
    errorNotFound: 'Місто не знайдено',
    errorForecast: 'Прогноз не знайдено',
    errorUnknown: 'Виникла невідома помилка'
  },
  en: {
    title: 'TintWave',
    placeholder: 'Enter city name',
    button: 'Get Weather',
    currentWeather: 'Current Weather',
    forecast: '5-day Forecast',
    temperature: 'Temperature:',
    humidity: 'Humidity:',
    pressure: 'Pressure:',
    windSpeed: 'Wind Speed:',
    weather: 'Weather:',
    wind: 'Wind:',
    loading: 'Loading...',
    errorCity: 'Please enter a city name',
    errorNotFound: 'City not found',
    errorForecast: 'Forecast not found',
    errorUnknown: 'An unknown error occurred'
  }
};

type Language = 'uk' | 'en';

const App = () => {
    //constant data
    const [city, setCity] = useState<string>('');
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [forecastData, setForecastData] = useState<ForecastData | null>(null);
    const [language, setLanguage] = useState<Language>('uk');
    //page states
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    
    //API key
    const apiKey: string | undefined = import.meta.env.VITE_WEATHER_API_KEY;
    if (!apiKey) {
      throw new Error('VITE_WEATHER_API_KEY environment variable is not set');
    }

    // Отримання поточних перекладів
    const t = translations[language];

    //fetching data
    const fetchWeatherData = async (city: string) => {
      setLoading(true);
      setError(null);
      try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=${language}`);
        if (!response.ok) {
          throw new Error(t.errorNotFound);
        }
      const data: WeatherData = await response.json();
        setWeatherData(data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError(t.errorUnknown);
        }
        setWeatherData(null); 
      } finally {
        setLoading(false);
      }
    };

    const fetchForecastData = async (city: string) => {
      setLoading(true);
      setError(null);
      try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=${language}`);
        if (!response.ok) {
          throw new Error(t.errorForecast);
        }
      const data: ForecastData = await response.json();
        setForecastData(data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError(t.errorUnknown);
        }
        setForecastData(null); 
      } finally {
        setLoading(false);
      }
    };

    // get daily forecasts by filtering data for the same time each day
    const getDailyForecasts = () => {
      if (!forecastData?.list) return [];
      
      const dailyData: ForecastItem[] = [];
      const processedDates = new Set();
      
      // get one forecast per day (at midday when possible)
      forecastData.list.forEach(item => {
        const date = item.dt_txt.split(' ')[0];
        const hour = parseInt(item.dt_txt.split(' ')[1].split(':')[0]);
        
        // try to get the forecast for midday (12:00 or 15:00)
        if (!processedDates.has(date) && (hour === 12 || hour === 15)) {
          dailyData.push(item);
          processedDates.add(date);
        }
      });
      
      // if we don't have enough data, fill in with any time for missing dates
      forecastData.list.forEach(item => {
        const date = item.dt_txt.split(' ')[0];
        if (!processedDates.has(date)) {
          dailyData.push(item);
          processedDates.add(date);
        }
      });
      
      // sort by date
      return dailyData.sort((a, b) => a.dt - b.dt).slice(0, 5);
    };

    // format date з урахуванням мови
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      const locale = language === 'uk' ? 'uk-UA' : 'en-US';
      return date.toLocaleDateString(locale, { weekday: 'short', month: 'short', day: 'numeric' });
    };

      //button
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (city.trim() === '') {
          setError(t.errorCity);
          return;
        }
        fetchWeatherData(city);
        fetchForecastData(city);
      };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCity(e.target.value);
      };

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setLanguage(e.target.value as Language);
        // Якщо є данні погоди, перезавантажуємо їх з новою мовою
        if (weatherData && city) {
          fetchWeatherData(city);
          fetchForecastData(city);
        }
      };

      return (
        <div>
        <header>
          <h1>{t.title}</h1>
          
          {/* Селектор мови */}
          <div style={{ marginBottom: '10px' }}>
            <select value={language} onChange={handleLanguageChange}>
              <option value="uk">🇺🇦 Українська</option>
              <option value="en">🇬🇧 English</option>
            </select>
          </div>

          <form onSubmit={handleSubmit}>  
          <input 
            type="text" 
            placeholder={t.placeholder} 
            value={city} 
            onChange={handleChange}
          />
          <button type="submit">{t.button}</button>
          </form>
        </header>

        {error && <h2 className="error">{error}</h2>}
        {loading && <h2>{t.loading}</h2>}
        {weatherData && (
          <main>
          <section>
             <h2>{t.currentWeather}</h2>
            <div className="now-weather"> 
              <p>{t.temperature}<br/>{weatherData.main.temp}°C</p>
              <p>{t.humidity}<br/> {weatherData.main.humidity}%</p>
              <p>{t.pressure}<br/> {weatherData.main.pressure} hPa</p>
              <p>{t.windSpeed}<br/> {weatherData.wind.speed} m/s</p>
              <p>{t.weather}<br/>{weatherData.weather[0].description}</p>
              <img 
                src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} 
                alt={weatherData.weather[0].description} 
              />
            </div>
          </section>
        {forecastData && forecastData.list && (
            <section>
            <h2>{t.forecast}</h2>
            <div className="forecast"> 
              {getDailyForecasts().map((forecast, index) => (
                      <div key={index} className="forecast-day">
                        <h3>{formatDate(forecast.dt_txt)}</h3>
                        <img 
                          src={`http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`} 
                          alt={forecast.weather[0].description} 
                        />
                        <p>{forecast.weather[0].description}</p>
                        <p>{Math.round(forecast.main.temp)}°C</p>
                        <p>{t.wind} {forecast.wind.speed} m/s</p>
                        <p>{t.humidity} {forecast.main.humidity}%</p>
                      </div>
                    ))}
            </div>
          </section>
          )}
        </main>
        )}
        </div>
      )
}

export default App