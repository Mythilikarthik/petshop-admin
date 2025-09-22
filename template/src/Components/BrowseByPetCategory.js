import React from 'react';
import './Css/BrowseByPetCategory.css';
import { Row, Col, Container } from 'react-bootstrap';
import { GiHollowCat, GiJumpingDog, GiHummingbird, GiTropicalFish, GiPawHeart, GiPhrygianCap   } from "react-icons/gi";

const categories = [
  { name: 'Dog', icon: <GiJumpingDog />, color: '#FFA726' },
  { name: 'Cat', icon: <GiHollowCat />, color: '#42A5F5' },
  { name: 'Bird', icon: <GiHummingbird />, color: '#66BB6A' },
  { name: 'Fish', icon: <GiTropicalFish />, color: '#AB47BC' },
  { name: 'Small Pet', icon: <GiPawHeart />, color: '#EC407A' },
  { name: 'Exotic Pet', icon: <GiPhrygianCap />, color: '#FFD600' },
];

const BrowseByPetCategory = () => (
  <section className="browse-category-section">
    <Container fluid>
        <h2>
        Browse By <span className="highlight">Pet Category</span>
        </h2>
        <p>Find the perfect services for your furry, feathery, or scaly friends</p>
        <Row>
            
            {categories.map((cat) => (
            <Col xs={6} sm={4} md={3} lg={2} className="mb-4" key={categories.name}>
                <div className="category-grid">
                        <div
                        key={cat.name}
                        className="category-card"
                        style={{ borderColor: cat.color }}
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

export default BrowseByPetCategory;