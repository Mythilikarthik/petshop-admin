import React from 'react';
import { OverlayTrigger, Tooltip, Col, Dropdown } from 'react-bootstrap';
import './DashboardHeader.css';
import {
  AiOutlineUser,
  AiOutlineExpand,
  AiOutlineBell,
  AiOutlineMenu,
  AiOutlineLogout,
} from "react-icons/ai";
import { MdOutlineEdit, MdLockReset } from "react-icons/md"; // extra icons
import { Link } from 'react-router-dom';

const handleExpand = async () => {
  try {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  } catch (err) {
    console.error(err);
  }
};

const DashboardHeader = ({ onToggleMenu }) => {
  return (
    <div className="d-flex justify-content-space-between align-items-center mb-4 dashboard-header">
      <Col className="d-flex justify-content-start align-items-center">
        <OverlayTrigger placement="bottom" overlay={<Tooltip id="menu">Menu</Tooltip>}>
          <div
            className="me-3 d-flex justify-content-center align-items-center text-black"
            onClick={onToggleMenu}
          >
            <AiOutlineMenu size={24} />
          </div>
        </OverlayTrigger>
        <div className='mr-3 d-block'><h5 className='mb-0'>Welcome User</h5></div>
      </Col>

      <Col className="d-flex justify-content-end align-items-center">
        
        {/* Go Premium */}
        <OverlayTrigger placement="bottom" overlay={<Tooltip id="go-premium">Go Premium</Tooltip>}>
          <div className="me-3 d-flex justify-content-center align-items-center text-black">
            <Link className="btn btn-primary" to="/go-premium">
              Go Premium
            </Link>
          </div>
        </OverlayTrigger>

        {/* Notification */}
        <OverlayTrigger placement="bottom" overlay={<Tooltip id="notification">Notification</Tooltip>}>
          <div
            className="me-3 d-flex justify-content-center align-items-center text-black"
            onClick={handleExpand}
          >
            <AiOutlineBell size={24} />
          </div>
        </OverlayTrigger>

        {/* Expand */}
        <OverlayTrigger placement="bottom" overlay={<Tooltip id="expand">Expand</Tooltip>}>
          <div
            className="me-3 d-flex justify-content-center align-items-center text-black"
            onClick={handleExpand}
          >
            <AiOutlineExpand size={24} />
          </div>
        </OverlayTrigger>

        <Dropdown align="end">
          <Dropdown.Toggle
            as="div"
            className="me-3 d-flex justify-content-center align-items-center text-black"
            style={{ cursor: "pointer" }}
          >
            <AiOutlineUser size={24} />
            {/* <span className="ms-2">Hi, User</span> */}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item as={Link} to="/edit-profile">
              <MdOutlineEdit className="me-2" size={18} /> Edit Profile
            </Dropdown.Item>
            <Dropdown.Item as={Link} to="/change-password">
              <MdLockReset className="me-2" size={18} /> Change Password
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={() => console.log("Logout clicked")}>
              <Link to="/logout">
                <AiOutlineLogout className="me-2" size={18} /> Logout
              </Link>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Col>
    </div>
  );
};

export default DashboardHeader;
