import React, { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip, Col, Dropdown, Navbar, Nav, Badge } from "react-bootstrap";
import { io } from "socket.io-client";
import "./DashboardHeader.css";
import {
  AiOutlineUser,
  AiOutlineExpand,
  AiOutlineBell,
  AiOutlineMenu,
  AiOutlineLogout,
} from "react-icons/ai";
import { MdOutlineEdit, MdLockReset } from "react-icons/md";
import { Link } from "react-router-dom";

const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://petshop-user.onrender.com"
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
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (!token || !userId) return;

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

  const handleMessagesClick = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/messages/unread/count`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setUnreadCount(data.count);
    } catch (err) {
      console.error("Error refreshing unread count:", err);
    }
  };

  return (
    <div className="d-flex justify-content-space-between align-items-center mb-4 dashboard-header">
      
    </div>
  );
};

export default DashboardHeader;
