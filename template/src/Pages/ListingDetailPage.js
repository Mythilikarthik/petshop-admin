import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./Css/ListingDetailPage.css";
import dummyImage from "../dummy.jpg";
import { FaStar, FaStarHalfAlt, FaRegStar, FaAngleLeft, FaAngleRight  } from "react-icons/fa";
import { Form, Button, Container, Row, Col, Alert, Modal } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { incrementListingViews } from "../utils/engagementTracker";
import { useEngagementGate } from "../hooks/useEngagementGate";
import AuthGateModal from "../hooks/AuthGateModel";
import { Helmet } from "react-helmet-async";
import { validateField } from "../utils/formValidation";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";



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
const [offers, setOffers] = useState([]);
const [currentPage, setCurrentPage] = useState(1);
const offersPerPage = 2; 
const [carouselIndices, setCarouselIndices] = useState({});

const moveCarousel = (offerId, direction, totalMedia) => {
  setCarouselIndices((prev) => {
    const currentIdx = prev[offerId] || 0;
    let nextIdx = direction === 'next' ? currentIdx + 1 : currentIdx - 1;

    if (nextIdx >= totalMedia) nextIdx = 0;
    if (nextIdx < 0) nextIdx = totalMedia - 1;

    return { ...prev, [offerId]: nextIdx };
  });
};
// 3️⃣ FETCH OFFERS FOR THIS LISTING

  // const { listingId } = useParams(); // from URL
  // const id = listingId;
//   const { slugId } = useParams();
//   const getIdFromSlug = (slugId) => {
//   const parts = slugId.split("-");
//   return parts[parts.length - 1]; // last part = Mongo _id
// };
// const id = getIdFromSlug(slugId);
const { slug } = useParams();
console.log("Listing slug:", slug);
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
 const [showUrl, setShowUrl] = useState(false);
