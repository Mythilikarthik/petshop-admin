import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Css/BrowseByPetCategory.css';
import { Row, Col, Container } from 'react-bootstrap';
import * as GiIcons from "react-icons/gi";



const BrowseByPetCategory = ({categoryPage = []}) => {
  //console.log("BrowseByPetCategory categoryPage:", categoryPage);
  const categories = [];
  categoryPage.map(cat => {
    categories.push({
      name: cat.category.categoryName,
      icon: cat.icon,
      color: cat.color,
      slug: cat.category.categoryName.toLowerCase().replace(/\s+/g, '-'),
    });
  });
  const renderIcon = (iconName, color) => {
    const IconComponent = GiIcons[iconName]; // look up dynamically
    if (!IconComponent) return <GiIcons.GiPawHeart style={{ color: "#999" }} />;
    return <IconComponent style={{ color, fontSize: "2.5rem" }} />;
  };
// const categories = [
//   { name: 'Dog', icon: <GiJumpingDog />, color: '#FFA726', slug: 'dog' },
//   { name: 'Cat', icon: <GiHollowCat />, color: '#42A5F5', slug: 'cat' },
//   { name: 'Bird', icon: <GiHummingbird />, color: '#66BB6A', slug: 'bird' },
//   { name: 'Fish', icon: <GiTropicalFish />, color: '#AB47BC', slug: 'fish' },
//   { name: 'Small Pet', icon: <GiPawHeart />, color: '#EC407A', slug: 'small-pet' },
//   { name: 'Exotic Pet', icon: <GiPhrygianCap />, color: '#FFD600', slug: 'exotic-pet' },
// ];
  const navigate = useNavigate();

  const handleCategoryClick = (categoryName) => {
    navigate(`/type/${categoryName}`);
  };

  return (
    <section className="browse-category-section">
      <Container>
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
                    {renderIcon(cat.icon, cat.color)}
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