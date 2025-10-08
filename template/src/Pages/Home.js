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


const Home = () => {
  return (
    <div className='home'>
      <Banner />
      <Container>
        <BrowseByPetCategory />
        <PopularCitiesSection />
        <FeaturedPetServicesSection />
        <PetHealthTips />
        <JoinCommunityNewsletter />
        <FAQSection />
      </Container>
    </div>
  )
}

export default Home