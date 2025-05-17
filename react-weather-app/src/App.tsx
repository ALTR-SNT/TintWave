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


const App = () => {
    //constant data
    const [city, setCity] = useState<string>('');
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [forecastData, setForecastData] = useState<ForecastData | null>(null);
    //page states
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    //API key
    const apiKey: string = ' '; 

//fetching data
const fetchWeatherData = async (city: string) => {
  setLoading(true);
  setError(null);
  try {
const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
    if (!response.ok) {
      throw new Error('City not found');
    }
  const data: WeatherData = await response.json();
    setWeatherData(data);
  } catch (error) {
    if (error instanceof Error) {
      setError(error.message);
    } else {
      setError('An unknown error occurred');
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
const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
    if (!response.ok) {
      throw new Error('Forecast not found');
    }
  const data: ForecastData = await response.json();
    setForecastData(data);
  } catch (error) {
    if (error instanceof Error) {
      setError(error.message);
    } else {
      setError('An unknown error occurred');
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

// format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
};

  //button
const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim() === '') {
      setError('Please enter a city name');
      return;
    }
    fetchWeatherData(city);
    fetchForecastData(city);
  };
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCity(e.target.value);
  };

  return (
    <div >
    <header >
      <h1 className=''>Weather App</h1>
      <form onSubmit={handleSubmit}>  
      <input type="text" placeholder="Enter city name" value={city} onChange={handleChange}/>
      <button type="submit" >Get Weather</button>
      </form>
    </header>

    {error && <h2 className="error">{error}</h2>}
    {loading && <h2>Loading...</h2>}
    {weatherData && (
      <main >
      <section>
         <h2>Current Weather</h2>
        <div className = "now-weather"> 
          <p>Temperature:<br/>{weatherData.main.temp}°C</p>
          <p>Humidity:<br/> {weatherData.main.humidity}%</p>
          <p>Pressure:<br/> {weatherData.main.pressure} hPa</p>
          <p>Wind Speed:<br/> {weatherData.wind.speed} m/s</p>
          <p>Weather:<br/>{weatherData.weather[0].description}</p>
          <img src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} alt={weatherData.weather[0].description} />
        </div>
      </section>
    {forecastData && forecastData.list && (
        <section >
        <h2>5-day Forecast</h2>
        <div className= "forecast"> 
          {getDailyForecasts().map((forecast, index) => (
                  <div key={index} className="forecast-day">
                    <h3>{formatDate(forecast.dt_txt)}</h3>
                    <img 
                      src={`http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`} 
                      alt={forecast.weather[0].description} 
                    />
                    <p>{forecast.weather[0].description}</p>
                    <p>{Math.round(forecast.main.temp)}°C</p>
                    <p>Wind: {forecast.wind.speed} m/s</p>
                    <p>Humidity: {forecast.main.humidity}%</p>
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
