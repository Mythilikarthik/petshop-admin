import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './Pages/Dashboard';
import BusinessListings from './Pages/BusinessListings';
import CategoryListings from './Pages/CategoryListings';
import ViewListings from './Pages/ViewListings';
import EditListings from './Pages/EditListings';
import AddListings from './Pages/AddListings';
import AdListings from './Pages/AdListings';
import AddCategory from './Pages/AddCategory';
import EditCategory from './Pages/EditCategory';
import ViewCategory from './Pages/ViewCategory';
import CustomAd from './Pages/CustomAd';
import AddCity from './Pages/AddCity';
import EditCity from './Pages/EditCity';
import ViewCity from './Pages/ViewCity';
import UserManagement from './Pages/UserManagement';
import PageManagement from './Pages/PageManagemnent';
import Email from './Pages/Email';
import Login from './Pages/Login';
import Logout from './Pages/Logout';
import Theme from './Theme'; 
import './App.css';

import RequireAuth from './RequireAuth';
import PublicAuth from './PublicAuth';
import RevenueTracking from './Pages/RevenueTracking';
import PaymentPage from './Pages/Payment';
import BusinessPromotion from './Pages/BusinessPromotion';
import CityListings from './Pages/CityListings';
import AdManagemnent from './Pages/AdManagement';
import Loader from './Layout/Loader';
import PetCategoryListings from './Pages/PetCategroyListings';
import AddPetCategory from './Pages/AddPetCategory';
import EditPetCategory from './Pages/EditPetCategory';
import ViewPetCategory from './Pages/ViewPetCategory';



function App() {
  const [loading, setLoading] = useState(true);
  useEffect(()=> {
    const timer = setTimeout(() => {
      console.log("loading")
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);
  if(loading) {
    return <Loader />;
  }
  return (
    <Router>
      <Routes>
        {/* Login route shown first */}
        <Route path="/login" element={<PublicAuth><Login /></PublicAuth>} />

        {/* Protected admin layout route */}
        <Route path="/" element={<RequireAuth><Theme /></RequireAuth>}>
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="business-listing" element={<BusinessListings />} />
          <Route path="add-listing" element={<AddListings />} />
          <Route path="edit-category" element={<EditCategory />} />
          <Route path="view-category" element={<ViewCategory />} />
          <Route path="category-listing" element={<CategoryListings />} />
          <Route path="add-category" element={<AddCategory />} />
          <Route path="city-listing" element={<CityListings />} />
          <Route path="add-city" element={<AddCity />} />
          <Route path="edit-city" element={<EditCity />} />
          <Route path="view-city" element={<ViewCity />} />
          <Route path="view-listing" element={<ViewListings />} />
          <Route path="edit-listing" element={<EditListings />} />
          <Route path="user-management" element={<UserManagement />} />
          <Route path="ad-management" element={<AdManagemnent />} />
          <Route path="custom-ad" element={<CustomAd />} />
          <Route path="pet-category-listing" element={<PetCategoryListings />} />
          <Route path="add-pet-category" element={<AddPetCategory />} />
          <Route path="edit-pet-category" element={<EditPetCategory />} />
          <Route path="view-pet-category" element={<ViewPetCategory />} />
          
          <Route path="ad-listing" element={<AdListings />} />
          <Route path="page-management" element={<PageManagement />} />
          <Route path="email" element={<Email />} />
          <Route path="payments" element={<PaymentPage />} />
          <Route path="promotion" element={<BusinessPromotion />} />
          <Route path="revenue-tracking" element={<RevenueTracking />} />
          <Route path="logout" element={<Logout />} />
        </Route>
        

        {/* Redirect unknown paths to login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
