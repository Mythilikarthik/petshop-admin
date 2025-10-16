// src/Layout/Sidebar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
   MdLogout, MdAttachMoney,  MdLocationCity, MdPlace, 
  
  MdCampaign,
  MdOutlinePages,
  MdPets
} from 'react-icons/md';
import { GiJumpingDog , GiDogHouse, GiNestBirds , GiRabbit, GiDogBowl } from "react-icons/gi";
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import './Sidebar.css';

const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: <MdPets /> },
  { 
    name: "Business Listing", 
    path: "/business-listing", 
    icon: <GiDogHouse />,
    children: [
      { name: "Listing", path: "/business-listing", icon: <GiNestBirds  /> },
      { name: "Add Listing", path: "/add-listing", icon: <GiRabbit /> },
      { name: "Category Listing", path: "/category-listing", icon: <GiDogBowl /> },
      { name: "Add Category", path: "/add-category", icon: <GiJumpingDog  /> },
      { name: "Pet Category Listing", path: "/pet-category-listing", icon: <GiDogBowl /> },
      { name: "Add Pet Category", path: "/add-pet-category", icon: <GiJumpingDog  /> },
      { name: "City Listing", path: "/city-listing", icon: <MdPlace/> },
      { name: "Add City", path: "/add-city", icon: <MdLocationCity /> }
    ]
  },
  // { name: "User Management", path: "/user-management", icon: <MdPeople /> },
  { name: "Page Management", path: "/page-management", icon: <MdOutlinePages /> },
  { name: "Ad Management", path: "/ad-management", icon: <MdCampaign />, 
    children : [
      { name: "Custom Ad", path: "/custom-ad", icon: <GiDogBowl /> },
      { name: "Ad Listing", path: "/ad-listing", icon: <GiNestBirds  /> },
      { name: "Add Ad", path: "/ad-management", icon: <GiRabbit /> },
    ]
   },
  { name: "Revenue Tracking", path: "/revenue-tracking", icon: <MdAttachMoney /> },
  // { name: "Email", path: "/email", icon: <MdEmail /> },
  // { name: "Payment", path: "/payments", icon: <MdPayment /> },
  // { name: "Business Promotion", path: "/promotion", icon: <MdCampaign /> },
  { name: "Logout", path: "/logout", icon: <MdLogout /> },
];

const Sidebar = () => {
  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (name) => {
    setOpenMenus((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div className="sidebar bg-cblue text-white vh-100">
      <h4 className="text-white mb-4 sidebar-border-bottom p-20">Pet Directory</h4>
      <ul className="list-unstyled">
        {menuItems.map((item, index) => (
          <li key={index}>
            {item.children ? (
              <>
                <div 
                  className="d-flex align-items-center justify-content-between text-white py-2 px-2 sidebar-parent"
                  onClick={() => toggleMenu(item.name)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="d-flex align-items-center">
                    <span className="me-2">{item.icon}</span> {item.name}
                  </div>
                  {openMenus[item.name] ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                </div>
                {openMenus[item.name] && (
                  <ul className="list-unstyled ps-4">
                    {item.children.map((child, childIndex) => (
                      <li key={childIndex}>
                        <Link 
                          to={child.path} 
                          className="text-white text-decoration-none d-flex align-items-center py-1"
                        >
                          <span className="me-2">{child.icon}</span> {child.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <Link 
                to={item.path} 
                className="text-white text-decoration-none d-flex align-items-center py-2 px-2"
              >
                <span className="me-2">{item.icon}</span> {item.name}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
