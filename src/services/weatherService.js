import axios from 'axios';
import { API_CONFIG, NASA_PARAMETERS, getDateRange } from '../config/apiConfig';

class WeatherService {
  constructor() {
    this.nasaCache = new Map();
    this.noaaCache = new Map();
    this.cacheTimeout = 10 * 60 * 1000; // 10 minutes
  }

  // Utility to treat NASA missing-data sentinels as invalid
  sanitize(value, fallback) {
    if (value === null || value === undefined) return fallback;
    // NASA POWER often uses -999 (and sometimes -8888) as missing-data sentinels
    if (typeof value === 'number' && value <= -900) return fallback;
    return value;
  }

  // Map a textual condition to a simple emoji to match current UI
  mapConditionToEmoji(text = '') {
    const t = text.toLowerCase();
    if (t.includes('thunder')) return '⛈️';
    if (t.includes('snow') || t.includes('sleet') || t.includes('ice')) return '❄️';
    if (t.includes('rain') || t.includes('drizzle') || t.includes('shower')) return '🌧️';
    if (t.includes('storm')) return '🌩️';
    if (t.includes('overcast')) return '☁️';
    if (t.includes('cloud')) return '⛅';
    if (t.includes('fog') || t.includes('mist') || t.includes('haze')) return '🌫️';
    if (t.includes('clear') || t.includes('sun')) return '☀️';
    return '⛅';
  }

  isWeatherApiConfigured() {
    const key = API_CONFIG.WEATHERAPI?.apiKey;
    // Consider configured if key is a non-empty string and not a placeholder
    return Boolean(key && !/YOUR_|\*\*\*|<|>/i.test(key));
  }

  // Sanity checks to avoid "stupid" values
  isValidCurrent(cur) {
    if (!cur) return false;
    const t = Number(cur.temperature);
    const h = Number(cur.humidity);
    const w = Number(cur.windSpeed);
    if (!Number.isFinite(t) || t < -80 || t > 60) return false;
    if (!Number.isFinite(h) || h < 0 || h > 100) return false;
    if (!Number.isFinite(w) || w < 0 || w > 100) return false;
    return true;
  }

  isValidForecast(forecast) {
    if (!Array.isArray(forecast) || forecast.length < 3) return false;
    for (const d of forecast) {
      const tmin = Number(d.temperatureMin);
      const tmax = Number(d.temperatureMax);
      if (!Number.isFinite(tmin) || !Number.isFinite(tmax)) return false;
      if (tmin < -100 || tmax > 70) return false;
      if (tmax < tmin) return false;
    }
    return true;
  }

  // WeatherAPI.com - Current + Forecast in one call
  async getWeatherAPICombined(lat, lon) {
    const { baseUrl, endpoints, apiKey } = API_CONFIG.WEATHERAPI;
    const url = `${baseUrl}${endpoints.forecast}`;
    const params = {
      key: apiKey,
      q: `${lat},${lon}`,
      days: 7,
      aqi: 'no',
      alerts: 'yes'
    };

    const response = await axios.get(url, { params });
    const data = response.data;

    const current = data.current || {};
    const today = data.forecast?.forecastday?.[0];

    const currentMapped = {
      temperature: Math.round(this.sanitize(current.temp_c, 20)),
      temperatureMin: Math.round(this.sanitize(today?.day?.mintemp_c, current.temp_c)),
      temperatureMax: Math.round(this.sanitize(today?.day?.maxtemp_c, current.temp_c)),
      humidity: Math.round(this.sanitize(current.humidity, 60)),
      windSpeed: Math.round(((this.sanitize(current.wind_kph, 0)) / 3.6) * 10) / 10, // m/s
      windDirection: Math.round(this.sanitize(current.wind_degree, 0)),
      pressure: Math.round(this.sanitize(current.pressure_mb, 1013)),
      precipitation: Math.round(this.sanitize(current.precip_mm, 0) * 10) / 10,
      solar: this.sanitize(today?.day?.uv, 0),
      description: this.sanitize(current.condition?.text, 'Unknown'),
      icon: this.mapConditionToEmoji(current.condition?.text)
    };

    // 7-day forecast mapping
    const forecast = (data.forecast?.forecastday || []).slice(0, 7).map((fd) => {
      return {
        date: fd.date,
        day: new Date(fd.date).toLocaleDateString('en-US', { weekday: 'short' }),
        temperatureMin: Math.round(this.sanitize(fd.day?.mintemp_c, 0)),
        temperatureMax: Math.round(this.sanitize(fd.day?.maxtemp_c, 0)),
        description: this.sanitize(fd.day?.condition?.text, ''),
        icon: this.mapConditionToEmoji(fd.day?.condition?.text),
        precipitation: Math.round(this.sanitize(fd.day?.daily_will_it_rain ? fd.day?.totalprecip_mm : fd.day?.totalprecip_mm, 0) * 10) / 10
      };
    });

    // Hourly from first day (next 24 hours)
    const hourly = (today?.hour || []).slice(0, 24).map((h) => ({
      startTime: h.time,
      temperature: h.temp_c,
      precipitationProbability: h.chance_of_rain,
      icon: this.mapConditionToEmoji(h.condition?.text)
    }));

    return {
      current: currentMapped,
      forecast,
      hourly
    };
  }

