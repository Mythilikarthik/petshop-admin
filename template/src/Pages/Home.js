import React from 'react'
import "./Css/Home.css"
import Banner from '../Components/Banner';
import FeaturedPetServicesSection from '../Components/FeaturedPetServicesSection';
import BrowseByPetCategory from '../Components/BrowseByPetCategory';
import PopularCitiesSection from '../Components/PopularCitiesSection';
import PetHealthTips from '../Components/PetHealthTips';
import FAQSection from '../Components/FAQSection';
import JoinCommunityNewsletter from '../Components/JoinCommunityNewsletter';
import { Container } from 'react-bootstrap';
import { useState } from 'react';
import { useEffect } from 'react';

const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://petshop-admin.onrender.com"
    : "http://localhost:5000";
const Home = () => {  
  const [home, setHome] = useState([]);
  const [categoryPage, setCategoryPage] = useState([]);
  const [cities, setCities] = useState([]);
  const cityListingsCombine = [{}];
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const homeRes = await fetch(`${API_BASE}/api/home-page`);
        const homeData = await homeRes.json();
        if(homeData.success) setHome(homeData.home);
        //console.log("Homedata", homeData.home);
      } catch (err) {
        console.error("Error fetching home data:", err);
      }
    };
    const fetchCategoryData = async () => {
      try {
        const categoryRes = await fetch(`${API_BASE}/api/categorypage`);
        const categoryData = await categoryRes.json();
        if(categoryData.success) {
          setCategoryPage(categoryData.pages.slice(0, 6));
          //console.log("Category Page Data:", categoryData.pages);
        }
      } catch (err) {
        console.error("Error fetching category data:", err);
      }
    };
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
  .sort((a, b) => b.listingsCount - a.listingsCount)
  .slice(0, 8);


      setCities(firstEight);
      console.log("Cities with Listing Counts (8 only):", firstEight);
    }
  } catch (err) {
    console.error("Error fetching city data:", err);
  }
};

    fetchHomeData();
    fetchCategoryData();
    fetchCityData();
  }, []);
  return (
    <div className='home'>
      <Banner home={home} />
      <Container fluid>
        <BrowseByPetCategory categoryPage={categoryPage} />
        <PopularCitiesSection cities={cities} />
        <FeaturedPetServicesSection />
        <PetHealthTips />
        <JoinCommunityNewsletter home={home} />
        <FAQSection />
      </Container>
    </div>
  )
}

export default Home