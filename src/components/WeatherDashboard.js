import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import weatherService from '../services/weatherService';
import NASAEarthImagery from './NASAEarthImagery';
import { getWeatherTip } from '../utils/weatherTips';

const WeatherDashboard = ({ weatherData, loading, location, onLocationChange }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const results = await weatherService.searchLocation(searchQuery);
      if (results.length > 0) {
        onLocationChange(results[0]);
      }
    }
  };

  if (loading) {
    return (
      <div className="section" style={{ minHeight: '100vh' }}>
        <Container>
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        </Container>
      </div>
    );
  }

  if (!weatherData) return null;

  const { current, forecast, hourly } = weatherData;

  return (
    <div className="section" style={{ minHeight: '100vh' }}>
      <Container fluid>
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <Card>
              <Card.Body className="d-flex justify-content-between align-items-center">
                <div>
                  <h2 className="mb-0">Weather Dashboard</h2>
                  <p className="text-muted mb-0">Comprehensive weather information for {location.name}</p>
                </div>
                <Form onSubmit={handleSearch} className="d-flex">
                  <Form.Control
                    type="search"
                    placeholder="Search location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="me-2"
                    style={{ width: '250px' }}
                  />
                  <Button variant="primary" type="submit">
                    <i className="fas fa-search"></i>
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          {/* Current Weather - Main Panel */}
          <Col lg={8}>
            <Card className="mb-4">
              <Card.Body>
                <div className="weather-current">
                  <div className="weather-icon">
                    {current.icon}
                  </div>
                  
                  <div className="weather-details">
                    <h1 className="display-4 mb-0">{current.temperature}°C</h1>
                    <h4 className="text-primary mb-2">{current.description}</h4>
                    <div className="weather-tip">{getWeatherTip(current)}</div>
                    <p className="mb-1">
                      <i className="fas fa-map-marker-alt me-2 text-danger"></i>
                      <strong>{location.name}</strong>
                    </p>
                    <p className="text-muted mb-0">
                      Feels like {current.temperature}°C • H: {current.temperatureMax}° L: {current.temperatureMin}°
                    </p>
                  </div>
                  
                  <div className="weather-stats">
                    <div className="weather-stat">
                      <div className="weather-stat-label">
                        <i className="fas fa-eye me-1"></i>Humidity
                      </div>
                      <div className="weather-stat-value">{current.humidity}%</div>
                    </div>
                    
                    <div className="weather-stat">
                      <div className="weather-stat-label">
                        <i className="fas fa-wind me-1"></i>Wind
                      </div>
                      <div className="weather-stat-value">{current.windSpeed} m/s</div>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* 7-Day Forecast */}
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">
                  <i className="fas fa-calendar me-2"></i>7-Day Forecast
                </h5>
              </Card.Header>
              <Card.Body>
                <div className="forecast-days">
                  {forecast && forecast.map((day, index) => (
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
                          <i className="fas fa-tint me-1"></i>{day.precipitation}mm
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>

            {/* Hourly Forecast */}
            {hourly && hourly.length > 0 && (
              <Card>
                <Card.Header>
                  <h5 className="mb-0">
                    <i className="fas fa-clock me-2"></i>24-Hour Forecast
                  </h5>
                </Card.Header>
                <Card.Body>
                  <div className="d-flex overflow-auto">
                    {hourly.slice(0, 12).map((hour, index) => (
                      <div key={index} className="text-center me-3" style={{ minWidth: '80px' }}>
                        <div className="small text-muted">
                          {new Date(hour.startTime).getHours()}:00
                        </div>
                        <div className="my-2" style={{ fontSize: '1.5rem' }}>
                          {hour.icon || '⛅'}
                        </div>
                        <div className="fw-bold">{Math.round(hour.temperature || 20)}°</div>
                        <div className="small text-muted">
                          {Math.round(hour.precipitationProbability || 0)}%
                        </div>
                      </div>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            )}
          </Col>

          {/* Side Panel */}
          <Col lg={4}>
            {/* Additional Weather Details */}
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">
                  <i className="fas fa-info-circle me-2"></i>Weather Details
                </h5>
              </Card.Header>
              <Card.Body>
                <div className="row g-3">
                  <div className="col-6">
                    <div className="text-center p-3 bg-light rounded">
                      <div className="text-muted small mb-1">Pressure</div>
                      <div className="fw-bold">{current.pressure} hPa</div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="text-center p-3 bg-light rounded">
                      <div className="text-muted small mb-1">Wind Direction</div>
                      <div className="fw-bold">{current.windDirection}°</div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="text-center p-3 bg-light rounded">
                      <div className="text-muted small mb-1">Solar Radiation</div>
                      <div className="fw-bold">{current.solar} W/m²</div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="text-center p-3 bg-light rounded">
                      <div className="text-muted small mb-1">Precipitation</div>
                      <div className="fw-bold">{current.precipitation} mm</div>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* NASA Earth Imagery */}
            <NASAEarthImagery location={location} />

            {/* Data Sources */}
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">
                  <i className="fas fa-database me-2"></i>Data Sources
                </h5>
              </Card.Header>
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  <div className="me-3">
                    <i className="fas fa-satellite text-primary" style={{ fontSize: '1.5rem' }}></i>
                  </div>
                  <div>
                    <div className="fw-bold">NASA POWER API</div>
                    <div className="small text-muted">Satellite-based meteorological data</div>
                  </div>
                </div>
                
                <div className="d-flex align-items-center mb-3">
                  <div className="me-3">
                    <i className="fas fa-cloud text-info" style={{ fontSize: '1.5rem' }}></i>
                  </div>
                  <div>
                    <div className="fw-bold">NOAA Weather Service</div>
                    <div className="small text-muted">Official weather forecasts and alerts</div>
                  </div>
                </div>
                
                <div className="text-center mt-3">
                  <small className="text-muted">
                    Data updated every 10 minutes
                  </small>
                </div>
              </Card.Body>
            </Card>

            {/* Quick Actions */}
            <Card>
              <Card.Header>
                <h5 className="mb-0">
                  <i className="fas fa-tools me-2"></i>Quick Actions
                </h5>
              </Card.Header>
              <Card.Body>
                <div className="d-grid gap-2">
                  <Button variant="outline-primary" href="/maps">
                    <i className="fas fa-map me-2"></i>View on Map
                  </Button>
                  <Button variant="outline-success" href="/">
                    <i className="fas fa-home me-2"></i>Back to Home
                  </Button>
                  <Button variant="outline-info" onClick={() => window.location.reload()}>
                    <i className="fas fa-sync me-2"></i>Refresh Data
                  </Button>
                </div>
                
                <hr />
                
                <div className="text-center">
                  <small className="text-muted">
                    <i className="fas fa-clock me-1"></i>
                    Last updated: {new Date().toLocaleTimeString()}
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default WeatherDashboard;