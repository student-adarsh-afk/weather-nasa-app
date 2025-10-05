import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const ProductSection = () => {

  return (
    <>

      {/* Weather Maps Section */}
      <div className="section grey-background">
        <Container>
          <div className="section-content">
            <Row className="align-items-center">
              <Col md={6}>
                <div>
                  <span className="orange-text h4">Weather maps</span>
                  <h2 className="main-page-subheaders">Forecast, Current and Historical</h2>
                  <p>
                    Using interactive mapping technology, you can get comprehensive weather visualizations 
                    including current conditions, forecasts, and historical data overlays.
                  </p>
                  <p>
                    <strong>Multiple map layers</strong> include the most useful data, such as precipitation, 
                    clouds, pressure, temperature, wind, and much more.
                  </p>
                  <p>
                    <strong>Interactive weather map</strong> allows you to watch for current temperature and 
                    weather conditions in your city or any other location on the interactive global map.
                  </p>
                  <a href="/maps" className="ow-btn btn-black round">View Maps</a>
                </div>
              </Col>
              <Col md={6}>
                <div className="text-center">
                  <img 
                    src="https://via.placeholder.com/500x350/34495e/ffffff?text=Interactive+Weather+Maps" 
                    alt="Weather maps" 
                    className="img-fluid rounded"
                  />
                </div>
              </Col>
            </Row>
          </div>
        </Container>
      </div>

      {/* Dashboard Overview */}
      <div className="section">
        <Container>
          <div className="section-content text-center">
            <h2>Weather Dashboard</h2>
            <p className="lead">
              Our main weather dashboard provides a complete overview of meteorological conditions anywhere on the globe. 
              Track current weather, view detailed forecasts, and analyse interactive maps in one powerful and intuitive interface.
            </p>
            
            <Row className="mt-5">
              <Col md={3}>
                <div className="text-center mb-4">
                  <div className="mb-3" style={{ fontSize: '3rem' }}>🌍</div>
                  <h5>Global Coverage</h5>
                  <p>For any city or coordinates</p>
                </div>
              </Col>
              <Col md={3}>
                <div className="text-center mb-4">
                  <div className="mb-3" style={{ fontSize: '3rem' }}>⏰</div>
                  <h5>Detailed Forecasts</h5>
                  <p>Hourly and daily predictions</p>
                </div>
              </Col>
              <Col md={3}>
                <div className="text-center mb-4">
                  <div className="mb-3" style={{ fontSize: '3rem' }}>🗺️</div>
                  <h5>Interactive Maps</h5>
                  <p>Temperature, wind, precipitation</p>
                </div>
              </Col>
              <Col md={3}>
                <div className="text-center mb-4">
                  <div className="mb-3" style={{ fontSize: '3rem' }}>📱</div>
                  <h5>User-Friendly</h5>
                  <p>Simple and intuitive interface</p>
                </div>
              </Col>
            </Row>
            
            <div className="mt-4">
              <a href="/dashboard" className="ow-btn btn-orange round me-3">
                Open Dashboard
              </a>
              <a href="/maps" className="ow-btn btn-black round">
                View Maps
              </a>
            </div>
          </div>
        </Container>
      </div>

      {/* Specialized Dashboards */}
      <div className="section orange-background">
        <Container>
          <div className="section-content text-center">
            <h2 className="white-text">Specialised Dashboards for Business</h2>
            <p className="lead white-text mb-5">
              For specialised challenges, we offer advanced dashboards designed for specific industries.
            </p>
            
            <Row>
              <Col md={6}>
                <div className="text-start mb-4">
                  <h4 className="white-text">Energy Dashboard</h4>
                  <p className="white-text">
                    Designed for the renewable energy sector. Analyse solar irradiance data 
                    and forecast power generation to optimise operations and trading decisions.
                  </p>
                  <a href="#energy" className="ow-btn btn-black round">
                    Learn more
                  </a>
                </div>
              </Col>
              <Col md={6}>
                <div className="text-start mb-4">
                  <h4 className="white-text">Extreme Weather Dashboard</h4>
                  <p className="white-text">
                    Stay one step ahead of high-impact events. Track storms, heatwaves, and other risks, 
                    and receive timely alerts to protect assets and ensure safety.
                  </p>
                  <a href="#extreme" className="ow-btn btn-black round">
                    Learn more
                  </a>
                </div>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    </>
  );
};

export default ProductSection;