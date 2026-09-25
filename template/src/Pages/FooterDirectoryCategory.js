import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Form, InputGroup } from 'react-bootstrap';
import { HiOutlineArrowLongRight } from 'react-icons/hi2';

export default function FooterDirectoryCategory() {
  const [searchTerm, setSearchTerm] = useState('');

  const directoryCategory = [{
      categoryName: "Pet Grooming",
      categorySlug: "pet-grooming"
  }, {
      categoryName: "Pet Boarding",
      categorySlug: "pet-boarding"
  }, {
      categoryName: "Pet Shops Chennai",
      categorySlug: "pet-shops"
  }, {
      categoryName: "Pet Shops South India",
      categorySlug: "pet-shops-south-india"
  }, {
      categoryName: "Pet Grooming South India",
      categorySlug: "pet-grooming-south-india"
  }, {
      categoryName: "Pet Boarding Chennai",
      categorySlug: "pet-boarding-chennai"
  }, {
      categoryName: "Golden Retriever Puppies for Sale",
      categorySlug: "golden-retriever-puppies-for-sale"
  }, {
      categoryName: "Chihuahua Puppies for Sale",
      categorySlug: "chihuahua-puppies-for-sale"
  }];

  // Filter categories by search term
  const filteredCategories = directoryCategory.filter((cat) =>
    cat.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              Directory Categories
            </span>
            <h1 className="fw-bold text-dark mb-3">Explore All Pet Services & Categories</h1>

            {/* Search Filter Bar */}
            <InputGroup className="mb-3 shadow-sm rounded-pill overflow-hidden border">
              <Form.Control
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="py-3 px-4 border-0"
                style={{ fontSize: '1rem', boxShadow: 'none' }}
              />
            </InputGroup>
          </Col>
        </Row>

        {/* Category Grid Cards */}
        <Row className="g-4">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category) => (
              <Col key={category.categorySlug} sm={6} md={4} lg={3}>
                <Link to={`/${category.categorySlug.toLowerCase()}`} className="text-decoration-none">
                  <Card className="city-card h-100 p-3">
                    <Card.Body className="d-flex flex-column justify-content-between p-2 w-100">
                      <div>
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <h2 className="h5 fw-bold text-dark mb-0">{category.categoryName}</h2>
                          <span className="city-arrow">
                            <HiOutlineArrowLongRight />
                          </span>
                        </div>                        
                      </div>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            ))
          ) : (
            <Col className="text-center py-5">
              <p className="text-muted">No categories found matching "{searchTerm}".</p>
            </Col>
          )}
        </Row>
      </Container>
    </div>
  );
}