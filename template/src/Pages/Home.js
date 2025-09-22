import React from 'react'
import "./Css/Home.css"
import Banner from '../Components/Banner';
import FeaturedPetServicesSection from '../Components/FeaturedPetServicesSection';
import BrowseByPetCategory from '../Components/BrowseByPetCategory';
import PopularCitiesSection from '../Components/PopularCitiesSection';
import PetHealthTips from '../Components/PetHealthTips';
import FAQSection from '../Components/FAQSection';
import JoinCommunityNewsletter from '../Components/JoinCommunityNewsletter';


const Home = () => {
  return (
    <div className='home'>
      <Banner />
      <BrowseByPetCategory />
      <PopularCitiesSection />
      <FeaturedPetServicesSection />
      <PetHealthTips />
      <JoinCommunityNewsletter />
      <FAQSection />
    </div>
  )
}

export default Home