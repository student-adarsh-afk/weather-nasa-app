import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const APISection = () => {
  const apiTypes = [
    {
      icon: '🌡️',
      title: 'Current Weather',
      description: 'Real-time weather data',
      subtitle: '(current)'
    },
    {
      icon: '⏰',
      title: 'Hourly Forecast', 
      description: 'Next 48 hours',
      subtitle: '(2 days)'
    },
    {
      icon: '📅',
      title: 'Daily Forecast',
      description: 'Next 7 days',
      subtitle: '(7 days)'
    },
    {
      icon: '🌡️',
      title: 'Climate Forecast',
      description: 'Monthly averages',
      subtitle: '(30 days)'
    },
    {
      icon: '📚',
      title: 'Historical Weather',
      description: '46+ years back',
      subtitle: '(archive)'
    }
  ];

  return (
    <>
      {/* One Call API Section */}
      <div className="section">
        <Container>
          <div className="section-content grid-container grid-1-1">
            <div>
              <span className="orange-text h4">APIs</span>
              <h2 className="main-page-subheaders">
                NASA POWER API Integration
              </h2>
              <p>
                Access comprehensive weather data from NASA's POWER (Prediction of Worldwide Energy Resources) database.
                Get historical, current, and forecast data with <strong>free access</strong>.
              </p>
              <div className="mt-4">
                <h5>Included data</h5>
                <div className="row">
                  <div className="col-md-6">
                    <ul className="list-unstyled">
                      <li><strong>Current</strong> weather conditions</li>
                      <li><strong>Hourly</strong> forecast (48 hours)</li>
                      <li><strong>Daily</strong> forecast (7 days)</li>
                      <li><strong>Historical</strong> data (46+ years)</li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <ul className="list-unstyled">
                      <li>Solar radiation data</li>
                      <li>Temperature & humidity</li>
                      <li>Wind speed & direction</li>
                      <li>Atmospheric pressure</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center">
              <img 
                src="https://via.placeholder.com/500x300/e96e50/ffffff?text=NASA+POWER+API" 
                alt="NASA POWER API" 
                className="img-fluid rounded"
                style={{ maxWidth: '100%' }}
              />
            </div>
          </div>
        </Container>
      </div>

      {/* Professional APIs Section */}
      <div className="section orange-background">
        <Container>
          <div className="section-content text-center">
            <p className="h4 mb-4">
              Use our <span className="text-dark">Professional collections</span> to get extended weather data for any coordinates on the globe
            </p>
            <p className="lead mb-5">
              For professionals and specialists with middle and large sized projects, we recommend our Professional collections. They include either an extended data set, or various tools for receiving and displaying data and more.
            </p>
            
            <div className="api-icons">
              {apiTypes.map((api, index) => (
                <div key={index} className="stats white-text">
                  <div style={{ fontSize: '3rem', marginBottom: '15px' }}>
                    {api.icon}
                  </div>
                  <h3>{api.title}</h3>
                  <span>{api.subtitle}</span>
                  <p className="mt-2 mb-0" style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                    {api.description}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="mt-5">
              <p><strong>Called by:</strong><br />
                Geographic coordinates, city name, zip/postal code, or city ID
              </p>
              <a href="#api" className="ow-btn btn-black round">Learn More</a>
            </div>
          </div>
        </Container>
      </div>

      {/* Weather for Any Coordinates */}
      <div className="section">
        <Container>
          <div className="section-content grid-container grid-1-1">
            <div>
              <span className="orange-text h4">Weather data</span>
              <h2 className="main-page-subheaders">
                Weather for <span className="orange-text">any</span> geographic coordinates on the globe
              </h2>
              <img 
                src="https://via.placeholder.com/500x300/2c3e50/ffffff?text=Global+Coverage" 
                alt="Global weather coverage" 
                className="img-fluid rounded"
              />
            </div>
            <div>
              <p>
                For each point on the globe, we provide historical, current and forecasted weather data via light-speed APIs powered by NASA POWER and NOAA services.
              </p>
              <p><strong>Minute-by-minute forecast</strong></p>
              <p><strong>Other forecasts:</strong><br />
                Hourly (2-day), Daily (7-day), Climate forecast (monthly averages)
              </p>
              <p><strong>Historical data</strong><br />
                With 46+ years archive for any coordinates via NASA POWER API
              </p>
            </div>
          </div>
        </Container>
      </div>

      {/* Current Weather Data */}
      <div className="section grey-background">
        <Container>
          <div className="section-content grid-container grid-1-1">
            <div>
              <span className="orange-text h4">Weather data</span>
              <h2 className="main-page-subheaders">Current weather data</h2>
              <img 
                src="https://via.placeholder.com/500x300/27ae60/ffffff?text=Current+Weather" 
                alt="Current weather data" 
                className="img-fluid rounded"
              />
            </div>
            <div>
              <p>
                Access current weather data for any location on Earth including over 200,000 cities! 
                The data is frequently updated based on NASA satellite data, NOAA weather models, and global weather station networks.
              </p>
              <div className="text-block p-4 border-start border-warning border-4 bg-white rounded">
                <h5>How to obtain</h5>
                <p><strong>APIs</strong><br />
                  Free access via NASA POWER and NOAA Weather Service
                </p>
                <p><strong>Coverage</strong><br />
                  Global coverage with coordinates precision
                </p>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
};

export default APISection;