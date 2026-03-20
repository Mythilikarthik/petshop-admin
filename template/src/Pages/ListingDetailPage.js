import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Css/ListingDetailPage.css";
import dummyImage from "../dummy.jpg";
import { FaStar, FaStarHalfAlt, FaRegStar  } from "react-icons/fa";
import { Form, Button, Container, Row, Col, Alert, Modal } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { incrementListingViews } from "../utils/engagementTracker";
import { useEngagementGate } from "../hooks/useEngagementGate";
import AuthGateModal from "../hooks/AuthGateModel";



const API_BASE =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_URL
    : "http://localhost:5000";

const ListingDetailPage = () => {
  const alertRef = useRef(null);
const [showAuthGate, setShowAuthGate] = useState(false);

  const { user, authLoading } = useAuth();
    const engagementGate = useEngagementGate(user);
  
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [photos, setPhotos] = useState([]);
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
 const [showPhone, setShowPhone] = useState(false);
const [isTracking, setIsTracking] = useState(false);

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
useEffect(() => {
  if (!authLoading && !user && engagementGate) {
    setShowAuthGate(true);
  }
}, [authLoading, user, engagementGate]);
useEffect(() => {
  if (user) {
    setShowAuthGate(false);
  }
}, [user]);

  useEffect(() => {
  incrementListingViews();
}, []);

  useEffect(() => {
  if (user) {
    setUserName(user.name || "");
    setUserEmail(user.email || "");
  }
}, [user]);
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

  useEffect(() => {
  if (alert.show && alertRef.current) {
    alertRef.current.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

    alertRef.current.focus();
  }
}, [alert]);

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
  const stars = [];

  const fullStars = Math.floor(value);
  const hasHalfStar = value % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  // Full stars
  for (let i = 0; i < fullStars; i++) {
    stars.push(<FaStar key={`full-${i}`} color="#ffc107" />);
  }

  // Half star
  if (hasHalfStar) {
    stars.push(<FaStarHalfAlt key="half" color="#ffc107" />);
  }

  // Empty stars
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<FaRegStar key={`empty-${i}`} color="#e4e5e9" />);
  }

  return stars;
};
// Full -round off
  // const renderAvgStarsCal = (value) => {
  //   const full = Math.round(value);
  //   return Array.from({ length: 5 }).map((_, i) => (
  //     <FaStar
  //       key={i}
  //       color={i < full ? "#ffc107" : "#e4e5e9"}
  //     />
  //   ));
  // };

  // ============================================================
  // 4️⃣ SUBMIT NEW REVIEW (GUEST) without image
  // ============================================================
  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (!rating) {
  //     setAlert({ show: true, type: "danger", message: "Please select a rating." });
  //     return;
  //   }

  //   if (!comment.trim()) {
  //     setAlert({ show: true, type: "danger", message: "Please enter a comment." });
  //     return;
  //   }

  //   if (!userName.trim() || !userEmail.trim()) {
  //     setAlert({
  //       show: true,
  //       type: "danger",
  //       message: "Name and Email are required for guest reviews.",
  //     });
  //     return;
  //   }

  //   setIsSubmitting(true);
  //   try {
  //     const res = await fetch(`${API_BASE}/api/reviews`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         listingId: id,
  //         userName,
  //         userEmail,
  //         rating,
  //         comment,
  //         photos,
  //       }),
  //     });

  //     const data = await res.json();
  //     if (res.ok) {
  //       setAlert({
  //         show: true,
  //         type: "success",
  //         message: "Review submitted successfully! Awaiting admin approval.",
  //       });
  //       setRating(0);
  //       setComment("");
  //       setUserName("");
  //       setUserEmail("");
  //       setPhotos([]);
        
  //     } else {
  //       setAlert({ show: true, type: "danger", message: data.message || "Error submitting review." });
  //     }
  //   } catch (err) {
  //     setAlert({ show: true, type: "danger", message: "Network error while submitting review." });
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

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

    // if (!userName.trim() || !userEmail.trim()) {
    //   setAlert({
    //     show: true,
    //     type: "danger",
    //     message: "Name and Email are required for guest reviews.",
    //   });
    //   return;
    // }
    if (!user && (!userName.trim() || !userEmail.trim())) {
      setAlert({
        show: true,
        type: "danger",
        message: "Name and Email are required for guest reviews.",
      });
      return;
    }

    setIsSubmitting(true);

  const formData = new FormData();
  formData.append("listingId", id);
  formData.append("userName", userName);
  formData.append("userEmail", userEmail);
  formData.append("rating", rating);
  formData.append("comment", comment);

  photos.forEach((file) => {
    formData.append("photos", file);
  });

  try {
    const res = await fetch(`${API_BASE}/api/reviews`, {
      method: "POST",
      body: formData, // ✅ NO headers
    });

    const data = await res.json();

    if (res.ok) {
      setAlert({
        show: true,
        type: "success",
        message: "Review submitted successfully! Awaiting approval.",
      });

      setRating(0);
      setComment("");
      setUserName("");
      setUserEmail("");
      setPhotos([]);
      fileInputRef.current.value = "";
    }
  } catch (err) {
    setAlert({ show: true, type: "danger", message: err.message });
  } finally {
    setIsSubmitting(false);
  }
};


  if (loading) return <div>Loading...</div>;
  if (!listing) return <div>Listing not found.</div>;

  // const handleShowPhone = async () => {
  //   if (!user) {
  //     window.google.accounts.id.prompt(); // force login
  //     return;
  //   }
  //   setIsTracking(true);

  //   await fetch(`${API_BASE}/api/enquiry`, {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({
  //       listingId: listing._id,
  //       userName: user.name,
  //       userEmail: user.email,
  //       action: "phone_view",
  //     }),
  //   });

  //   setShowPhone(true);
  // };
  const handleShowPhone = async () => {
  if (!user) {
    setShowAuthGate(true);
    return;
  }

  setIsTracking(true);

  await fetch(`${API_BASE}/api/enquiry`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      listingId: listing._id,
      userName: user.name,
      userEmail: user.email,
      action: "phone_view",
    }),
  });

  setShowPhone(true);
  setIsTracking(false);
};




  return (
   

    <section className="listing-detail-section p-0 mt-0">
      
       <AuthGateModal
        show={showAuthGate}
        onClose={() => setShowAuthGate(false)}
      />
      {listing.bannerImage && (
          <div className="mb-4">
            <img
              src={`${API_BASE}/${listing.bannerImage}`}
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
            <h2  className="mb-3">{listing.shopName}</h2>
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
        
          

        {/* TOP AREA */}
        <Row className="mt-3">
          <Col md={12}>

            <p className="listing-description text-align-justify">{listing.description}</p>

            
        <div className="listing-category">
          {listing.categories?.map((cat, index) => (
          <span key={index} className="service-tag  bg-primary text-white">
            {cat.categoryName}
          </span>
        ))}
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
              src={`${API_BASE}/${img}`}
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
      src={`${API_BASE}/${selectedImage}`}
      alt="Gallery preview"
      className="w-100"
      style={{ maxHeight: "80vh", objectFit: "contain" }}
    />
  </Modal.Body>
</Modal>
        {/* REVIEWS SUMMARY */}
        
        {/* REVIEW LIST */}
        <div className="review-list mt-3 ">
          <h5 style={{background: "#eaeaea", padding: "14px", textAlign: "center"}}>Customer Reviews</h5>
          {console.log(reviews)}
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
                {r.photos && r.photos.length > 0 &&
                  r.photos.map((item, index) => (
                    <img className="img-responsive"
                      key={index}
                      src={`${API_BASE}/${item}`}
                      alt={`Review-${index}`}
                    />
                  ))
                }

              </div>
            ))
          )}
        </div>

        

        
          </Col>

          <Col md={4} className="bg-grey"> 
          {/* SIDE AREA - Placeholder for future content */}
          {/* REVIEW FORM */}
          <Row className="shadow-sm m-4 rounded">
            <h5 style={{background: "#eaeaea", padding: "14px", textAlign: "center"}}>Contact Details</h5>
            <div className="listing-contact mt-3 mb-3">
              
              <ul>
                <li>
                  {/* <strong>Phone:</strong>{" "} */}
                  {/* <a href={`tel:${listing.phone}`}>{listing.phone}</a> */}
                  <li>
                    <strong>Phone:</strong>{" "}
                    {!showPhone ? (
                      <Button
                        size="sm"
                        variant="outline-primary"
                        onClick={handleShowPhone}
                        disabled={isTracking}
                      >
                        {isTracking ? "Please wait..." : "Show Number"}
                      </Button>
                    ) : (
                      <a href={`tel:${listing.phone}`} className="ms-2">
                        {listing.phone}
                      </a>
                    )}
                  </li>

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
                  <strong>City:</strong> {listing.city?.city} {","} {listing.country}
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
                <li>
  <strong>Working Hours:</strong>
  <div className="mt-2">
    {listing.businessHours?.length > 0 ? (
      listing.businessHours.map((bh, index) => (
        <div key={index} className="d-flex justify-content-between">
          <span>{bh.day}</span>
          <span>
            {bh.closed ? "Closed" : `${bh.open} - ${bh.close}`}
          </span>
        </div>
      ))
    ) : (
      <span>Not available</span>
    )}
  </div>
