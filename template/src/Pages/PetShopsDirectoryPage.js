import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { Container, Row, Col, Card, Spinner, Form, InputGroup } from 'react-bootstrap';
import excelFile from '../assets/pet-shop.xlsx';
import { HiOutlineArrowLongRight } from 'react-icons/hi2';

export default function PetShopsDirectoryPage() {
  const [cities, setCities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(excelFile)
      .then((res) => res.arrayBuffer())
      .then((buffer) => {
        const workbook = XLSX.read(buffer, { type: 'buffer' });
        const firstSheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[firstSheetName];
        const parsedRows = XLSX.utils.sheet_to_json(sheet);

        // Filter valid city rows and extract unique cities
        const cityList = parsedRows
          .filter((row) => row.Areas)
          .map((row) => ({
            name: row.Areas,
            slug: String(row.Areas).toLowerCase().trim().replace(/\s+/g, '-'),
            intro: row.Intro || 'Professional pet boarding services and pricing details.',
          }));

        setCities(cityList);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading Excel file:', err);
        setLoading(false);
      });
  }, []);

  // Filter cities by search term
  const filteredCities = cities.filter((city) =>
    city.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Container className="d-flex flex-column align-items-center justify-content-center min-vh-100">
        <Spinner animation="border" style={{ color: '#ff4e00' }} />
        <p className="mt-3 text-muted fw-semibold">Loading city directory...</p>
      </Container>
    );
  }

  return (
    <div style={{ backgroundColor: '#fdfbfb', minHeight: '100vh', padding: '40px 0' }}>
      <style>{`
        .city-card {
          border-radius: 0 !important;
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.2) !important;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 10px 25px -10px rgba(0, 0, 0, 0.05) !important;
          text-decoration: none !important;
        }
        .city-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 35px -10px rgba(255, 78, 0, 0.15) !important;
          border-color: rgba(255, 78, 0, 0.3) !important;
        }
        .city-arrow {
          color: #ff4e00;
          font-weight: bold;
          transition: transform 0.2s ease;
        }
        .city-card:hover .city-arrow {
          transform: translateX(4px);
        }
      `}</style>

      <Container>
        {/* Directory Hero Header */}
        <Row className="justify-content-center text-center mb-5">
          <Col lg={8}>
            <span 
              className="badge px-3 py-2 text-uppercase mb-3 rounded-pill fw-bold"
              style={{ backgroundColor: '#fff5f0', color: '#ff4e00', border: '1px solid #ffe8df' }}
            >
              Pet Shop Directory
            </span>
            <h1 className="fw-bold text-dark mb-3">Find Pet Shop Near You</h1>
            {/* <p className="text-muted mb-4">
              Select your city to explore top-rated local groomers, service packages, and estimated pricing.
            </p> */}

            {/* Search Filter Bar */}
            <InputGroup className="mb-3 shadow-sm rounded-pill overflow-hidden border">
              <Form.Control
                placeholder="Search your area..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="py-3 px-4 border-0"
                style={{ fontSize: '1rem', boxShadow: 'none' }}
              />
            </InputGroup>
          </Col>
        </Row>

        {/* City Grid Cards */}
        <Row className="g-4">
          {filteredCities.length > 0 ? (
            filteredCities.map((city) => (
              <Col key={city.slug} sm={6} md={4} lg={3}>
                <Link to={`/pet-shops/${city.slug}-chennai`} className="text-decoration-none">
                  <Card className="city-card h-100 p-3">
                    <Card.Body className="d-flex flex-column justify-content-between p-2">
                      <div>
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <h2 className="h5 fw-bold text-dark mb-0">{city.name}</h2>
                          <span className="city-arrow">
                            <HiOutlineArrowLongRight />
                          </span>
                        </div>
                        <p className="text-muted small mb-0 line-clamp-2" style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {city.intro}
                        </p>
                      </div>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            ))
          ) : (
            <Col className="text-center py-5">
              <p className="text-muted">No cities found matching "{searchTerm}".</p>
            </Col>
          )}
        </Row>
      </Container>
    </div>
  );
}