import React from 'react';
import { Navigate } from 'react-router-dom';

const PublicAuth = ({ children }) => {
  const isPublicAuth = localStorage.getItem('isPublicAuth') === 'true';

  return !isPublicAuth ? children : <Navigate to="/dashboard" />;
};

export default PublicAuth;
