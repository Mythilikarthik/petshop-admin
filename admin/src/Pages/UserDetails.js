import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Badge, Button, Row, Col, Breadcrumb } from "react-bootstrap";

const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://petshop-user.onrender.com"
    : "http://localhost:5000";

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(
          `${API_BASE}/api/auth/user/user-details/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = await res.json();
        if (data.success) {
          setUser(data.user);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) return <p className="text-center mt-4">Loading user details...</p>;
  if (!user) return <p className="text-center mt-4">User not found</p>;

  return (
    <div className="container mt-4">
     <Row className='mb-3 justify-content-end align-items-center'>
        <Col>
        <h2 className='main-title mb-0'>View User Details</h2>
        <Breadcrumb className='top-breadcrumb'>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/user-management">Users</Breadcrumb.Item>
            <Breadcrumb.Item active>{user?.name || id}</Breadcrumb.Item>
        </Breadcrumb>
        </Col>
        <Col xs={'auto'}>
        <Button variant="secondary" onClick={() => navigate(-1)}>Go Back</Button>
        </Col>
    </Row>
    <div className="form-container">
      <Card className="shadow-sm">
        <Card.Body>
          <Row>
            <Col md={12}>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
            
              <p>
                <strong>Plan:</strong>{" "}
                {user.isPremium ? (
                  <Badge bg="success">Premium</Badge>
                ) : (
                  <Badge bg="secondary">Free</Badge>
                )}
              </p>
              <p>
                <strong>Role:</strong>{" "}
                {user.site === "1" ? "User" : "Service Provider"}
              </p>
              <p>
                <strong>Joined:</strong>{" "}
                {new Date(user.created_at).toLocaleDateString()}
              </p>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      </div>
    </div>
  );
};

export default UserDetails;
