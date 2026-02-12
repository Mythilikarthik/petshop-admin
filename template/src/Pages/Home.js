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
import AdSlider from '../Components/AdSlider';


const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://petshop-admin.onrender.com"
    : "http://localhost:5000";
const Home = () => {  
  const pgname = "home";
  const [home, setHome] = useState([]);
  const [categoryPage, setCategoryPage] = useState([]);
  const [cities, setCities] = useState([]);
  const cityListingsCombine = [{}];
  const [blog, setBlog] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [topHomeAds, setTopHomeAds] = useState([]);
  const [bottomHomeAds, setBottomHomeAds] = useState([]);
  const [middleHomeAds, setMiddleHomeAds] = useState([]);
const [adSettings, setAdSettings] = useState({ slideInterval: 5, maxImages: 5 });


  useEffect(() => {
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

    const fetchHomeData = async () => {
      try {
        const homeRes = await fetch(`${API_BASE}/api/home-page`);
        const homeData = await homeRes.json();
        if(homeData.success) setHome(homeData.home);
        console.log("Homedata", homeData.home);
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
      //console.log("Cities with Listing Counts (8 only):", firstEight);
    }
  } catch (err) {
    console.error("Error fetching city data:", err);
  }
};
const blogData = async () => {
  try {
    const blogRes = await fetch(`${API_BASE}/api/blog`);
    const blogData = await blogRes.json();
    if(blogData.success) {
      //console.log("Blog Data:", blogData.blogs);
      setBlog(blogData.blogs.slice(0, 3));
    }
  } catch (err) {
    console.error("Error fetching blog data:", err);
  }
};
const fetchFaqs = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/faq`); 
        const data = await res.json();
        if(data.success) {
          setFaqs(data.listings.slice(0, 5));
          //console.log("FAQ Data:", data.listings);
        }
      } catch (err) {
        console.error("Error fetching FAQ data:", err);
      }
    };

    fetchHomeData();
    fetchCategoryData();
    fetchCityData();
    blogData();
    fetchFaqs();
    fetchTopHomeAds();
    fetchBottomHomeAds();
    fetchMiddleHomeAds();
  }, []);
  return (
    <div className='home'>
      <Banner home={home} />
      {topHomeAds.length > 0 && (
  <AdSlider ads={topHomeAds} maxImages={adSettings.maxImages} interval={adSettings.slideInterval} />
)}
{middleHomeAds.length > 0 && (
        <AdSlider ads={middleHomeAds} maxImages={adSettings.maxImages} interval={adSettings.slideInterval} float={true}
  side="right" />
      )}

      <Container fluid className='p-0'>
        <BrowseByPetCategory categoryPage={categoryPage} />
        <PopularCitiesSection cities={cities} />
        <FeaturedPetServicesSection />
        <PetHealthTips blog={blog} />
        <JoinCommunityNewsletter home={home} />
        <FAQSection faqs={faqs} />
      </Container>
      
      {bottomHomeAds.length > 0 && (
        <div className='footer-ads'>
          <Container>
            <AdSlider ads={bottomHomeAds} maxImages={adSettings.maxImages} interval={adSettings.slideInterval} />
          </Container>
        </div>
      )}
    </div>
  )
}

export default Home