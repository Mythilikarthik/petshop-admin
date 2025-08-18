// src/Layout/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { MdDashboard, MdFormatListBulleted } from 'react-icons/md';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar bg-dark text-white vh-100 p-4">
      <h4 className="text-white mb-4">Petshop Directory</h4>
      <ul className="list-unstyled">
        <li className="mb-3">
          <Link to="/dashboard" className="text-white text-decoration-none d-flex align-items-center">
            <MdDashboard className="me-2" /> Dashboard
          </Link>
        </li>
        <li>
          <Link to="/logout" className="text-white text-decoration-none d-flex align-items-center">
            <MdFormatListBulleted  className="me-2" /> Business Listing
          </Link>
        </li>
        <li>
          <Link to="/logout" className="text-white text-decoration-none d-flex align-items-center">
            <MdFormatListBulleted  className="me-2" /> User Management
          </Link>
        </li>
        <li>
          <Link to="/logout" className="text-white text-decoration-none d-flex align-items-center">
            <MdFormatListBulleted  className="me-2" />  Revenue Tracking
          </Link>
        </li>
        <li>
          <Link to="/logout" className="text-white text-decoration-none d-flex align-items-center">
            <MdFormatListBulleted  className="me-2" />  Email Automation
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
