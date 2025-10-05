import React from 'react';
import { Container } from 'react-bootstrap';

const HeroSection = () => {
  return (
    <div className="hero-section">
      <Container>
        <div className="text-center">
          <h1>
            <span className="white-text">ClimaSync</span>
          </h1>
          <h2>
            <span className="white-text">
              Weather forecasts, nowcasts and history in a fast and elegant way
            </span>
          </h2>
          <p className="lead">
            Powered by NASA POWER API and NOAA Weather Services
          </p>
        </div>
      </Container>
    </div>
  );
};

export default HeroSection;