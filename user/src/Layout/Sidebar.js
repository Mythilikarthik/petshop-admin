// src/Layout/Sidebar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
   MdLogout, MdOutlineSend , 
  MdMessage ,
  MdOutlineContactPhone ,
  MdOutlineMenuBook ,
  MdPets
} from 'react-icons/md';
import { GiNestBirds  } from "react-icons/gi";
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import './Sidebar.css';

const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: <MdPets /> },
  { name: "Edit Listing", path: "/edit-listing", icon: <GiNestBirds /> },
  { 
    name: "Message", 
    path: "/business-listing", 
    icon: <MdMessage  />,
    children: [
      { name: "Message List", path: "/view-message", icon: <MdOutlineMenuBook   /> },
      { name: "Send Message", path: "/send-message", icon: <MdOutlineSend  /> },
    ]
  },
  { name: "Contact Admin", path: "/contact-admin", icon: <MdOutlineContactPhone  /> },
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