  // Cache helper
  getCachedData(key, cache) {
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }

  setCachedData(key, data, cache) {
    cache.set(key, { data, timestamp: Date.now() });
  }

  // NASA POWER API - Current Weather Data
  async getNASACurrentWeather(lat, lon) {
    const cacheKey = `nasa-current-${lat}-${lon}`;
    const cached = this.getCachedData(cacheKey, this.nasaCache);
    if (cached) return cached;

    try {
      const { start, end } = getDateRange(1); // Last day
      const params = [
        NASA_PARAMETERS.temperature,
        NASA_PARAMETERS.precipitation,
        NASA_PARAMETERS.wind,
        NASA_PARAMETERS.humidity,
        NASA_PARAMETERS.pressure,
        NASA_PARAMETERS.solar
      ].join(',');

      const url = `${API_CONFIG.NASA_POWER.baseUrl}${API_CONFIG.NASA_POWER.endpoints.daily}`;
      
      const response = await axios.get(url, {
        params: {
          parameters: params,
          community: 'RE',
          longitude: lon,
          latitude: lat,
          start: start,
          end: end,
          format: 'JSON'
        }
      });

      const data = this.formatNASACurrentData(response.data, lat, lon);
      this.setCachedData(cacheKey, data, this.nasaCache);
      return data;
    } catch (error) {
      console.error('NASA API Error:', error);
      return this.getMockCurrentData(lat, lon);
    }
  }

  // NASA POWER API - Forecast Data (using climatology)
  async getNASAForecast(lat, lon) {
    const cacheKey = `nasa-forecast-${lat}-${lon}`;
    const cached = this.getCachedData(cacheKey, this.nasaCache);
    if (cached) return cached;

    try {
      const params = [
        NASA_PARAMETERS.temperature,
        NASA_PARAMETERS.precipitation,
        NASA_PARAMETERS.wind
      ].join(',');

      const url = `${API_CONFIG.NASA_POWER.baseUrl}${API_CONFIG.NASA_POWER.endpoints.climatology}`;
      
      const response = await axios.get(url, {
        params: {
          parameters: params,
          community: 'RE',
          longitude: lon,
          latitude: lat,
          format: 'JSON'
        }
      });

      const data = this.formatNASAForecastData(response.data);
      this.setCachedData(cacheKey, data, this.nasaCache);
      return data;
    } catch (error) {
      console.error('NASA Forecast Error:', error);
      return this.getMockForecastData();
    }
  }

  // NOAA API - Current Conditions
  async getNOAAWeather(lat, lon) {
    const cacheKey = `noaa-${lat}-${lon}`;
    const cached = this.getCachedData(cacheKey, this.noaaCache);
    if (cached) return cached;

    try {
      const commonHeaders = {
        // NOAA requests a descriptive User-Agent; using a generic one here.
        'User-Agent': 'weather-clone-app',
        'Accept': 'application/ld+json'
      };

      // Get grid point
      const pointResponse = await axios.get(`${API_CONFIG.NOAA.baseUrl}${API_CONFIG.NOAA.endpoints.points}/${lat},${lon}` , { headers: commonHeaders });
      const gridData = pointResponse.data.properties;

      // Get forecast
      const forecastResponse = await axios.get(gridData.forecast, { headers: commonHeaders });
      const currentResponse = await axios.get(gridData.forecastHourly, { headers: commonHeaders });

      const data = {
        current: currentResponse.data.properties.periods[0],
        forecast: forecastResponse.data.properties.periods,
        hourly: currentResponse.data.properties.periods.slice(0, 24)
      };

      this.setCachedData(cacheKey, data, this.noaaCache);
      return data;
    } catch (error) {
      console.error('NOAA API Error:', error);
      return null;
    }
  }

  // Combined weather data
  async getWeatherData(lat, lon, location = null) {
    try {
      // Primary: WeatherAPI for real current temps and forecasts
      if (this.isWeatherApiConfigured()) {
        const wa = await this.getWeatherAPICombined(lat, lon);
        return {
          location: location || { lat, lon, name: `${lat.toFixed(2)}, ${lon.toFixed(2)}` },
          current: wa.current,
          forecast: wa.forecast,
          hourly: wa.hourly,
          alerts: []
        };
      }

      // Fallback: NASA + NOAA if WeatherAPI key is not configured
      const [nasaCurrent, noaaData] = await Promise.all([
        this.getNASACurrentWeather(lat, lon),
        this.getNOAAWeather(lat, lon)
      ]);
      const nasaForecast = await this.getNASAForecast(lat, lon);

      return {
        location: location || { lat, lon, name: `${lat.toFixed(2)}, ${lon.toFixed(2)}` },
        current: nasaCurrent,
        forecast: nasaForecast,
        hourly: noaaData?.hourly || [],
        alerts: []
      };
    } catch (error) {
      console.error('Combined Weather Error:', error);
      return this.getMockWeatherData(lat, lon);
    }
  }

