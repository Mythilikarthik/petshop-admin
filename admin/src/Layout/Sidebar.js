// // src/Layout/Sidebar.js
// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { 
//    MdLogout, MdAttachMoney,  MdLocationCity, MdPlace, 
  
//   MdCampaign,MdOutlineCategory ,
//   MdOutlinePages, MdOutlineStoreMallDirectory ,
//   MdPets,
//   MdPeople,
//   MdQueryStats
// } from 'react-icons/md';
// import { GiJumpingDog , GiDogHouse, GiNestBirds , GiRabbit, GiDogBowl } from "react-icons/gi";
// import { FaChartArea, FaChevronDown, FaChevronUp, FaDeskpro, FaDesktop, FaNewspaper, FaPage4, FaPagelines, FaQuestionCircle } from 'react-icons/fa';
// import './Sidebar.css';

// const menuItems = [
//   { name: "Dashboard", path: "/dashboard", icon: <MdPets /> },
//   { 
//     name: "Business Listing", 
//     path: "/business-listing", 
//     icon: <GiDogHouse />,
//     children: [
//       { name: "Listing", path: "/business-listing", icon: <GiNestBirds  /> },
//       // { name: "Add Listing", path: "/add-listing", icon: <GiRabbit /> },
//       { name: "Category Listing", path: "/category-listing", icon: <GiDogBowl /> },
//       // { name: "Add Category", path: "/add-category", icon: <GiJumpingDog  /> },
//       { name: "Pet Type Listing", path: "/pet-category-listing", icon: <GiDogBowl /> },
//       // { name: "Add Pet Category", path: "/add-pet-category", icon: <GiJumpingDog  /> },
//       { name: "City Listing", path: "/city-listing", icon: <MdPlace/> },
//       // { name: "Add City", path: "/add-city", icon: <MdLocationCity /> },
//       { name: "Blog Listing", path: "/blog-listing", icon: <FaNewspaper  /> },
//       { name: "FAQ", path: "/faq-listing", icon: <FaQuestionCircle /> },
//       { name: "Review Management", path: "/review-management", icon: <MdCampaign /> },
//       { name: "Enquiry List", path: "/enquiry-list", icon: <MdQueryStats /> },
      
//     ]
//   },
//   { name: "User Management", path: "/user-management", icon: <MdPeople /> },
//   { name: "Page Management", path: "/page-management", icon: <MdOutlinePages />, 
//     children: [
//       { name: "Custom Pages", path: "/custom-pages", icon: <FaPagelines /> },
//       { name: "Home Page", path: "/home-page", icon: <FaDesktop  /> },
//       { name: "Category Pages", path: "/category-pages", icon: <MdOutlineCategory  /> },
//       { name: "Directory Banner", path: "/directory-banner-management", icon: <MdOutlineStoreMallDirectory  /> },
//       { name: "City Banners", path: "/city-banner-management", icon: <MdOutlineStoreMallDirectory  /> },
//       { name: "Blog Banner", path: "/blog-banner-management", icon: <MdOutlineStoreMallDirectory  /> },
//     ]
//    },
//   { name: "Ad Management", path: "/ad-management", icon: <MdCampaign />, 
//     children : [
//       { name: "Custom Ad", path: "/custom-ad", icon: <GiDogBowl /> },
//       { name: "Ad Listing", path: "/ad-listing", icon: <GiNestBirds  /> },
//     ]
//    },
//   { name: "Revenue Tracking", path: "/revenue-tracking", icon: <MdAttachMoney /> },
//   // { name: "Email", path: "/email", icon: <MdEmail /> },
//   // { name: "Payment", path: "/payments", icon: <MdPayment /> },
//   // { name: "Business Promotion", path: "/promotion", icon: <MdCampaign /> },
//   { name: "Logout", path: "/logout", icon: <MdLogout /> },
// ];

// const Sidebar = () => {
//   const [openMenus, setOpenMenus] = useState({});

//   const toggleMenu = (name) => {
//     setOpenMenus((prev) => ({ ...prev, [name]: !prev[name] }));
//   };

//   return (
//     <div className="sidebar bg-cblue text-white vh-100">
//       <h4 className="text-white mb-4 sidebar-border-bottom p-20">Vet and Pets</h4>
//       <ul className="list-unstyled">
//         {menuItems.map((item, index) => (
//           <li key={index}>
//             {item.children ? (
//               <>
//                 <div 
//                   className="d-flex align-items-center justify-content-between text-white py-2 px-2 sidebar-parent"
//                   onClick={() => toggleMenu(item.name)}
//                   style={{ cursor: 'pointer' }}
//                 >
//                   <div className="d-flex align-items-center">
//                     <span className="me-2">{item.icon}</span> {item.name}
//                   </div>
//                   {openMenus[item.name] ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
//                 </div>
//                 {openMenus[item.name] && (
//                   <ul className="list-unstyled ps-4">
//                     {item.children.map((child, childIndex) => (
//                       <li key={childIndex}>
//                         <Link 
//                           to={child.path} 
//                           className="text-white text-decoration-none d-flex align-items-center py-1"
//                         >
//                           <span className="me-2">{child.icon}</span> {child.name}
//                         </Link>
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//               </>
//             ) : (
//               <Link 
//                 to={item.path} 
//                 className="text-white text-decoration-none d-flex align-items-center py-2 px-2"
//               >
//                 <span className="me-2">{item.icon}</span> {item.name}
//               </Link>
//             )}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Sidebar;
// src/Layout/Sidebar.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Badge } from "react-bootstrap";
import {
  MdLogout,
  MdAttachMoney,
  MdPlace,
  MdCampaign,
  MdOutlineCategory,
  MdOutlinePages,
  MdOutlineStoreMallDirectory,
  MdPets,
  MdPeople,
  MdQueryStats,
  MdLocalOffer,
} from "react-icons/md";
import {
  GiDogHouse,
  GiNestBirds,
  GiDogBowl,
} from "react-icons/gi";
import {
  FaChevronDown,
  FaChevronUp,
  FaNewspaper,
  FaPagelines,
  FaQuestionCircle,
  FaDesktop,
} from "react-icons/fa";
import "./Sidebar.css";

