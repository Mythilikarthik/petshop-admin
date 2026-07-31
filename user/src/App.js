import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './Pages/Dashboard';
import ViewMessage from './Pages/ViewMessage';
import EditListings from './Pages/EditListings';
import SendMessage from './Pages/SendMessage';
import GoPremium from './Pages/GoPremium';
import ContactAdmin from './Pages/ContactAdmin';
import Login from './Pages/Login';
import Logout from './Pages/Logout';
import Theme from './Theme'; 
import './App.css';
import { GoogleOAuthProvider } from '@react-oauth/google';


import RequireAuth from './RequireAuth';
import PublicAuth from './PublicAuth';
import { useState } from 'react';
import { useEffect } from 'react';
import Loader from './Layout/Loader';
import EditProfile from './Pages/EditProfile';
import ChangePassword from './Pages/ChangePassword';
import Messages from './Pages/Messages';
import Review from './Pages/Review';
import SessionTimeoutHandler from './Hooks/SessionTimeoutHandler'; 
import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";
import OfferListings from './Pages/OffersManagement';
import AddEditOffers from './Pages/AddEditOffers';


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
    <GoogleOAuthProvider clientId="932728880850-okmd8gvva3mv1vc00lsiqsjkambs2gol.apps.googleusercontent.com">
    <Router>
      <SessionTimeoutHandler />
      <Routes>
        {/* Login route shown first */}
        <Route path="/login" element={<PublicAuth><Login /></PublicAuth>} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected admin layout route */}
        <Route path="/" element={<RequireAuth><Theme /></RequireAuth>}>
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="go-premium" element={<GoPremium />} />
          <Route path="messages/:id" element={<ViewMessage />} />
          <Route path="messages" element={<Messages />} />
          <Route path="send-message" element={<SendMessage />} />
          <Route path="contact-admin" element={<ContactAdmin />} />
          <Route path="edit-listing" element={<EditListings />} />
          <Route path="edit-profile" element={<EditProfile />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="review" element={<Review />} />
          <Route path='/offers-management' element={<OfferListings />} />
          <Route path='/add-edit-offers' element={<AddEditOffers />} />
          {/* <Route path="add-listing" element={<AddListing />} /> */}
          

          <Route path="logout" element={<Logout />} />
        </Route>
        

        {/* Redirect unknown paths to login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
