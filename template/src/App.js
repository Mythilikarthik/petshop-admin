
import './App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Directory from './Pages/Directory';
import PetHealth from './Pages/PetHealth';
import About from './Pages/About';
import TermsAndConditions from './Pages/TermsAndCondition';
import PrivacyPolicy from './Pages/PrivacyPolicy';
import CookiePolicy from './Pages/CookiePolicy';
import Contact from './Pages/Contact';
import Header from './Components/Header';
import Footer from './Components/Footer';
import CategoryPage from './Pages/CategoryPage';
// import CityCategoriesPage from './Pages/CityCategoriesPage';
import CityCategoryListingsPage from './Pages/CityCategoryListingsPage';
import ViewAllCitiesPage from './Pages/ViewAllCitiesPage';
import ListingDetailPage from './Pages/ListingDetailPage';
import Faq from './Pages/Faq';
import Blog from './Pages/Blog';
import Register from './Pages/Register';
import ClaimListing from './Pages/ClaimListing';
import BlogDetail from './Pages/BlogDetail';

const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://petshop-admin.onrender.com"
    : "http://localhost:5000";
function App() {
  const [home, setHome] = useState([]);
  const [categoryPage, setCategoryPage] = useState([]);
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
      fetchHomeData();
      fetchCategoryData();
    }, []);
  return (
    <div className="App">
      
      <BrowserRouter>
        <Header home={home} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/type/:categoryName" element={<CategoryPage />} />
          <Route path="/directory" element={<Directory />} />
          <Route path="/pet-health" element={<PetHealth />} />
          <Route path="/about" element={<About />} />
          <Route path="/termsandconditions" element={<TermsAndConditions />} />
          <Route path="/privacypolicy" element={<PrivacyPolicy />} />
          <Route path="/cookiepolicy" element={<CookiePolicy />} />
          <Route path="/contact" element={<Contact />} />
          {/* <Route path="/city/:cityName" element={<CityCategoriesPage />} /> */}
          <Route path="/city/:cityName/" element={<CityCategoryListingsPage />} />
          <Route path="/cities" element={<ViewAllCitiesPage />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/register" element={<Register />} />
          <Route path="/claim/:listingId" element={<ClaimListing />} />
          <Route path="/listing/:listingId" element={<ListingDetailPage />} />
          <Route path="/directory/:city?/:category?/:pet?" element={<Directory />} />
        </Routes>        
        <Footer home={home} categoryPage={categoryPage} />
      </BrowserRouter>
    </div>
  );
}

export default App;
