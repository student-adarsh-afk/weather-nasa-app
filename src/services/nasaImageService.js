import axios from 'axios';
import { API_CONFIG } from '../config/apiConfig';

/**
 * Service for handling NASA Earth Imagery API requests
 */
class NASAImageService {
  constructor() {
    this.imageCache = new Map();
    this.assetsCache = new Map();
    this.cacheTimeout = 24 * 60 * 60 * 1000; // 24 hours for images
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

  /**
   * Get satellite imagery for a specific location
   * @param {number} lat Latitude
   * @param {number} lon Longitude
   * @param {string|null} date Optional date in YYYY-MM-DD format
   * @returns {Promise<Object|null>} Image data or null
   */
  async getEarthImagery(lat, lon, date = null) {
    // Verify API key is configured
    if (!API_CONFIG.NASA_EARTH.apiKey || 
        API_CONFIG.NASA_EARTH.apiKey === 'YOUR_NASA_API_KEY_HERE') {
      console.warn('NASA Earth API key not configured');
      return null;
    }

    // Check if we have it cached
    const cacheKey = `earth-image-${lat}-${lon}-${date || 'latest'}`;
    const cached = this.getCachedData(cacheKey, this.imageCache);
    if (cached) return cached;

    try {
      const imageDate = date || new Date().toISOString().split('T')[0];
      const url = `${API_CONFIG.NASA_EARTH.baseUrl}${API_CONFIG.NASA_EARTH.endpoints.imagery}`;
      
      const response = await axios.get(url, {
        params: {
          lon: lon,
          lat: lat,
          date: imageDate,
          dim: 0.15, // Image dimension in degrees (~15km)
          api_key: API_CONFIG.NASA_EARTH.apiKey
        }
      });

      if (response.status === 200) {
        const imageData = {
          imageUrl: response.request.responseURL,
          date: imageDate,
          coordinates: { lat, lon }
        };
        
        this.setCachedData(cacheKey, imageData, this.imageCache);
        return imageData;
      }
      
      return null;
    } catch (error) {
      console.error('NASA Earth Imagery API Error:', error);
      return null;
    }
  }

  /**
   * Get available satellite imagery dates for a location
   * @param {number} lat Latitude
   * @param {number} lon Longitude
   * @returns {Promise<Array|null>} Available dates or null
   */
  async getAvailableDates(lat, lon) {
    // Verify API key is configured
    if (!API_CONFIG.NASA_EARTH.apiKey || 
        API_CONFIG.NASA_EARTH.apiKey === 'YOUR_NASA_API_KEY_HERE') {
      console.warn('NASA Earth API key not configured');
      return null;
    }

    // Check if we have it cached
    const cacheKey = `earth-assets-${lat}-${lon}`;
    const cached = this.getCachedData(cacheKey, this.assetsCache);
    if (cached) return cached;

    try {
      const url = `${API_CONFIG.NASA_EARTH.baseUrl}${API_CONFIG.NASA_EARTH.endpoints.assets}`;
      
      const response = await axios.get(url, {
        params: {
          lon: lon,
          lat: lat,
          begin: '2018-01-01', // Get data from past 2-3 years
          api_key: API_CONFIG.NASA_EARTH.apiKey
        }
      });

      if (response.data && response.data.results) {
        // Extract available dates
        const dates = response.data.results
          .map(item => item.date)
          .sort((a, b) => new Date(b) - new Date(a)); // Sort newest first
        
        this.setCachedData(cacheKey, dates, this.assetsCache);
        return dates;
      }
      
      return [];
    } catch (error) {
      console.error('NASA Earth Assets API Error:', error);
      return null;
    }
  }

  /**
   * Check if the NASA Earth API key is valid and working
   * @returns {Promise<boolean>} True if API key is valid
   */
  async isAPIKeyValid() {
    if (!API_CONFIG.NASA_EARTH.apiKey || 
        API_CONFIG.NASA_EARTH.apiKey === 'YOUR_NASA_API_KEY_HERE') {
      return false;
    }

    try {
      // Try a simple request to check if API key works
      const url = `${API_CONFIG.NASA_EARTH.baseUrl}${API_CONFIG.NASA_EARTH.endpoints.imagery}`;
      const response = await axios.get(url, {
        params: {
          lon: -95.33,  // NASA Johnson Space Center as test
          lat: 29.78,
          date: '2020-01-01', // Use a known date
          dim: 0.1,
          api_key: API_CONFIG.NASA_EARTH.apiKey
        }
      });
      
      return response.status === 200;
    } catch (error) {
      console.error('NASA API Key validation failed:', error);
      return false;
    }
  }
}

// Create and export a singleton instance
const nasaImageService = new NASAImageService();
export default nasaImageService;