/* -------------------- API BASE -------------------- */
const API_BASE =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_URL
    : "http://localhost:5000";

/* -------------------- MENU ITEMS -------------------- */
const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: <MdPets /> },

  {
    name: "Business Listing",
    icon: <GiDogHouse />,
    children: [
      { name: "Listing", path: "/business-listing", icon: <GiNestBirds />, badgeKey: "totallisting" },
      { name: "Category Listing", path: "/category-listing", icon: <GiDogBowl /> },
      { name: "Pet Type Listing", path: "/pet-category-listing", icon: <GiDogBowl /> },
      { name: "Specialized Services Listing", path: "/specialized-services-listing", icon: <GiDogBowl /> },
      { name: "City Listing", path: "/city-listing", icon: <MdPlace /> },
      { name: "Blog Listing", path: "/blog-listing", icon: <FaNewspaper /> },
      { name: "FAQ", path: "/faq-listing", icon: <FaQuestionCircle /> },

      // ✅ Badge Enabled
      { name: "Review Management", path: "/review-management", icon: <MdCampaign />, badgeKey: "reviews" },
      { name: "Enquiry List", path: "/enquiry-list", icon: <MdQueryStats />, badgeKey: "enquiries" },
    ],
  },

  { name: "User Management", path: "/user-management", icon: <MdPeople />, badgeKey: "users" },
  // { name: "Offers Management", path: "/offers-management", icon: <MdLocalOffer />, badgeKey: "offers" },
  {
    name: "Offers",
    icon: <MdLocalOffer />,
    children: [
      { name: "Offers Management", path: "/offers-management", icon: <MdLocalOffer /> },
      { name: "Offers Analytics", path: "/offers-analytics", icon: <MdCampaign /> },
    ],
  },

  {
    name: "Page Management",
    icon: <MdOutlinePages />,
    children: [
      { name: "Custom Pages", path: "/custom-pages", icon: <FaPagelines /> },
      { name: "Home Page", path: "/home-page", icon: <FaDesktop /> },
      { name: "Category Pages", path: "/category-pages", icon: <MdOutlineCategory /> },
      { name: "Directory Banner", path: "/directory-banner-management", icon: <MdOutlineStoreMallDirectory /> },
      { name: "City Banners", path: "/city-banner-management", icon: <MdOutlineStoreMallDirectory /> },
      { name: "Blog Banner", path: "/blog-banner-management", icon: <MdOutlineStoreMallDirectory /> },
    ],
  },
  { name: "Ad Management", path: "/ad-management", icon: <MdCampaign />, 
    children : [
      { name: "Custom Ad", path: "/custom-ad", icon: <GiDogBowl /> },
      { name: "Ad Listing", path: "/ad-listing", icon: <GiNestBirds  /> },
    ]
   },

  { name: "Revenue Tracking", path: "/revenue-tracking", icon: <MdAttachMoney /> },
  { name: "Logout", path: "/logout", icon: <MdLogout /> },
];

/* -------------------- COMPONENT -------------------- */

const Sidebar = () => {
  const [openMenus, setOpenMenus] = useState({});
  const [notifications, setNotifications] = useState({});

  const toggleMenu = (name) => {
    setOpenMenus((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  /* -------------------- FETCH NOTIFICATIONS -------------------- */
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/admin/notifications`);
        const data = await res.json();
        setNotifications(data);
      } catch (err) {
        console.error("Notification fetch error:", err);
      }
    };

    fetchNotifications();

    // Optional: auto refresh every 30 sec
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  /* -------------------- BADGE RENDER -------------------- */
  const renderBadge = (badgeKey) => {
    if (!badgeKey) return null;
    const value = notifications[badgeKey];
    if (!value || value <= 0) return null;

    return (
      <Badge bg="danger" pill className="ms-auto">
        {value > 99 ? "99+" : value}
      </Badge>
    );
  };

  return (
    <div className="sidebar bg-cblue text-white vh-100">
      <h4 className="text-white mb-4 sidebar-border-bottom p-20">
        Vet and Pets
      </h4>
{console.log(notifications)}
      <ul className="list-unstyled">
        {menuItems.map((item, index) => (
          <li key={index}>
            {item.children ? (
              <>
                <div
                  className="d-flex align-items-center justify-content-between text-white py-2 px-2 sidebar-parent"
                  onClick={() => toggleMenu(item.name)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="d-flex align-items-center">
                    <span className="me-2">{item.icon}</span>
                    {item.name}
                  </div>
                  {openMenus[item.name] ? (
                    <FaChevronUp size={12} />
                  ) : (
                    <FaChevronDown size={12} />
                  )}
                </div>

                {openMenus[item.name] && (
                  <ul className="list-unstyled ps-4">
                    {item.children.map((child, childIndex) => (
                      <li key={childIndex}>
                        <Link
                          to={child.path}
                          className="text-white text-decoration-none d-flex align-items-center py-1"
                        >
                          <span className="me-2">{child.icon}</span>
                          {child.name}
                          {renderBadge(child.badgeKey)}
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
                <span className="me-2">{item.icon}</span>
                {item.name}
                {renderBadge(item.badgeKey)}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;