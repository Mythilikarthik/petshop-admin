import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Breadcrumb, Card, Spinner, Badge, Button } from "react-bootstrap";
import { FaStar } from "react-icons/fa";

const API_BASE =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_URL
    : "http://localhost:5000";

const ViewReviewDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/reviews/single/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load review");
        setReview(data);
      } catch (err) {
        console.error(err);
        alert("Error loading review details");
      } finally {
        setLoading(false);
      }
    };
    fetchReview();
  }, [id]);

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );

  if (!review)
    return (
      <Container className="mt-5">
        <p>Review not found.</p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </Container>
    );

    const handleStatusChange = async (newStatus) => {
  if (!window.confirm(`Are you sure to mark this review as ${newStatus}?`)) return;

  try {
    const res = await fetch(`${API_BASE}/api/reviews/${review._id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: newStatus,
        adminId: localStorage.getItem("userId"),
      }),
    });

    const data = await res.json();

    if (data.success) {
      setReview((prev) => ({ ...prev, status: newStatus }));
    } else {
      alert(data.message || "Failed to update status");
    }
  } catch (err) {
    console.error(err);
    alert("Error updating review status");
  }
};

  return (
    <Container className="mt-4">
      <Row className='mb-3 justify-content-end align-items-center'>
        <Col>
        <h2 className='main-title mb-0'>View Review</h2>
        <Breadcrumb className='top-breadcrumb'>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/review-management">Reviews</Breadcrumb.Item>
            <Breadcrumb.Item active>{review.listingId?.shopName || "—"}</Breadcrumb.Item>
        </Breadcrumb>
        </Col>
        <Col xs={'auto'} className="d-flex gap-2">
  <Button variant="secondary" onClick={() => navigate(-1)}>
    Go Back
  </Button>

  {review.status === "pending" && (
    <>
      <Button
        variant="success"
        onClick={() => handleStatusChange("approved")}
      >
        Approve
      </Button>
      <Button
        variant="danger"
        onClick={() => handleStatusChange("rejected")}
      >
        Reject
      </Button>
    </>
  )}

  {review.status === "approved" && (
    <Button
      variant="danger"
      onClick={() => handleStatusChange("rejected")}
    >
      Reject
    </Button>
  )}

  {review.status === "rejected" && (
    <Button
      variant="success"
      onClick={() => handleStatusChange("approved")}
    >
      Approve
    </Button>
  )}
</Col>
    </Row>

      <div className="form-container">
        <Card className="shadow-sm">
        <Card.Body>
          <Row className="mb-3">
            <Col md={12} className="mb-3">
              <strong>Listing:</strong> {review.listingId?.shopName || "—"}
            </Col>
            <Col md={12}>
              <strong>Status:</strong>{" "}
              <Badge
                bg={
                  review.status === "approved"
                    ? "success"
                    : review.status === "rejected"
                    ? "danger"
                    : "secondary"
                }
              >
                {review.status}
              </Badge>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={12} className="mb-3">
              <strong>Reviewer:</strong>{" "}
              {review.userId?.name || review.userName || "Guest"}
            </Col>
            <Col md={12}>
              <strong>Email:</strong>{" "}
              {review.userId?.email || review.userEmail || "—"}
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={12} className="d-flex align-items-center gap-2 mb-3">
              <strong>Rating:</strong> <FaStar fill="#ffc107"/> {review.rating}
            </Col>
            <Col md={12}>
              <strong>Date:</strong>{" "}
              {new Date(review.created_at).toLocaleDateString()}
            </Col>
          </Row>
          {review.photos?.length > 0 && (
  <Row className="mt-4">
    <Col>
      <strong>Uploaded Photos:</strong>

      <Row className="mt-2">
        {review.photos.map((img, index) => (
          <Col md={12} sm={12} xs={12} key={index} className="mb-3">
            <Card className="shadow-sm">
              <Card.Img
              className="img-responsive"
                variant="top"
                src={`${API_BASE}/${img}`}
                alt={`Review-${index}`}
                style={{
                  height: "150px",
                  objectFit: "cover",
                  cursor: "pointer",
                }}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </Col>
  </Row>
)}


          <Row>
            <Col>
              <strong>Comment:</strong>
              <Card className="mt-2 bg-light">
                <Card.Body>{review.comment || "No comment provided."}</Card.Body>
              </Card>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      </div>

      
    </Container>
  );
};

export default ViewReviewDetail;
