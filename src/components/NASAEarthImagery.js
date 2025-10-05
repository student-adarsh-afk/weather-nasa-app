import React, { useState, useEffect } from 'react';
import { Card, Button, Spinner, Alert, Form } from 'react-bootstrap';
import nasaImageService from '../services/nasaImageService';

const NASAEarthImagery = ({ location }) => {
  const [imageData, setImageData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [apiKeyValid, setApiKeyValid] = useState(null);

  // Check API key validity on component mount
  useEffect(() => {
    checkAPIKey();
  }, []);

  // Load imagery when location changes
  useEffect(() => {
    if (location && apiKeyValid) {
      loadImagery();
      loadAvailableDates();
    }
  }, [location, apiKeyValid]);

  const checkAPIKey = async () => {
    const isValid = await nasaImageService.isAPIKeyValid();
    setApiKeyValid(isValid);
    
    if (!isValid) {
      setError('NASA Earth API key is not configured or invalid. Please check your API configuration.');
    }
  };

  const loadImagery = async (date = null) => {
    if (!location || !apiKeyValid) return;

    setLoading(true);
    setError(null);

    try {
      const imageData = await nasaImageService.getEarthImagery(
        location.lat, 
        location.lon, 
        date
      );

      if (imageData) {
        setImageData(imageData);
      } else {
        setError('No satellite imagery available for this location and date.');
      }
    } catch (err) {
      setError('Failed to load satellite imagery: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableDates = async () => {
    if (!location || !apiKeyValid) return;

    try {
      const dates = await nasaImageService.getAvailableDates(location.lat, location.lon);
      if (dates && dates.length > 0) {
        setAvailableDates(dates.slice(0, 10)); // Show last 10 available dates
      }
    } catch (err) {
      console.error('Failed to load available dates:', err);
    }
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    if (date) {
      loadImagery(date);
    }
  };

  const handleRefresh = () => {
    loadImagery(selectedDate || null);
  };

  if (!apiKeyValid && apiKeyValid !== null) {
    return (
      <Card className="mb-4">
        <Card.Header>
          <h5 className="mb-0">
            <i className="fas fa-satellite me-2"></i>
            NASA Earth Imagery
          </h5>
        </Card.Header>
        <Card.Body>
          <Alert variant="warning">
            <Alert.Heading>API Key Required</Alert.Heading>
            <p>
              NASA Earth Imagery API key is not configured or invalid. 
              Your current API key appears to be working in the configuration file, 
              but we're having trouble connecting to the NASA API.
            </p>
            <hr />
            <p className="mb-0">
              <strong>What to check:</strong>
            </p>
            <ul className="mb-0">
              <li>Verify your API key at <a href="https://api.nasa.gov/" target="_blank" rel="noopener noreferrer">api.nasa.gov</a></li>
              <li>Check if you've exceeded the 1,000 requests/hour limit</li>
              <li>Ensure your internet connection is stable</li>
            </ul>
          </Alert>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="mb-4">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          <i className="fas fa-satellite me-2"></i>
          NASA Earth Imagery
          <small className="text-success ms-2">
            <i className="fas fa-check-circle"></i> API Connected
          </small>
        </h5>
        <div className="d-flex gap-2">
          {availableDates.length > 0 && (
            <Form.Select
              size="sm"
              value={selectedDate}
              onChange={handleDateChange}
              style={{ width: '150px' }}
            >
              <option value="">Latest Available</option>
              {availableDates.map((date, index) => (
                <option key={index} value={date}>
                  {new Date(date).toLocaleDateString()}
                </option>
              ))}
            </Form.Select>
          )}
          <Button size="sm" variant="outline-primary" onClick={handleRefresh}>
            <i className="fas fa-sync"></i>
          </Button>
        </div>
      </Card.Header>
      
      <Card.Body>
        {loading && (
          <div className="text-center p-4">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading satellite imagery...</span>
            </Spinner>
            <p className="mt-2 text-muted">Loading satellite imagery...</p>
          </div>
        )}

        {error && (
          <Alert variant="danger">
            <Alert.Heading>Error Loading Imagery</Alert.Heading>
            <p>{error}</p>
          </Alert>
        )}

        {imageData && !loading && (
          <div>
            <div className="mb-3">
              <img
                src={imageData.imageUrl}
                alt={`Satellite view of ${location.name}`}
                className="img-fluid rounded"
                style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  setError('Failed to load satellite image');
                }}
              />
            </div>
            
            <div className="row">
              <div className="col-md-6">
                <small className="text-muted">
                  <strong>Location:</strong> {location.name}
                </small>
              </div>
              <div className="col-md-6">
                <small className="text-muted">
                  <strong>Image Date:</strong> {new Date(imageData.date).toLocaleDateString()}
                </small>
              </div>
            </div>
            
            <div className="row mt-2">
              <div className="col-md-6">
                <small className="text-muted">
                  <strong>Coordinates:</strong> {location.lat.toFixed(4)}, {location.lon.toFixed(4)}
                </small>
              </div>
              <div className="col-md-6">
                <small className="text-muted">
                  <strong>Source:</strong> NASA Landsat
                </small>
              </div>
            </div>
            
            <hr />
            
            <div className="d-flex justify-content-between align-items-center">
              <small className="text-muted">
                <i className="fas fa-info-circle me-1"></i>
                Powered by NASA Earth Imagery API
              </small>
              <a 
                href={imageData.imageUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-sm btn-outline-primary"
              >
                <i className="fas fa-external-link-alt me-1"></i>
                View Full Size
              </a>
            </div>
          </div>
        )}

        {!imageData && !loading && !error && apiKeyValid && (
          <div className="text-center p-4">
            <i className="fas fa-satellite" style={{ fontSize: '3rem', color: '#ccc' }}></i>
            <p className="mt-2 text-muted">
              Click refresh to load satellite imagery for {location?.name}
            </p>
            <Button variant="primary" onClick={handleRefresh}>
              <i className="fas fa-download me-2"></i>
              Load Satellite Image
            </Button>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default NASAEarthImagery;