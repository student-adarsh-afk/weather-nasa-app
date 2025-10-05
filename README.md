# ClimaSync - NASA POWER API Weather Platform

A complete weather platform built with React, featuring OpenWeather-style UI/UX but powered by free NASA POWER API and NOAA Weather Services instead of OpenWeather's paid APIs.

## 🌟 Features

- **Exact OpenWeather UI**: Same design, colors, typography, and layout
- **Free APIs**: Powered by NASA POWER API and NOAA Weather Service (no API keys required for basic use)
- **Interactive Maps**: Leaflet-based weather maps with multiple layers
- **Weather Dashboard**: Comprehensive weather data visualization
- **Responsive Design**: Mobile-first, works on all devices
- **Real Weather Data**: NASA satellite data and NOAA forecasts

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone or download the project**:
   ```bash
   cd weather-clone
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm start
   ```

4. **Open browser** to `http://localhost:3000`

## 🔧 API Configuration

The app works with **free APIs by default** (no API keys required), but you can enhance it with additional APIs:

### 🔑 Where to Add API Keys

Edit `src/config/apiConfig.js` and add your API keys:

```javascript
export const API_CONFIG = {
  // OpenWeather API (Optional - for enhanced features)
  OPENWEATHER: {
    apiKey: 'YOUR_OPENWEATHER_API_KEY_HERE', // Get from: https://openweathermap.org/api
    // ... rest of config
  },

  // NASA API (Optional - for Earth imagery)
  NASA_EARTH: {
    apiKey: 'YOUR_NASA_API_KEY_HERE', // Get from: https://api.nasa.gov/ (or use 'DEMO_KEY')
    // ... rest of config
  },
};
```

### 🆓 Free APIs Used (No Keys Required)

1. **NASA POWER API**: Global meteorological data
   - URL: https://power.larc.nasa.gov/api
   - Data: Temperature, humidity, wind, solar radiation
   - Coverage: Global, 46+ years of history

2. **NOAA Weather API**: US weather forecasts
   - URL: https://api.weather.gov
   - Data: Current conditions, forecasts, alerts
   - Coverage: United States

3. **OpenStreetMap Nominatim**: Geocoding
   - URL: https://nominatim.openstreetmap.org
   - Data: Location search and reverse geocoding
   - Usage: Free with attribution

### 🔗 Optional API Keys

#### 1. OpenWeather API Key (for enhanced features)
- **Get API Key**: https://openweathermap.org/api
- **Free Tier**: 1,000 calls/day
- **Add to**: `apiConfig.js` → `OPENWEATHER.apiKey`

#### 2. NASA API Key (for Earth imagery)
- **Get API Key**: https://api.nasa.gov/
- **Free Tier**: 1,000 requests/hour
- **Demo Key**: Use `'DEMO_KEY'` for testing
- **Add to**: `apiConfig.js` → `NASA_EARTH.apiKey`

## 🏗️ Project Structure

```
weather-clone/
├── public/
│   ├── index.html          # HTML template
│   └── ...
├── src/
│   ├── components/         # React components
│   │   ├── Header.js       # Navigation & search
│   │   ├── WeatherWidget.js # Current weather display
│   │   ├── WeatherMap.js   # Interactive maps
│   │   ├── WeatherDashboard.js # Detailed dashboard
│   │   └── ...
│   ├── config/
│   │   └── apiConfig.js    # 🔑 API configuration
│   ├── services/
│   │   └── weatherService.js # API integration
│   ├── App.js              # Main app component
│   ├── App.css             # OpenWeather-style CSS
│   └── index.js            # React entry point
├── package.json
└── README.md
```

## 🎨 UI Components

### Exact OpenWeather Recreation

- **Colors**: Same orange (#e96e50) theme and color variations
- **Typography**: Oswald + Roboto fonts matching original
- **Layout**: Bootstrap-based responsive grid system
- **Components**: Header, hero section, API cards, weather widgets
- **Animations**: Hover effects, transitions, loading states

### Key Pages

1. **Homepage** (`/`): Landing page with API showcase
2. **Dashboard** (`/dashboard`): Detailed weather information
3. **Maps** (`/maps`): Interactive weather mapping

## 🌍 APIs & Data Sources

### NASA POWER API
```javascript
// Example usage
const response = await fetch(`https://power.larc.nasa.gov/api/temporal/daily/point?parameters=T2M,PRECTOTCORR&community=RE&longitude=-74&latitude=40&start=20231201&end=20231201&format=JSON`);
```

**Available Parameters**:
- `T2M`: Temperature at 2 meters
- `T2M_MIN/T2M_MAX`: Min/Max temperature
- `PRECTOTCORR`: Precipitation
- `WS2M`: Wind speed at 2 meters
- `RH2M`: Relative humidity
- `PS`: Surface pressure
- `ALLSKY_SFC_SW_DWN`: Solar radiation

### NOAA Weather API
```javascript
// Example usage
const response = await fetch(`https://api.weather.gov/points/40.7128,-74.0060`);
```

**Features**:
- Current weather conditions
- 7-day forecasts
- Hourly forecasts
- Weather alerts
- US coverage only

## 🔧 Customization

### Adding New Weather Parameters

1. **Update API Config**:
   ```javascript
   export const NASA_PARAMETERS = {
     temperature: 'T2M,T2M_MIN,T2M_MAX',
     newParameter: 'YOUR_NASA_PARAMETER', // Add here
   };
   ```

2. **Modify Weather Service**:
   ```javascript
   // In src/services/weatherService.js
   formatNASACurrentData(response, lat, lon) {
     // Add new parameter processing
   }
   ```

3. **Update UI Components**:
   ```javascript
   // In components/WeatherWidget.js
   <div className="weather-stat">
     <div className="weather-stat-label">New Parameter</div>
     <div className="weather-stat-value">{current.newParameter}</div>
   </div>
   ```

## 📱 Mobile & Responsive

- **Mobile-first design** with breakpoints at 576px, 768px, 1024px
- **Touch-friendly** interface with proper tap targets
- **Progressive enhancement** from mobile to desktop
- **Optimized images** and assets for different screen densities

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy Options

1. **Netlify**: Drag & drop `build` folder
2. **Vercel**: Connect GitHub repository
3. **GitHub Pages**: Enable in repository settings
4. **Traditional hosting**: Upload `build` folder contents

### Environment Variables

For production deployment, set environment variables:

```bash
REACT_APP_OPENWEATHER_API_KEY=your_openweather_key
REACT_APP_NASA_API_KEY=your_nasa_key
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit pull request

## 📄 License

This project is for educational purposes. Weather data provided by NASA POWER API and NOAA Weather Service. UI design inspired by OpenWeatherMap.

## 🆘 Troubleshooting

### Common Issues

1. **Maps not loading**: Check internet connection and Leaflet scripts
2. **Weather data not loading**: Check API endpoints and CORS policies
3. **Styling issues**: Ensure Bootstrap and custom CSS are loading
4. **Location search not working**: Check Nominatim service availability

### Getting Help

1. Check browser console for errors
2. Verify API endpoints in Network tab
3. Ensure all dependencies are installed
4. Check React version compatibility

---

**Built with ❤️ using React, NASA POWER API, and NOAA Weather Services**