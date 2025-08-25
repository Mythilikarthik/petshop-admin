import React from 'react';
import { OverlayTrigger, Tooltip , Col } from 'react-bootstrap';
import './DashboardHeader.css';
import { AiOutlineUser,  AiOutlineExpand, AiOutlineBell, AiOutlineMenu } from "react-icons/ai";


const handleExpand = async () => {
  try {
    if(!document.fullscreenElement) {
      await document.documentElement.requestFullscreen()
    } else {
      await document.exitFullscreen()
    }
  } catch(err) {
    console.error(err);
  }
};


const DashboardHeader = ({ onToggleMenu }) => {
  return (
    <div className="d-flex justify-content-space-between align-items-center mb-4 dashboard-header">
      <Col className='d-flex justify-content-start align-items-center'>
        <OverlayTrigger placement='bottom' overlay={<Tooltip id="Notification">Menu</Tooltip>}>
        <div className="me-3 d-flex justify-content-center align-items-center text-black" onClick={ onToggleMenu } >
          <AiOutlineMenu size={24} />
        </div>
        </OverlayTrigger>
      </Col>
      <Col className='d-flex justify-content-end align-items-center'>
        <OverlayTrigger placement='bottom' overlay={<Tooltip id="Notification">Notification</Tooltip>}>
        <div className="me-3 d-flex justify-content-center align-items-center text-black" onClick={handleExpand}>
          <AiOutlineBell size={24} />
        </div>
        </OverlayTrigger>
        <OverlayTrigger placement='bottom' overlay={<Tooltip id="expand">Expand</Tooltip>}>
        <div className="me-3 d-flex justify-content-center align-items-center text-black" onClick={handleExpand}>
          <AiOutlineExpand size={24} />
        </div>
        </OverlayTrigger>
        <OverlayTrigger
          placement="bottom" // position of the tooltip
          overlay={<Tooltip id="user">User</Tooltip>}
        >
        <div className="me-3 d-flex justify-content-center align-items-center text-black" >
          <AiOutlineUser size={24} />
        </div>
        </OverlayTrigger>
      </Col>
      
    </div>
  );
};

export default DashboardHeader;
