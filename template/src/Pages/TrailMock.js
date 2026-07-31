import React, { useState, useEffect } from "react";
import { 
  FaStar, FaWhatsapp, FaFacebook, FaInstagram, FaTwitter, FaMapMarkerAlt, 
  FaShieldAlt, FaCheckCircle, FaEnvelope, FaClock, FaTags, FaAngleLeft, 
  FaAngleRight, FaBookmark, FaPhoneAlt, FaDirections, FaGlobe, FaAward, 
  FaCheck, FaVideo, FaCommentDots, FaCar, FaSnowflake, FaTruck, 
  FaWheelchair, FaCouch, FaPlay, FaInfoCircle, FaConciergeBell, FaImages, FaComments, FaBullhorn
} from "react-icons/fa";
import { Form, Container, Row, Col, Modal, Badge, Nav, Tab } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { incrementListingViews } from "../utils/engagementTracker";
import { Helmet } from "react-helmet-async";
import ReactPaginate from 'react-paginate';

// Ultra-Clean Modern Light Stylesheet with Custom Tab Styling
const STYLES = `
  
  
  .map-container-wrapper {
    width: 100%;
    border-top: 1px solid #e2e8f0;
    overflow: hidden;
    position: relative;
    background-color: #f8fafc;
  }

  .map-container-wrapper iframe {
    transition: transform 0.3s ease;
  }

  .clean-white-block:hover .map-container-wrapper iframe {
    transform: scale(1.01);
  }

  /* Custom Tab Styling */
  .custom-detail-tabs .nav-link {
    // font-family: 'Space Grotesk', sans-serif;
    font-weight: 600;
    color: #64748b;
    border: none;
    border-bottom: 2px solid transparent;
    padding: 12px 20px;
    background: transparent;
    transition: all 0.2s ease;
    border-radius: 0;
  }

  .custom-detail-tabs .nav-link:hover {
    color: #ff4e00;
    border-color: rgba(255, 78, 0, 0.3);
  }

  .custom-detail-tabs .nav-link.active {
    color: #ff4e00 !important;
    background: transparent !important;
    border-bottom: 2px solid #ff4e00 !important;
  }

  /* Premium React-Paginate Styles */
  .clean-paginate-container {
    display: flex;
    padding-left: 0;
    list-style: none;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-top: 1.5rem;
  }

  .clean-paginate-item {
    // font-family: 'Space Grotesk', sans-serif;
    font-weight: 600;
    font-size: 0.85rem;
  }

  .clean-paginate-link {
    display: block;
    padding: 8px 16px;
    color: #475569;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    text-decoration: none;
    transition: all 0.2s ease;
    cursor: pointer;
  }

  .clean-paginate-item:hover:not(.disabled) .clean-paginate-link {
    border-color: #ff4e00;
    color: #ff4e00;
    transform: translateY(-1px);
  }

  .clean-paginate-item.active .clean-paginate-link {
    background: #ff4e00;
    color: #ffffff;
    border-color: #ff4e00;
  }

  .clean-paginate-item.disabled .clean-paginate-link {
    opacity: 0.5;
    cursor: not-allowed;
    background: #f8fafc;
  }

  .clean-paginate-break .clean-paginate-link {
    border: none;
    background: transparent;
    cursor: default;
  }

  .aesthetic-detail-page {
    background-color: #fafbfe;
    // font-family: 'Plus Jakarta Sans', sans-serif;
    color: #475569;
    padding-bottom: 6rem;
    letter-spacing: -0.01em;
  }
  
  .headline-font {
    // font-family: 'Space Grotesk', sans-serif;
  }

  .premium-monolith-header {
    height: 420px;
    background-size: cover;
    background-position: center;
    position: relative;
    border-bottom: 1px solid #e2e8f0;
  }
  
  .premium-monolith-header::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0) 20%, rgba(250, 251, 254, 0.95) 100%);
  }

  .hero-absolute-cluster {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 2;
    padding-bottom: 2rem;
  }

  .clean-white-block {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    padding: 2.2rem;
    position: relative;
    box-shadow: 0 4px 20px rgba(148, 163, 184, 0.05);
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .clean-white-block:hover {
    border-color: rgba(255, 78, 0, 0.3);
    box-shadow: 0 10px 30px rgba(255, 78, 0, 0.04);
  }

  .cyber-badge-premium {
    background: #fff5f0;
    color: #ff4e00;
    border: 1px solid rgba(255, 78, 0, 0.2);
    // font-family: 'Space Grotesk', sans-serif;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    padding: 6px 14px;
    border-radius: 6px;
  }

  .tag-pet-pill {
    background: #ffffff;
    color: #1e293b;
    border: 1px solid #e2e8f0;
    padding: 6px 16px;
    border-radius: 8px;
    font-size: 0.85rem;
    font-weight: 500;
    transition: all 0.2s;
  }

  .tag-pet-pill:hover {
    border-color: #ff4e00;
    color: #ff4e00;
  }

  .clean-accent-label {
    // font-family: 'Space Grotesk', sans-serif;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    font-weight: 700;
    color: #ff4e00;
    margin-bottom: 1rem;
    display: block;
  }

  .gallery-clean-frame {
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid #e2e8f0;
    transition: all 0.3s ease;
  }

  .gallery-clean-frame:hover {
    border-color: #ff4e00;
    transform: translateY(-2px);
  }

  .hours-matrix-row {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid #f1f5f9;
    font-size: 0.9rem;
  }

  .hours-matrix-row:last-child {
    border-bottom: none;
  }

  .clean-input-field {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    color: #1e293b;
    border-radius: 8px;
    padding: 12px;
    transition: all 0.2s;
  }

  .clean-input-field:focus {
    background: #ffffff;
    border-color: #ff4e00;
    box-shadow: 0 0 0 3px rgba(255, 78, 0, 0.1);
  }

  .btn-clean-primary {
    background: #ff4e00;
    color: #ffffff;
    // font-family: 'Space Grotesk', sans-serif;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border: none;
    border-radius: 8px;
    padding: 12px 20px;
    transition: all 0.3s;
    font-size: 14px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .btn-clean-primary:hover {
    background: #1e293b;
    color: #ffffff;
    box-shadow: 0 8px 24px rgba(255, 78, 0, 0.2);
  }

  .btn-clean-outline {
    background: #ffffff;
    color: #1e293b;
    border: 1px solid #e2e8f0;
    // font-family: 'Space Grotesk', sans-serif;
    font-weight: 600;
    border-radius: 8px;
    padding: 12px 20px;
    transition: all 0.3s;
    font-size: 14px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .btn-clean-outline:hover {
    border-color: #ff4e00;
    color: #ff4e00;
    background: #fff5f0;
  }

  .social-clean-btn {
    width: 42px;
    height: 42px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    background: #ffffff;
    color: #64748b;
    border: 1px solid #e2e8f0;
    transition: all 0.2s;
  }

  .social-clean-btn:hover {
    border-color: #ff4e00;
    color: #ff4e00;
    background: #fff5f0;
    transform: translateY(-2px);
  }

  .live-glow-dot {
    width: 8px;
    height: 8px;
    background: #22c55e;
    border-radius: 50%;
    box-shadow: 0 0 8px rgba(34, 197, 94, 0.6);
    display: inline-block;
  }

  .amenity-chip {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    font-size: 0.88rem;
    font-weight: 500;
    color: #334155;
  }

  .amenity-chip.available {
    border-color: rgba(34, 197, 94, 0.3);
    background: #f0fdf4;
    color: #166534;
  }

  .stat-card {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 1rem;
    text-align: center;
  }
`;

