import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Css/ListingDetailPage.css";
import dummyImage from "../dummy.jpg";
import { FaStar } from "react-icons/fa";
import { Form, Button, Container, Row, Col, Alert, Modal  } from "react-bootstrap";

const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://petshop-admin.onrender.com"
    : "http://localhost:5000";

const ListingDetailPage = () => {
  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [showGalleryModal, setShowGalleryModal] = useState(false);
const [selectedImage, setSelectedImage] = useState(null);
  // const { listingId } = useParams(); // from URL
  // const id = listingId;
  const { slugId } = useParams();
  const getIdFromSlug = (slugId) => {
  const parts = slugId.split("-");
  return parts[parts.length - 1]; // last part = Mongo _id
};
const id = getIdFromSlug(slugId);
console.log("Listing ID from slug:", id);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  const [listingName, setListingName] = useState("");
const [isSubmitting, setIsSubmitting] = useState(false);
const [rating, setRating] = useState(0);
  // --- Review states ---
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({
    userName: "",
    rating: 5,
    comment: "",
  });
  const [hoverRating, setHoverRating] = useState(0);

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
  // ============================================================
  // 1️⃣ FETCH LISTING DETAILS
  // ============================================================
  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/listing/incviewsslug/${slugId}`);
        const data = await res.json();

        if (data.success) {
          setListing(data.listing);
          setListingName(data.listing.shopName);
          console.log("Listing Data:", data.listing);
        }
      } catch (err) {
        console.error("Error fetching listing:", err);
      }
      setLoading(false);
    };

    fetchListing();
  }, [id]);

  // ============================================================
  // 2️⃣ FETCH REVIEWS FOR THIS LISTING
  // ============================================================
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/reviews/list/${id}`);
        const data = await res.json();

        if (data.success) {
          setReviews(data.reviews);
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };

    fetchReviews();
  }, [id]);

  // ============================================================
  // 3️⃣ CALCULATE AVERAGE RATING
  // ============================================================
  const averageRating = () => {
    if (!reviews.length) return 0;
    return (
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    ).toFixed(1);
  };

  // ============================================================
  // ⭐ STAR RENDER UTILITY
  // ============================================================
  const renderStarsCal = (value) => {
    const full = Math.round(value);
    return Array.from({ length: 5 }).map((_, i) => (
      <FaStar
        key={i}
        color={i < full ? "#ffc107" : "#e4e5e9"}
      />
    ));
  };

  const renderAvgStarsCal = (value) => {
    const full = Math.round(value);
    return Array.from({ length: 5 }).map((_, i) => (
      <FaStar
        key={i}
        color={i < full ? "#ffc107" : "#e4e5e9"}
      />
    ));
  };

  // ============================================================
  // 4️⃣ SUBMIT NEW REVIEW (GUEST)
  // ============================================================
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
          listingId: id,
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
        setUserName("");
        setUserEmail("");
        
      } else {
        setAlert({ show: true, type: "danger", message: data.message || "Error submitting review." });
      }
    } catch (err) {
      setAlert({ show: true, type: "danger", message: "Network error while submitting review." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!listing) return <div>Listing not found.</div>;

  return (
    <section className="listing-detail-section p-0 mt-0">
      {listing.bannerImage && (
          <div className="mb-4">
            <img
              src={`${API_BASE}${listing.bannerImage}`}
              alt={listing.shopName}
              style={{
                width: "100%",
                height: "auto", // ✅ never cut
                
              }}
            />
          </div>
        )}
      <Container>
        

        <Row className="">
          <Col md={8}>
          <div className="review-summary">
            <div style={{ display: "flex", gap: 12, alignItems: "left" }}>
              <div style={{ fontSize: 30, fontWeight: "bold" }}>
                {averageRating()}
              </div>
              <div>
                {renderAvgStarsCal(averageRating())}
                <div style={{ fontSize: 14, color: "#666" }}>
                  {reviews.length} review(s)
                </div>
              </div>
            </div>
          </div>
            <h2>{listing.shopName}</h2>
        
          

        {/* TOP AREA */}
        <Row className="mt-3">
          <Col md={12}>

            <p className="listing-description text-align-justify">{listing.description}</p>

            <div className="d-flex gap-2">
             {console.log("petcats:",listing.petCategories)}
     {listing.petCategories?.length > 0 && (
        listing.petCategories.map((cat, index) => (
          <div className="listing-type">
          <span key={index} className="">
            {cat.categoryName}
          </span>
          </div>
        ))
      )}
          </div>
        <div className="listing-category">
          {listing.categories?.map((cat, index) => (
          <span key={index} className="service-tag tag-orange">
            {cat.categoryName}
          </span>
        ))}
        </div>

            <div className="listing-contact">
              
              <ul>
                <li>
                  <strong>Phone:</strong>{" "}
                  <a href={`tel:${listing.phone}`}>{listing.phone}</a>
                </li>
                <li>
                  <strong>Email:</strong>{" "}
                  <a href={`mailto:${listing.email}`}>
                    {listing.email}
                  </a>
                </li>
                <li>
                  <strong>Address:</strong> {listing.address}
                </li>
                <li>
                  <strong>City:</strong> {listing.city?.city}
                </li>
                <li>
                  <strong>Website:</strong>{" "}
                  <a
                    href={listing.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {listing.mapUrl}
                  </a>
                </li>
              </ul>
              {console.log("Created By Type:", listing.created_by_type)}
        {listing.created_by_type && listing.created_by_type === "admin" && !(listing.isClaimed) && (
          <Button
            variant="primary"
            className="mt-3"
            onClick={() => navigate(`/claim/${listing._id}`)}
          >
            Claim
          </Button>
        )}
            </div>
          </Col>

          
        </Row>

        {/* GALLERY
        {listing.photos?.length > 0 && (
          <div className="listing-gallery mt-4">
            <h2>Gallery</h2>
            <Row>
              {listing.photos && listing.photos.length > 0 && listing.photos.map((img, i) => (
                <Col md={4} key={i} className="mb-3">
                  <img
                    src={img}
                    alt={`${listing.shopName}-${i}`}
                    className="img-fluid"
                    style={{ borderRadius: 10, objectFit: "cover" }}
                  />
                </Col>
              ))}
            </Row>
          </div>
        )} */}
        {/* GALLERY */}
{listing.photos?.length > 0 && (
  <div className="listing-gallery mt-4">
    <h2>Gallery</h2>

    <Row>
      {listing.photos.map((img, i) => (
        <Col md={4} sm={6} xs={12} key={i} className="mb-3">
          <div
            className="gallery-item"
            onClick={() => {
              setSelectedImage(img);
              setShowGalleryModal(true);
            }}
          >
            <img
              src={`${API_BASE}${img}`}
              alt={`${listing.shopName}-${i}`}
              className="gallery-img"
            />
          </div>
        </Col>
      ))}
    </Row>
  </div>
)}

        <Modal
  show={showGalleryModal}
  onHide={() => setShowGalleryModal(false)}
  centered
  size="lg"
>
  <Modal.Body className="p-0">
    <img
      src={selectedImage}
      alt="Gallery preview"
      className="w-100"
      style={{ maxHeight: "80vh", objectFit: "contain" }}
    />
  </Modal.Body>
</Modal>
        {/* REVIEWS SUMMARY */}
        
        

        

        
          </Col>
          <Col md={4} className="bg-grey"> 
          {/* SIDE AREA - Placeholder for future content */}
          {/* REVIEW FORM */}
          
        <Row className=" shadow-sm m-4 rounded">
       
          <h5 style={{background: "#eaeaea", padding: "14px", textAlign: "center"}}>Write Review</h5>
        <Col md={12} lg={12}>
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

            <div className="mb-3">
              <Button
                variant="primary"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
      {/* REVIEW LIST */}
        <div className="review-list m-4">
          <h5 style={{background: "#eaeaea", padding: "14px", textAlign: "center"}}>Customer Reviews</h5>
          {reviews.length === 0 ? (
            <p>No reviews yet.</p>
          ) : (
            reviews.map((r) => (
              <div
                key={r._id}
                className="review-item"
                style={{
                  borderBottom: "1px solid #ddd",
                  padding: "10px 0",
                }}
              >
                <div
                  style={{
                    fontWeight: "bold",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>{r.userName}</span>
                  <span style={{ color: "#888" }}>
                    {new Date(r.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div>{renderStarsCal(r.rating)}</div>
                {/* {console.log("Review :",r.rating)} */}
                <p>{r.comment}</p>
              </div>
            ))
          )}
        </div>
          </Col>
        </Row>

        
      </Container>
    </section>
  );
};

export default ListingDetailPage;
