import React, { useEffect, useRef, useState } from 'react';
import { Container } from 'react-bootstrap';
import Sidebar from '../Layout/Sidebar';
import DropdownHeader from '../Layout/DropdownHeader';
import { Outlet } from 'react-router-dom';
import Footer from '../Layout/Footer';
import "./theme.css";
const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const sidebarRef = useRef(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 992) {
        setIsSidebarOpen(false); // hide sidebar
      } else {
        setIsSidebarOpen(true);  // show sidebar
      }
    };

    // run once on load
    handleResize();

    // listen for resize
    window.addEventListener("resize", handleResize);
    window.addEventListener("load", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("load", handleResize)
    };
  }, []);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        window.innerWidth <= 992 &&
        isSidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSidebarOpen]);
  return (
    <Container fluid className="p-0 min-vh-100 d-flex flex-column">
      <div className='pos-rel flex-grow-1 d-flex'>
        <div 
          ref={sidebarRef} 
          className={`p-0 sidebar-col bg-cblue ${isSidebarOpen ? "sidebar-open" : "sidebar-close"} `}
        >
          <Sidebar />
        </div>
        <div className={`p-0 main-col ${isSidebarOpen ? "sidebar-open" : "sidebar-close"} d-flex flex-column`}>
          <div className="grey-section pos-rel flex-grow-1 d-flex flex-column ">
            <DropdownHeader onToggleMenu={toggleSidebar} />
            <div className="flex-grow-1">
              <Outlet />
            </div>
            
          <Footer />
          </div>
        </div>
      </div>
    </Container>

  );
};

export default Dashboard;