const MOCK_LISTING_DETAILS = {
  _id: "mock_listing_99881122",
  slug: "trail_a_broad",
  shopName: "Tails A'Board",
  plan: "premium_verified",
  isFeatured: true,
  isPremiumBadge: true,
  isVerified: true,
  isClaimed: true,
  created_by_type: "admin",
  description: "Tails A'Board offers executive-tier tech-corridor pet care solutions, delivering secure overnight stays and flexible crèche options near Guindy. Featuring a high staff-to-pet ratio and rapid access to major transit links, they provide a convenient and professional corporate pet-sitting experience.",
  phone: "+919874563210",
  email: "care@pawsandclaws-premium.com",
  address: "35/2A, Nellithoppu main road, Kozhumanivakkam, Mangadu, Chennai, Tamil Nadu 600122",
  country: "India",
  city: { city: "Chennai" },
  mapUrl: "https://maps.app.goo.gl/pUAhNHuTw4uLPz3F9",
  directionsUrl: "https://maps.google.com/?q=35/2A,+Nellithoppu+main+road,+Kozhumanivakkam,+Mangadu,+Chennai",
  bannerImage: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=600",
  whatsappNumber: "9874563210",
  enableQuoteViaWhatsapp: true,
  websiteUrl: "https://www.vetandpets.in",
  
  yearsInBusiness: "8+ Years",
  customersServed: "1,500+ Pets",
  certifications: ["ISO 9001:2015 Pet Care Standard", "Certified Veterinary Assistant on-site", "First Aid Certified"],
  languagesSpoken: ["English", "Tamil", "Hindi"],
  
  petCategories: [{ categoryName: "Dogs" }, { categoryName: "Cats" }, { categoryName: "Small Animals" }],
  categories: [{ categoryName: "Pet Boarding Services" }, { categoryName: "Pet Grooming" }],
  specializedServices: [
    { serviceName: "Executive Suites Boarding" },
    { serviceName: "Day Crèche & Playcare" },
    { serviceName: "Medication Administration" },
    { serviceName: "Hydrotherapy Sessions" }
  ],

  amenities: {
    parking: true,
    acFacility: true,
    homePickup: true,
    onlineConsultation: true,
    wheelchairAccess: true,
    petFriendlySeating: true,
    homeVisit: false
  },

  isOpenNow: true,
  appointmentRequired: true,
  responseTime: "Within 2 Hours",
  pricing: {
    startingFrom: "₹650",
    paymentMethods: ["UPI / GPay", "Credit/Debit Cards", "Cash", "Net Banking"]
  },
  
  serviceCoverage: {
    type: "radius",
    radiusKm: 25,
    neighborhoods: ["Guindy", "Mangadu", "Porur", "Vadapalani"]
  },
  
  businessHours: [
    { day: "monday", open: "08:00 AM", close: "08:00 PM", closed: false },
    { day: "tuesday", open: "08:00 AM", close: "08:00 PM", closed: false },
    { day: "wednesday", open: "08:00 AM", close: "08:00 PM", closed: false },
    { day: "thursday", open: "08:00 AM", close: "08:00 PM", closed: false },
    { day: "friday", open: "08:00 AM", close: "10:00 PM", closed: false },
    { day: "saturday", open: "09:00 AM", close: "06:00 PM", closed: false },
    { day: "sunday", open: "00:00 AM", close: "00:00 AM", closed: true }
  ],
  
  socialAnchors: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com"
  },
  
  photos: [
    { url: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=600", alt: "Lab" },
    { url: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=600", alt: "Suites" },
    { url: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&q=80&w=600", alt: "Grooming" }
  ],

  videos: [
    { url: "https://www.w3schools.com/html/mov_bbb.mp4", title: "Virtual Facility Tour", thumbnail: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=600" }
  ]
};

const MOCK_REVIEWS = [
  {
    _id: "rev_01",
    userName: "Sarah Jenkins",
    created_at: "2026-06-14T10:30:00.000Z",
    rating: 5,
    comment: "Dr. Alistair and the nursing crew saved my golden retriever after an accidental poisoning incident. The communication level was phenomenal, and the cost structure was highly transparent. Truly an elite facility.",
    ownerResponse: {
      responded_at: "2026-06-14T14:00:00.000Z",
      comment: "Thank you Sarah! We are so glad to hear your Golden is thriving and back to full health."
    }
  }
];

const MOCK_OFFERS = [
  {
    _id: "off_01",
    title: "Annual Pet Boarding - 25% Off",
    description: "Tails A'Board offers executive-tier tech-corridor pet care solutions, delivering secure overnight stays and flexible crèche options near Guindy.",
    media: [{ type: "image", url: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=600" }]
  },
  {
    _id: "off_02",
    title: "Complimentary Hydrotherapy Trial",
    description: "Book 3 consecutive days of premium boarding and get a free hydrotherapy session for your dog.",
    media: [{ type: "image", url: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&q=80&w=600" }]
  }
];

const ListingDetailPage = () => {
  const { user } = useAuth();
  const [listing] = useState(MOCK_LISTING_DETAILS);
  const [reviews, setReviews] = useState(MOCK_REVIEWS);
  const [offers] = useState(MOCK_OFFERS);
  
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewerName, setReviewerName] = useState("");
  const [reviewerEmail, setReviewerEmail] = useState("");
  const [showPhone, setShowPhone] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  // Gallery Modals
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Pagination for Offers
  const [currentOfferPage, setCurrentOfferPage] = useState(1);
  const offersPerPage = 2;

  const indexOfLastOffer = currentOfferPage * offersPerPage;
  const indexOfFirstOffer = indexOfLastOffer - offersPerPage;
  const currentOffersSlice = offers.slice(indexOfFirstOffer, indexOfLastOffer);
  const totalOfferPages = Math.ceil(offers.length / offersPerPage);

  useEffect(() => {
    incrementListingViews();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rating) return;
    const newReview = {
      _id: `rev_${Date.now()}`,
      userName: reviewerName || user?.name || "Anonymous Guest",
      created_at: new Date().toISOString(),
      rating: rating,
      comment: comment
    };
    setReviews([newReview, ...reviews]);
    setComment("");
    setReviewerName("");
    setReviewerEmail("");
    setRating(0);
  };

  return (
    <div className="aesthetic-detail-page">
      <style>{STYLES}</style>
      <Helmet>
        <title>{listing.shopName}</title>
      </Helmet>

      {/* HEADER SECTION */}
      <div className="premium-monolith-header" style={{ backgroundImage: `url(${listing.bannerImage})` }}>
        <div className="hero-absolute-cluster">
          <Container>
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
              <div>
                <div className="mb-2 d-flex gap-2">
                  <span className="cyber-badge-premium"><FaShieldAlt className="me-1"/> Verified</span>
                  <span className="cyber-badge-premium"><FaTags className="me-1"/> Featured</span>
                </div>
                <h1 className="text-dark headline-font fw-bold display-5 mb-0" style={{ letterSpacing: "-0.03em" }}>{listing.shopName}</h1>
              </div>

              {/* QUICK ACTION BAR */}
              <div className="d-flex flex-wrap gap-2">
                <button 
                  className={`btn ${isSaved ? 'btn-danger' : 'btn-clean-outline'}`}
                  onClick={() => setIsSaved(!isSaved)}
                >
                  <FaBookmark /> {isSaved ? 'Saved' : 'Save'}
                </button>
                <a href={`tel:${listing.phone}`} className="btn-clean-outline">
                  <FaPhoneAlt /> Call
                </a>
                {listing.whatsappNumber && (
                  <a href={`https://wa.me/${listing.whatsappNumber}`} target="_blank" rel="noreferrer" className="btn-clean-primary" style={{ background: '#22c55e' }}>
                    <FaWhatsapp /> WhatsApp
                  </a>
                )}
                <a href={listing.directionsUrl} target="_blank" rel="noreferrer" className="btn-clean-outline">
                  <FaDirections /> Directions
                </a>
                <a href={listing.websiteUrl} target="_blank" rel="noreferrer" className="btn-clean-outline">
                  <FaGlobe /> Website
                </a>
              </div>
            </div>
          </Container>
        </div>
      </div>

      <Container className="mt-4">
        <Row className="g-4">
          {/* LEFT MAIN CONTENT */}
          <Col lg={8}>
            {/* PET CATEGORIES & AVAILABILITY */}
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-4">
              <div className="d-flex flex-wrap gap-2">
                {listing.petCategories?.map((cat, i) => (
                  <span className="tag-pet-pill" key={i}>{cat.categoryName}</span>
                ))}
              </div>
              <div className="d-flex align-items-center gap-2 font-monospace small">
                <span className="live-glow-dot"></span> 
                <span className="text-success fw-bold">{listing.isOpenNow ? "OPEN NOW" : "CLOSED"}</span>
              </div>
            </div>

            {/* TAB CONTAINER */}
            <Tab.Container defaultActiveKey="overview">
              <div className="border-bottom border-light mb-4 bg-white rounded p-1 border">
                <Nav className="custom-detail-tabs d-flex flex-row flex-nowrap overflow-auto">
                  <Nav.Item>
                    <Nav.Link eventKey="overview" className="d-flex align-items-center gap-2">
                      <FaInfoCircle /> Overview
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="services" className="d-flex align-items-center gap-2">
                      <FaConciergeBell /> Services & Amenities
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="gallery" className="d-flex align-items-center gap-2">
                      <FaImages /> Gallery
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="reviews" className="d-flex align-items-center gap-2">
                      <FaComments /> Reviews ({reviews.length})
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </div>

              <Tab.Content>
                {/* OVERVIEW TAB */}
                <Tab.Pane eventKey="overview">
                  <div className="clean-white-block mb-4">
                    <span className="clean-accent-label">Overview & About</span>
                    <p className="mb-4">{listing.description}</p>

                    <Row className="g-3 mb-4">
                      <Col sm={6}>
                        <div className="stat-card">
                          <span className="d-block text-muted small">Experience</span>
                          <strong className="fs-5 text-dark headline-font">{listing.yearsInBusiness}</strong>
                        </div>
                      </Col>
                      <Col sm={6}>
                        <div className="stat-card">
                          <span className="d-block text-muted small">Customers Served</span>
                          <strong className="fs-5 text-dark headline-font">{listing.customersServed}</strong>
                        </div>
                      </Col>
                    </Row>

                    {/* CERTIFICATIONS & LANGUAGES */}
                    <Row className="g-4 border-top border-light pt-4">
                      {listing.certifications?.length > 0 && (
                        <Col md={6}>
                          <span className="clean-accent-label"><FaAward className="me-1"/> Certifications</span>
                          <ul className="list-unstyled mb-0 small">
                            {listing.certifications.map((cert, i) => (
                              <li key={i} className="mb-1 text-dark d-flex align-items-center gap-2">
                                <FaCheck className="text-success" /> {cert}
                              </li>
                            ))}
                          </ul>
                        </Col>
                      )}
                      {listing.languagesSpoken?.length > 0 && (
                        <Col md={6}>
                          <span className="clean-accent-label">Languages Spoken</span>
                          <div className="d-flex flex-wrap gap-1">
                            {listing.languagesSpoken.map((lang, i) => (
                              <Badge key={i} bg="light" text="dark" className="border px-2 py-1 font-monospace">{lang}</Badge>
                            ))}
                          </div>
                        </Col>
                      )}
                    </Row>
                  </div>
                </Tab.Pane>

                {/* SERVICES & AMENITIES TAB */}
                <Tab.Pane eventKey="services">
                  <div className="clean-white-block mb-4">
                    
                    <Row className="g-4">
                      
                      {listing.categories?.length > 0 && (
                        <Col md={6}>
                          <span className="clean-accent-label">Categories</span>
                          {/* <span className="text-muted small d-block mb-2 font-monospace">Core Categories</span> */}
                          <div className="d-flex flex-wrap gap-2">
                            {listing.categories.map((c, i) => <span key={i} className="badge bg-light border text-dark px-3 py-2 rounded font-monospace">{c.categoryName}</span>)}
                          </div>
                        </Col>
                      )}
                      {listing.specializedServices?.length > 0 && (
                        <Col md={6}>
                          <span className="clean-accent-label">Specialized Services</span>
                          {/* <span className="text-muted small d-block mb-2 font-monospace">Specialized Services</span> */}
                          <div className="d-flex flex-column gap-2">
                            {listing.specializedServices.map((s, i) => <span key={i} className="d-block" style={{fontSize: "14px"}}> <FaCheck /> {s.serviceName}</span>)}
                          </div>
                        </Col>
                      )}
                    </Row>

                    {/* AMENITIES */}
                    <div className="mt-4 pt-4 border-top border-light">
                      <span className="clean-accent-label">Amenities</span>
                      <Row className="g-2">
                        <Col md={4} sm={6}>
                          <div className={`amenity-chip ${listing.amenities?.parking ? 'available' : ''}`}>
                            <FaCar /> Parking {listing.amenities?.parking ? 'Available' : 'N/A'}
                          </div>
                        </Col>
                        <Col md={4} sm={6}>
                          <div className={`amenity-chip ${listing.amenities?.acFacility ? 'available' : ''}`}>
                            <FaSnowflake /> Climate Controlled / AC
                          </div>
                        </Col>
                        <Col md={4} sm={6}>
                          <div className={`amenity-chip ${listing.amenities?.homePickup ? 'available' : ''}`}>
                            <FaTruck /> Home Pickup & Drop
                          </div>
                        </Col>
                        <Col md={4} sm={6}>
                          <div className={`amenity-chip ${listing.amenities?.onlineConsultation ? 'available' : ''}`}>
                            <FaVideo /> Online Vet Consults
                          </div>
                        </Col>
                        <Col md={4} sm={6}>
                          <div className={`amenity-chip ${listing.amenities?.wheelchairAccess ? 'available' : ''}`}>
                            <FaWheelchair /> Wheelchair Accessible
                          </div>
                        </Col>
                        <Col md={4} sm={6}>
                          <div className={`amenity-chip ${listing.amenities?.petFriendlySeating ? 'available' : ''}`}>
                            <FaCouch /> Pet-Friendly Seating
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </Tab.Pane>

                {/* GALLERY TAB */}
                <Tab.Pane eventKey="gallery">
                  <div className="clean-white-block mb-4">
                    <span className="clean-accent-label">Gallery & Media</span>
                    
                    {/* Photos */}
                    {listing.photos?.length > 0 && (
                      <div className="mb-4">
                        <span className="text-muted small d-block mb-2 font-monospace">Photos</span>
                        <Row className="g-3">
                          {listing.photos.map((img, i) => (
                            <Col md={4} sm={6} key={i}>
                              <div className="gallery-clean-frame" onClick={() => { setSelectedImage(img.url); setShowGalleryModal(true); }}>
                                <img src={img.url} alt={img.alt} className="w-100" style={{ height: "140px", objectFit: "cover", cursor: "pointer" }} />
                              </div>
                            </Col>
                          ))}
                        </Row>
                      </div>
                    )}

                    {/* Videos */}
                    {listing.videos?.length > 0 && (
                      <div className="pt-3 border-top border-light">
                        <span className="text-muted small d-block mb-2 font-monospace">Videos (Premium)</span>
                        <Row className="g-3">
                          {listing.videos.map((vid, i) => (
                            <Col md={6} key={i}>
                              <div 
                                className="gallery-clean-frame position-relative" 
                                style={{ cursor: 'pointer' }}
                                onClick={() => { setSelectedVideo(vid.url); setShowVideoModal(true); }}
                              >
                                <img src={vid.thumbnail} alt={vid.title} className="w-100" style={{ height: "160px", objectFit: "cover" }} />
                                <div className="position-absolute top-50 start-50 translate-middle bg-dark bg-opacity-75 rounded-circle p-3 text-white">
                                  <FaPlay size={20} />
                                </div>
                              </div>
                            </Col>
                          ))}
                        </Row>
                      </div>
                    )}
                  </div>
                </Tab.Pane>

                {/* REVIEWS TAB */}
                <Tab.Pane eventKey="reviews">
                  <div className="clean-white-block mb-4">
                    <span className="clean-accent-label">Customer Reviews</span>
                    {reviews.map((r, index) => (
                      <div key={r._id} className={`py-4 ${index !== reviews.length - 1 ? 'border-bottom border-light' : ''}`}>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <h6 className="fw-bold text-dark mb-0">{r.userName}</h6>
                          <span className="text-muted small font-monospace">{new Date(r.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="mb-2">
                          {Array.from({ length: 5 }).map((_, idx) => <FaStar key={idx} color={idx < r.rating ? "#ff4e00" : "#e2e8f0"} />)}
                        </div>
                        <p className="text-secondary mb-2 small">{r.comment}</p>

                        {/* Owner Response */}
                        {/* {r.ownerResponse && (
                          <div className="bg-light p-3 rounded border border-light mt-3">
                            <div className="d-flex align-items-center gap-2 mb-1">
                              <FaCommentDots style={{ color: '#ff4e00' }} />
                              <span className="fw-bold text-dark small">Response from Business Owner</span>
                            </div>
                            <p className="text-muted small mb-0">{r.ownerResponse.comment}</p>
                          </div>
                        )} */}
                      </div>
                    ))}
                  </div>
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>

            

            {/* OFFERS & FEEDS (MOVED UNDER LOCATION) */}
            {offers.length > 0 && (
              <div className="clean-white-block mb-4">
                <span className="clean-accent-label">
                  <FaBullhorn className="me-1" /> Offers & Feeds
                </span>
                
                <Row className="g-3">
                  {currentOffersSlice.map((offer) => (
                    <Col md={6} key={offer._id}>
                      <div className="border border-light rounded overflow-hidden h-100 bg-white">
                        <div style={{ aspectRatio: '16/9', overflow: 'hidden' }}>
                          <img src={offer.media[0].url} alt={offer.title} className="w-100 h-100" style={{ objectFit: 'cover' }} />
                        </div>
                        <div className="p-3">
                          <h6 className="text-dark headline-font fw-bold mb-1">{offer.title}</h6>
                          <p className="text-muted small mb-0 lh-relaxed">{offer.description}</p>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>

                {totalOfferPages > 1 && (
                  <ReactPaginate
                    previousLabel={<FaAngleLeft />}
                    nextLabel={<FaAngleRight/>}
                    breakLabel={"..."}
                    pageCount={totalOfferPages}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={3}
                    onPageChange={({ selected }) => setCurrentOfferPage(selected + 1)}
                    containerClassName={"clean-paginate-container"}
                    pageClassName={"clean-paginate-item"}
                    pageLinkClassName={"clean-paginate-link"}
                    previousClassName={"clean-paginate-item"}
                    previousLinkClassName={"clean-paginate-link"}
                    nextClassName={"clean-paginate-item"}
                    nextLinkClassName={"clean-paginate-link"}
                    breakClassName={"clean-paginate-item clean-paginate-break"}
                    breakLinkClassName={"clean-paginate-link"}
                    activeClassName={"active"}
                    disabledClassName={"disabled"}
                    forcePage={currentOfferPage - 1}
                  />
                )}
              </div>
            )}

            {/* GOOGLE MAP & LOCATION */}
            {listing.mapUrl && (
              <div className="clean-white-block mb-4 overflow-hidden p-0">
                <div className="p-4 pb-0 d-flex align-items-center justify-content-between">
                  <div>
                    <span className="clean-accent-label mb-2">
                      <FaMapMarkerAlt className="me-1" /> Location & Directions
                    </span>
                    <p className="text-muted small mb-0">{listing.address}</p>
                  </div>
                  <a href={listing.directionsUrl} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-secondary font-monospace">
                    Get Directions
                  </a>
                </div>

                <div className="map-container-wrapper mt-3">
                  <iframe
                    title={`${listing.shopName} Location`}
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(listing.address)}&t=m&z=15&ie=UTF8&iwloc=&output=embed`}
                    width="100%"
                    height="320"
                    style={{ border: 0, display: "block" }}
                    allowFullScreen=""
                    loading="lazy"
                  ></iframe>
                </div>
              </div>
            )}
          </Col>

          {/* RIGHT SIDEBAR PANELS */}
          <Col lg={4}>
            <div className="position-sticky" style={{ top: "2rem" }}>
              
              {/* PRICING & AVAILABILITY WIDGET */}
              <div className="clean-white-block mb-4">
                <span className="clean-accent-label">Pricing</span>
                <div className="p-3 bg-light rounded border border-light mb-3">
                  <span className="d-block text-muted small">Starting Price</span>
                  <span className="fs-4 fw-bold headline-font text-dark">{listing.pricing?.startingFrom}</span>
                </div>
                
                <div className="d-flex flex-column gap-2 small font-monospace mb-3">
                  <div><strong>Appointment:</strong> {listing.appointmentRequired ? "Required" : "Walk-ins Welcome"}</div>
                  <div><strong>Response Time:</strong> {listing.responseTime}</div>
                  <div><strong>Payment Methods:</strong> 
                    <div className="d-flex flex-wrap gap-1 mt-2">
                      {listing.pricing?.paymentMethods.map((pm, i) => (
                        <Badge bg="white" text="dark" className="border py-1 px-2 font-monospace" key={i}>{pm}</Badge>
                      ))}
                    </div> 
                  </div>
                </div>
                
              </div>

              {/* CONTACT DETAILS PANEL */}
              <div className="clean-white-block mb-4">
                <span className="headline-font fw-bold text-dark fs-5 d-block mb-3">Contact Details</span>

                <div className="mb-4 d-flex flex-column gap-2">
                  <button className="btn-clean-primary w-100" onClick={() => setShowPhone(!showPhone)}>
                    <FaPhoneAlt /> {showPhone ? listing.phone : "Show Phone Number"}
                  </button>
                  <a href={listing.websiteUrl} target="_blank" rel="noreferrer" className="btn-clean-outline w-100">
                    <FaGlobe /> Visit Official Website
                  </a>
                </div>

                <div className="d-flex flex-column gap-3 text-sm border-top border-light pt-4 font-monospace">
                  <div className="d-flex align-items-start gap-3">
                    <FaEnvelope style={{ color: '#ff4e00' }} className="mt-1"/>
                    <div>
                      <span className="d-block text-muted small">Email</span>
                      <span className="text-dark small fw-medium">{listing.email}</span>
                    </div>
                  </div>
                  <div className="d-flex align-items-start gap-3">
                    <FaMapMarkerAlt style={{ color: '#ff4e00' }} className="mt-1"/>
                    <div>
                      <span className="d-block text-muted small">Location</span>
                      <span className="text-dark small fw-medium">{listing.address}</span>
                    </div>
                  </div>
                </div>

                {/* SOCIAL MEDIA */}
                {listing.socialAnchors && (
                  <div className="mt-4 pt-4 border-top border-light">
                    <span className="clean-accent-label">Social Media</span>
                    <div className="d-flex gap-2 mt-2">
                      {listing.socialAnchors.facebook && (
                        <a href={listing.socialAnchors.facebook} target="_blank" rel="noreferrer" className="social-clean-btn">
                          <FaFacebook size={18} />
                        </a>
                      )}
                      {listing.socialAnchors.instagram && (
                        <a href={listing.socialAnchors.instagram} target="_blank" rel="noreferrer" className="social-clean-btn">
                          <FaInstagram size={18} />
                        </a>
                      )}
                      {listing.socialAnchors.twitter && (
                        <a href={listing.socialAnchors.twitter} target="_blank" rel="noreferrer" className="social-clean-btn">
                          <FaTwitter size={16} />
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* BUSINESS HOURS */}
                <div className="mt-4 pt-4 border-top border-light">
                  <span className="clean-accent-label"><FaClock className="me-1"/> Operating Hours</span>
                  <div className="p-2 rounded bg-light border border-light mt-2">
                    {listing.businessHours?.map((bh, idx) => (
                      <div key={idx} className="hours-matrix-row text-dark">
                        <span className="text-uppercase font-monospace small" style={{ color: '#64748b' }}>{bh.day.substring(0,3)}</span>
                        <span className="font-monospace small fw-medium">
                          {bh.closed ? <span className="text-danger">Closed</span> : `${bh.open} - ${bh.close}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* WRITE REVIEW FORM */}
              <div className="clean-white-block">
                <span className="clean-accent-label text-center">Write a Review</span>
                <Form onSubmit={handleSubmit}>
                  <div className="d-flex justify-content-center gap-2 mb-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <span key={i} style={{ fontSize: "1.8rem", cursor: "pointer", color: i <= rating ? "#ff4e00" : "#e2e8f0", transition: 'color 0.2s' }} onClick={() => setRating(i)}>★</span>
                    ))}
                  </div>
                  <Form.Group className="mb-3">
                    <Form.Control type="text" placeholder="Your Name" value={reviewerName} onChange={(e) => setReviewerName(e.target.value)} required className="clean-input-field" />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Control type="email" placeholder="Your Email" value={reviewerEmail} onChange={(e) => setReviewerEmail(e.target.value)} required className="clean-input-field" />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Control as="textarea" rows={3} placeholder="Describe your experience with the team..." value={comment} onChange={(e) => setComment(e.target.value)} required className="clean-input-field" />
                  </Form.Group>
                  <button type="submit" className="btn-clean-primary w-100 py-2.5">Submit Review</button>
                </Form>
              </div>

            </div>
          </Col>
        </Row>
      </Container>

      {/* PHOTO LIGHTBOX MODAL */}
      <Modal show={showGalleryModal} onHide={() => setShowGalleryModal(false)} centered size="lg">
        <Modal.Body className="p-0 bg-transparent rounded overflow-hidden border-0">
          <img src={selectedImage} alt="Preview" className="w-100" style={{ maxHeight: "80vh", objectFit: "contain" }} />
        </Modal.Body>
      </Modal>

      {/* VIDEO PLAYER MODAL */}
      <Modal show={showVideoModal} onHide={() => setShowVideoModal(false)} centered size="lg">
        <Modal.Body className="p-0 bg-black rounded overflow-hidden border-0">
          <video src={selectedVideo} controls autoPlay className="w-100" style={{ maxHeight: "80vh" }} />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ListingDetailPage;