</li>
              </ul>
              {console.log("Created By Type:", listing.created_by_type)}
        {listing.created_by_type && listing.created_by_type === "admin" && !(listing.isClaimed) && (
          <Button
            variant="primary"
            className="w-100"
            onClick={() => navigate(`/claim/${listing._id}`)}
          >
            Claim this business
          </Button>
        )}
            </div>
          </Row>
        <Row className=" shadow-sm m-4 rounded">
       
          <h5 style={{background: "#eaeaea", padding: "14px", textAlign: "center"}}>Write Review</h5>
        <Col md={12} lg={12}>
          {alert.show && (
            <Alert ref={alertRef}
              variant={alert.type}
              onClose={() => setAlert({ show: false })}
              dismissible
            >
              {alert.message}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3 text-center">
              <Form.Label><strong>Rating  <span className="text-red">*</span></strong></Form.Label>
              <div>{renderStars()}</div>
            </Form.Group>

            {user ? (
              <>
              <Form.Group className="mb-3">
                {/* <Form.Label>Your Name</Form.Label> */}
                <Form.Control
                  type="text"
                  placeholder="Enter your name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                  hidden
                />
              </Form.Group>

              <Form.Group className="mb-3">
                {/* <Form.Label>Your Email</Form.Label> */}
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  required
                  hidden
                />
              </Form.Group>
              </>
            ) : (
              <>
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
            </>
            )}

            
            <Form.Group className="mb-4">
              <Form.Label>Upload Photos [Optional]</Form.Label>
              <Form.Control
                type="file"
                name="photos"
                multiple
                accept="image/*"
                onChange={(e) => setPhotos(Array.from(e.target.files))}
                ref = {fileInputRef}
              />
              <Form.Text className="text-muted">
                Note : You can upload multiple images (JPG, PNG, WEBP) up to 2MB each.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Comment <span className="text-red">*</span></Form.Label>
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
      
          </Col>
        </Row>

        
      </Container>
    </section>
    
  );
};

export default ListingDetailPage;