const [urlIsTracking, setUrlIsTracking] = useState(false);

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
  if (!listing?._id) return;

  const fetchListingOffers = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/offers/listing/${listing._id}`);
      const data = await res.json();
      if (data.success) {
        setOffers(data.offers);
      }
    } catch (err) {
      console.error("Error fetching listing offers:", err);
    }
  };

  fetchListingOffers();
}, [listing?._id]);
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
        const res = await fetch(`${API_BASE}/api/listing/incviewsslug/slug/${slug}`);
        const data = await res.json();

        if (data.success) {
          setListing(data.listing);
          setListingName(data.listing.shopName);
          console.log("Listing Data:", data.listing);
        }
      } catch (err) {
        console.error("Error fetching listing:", err.message);
      }
      setLoading(false);
    };

    fetchListing();
  }, [slug]);

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
useEffect(() => {
  window.scrollTo({
    top: 0,
    behavior: "smooth", // optional
  });
}, [slug]);

  // ============================================================
  // 2️⃣ FETCH REVIEWS FOR THIS LISTING
  // ============================================================
  // useEffect(() => {
  //   const fetchReviews = async () => {
  //     try {
  //       const res = await fetch(`${API_BASE}/api/reviews/list/${listing._id}`);
  //       const data = await res.json();

  //       if (data.success) {
  //         setReviews(data.reviews);
  //       }
  //     } catch (err) {
  //       console.error("Error fetching reviews:", err);
  //     }
  //   };

  //   fetchReviews();
  // }, [listing]);
  useEffect(() => {
  if (!listing?._id) return;

  const fetchReviews = async () => {
    try {
      const res = await fetch(
        `${API_BASE}/api/reviews/list/${listing._id}`
      );

      const data = await res.json();

      if (data.success) {
        setReviews(data.reviews);
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  fetchReviews();
}, [listing?._id]);

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
  if (!user) {
      const nameError = validateField("name", userName, {maxLength: 50});
      if (nameError) {
        setAlert({ show: true, type: "danger", message: nameError });
        return;
      }
      const emailError = validateField("email", userEmail);
      if (emailError) {
        setAlert({ show: true, type: "danger", message: emailError });
        return;
      }
    }
    const commentError = validateField("reviewText", comment, {
      maxLength: 300,
      label: "Comment"
    });
    if (commentError) {
      setAlert({ show: true, type: "danger", message: commentError });
      return;
    }
  // if (!comment.trim()) {
  //     setAlert({ show: true, type: "danger", message: "Please enter a comment." });
  //     return;
  //   }
  //   if (comment.length > 300) {
  //     setAlert({
  //       show: true,
  //       type: "danger",
  //       message: "Comment cannot exceed 300 characters.",
  //     });
  //     return;
  //   }

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
  formData.append("listingId", listing._id);
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
const handleShowUrl = async () => {
  if (!user) {
    setShowAuthGate(true);
    return;
  }

  setUrlIsTracking(true);

  await fetch(`${API_BASE}/api/enquiry/url`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      listingId: listing._id,
      userName: user.name,
      userEmail: user.email,
      action: "url_view",
    }),
  });

  setShowUrl(true);
  setUrlIsTracking(false);
};

const handleFileChange = (e) => {
  const files = Array.from(e.target.files);

  for (let file of files) {
    if (file.size > 2 * 1024 * 1024) {
      setAlert({
        show: true,
        type: "danger",
        message: `${file.name} exceeds 2MB limit`,
      });

      e.target.value = ""; // reset input
      return;
    }
  }

  setPhotos(files);
};
const shortAddress = (address) => {
  if (!address) return "";

  // Remove pincode
  address = address.replace(/\b\d{6}\b/g, "").trim();

  // Split by comma
  let parts = address
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  // Take last 3 parts
  if (parts.length >= 3) {
    return parts.slice(-3).join(", ");
  }

  return address;
};

  return (
   <>
   <Helmet>
  <title>
    {`Vet and Pets - ${shortAddress(
      listing?.address
    )}`}
  </title>

  <meta
    name="description"
    content={
      listing?.description ||
      "Find trusted pet care services on Vet & Pets."
    }
  />
</Helmet>

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

          {listing.categories?.length > 0 && (
        <div className="listing-category">
          {listing.categories?.map((cat, index) => (
          <span key={index} className="service-tag  bg-primary text-white">
            {cat.categoryName}
          </span>
        ))}
        </div>
        )}
        {listing.specializedServices?.length > 0 && (
        <div className="listing-specialized-service">
          {listing.specializedServices?.map((cat, index) => (
          <span key={index} className="service-tag  bg-warning text-black">
            {cat.serviceName}
          </span>
        ))}        
        </div>
        )}

            
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
              setSelectedImage(img.url);
              setShowGalleryModal(true);
            }}
          >
            <img
              src={`${API_BASE}/${img.url}`}
              alt={img.alt || `${listing.shopName}-${i}`}
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
        <hr />
        {/* REVIEW LIST */}
        <div className="review-list mt-3 ">
          <div className="review-summary mb-3">
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
                    <img width={250}
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
                  <strong>City:</strong> {listing.city?.city} {" "} {listing.country}
                </li>
                <li>
                  <strong>Website:</strong>{" "}
                   {listing.mapUrl &&
                    listing.mapUrl.trim() !== "" &&
                    (
                  !showUrl ? (
                    <Button
                      size="sm"
                      variant="outline-primary"
                      onClick={handleShowUrl}
                      disabled={urlIsTracking}
                    >
                      {isTracking ? "Please wait..." : "Show Website Url"}
                    </Button>
                  ) : (
                    <a
                      href={listing.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {listing.mapUrl}
                    </a>
                  ))}
                  
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
            // onClick={() => navigate(`/claim/${listing._id}`)}
            onClick={() => navigate(`/claim/${listing.slug}`)}
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
              <Form.Label>Your Name <span className="text-red">*</span></Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
                
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Your Email <span className="text-red">*</span></Form.Label>
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
                // onChange={(e) => setPhotos(Array.from(e.target.files))}
                onChange={handleFileChange}
                ref = {fileInputRef}
              />
              <Form.Text className="text-muted">
                Note : You can upload multiple images (JPG, PNG, WEBP) up to 2MB each.
              </Form.Text>
            </Form.Group>

            {/* <Form.Group className="mb-3">
              <Form.Label>Comment <span className="text-red">*</span></Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Write your review..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              />
            </Form.Group> */}
            <Form.Group className="mb-3">
              <Form.Label>Comment <span className="text-red">*</span></Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Write your review..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                  maxLength={300} // ✅ limit to 300 characters
                />
              </Form.Group>                
            <div className="text-end text-muted">
              {comment.length}/300 characters
            </div>

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

       {/* ================= OFFERS SECTION ================= */}
{/* {offers.length > 0 && (() => {
  // Calculate Pagination Slices
  const indexOfLastOffer = currentPage * offersPerPage;
  const indexOfFirstOffer = indexOfLastOffer - offersPerPage;
  const currentOffers = offers.slice(indexOfFirstOffer, indexOfLastOffer);
  const totalPages = Math.ceil(offers.length / offersPerPage);
  

  return (
    <div className="listing-offers-section mt-4 mb-4">
      <h3 className="mb-3" style={{ }}>
        Active Offers & Announcements
      </h3>
      <Row>
        {currentOffers.map((offer) => {
          const currentImgIdx = carouselIndices[offer._id] || 0;
          const currentMedia = offer.media && offer.media[currentImgIdx];
          const encodedId = btoa(offer._id);

          const getMediaUrl = (url) => {
            if (!url) return '';
            return url.startsWith('http') ? url : `${API_BASE}/${url}`;
          };

          return (
            <Col md={6} key={offer._id} className="mb-3">
  
  
  <Link to={`/offers?ref=${encodedId}`} className="text-decoration-none" style={{ display: 'block', height: '100%' }}>
    <div className="card h-100 shadow-sm border-0" style={{ borderRadius: "12px", overflow: "hidden" }}>
      
      
      <div 
        className="position-relative bg-dark" 
        style={{ aspectRatio: '16/9', overflow: "hidden", width: "100%" }}
        onClick={(e) => {
          if (offer.media?.length > 1) e.stopPropagation();
        }}
      >
        {offer.media && offer.media.length > 0 && currentMedia ? (
          <>
            {currentMedia.type === 'image' ? (
              <img 
                src={getMediaUrl(currentMedia.url)} 
                alt={offer.title} 
                className="w-100 h-100"
                style={{ objectFit: 'cover', position: 'absolute', top: 0, left: 0 }}
              />
            ) : (
              <video
                src={getMediaUrl(currentMedia.url)}
                className="w-100 h-100"
                style={{ objectFit: 'cover', position: 'absolute', top: 0, left: 0 }}
                controls muted loop playsInline
              />
            )}

            
            {offer.media.length > 1 && (
              <>
                <Button 
                  onClick={(e) => {
                    e.preventDefault(); // Prevents link navigation
                    e.stopPropagation();
                    moveCarousel(offer._id, 'prev', offer.media.length);
                  }}
                  variant="light"
                  className="position-absolute start-0 top-50 translate-middle-y m-2 rounded-circle d-flex align-items-center justify-content-center shadow-sm p-0 border-0"
                  style={{ width: '32px', height: '32px', backgroundColor: 'rgba(250,250,250,0.85)', zIndex: 10 }}
                >
                  <BiChevronLeft size={22} style={{ color: '#000000' }} />
                </Button>
                <Button 
                  onClick={(e) => {
                    e.preventDefault(); // Prevents link navigation
                    e.stopPropagation();
                    moveCarousel(offer._id, 'next', offer.media.length);
                  }}
                  variant="light"
                  className="position-absolute end-0 top-50 translate-middle-y m-2 rounded-circle d-flex align-items-center justify-content-center shadow-sm p-0 border-0"
                  style={{ width: '32px', height: '32px', backgroundColor: 'rgba(250,250,250,0.85)', zIndex: 10 }}
                >
                  <BiChevronRight size={22} style={{ color: '#000000' }} />
                </Button>
              </>
            )}
          </>
        ) : (
          <div className="w-100 h-100 d-flex align-items-center justify-content-center text-muted small">No Media Available</div>
        )}
      </div>

      
      <div className="card-body d-flex flex-column">
        <span 
          style={{ color: '#ff4e00', backgroundColor: '#ff4e0012', fontSize: '10px', letterSpacing: '0.05em' }}
          className="text-uppercase fw-bold px-2 py-1 rounded align-self-start mb-2"
        >
          {offer.category}
        </span>
        <h5 className="card-title text-dark fw-bold">{offer.title}</h5>
        <p className="card-text text-muted small flex-grow-1">{offer.description}</p>
        
        <div className="mt-2 pt-2 border-top d-flex justify-content-between text-muted xsmall" style={{ fontSize: "11px" }}>
          <span>Valid: {new Date(offer.startDate).toLocaleDateString()}</span>
          <span>Until: {new Date(offer.endDate).toLocaleDateString()}</span>
        </div>
      </div>

    </div>
  </Link>
</Col>
          );
        })}
      </Row>

      
      {totalPages > 1 && (
        <nav className="d-flex justify-content-center mt-3">
          <ul className="pagination pagination-sm shadow-sm" style={{ borderRadius: "8px", overflow: "hidden" }}>
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button type="button" className="page-link" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>
                <FaAngleLeft />
              </button>
            </li>
            {[...Array(totalPages)].map((_, index) => {
              const pageNumber = index + 1;
              return (
                <li key={pageNumber} className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}>
                  <button type="button" className="page-link" onClick={() => setCurrentPage(pageNumber)}>
                    {pageNumber}
                  </button>
                </li>
              );
            })}
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button type="button" className="page-link" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}>
                 <FaAngleRight />
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
})()} */}
{/* ================================================== */}
      </Container>
    </section>
    </>
  );
};

export default ListingDetailPage;