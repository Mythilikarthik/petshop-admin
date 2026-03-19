import React, { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './Css/Directory.css';
import { Row, Col, Card, Button, Container, Image, Badge, Modal } from "react-bootstrap";
import { BsClock, BsClockFill, BsClockHistory, BsCloudCheckFill, BsGeoAltFill, BsStarFill } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
import dummyImage from '../dummy.jpg';
import AdSlider from '../Components/AdSlider';
import { FaStar } from 'react-icons/fa';
import { TiTick } from "react-icons/ti";
import { MdVerified } from "react-icons/md";
import { GiLaurelsTrophy, GiTrophy } from "react-icons/gi";
import { useEngagementGate } from "../hooks/useEngagementGate";
import { useAuth } from "../contexts/AuthContext";
import AuthGateModal from "../hooks/AuthGateModel";
import StarRating from "../Components/StarRating";

// Example data (replace with API data)


const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://petshop-admin.onrender.com"
    : "http://localhost:5000";
const Directory = () => {
  const { user, authLoading  } = useAuth();
  const engagementGate = useEngagementGate(user);
const [showAuthGate, setShowAuthGate] = useState(false);

  const pgname = "directory";
  const navigate = useNavigate();
  // const { city: routeCity, category: routeCategory, pet: routePet } = useParams();
  const params = useParams();

const routeCity = params.city ? decodeURIComponent(params.city) : "";
const routeCategory = params.category ? decodeURIComponent(params.category) : "";
const routePet = params.pet ? decodeURIComponent(params.pet) : "";

  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(routeCategory || '');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [topHomeAds, setTopHomeAds] = useState([]);
    const [bottomHomeAds, setBottomHomeAds] = useState([]);
    const [middleHomeAds, setMiddleHomeAds] = useState([]);
  const [adSettings, setAdSettings] = useState({ slideInterval: 5, maxImages: 5 });
  const [selectedPet, setSelectedPet] = useState("");
const [petCategories, setPetCategories] = useState([]);
const [quickFilter, setQuickFilter] = useState(""); // topRated | verified
const [sortBy, setSortBy] = useState("relevance");  // relevance | rating | popular | distance
const [minRating, setMinRating] = useState(0);      // 0 | 3.5 | 4 | 4.5 | 5

const petCategoriesList = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/pet-category/show`);
    const data = await res.json();
    if (data.success) {
      setPetCategories(data.petCategories);
      // console.log(petCategories);
    }
  } catch (err) {
    console.error("Error fetching pet categories:", err);
  }
};

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
    petCategoriesList();
  }, []);


const PAGE_SIZE = 20;

  // Filtered listings
//   const filteredListings = useMemo(() => {
//   const searchLower = search.toLowerCase();

//   // return allListings.filter(l => {
//   //   const cat = l.categories?.[0]?.categoryName?.toLowerCase() || "";
//   //   const cityName = l.city?.city?.toLowerCase() || "";
//   //   const shop = l.shopName?.toLowerCase() || "";
//   //   const pet = l.petCategories?.[0]?.categoryName?.toLowerCase() || "";  

//   //   return (
//   //     (!selectedCategory || cat === selectedCategory.toLowerCase()) &&
//   //     (!selectedCity || cityName === selectedCity.toLowerCase()) &&
//   //     (!routePet || pet === routePet.toLowerCase()) &&
//   //     (shop.includes(searchLower) ||
//   //       cat.includes(searchLower) ||
//   //       pet.includes(searchLower) ||
//   //       cityName.includes(searchLower))
//   //   );

//   // });
//   return allListings.filter(l => {
//     const cat = (l.categories?.[0]?.categoryName || "").toLowerCase();
//     const cityName = (l.city?.city || "").toLowerCase();
//     // const pet = (l.petCategories?.[0]?.categoryName || "").toLowerCase();
//     const petNames = (l.petCategories || [])
//   .map(p => p.categoryName.toLowerCase());
//     const shop = (l.shopName || "").toLowerCase();

//     const categoryMatch =
//       !selectedCategory ||
//       selectedCategory.toLowerCase() === "all" ||
//       cat === selectedCategory.toLowerCase();

//     const cityMatch =
//       !selectedCity ||
//       selectedCity.toLowerCase() === "all" ||
//       cityName === selectedCity.toLowerCase();

//     const petMatch =
//       !search ||
//       search.toLowerCase() === "all" ||
//         petNames.some(p => p.includes(searchLower));

//     const searchMatch =
//       shop.includes(searchLower) ||
//       cat.includes(searchLower) ||
//       petNames.some(p => p.includes(searchLower));
//       cityName.includes(searchLower);

//     return categoryMatch && cityMatch && petMatch && searchMatch;
//   });

// }, [allListings, selectedCategory, selectedCity, routeCity, routeCategory, routePet, search]);

const filteredListings = useMemo(() => {
  let result = allListings.filter(l => {
    // console.log("Views" , l.views);
    const category = (l.categories?.[0]?.categoryName || "").toLowerCase();
    const city = (l.city?.city || "").toLowerCase();
    const shop = (l.shopName || "").toLowerCase();
    const rating = Number(l.rating || 0);

    const petNames = (l.petCategories || []).map(p =>
      p.categoryName.toLowerCase()
    );

    const categoryMatch =
      !selectedCategory || category === selectedCategory.toLowerCase();

    const cityMatch =
      !selectedCity || city === selectedCity.toLowerCase();

    const petMatch =
      !selectedPet || petNames.includes(selectedPet.toLowerCase());

    const searchMatch =
      shop.includes(search.toLowerCase()) ||
      category.includes(search.toLowerCase()) ||
      city.includes(search.toLowerCase()) ||
      petNames.some(p => p.includes(search.toLowerCase()));

    const ratingMatch = rating >= minRating;

    const quickFilterMatch =
      !quickFilter ||
      (quickFilter === "topRated" && rating >= 4) ||
      (quickFilter === "verified" && l.isVerified === true);

    return (
      categoryMatch &&
      cityMatch &&
      petMatch &&
      searchMatch &&
      ratingMatch &&
      quickFilterMatch
    );
  });

  // 🔃 SORTING
  switch (sortBy) {
    case "rating":
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      break;

    case "popular":
      result.sort((a, b) => (b.views || 0) - (a.views || 0));
      break;

    case "distance":
      result.sort((a, b) => (a.distance || 0) - (b.distance || 0));
      break;

    default:
      break; // relevance (API order)
  }

  return result;
}, [
  allListings,
  selectedCategory,
  selectedCity,
  selectedPet,
  search,
  quickFilter,
  sortBy,
  minRating
]);


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
    // console.log("called");
  };
  const handlePageChange = newPage => setPage(newPage);
  const fetchListings = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/listing/directory/approved`);
      const data = await res.json();
      if(data.success) {
        setAllListings(data.listings);
        // console.log("Listings fetched:", data.listings);
      }
    }
    catch (err) {
      console.error("Error fetching listings:", err);
    }
  }

  const fetchBottomHomeAds = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/ads/bottom/${pgname}`);
    const data = await res.json();

    if (data.success) {
      // Apply the limit here
      const limitedAds = data.ads.slice(0, data.settings.maxImages);

      setBottomHomeAds(limitedAds);
      setAdSettings(data.settings); 
    }
  } catch (err) {
    console.error("Error fetching home ads:", err);
  }
};
const fetchMiddleHomeAds = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/ads/middle/${pgname}`);
    const data = await res.json();

    if (data.success) {
      // Apply the limit here
      const limitedAds = data.ads.slice(0, data.settings.maxImages);

      setMiddleHomeAds(limitedAds);
      setAdSettings(data.settings); 
    }
  } catch (err) {
    console.error("Error fetching home ads:", err);
  }
};
    const fetchTopHomeAds = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/ads/top/${pgname}`);
    const data = await res.json();

    if (data.success) {
      // Apply the limit here
      const limitedAds = data.ads.slice(0, data.settings.maxImages);

      setTopHomeAds(limitedAds);
      setAdSettings(data.settings); 
    }
  } catch (err) {
    console.error("Error fetching home ads:", err);
  }
};
useEffect(() => {
  if (!authLoading && !user && engagementGate) {
    setShowAuthGate(true);
  }
}, [authLoading, user, engagementGate]);
useEffect(() => {
  if (user) {
    setShowAuthGate(false);
  }
}, [user]);

  useEffect(() => {
    fetchListings();
    fetchTopHomeAds();
    fetchBottomHomeAds();
    fetchMiddleHomeAds();
  }, [])
//   useEffect(() => {
//   if (routeCity) setSelectedCity(routeCity);
//   if (routeCategory) setSelectedCategory(routeCategory);
//   if (routePet) setSearch(routePet);
// }, [routeCity, routeCategory, routePet]);

useEffect(() => {
  // PET CATEGORY
  if (petCategories.length && routePet) {
    if (routePet.toLowerCase() === "all") {
      setSelectedPet("");
    } else {
      const match = petCategories.find(
        p => p.categoryName.toLowerCase() === routePet.toLowerCase()
      );
      setSelectedPet(match ? match.categoryName : "");
    }
  }

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
}, [routeCity, routeCategory, routePet, categories, cities, petCategories]);


const [banner, setBanner] = useState(null);

const Banner = async () => {
  try {
    const url = routeCity
      ? `${API_BASE}/api/city-banner/name/${routeCity}`
      : `${API_BASE}/api/directory-banner`;

    const res = await fetch(url);

    if (!res.ok) {
      throw new Error("Failed to fetch banner");
    }

    const data = await res.json();
// console.log(data);
    if (data.success) {
      setBanner(data.banner); // ✅ correct
    }
    
  } catch (err) {
    console.error("Banner error:", err.message);
  }
};

useEffect(() => {
  Banner();
}, [routeCity]);

useEffect(() => {
  Banner();
}, [routeCity]);
useEffect(() => {
  if (!localStorage.getItem("entryTime")) {
    localStorage.setItem("entryTime", Date.now());
  }
}, []);


// console.log("all:",allListings)
  return (
    <>
    <AuthGateModal
  show={showAuthGate}
  onClose={() => setShowAuthGate(false)}
/>
    {banner?.banner && (
      <Image
        className='img-responsive'
        src={`${API_BASE}/${banner.banner}`}
        alt="Banner"
        style={{ width: "100%", height: "300px", objectFit: "cover" }}
      />
    )}
    {topHomeAds.length > 0 && (
      <AdSlider ads={topHomeAds} maxImages={adSettings.maxImages} interval={adSettings.slideInterval} />
    )}
    {middleHomeAds.length > 0 && (
      <AdSlider ads={middleHomeAds} maxImages={adSettings.maxImages} interval={adSettings.slideInterval} float={true}
      side="right" />
    )}
    <section className="directory-inner-section">
      
      <Container>

        <div className="directory-header">
        <h2>
          {/* {console.log("selcat:",selectedCategory)} */}
          {selectedCategory ? selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1) : "All"} Services Directory
        </h2>
        <p>Browse top-rated pet services by category and city</p>
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
      <Row>
        <Col md={3} className='bg-grey'>
          <div className="directory-filters sticky-top shadow-sm  rounded p-3" style={{"top": "70px"}}>
            <Row className=" shadow-sm m-4 rounded  mb-0  ">
            <h5 style={{background: "#eaeaea", padding: "14px", textAlign: "center"}}>Apply Filter</h5>
            <div className=' d-flex gap-3 flex-column p-4'>
            <input
              type="text"
              placeholder="Search ..."
              value={search}
              onChange={handleSearchChange}
            />
            <select value={selectedPet} onChange={e => {
              setSelectedPet(e.target.value);
              setPage(1);
            }}>
              <option value="">All Pets</option>
              
              {petCategories.map(pet => (
                <option key={pet._id} value={pet.categoryName}>
                  {pet.categoryName}
                </option>
              ))}
            </select>

            <select value={selectedCategory} onChange={handleCategoryChange}>
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option value={cat.categoryName} key={cat._id}>
                  {cat.categoryName}
                </option>
              ))}
            </select>
            {!routeCity && (
              <select value={selectedCity} onChange={handleCityChange}>
                <option value="">All Cities</option>
                {cities.map(c => (
                  <option value={c.city} key={c._id}>
                    {c.city}
                  </option>
                ))}
              </select>
            )}
            </div>
            </Row>
            <Row className='shadow-sm m-4 rounded  mb-0 '>
              <h5 style={{background: "#eaeaea", padding: "14px", textAlign: "center"}}>Quick Filters</h5>
          <div className=' d-flex gap-3 flex-column p-4'>
            <Button
              size="sm"
              variant={quickFilter === "topRated" ? "primary" : "outline-secondary"}
              onClick={() => setQuickFilter("topRated")}
            >
              <FaStar fill="#ff8800" /> Top Rated
            </Button>

            <Button
              size="sm"
              variant={quickFilter === "verified" ? "primary" : "outline-secondary"}
              onClick={() => setQuickFilter("verified")}
            >
              <TiTick /> Verified
            </Button>

            {quickFilter && (
              <Button size="sm" variant="link" onClick={() => setQuickFilter("")}>
                Clear
              </Button>
            )}
          </div>
          
            </Row>
            <Row className='shadow-sm m-4 rounded  mb-0 '>
              <h5 style={{background: "#eaeaea", padding: "14px", textAlign: "center"}}>Sort by</h5>
          <div className=' d-flex gap-3 flex-column p-4'>
            {["relevance", "rating", "popular"].map(type => (
              <Button
                key={type}
                size="sm"
                variant={sortBy === type ? "dark" : "outline-secondary"}
                onClick={() => setSortBy(type)}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Button>
            ))}
          </div>
            </Row>
            <Row className='shadow-sm m-4 rounded '>
              
          <h5 style={{background: "#eaeaea", padding: "14px", textAlign: "center"}}>Ratings</h5>
          <div className="d-flex flex-wrap gap-2 p-4">
            {[0, 3, 4, 5].map(r => (
              <Button
                key={r}
                size="sm"
                variant={minRating === r ? "warning" : "outline-secondary"}
                onClick={() => setMinRating(r)}
              >
                {r === 0 ? "Any" : r === 5 ? `${r}` : `${r}+`}
              </Button>
            ))}
          </div>
            </Row>
            
          </div>
          


        </Col>
        <Col md={9}>
            <Row className="justify-content-center">
  {paginatedListings.length === 0 ? (
    <div className="no-results mt-5 d-flex align-items-center justify-content-center">
      <span className='stylish-text'>
        <strong>
          <i className='animation text-orange-500'>
            Coming Soon 
          </i>
        </strong>
      </span>
    </div>
  ) : (
    paginatedListings.map(listing => {
      const safeSlug = listing.slug && listing.slug !== "undefined"
        ? listing.slug
        : listing.shopName
            ?.toLowerCase()
            .trim()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "");

            {console.log(listing)}

      return(
        <Col key={listing._id} md={4} className="mb-4 d-flex">
  <Card className="provider-card w-100 h-100 d-flex flex-column">

    <Card.Header className="card-top-rated p-0">
      
      <Card.Img
        variant="top"
        src={
    listing.bannerImage
      ? `${API_BASE}/${listing.bannerImage}`
      : dummyImage
  }
        alt={listing.shopName}
      />
    </Card.Header>

    <Card.Body className="pos-rel d-flex flex-column flex-grow-1">
      <div className='status-updates mt-2 mb-2 d-flex gap-2'>
        {listing.isVerified && (
          <div className='verified-identification'>
            <Badge pill bg="success" className='gap-1 d-flex'>
              <MdVerified />
              Verified
            </Badge>
          </div>
          
        )}
        {listing.rating >=4 && (
          <div className='top-rated-identification'>
            <Badge pill bg="success" className='gap-1 d-flex'>
              <GiTrophy  />
              Top Rated
            </Badge>
          </div>
        )}
        
      </div>
      {/* <Card.Title title={listing.shopName || ""}>{listing.shopName && listing.shopName.length >10 ? listing.shopName.slice(0,10) + "..." : listing.shopName}</Card.Title> */}
      <Card.Title
  title={listing.shopName}
  style={{
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "200px",
    cursor: "pointer",
    marginTop: "12px",
  }}
>
  {listing.shopName}
</Card.Title>
      <div className="service-tags mt-2">
        
     {listing.petCategories?.length > 0 && (
        listing.petCategories.map((cat, index) => (
          <span key={index} className="badge badge-top-rated">
            {cat.categoryName}
          </span>
        ))
      )}

      </div>
      {/* <div className="service-rating align-items-center d-flex gap-1">
          <span className='align-items-center d-flex' role="img" aria-label="star" style={{"verticalAlign" : "unset"}}> <BsStarFill /> </span> 
          <span className='d-block'>{listing.rating}</span>
      </div> */}
      <div className="service-rating d-flex align-items-center gap-2 mt-2">
        <StarRating 
          rating={listing.rating} 
          reviewCount={listing.reviewCount} 
        />
      </div>
{/* <div className="service-rating align-items-center d-flex gap-2 mt-2">
  {Number(listing.rating) > 0 ? (
    <>
      <BsStarFill color="#ffb400" />
      <span>{Number(listing.rating).toFixed(1)}</span>
    </>
  ) : (
    <span className="text-muted small">No reviews yet</span>
  )}
</div> */}
      

      {/* <Card.Text className="mt-2">
        {listing.description.length > 50
          ? listing.description.slice(0, 50) + "..."
          : listing.description}
      </Card.Text> */}
      <Card.Text
        className="mt-2"
        title={listing.description}
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "-webkit-box",
          WebkitLineClamp: 2,   // number of lines
          WebkitBoxOrient: "vertical",
          cursor: "pointer",
        }}
      >
        {listing.description}
      </Card.Text>

      <div className="service-location mt-2 d-flex gap-2 align-items-center">
        <BsGeoAltFill /> {listing.city.city}
      </div>
      {/* <div className="service-location mt-2">
        {listing.businessHours?.map((bh, index) => (
          <div key={index}>
            <strong>{bh.day}:</strong>{" "}
            {bh.closed ? "Closed" : `${bh.open} - ${bh.close}`}
          </div>
        ))}
      </div> */}
      {/* <div className="service-location mt-2">
  <BsGeoAltFill />{" "}
  {listing.businessHours
    ?.map((bh) =>
      bh.closed ? `${bh.day}: Closed` : `${bh.day}: ${bh.open}-${bh.close}`
    )
    .join(", ")}
</div> */}
<div className="service-location mt-2 d-flex gap-2 align-items-center">
  <BsClockFill /> 
  {(() => {
    const today = new Date().toLocaleString("en-US", { weekday: "long" });

    const todayHours = listing.businessHours?.find(
      (bh) => bh.day === today
    );

    return todayHours
      ? todayHours.closed
        ? "Closed Today"
        : `Open Today: ${todayHours.open} - ${todayHours.close}`
      : "Hours not available";
  })()}
</div>

      <div className="service-tags mt-2">
        {listing.categories?.map((cat, index) => (
          <span key={index} className="service-tag tag-orange">
            {cat.categoryName}
          </span>
        ))}
      </div>

      {/* {listing.rating && (
        <div className="service-rating d-flex gap-2 mt-2">
          <BsStarFill />
          <span>{listing.rating}</span>
        </div>
      )} */}


      
      {/* Button pushed to bottom */}
      <Button
        variant="primary"
        className="details-btn mt-auto"
        // onClick={() => navigate(`/listing/${listing._id}`)} 
        
        onClick = {() => navigate(`/listings/${safeSlug}-${listing._id}`)}
      >
        View Details
      </Button>
    </Card.Body>
  </Card>
</Col>
      )

})
  )}
</Row>
        </Col>
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
    {bottomHomeAds.length > 0 && (
        <div className='footer-ads'>
          <Container>
            <AdSlider ads={bottomHomeAds} maxImages={adSettings.maxImages} interval={adSettings.slideInterval} />
          </Container>
        </div>
      )}
      </>
  );
};

export default Directory;