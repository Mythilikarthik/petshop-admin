import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./Css/ListingDetailPage.css";
import { FaStar, FaStarHalfAlt, FaRegStar, FaWhatsapp, FaFacebook, FaInstagram, FaTwitter, FaMapMarkerAlt, FaShieldAlt, FaCheckCircle, FaAward } from "react-icons/fa";
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
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { slug } = useParams();
  const { user, authLoading } = useAuth();
  const engagementGate = useEngagementGate(user);

  // Core States
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [photos, setPhotos] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [offers, setOffers] = useState([]);
  
  // UI Interaction States
  const [showAuthGate, setShowAuthGate] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [carouselIndices, setCarouselIndices] = useState({});
  const [showPhone, setShowPhone] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [showUrl, setShowUrl] = useState(false);
  const [urlIsTracking, setUrlIsTracking] = useState(false);

  const offersPerPage = 2; 

  // Derived Subscription settings safely mapped from backend properties
  const listingTier = listing?.plan || "free"; 
  const isFeaturedTier = listing?.isFeatured || listingTier === "featured_city" || listingTier === "premium_verified";
  const isPremiumTier = listing?.isPremiumBadge || listingTier === "premium_verified";
  const isVerifiedListing = listing?.isVerified;

  const moveCarousel = (offerId, direction, totalMedia) => {
    setCarouselIndices((prev) => {
      const currentIdx = prev[offerId] || 0;
      let nextIdx = direction === 'next' ? currentIdx + 1 : currentIdx - 1;
      if (nextIdx >= totalMedia) nextIdx = 0;
      if (nextIdx < 0) nextIdx = totalMedia - 1;
      return { ...prev, [offerId]: nextIdx };
    });
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          style={{ fontSize: "1.8rem", cursor: "pointer", color: i <= rating ? "#ffc107" : "#ccc" }}
          onClick={() => setRating(i)}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  useEffect(() => {
    incrementListingViews();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/listing/incviewsslug/slug/${slug}`);
        const data = await res.json();
        if (data.success) {
          setListing(data.listing);
        }
      } catch (err) {
        console.error("Error fetching listing:", err.message);
      }
      setLoading(false);
    };
    fetchListing();
  }, [slug]);

  useEffect(() => {
    if (!listing?._id) return;

    const fetchListingOffers = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/offers/listing/${listing._id}`);
        const data = await res.json();
        if (data.success) setOffers(data.offers);
      } catch (err) {
        console.error("Error fetching listing offers:", err);
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/reviews/list/${listing._id}`);
        const data = await res.json();
        if (data.success) setReviews(data.reviews);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };

    // Announcements/Offers are blocked on the Free tier workflow
    if (listingTier !== "free") {
      fetchListingOffers();
    }
    fetchReviews();
  }, [listing?._id, listingTier]);

  useEffect(() => {
    if (!authLoading && !user && engagementGate) setShowAuthGate(true);
    if (user) {
      setShowAuthGate(false);
      setUserName(user.name || "");
      setUserEmail(user.email || "");
    }
  }, [authLoading, user, engagementGate]);

  useEffect(() => {
    if (alert.show && alertRef.current) {
      alertRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [alert]);

  const averageRating = () => {
    if (!reviews.length) return 0;
    return (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);
  };

  const renderStarsCal = (value) => {
    const full = Math.round(value);
    return Array.from({ length: 5 }).map((_, i) => (
      <FaStar key={i} color={i < full ? "#ffc107" : "#e4e5e9"} />
    ));
  };

  const renderAvgStarsCal = (value) => {
    const stars = [];
    const fullStars = Math.floor(value);
    const hasHalfStar = value % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    for (let i = 0; i < fullStars; i++) stars.push(<FaStar key={`full-${i}`} color="#ffc107" />);
    if (hasHalfStar) stars.push(<FaStarHalfAlt key="half" color="#ffc107" />);
    for (let i = 0; i < emptyStars; i++) stars.push(<FaRegStar key={`empty-${i}`} color="#e4e5e9" />);
    return stars;
  };

  const handleShowPhone = async () => {
    if (!user) { setShowAuthGate(true); return; }
    setIsTracking(true);
    await fetch(`${API_BASE}/api/enquiry`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId: listing._id, userName: user.name, userEmail: user.email, action: "phone_view" }),
    });
    setShowPhone(true);
    setIsTracking(false);
  };

  const handleShowUrl = async () => {
    if (!user) { setShowAuthGate(true); return; }
    setUrlIsTracking(true);
    await fetch(`${API_BASE}/api/enquiry/url`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId: listing._id, userName: user.name, userEmail: user.email, action: "url_view" }),
    });
    setShowUrl(true);
    setUrlIsTracking(false);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    for (let file of files) {
      if (file.size > 2 * 1024 * 1024) {
        setAlert({ show: true, type: "danger", message: `${file.name} exceeds 2MB limit` });
        e.target.value = "";
        return;
      }
    }
    setPhotos(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) { setAlert({ show: true, type: "danger", message: "Please select a rating." }); return; }
    if (!user) {
      const nameError = validateField("name", userName, { maxLength: 50 });
      if (nameError) { setAlert({ show: true, type: "danger", message: nameError }); return; }
      const emailError = validateField("email", userEmail);
      if (emailError) { setAlert({ show: true, type: "danger", message: emailError }); return; }
    }
    const commentError = validateField("reviewText", comment, { maxLength: 300, label: "Comment" });
    if (commentError) { setAlert({ show: true, type: "danger", message: commentError }); return; }
    if (!user && (!userName.trim() || !userEmail.trim())) {
      setAlert({ show: true, type: "danger", message: "Name and Email are required for guest reviews." });
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("listingId", listing._id);
    formData.append("userName", userName);
    formData.append("userEmail", userEmail);
    formData.append("rating", rating);
    formData.append("comment", comment);
    photos.forEach((file) => formData.append("photos", file));

    try {
      const res = await fetch(`${API_BASE}/api/reviews`, { method: "POST", body: formData });
      if (res.ok) {
        setAlert({ show: true, type: "success", message: "Review submitted successfully! Awaiting approval." });
        setRating(0); setComment(""); setUserName(""); setUserEmail(""); setPhotos([]);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    } catch (err) {
      setAlert({ show: true, type: "danger", message: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const shortAddress = (address) => {
    if (!address) return "";
    address = address.replace(/\b\d{6}\b/g, "").trim();
    let parts = address.split(",").map((part) => part.trim()).filter(Boolean);
    if (parts.length >= 3) return parts.slice(-3).join(", ");
    return address;
  };

  if (loading) return <div className="p-5 text-center">Loading Listing Details...</div>;
  if (!listing) return <div className="p-5 text-center">Listing not found.</div>;

  return (
    <>
      <Helmet>
        <title>{`Vet and Pets - ${shortAddress(listing?.address)}`}</title>
        <meta name="description" content={listing?.description || "Find trusted pet care services on Vet & Pets."} />
      </Helmet>

      <section className="listing-detail-section p-0 mt-0">
        <AuthGateModal show={showAuthGate} onClose={() => setShowAuthGate(false)} />
        
        {/* Dynamic Categorized/Filtered Banners Configuration */}
        {isFeaturedTier && listing.bannerImage && (
          <div className="listing-banner-container mb-4 position-relative">
            <img
              src={`${API_BASE}/${listing.bannerImage}`}
              alt={listing.shopName}
              className="w-100 listing-hero-banner"
              style={{ maxHeight: "380px", objectFit: "cover" }}
            />
            <div className="banner-overlay-tags position-absolute bottom-0 start-0 m-4">
              {isPremiumTier && <span className="badge bg-dark px-3 py-2 me-2 shadow"><FaShieldAlt className="me-1 text-warning"/> Premium Vendor</span>}
              {!isPremiumTier && isFeaturedTier && <span className="badge bg-primary px-3 py-2 shadow"><FaAward className="me-1"/> Featured Local</span>}
            </div>
          </div>
        )}

        <Container className="mt-4">
          <Row>
            {/* MAIN CONTENT BLOCK */}
            <Col lg={8} md={12}>
              <div className="d-flex align-items-center flex-wrap gap-2 mb-2">
                <h2 className="mb-0 me-2 shop-heading">{listing.shopName}</h2>
                <div className="d-flex gap-2 align-items-center">
                  {isVerifiedListing && <span className="badge bg-success d-inline-flex align-items-center gap-1"><FaCheckCircle/> Verified</span>}
                  {isPremiumTier && <span className="badge bg-warning text-dark d-inline-flex align-items-center gap-1"><FaShieldAlt/> Premium</span>}
                </div>
              </div>

              {/* Pet Categories Anchors Row */}
              <div className="d-flex flex-wrap gap-2 mb-3">
                {listing.petCategories?.length > 0 &&
                  listing.petCategories.map((cat, index) => (
                    <div className="listing-type" key={index}>
                      <span>{cat.categoryName}</span>
                    </div>
                  ))
                }
              </div>

              {/* Description Body */}
              <p className="listing-description text-align-justify">{listing.description}</p>

              {/* Specialized Services & Master Categories Framework */}
              <div className="mb-4">
                {listing.categories?.length > 0 && (
                  <div className="listing-category mb-2">
                    <strong className="d-block mb-1 text-muted text-sm">Core Category Focus:</strong>
                    {listing.categories.map((cat, index) => (
                      <span key={index} className="service-tag bg-primary text-white me-2 mb-2 d-inline-block">
                        {cat.categoryName}
                      </span>
                    ))}
                  </div>
                )}
                
                {listing.specializedServices?.length > 0 && (
                  <div className="listing-specialized-service">
                    <strong className="d-block mb-1 text-muted text-sm">Specialized Offerings:</strong>
                    {listing.specializedServices.map((service, index) => (
                      <span key={index} className="service-tag bg-warning text-black me-2 mb-2 d-inline-block">
                        {service.serviceName}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Service Coverage Configuration */}
              {listing.serviceCoverage && (listing.serviceCoverage.radiusKm > 0 || listing.serviceCoverage.neighborhoods?.length > 0) && (
                <div className="service-coverage-box border rounded p-3 mb-4 bg-light shadow-sm">
                  <h6 className="d-flex align-items-center gap-2 mb-2 text-primary"><FaMapMarkerAlt /> Service Coverage Footprint</h6>
                  {listing.serviceCoverage.type === "radius" ? (
                    <p className="mb-0 text-muted">Operating within a <strong>{listing.serviceCoverage.radiusKm} km radius</strong> from base point location.</p>
                  ) : (
                    <div className="d-flex flex-wrap gap-1 align-items-center">
                      <span className="text-muted me-1">Specific Locality Bounds:</span>
                      {listing.serviceCoverage.neighborhoods.map((zone, zIdx) => (
                        <span key={zIdx} className="badge bg-secondary text-white font-monospace">{zone}</span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* GALLERY COMPONENT (Bounded by Tier structural values) */}
              {listing.photos?.length > 0 && (
                <div className="listing-gallery mt-4">
                  <h4 className="border-bottom pb-2">Business Showcase Gallery</h4>
                  <Row>
                    {listing.photos.map((img, i) => (
                      <Col md={4} sm={6} xs={12} key={i} className="mb-3">
                        <div className="gallery-item-wrapper" onClick={() => { setSelectedImage(img.url); setShowGalleryModal(true); }}>
                          <img src={`${API_BASE}/${img.url}`} alt={img.alt || `${listing.shopName}-${i}`} className="gallery-img rounded shadow-sm w-100" style={{ height: "160px", objectFit: "cover" }} />
                        </div>
                      </Col>
                    ))}
                  </Row>
                </div>
              )}

              {/* REVIEWS GRID AND HISTORY */}
              <hr />
              <div className="review-list mt-3">
                <div className="review-summary mb-3 p-3 rounded border bg-light d-flex align-items-center gap-3">
                  <div className="display-4 font-weight-bold text-warning">{averageRating()}</div>
                  <div>
                    <div className="d-flex text-warning fs-5">{renderAvgStarsCal(averageRating())}</div>
                    <div className="text-muted small">{reviews.length} authenticated consumer review(s)</div>
                  </div>
                </div>

                <h5 className="section-sub-header py-2 bg-light text-center border-top border-bottom">Customer Reviews</h5>
                {reviews.length === 0 ? (
                  <p className="text-muted my-3">No dynamic reviews logged yet. Be the first to express feedback.</p>
                ) : (
                  reviews.map((r) => (
                    <div key={r._id} className="review-item border-bottom py-3">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="fw-bold text-dark">{r.userName}</span>
                        <span className="text-muted text-sm">{new Date(r.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="text-warning mb-2">{renderStarsCal(r.rating)}</div>
                      <p className="review-comment text-secondary font-sans">{r.comment}</p>
                      {r.photos && r.photos.length > 0 && (
                        <div className="review-attached-media d-flex gap-2 flex-wrap mt-2">
                          {r.photos.map((item, index) => (
                            <img key={index} width={140} className="img-thumbnail rounded" src={`${API_BASE}/${item}`} alt={`Review-Attachment-${index}`} />
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </Col>

            {/* SIDE PANEL INFRASTRUCTURE */}
            <Col lg={4} md={12} className="bg-grey-panel">
              <div className="sticky-sidebar-block p-3 bg-white rounded shadow-sm border mb-4">
                <h5 className="panel-title py-2 mb-3 bg-light text-center rounded border">Contact Details</h5>
                <ul className="list-unstyled listing-contact-list text-muted">
                  <li className="mb-2">
                    <strong>Phone:</strong>{" "}
                    {!showPhone ? (
                      <Button size="sm" variant="outline-primary" onClick={handleShowPhone} disabled={isTracking}>
                        {isTracking ? "Tracking..." : "Show Number"}
                      </Button>
                    ) : (
                      <a href={`tel:${listing.phone}`} className="fw-bold text-primary ms-1">{listing.phone}</a>
                    )}
                  </li>
                  
                  <li className="mb-2">
                    <strong>Email:</strong>{" "}
                    <a href={`mailto:${listing.email}`} className="text-decoration-none">{listing.email}</a>
                  </li>
                  
                  <li className="mb-2">
                    <strong>Address:</strong> <span className="text-dark">{listing.address}</span>
                  </li>
                  
                  <li className="mb-2">
                    <strong>Location City:</strong> <span className="text-dark">{listing.city?.city}, {listing.country}</span>
                  </li>
                  
                  {listing.mapUrl && listing.mapUrl.trim() !== "" && (
                    <li className="mb-2">
                      <strong>Website:</strong>{" "}
                      {!showUrl ? (
                        <Button size="sm" variant="outline-secondary" onClick={handleShowUrl} disabled={urlIsTracking}>
                          Show Website URL
                        </Button>
                      ) : (
                        <a href={listing.mapUrl} target="_blank" rel="noopener noreferrer" className="word-break-all text-sm">{listing.mapUrl}</a>
                      )}
                    </li>
                  )}

                  {/* Business Hours Matrix */}
                  <li className="mt-3">
                    <strong>Working Hours:</strong>
                    <div className="mt-2 p-2 bg-light rounded text-sm font-monospace border">
                      {listing.businessHours?.length > 0 ? (
                        listing.businessHours.map((bh, idx) => (
                          <div key={idx} className="d-flex justify-content-between py-1 border-bottom-dashed">
                            <span className="text-capitalize">{bh.day}</span>
                            <span>{bh.closed ? <span className="text-danger">Closed</span> : `${bh.open} - ${bh.close}`}</span>
                          </div>
                        ))
                      ) : (
                        <span className="text-muted">Not specified</span>
                      )}
                    </div>
                  </li>
                </ul>

                {/* WhatsApp Click-to-Chat Interactions Block (Featured & Premium plans) */}
                {isFeaturedTier && listing.whatsappNumber && (
                  <div className="whatsapp-action-wrapper mt-3">
                    {listingTier === "premium_verified" && listing.enableQuoteViaWhatsapp ? (
                      <Button variant="success" className="w-100 d-flex align-items-center justify-content-center gap-2 py-2" href={`https://wa.me/${listing.whatsappNumber}?text=Hi%20${encodeURIComponent(listing.shopName)},%20I%20would%20like%20to%20request%20a%20formal%20quote%20for%20your%20services.`} target="_blank">
                        <FaWhatsapp size={20}/> Request a Quote
                      </Button>
                    ) : (
                      <Button variant="outline-success" className="w-100 d-flex align-items-center justify-content-center gap-2 py-2" href={`https://wa.me/${listing.whatsappNumber}`} target="_blank">
                        <FaWhatsapp size={20}/> Chat via WhatsApp
                      </Button>
                    )}
                  </div>
                )}

                {/* Social Direct Anchors Matrix (Featured & Premium) */}
                {isFeaturedTier && listing.socialAnchors && (
                  <div className="social-anchors-matrix d-flex justify-content-center gap-3 mt-3 pt-3 border-top">
                    {listing.socialAnchors.facebook && <a href={listing.socialAnchors.facebook} target="_blank" rel="noopener noreferrer" className="text-primary fs-4"><FaFacebook/></a>}
                    {listing.socialAnchors.instagram && <a href={listing.socialAnchors.instagram} target="_blank" rel="noopener noreferrer" className="text-danger fs-4"><FaInstagram/></a>}
                    {listing.socialAnchors.twitter && <a href={listing.socialAnchors.twitter} target="_blank" rel="noopener noreferrer" className="text-info fs-4"><FaTwitter/></a>}
                  </div>
                )}

                {/* Claim System Routing Check */}
                {listing.created_by_type === "admin" && !listing.isClaimed && (
                  <Button variant="warning" className="w-100 mt-3 fw-bold text-dark shadow-sm" onClick={() => navigate(`/claim/${listing.slug}`)}>
                    Claim this business
                  </Button>
                )}
              </div>

              {/* SIDE FORM REVIEW BOX */}
              <div className="review-submission-form-box p-3 bg-white rounded shadow-sm border">
                <h5 className="panel-title py-2 mb-3 bg-light text-center rounded border">Write Review</h5>
                {alert.show && (
                  <Alert ref={alertRef} variant={alert.type} onClose={() => setAlert({ show: false })} dismissible>
                    {alert.message}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3 text-center">
                    <Form.Label className="fw-bold">Rating <span className="text-danger">*</span></Form.Label>
                    <div>{renderStars()}</div>
                  </Form.Group>

                  {!user && (
                    <>
                      <Form.Group className="mb-2">
                        <Form.Label className="small text-muted">Your Name <span className="text-danger">*</span></Form.Label>
                        <Form.Control type="text" placeholder="Enter name" value={userName} onChange={(e) => setUserName(e.target.value)} required />
                      </Form.Group>
                      <Form.Group className="mb-2">
                        <Form.Label className="small text-muted">Your Email <span className="text-danger">*</span></Form.Label>
                        <Form.Control type="email" placeholder="Enter email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} required />
                      </Form.Group>
                    </>
                  )}

                  <Form.Group className="mb-3">
                    <Form.Label className="small text-muted">Upload Photos [Optional]</Form.Label>
                    <Form.Control type="file" name="photos" multiple accept="image/*" onChange={handleFileChange} ref={fileInputRef} />
                    <Form.Text className="text-muted d-block small mt-1">Images must be under 2MB each.</Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-2">
                    <Form.Label className="small text-muted">Comment <span className="text-danger">*</span></Form.Label>
                    <Form.Control as="textarea" rows={3} placeholder="Write your review details..." value={comment} onChange={(e) => setComment(e.target.value)} required maxLength={300} />
                  </Form.Group>
                  <div className="text-end text-muted text-xs mb-3">{comment.length}/300 chars</div>

                  <Button variant="primary" type="submit" className="w-100" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Review"}
                  </Button>
                </Form>
              </div>
            </Col>
          </Row>

          {/* ================= ACTIVE OFFERS / ANNOUNCEMENTS MATRIX (Tier Restricted) ================= */}
          {listingTier !== "free" && offers.length > 0 && (() => {
            const indexOfLastOffer = currentPage * offersPerPage;
            const indexOfFirstOffer = indexOfLastOffer - offersPerPage;
            const currentOffers = offers.slice(indexOfFirstOffer, indexOfLastOffer);
            const totalPages = Math.ceil(offers.length / offersPerPage);

            return (
              <div className="listing-offers-section mt-5 border-top pt-4 mb-4">
                <h3 className="mb-4 text-dark font-sans d-flex align-items-center gap-2">
                  <span className="blob-pulse-indicator"></span> Active Offers & Announcements
                </h3>
                <Row>
                  {currentOffers.map((offer) => {
                    const currentImgIdx = carouselIndices[offer._id] || 0;
                    const currentMedia = offer.media && offer.media[currentImgIdx];
                    const encodedId = btoa(offer._id);
                    const getMediaUrl = (url) => url ? (url.startsWith('http') ? url : `${API_BASE}/${url}`) : '';

                    return (
                      <Col md={6} key={offer._id} className="mb-4">
                        <Link to={`/offers?ref=${encodedId}`} className="text-decoration-none" style={{ display: 'block', height: '100%' }}>
                          <div className="card h-100 shadow-sm border-0 offer-card-hover" style={{ borderRadius: "12px", overflow: "hidden" }}>
                            <div className="position-relative bg-dark" style={{ aspectRatio: '16/9', overflow: "hidden", width: "100%" }} onClick={(e) => { if (offer.media?.length > 1) e.stopPropagation(); }}>
                              {offer.media && offer.media.length > 0 && currentMedia ? (
                                <>
                                  {currentMedia.type === 'image' ? (
                                    <img src={getMediaUrl(currentMedia.url)} alt={offer.title} className="w-100 h-100 position-absolute top-0 start-0" style={{ objectFit: 'cover' }} />
                                  ) : (
                                    <video src={getMediaUrl(currentMedia.url)} className="w-100 h-100 position-absolute top-0 start-0" style={{ objectFit: 'cover' }} controls muted loop playsInline />
                                  )}
                                  {offer.media.length > 1 && (
                                    <>
                                      <Button onClick={(e) => { e.preventDefault(); e.stopPropagation(); moveCarousel(offer._id, 'prev', offer.media.length); }} variant="light" className="position-absolute start-0 top-50 translate-middle-y m-2 rounded-circle d-flex align-items-center justify-content-center shadow-sm p-0 border-0" style={{ width: '32px', height: '32px', backgroundColor: 'rgba(250,250,250,0.85)', zIndex: 10 }}>
                                        <BiChevronLeft size={22} style={{ color: '#000000' }} />
                                      </Button>
                                      <Button onClick={(e) => { e.preventDefault(); e.stopPropagation(); moveCarousel(offer._id, 'next', offer.media.length); }} variant="light" className="position-absolute end-0 top-50 translate-middle-y m-2 rounded-circle d-flex align-items-center justify-content-center shadow-sm p-0 border-0" style={{ width: '32px', height: '32px', backgroundColor: 'rgba(250,250,250,0.85)', zIndex: 10 }}>
                                        <BiChevronRight size={22} style={{ color: '#000000' }} />
                                      </Button>
                                    </>
                                  )}
                                </>
                              ) : (
                                <img src={dummyImage} alt="Placeholder" className="w-100 h-100" style={{ objectFit: 'cover' }} />
                              )}
                            </div>
                            <div className="card-body p-3">
                              <h5 className="card-title text-truncate text-dark mb-1">{offer.title}</h5>
                              <p className="card-text text-muted text-sm line-clamp-2 mb-0">{offer.description}</p>
                            </div>
                          </div>
                        </Link>
                      </Col>
                    );
                  })}
                </Row>

                {/* Offer Pagination Controls Container */}
                {totalPages > 1 && (
                  <div className="d-flex justify-content-center align-items-center gap-3 mt-3">
                    <Button size="sm" variant="outline-primary" disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>Previous</Button>
                    <span className="small text-muted font-monospace">Page {currentPage} of {totalPages}</span>
                    <Button size="sm" variant="outline-primary" disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)}>Next</Button>
                  </div>
                )}
              </div>
            );
          })()}
        </Container>

        {/* GALLERY MODAL PREVIEW */}
        <Modal show={showGalleryModal} onHide={() => setShowGalleryModal(false)} centered size="lg">
          <Modal.Body className="p-0 bg-black">
            <img src={`${API_BASE}/${selectedImage}`} alt="Showcase structural preview" className="w-100" style={{ maxHeight: "85vh", objectFit: "contain" }} />
          </Modal.Body>
        </Modal>
      </section>
    </>
  );
};

export default ListingDetailPage;