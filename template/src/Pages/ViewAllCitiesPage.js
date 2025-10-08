import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Css/ViewAllCitiesPage.css';

const cities = [
  { name: 'Mumbai', listings: 1200 },
  { name: 'Delhi', listings: 980 },
  { name: 'Bangalore', listings: 850 },
  { name: 'Chennai', listings: 720 },
  { name: 'Hyderabad', listings: 680 },
  { name: 'Kolkata', listings: 590 },
  { name: 'Pune', listings: 520 },
  { name: 'Ahmedabad', listings: 480 },
];

const ViewAllCitiesPage = () => {
  const navigate = useNavigate();

  return (
    <section className="view-all-cities-section">
      <h2>
        All <span className="highlight">Cities</span>
      </h2>
      <p>Browse pet services by city</p>
      <div className="cities-grid pt-5 pb-5">
        {cities.map(city => (
          <div
            className="city-card"
            key={city.name}
            onClick={() => navigate(`/city/${city.name}`)}
            role="button"
            tabIndex={0}
            onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && navigate(`/city/${city.name}`)}
          >
            <div className="city-name">{city.name}</div>
            <div className="city-listings">{city.listings}+ listings</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ViewAllCitiesPage;