
import './App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
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
import { FaArrowUp } from "react-icons/fa";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from "./contexts/AuthContext";
import VerifyOtp from "./Pages/VerifyOtp";
import ForgotPassword from './Pages/ForgotPassword';
import ResetPassword from './Pages/ResetPassword';

const API_BASE =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_URL
    : "http://localhost:5000";
    function ScrollToTopOnNavigate() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return null; // nothing to render
}
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
    const [showScroll, setShowScroll] = useState(false);

  // Show button when scroll > 300px
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 300) {
        setShowScroll(true);
      } else {
        setShowScroll(false);
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll to top behavior
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
  <GoogleOAuthProvider clientId="932728880850-okmd8gvva3mv1vc00lsiqsjkambs2gol.apps.googleusercontent.com">
    <AuthProvider>
    <div className="App">      
      <BrowserRouter>
      <ScrollToTopOnNavigate />
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
          <Route path="/listings/:slugId" element={<ListingDetailPage />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>        
        <Footer home={home} categoryPage={categoryPage} />
         {showScroll && (
            <div className="scroll-to-top" onClick={scrollToTop}>
              <FaArrowUp />
            </div>
          )}
      </BrowserRouter>
    </div>
    </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
