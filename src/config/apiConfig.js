// API Configuration - Add your API keys here
export const API_CONFIG = {
  // NASA POWER API (Free - No API key required)
  NASA_POWER: {
    baseUrl: 'https://power.larc.nasa.gov/api',
    endpoints: {
      daily: '/temporal/daily/point',
      monthly: '/temporal/monthly/point',
      climatology: '/temporal/climatology/point'
    }
  },

  // NOAA Weather API (Free - No API key required for basic use)
  NOAA: {
    baseUrl: 'https://api.weather.gov',
    endpoints: {
      points: '/points',
      forecast: '/gridpoints',
      alerts: '/alerts'
    }
  },

  // WeatherAPI.com (Recommended Free Alternative - 1M calls/month)
  WEATHERAPI: {
    apiKey: '90bfdb7fc073429f910192501250410', // Get free key from: https://www.weatherapi.com/signup.aspx
    baseUrl: 'https://api.weatherapi.com/v1',
    endpoints: {
      current: '/current.json',
      forecast: '/forecast.json',
      history: '/history.json',
      search: '/search.json',
      marine: '/marine.json',
      astronomy: '/astronomy.json'
    }
  },

  // OpenWeather API (Fallback - ADD YOUR API KEY HERE)
  OPENWEATHER: {
    apiKey: 'YOUR_OPENWEATHER_API_KEY_HERE', // Replace with your API key
    baseUrl: 'https://api.openweathermap.org/data/2.5',
    endpoints: {
      current: '/weather',
      forecast: '/forecast',
      onecall: '/onecall'
    }
  },

  // NASA Earth Imagery API - ADD YOUR NASA API KEY HERE
  NASA_EARTH: {
    apiKey: 'YVDiriNIehlpiijAuSUpeBmcmJbjE8f4y7wUaMyt', // Replace with your NASA API key or use 'DEMO_KEY'
    baseUrl: 'https://api.nasa.gov',
    endpoints: {
      imagery: '/planetary/earth/imagery',
      assets: '/planetary/earth/assets'
    }
  },

  // Weather Map Services
  MAPS: {
    // OpenStreetMap (Free)
    osm: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    // Weather overlay (if available)
    weather: 'https://tile.openweathermap.org/map/{layer}/{z}/{x}/{y}.png'
  }
};

// Default parameters for NASA POWER API
export const NASA_PARAMETERS = {
  temperature: 'T2M,T2M_MIN,T2M_MAX',
  precipitation: 'PRECTOTCORR',
  wind: 'WS2M,WD2M',
  humidity: 'RH2M',
  pressure: 'PS',
  solar: 'ALLSKY_SFC_SW_DWN',
  uv: 'ALLSKY_UVB'
};

// Helper function to get date ranges
export const getDateRange = (days = 7) => {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - days);
  
  return {
    start: start.toISOString().split('T')[0].replace(/-/g, ''),
    end: end.toISOString().split('T')[0].replace(/-/g, '')
  };
};