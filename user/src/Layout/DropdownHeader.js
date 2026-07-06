// import React, { useEffect, useState } from "react";
// import { OverlayTrigger, Tooltip, Col, Dropdown, Navbar, Nav, Badge } from "react-bootstrap";
// import { io } from "socket.io-client";
// import "./DashboardHeader.css";
// import {
//   AiOutlineUser,
//   AiOutlineExpand,
//   AiOutlineBell,
//   AiOutlineMenu,
//   AiOutlineLogout,
// } from "react-icons/ai";
// import { MdOutlineEdit, MdLockReset } from "react-icons/md";
// import { Link } from "react-router-dom";

// const API_BASE =
//   process.env.NODE_ENV === "production"
//     ? process.env.REACT_APP_API_URL
//     : "http://localhost:5000";

// const handleExpand = async () => {
//   try {
//     if (!document.fullscreenElement) {
//       await document.documentElement.requestFullscreen();
//     } else {
//       await document.exitFullscreen();
//     }
//   } catch (err) {
//     console.error(err);
//   }
// };

// const DashboardHeader = ({ onToggleMenu }) => {
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [username, setUsername] = useState("");

//   useEffect(() => {
//   const storedUsername = localStorage.getItem("name");
//   console.log("username", storedUsername);
//   if (storedUsername) {
//     setUsername(storedUsername);
//   }
// }, []);
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const userId = localStorage.getItem("userId");
//     if (!token || !userId) return;

//     // Fetch unread count initially
//     const fetchUnreadCount = async () => {
//       try {
//         const res = await fetch(`${API_BASE}/api/messages/unread/count`, {
//           method: "GET",
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const data = await res.json();
//         if (data.success) setUnreadCount(data.count);
//       } catch (err) {
//         console.error("Error fetching unread count:", err);
//       }
//     };
//     fetchUnreadCount();

//     // --- Setup Socket.io ---
//     const socket = io(API_BASE, { transports: ["websocket"] });
//     socket.emit("join", userId);

//     socket.on("new_message", () => {
//       setUnreadCount((prev) => prev + 1);
//     });

//     socket.on("message_read_update", () => {
//       setUnreadCount((prev) => Math.max(prev - 1, 0));
//       fetchUnreadCount();
//     });

    
//     const handleFocus = () => fetchUnreadCount();
//     window.addEventListener("focus", handleFocus);

//     return () => {
//       socket.disconnect();
//       window.removeEventListener("focus", handleFocus);
//     };
//   }, []);

//   const handleMessagesClick = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await fetch(`${API_BASE}/api/messages/unread/count`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       if (data.success) setUnreadCount(data.count);
//     } catch (err) {
//       console.error("Error refreshing unread count:", err);
//     }
//   };

//   return (
//     <div className="d-flex justify-content-space-between align-items-center mb-4 dashboard-header">
//       <Col className="d-flex justify-content-start align-items-center">
//         <OverlayTrigger placement="bottom" overlay={<Tooltip id="menu">Menu</Tooltip>}>
//           <div
//             className="me-3 d-flex justify-content-center align-items-center text-black"
//             onClick={onToggleMenu}
//           >
//             <AiOutlineMenu size={24} />
//           </div>
//         </OverlayTrigger>
//         <div className="mr-3 d-block">
//           <h5 className="mb-0">Welcome {username || "User"}</h5>
//         </div>
//       </Col>

//       <Col className="d-flex justify-content-end align-items-center">
//         {/* Go Premium */}
//         <OverlayTrigger placement="bottom" overlay={<Tooltip id="go-premium">Go Premium</Tooltip>}>
//           <div className="me-3 d-flex justify-content-center align-items-center text-black">
//             <Link className="btn btn-primary" to="/go-premium">
//               Go Premium
//             </Link>
//           </div>
//         </OverlayTrigger>

//         {/* Notification */}
//         {/* <OverlayTrigger placement="bottom" overlay={<Tooltip id="notification">Notifications</Tooltip>}>
//           <Navbar bg="light" expand="lg" className="px-3">
//             <Nav className="ms-auto align-items-center">
//               <Dropdown show={dropdownOpen} onToggle={() => setDropdownOpen(!dropdownOpen)}>
//                 <Dropdown.Toggle
//                   as="div"
//                   id="notification-toggle"
//                   style={{ position: "relative", cursor: "pointer" }}
//                 >
//                   <AiOutlineBell size={22} />
//                   {unreadCount > 0 && (
//                     <Badge
//                       bg="danger"
//                       pill
//                       style={{
//                         position: "absolute",
//                         top: "-5px",
//                         right: "-8px",
//                         fontSize: "0.7rem",
//                       }}
//                     >
//                       {unreadCount}
//                     </Badge>
//                   )}
//                 </Dropdown.Toggle>

//                 <Dropdown.Menu align="end">
//                   {unreadCount > 0 ? (
//                     <Dropdown.Item as={Link} to="/messages" onClick={handleMessagesClick}>
//                       You have {unreadCount} new message{unreadCount > 1 ? "s" : ""}.
//                     </Dropdown.Item>
//                   ) : (
//                     <Dropdown.Item disabled>No new messages</Dropdown.Item>
//                   )}
//                 </Dropdown.Menu>
//               </Dropdown>
//             </Nav>
//           </Navbar>
//         </OverlayTrigger> */}

//         {/* Expand */}
//         <OverlayTrigger placement="bottom" overlay={<Tooltip id="expand">Expand</Tooltip>}>
//           <div
//             className="me-3 d-flex justify-content-center align-items-center text-black"
//             onClick={handleExpand}
//           >
//             <AiOutlineExpand size={24} />
//           </div>
//         </OverlayTrigger>

