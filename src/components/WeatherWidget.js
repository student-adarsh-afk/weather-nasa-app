import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { getWeatherTip } from '../utils/weatherTips';

const WeatherWidget = ({ weatherData, loading, location }) => {
  if (loading) {
    return (
      <div className="section">
        <Container>
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        </Container>
      </div>
    );
  }

  if (!weatherData) return null;

  const { current, forecast } = weatherData;

  return (
    <div className="section">
      <Container>
        <div className="weather-widget">
          {/* Current Weather */}
          <div className="weather-current">
            <div className="weather-icon">
              {current.icon}
            </div>
            
            <div className="weather-details">
              <h2>{current.temperature}°C</h2>
              <p className="mb-1"><strong>{current.description}</strong></p>
              <div className="weather-tip">{getWeatherTip(current)}</div>
              <p className="mb-0">
                <i className="fas fa-map-marker-alt me-2"></i>
                {location.name}
              </p>
              <p className="mb-0 text-muted">
                H: {current.temperatureMax}° L: {current.temperatureMin}°
              </p>
            </div>
            
            <div className="weather-stats">
              <div className="weather-stat">
                <div className="weather-stat-label">Humidity</div>
                <div className="weather-stat-value">{current.humidity}%</div>
              </div>
              
              <div className="weather-stat">
                <div className="weather-stat-label">Wind Speed</div>
                <div className="weather-stat-value">{current.windSpeed} m/s</div>
              </div>
              
              <div className="weather-stat">
                <div className="weather-stat-label">Pressure</div>
                <div className="weather-stat-value">{current.pressure} hPa</div>
              </div>
              
              <div className="weather-stat">
                <div className="weather-stat-label">Solar Radiation</div>
                <div className="weather-stat-value">{current.solar} W/m²</div>
              </div>
            </div>
          </div>

          {/* 7-Day Forecast */}
          {forecast && forecast.length > 0 && (
            <div className="weather-forecast">
              <h3 className="mb-3">7-Day Forecast</h3>
              <div className="forecast-days">
                {forecast.map((day, index) => (
                  <div key={index} className="forecast-day">
                    <div className="forecast-day-name">{day.day}</div>
                    <div className="forecast-icon">{day.icon}</div>
                    <div className="forecast-temps">
                      <span className="forecast-high">{day.temperatureMax}°</span>
                      <span className="forecast-low">{day.temperatureMin}°</span>
                    </div>
                    <div className="text-muted small mt-1">{day.description}</div>
                    {day.precipitation > 0 && (
                      <div className="text-primary small">
                        <i className="fas fa-tint me-1"></i>
                        {day.precipitation}mm
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
      </Container>
    </div>
  );
};

export default WeatherWidget;