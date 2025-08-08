# TintWave - Weather App

## 🌤️ Overview
TintWave is a Progressive Web Application (PWA) built with React that provides real-time weather information with a sleek, modern interface. This project demonstrates my skills in API integration, PWA development, and creating responsive weather applications with dynamic theming based on weather conditions.

## ✨ Key Features
- **Real-time Weather Data** - Live weather updates using OpenWeatherMap API
- **Progressive Web App** - Installable on desktop and mobile devices
- **Location-based Weather** - Automatic location detection and manual search
- **5-Day Forecast** - Extended weather predictions
- **Dynamic Theming** - UI adapts to current weather conditions
- **Responsive Design** - Optimized for all screen sizes
- **Fast Loading** - Optimized performance and caching strategies

## 🛠️ Technologies Used
- **React 18** - Frontend framework with hooks
- **JavaScript (ES6+)** - Modern JavaScript features
- **PWA Technologies** - Service Workers, Web App Manifest
- **OpenWeatherMap API** - Weather data provider
- **CSS3/Styled Components** - Dynamic styling and animations
- **Responsive Design** - Mobile-first approach

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager
- OpenWeatherMap API key (free at [openweathermap.org](https://openweathermap.org/api))

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/tintwave

# Navigate to project directory
cd tintwave

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Add your OpenWeatherMap API key to .env
REACT_APP_WEATHER_API_KEY=your_api_key_here

# Start development server
npm start
```

The app will open at `http://localhost:3000`

### Building for Production
```bash
# Create production build
npm run build

# Serve locally to test PWA features
npx serve -s build
```


## 🎯 Core Functionality

### Weather Data
- Current weather conditions (temperature, humidity, pressure, wind)
- 5-day weather forecast
- Weather icons and descriptions
- Sunrise/sunset times
- "Feels like" temperature

### PWA Features
- **Service Worker** - Caches app shell and API responses
- **App Manifest** - Installable on home screen
- **Offline Mode** - Shows cached weather data when offline
- **Push Notifications** - Weather alerts (planned feature)

### User Experience
- **Auto-location** - Detects user's current location
- **City Search** - Search weather by city name
- **Favorites** - Save frequently checked locations
- **Dark/Light Mode** - Theme switching based on time/weather
- **Smooth Animations** - Weather transitions and loading states

## 🔗 API Integration
```javascript
// Example API call structure
const fetchWeatherData = async (city) => {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
  );
  return response.json();
};
```

## 🎯 Key Learning Outcomes
This project helped me master:
- **API Integration** - Working with external REST APIs
- **Async JavaScript** - Promises, async/await, error handling
- **PWA Development** - Service Workers, caching strategies
- **State Management** - Complex state with multiple data sources
- **Error Handling** - Network failures, API limits, invalid inputs

## 🔮 Future Enhancements
- **Geolocation** - Browser location APIs
- **Weather Maps** - Interactive radar and satellite imagery
- **Severe Weather Alerts** - Push notifications for weather warnings
- **Historical Data** - Weather trends and comparisons
- **Multiple Units** - Celsius, Fahrenheit, Kelvin support
- **Weather Widgets** - Customizable dashboard components
- **Social Sharing** - Share weather conditions on social media
- **Backend Integration** - User accounts and personalized settings
- **Advanced Analytics** - Weather patterns and predictions

## 📱 PWA Installation
Users can install TintWave directly from their browser:
1. Visit the app in Chrome/Edge/Firefox
2. Click the "Install" button in the address bar
3. App will be added to home screen/desktop

## 🌐 Environment Variables
```bash
REACT_APP_WEATHER_API_KEY=your_openweathermap_api_key
REACT_APP_APP_NAME=TintWave
```
---
