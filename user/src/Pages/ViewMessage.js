import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Breadcrumb, Card } from "react-bootstrap";
import { io } from "socket.io-client";

const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://petshop-user.onrender.com"
    : "http://localhost:5000";
    const socket = io(API_BASE, { transports: ["websocket"] });

const ViewMessage = () => {
  const { id } = useParams();
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMessage = async () => {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in");
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/api/messages/${id}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (data.success) {
          setMessage(data.message);

          // Mark as read if receiver
          if (data.message.receiverId?._id === userId && !data.message.read) {
            const markRead = await fetch(`${API_BASE}/api/messages/${id}/read`, {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            });
            const result = await markRead.json();

            if (result.success) {
              // ✅ Notify other tabs/components to update unread count
              socket.emit("message_read", { userId });
            }
          }
        } else {
          alert(data.message);
        }
      } catch (err) {
        console.error("Error fetching message:", err);
      }
    };

    fetchMessage();
    return () => {
      socket.disconnect();
    };
  }, [id]);

  if (!message) return <p className="text-center mt-5">Loading message...</p>;

  return (
    <Container className="mt-4">
      <div className="pl-3 pr-3">
        <Row className="mb-3 justify-content-end align-items-center">
          <Col>
            <h2 className="main-title mb-0">Message Details</h2>
            <Breadcrumb className="top-breadcrumb">
              <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
              <Breadcrumb.Item active>Message Details</Breadcrumb.Item>
            </Breadcrumb>
          </Col>

          <Col xs={"auto"}>
            <Button variant="secondary" onClick={() => navigate(-1)}>
              Go Back
            </Button>
          </Col>
        </Row>

        <Card className="p-4 shadow-sm">
          <p>
            <strong>Sender:</strong> {message.senderId?.name || "N/A"}
          </p>
          <p>
            <strong>Receiver:</strong> {message.receiverId?.name || "N/A"}
          </p>
          <p>
            <strong>Date:</strong> {new Date(message.createdAt).toLocaleString()}
          </p>
          <p>
            <strong>Message:</strong>
          </p>
          <p className="border p-3 rounded bg-light">{message.message}</p>
        </Card>
      </div>
    </Container>
  );
};

export default ViewMessage;
