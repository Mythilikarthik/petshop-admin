import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Css/CityCategoriesPage.css';
import { GiJumpingDog, GiHollowCat, GiHummingbird, GiTropicalFish, GiPawHeart, GiPhrygianCap } from "react-icons/gi";

const categories = [
  { name: 'Dog', icon: <GiJumpingDog />, slug: 'dog' },
  { name: 'Cat', icon: <GiHollowCat />, slug: 'cat' },
  { name: 'Bird', icon: <GiHummingbird />, slug: 'bird' },
  { name: 'Fish', icon: <GiTropicalFish />, slug: 'fish' },
  { name: 'Small Pet', icon: <GiPawHeart />, slug: 'small-pet' },
  { name: 'Exotic Pet', icon: <GiPhrygianCap />, slug: 'exotic-pet' },
];

const CityCategoriesPage = () => {
  const { cityName } = useParams();
  const navigate = useNavigate();

  return (
    <section className="city-categories-section">
      <h2>
        Browse Categories in <span className="highlight">{cityName}</span>
      </h2>
      <div className="city-category-grid">
        {categories.map(cat => (
          <div
            className="city-category-card"
            key={cat.slug}
            onClick={() => navigate(`/city/${cityName}/${cat.slug}`)}
            role="button"
            tabIndex={0}
            onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && navigate(`/city/${cityName}/${cat.slug}`)}
          >
            <span className="city-category-icon">{cat.icon}</span>
            <div className="city-category-name">{cat.name}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CityCategoriesPage;