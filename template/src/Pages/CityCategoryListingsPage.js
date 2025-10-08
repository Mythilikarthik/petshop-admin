import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import './Css/CityCategoryListingsPage.css';

// Example data (replace with API)
const allListings = [
  { id: 1, name: "Paws & Claws Clinic", type: "Veterinary", city: "Mumbai", category: "dog", location: "Bandra West, Mumbai", description: "Premium veterinary services for all your pet’s healthcare needs." },
  { id: 2, name: "Furry Friends Grooming", type: "Grooming", city: "Bangalore", category: "cat", location: "Indiranagar, Bangalore", description: "Professional grooming to keep your pets looking their best." },
  { id: 3, name: "Happy Tails Pet Store", type: "Pet Store", city: "Mumbai", category: "dog", location: "Juhu, Mumbai", description: "Your one-stop shop for all pet supplies." },
  { id: 4, name: "Whiskers & Wings", type: "Pet Adoption", city: "Bangalore", category: "cat", location: "Koramangala, Bangalore", description: "Find your new furry friend today!" },
  { id: 5, name: "Birdy Care Center", type: "Veterinary", city: "Chennai", category: "bird", location: "T Nagar, Chennai", description: "Specialized care for your feathered friends." },
  { id: 6, name: "Fishy Spa", type: "Pet Store", city: "Mumbai", category: "fish", location: "Andheri, Mumbai", description: "Aquarium cleaning and fish grooming services." },
  { id: 7, name: "Small Paws Clinic", type: "Veterinary", city: "Bangalore", category: "small-pet", location: "Whitefield, Bangalore", description: "Healthcare services for small pets like rabbits and hamsters." },
  { id: 8, name: "Exotic Pets World", type: "Pet Store", city: "Delhi", category: "exotic-pet", location: "Connaught Place, Delhi", description: "Wide range of exotic pets and supplies." },
];

const PAGE_SIZE = 4;

const CityCategoryListingsPage = () => {
  const { cityName, category } = useParams();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const filteredListings = useMemo(() =>
    allListings.filter(l =>
      l.city.toLowerCase() === cityName.toLowerCase() &&
      l.category === category &&
      (l.name.toLowerCase().includes(search.toLowerCase()) ||
        l.type.toLowerCase().includes(search.toLowerCase()) ||
        l.location.toLowerCase().includes(search.toLowerCase()))
    ),
    [cityName, category, search]
  );

  const totalPages = Math.ceil(filteredListings.length / PAGE_SIZE);
  const paginatedListings = filteredListings.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <section className="city-category-listings-section">
      <h2>
        {category.charAt(0).toUpperCase() + category.slice(1)} Services in <span className="highlight">{cityName}</span>
      </h2>
      <input
        type="text"
        placeholder="Search listings..."
        value={search}
        onChange={e => { setSearch(e.target.value); setPage(1); }}
        className="city-category-search"
      />
      <div className="city-category-listings">
        {paginatedListings.length === 0 ? (
          <div className="no-results">No listings found.</div>
        ) : (
          paginatedListings.map(listing => (
            <div className="city-category-card" key={listing.id}>
              <h3>{listing.name}</h3>
              <span className="listing-type">{listing.type}</span>
              <div className="listing-location">{listing.location}</div>
              <div className="listing-description">{listing.description}</div>
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