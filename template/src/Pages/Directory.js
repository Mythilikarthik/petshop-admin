import React, { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './Css/Directory.css';
import { Row, Col, Card, Button, Container } from "react-bootstrap";
import { BsGeoAltFill, BsStarFill } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
import dummyImage from '../dummy.jpg';

// Example data (replace with API data)

const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://petshop-admin.onrender.com"
    : "http://localhost:5000";
const Directory = () => {
  const navigate = useNavigate();
  const { city: routeCity, category: routeCategory, pet: routePet } = useParams();
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(routeCategory || '');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  // console.log("routeCity:",routeCity);


  const [allListings, setAllListings] = useState([]);
//   const allListings = [
//   { id: 1, name: "Name of Pet Shop", type: "Pet Shop", city: "Mumbai", category: "dog", location: "Bandra West, Mumbai", description: "Premium veterinary services for all your pet’s healthcare needs." },
//   { id: 2, name: "Name of Pet Food", type: "Pet Food", city: "Bangalore", category: "cat", location: "Indiranagar, Bangalore", description: "Professional grooming to keep your pets looking their best." },
//   { id: 3, name: "Name of Happy Tails Boarding", type: "Services", city: "Delhi", category: "dog", location: "Gurgaon, Delhi NCR", description: "Luxury pet boarding with spacious accommodations, playtime, and personalized care." },
//   { id: 4, name: "Name of Birdy Care Center", type: "Pet Shop", city: "Chennai", category: "bird", location: "T Nagar, Chennai", description: "Specialized care for your feathered friends." },
//   { id: 5, name: "Fishy Spa", type: "Pet Insurance", city: "Mumbai", category: "fish", location: "Andheri, Mumbai", description: "Aquarium cleaning and fish grooming services." },
//   // ...add more for demo
// ];

// Unique cities and categories for filters
const citiesList = async () => {
        try {
          const res = await fetch(`${API_BASE}/api/city/show`);
          const data = await res.json();
          if (data.success) {
            // console.log("Fetched cities:", data.cities);
            setCities(data.cities);
          }
        } catch (err) {
          console.error("Error fetching cities:", err.message);
        }
      }
      const categoriesList = async () => {
        try {
          const res = await fetch(`${API_BASE}/api/category/show`);
          const data = await res.json();
          if (data.success) {
            // console.log("Fetched categories:", data.categories);
            setCategories(data.categories);
          }
        } catch (err) {
          console.error("Error fetching categories:", err.message);
        }
      }
const [cities, setCities] = useState([]);
const [categories, setCategories] = useState([]);
useEffect(() => {
    citiesList();
    categoriesList();
  }, []);


const PAGE_SIZE = 4;

  // Filtered listings
  const filteredListings = useMemo(() => {
  const searchLower = search.toLowerCase();

  // return allListings.filter(l => {
  //   const cat = l.categories?.[0]?.categoryName?.toLowerCase() || "";
  //   const cityName = l.city?.city?.toLowerCase() || "";
  //   const shop = l.shopName?.toLowerCase() || "";
  //   const pet = l.petCategories?.[0]?.categoryName?.toLowerCase() || "";  

  //   return (
  //     (!selectedCategory || cat === selectedCategory.toLowerCase()) &&
  //     (!selectedCity || cityName === selectedCity.toLowerCase()) &&
  //     (!routePet || pet === routePet.toLowerCase()) &&
  //     (shop.includes(searchLower) ||
  //       cat.includes(searchLower) ||
  //       pet.includes(searchLower) ||
  //       cityName.includes(searchLower))
  //   );

  // });
  return allListings.filter(l => {
    const cat = (l.categories?.[0]?.categoryName || "").toLowerCase();
    const cityName = (l.city?.city || "").toLowerCase();
    const pet = (l.petCategories?.[0]?.categoryName || "").toLowerCase();
    const shop = (l.shopName || "").toLowerCase();

    const categoryMatch =
      !selectedCategory ||
      selectedCategory.toLowerCase() === "all" ||
      cat === selectedCategory.toLowerCase();

    const cityMatch =
      !selectedCity ||
      selectedCity.toLowerCase() === "all" ||
      cityName === selectedCity.toLowerCase();

    const petMatch =
      !search ||
      search.toLowerCase() === "all" ||
      pet.includes(searchLower);

    const searchMatch =
      shop.includes(searchLower) ||
      cat.includes(searchLower) ||
      pet.includes(searchLower) ||
      cityName.includes(searchLower);

    return categoryMatch && cityMatch && petMatch && searchMatch;
  });

}, [allListings, selectedCategory, selectedCity, routeCity, routeCategory, routePet, search]);


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
    console.log("called");
  };
  const handlePageChange = newPage => setPage(newPage);
  const fetchListings = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/listing`);
      const data = await res.json();
      if(data.success) {
        setAllListings(data.listings);
        //console.log("Listings fetched:", data.listings);
      }
    }
    catch (err) {
      console.error("Error fetching listings:", err);
    }
  }

  useEffect(() => {
    fetchListings();
    
  }, [])
//   useEffect(() => {
//   if (routeCity) setSelectedCity(routeCity);
//   if (routeCategory) setSelectedCategory(routeCategory);
//   if (routePet) setSearch(routePet);
// }, [routeCity, routeCategory, routePet]);

useEffect(() => {
  // CATEGORY
  if (categories.length && routeCategory) {
    if (routeCategory.toLowerCase() === "all") {
      setSelectedCategory("");
    } else {
      const match = categories.find(
        c => c.categoryName.toLowerCase() === routeCategory.toLowerCase()
      );
      setSelectedCategory(match ? match.categoryName : "");
    }
  }

  // CITY
  if (cities.length && routeCity) {
    if (routeCity.toLowerCase() === "all") {
      setSelectedCity("");
    } else {
      const match = cities.find(
        c => c.city.toLowerCase() === routeCity.toLowerCase()
      );
      setSelectedCity(match ? match.city : "");
    }
  }

  // PET TYPE / SEARCH STRING
  if (routePet) {
    setSearch(routePet.toLowerCase() === "all" ? "" : routePet);
  }
}, [routeCity, routeCategory, routePet, categories, cities]);



// console.log("all:",allListings)
  return (
    <section className="directory-inner-section">
      <Container>
        <div className="directory-header">
        <h2>
          {/* {console.log("selcat:",selectedCategory)} */}
          {selectedCategory ? selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1) : "All"} Services Directory
        </h2>
        <p>Browse top-rated pet services by category and city</p>
      </div>
      <div className="directory-filters">
        <input
          type="text"
          placeholder="Search ..."
          value={search}
          onChange={handleSearchChange}
        />
        <select value={selectedCategory} onChange={handleCategoryChange}>
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option value={cat.categoryName} key={cat._id}>
              {cat.categoryName}
            </option>
          ))}
        </select>
        <select value={selectedCity} onChange={handleCityChange}>
          <option value="">All Cities</option>
          {cities.map(c => (
            <option value={c.city} key={c._id}>
              {c.city}
            </option>
          ))}
        </select>
        
      </div>
      {/* <div className="directory-listings">
        {paginatedListings.length === 0 ? (
          <div className="no-results">No listings found.</div>
        ) : (
          paginatedListings.map(listing => (
            <div className="directory-card" key={listing._id}>
  <div className="directory-card-header">
    <h3>{listing.shopName}</h3>
    <span className="directory-type">
      {listing.petCategories?.[0]?.categoryName}
    </span>
  </div>

  <div className="directory-location">
    {listing.city.city}
  </div>

  <div className="directory-description">{listing.description}</div>

  <button className="view-details-btn">View Details</button>
</div>

          ))
        )}
      </div> */}
      <Row className="justify-content-center">
  {paginatedListings.length === 0 ? (
    <div className="no-results">No listings found.</div>
  ) : (
    paginatedListings.map(listing => (
      <Col key={listing._id} md={4} className="mb-4 d-flex">
  <Card className="provider-card w-100 h-100 d-flex flex-column">

    <Card.Header className="card-top-rated">
      <Card.Img
        variant="top"
        src={listing.image?.[0] || dummyImage}
        alt={listing.shopName}
      />
    </Card.Header>

    <Card.Body className="pos-rel d-flex flex-column flex-grow-1">
      <Card.Title>{listing.shopName}</Card.Title>
      <div className="service-tags mt-2">
        {console.log("petcats:",listing.petCategories)}
     {listing.petCategories?.length > 0 && (
        listing.petCategories.map((cat, index) => (
          <span key={index} className="badge badge-top-rated">
            {cat.categoryName}
          </span>
        ))
      )}

      </div>

      <Card.Text className="mt-3">{listing.description}</Card.Text>

      <div className="service-location mt-2">
        <BsGeoAltFill /> {listing.city.city}
      </div>

      <div className="service-tags mt-2">
        {listing.categories?.map((cat, index) => (
          <span key={index} className="service-tag tag-orange">
            {cat.categoryName}
          </span>
        ))}
      </div>

      {listing.rating && (
        <div className="service-rating d-flex gap-2 mt-2">
          <BsStarFill />
          <span>{listing.rating}</span>
        </div>
      )}

      {/* Button pushed to bottom */}
      <Button
        variant="primary"
        className="details-btn mt-auto"
        onClick={() => navigate(`/listing/${listing._id}`)}
      >
        View Details
      </Button>
    </Card.Body>
  </Card>
</Col>

    ))
  )}
</Row>

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
      {/* <div className="directory-header">
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
      )} */}
      </Container>
    </section>
  );
};

export default Directory;