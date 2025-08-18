import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Sidebar from '../Layout/Sidebar';
import DropdownHeader from '../Layout/DropdownHeader';
import { Outlet } from 'react-router-dom';
import Footer from '../Layout/Footer';
import "./theme.css";
const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <Container fluid className="p-0">
      <Row>
        <Col md={isSidebarOpen ? 2 : 0} className='p-0 sidebar-col position-sticky'>
          {isSidebarOpen && <Sidebar />}
        </Col>
        <Col md={isSidebarOpen ? 10 : 12} className="p-0 main-col">
          <div className='grey-section pos-rel h-100 mb-5 pb-5'>
            <DropdownHeader onToggleMenu={toggleSidebar} />
            <Outlet />
            <Footer />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
