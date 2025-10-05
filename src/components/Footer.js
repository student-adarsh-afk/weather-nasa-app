import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col md={3}>
            <h3>Product Collections</h3>
            <ul className="footer-links">
              <li><a href="/api">Current and Forecast APIs</a></li>
              <li><a href="/history">Historical Weather Data</a></li>
              <li><a href="/maps">Weather Maps</a></li>
              <li><a href="/dashboard">Weather Dashboard</a></li>
            </ul>
          </Col>
          
          <Col md={3}>
            <h3>Subscription</h3>
            <ul className="footer-links">
              <li><a href="#start">How to start</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#signup">Subscribe for free</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
          </Col>
          
          <Col md={3}>
            <h3>Technologies</h3>
            <ul className="footer-links">
              <li><a href="#nasa">NASA POWER API</a></li>
              <li><a href="#noaa">NOAA Weather Service</a></li>
              <li><a href="#maps">Interactive Maps</a></li>
              <li><a href="#dashboard">Real-time Dashboards</a></li>
            </ul>
          </Col>
          
          <Col md={3}>
            <h3>Company</h3>
            <div>
              <p>
                OpenWeather Clone is a demonstration project showcasing weather data integration 
                using NASA POWER API and NOAA Weather Services. Built with React and modern web technologies 
                for educational and development purposes.
              </p>
              
              <div className="mt-4">
                <h5>Data Sources</h5>
                <ul className="footer-links">
                  <li>
                    <i className="fas fa-satellite me-2"></i>
                    <a href="https://power.larc.nasa.gov/" target="_blank" rel="noopener noreferrer">
                      NASA POWER
                    </a>
                  </li>
                  <li>
                    <i className="fas fa-cloud me-2"></i>
                    <a href="https://api.weather.gov/" target="_blank" rel="noopener noreferrer">
                      NOAA Weather API
                    </a>
                  </li>
                  <li>
                    <i className="fas fa-map me-2"></i>
                    <a href="https://openstreetmap.org/" target="_blank" rel="noopener noreferrer">
                      OpenStreetMap
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </Col>
        </Row>
        
        <div className="footer-bottom">
          <Row>
            <Col md={6}>
              <p>&copy; 2024 OpenWeather Clone. Educational project for demonstration purposes.</p>
            </Col>
            <Col md={6} className="text-end">
              <p>
                Powered by{' '}
                <a href="https://power.larc.nasa.gov/" target="_blank" rel="noopener noreferrer" className="orange-text">
                  NASA POWER API
                </a>
                {' '}&{' '}
                <a href="https://api.weather.gov/" target="_blank" rel="noopener noreferrer" className="orange-text">
                  NOAA Weather Service
                </a>
              </p>
            </Col>
          </Row>
          
          <Row className="mt-3">
            <Col className="text-center">
              <div className="d-flex justify-content-center align-items-center">
                <span className="me-3">Built with:</span>
                <span className="badge bg-primary me-2">React</span>
                <span className="badge bg-info me-2">Bootstrap</span>
                <span className="badge bg-success me-2">Leaflet Maps</span>
                <span className="badge bg-warning text-dark me-2">NASA APIs</span>
                <span className="badge bg-secondary">NOAA APIs</span>
              </div>
            </Col>
          </Row>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;