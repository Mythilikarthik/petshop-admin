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
import Loader from './Components/Loader'; // Import your loader
import CategoryPage from './Pages/CategoryPage';
import CityCategoryListingsPage from './Pages/CityCategoryListingsPage';
import ViewAllCitiesPage from './Pages/ViewAllCitiesPage';
import ListingDetailPage from './Pages/ListingDetailPage';
import Faq from './Pages/Faq';
import Blog from './Pages/Blog';
import Register from './Pages/Register';
import ClaimListing from './Pages/ClaimListing';
import BlogDetail from './Pages/BlogDetail';
import { FaArrowUp, FaWhatsapp } from "react-icons/fa";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from "./contexts/AuthContext";
import VerifyOtp from "./Pages/VerifyOtp";
import ForgotPassword from './Pages/ForgotPassword';
import ResetPassword from './Pages/ResetPassword';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import Offers from './Pages/Offers';
// import OfferSinglePage from './Pages/OfferSinglePage';
import TrialMock from "./Pages/TrailMock";
import DocumentViewer from "./Pages/DocumentViewer";
import PetGroomingCityPage from './Pages/PetGroomingDirectoryPage';
import PetBoarding from "./Pages/PetBoarding";
import PetBoardingCityPage from './Pages/PetBoardingDirectoryPage';
import PetShopsAreaPage from './Pages/PetShopsDirectoryPage';
import PetShops from "./Pages/PetShops";

const API_BASE =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_URL
    : "http://localhost:5000";

function ScrollToTopOnNavigate() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return null; 
}
const GlobalReCaptchaTracker = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const location = useLocation();

  useEffect(() => {
    const handleNavigationSecurity = async () => {
      if (!executeRecaptcha) {
        return; // Hook is not initialized yet
      }

      // Generate a background token for page view tracking
      // ReCAPTCHA converts route punctuation to underscores internally
      const actionName = `page_view_${location.pathname.replace(/[^a-zA-Z0-9_]/g, '_')}`.slice(0, 32);
      
      try {
        const token = await executeRecaptcha(actionName);
        
        // Optional: If you want to check scores right on page load, 
        // you would send this token to your backend via an API here.
        // console.log("Secure Token Generated:", token);
      } catch (error) {
        console.error("ReCAPTCHA Execution Failed", error);
      }
    };

    handleNavigationSecurity();
  }, [executeRecaptcha, location]);

  return null; // This component doesn't render anything visually
};
// 1. Separate the main app content into its own component
function AppContent() {
  const [home, setHome] = useState([]);
  const [categoryPage, setCategoryPage] = useState([]);
  const [showScroll, setShowScroll] = useState(false);
  
  // Loader states
  const [initialLoading, setInitialLoading] = useState(true); // For first-time API load
  const [routeLoading, setRouteLoading] = useState(false);     // For page transitions

  const location = useLocation();

  // Handle initial API data loading
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [homeRes, categoryRes] = await Promise.all([
          fetch(`${API_BASE}/api/home-page`),
          fetch(`${API_BASE}/api/categorypage`)
        ]);
        const homeData = await homeRes.json();
        const categoryData = await categoryRes.json();

        if (homeData.success) setHome(homeData.home);
        if (categoryData.success) setCategoryPage(categoryData.pages.slice(0, 6));
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchData();
  }, []);

  // 2. Trigger a brief loader whenever the URL path changes
  useEffect(() => {
    // Skip triggering on the very first mount since initialLoading handles it
    if (initialLoading) return;

    setRouteLoading(true);
    
    // Simulate a brief transition delay (e.g., 400ms) so the user registers the page switch
    const timer = setTimeout(() => {
      setRouteLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [location.pathname]); // Runs every time the route changes

  // Scroll button logic
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 300) setShowScroll(true);
      else setShowScroll(false);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 3. Render loader for initial API fetch OR route changes
  if (initialLoading || routeLoading) {
    return <Loader />;
  }

  return (
    <div className="App">      
      <ScrollToTopOnNavigate />
      <Header home={home} />
      <GlobalReCaptchaTracker />
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
        <Route path="/city/:cityName/" element={<CityCategoryListingsPage />} />
        <Route path="/cities" element={<ViewAllCitiesPage />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogDetail />} />
        <Route path="/register" element={<Register />} />
        {/* <Route path="/claim/:listingId" element={<ClaimListing />} /> */}
        <Route path="/claim/:slug" element={<ClaimListing />} />
        <Route path="/listing/:listingId" element={<ListingDetailPage />} />
        <Route path="/directory/:city?/:category?/:pet?" element={<Directory />} />
        <Route path="/listings/:slug" element={<ListingDetailPage />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/offers" element={<Offers />} />
        {/* <Route path="/offer-single-page" element={<OfferSinglePage />} /> */}
        <Route path='/trial' element={<TrialMock />} />
        
        <Route path="/pet-grooming" element={<PetGroomingCityPage />} />
        <Route path="/pet-grooming/:cityName" element={<DocumentViewer />} />
        <Route path="/pet-boarding" element={<PetBoardingCityPage />} />
        <Route path="/pet-boarding/:cityName" element={<PetBoarding />} />
        <Route path="/pet-shops" element={<PetShopsAreaPage />} />
        <Route path="/pet-shops/:areaName" element={<PetShops />} />
      </Routes>        
      <Footer home={home} categoryPage={categoryPage} />
      <a 
        href="https://wa.me/918870223852" 
        className="whatsapp-float" 
        target="_blank" 
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
      >
        <FaWhatsapp />
      </a>
      {showScroll && (
        <div className="scroll-to-top" onClick={scrollToTop}>
          <FaArrowUp />
        </div>
      )}
    </div>
  );
}

// 4. Main App wrapper that safely houses BrowserRouter
function App() {
  return (
    <GoogleOAuthProvider clientId="932728880850-okmd8gvva3mv1vc00lsiqsjkambs2gol.apps.googleusercontent.com">
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;