import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Alert, Badge, Spinner } from 'react-bootstrap';
import { API_CONFIG } from '../config/apiConfig';
import nasaImageService from '../services/nasaImageService';

const APITest = () => {
  const [testResults, setTestResults] = useState({
    nasaEarth: { status: 'testing', message: '', details: null },
    nasaPower: { status: 'testing', message: '', details: null },
    noaa: { status: 'testing', message: '', details: null }
  });

  useEffect(() => {
    runAPITests();
  }, []);

  const runAPITests = async () => {
    // Test NASA Earth Imagery API
    await testNASAEarthAPI();
    
    // Test NASA POWER API
    await testNASAPowerAPI();
    
    // Test NOAA API
    await testNOAAAPI();
  };

  const testNASAEarthAPI = async () => {
    try {
      setTestResults(prev => ({
        ...prev,
        nasaEarth: { status: 'testing', message: 'Testing NASA Earth API...', details: null }
      }));

      const isValid = await nasaImageService.isAPIKeyValid();
      
      if (isValid) {
        // Try to get an actual image
        const imageData = await nasaImageService.getEarthImagery(29.78, -95.33, '2020-01-01');
        
        setTestResults(prev => ({
          ...prev,
          nasaEarth: {
            status: 'success',
            message: 'NASA Earth API is working correctly!',
            details: {
              apiKey: API_CONFIG.NASA_EARTH.apiKey.substring(0, 10) + '...',
              testImage: imageData?.imageUrl,
              endpoint: `${API_CONFIG.NASA_EARTH.baseUrl}${API_CONFIG.NASA_EARTH.endpoints.imagery}`
            }
          }
        }));
      } else {
        setTestResults(prev => ({
          ...prev,
          nasaEarth: {
            status: 'error',
            message: 'NASA Earth API key is invalid or expired',
            details: {
              apiKey: API_CONFIG.NASA_EARTH.apiKey === 'YOUR_NASA_API_KEY_HERE' ? 'Not configured' : 'Configured but invalid',
              endpoint: `${API_CONFIG.NASA_EARTH.baseUrl}${API_CONFIG.NASA_EARTH.endpoints.imagery}`
            }
          }
        }));
      }
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        nasaEarth: {
          status: 'error',
          message: 'Error testing NASA Earth API: ' + error.message,
          details: { error: error.toString() }
        }
      }));
    }
  };

  const testNASAPowerAPI = async () => {
    try {
      setTestResults(prev => ({
        ...prev,
        nasaPower: { status: 'testing', message: 'Testing NASA POWER API...', details: null }
      }));

      const testUrl = `${API_CONFIG.NASA_POWER.baseUrl}${API_CONFIG.NASA_POWER.endpoints.daily}`;
      const response = await fetch(`${testUrl}?parameters=T2M&community=RE&longitude=-95.33&latitude=29.78&start=20200101&end=20200101&format=JSON`);
      
      if (response.ok) {
        const data = await response.json();
        setTestResults(prev => ({
          ...prev,
          nasaPower: {
            status: 'success',
            message: 'NASA POWER API is working correctly!',
            details: {
              endpoint: testUrl,
              sampleData: data.properties?.parameter ? 'Data received' : 'No data',
              noKeyRequired: 'This API requires no API key'
            }
          }
        }));
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        nasaPower: {
          status: 'error',
          message: 'Error testing NASA POWER API: ' + error.message,
          details: { error: error.toString() }
        }
      }));
    }
  };

  const testNOAAAPI = async () => {
    try {
      setTestResults(prev => ({
        ...prev,
        noaa: { status: 'testing', message: 'Testing NOAA API...', details: null }
      }));

      const testUrl = `${API_CONFIG.NOAA.baseUrl}${API_CONFIG.NOAA.endpoints.points}/29.78,-95.33`;
      const response = await fetch(testUrl);
      
      if (response.ok) {
        const data = await response.json();
        setTestResults(prev => ({
          ...prev,
          noaa: {
            status: 'success',
            message: 'NOAA API is working correctly!',
            details: {
              endpoint: testUrl,
              office: data.properties?.gridId || 'Unknown',
              noKeyRequired: 'This API requires no API key'
            }
          }
        }));
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        noaa: {
          status: 'error',
          message: 'Error testing NOAA API: ' + error.message,
          details: { error: error.toString() }
        }
      }));
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'success':
        return <Badge bg="success">Working</Badge>;
      case 'error':
        return <Badge bg="danger">Error</Badge>;
      case 'testing':
        return <Badge bg="warning">Testing...</Badge>;
      default:
        return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <i className="fas fa-check-circle text-success"></i>;
      case 'error':
        return <i className="fas fa-times-circle text-danger"></i>;
      case 'testing':
        return <Spinner size="sm" animation="border" />;
      default:
        return <i className="fas fa-question-circle text-muted"></i>;
    }
  };

  return (
    <div className="section" style={{ minHeight: '100vh', paddingTop: '100px' }}>
      <Container>
        <div className="text-center mb-5">
          <h1>API Configuration Test</h1>
          <p className="lead">
            Testing your API keys and service connections
          </p>
        </div>

        <div className="row">
          {/* NASA Earth Imagery API */}
          <div className="col-md-4 mb-4">
            <Card className="h-100">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">NASA Earth Imagery</h5>
                {getStatusBadge(testResults.nasaEarth.status)}
              </Card.Header>
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  {getStatusIcon(testResults.nasaEarth.status)}
                  <span className="ms-2">{testResults.nasaEarth.message}</span>
                </div>
                
                {testResults.nasaEarth.details && (
                  <div>
                    <h6>Details:</h6>
                    <ul className="list-unstyled small">
                      {testResults.nasaEarth.details.apiKey && (
                        <li><strong>API Key:</strong> {testResults.nasaEarth.details.apiKey}</li>
                      )}
                      {testResults.nasaEarth.details.endpoint && (
                        <li><strong>Endpoint:</strong> <code className="small">{testResults.nasaEarth.details.endpoint}</code></li>
                      )}
                      {testResults.nasaEarth.details.testImage && (
                        <li>
                          <strong>Test Image:</strong> 
                          <img 
                            src={testResults.nasaEarth.details.testImage} 
                            alt="Test satellite" 
                            style={{ width: '100%', maxHeight: '150px', objectFit: 'cover' }}
                            className="mt-2 rounded"
                          />
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </Card.Body>
            </Card>
          </div>

          {/* NASA POWER API */}
          <div className="col-md-4 mb-4">
            <Card className="h-100">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">NASA POWER</h5>
                {getStatusBadge(testResults.nasaPower.status)}
              </Card.Header>
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  {getStatusIcon(testResults.nasaPower.status)}
                  <span className="ms-2">{testResults.nasaPower.message}</span>
                </div>
                
                {testResults.nasaPower.details && (
                  <div>
                    <h6>Details:</h6>
                    <ul className="list-unstyled small">
                      <li><strong>Status:</strong> {testResults.nasaPower.details.noKeyRequired}</li>
                      <li><strong>Sample Data:</strong> {testResults.nasaPower.details.sampleData}</li>
                      <li><strong>Endpoint:</strong> <code className="small">{testResults.nasaPower.details.endpoint}</code></li>
                    </ul>
                  </div>
                )}
              </Card.Body>
            </Card>
          </div>

          {/* NOAA API */}
          <div className="col-md-4 mb-4">
            <Card className="h-100">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">NOAA Weather</h5>
                {getStatusBadge(testResults.noaa.status)}
              </Card.Header>
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  {getStatusIcon(testResults.noaa.status)}
                  <span className="ms-2">{testResults.noaa.message}</span>
                </div>
                
                {testResults.noaa.details && (
                  <div>
                    <h6>Details:</h6>
                    <ul className="list-unstyled small">
                      <li><strong>Status:</strong> {testResults.noaa.details.noKeyRequired}</li>
                      <li><strong>Weather Office:</strong> {testResults.noaa.details.office}</li>
                      <li><strong>Endpoint:</strong> <code className="small">{testResults.noaa.details.endpoint}</code></li>
                    </ul>
                  </div>
                )}
              </Card.Body>
            </Card>
          </div>
        </div>

        <div className="text-center mt-5">
          <Button variant="primary" onClick={runAPITests}>
            <i className="fas fa-sync me-2"></i>
            Retest All APIs
          </Button>
          
          <div className="mt-3">
            <Alert variant="info">
              <Alert.Heading>Your API Configuration Status</Alert.Heading>
              <p>
                <strong>NASA Earth API Key:</strong> {API_CONFIG.NASA_EARTH.apiKey.substring(0, 15)}...
                <Badge bg="success" className="ms-2">Configured</Badge>
              </p>
              <p>
                <strong>OpenWeather API Key:</strong> {API_CONFIG.OPENWEATHER.apiKey === 'YOUR_OPENWEATHER_API_KEY_HERE' ? 'Not configured' : 'Configured'}
                <Badge bg={API_CONFIG.OPENWEATHER.apiKey === 'YOUR_OPENWEATHER_API_KEY_HERE' ? 'warning' : 'success'} className="ms-2">
                  {API_CONFIG.OPENWEATHER.apiKey === 'YOUR_OPENWEATHER_API_KEY_HERE' ? 'Optional' : 'Ready'}
                </Badge>
              </p>
            </Alert>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default APITest;