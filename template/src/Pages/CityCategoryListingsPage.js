import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Css/CityCategoryListingsPage.css';
import dummyAd from '../dummyAd.jpg'; // Dummy ad image
import { Row, Col, Card, Button } from 'react-bootstrap';
import { FaStar, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';


// Example data (replace with API)
const allListings = [
  { id: 1, name: "Paws & Claws Clinic", type: ["Veterinary"], city: "Mumbai", category: "dog", location: "Bandra West, Mumbai", description: "Premium veterinary services for all your pet’s healthcare needs.", rating: 4.5, reviews: 120, phone: "123-456-7890", email: "info@pawsandclaws.com"},
  { id: 2, name: "Furry Friends Grooming", type: ["Grooming"], city: "Mumbai", category: "cat", location: "Indiranagar, Bangalore", description: "Professional grooming to keep your pets looking their best.", rating: 4.0, reviews: 95, phone: "234-567-8901", email: "info@furryfriends.com" },
  { id: 3, name: "Happy Tails Pet Store", type: ["Pet Store"], city: "Mumbai", category: "dog", location: "Juhu, Mumbai", description: "Your one-stop shop for all pet supplies.", rating: 4.2, reviews: 150, phone: "345-678-9012", email: "info@happytails.com" },
  { id: 4, name: "Whiskers & Wings", type: ["Pet Adoption"], city: "Mumbai", category: "cat", location: "Koramangala, Bangalore", description: "Find your new furry friend today!",  rating: 4.8, reviews: 200, phone: "456-789-0123", email: "info@whiskersandwings.com" },
  { id: 5, name: "Birdy Care Center", type:[ "Veterinary"], city: "Mumbai", category: "bird", location: "T Nagar, Chennai", description: "Specialized care for your feathered friends.",  rating: 4.3, reviews: 80, phone: "567-890-1234", email: "info@birdycare.com" },
  { id: 6, name: "Fishy Spa", type:[ "Pet Store"], city: "Mumbai", category: "fish", location: "Andheri, Mumbai", description: "Aquarium cleaning and fish grooming services.",  rating: 4.1, reviews: 60, phone: "678-901-2345", email: "info@fishyspa.com" },
  { id: 7, name: "Small Paws Clinic", type: ["Veterinary"], city: "Bangalore", category: "small-pet", location: "Whitefield, Bangalore", description: "Healthcare services for small pets like rabbits and hamsters.",  rating: 4.6, reviews: 110, phone: "789-012-3456", email: "info@smallpaws.com" },
  { id: 8, name: "Exotic Pets World", type: ["Pet Store"], city: "Delhi", category: "exotic-pet", location: "Connaught Place, Delhi", description: "Wide range of exotic pets and supplies." , rating: 4.4, reviews: 70, phone: "890-123-4567", email: "info@exoticpets.com" },
];

const PAGE_SIZE = 25;

const CityCategoryListingsPage = () => {
  const { cityName } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(''); // Default category
  const [page, setPage] = useState(1);

  // ...existing code...
  const filteredListings = useMemo(() =>
    allListings.filter(l => {
      const q = (search || '').toLowerCase();
      const typeMatches = Array.isArray(l.type)
        ? l.type.some(t => (t || '').toLowerCase().includes(q))
        : (l.type || '').toLowerCase().includes(q);

      return (l.city || '').toLowerCase() === (cityName || '').toLowerCase() &&
        (category === '' || l.category === category) &&
        ((l.name || '').toLowerCase().includes(q) || typeMatches || (l.location || '').toLowerCase().includes(q));
    }),
    [cityName, category, search]
  );
// ...existing code...

  const totalPages = Math.ceil(filteredListings.length / PAGE_SIZE);
  const paginatedListings = filteredListings.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <section className="city-category-listings-section">
      <div className="ad-banner mb-4">
        <img src={dummyAd} alt="Advertisement" className="ad-img" />
      </div>

      <h2>
        Services in <span className="highlight">{cityName.charAt(0).toUpperCase() + cityName.slice(1)}</span>
      </h2>

      <div className="filters-row" style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Search listings..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="city-category-search"
        />

        <div className="select-wrapper">
          <select
            value={category}
            onChange={e => { setCategory(e.target.value); setPage(1); }}
            className="city-category-select"
            aria-label="Filter by category"
          >
            <option value="">All Categories</option>
            <option value="dog">Dog</option>
            <option value="cat">Cat</option>
            <option value="bird">Bird</option>
            <option value="fish">Fish</option>
            <option value="small-pet">Small Pet</option>
            <option value="exotic-pet">Exotic Pet</option>
          </select>
          <span className="select-caret" aria-hidden>▾</span>
        </div>
      </div>

      <div className="city-category-listings">
        {paginatedListings.length === 0 ? (
          <div className="no-results">No listings found.</div>
        ) : (
          paginatedListings.map(listing => (
            <div className="city-category-card" key={listing.id}>
              <h3>{listing.name}</h3>
              <div className="provider-services">
                <div className="service-tags">
                  {listing.type.map((service, index) => (
                    <span 
                      key={index} 
                      className="service-tag"
                      
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
              <div className="provider-rating">
                <FaStar className="star-icon" />
                <span>{listing.rating}</span>
                <span className="review-count">({listing.reviews} reviews)</span>
              </div>
              <p className="listing-description">{listing.description}</p>
              <div className="provider-info">
                <div className="info-item">
                  <FaMapMarkerAlt />
                  <span>{listing.location}</span>
                </div>
                <div className="info-item">
                  <FaPhone />
                  <span>{listing.phone}</span>
                </div>
                <div className="info-item">
                  <FaEnvelope />
                  <span>{listing.email}</span>
                </div>
              </div>
              
              <button
                className="view-details-btn"
                onClick={() => navigate(`/listing/${listing.id}`)}
              >
                View Details
              </button>
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="city-category-pagination">
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              className={`pagination-btn${page === idx + 1 ? ' active' : ''}`}
              onClick={() => setPage(idx + 1)}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      )}
    </section>
  );
};

export default CityCategoryListingsPage;