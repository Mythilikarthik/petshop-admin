import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import './Css/Directory.css';

// Example data (replace with API data)
const allListings = [
  { id: 1, name: "Name of Pet Shop", type: "Pet Shop", city: "Mumbai", category: "dog", location: "Bandra West, Mumbai", description: "Premium veterinary services for all your pet’s healthcare needs." },
  { id: 2, name: "Name of Pet Food", type: "Pet Food", city: "Bangalore", category: "cat", location: "Indiranagar, Bangalore", description: "Professional grooming to keep your pets looking their best." },
  { id: 3, name: "Name of Happy Tails Boarding", type: "Services", city: "Delhi", category: "dog", location: "Gurgaon, Delhi NCR", description: "Luxury pet boarding with spacious accommodations, playtime, and personalized care." },
  { id: 4, name: "Name of Birdy Care Center", type: "Pet Shop", city: "Chennai", category: "bird", location: "T Nagar, Chennai", description: "Specialized care for your feathered friends." },
  { id: 5, name: "Fishy Spa", type: "Pet Insurance", city: "Mumbai", category: "fish", location: "Andheri, Mumbai", description: "Aquarium cleaning and fish grooming services." },
  // ...add more for demo
];

// Unique cities and categories for filters
const cities = [...new Set(allListings.map(l => l.city))];
const categories = [...new Set(allListings.map(l => l.category))];

const PAGE_SIZE = 4;

const Directory = () => {
  const { category: routeCategory } = useParams();
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(routeCategory || '');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  // Filtered listings
  const filteredListings = useMemo(() => {
    return allListings.filter(l =>
      (!selectedCategory || l.category === selectedCategory) &&
      (!selectedCity || l.city === selectedCity) &&
      (l.name.toLowerCase().includes(search.toLowerCase()) ||
        l.type.toLowerCase().includes(search.toLowerCase()) ||
        l.location.toLowerCase().includes(search.toLowerCase()))
    );
  }, [selectedCategory, selectedCity, search]);

  // Pagination
  const totalPages = Math.ceil(filteredListings.length / PAGE_SIZE);
  const paginatedListings = filteredListings.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Handlers
  const handleCategoryChange = e => {
    setSelectedCategory(e.target.value);
    setPage(1);
  };
  const handleCityChange = e => {
    setSelectedCity(e.target.value);
    setPage(1);
  };
  const handleSearchChange = e => {
    setSearch(e.target.value);
    setPage(1);
  };
  const handlePageChange = newPage => setPage(newPage);

  return (
    <section className="directory-inner-section">
      <div className="directory-header">
        <h2>
          {selectedCategory ? selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1) : "All"} Services Directory
        </h2>
        <p>Browse top-rated pet services by category and city</p>
      </div>
      <div className="directory-filters">
        <select value={selectedCategory} onChange={handleCategoryChange}>
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option value={cat} key={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
          ))}
        </select>
        <select value={selectedCity} onChange={handleCityChange}>
          <option value="">All Cities</option>
          {cities.map(city => (
            <option value={city} key={city}>{city}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Search by name, type, or location"
          value={search}
          onChange={handleSearchChange}
        />
      </div>
      <div className="directory-listings">
        {paginatedListings.length === 0 ? (
          <div className="no-results">No listings found.</div>
        ) : (
          paginatedListings.map(listing => (
            <div className="directory-card" key={listing.id}>
              <div className="directory-card-header">
                <h3>{listing.name}</h3>
                <span className="directory-type">{listing.type}</span>
              </div>
              <div className="directory-location">{listing.location} <span className="directory-city">({listing.city})</span></div>
              <div className="directory-description">{listing.description}</div>
              <button className="view-details-btn">View Details</button>
            </div>
          ))
        )}
      </div>
      {totalPages > 1 && (
        <div className="directory-pagination">
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              className={`pagination-btn${page === idx + 1 ? ' active' : ''}`}
              onClick={() => handlePageChange(idx + 1)}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      )}
    </section>
  );
};

export default Directory;