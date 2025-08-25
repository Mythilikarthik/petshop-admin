import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './Pages/Dashboard';
import ViewMessage from './Pages/ViewMessage';
import ViewListings from './Pages/ViewListings';
import EditListings from './Pages/EditListings';
import SendMessage from './Pages/SendMessage';
import ContactAdmin from './Pages/ContactAdmin';
import Login from './Pages/Login';
import Logout from './Pages/Logout';
import Theme from './Theme'; 
import './App.css';

import RequireAuth from './RequireAuth';
import PublicAuth from './PublicAuth';

function App() {
  return (
    <Router>
      <Routes>
        {/* Login route shown first */}
        <Route path="/login" element={<PublicAuth><Login /></PublicAuth>} />

        {/* Protected admin layout route */}
        <Route path="/" element={<RequireAuth><Theme /></RequireAuth>}>
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="view-message" element={<ViewMessage />} />
          <Route path="send-message" element={<SendMessage />} />
          <Route path="contact-admin" element={<ContactAdmin />} />
          <Route path="view-listing" element={<ViewListings />} />
          <Route path="edit-listing" element={<EditListings />} />
          <Route path="logout" element={<Logout />} />
        </Route>
        

        {/* Redirect unknown paths to login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
