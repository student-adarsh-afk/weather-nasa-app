import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import WeatherWidget from './components/WeatherWidget';
import ProductSection from './components/ProductSection';
import WeatherDashboard from './components/WeatherDashboard';
import WeatherMap from './components/WeatherMap';
import Footer from './components/Footer';
import weatherService from './services/weatherService';
import './App.css';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState({
    lat: 40.7128,
    lon: -74.0060,
    name: 'New York, NY'
  });

  // Load initial weather data
  useEffect(() => {
    loadWeatherData(currentLocation.lat, currentLocation.lon, currentLocation);
  }, []);

  const loadWeatherData = async (lat, lon, location = null) => {
    setLoading(true);
    try {
      const data = await weatherService.getWeatherData(lat, lon, location);
      setWeatherData(data);
      if (location) {
        setCurrentLocation(location);
      }
    } catch (error) {
      console.error('Error loading weather data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = (location) => {
    loadWeatherData(location.lat, location.lon, location);
  };

  return (
    <Router>
      <div className="App body-orange">
        <Header onLocationSelect={handleLocationSelect} />
        
        <Routes>
          <Route path="/" element={
            <main className="wrapper">
              <HeroSection />
              <WeatherWidget 
                weatherData={weatherData} 
                loading={loading}
                location={currentLocation}
              />
              <ProductSection />
            </main>
          } />
          
          <Route path="/dashboard" element={
            <WeatherDashboard 
              weatherData={weatherData}
              loading={loading}
              location={currentLocation}
              onLocationChange={handleLocationSelect}
            />
          } />
          
          <Route path="/maps" element={
            <WeatherMap 
              location={currentLocation}
              onLocationChange={handleLocationSelect}
              weatherData={weatherData}
              loading={loading}
            />
          } />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;