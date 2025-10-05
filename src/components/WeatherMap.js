import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { Container, Row, Col, Card, Button, ButtonGroup } from 'react-bootstrap';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getWeatherTip } from '../utils/weatherTips';

// Fix for default markers in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Map click handler component
function MapClickHandler({ onLocationChange }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onLocationChange({
        lat: lat,
        lon: lng,
        name: `${lat.toFixed(4)}, ${lng.toFixed(4)}`
      });
    },
  });
  return null;
}

const WeatherMap = ({ location, onLocationChange, weatherData, loading }) => {
  const [mapLayer, setMapLayer] = useState('osm');
  const [mapCenter, setMapCenter] = useState([location.lat, location.lon]);
  
  useEffect(() => {
    setMapCenter([location.lat, location.lon]);
  }, [location]);

  const mapLayers = {
    osm: {
      name: 'OpenStreetMap',
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '© OpenStreetMap contributors'
    },
    satellite: {
      name: 'Satellite',
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles © Esri'
    },
    terrain: {
      name: 'Terrain',
      url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      attribution: '© OpenTopoMap contributors'
    }
  };

  const handleLayerChange = (layer) => {
    setMapLayer(layer);
  };

  return (
    <div className="section" style={{ minHeight: '100vh' }}>
      <Container fluid>
        <Row>
          <Col lg={3}>
            <Card className="h-100">
              <Card.Header className="bg-primary text-white">
                <h5 className="mb-0">
                  <i className="fas fa-map me-2"></i>
                  Weather Maps
                </h5>
              </Card.Header>
              <Card.Body>
                <div className="mb-4">
                  <h6 className="orange-text">Map Layers</h6>
                  <ButtonGroup vertical className="w-100">
                    {Object.entries(mapLayers).map(([key, layer]) => (
                      <Button
                        key={key}
                        variant={mapLayer === key ? "primary" : "outline-primary"}
                        onClick={() => handleLayerChange(key)}
                        size="sm"
                      >
                        {layer.name}
                      </Button>
                    ))}
                  </ButtonGroup>
                </div>
                
                <div className="mb-4">
                  <h6 className="orange-text">Current Location</h6>
                  <div className="p-3 bg-light rounded">
                    <div className="fw-bold">{location.name}</div>
                    <div className="text-muted small">
                      <i className="fas fa-map-marker-alt me-1"></i>
                      {location.lat.toFixed(4)}, {location.lon.toFixed(4)}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h6 className="orange-text">Pinned Location Weather</h6>
                  <div className="p-3 bg-white rounded border">
                    {loading ? (
                      <div className="d-flex align-items-center">
                        <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                        <span>Loading weather…</span>
                      </div>
                    ) : weatherData && weatherData.current ? (
                      <div>
                        <div className="d-flex align-items-center mb-2">
                          <div style={{ fontSize: '2rem' }} className="me-2">{weatherData.current.icon}</div>
                          <div>
                            <div className="h4 mb-0">{weatherData.current.temperature}°C</div>
                            <div className="text-muted small">{weatherData.current.description}</div>
                            <div className="weather-tip mt-1">{getWeatherTip(weatherData.current)}</div>
                          </div>
                        </div>
                        <div className="row g-2 small">
                          <div className="col-6">
                            <div className="p-2 bg-light rounded">
                              <div className="text-muted">Humidity</div>
                              <div className="fw-bold">{weatherData.current.humidity}%</div>
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="p-2 bg-light rounded">
                              <div className="text-muted">Wind</div>
                              <div className="fw-bold">{weatherData.current.windSpeed} m/s</div>
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="p-2 bg-light rounded">
                              <div className="text-muted">Pressure</div>
                              <div className="fw-bold">{weatherData.current.pressure} hPa</div>
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="p-2 bg-light rounded">
                              <div className="text-muted">Precip.</div>
                              <div className="fw-bold">{weatherData.current.precipitation} mm</div>
                            </div>
                          </div>
                        </div>
                        <div className="text-muted small mt-2">
                          H: {weatherData.current.temperatureMax}° • L: {weatherData.current.temperatureMin}°
                        </div>
                      </div>
                    ) : (
                      <div className="text-muted">Click on the map to pin a location and view its weather.</div>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <h6 className="orange-text">Weather Layers</h6>
                  <div className="text-muted small">
                    Weather overlays coming soon! Currently showing base map layers.
                  </div>
                  <div className="mt-2">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" disabled />
                      <label className="form-check-label text-muted">
                        Temperature
                      </label>
                    </div>
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" disabled />
                      <label className="form-check-label text-muted">
                        Precipitation
                      </label>
                    </div>
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" disabled />
                      <label className="form-check-label text-muted">
                        Wind Speed
                      </label>
                    </div>
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" disabled />
                      <label className="form-check-label text-muted">
                        Clouds
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <h6 className="orange-text">Instructions</h6>
                  <div className="small text-muted">
                    <p><i className="fas fa-mouse-pointer me-2"></i>Click on the map to select a location</p>
                    <p><i className="fas fa-search-plus me-2"></i>Zoom in/out for detailed view</p>
                    <p><i className="fas fa-hand-paper me-2"></i>Drag to pan around</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={9}>
            <div className="weather-map">
              <MapContainer
                center={mapCenter}
                zoom={10}
                style={{ height: '600px', width: '100%' }}
                key={`${mapCenter[0]}-${mapCenter[1]}-${mapLayer}`}
              >
                <TileLayer
                  url={mapLayers[mapLayer].url}
                  attribution={mapLayers[mapLayer].attribution}
                />
                
                <Marker position={mapCenter}>
                  <Popup>
                    <div className="text-center">
                      <div className="fw-bold">{location.name}</div>
                      <div className="text-muted small">
                        {location.lat.toFixed(4)}, {location.lon.toFixed(4)}
                      </div>
                      {weatherData?.current && (
                        <div className="mt-2 small">
                          <div className="mb-1">{weatherData.current.icon} {weatherData.current.temperature}°C</div>
                          <div className="text-muted">{weatherData.current.description}</div>
                          <div className="mt-1">{getWeatherTip(weatherData.current)}</div>
                        </div>
                      )}
                    </div>
                  </Popup>
                </Marker>
                
                <MapClickHandler onLocationChange={onLocationChange} />
              </MapContainer>
            </div>
            
            <div className="mt-3">
              <Row>
                <Col md={6}>
                  <Card>
                    <Card.Body>
                      <h6 className="orange-text">
                        <i className="fas fa-layer-group me-2"></i>
                        Map Features
                      </h6>
                      <ul className="list-unstyled mb-0">
                        <li><i className="fas fa-check text-success me-2"></i>Interactive map navigation</li>
                        <li><i className="fas fa-check text-success me-2"></i>Multiple map layer options</li>
                        <li><i className="fas fa-check text-success me-2"></i>Click-to-select locations</li>
                        <li><i className="fas fa-clock text-warning me-2"></i>Weather overlays (coming soon)</li>
                      </ul>
                    </Card.Body>
                  </Card>
                </Col>
                
                <Col md={6}>
                  <Card>
                    <Card.Body>
                      <h6 className="orange-text">
                        <i className="fas fa-info-circle me-2"></i>
                        Data Sources
                      </h6>
                      <ul className="list-unstyled mb-0">
                        <li><i className="fas fa-satellite me-2"></i>NASA POWER API</li>
                        <li><i className="fas fa-cloud me-2"></i>NOAA Weather Service</li>
                        <li><i className="fas fa-globe me-2"></i>OpenStreetMap</li>
                        <li><i className="fas fa-map me-2"></i>Multiple tile providers</li>
                      </ul>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default WeatherMap;