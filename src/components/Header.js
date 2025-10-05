import React, { useState, useEffect, useRef } from 'react';
import { Navbar, Nav, Container, Form, Button, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import weatherService from '../services/weatherService';

const Header = ({ onLocationSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const results = await weatherService.searchLocation(searchQuery);
      setSearchResults(results);
      setShowResults(true);
    }
  };

  const handleLocationClick = (location) => {
    onLocationSelect(location);
    setShowResults(false);
    setSearchQuery('');
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    if (!e.target.value.trim()) {
      setShowResults(false);
    }
  };

  // Hide-on-scroll navbar logic
  const [isScrolling, setIsScrolling] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const scrollTimeoutRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || window.pageYOffset || 0;
      setAtTop(y < 10);
      setIsScrolling(true);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => setIsScrolling(false), 200);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  const shouldHide = !atTop && isScrolling;

  return (
    <>
      <Navbar expand="lg" className={`navbar ${shouldHide ? 'navbar-hidden' : 'navbar-shown'}`} variant="dark" fixed="top">
        <Container>
          <Navbar.Brand as={Link} to="/">
            <span className="orange-text">Clima</span>Sync
          </Navbar.Brand>
          
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
              <Nav.Link as={Link} to="/maps">Maps</Nav.Link>
              
              <Dropdown as="li" className="nav-item">
                <Dropdown.Toggle as="a" className="nav-link" id="dashboards-dropdown">
                  Dashboards
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/dashboard">Weather Dashboard</Dropdown.Item>
                  <Dropdown.Item href="#energy">Energy Dashboard</Dropdown.Item>
                  <Dropdown.Item href="#extreme">Extreme Weather</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
            
            <div className="search-form position-relative">
              <Form onSubmit={handleSearch} className="d-flex">
                <Form.Control
                  type="search"
                  placeholder="Weather in your city"
                  value={searchQuery}
                  onChange={handleInputChange}
                  className="me-2 interactive-input"
                />
                <Button variant="outline-light" type="submit" size="sm" className="interactive-press">
                  <i className="fas fa-search"></i>
                </Button>
              </Form>
              
              {showResults && searchResults.length > 0 && (
                <div className="position-absolute w-100 mt-1" style={{ zIndex: 9999 }}>
                  <div className="bg-white shadow-lg rounded p-2">
                    {searchResults.map((result, index) => (
                      <div
                        key={index}
                        className="p-2 cursor-pointer border-bottom interactive-hover"
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleLocationClick(result)}
                      >
                        <div className="text-dark fw-bold">{result.name}</div>
                        <div className="text-muted small">{result.country}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      
    </>
  );
};

export default Header;