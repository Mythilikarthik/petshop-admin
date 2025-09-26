import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Css/BrowseByPetCategory.css';
import { Row, Col, Container } from 'react-bootstrap';
import { GiHollowCat, GiJumpingDog, GiHummingbird, GiTropicalFish, GiPawHeart, GiPhrygianCap } from "react-icons/gi";

const categories = [
  { name: 'Dog', icon: <GiJumpingDog />, color: '#FFA726', slug: 'dog' },
  { name: 'Cat', icon: <GiHollowCat />, color: '#42A5F5', slug: 'cat' },
  { name: 'Bird', icon: <GiHummingbird />, color: '#66BB6A', slug: 'bird' },
  { name: 'Fish', icon: <GiTropicalFish />, color: '#AB47BC', slug: 'fish' },
  { name: 'Small Pet', icon: <GiPawHeart />, color: '#EC407A', slug: 'small-pet' },
  { name: 'Exotic Pet', icon: <GiPhrygianCap />, color: '#FFD600', slug: 'exotic-pet' },
];

const BrowseByPetCategory = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categorySlug) => {
    navigate(`/category/${categorySlug}`);
  };

  return (
    <section className="browse-category-section">
      <Container fluid>
        <h2>
          Browse By <span className="highlight">Pet Category</span>
        </h2>
        <p>Find the perfect services for your furry, feathery, or scaly friends</p>
        <Row>
          {categories.map((cat) => (
            <Col xs={6} sm={4} md={3} lg={2} className="mb-4" key={cat.slug}>
              <div className="category-grid">
                <div
                  className="category-card"
                  style={{ borderColor: cat.color }}
                  onClick={() => handleCategoryClick(cat.slug)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleCategoryClick(cat.slug);
                    }
                  }}
                >
                  <span className="category-icon" style={{ color: cat.color }}>
                    {cat.icon}
                  </span>
                  <div className="category-name">{cat.name}</div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default BrowseByPetCategory;