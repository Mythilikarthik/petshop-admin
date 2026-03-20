import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Css/ViewAllCitiesPage.css';


const API_BASE =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_URL
    : "http://localhost:5000";
const ViewAllCitiesPage = () => {
  const navigate = useNavigate();
  const [cities, setCities] = useState([]);
  const fetchCityData = async () => {
  try {
    const cityRes = await fetch(`${API_BASE}/api/city/show`);
    const cityData = await cityRes.json();

    if (cityData.success && Array.isArray(cityData.cities)) {
      // Create an array of promises for city + listing count
      const cityListingsCombine = await Promise.all(
        cityData.cities.map(async (c) => {
          try {
            const listingsRes = await fetch(`${API_BASE}/api/listing/city`, {
              method: "POST",
              headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
              body: JSON.stringify({ city: c._id }),
            });

            const listingsData = await listingsRes.json();

            if (listingsData.success) {
              //console.log(`City: ${c.city}, Listings Count: ${listingsData.listings}`);
              return {
                city: c.city,
                _id: c._id,
                listingsCount: listingsData.listings,
              };
            } else {
              return { city: c.city, _id: c._id, listingsCount: 0 };
            }
          } catch (err) {
            console.error(`Error fetching listings for ${c.city}:`, err);
            return { city: c.city, _id: c._id, listingsCount: 0 };
          }
        })
      );

      // const firstEight = cityListingsCombine.slice(0, 8);
      const firstEight = cityListingsCombine
  .sort((a, b) => b.listingsCount - a.listingsCount);


      setCities(firstEight);
      //console.log("Cities with Listing Counts (8 only):", firstEight);
    }
  } catch (err) {
    console.error("Error fetching city data:", err);
  }
};
useEffect(() => {
fetchCityData();
}, [])

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
            key={city.city}
            onClick={() => navigate(`/directory/${city.city.toLowerCase()}`)}
            role="button"
            tabIndex={0}
            onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && navigate(`/directory/${city.city.toLowerCase()}`)}
          >
            <div className="city-name">{city.city}</div>
            <div className="city-listings">{city.listingsCount}+ listings</div> 
          </div>
        ))}
      </div>
    </section>
  );
};

export default ViewAllCitiesPage;