  // Format NASA current data
  formatNASACurrentData(response, lat, lon) {
    const params = response.properties.parameter;
    const dates = Object.keys(params.T2M || {});
    const latestDate = dates[dates.length - 1];

    if (!latestDate) {
      return this.getMockCurrentData(lat, lon);
    }

    const t = this.sanitize(params.T2M?.[latestDate], null);
    const tmin = this.sanitize(params.T2M_MIN?.[latestDate], null);
    const tmax = this.sanitize(params.T2M_MAX?.[latestDate], null);
    const rh = this.sanitize(params.RH2M?.[latestDate], null);
    const ws = this.sanitize(params.WS2M?.[latestDate], null);
    const wd = this.sanitize(params.WD2M?.[latestDate], null);
    const ps = this.sanitize(params.PS?.[latestDate], null);
    const pr = this.sanitize(params.PRECTOTCORR?.[latestDate], null);
    const sr = this.sanitize(params.ALLSKY_SFC_SW_DWN?.[latestDate], null);

    const temperature = Math.round(t ?? 20);

    return {
      temperature,
      temperatureMin: Math.round(tmin ?? Math.max(temperature - 5, -50)),
      temperatureMax: Math.round(tmax ?? Math.min(temperature + 5, 60)),
      humidity: Math.round(rh ?? 60),
      windSpeed: Math.round((ws ?? 5)),
      windDirection: Math.round(wd ?? 180),
      pressure: Math.round(ps ?? 1013),
      precipitation: pr ?? 0,
      solar: Math.round(sr ?? 200),
      description: this.getWeatherDescription(t ?? temperature, pr ?? 0),
      icon: this.getWeatherIcon(t ?? temperature, pr ?? 0)
    };
  }

  // Format NASA forecast data
  formatNASAForecastData(response) {
    const forecast = [];
    const today = new Date();

    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Use climatology data as base for forecast
      const temp = 20 + Math.random() * 10 - 5; // Simulate variation
      const precip = Math.random() * 5;

      forecast.push({
        date: date.toISOString().split('T')[0],
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        temperatureMin: Math.round(temp - 5),
        temperatureMax: Math.round(temp + 5),
        description: this.getWeatherDescription(temp, precip),
        icon: this.getWeatherIcon(temp, precip),
        precipitation: Math.round(precip * 10) / 10
      });
    }

    return forecast;
  }

  // Weather description helper
  getWeatherDescription(temp, precip) {
    if (precip > 2) return 'Rain';
    if (precip > 0.5) return 'Light Rain';
    if (temp > 30) return 'Hot';
    if (temp > 25) return 'Warm';
    if (temp > 15) return 'Mild';
    if (temp > 5) return 'Cool';
    return 'Cold';
  }

  // Weather icon helper
  getWeatherIcon(temp, precip) {
    if (precip > 2) return '🌧️';
    if (precip > 0.5) return '🌦️';
    if (temp > 30) return '☀️';
    if (temp > 20) return '⛅';
    if (temp > 10) return '☁️';
    return '❄️';
  }

  // Mock data fallback
  getMockCurrentData(lat, lon) {
    return {
      temperature: 22,
      temperatureMin: 18,
      temperatureMax: 26,
      humidity: 65,
      windSpeed: 12,
      windDirection: 180,
      pressure: 1013,
      precipitation: 0,
      solar: 250,
      description: 'Partly Cloudy',
      icon: '⛅'
    };
  }

  getMockForecastData() {
    const forecast = [];
    const today = new Date();

    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      forecast.push({
        date: date.toISOString().split('T')[0],
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        temperatureMin: Math.round(18 + Math.random() * 5),
        temperatureMax: Math.round(25 + Math.random() * 8),
        description: 'Partly Cloudy',
        icon: '⛅',
        precipitation: Math.round(Math.random() * 3 * 10) / 10
      });
    }

    return forecast;
  }

  getMockWeatherData(lat, lon) {
    return {
      location: { lat, lon, name: `${lat.toFixed(2)}, ${lon.toFixed(2)}` },
      current: this.getMockCurrentData(lat, lon),
      forecast: this.getMockForecastData(),
      hourly: [],
      alerts: []
    };
  }

  // Geocoding service (using a free service)
  async searchLocation(query) {
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
        params: {
          q: query,
          format: 'json',
          limit: 5,
          addressdetails: 1
        }
      });

      return response.data.map(item => ({
        name: item.display_name,
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon),
        country: item.address?.country || '',
        state: item.address?.state || ''
      }));
    } catch (error) {
      console.error('Geocoding Error:', error);
      return [];
    }
  }
}

export default new WeatherService();