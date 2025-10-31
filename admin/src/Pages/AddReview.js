import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";

const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://petshop-admin.onrender.com"
    : "http://localhost:5000";

const AddReview = () => {
  const { listingId } = useParams(); // Get listingId from route like /add-review/:listingId
  const navigate = useNavigate();

  const [listingName, setListingName] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  /** Fetch listing info for title display */
  useEffect(() => {
    if (!listingId) return;
    fetch(`${API_BASE}/api/listings/${listingId}`)
      .then((res) => res.json())
      .then((data) => {
        setListingName(data.shopName || "Selected Listing");
      })
      .catch(() => setListingName("Listing"));
  }, [listingId]);

  /** Star rating UI */
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          style={{
            fontSize: "1.8rem",
            cursor: "pointer",
            color: i <= rating ? "#ffc107" : "#ccc",
          }}
          onClick={() => setRating(i)}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  /** Submit review */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating) {
      setAlert({ show: true, type: "danger", message: "Please select a rating." });
      return;
    }

    if (!comment.trim()) {
      setAlert({ show: true, type: "danger", message: "Please enter a comment." });
      return;
    }

    if (!userName.trim() || !userEmail.trim()) {
      setAlert({
        show: true,
        type: "danger",
        message: "Name and Email are required for guest reviews.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId,
          userName,
          userEmail,
          rating,
          comment,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setAlert({
          show: true,
          type: "success",
          message: "Review submitted successfully! Awaiting admin approval.",
        });
        setRating(0);
        setComment("");
      } else {
        setAlert({ show: true, type: "danger", message: data.message || "Error submitting review." });
      }
    } catch (err) {
      setAlert({ show: true, type: "danger", message: "Network error while submitting review." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <h3 className="mb-4 text-center">
            Write a Review for <span className="text-primary">{listingName}</span>
          </h3>

          {alert.show && (
            <Alert
              variant={alert.type}
              onClose={() => setAlert({ show: false })}
              dismissible
            >
              {alert.message}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3 text-center">
              <Form.Label><strong>Rating:</strong></Form.Label>
              <div>{renderStars()}</div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Your Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Your Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Comment</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Write your review..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              />
            </Form.Group>

            <div className="text-center">
              <Button
                variant="primary"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </Button>{" "}
              <Button
                variant="secondary"
                type="button"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default AddReview;