//         {/* User Dropdown */}
//         <Dropdown align="end">
//           <Dropdown.Toggle
//             as="div"
//             className="me-3 d-flex justify-content-center align-items-center text-black"
//             style={{ cursor: "pointer" }}
//           >
//             <AiOutlineUser size={24} />
//           </Dropdown.Toggle>

//           <Dropdown.Menu>
//             <Dropdown.Item as={Link} to="/edit-profile">
//               <MdOutlineEdit className="me-2" size={18} /> Edit Profile
//             </Dropdown.Item>
//             <Dropdown.Item as={Link} to="/change-password">
//               <MdLockReset className="me-2" size={18} /> Change Password
//             </Dropdown.Item>
//             <Dropdown.Divider />
//             <Dropdown.Item as={Link} to="/logout">
//               <AiOutlineLogout className="me-2" size={18} /> Logout
//             </Dropdown.Item>
//           </Dropdown.Menu>
//         </Dropdown>
//       </Col>
//     </div>
//   );
// };

// export default DashboardHeader;
import React, { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip, Col, Dropdown, Badge } from "react-bootstrap";
import { io } from "socket.io-client";
import "./DashboardHeader.css";
import {
  AiOutlineUser,
  AiOutlineExpand,
  AiOutlineMenu,
  AiOutlineLogout,
} from "react-icons/ai";
import { MdOutlineEdit, MdLockReset } from "react-icons/md";
import { Link } from "react-router-dom";

const API_BASE =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_URL
    : "http://localhost:5000";

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
  const [unreadCount, setUnreadCount] = useState(0);
  const [username, setUsername] = useState("");
  const [isPremium, setIsPremium] = useState(false); // ✅ Added state to track Premium Status

  useEffect(() => {
    const storedUsername = localStorage.getItem("name");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (!token || !userId) return;

    // ✅ 1. Fetch user profile data to check real-time Premium Status
    const fetchUserProfile = async () => {
      try {
        // Change the endpoint path if your user details route is named differently
        const res = await fetch(`${API_BASE}/api/users/profile`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success && data.user) {
          setIsPremium(data.user.isPremium);
        }
      } catch (err) {
        console.error("Error fetching user profile status:", err);
      }
    };
    fetchUserProfile();

    // Fetch unread count initially
    const fetchUnreadCount = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/messages/unread/count`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) setUnreadCount(data.count);
      } catch (err) {
        console.error("Error fetching unread count:", err);
      }
    };
    fetchUnreadCount();

    // --- Setup Socket.io ---
    const socket = io(API_BASE, { transports: ["websocket"] });
    socket.emit("join", userId);

    socket.on("new_message", () => {
      setUnreadCount((prev) => prev + 1);
    });

    socket.on("message_read_update", () => {
      setUnreadCount((prev) => Math.max(prev - 1, 0));
      fetchUnreadCount();
    });

    const handleFocus = () => fetchUnreadCount();
    window.addEventListener("focus", handleFocus);

    return () => {
      socket.disconnect();
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  return (
    <div className="d-flex justify-content-space-between align-items-center mb-4 dashboard-header">
      <Col className="d-flex justify-content-start align-items-center">
        <OverlayTrigger placement="bottom" overlay={<Tooltip id="menu">Menu</Tooltip>}>
          <div
            className="me-3 d-flex justify-content-center align-items-center text-black"
            onClick={onToggleMenu}
            style={{ cursor: "pointer" }}
          >
            <AiOutlineMenu size={24} />
          </div>
        </OverlayTrigger>
        <div className="mr-3 d-block">
          <h5 className="mb-0">
            Welcome {username || "User"}{" "}
            {/* ✅ Optional: Render a small badge next to their name if premium */}
            {isPremium && <Badge bg="warning" text="dark" className="ms-1">PRO</Badge>}
          </h5>
        </div>
      </Col>

      <Col className="d-flex justify-content-end align-items-center">
        
        {/* ✅ CONDITIONAL RENDERING: Only show "Go Premium" button if the user is NOT premium */}
        {!isPremium ? (
          <OverlayTrigger placement="bottom" overlay={<Tooltip id="go-premium">Go Premium</Tooltip>}>
            <div className="me-3 d-flex justify-content-center align-items-center text-black">
              <Link className="btn btn-primary" to="/go-premium">
                Go Premium
              </Link>
            </div>
          </OverlayTrigger>
        ) : (
          /* ✅ Optional UI replacement: Shows confirmation badge when hidden */
          <div className="me-3 d-flex justify-content-center align-items-center">
            <Badge bg="success" className="p-2 text-uppercase" style={{ letterSpacing: '0.5px' }}>
              ✨ Premium Member
            </Badge>
          </div>
        )}

        {/* Expand Screen Toggle */}
        <OverlayTrigger placement="bottom" overlay={<Tooltip id="expand">Expand</Tooltip>}>
          <div
            className="me-3 d-flex justify-content-center align-items-center text-black"
            onClick={handleExpand}
            style={{ cursor: "pointer" }}
          >
            <AiOutlineExpand size={24} />
          </div>
        </OverlayTrigger>

        {/* User Dropdown */}
        <Dropdown align="end">
          <Dropdown.Toggle
            as="div"
            className="me-3 d-flex justify-content-center align-items-center text-black"
            style={{ cursor: "pointer" }}
          >
            <AiOutlineUser size={24} />
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item as={Link} to="/edit-profile">
              <MdOutlineEdit className="me-2" size={18} /> Edit Profile
            </Dropdown.Item>
            <Dropdown.Item as={Link} to="/change-password">
              <MdLockReset className="me-2" size={18} /> Change Password
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item as={Link} to="/logout">
              <AiOutlineLogout className="me-2" size={18} /> Logout
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Col>
    </div>
  );
};

export default DashboardHeader;