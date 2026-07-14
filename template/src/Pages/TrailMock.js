// // import React, { useState, useEffect, useRef } from "react";
// // import { FaStar, FaStarHalfAlt, FaRegStar, FaWhatsapp, FaFacebook, FaInstagram, FaTwitter, FaMapMarkerAlt, FaShieldAlt, FaCheckCircle, FaAward } from "react-icons/fa";
// // import { Form, Button, Container, Row, Col, Alert, Modal } from "react-bootstrap";
// // import { useAuth } from "../contexts/AuthContext";
// // import { incrementListingViews } from "../utils/engagementTracker";
// // import { useEngagementGate } from "../hooks/useEngagementGate";
// // import AuthGateModal from "../hooks/AuthGateModel";
// // import { Helmet } from "react-helmet-async";
// // import { validateField } from "../utils/formValidation";
// // import { BiChevronLeft, BiChevronRight } from "react-icons/bi";

// // const API_BASE = "http://localhost:5000";
// // const dummyImage = "https://via.placeholder.com/600x400?text=No+Media+Available";

// // // Embedded Premium Stylesheet Injection (Drop-in ready)
// // const STYLES = `
// //   .stylish-detail-page {
// //     background-color: #f8fafc;
// //     font-family: 'Inter', -apple-system, sans-serif;
// //     color: #1e293b;
// //     padding-bottom: 5rem;
// //   }
// //   .hero-premium-banner {
// //     height: 400px;
// //     background-size: cover;
// //     background-position: center;
// //     position: relative;
// //     border-radius: 0 0 24px 24px;
// //     box-shadow: 0 10px 30px rgba(0,0,0,0.08);
// //   }
// //   .hero-overlay {
// //     background: linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%);
// //     border-radius: 0 0 24px 24px;
// //   }
// //   .glass-card {
// //     background: rgba(255, 255, 255, 0.9);
// //     backdrop-filter: blur(8px);
// //     border: 1px solid rgba(255,255,255,0.6);
// //     border-radius: 16px;
// //   }
// //   .badge-premium {
// //     background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
// //     color: #0f172a;
// //     font-weight: 600;
// //     letter-spacing: 0.05em;
// //   }
// //   .badge-verified {
// //     background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
// //     color: white;
// //   }
// //   .shop-title {
// //     font-weight: 800;
// //     letter-spacing: -0.02em;
// //     color: #0f172a;
// //     line-height: 1.2;
// //   }
// //   .category-pill {
// //     background: #eff6ff;
// //     color: #1d4ed8;
// //     padding: 6px 14px;
// //     border-radius: 9999px;
// //     font-size: 0.85rem;
// //     font-weight: 500;
// //     transition: all 0.2s;
// //   }
// //   .category-pill:hover {
// //     background: #dbeafe;
// //   }
// //   .service-pill {
// //     background: #fef9c3;
// //     color: #713f12;
// //     padding: 6px 14px;
// //     border-radius: 8px;
// //     font-size: 0.85rem;
// //     font-weight: 500;
// //   }
// //   .gallery-wrapper {
// //     overflow: hidden;
// //     border-radius: 12px;
// //     box-shadow: 0 4px 12px rgba(0,0,0,0.04);
// //     transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
// //   }
// //   .gallery-wrapper:hover {
// //     transform: scale(1.03);
// //   }
// //   .sidebar-sticky {
// //     position: sticky;
// //     top: 2rem;
// //   }
// //   .offer-card {
// //     border: none;
// //     border-radius: 16px;
// //     transition: all 0.3s ease;
// //     box-shadow: 0 4px 20px rgba(0,0,0,0.04);
// //   }
// //   .offer-card:hover {
// //     transform: translateY(-5px);
// //     box-shadow: 0 12px 30px rgba(0,0,0,0.08);
// //   }
// //   .hours-row {
// //     display: flex;
// //     justify-content: space-between;
// //     padding: 8px 0;
// //     border-bottom: 1px dashed #e2e8f0;
// //   }
// //   .hours-row:last-child {
// //     border-bottom: none;
// //   }
// //   .pulse-dot {
// //     width: 8px;
// //     height: 8px;
// //     background-color: #ef4444;
// //     border-radius: 50%;
// //     display: inline-block;
// //     animation: pulse 2s infinite;
// //   }
// //   @keyframes pulse {
// //     0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
// //     70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(239, 68, 68, 0); }
// //     100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
// //   }
// // `;

// // // ================= DYNAMIC MOCK DATA OBJECT =================
// // const MOCK_LISTING_DETAILS = {
// //   _id: "mock_listing_99881122",
// //   slug: "premium-veterinary-care-center",
// //   shopName: "Paws & Claws Premium Veterinary Care & Wellness Center",
// //   plan: "premium_verified",
// //   isFeatured: true,
// //   isPremiumBadge: true,
// //   isVerified: true,
// //   isClaimed: true,
// //   created_by_type: "admin",
// //   description: "Welcome to Paws & Claws Premium Veterinary Care Center. We specialize in advanced veterinary diagnostics, orthopedic surgeries, structural grooming treatments, and professional nutritional coaching. Serving the community with over 15 years of certified medical expertise, our clinic offers 24/7 critical emergency operations alongside premium boarding alternatives for your beloved household pets.",
// //   phone: "+1 (555) 392-8871",
// //   email: "care@pawsandclaws-premium.com",
// //   address: "742 Evergreen Terrace, Medical District, Sector 4",
// //   country: "United States",
// //   city: { city: "Springfield" },
// //   mapUrl: "https://maps.google.com/?q=Veterinary+Clinic",
// //   bannerImage: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&q=80&w=1200",
// //   whatsappNumber: "15553928871",
// //   enableQuoteViaWhatsapp: true,
  
// //   petCategories: [{ categoryName: "Dogs" }, { categoryName: "Cats" }, { categoryName: "Avian/Birds" }, { categoryName: "Exotic Reptiles" }],
// //   categories: [{ categoryName: "Veterinary Medicine" }, { categoryName: "Pet Boarding" }, { categoryName: "Emergency Animal Hospital" }],
// //   specializedServices: [{ serviceName: "Orthopedic Laser Surgery" }, { serviceName: "Ultrasound & Digital X-Ray" }, { serviceName: "Hydrotherapy Wellness Sessions" }, { serviceName: "Dental Scaling & Prophylaxis" }],
  
// //   serviceCoverage: {
// //     type: "radius",
// //     radiusKm: 25,
// //     neighborhoods: ["North End", "Downtown Hub", "Greenwood Suburbs", "Westside Valley"]
// //   },
  
// //   businessHours: [
// //     { day: "monday", open: "08:00 AM", close: "08:00 PM", closed: false },
// //     { day: "tuesday", open: "08:00 AM", close: "08:00 PM", closed: false },
// //     { day: "wednesday", open: "08:00 AM", close: "08:00 PM", closed: false },
// //     { day: "thursday", open: "08:00 AM", close: "08:00 PM", closed: false },
// //     { day: "friday", open: "08:00 AM", close: "10:00 PM", closed: false },
// //     { day: "saturday", open: "09:00 AM", close: "06:00 PM", closed: false },
// //     { day: "sunday", open: "00:00 AM", close: "00:00 AM", closed: true }
// //   ],
  
// //   socialAnchors: {
// //     facebook: "https://facebook.com/mock-paws-claws",
// //     instagram: "https://instagram.com/mock-paws-claws",
// //     twitter: "https://twitter.com/mock-paws-claws"
// //   },
  
// //   photos: [
// //     { url: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=600", alt: "Modern Diagnostics Laboratory Room" },
// //     { url: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=600", alt: "Luxury Dog Boarding Suites" },
// //     { url: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&q=80&w=600", alt: "Professional Pet Grooming and Bathing Station" }
// //   ]
// // };

// // const MOCK_REVIEWS = [
// //   {
// //     _id: "rev_01",
// //     userName: "Sarah Jenkins",
// //     created_at: "2026-06-14T10:30:00.000Z",
// //     rating: 5,
// //     comment: "Dr. Alistair and the nursing crew saved my golden retriever after an accidental poisoning incident. The communication level was phenomenal, and the cost structure was highly transparent.",
// //     photos: ["https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=150"]
// //   },
// //   {
// //     _id: "rev_02",
// //     userName: "Marcus Vance",
// //     created_at: "2026-07-02T14:15:00.000Z",
// //     rating: 4,
// //     comment: "Excellent grooming work done on my senior cat. The specialized handlers here are highly empathetic.",
// //     photos: []
// //   }
// // ];

// // const MOCK_OFFERS = [
// //   {
// //     _id: "off_01",
// //     title: "Annual Preventative Checkup Bundle - 25% Off",
// //     description: "Get full core screening, blood panel metrics, standard deworming treatment doses, and dynamic vaccinations all under one packaged cost.",
// //     media: [
// //       { type: "image", url: "https://images.unsplash.com/photo-1535268647977-a403b69fc756?auto=format&fit=crop&q=80&w=500" },
// //       { type: "image", url: "https://images.unsplash.com/photo-1612531386530-97286d97c2d2?auto=format&fit=crop&q=80&w=500" }
// //     ]
// //   },
// //   {
// //     _id: "off_02",
// //     title: "Free Dental Screening Every Wednesday",
// //     description: "Book an express structural evaluation with one of our oral health experts to identify early calculus buildups or periodontal concerns.",
// //     media: [
// //       { type: "image", url: "https://images.unsplash.com/photo-1581888227599-779811939961?auto=format&fit=crop&q=80&w=500" }
// //     ]
// //   }
// // ];

// // const ListingDetailPage = () => {
// //   const alertRef = useRef(null);
// //   const fileInputRef = useRef(null);
// //   const { user, authLoading } = useAuth();
// //   const engagementGate = useEngagementGate(user);

// //   const [listing] = useState(MOCK_LISTING_DETAILS);
// //   const [alert, setAlert] = useState({ show: false, type: "", message: "" });
// //   const [isSubmitting, setIsSubmitting] = useState(false);
// //   const [rating, setRating] = useState(0);
// //   const [comment, setComment] = useState("");
// //   const [userEmail, setUserEmail] = useState("");
// //   const [userName, setUserName] = useState("");
// //   const [photos, setPhotos] = useState([]);
// //   const [reviews, setReviews] = useState(MOCK_REVIEWS);
// //   const [offers] = useState(MOCK_OFFERS);
  
// //   const [showAuthGate, setShowAuthGate] = useState(false);
// //   const [showGalleryModal, setShowGalleryModal] = useState(false);
// //   const [selectedImage, setSelectedImage] = useState(null);
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [carouselIndices, setCarouselIndices] = useState({});
// //   const [showPhone, setShowPhone] = useState(false);
// //   const [isTracking, setIsTracking] = useState(false);
// //   const [showUrl, setShowUrl] = useState(false);
// //   const [urlIsTracking, setUrlIsTracking] = useState(false);

// //   const offersPerPage = 2; 
// //   const listingTier = listing?.plan || "free"; 
// //   const isFeaturedTier = listing?.isFeatured || listingTier === "featured_city" || listingTier === "premium_verified";
// //   const isPremiumTier = listing?.isPremiumBadge || listingTier === "premium_verified";
// //   const isVerifiedListing = listing?.isVerified;

// //   useEffect(() => {
// //     incrementListingViews();
// //     window.scrollTo({ top: 0, behavior: "smooth" });
// //   }, []);

// //   const moveCarousel = (offerId, direction, totalMedia) => {
// //     setCarouselIndices((prev) => {
// //       const currentIdx = prev[offerId] || 0;
// //       let nextIdx = direction === 'next' ? currentIdx + 1 : currentIdx - 1;
// //       if (nextIdx >= totalMedia) nextIdx = 0;
// //       if (nextIdx < 0) nextIdx = totalMedia - 1;
// //       return { ...prev, [offerId]: nextIdx };
// //     });
// //   };

// //   const handleShowPhone = () => {
// //     if (!user) { setShowAuthGate(true); return; }
// //     setIsTracking(true);
// //     setTimeout(() => { setShowPhone(true); setIsTracking(false); }, 600);
// //   };

// //   const handleShowUrl = () => {
// //     if (!user) { setShowAuthGate(true); return; }
// //     setUrlIsTracking(true);
// //     setTimeout(() => { setShowUrl(true); setUrlIsTracking(false); }, 600);
// //   };

// //   const handleSubmit = (e) => {
// //     e.preventDefault();
// //     if (!rating) { setAlert({ show: true, type: "danger", message: "Please select a rating." }); return; }
// //     setIsSubmitting(true);
// //     setTimeout(() => {
// //       const newReview = {
// //         _id: `rev_mock_${Date.now()}`,
// //         userName: user ? user.name : userName || "Anonymous Guest",
// //         created_at: new Date().toISOString(),
// //         rating: rating,
// //         comment: comment,
// //         photos: []
// //       };
// //       setReviews([newReview, ...reviews]);
// //       setAlert({ show: true, type: "success", message: "Review posted smoothly onto simulated view!" });
// //       setRating(0); setComment(""); setUserName(""); setUserEmail("");
// //       setIsSubmitting(false);
// //     }, 800);
// //   };

// //   return (
// //     <div className="stylish-detail-page">
// //       <style>{STYLES}</style>
// //       <Helmet>
// //         <title>{`Vet and Pets - ${listing?.shopName}`}</title>
// //       </Helmet>

// //       <AuthGateModal show={showAuthGate} onClose={() => setShowAuthGate(false)} />

// //       {/* STYLISH PREMIUM BANNER */}
// //       {isFeaturedTier && listing.bannerImage && (
// //         <div className="hero-premium-banner" style={{ backgroundImage: `url(${listing.bannerImage})` }}>
// //           <div className="hero-overlay w-100 h-100 position-absolute top-0 start-0 d-flex align-items-end">
// //             <Container className="mb-4">
// //               <div className="d-flex flex-wrap gap-2 mb-2">
// //                 {isPremiumTier && <span className="badge badge-premium px-3 py-2 shadow-sm rounded-pill"><FaShieldAlt className="me-1 text-warning"/> PREMIUM VENDOR</span>}
// //                 {isVerifiedListing && <span className="badge badge-verified px-3 py-2 shadow-sm rounded-pill"><FaCheckCircle className="me-1"/> VERIFIED BUSINESS</span>}
// //               </div>
// //               <h1 className="text-white shop-title text-shadow mb-0">{listing.shopName}</h1>
// //             </Container>
// //           </div>
// //         </div>
// //       )}

// //       <Container className="mt-5">
// //         <Row>
// //           {/* LEFT CONTENT COLUMN */}
// //           <Col lg={8} className="pe-lg-4">
// //             {/* Quick Type Tags */}
// //             <div className="d-flex flex-wrap gap-2 mb-4">
// //               {listing.petCategories?.map((cat, i) => (
// //                 <span className="category-pill" key={i}>{cat.categoryName}</span>
// //               ))}
// //             </div>

// //             <div className="bg-white p-4 rounded-4 shadow-sm border mb-4">
// //               <h4 className="fw-bold mb-3" style={{ letterSpacing: "-0.01em" }}>About the Business</h4>
// //               <p className="text-secondary lh-lg mb-4" style={{ fontSize: "1.05rem" }}>{listing.description}</p>
              
// //               {/* Category tags setup */}
// //               <div className="d-flex flex-column gap-3 pt-3 border-top">
// //                 {listing.categories?.length > 0 && (
// //                   <div>
// //                     <span className="d-block text-xs fw-bold text-uppercase text-muted mb-2">Primary Specializations</span>
// //                     <div className="d-flex flex-wrap gap-2">
// //                       {listing.categories.map((c, i) => <span key={i} className="badge bg-light text-dark border px-3 py-2 rounded-3">{c.categoryName}</span>)}
// //                     </div>
// //                   </div>
// //                 )}
                
// //                 {listing.specializedServices?.length > 0 && (
// //                   <div>
// //                     <span className="d-block text-xs fw-bold text-uppercase text-muted mb-2">Advanced Care & Machinery</span>
// //                     <div className="d-flex flex-wrap gap-2">
// //                       {listing.specializedServices.map((s, i) => <span key={i} className="service-pill">{s.serviceName}</span>)}
// //                     </div>
// //                   </div>
// //                 )}
// //               </div>
// //             </div>

// //             {/* RADAR/RADIUS FOOTPRINT COVERAGE */}
// //             {listing.serviceCoverage && (
// //               <div className="p-4 rounded-4 shadow-sm border mb-4 text-white" style={{ background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)" }}>
// //                 <h5 className="d-flex align-items-center gap-2 text-warning mb-2"><FaMapMarkerAlt /> Core Operations Area Map</h5>
// //                 <p className="mb-0 text-slate-300 opacity-90">
// //                   Providing responsive specialized support within a <strong>{listing.serviceCoverage.radiusKm} km radius</strong> encompassing regional sectors like: {listing.serviceCoverage.neighborhoods.join(', ')}.
// //                 </p>
// //               </div>
// //             )}

// //             {/* GALLERIES SHOWCASE */}
// //             {listing.photos?.length > 0 && (
// //               <div className="mb-5">
// //                 <h4 className="fw-bold mb-3">Facility Showcase</h4>
// //                 <Row className="g-3">
// //                   {listing.photos.map((img, i) => (
// //                     <Col md={4} sm={6} key={i}>
// //                       <div className="gallery-wrapper" onClick={() => { setSelectedImage(img.url); setShowGalleryModal(true); }}>
// //                         <img src={img.url} alt={img.alt} className="w-100" style={{ height: "180px", objectFit: "cover", cursor: "pointer" }} />
// //                       </div>
// //                     </Col>
// //                   ))}
// //                 </Row>
// //               </div>
// //             )}

// //             {/* CLIENT COMMENTS & REVIEWS */}
// //             <div className="bg-white p-4 rounded-4 shadow-sm border mb-4">
// //               <h4 className="fw-bold mb-4">Verified Customer Reviews</h4>
// //               {reviews.map((r) => (
// //                 <div key={r._id} className="pb-4 mb-4 border-bottom last-border-0">
// //                   <div className="d-flex justify-content-between align-items-start mb-2">
// //                     <div>
// //                       <h6 className="fw-bold mb-0 text-slate-800">{r.userName}</h6>
// //                       <div className="text-warning small my-1">
// //                         {Array.from({ length: 5 }).map((_, idx) => <FaStar key={idx} color={idx < r.rating ? "#ffc107" : "#e4e5e9"} />)}
// //                       </div>
// //                     </div>
// //                     <span className="text-muted small">{new Date(r.created_at).toLocaleDateString()}</span>
// //                   </div>
// //                   <p className="text-secondary mb-0 font-sans">{r.comment}</p>
// //                 </div>
// //               ))}
// //             </div>
// //           </Col>

// //           {/* RIGHT SIDEBAR COLUMN */}
// //           <Col lg={4}>
// //             <div className="sidebar-sticky">
// //               {/* CONTACT MATRIX CARD */}
// //               <div className="bg-white p-4 rounded-4 shadow-sm border mb-4">
// //                 <h5 className="fw-bold mb-3 pb-2 border-bottom">Information Center</h5>
                
// //                 <div className="mb-3">
// //                   <span className="d-block text-xs text-muted mb-1">Direct Line</span>
// //                   {!showPhone ? (
// //                     <Button size="sm" variant="primary" className="w-100 rounded-3" onClick={handleShowPhone} disabled={isTracking}>
// //                       {isTracking ? "Decrypting..." : "Reveal Secure Number"}
// //                     </Button>
// //                   ) : (
// //                     <a href={`tel:${listing.phone}`} className="fw-bold fs-5 text-primary text-decoration-none d-block text-center p-2 bg-light rounded-3">{listing.phone}</a>
// //                   )}
// //                 </div>

// //                 <div className="mb-3">
// //                   <span className="d-block text-xs text-muted mb-1">Clinic Address</span>
// //                   <p className="fw-medium text-dark mb-0 small">{listing.address}</p>
// //                 </div>

// //                 <div className="mb-4">
// //                   <span className="d-block text-xs text-muted mb-2">Working Matrix Hours</span>
// //                   <div className="bg-light p-3 rounded-3 border-0 small">
// //                     {listing.businessHours?.map((bh, idx) => (
// //                       <div key={idx} className="hours-row">
// //                         <span className="text-capitalize fw-semibold text-secondary">{bh.day.substring(0,3)}</span>
// //                         <span className="font-monospace">{bh.closed ? <span className="text-danger fw-bold">Closed</span> : `${bh.open} - ${bh.close}`}</span>
// //                       </div>
// //                     ))}
// //                   </div>
// //                 </div>

// //                 {isFeaturedTier && listing.whatsappNumber && (
// //                   <Button variant="success" className="w-100 rounded-3 py-2 d-flex align-items-center justify-content-center gap-2 fw-semibold" href={`https://wa.me/${listing.whatsappNumber}`} target="_blank">
// //                     <FaWhatsapp size={18}/> Instant WhatsApp Chat
// //                   </Button>
// //                 )}
// //               </div>

// //               {/* REVIEW SIDE-WIDGET COMPONENT */}
// //               <div className="bg-white p-4 rounded-4 shadow-sm border">
// //                 <h5 className="fw-bold mb-3 text-center">Leave Feedback</h5>
// //                 <Form onSubmit={handleSubmit}>
// //                   <div className="d-flex justify-content-center gap-1 mb-3">
// //                     {[1, 2, 3, 4, 5].map((i) => (
// //                       <span key={i} style={{ fontSize: "2rem", cursor: "pointer", color: i <= rating ? "#ffc107" : "#cbd5e1" }} onClick={() => setRating(i)}>★</span>
// //                     ))}
// //                   </div>
// //                   <Form.Group className="mb-3">
// //                     <Form.Control as="textarea" rows={3} placeholder="Tell others about your diagnostic experience..." value={comment} onChange={(e) => setComment(e.target.value)} required maxLength={300} className="rounded-3" />
// //                   </Form.Group>
// //                   <Button variant="outline-dark" type="submit" className="w-100 rounded-3 fw-semibold">Submit Dynamic Post</Button>
// //                 </Form>
// //               </div>
// //             </div>
// //           </Col>
// //         </Row>

// //         {/* OFFERS CAROUSEL ROW */}
// //         {offers.length > 0 && (() => {
// //           const currentOffers = offers.slice((currentPage - 1) * offersPerPage, currentPage * offersPerPage);
// //           const totalPages = Math.ceil(offers.length / offersPerPage);

// //           return (
// //             <div className="mt-5 border-top pt-5">
// //               <h3 className="fw-bold mb-4 d-flex align-items-center gap-2">
// //                 <span className="pulse-dot"></span> Active Campaign Promotions
// //               </h3>
// //               <Row>
// //                 {currentOffers.map((offer) => {
// //                   const currentImgIdx = carouselIndices[offer._id] || 0;
// //                   const currentMedia = offer.media?.[currentImgIdx];

// //                   return (
// //                     <Col md={6} key={offer._id} className="mb-4">
// //                       <div className="card offer-card h-100">
// //                         <div className="position-relative bg-light" style={{ aspectRatio: '16/9', overflow: 'hidden', borderRadius: '16px 16px 0 0' }}>
// //                           {currentMedia && <img src={currentMedia.url} alt={offer.title} className="w-100 h-100 position-absolute top-0 start-0" style={{ objectFit: 'cover' }} />}
// //                           {offer.media?.length > 1 && (
// //                             <>
// //                               <Button onClick={() => moveCarousel(offer._id, 'prev', offer.media.length)} variant="light" className="position-absolute start-0 top-50 translate-middle-y m-2 rounded-circle p-0 d-flex align-items-center justify-content-center shadow-sm" style={{ width: '32px', height: '32px' }}><BiChevronLeft size={20}/></Button>
// //                               <Button onClick={() => moveCarousel(offer._id, 'next', offer.media.length)} variant="light" className="position-absolute end-0 top-50 translate-middle-y m-2 rounded-circle p-0 d-flex align-items-center justify-content-center shadow-sm" style={{ width: '32px', height: '32px' }}><BiChevronRight size={20}/></Button>
// //                             </>
// //                           )}
// //                         </div>
// //                         <div className="card-body p-4">
// //                           <h5 className="fw-bold text-dark mb-2">{offer.title}</h5>
// //                           <p className="text-secondary small line-clamp-2 mb-0">{offer.description}</p>
// //                         </div>
// //                       </div>
// //                     </Col>
// //                   );
// //                 })}
// //               </Row>
// //               {totalPages > 1 && (
// //                 <div className="d-flex justify-content-center align-items-center gap-3 mt-3">
// //                   <Button size="sm" variant="light" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="shadow-sm border">Prev</Button>
// //                   <span className="small text-muted font-monospace">Page {currentPage} of {totalPages}</span>
// //                   <Button size="sm" variant="light" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="shadow-sm border">Next</Button>
// //                 </div>
// //               )}
// //             </div>
// //           );
// //         })()}
// //       </Container>

// //       {/* GALLERY PREVIEW MODAL */}
// //       <Modal show={showGalleryModal} onHide={() => setShowGalleryModal(false)} centered size="lg">
// //         <Modal.Body className="p-0 bg-black rounded-3 overflow-hidden">
// //           <img src={selectedImage} alt="Structural preview" className="w-100" style={{ maxHeight: "80vh", objectFit: "contain" }} />
// //         </Modal.Body>
// //       </Modal>
// //     </div>
// //   );
// // };

// // export default ListingDetailPage;
// import React, { useState, useEffect } from "react";
// import { FaStar, FaWhatsapp, FaFacebook, FaInstagram, FaTwitter, FaMapMarkerAlt, FaShieldAlt, FaCheckCircle, FaEnvelope, FaClock } from "react-icons/fa";
// import { Form, Button, Container, Row, Col, Modal } from "react-bootstrap";
// import { useAuth } from "../contexts/AuthContext";
// import { incrementListingViews } from "../utils/engagementTracker";
// import { Helmet } from "react-helmet-async";

// // Embedded Ultra-Aesthetic Stylesheet
// const STYLES = `
//   @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

//   .aesthetic-detail-page {
//     background-color: #fdfdfd;
//     font-family: 'Plus Jakarta Sans', sans-serif;
//     color: #334155;
//     padding-bottom: 6rem;
//     letter-spacing: -0.01em;
//   }
//   .premium-hero-header {
//     height: 440px;
//     background-size: cover;
//     background-position: center;
//     position: relative;
//     border-radius: 0 0 32px 32px;
//     overflow: hidden;
//   }
//   .premium-hero-header::after {
//     content: '';
//     position: absolute;
//     inset: 0;
//     background: linear-gradient(180deg, rgba(15, 23, 42, 0.1) 0%, rgba(15, 23, 42, 0.85) 100%);
//   }
//   .hero-content-cluster {
//     position: absolute;
//     bottom: 0;
//     left: 0;
//     width: 100%;
//     z-index: 2;
//     padding-bottom: 2.5rem;
//   }
//   .aesthetic-card {
//     background: #ffffff;
//     border: 1px solid #f1f5f9;
//     border-radius: 24px;
//     box-shadow: 0 4px 30px rgba(15, 23, 42, 0.02);
//     transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
//   }
//   .glass-sidebar-panel {
//     background: rgba(255, 255, 255, 0.85);
//     backdrop-filter: blur(16px);
//     -webkit-backdrop-filter: blur(16px);
//     border: 1px solid rgba(241, 245, 249, 0.9);
//     border-radius: 24px;
//     box-shadow: 0 20px 40px rgba(15, 23, 42, 0.04);
//   }
//   .pill-badge {
//     font-size: 0.75rem;
//     font-weight: 700;
//     text-transform: uppercase;
//     letter-spacing: 0.08em;
//     padding: 6px 16px;
//     border-radius: 9999px;
//   }
//   .pill-badge-premium {
//     background: linear-gradient(135deg, #fef08a 0%, #facc15 100%);
//     color: #713f12;
//   }
//   .pill-badge-verified {
//     background: #dcfce7;
//     color: #15803d;
//   }
//   .tag-pet-category {
//     background: #f8fafc;
//     color: #475569;
//     border: 1px solid #e2e8f0;
//     padding: 8px 18px;
//     border-radius: 9999px;
//     font-size: 0.85rem;
//     font-weight: 500;
//     transition: all 0.3s;
//   }
//   .tag-pet-category:hover {
//     background: #0f172a;
//     color: #ffffff;
//     border-color: #0f172a;
//   }
//   .tag-specialized {
//     background: #f0fdfa;
//     color: #0d9488;
//     padding: 6px 12px;
//     border-radius: 10px;
//     font-size: 0.8rem;
//     font-weight: 600;
//     display: inline-block;
//   }
//   .gallery-grid-item {
//     border-radius: 20px;
//     overflow: hidden;
//     transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
//   }
//   .gallery-grid-item:hover {
//     transform: translateY(-4px) scale(1.02);
//     box-shadow: 0 20px 30px rgba(0,0,0,0.06);
//   }
//   .hours-grid-row {
//     display: flex;
//     justify-content: space-between;
//     align-items: center;
//     padding: 10px 0;
//     border-bottom: 1px dashed #f1f5f9;
//     font-size: 0.9rem;
//   }
//   .hours-grid-row:last-child {
//     border-bottom: none;
//   }
//   .aesthetic-input {
//     border: 1px solid #e2e8f0;
//     border-radius: 12px;
//     padding: 12px;
//     font-size: 0.95rem;
//     transition: all 0.2s;
//   }
//   .aesthetic-input:focus {
//     border-color: #0f172a;
//     box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.05);
//   }
//   .btn-aesthetic-primary {
//     background: #0f172a;
//     color: white;
//     border: none;
//     border-radius: 14px;
//     padding: 12px 24px;
//     font-weight: 600;
//     transition: all 0.3s;
//   }
//   .btn-aesthetic-primary:hover {
//     background: #1e293b;
//     transform: translateY(-1px);
//   }
//   .aesthetic-offer-card {
//     border: 1px solid #f1f5f9;
//     border-radius: 24px;
//     overflow: hidden;
//     background: #ffffff;
//     transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
//   }
//   .aesthetic-offer-card:hover {
//     transform: translateY(-6px);
//     box-shadow: 0 22px 40px rgba(15, 23, 42, 0.06);
//   }
//   .section-label {
//     font-size: 0.75rem;
//     text-transform: uppercase;
//     letter-spacing: 0.1em;
//     font-weight: 700;
//     color: #94a3b8;
//     margin-bottom: 0.75rem;
//     display: block;
//   }
//   .pulse-indicator {
//     width: 6px;
//     height: 6px;
//     background: #10b981;
//     border-radius: 50%;
//     position: relative;
//   }
//   .pulse-indicator::after {
//     content: '';
//     position: absolute;
//     inset: -4px;
//     border-radius: 50%;
//     border: 2px solid #10b981;
//     animation: pulse-ring 1.5s infinite;
//   }
//   .social-anchor-btn {
//     width: 40px;
//     height: 40px;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     border-radius: 12px;
//     background: #f8fafc;
//     color: #64748b;
//     border: 1px solid #e2e8f0;
//     transition: all 0.2s ease;
//   }
//   .social-anchor-btn:hover {
//     background: #0f172a;
//     color: #ffffff;
//     border-color: #0f172a;
//     transform: translateY(-2px);
//   }
//   @keyframes pulse-ring {
//     0% { transform: scale(0.5); opacity: 1; }
//     100% { transform: scale(1.5); opacity: 0; }
//   }
// `;

// // Mock Details Config
// const MOCK_LISTING_DETAILS = {
//   _id: "mock_listing_99881122",
//   slug: "premium-veterinary-care-center",
//   shopName: "Paws & Claws Premium Veterinary Care & Wellness Center",
//   plan: "premium_verified",
//   isFeatured: true,
//   isPremiumBadge: true,
//   isVerified: true,
//   isClaimed: true,
//   created_by_type: "admin",
//   description: "Welcome to Paws & Claws Premium Veterinary Care Center. We specialize in advanced veterinary diagnostics, orthopedic surgeries, structural grooming treatments, and professional nutritional coaching. Serving the community with over 15 years of certified medical expertise, our clinic offers 24/7 critical emergency operations alongside premium boarding alternatives for your beloved household pets.",
//   phone: "+1 (555) 392-8871",
//   email: "care@pawsandclaws-premium.com",
//   address: "742 Evergreen Terrace, Medical District, Sector 4",
//   country: "United States",
//   city: { city: "Springfield" },
//   mapUrl: "https://maps.google.com/?q=Veterinary+Clinic",
//   bannerImage: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&q=80&w=1200",
//   whatsappNumber: "15553928871",
//   enableQuoteViaWhatsapp: true,
  
//   petCategories: [{ categoryName: "Dogs" }, { categoryName: "Cats" }, { categoryName: "Avian/Birds" }, { categoryName: "Exotic Reptiles" }],
//   categories: [{ categoryName: "Veterinary Medicine" }, { categoryName: "Pet Boarding" }, { categoryName: "Emergency Hospital" }],
//   specializedServices: [{ serviceName: "Orthopedic Laser Surgery" }, { serviceName: "Ultrasound & Digital X-Ray" }, { serviceName: "Hydrotherapy Wellness" }, { serviceName: "Dental Prophylaxis" }],
  
//   serviceCoverage: {
//     type: "radius",
//     radiusKm: 25,
//     neighborhoods: ["North End", "Downtown Hub", "Greenwood Suburbs"]
//   },
  
//   businessHours: [
//     { day: "monday", open: "08:00 AM", close: "08:00 PM", closed: false },
//     { day: "tuesday", open: "08:00 AM", close: "08:00 PM", closed: false },
//     { day: "wednesday", open: "08:00 AM", close: "08:00 PM", closed: false },
//     { day: "thursday", open: "08:00 AM", close: "08:00 PM", closed: false },
//     { day: "friday", open: "08:00 AM", close: "10:00 PM", closed: false },
//     { day: "saturday", open: "09:00 AM", close: "06:00 PM", closed: false },
//     { day: "sunday", open: "00:00 AM", close: "00:00 AM", closed: true }
//   ],
  
//   socialAnchors: {
//     facebook: "https://facebook.com",
//     instagram: "https://instagram.com",
//     twitter: "https://twitter.com"
//   },
  
//   photos: [
//     { url: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=600", alt: "Lab" },
//     { url: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=600", alt: "Suites" },
//     { url: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&q=80&w=600", alt: "Grooming" }
//   ]
// };

// const MOCK_REVIEWS = [
//   {
//     _id: "rev_01",
//     userName: "Sarah Jenkins",
//     created_at: "2026-06-14T10:30:00.000Z",
//     rating: 5,
//     comment: "Dr. Alistair and the nursing crew saved my golden retriever after an accidental poisoning incident. The communication level was phenomenal, and the cost structure was highly transparent. Truly an elite facility."
//   },
//   {
//     _id: "rev_02",
//     userName: "Marcus Vance",
//     created_at: "2026-07-02T14:15:00.000Z",
//     rating: 4,
//     comment: "Excellent grooming work done on my senior cat. The specialized handlers here are highly empathetic. Highly recommend."
//   }
// ];

// const MOCK_OFFERS = [
//   {
//     _id: "off_01",
//     title: "Annual Preventative Checkup Bundle - 25% Off",
//     description: "Get full core screening, blood panel metrics, standard deworming treatment doses, and dynamic vaccinations all under one packaged cost.",
//     media: [{ type: "image", url: "https://images.unsplash.com/photo-1535268647977-a403b69fc756?auto=format&fit=crop&q=80&w=500" }]
//   }
// ];

// const ListingDetailPage = () => {
//   const { user } = useAuth();
//   const [listing] = useState(MOCK_LISTING_DETAILS);
//   const [reviews, setReviews] = useState(MOCK_REVIEWS);
//   const [offers] = useState(MOCK_OFFERS);
  
//   const [rating, setRating] = useState(0);
//   const [comment, setComment] = useState("");
//   const [showPhone, setShowPhone] = useState(false);
//   const [showGalleryModal, setShowGalleryModal] = useState(false);
//   const [selectedImage, setSelectedImage] = useState(null);

//   useEffect(() => {
//     incrementListingViews();
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   }, []);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!rating) return;
//     const newReview = {
//       _id: `rev_${Date.now()}`,
//       userName: user?.name || "Anonymous Guest",
//       created_at: new Date().toISOString(),
//       rating: rating,
//       comment: comment
//     };
//     setReviews([newReview, ...reviews]);
//     setComment("");
//     setRating(0);
//   };

//   return (
//     <div className="aesthetic-detail-page">
//       <style>{STYLES}</style>
//       <Helmet>
//         <title>{listing.shopName}</title>
//       </Helmet>

//       {/* HERO HEADER */}
//       <div className="premium-hero-header" style={{ backgroundImage: `url(${listing.bannerImage})` }}>
//         <div className="hero-content-cluster">
//           <Container>
//             <div className="d-flex flex-wrap gap-2 mb-3">
//               <span className="pill-badge pill-badge-premium"><FaShieldAlt className="me-1"/> Premium Partner</span>
//               <span className="pill-badge pill-badge-verified"><FaCheckCircle className="me-1"/> Verified Care</span>
//             </div>
//             <h1 className="text-white fw-800 display-5 mb-0" style={{ letterSpacing: "-0.03em", fontWeight: 800 }}>{listing.shopName}</h1>
//           </Container>
//         </div>
//       </div>

//       <Container className="mt-5">
//         <Row className="g-5">
//           {/* CONTENT GRID */}
//           <Col lg={8}>
//             <div className="d-flex flex-wrap gap-2 mb-4">
//               {listing.petCategories?.map((cat, i) => (
//                 <span className="tag-pet-category" key={i}>{cat.categoryName}</span>
//               ))}
//             </div>

//             <div className="aesthetic-card p-4 mb-5">
//               <span className="section-label">Executive Summary</span>
//               <p className="text-secondary lh-relaxed fs-5 mb-4" style={{ fontWeight: "400", color: "#475569" }}>{listing.description}</p>
              
//               <Row className="g-4 pt-4 border-top">
//                 {listing.categories?.length > 0 && (
//                   <Col md={6}>
//                     <span className="section-label">Medical Focus Sectors</span>
//                     <div className="d-flex flex-wrap gap-2">
//                       {listing.categories.map((c, i) => <span key={i} className="badge bg-slate text-dark border px-3 py-2 rounded-pill small fw-medium">{c.categoryName}</span>)}
//                     </div>
//                   </Col>
//                 )}
//                 {listing.specializedServices?.length > 0 && (
//                   <Col md={6}>
//                     <span className="section-label">Specialized Target Capabilities</span>
//                     <div className="d-flex flex-wrap gap-2">
//                       {listing.specializedServices.map((s, i) => <span key={i} className="tag-specialized">{s.serviceName}</span>)}
//                     </div>
//                   </Col>
//                 )}
//               </Row>
//             </div>

//             <div className="aesthetic-card p-4 mb-5" style={{ background: "#0f172a", color: "#f8fafc" }}>
//               <div className="d-flex align-items-center gap-2 mb-2">
//                 <FaMapMarkerAlt className="text-warning"/>
//                 <span className="text-uppercase fw-bold small tracking-wider" style={{ color: "#94a3b8" }}>Service Footprint Bounds</span>
//               </div>
//               <p className="mb-0 opacity-90 font-sans lh-relaxed">
//                 Actively serving clinical priorities across a <strong>{listing.serviceCoverage.radiusKm} km scope</strong> radius including key sectors: {listing.serviceCoverage.neighborhoods.join(', ')}.
//               </p>
//             </div>

//             {listing.photos?.length > 0 && (
//               <div className="mb-5">
//                 <span className="section-label">Architectural Facility Tour</span>
//                 <Row className="g-3">
//                   {listing.photos.map((img, i) => (
//                     <Col md={4} sm={6} key={i}>
//                       <div className="gallery-grid-item" onClick={() => { setSelectedImage(img.url); setShowGalleryModal(true); }}>
//                         <img src={img.url} alt={img.alt} className="w-100" style={{ height: "190px", objectFit: "cover", cursor: "pointer" }} />
//                       </div>
//                     </Col>
//                   ))}
//                 </Row>
//               </div>
//             )}

//             <div className="aesthetic-card p-4 mb-4">
//               <span className="section-label">Community Experience Reports</span>
//               {reviews.map((r, index) => (
//                 <div key={r._id} className={`py-4 ${index !== reviews.length - 1 ? 'border-bottom' : ''}`}>
//                   <div className="d-flex justify-content-between align-items-center mb-2">
//                     <h6 className="fw-700 mb-0 text-dark" style={{ fontWeight: 700 }}>{r.userName}</h6>
//                     <span className="text-muted small">{new Date(r.created_at).toLocaleDateString()}</span>
//                   </div>
//                   <div className="text-warning small mb-2">
//                     {Array.from({ length: 5 }).map((_, idx) => <FaStar key={idx} color={idx < r.rating ? "#facc15" : "#e2e8f0"} />)}
//                   </div>
//                   <p className="text-secondary mb-0 font-sans">{r.comment}</p>
//                 </div>
//               ))}
//             </div>
//           </Col>

//           {/* SIDEBAR */}
//           <Col lg={4}>
//             <div className="position-sticky" style={{ top: "2rem" }}>
//               <div className="glass-sidebar-panel p-4 mb-4">
//                 <div className="d-flex align-items-center justify-content-between mb-4">
//                   <span className="fw-800 fs-5 text-dark" style={{ fontWeight: 800 }}>HQ Matrix</span>
//                   <div className="d-flex align-items-center gap-2 text-success small fw-semibold">
//                     <span className="pulse-indicator"></span> Available
//                   </div>
//                 </div>

//                 <div className="mb-4">
//                   <button className="btn-aesthetic-primary w-100 py-3" onClick={() => setShowPhone(!showPhone)}>
//                     {showPhone ? listing.phone : "Request Contact Identity"}
//                   </button>
//                 </div>

//                 <div className="d-flex flex-column gap-3 text-sm border-top pt-4">
//                   <div className="d-flex align-items-start gap-3">
//                     <FaEnvelope className="text-muted mt-1"/>
//                     <div>
//                       <span className="d-block text-xs text-muted">Secure Email</span>
//                       <span className="text-dark fw-medium">{listing.email}</span>
//                     </div>
//                   </div>
//                   <div className="d-flex align-items-start gap-3">
//                     <FaMapMarkerAlt className="text-muted mt-1"/>
//                     <div>
//                       <span className="d-block text-xs text-muted">Geographical Point</span>
//                       <span className="text-dark fw-medium">{listing.address}</span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* SOCIAL CHANNELS INTEGRATION BLOCK */}
//                 {listing.socialAnchors && (
//                   <div className="mt-4 pt-4 border-top">
//                     <span className="section-label">Social Coordinates</span>
//                     <div className="d-flex gap-2 mt-2">
//                       {listing.socialAnchors.facebook && (
//                         <a href={listing.socialAnchors.facebook} target="_blank" rel="noreferrer" className="social-anchor-btn" aria-label="Facebook Profile">
//                           <FaFacebook size={18} />
//                         </a>
//                       )}
//                       {listing.socialAnchors.instagram && (
//                         <a href={listing.socialAnchors.instagram} target="_blank" rel="noreferrer" className="social-anchor-btn" aria-label="Instagram Profile">
//                           <FaInstagram size={18} />
//                         </a>
//                       )}
//                       {listing.socialAnchors.twitter && (
//                         <a href={listing.socialAnchors.twitter} target="_blank" rel="noreferrer" className="social-anchor-btn" aria-label="Twitter Profile">
//                           <FaTwitter size={16} />
//                         </a>
//                       )}
//                     </div>
//                   </div>
//                 )}

//                 {/* BUSINESS HOURS TIMELINE MATRIX */}
//                 <div className="mt-4 pt-4 border-top">
//                   <span className="section-label"><FaClock className="me-1"/> Operating Hours Matrix</span>
//                   <div className="p-2 rounded-3 bg-white border border-light mt-2">
//                     {listing.businessHours?.map((bh, idx) => (
//                       <div key={idx} className="hours-grid-row">
//                         <span className="text-capitalize fw-medium text-muted">{bh.day.substring(0,3)}</span>
//                         <span className="font-monospace text-dark fw-semibold" style={{ fontSize: '0.85rem' }}>
//                           {bh.closed ? <span className="text-danger">Closed</span> : `${bh.open} - ${bh.close}`}
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {listing.whatsappNumber && (
//                   <Button variant="success" className="w-100 rounded-3 py-3 mt-4 d-flex align-items-center justify-content-center gap-2 fw-bold text-white border-0" style={{ background: '#22c55e' }} href={`https://wa.me/${listing.whatsappNumber}`} target="_blank">
//                     <FaWhatsapp size={20}/> Connect via WhatsApp
//                   </Button>
//                 )}
//               </div>

//               {/* POST REVIEW */}
//               <div className="aesthetic-card p-4">
//                 <span className="section-label text-center">Register Feedback</span>
//                 <Form onSubmit={handleSubmit}>
//                   <div className="d-flex justify-content-center gap-2 mb-3">
//                     {[1, 2, 3, 4, 5].map((i) => (
//                       <span key={i} style={{ fontSize: "1.8rem", cursor: "pointer", color: i <= rating ? "#facc15" : "#e2e8f0", transition: 'color 0.2s' }} onClick={() => setRating(i)}>★</span>
//                     ))}
//                   </div>
//                   <Form.Group className="mb-3">
//                     <Form.Control as="textarea" rows={3} placeholder="Share details of your clinical support standard..." value={comment} onChange={(e) => setComment(e.target.value)} required className="aesthetic-input" />
//                   </Form.Group>
//                   <button type="submit" className="btn-aesthetic-primary w-100 py-2.5">Post Report</button>
//                 </Form>
//               </div>
//             </div>
//           </Col>
//         </Row>

//         {/* PROMOTIONS MATRIX */}
//         {offers.length > 0 && (
//           <div className="mt-5 pt-5 border-top">
//             <div className="d-flex align-items-center gap-2 mb-4">
//               <span className="pulse-indicator"></span>
//               <h3 className="fw-800 mb-0 text-dark" style={{ fontWeight: 800, letterSpacing: '-0.02em' }}>Corporate Offers & Notices</h3>
//             </div>
//             <Row className="g-4">
//               {offers.map((offer) => (
//                 <Col md={6} key={offer._id}>
//                   <div className="aesthetic-offer-card h-100">
//                     <div style={{ aspectRatio: '16/7', overflow: 'hidden', position: 'relative' }}>
//                       <img src={offer.media[0].url} alt={offer.title} className="w-100 h-100" style={{ objectFit: 'cover' }} />
//                     </div>
//                     <div className="p-4">
//                       <h5 className="fw-700 text-dark mb-2" style={{ fontWeight: 700 }}>{offer.title}</h5>
//                       <p className="text-secondary small mb-0 lh-relaxed">{offer.description}</p>
//                     </div>
//                   </div>
//                 </Col>
//               ))}
//             </Row>
//           </div>
//         )}
//       </Container>

//       {/* LIGHTBOX MODAL */}
//       <Modal show={showGalleryModal} onHide={() => setShowGalleryModal(false)} centered size="lg">
//         <Modal.Body className="p-0 bg-dark rounded-4 overflow-hidden">
//           <img src={selectedImage} alt="Preview" className="w-100" style={{ maxHeight: "80vh", objectFit: "contain" }} />
//         </Modal.Body>
//       </Modal>
//     </div>
//   );
// };

// export default ListingDetailPage;
import React, { useState, useEffect } from "react";
import { FaStar, FaWhatsapp, FaFacebook, FaInstagram, FaTwitter, FaMapMarkerAlt, FaShieldAlt, FaCheckCircle, FaEnvelope, FaClock } from "react-icons/fa";
import { Form, Button, Container, Row, Col, Modal } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { incrementListingViews } from "../utils/engagementTracker";
import { Helmet } from "react-helmet-async";

// Ultra-Clean Modern Light Stylesheet
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

  .aesthetic-detail-page {
    background-color: #fafbfe;
    font-family: 'Plus Jakarta Sans', sans-serif;
    color: #475569;
    padding-bottom: 6rem;
    letter-spacing: -0.01em;
  }
  
  .headline-font {
    font-family: 'Space Grotesk', sans-serif;
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
    font-family: 'Space Grotesk', sans-serif;
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
    font-family: 'Space Grotesk', sans-serif;
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
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border: none;
    border-radius: 8px;
    padding: 14px 28px;
    transition: all 0.3s;
  }

  .btn-clean-primary:hover {
    background: #1e293b;
    color: #ffffff;
    box-shadow: 0 8px 24px rgba(255, 78, 0, 0.2);
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
    background: #ff4e00;
    border-radius: 50%;
    box-shadow: 0 0 8px rgba(255, 78, 0, 0.6);
    display: inline-block;
  }
`;

const MOCK_LISTING_DETAILS = {
  _id: "mock_listing_99881122",
  slug: "premium-veterinary-care-center",
  shopName: "Paws & Claws Premium Veterinary Care & Wellness Center",
  plan: "premium_verified",
  isFeatured: true,
  isPremiumBadge: true,
  isVerified: true,
  isClaimed: true,
  created_by_type: "admin",
  description: "Welcome to Paws & Claws Premium Veterinary Care Center. We specialize in advanced veterinary diagnostics, orthopedic surgeries, structural grooming treatments, and professional nutritional coaching. Serving the community with over 15 years of certified medical expertise, our clinic offers 24/7 critical emergency operations alongside premium boarding alternatives for your beloved household pets.",
  phone: "+1 (555) 392-8871",
  email: "care@pawsandclaws-premium.com",
  address: "742 Evergreen Terrace, Medical District, Sector 4",
  country: "United States",
  city: { city: "Springfield" },
  mapUrl: "https://maps.google.com/?q=Veterinary+Clinic",
  bannerImage: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&q=80&w=1200",
  whatsappNumber: "15553928871",
  enableQuoteViaWhatsapp: true,
  
  petCategories: [{ categoryName: "Dogs" }, { categoryName: "Cats" }, { categoryName: "Avian/Birds" }, { categoryName: "Exotic Reptiles" }],
  categories: [{ categoryName: "Veterinary Medicine" }, { categoryName: "Pet Boarding" }, { categoryName: "Emergency Hospital" }],
  specializedServices: [{ serviceName: "Orthopedic Laser Surgery" }, { serviceName: "Ultrasound & Digital X-Ray" }, { serviceName: "Hydrotherapy Wellness" }, { serviceName: "Dental Prophylaxis" }],
  
  serviceCoverage: {
    type: "radius",
    radiusKm: 25,
    neighborhoods: ["North End", "Downtown Hub", "Greenwood Suburbs"]
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
    instagram: "https://instagram.com",
    twitter: "https://twitter.com"
  },
  
  photos: [
    { url: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=600", alt: "Lab" },
    { url: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=600", alt: "Suites" },
    { url: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&q=80&w=600", alt: "Grooming" }
  ]
};

const MOCK_REVIEWS = [
  {
    _id: "rev_01",
    userName: "Sarah Jenkins",
    created_at: "2026-06-14T10:30:00.000Z",
    rating: 5,
    comment: "Dr. Alistair and the nursing crew saved my golden retriever after an accidental poisoning incident. The communication level was phenomenal, and the cost structure was highly transparent. Truly an elite facility."
  }
];

const MOCK_OFFERS = [
  {
    _id: "off_01",
    title: "Annual Preventative Checkup Bundle - 25% Off",
    description: "Get full core screening, blood panel metrics, standard deworming treatment doses, and dynamic vaccinations all under one packaged cost.",
    media: [{ type: "image", url: "https://images.unsplash.com/photo-1535268647977-a403b69fc756?auto=format&fit=crop&q=80&w=500" }]
  }
];

const ListingDetailPage = () => {
  const { user } = useAuth();
  const [listing] = useState(MOCK_LISTING_DETAILS);
  const [reviews, setReviews] = useState(MOCK_REVIEWS);
  const [offers] = useState(MOCK_OFFERS);
  
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [showPhone, setShowPhone] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    incrementListingViews();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rating) return;
    const newReview = {
      _id: `rev_${Date.now()}`,
      userName: user?.name || "Anonymous Guest",
      created_at: new Date().toISOString(),
      rating: rating,
      comment: comment
    };
    setReviews([newReview, ...reviews]);
    setComment("");
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
            <div className="mb-2">
              <span className="cyber-badge-premium"><FaShieldAlt className="me-1"/> Verified Partner</span>
            </div>
            <h1 className="text-dark headline-font fw-bold display-5 mb-0" style={{ letterSpacing: "-0.03em" }}>{listing.shopName}</h1>
          </Container>
        </div>
      </div>

      <Container className="mt-4">
        <Row className="g-4">
          {/* MAIN BLOCK */}
          <Col lg={8}>
            <div className="d-flex flex-wrap gap-2 mb-4">
              {listing.petCategories?.map((cat, i) => (
                <span className="tag-pet-pill" key={i}>{cat.categoryName}</span>
              ))}
            </div>

            <div className="clean-white-block mb-4">
              <span className="clean-accent-label">About the practice</span>
              <p className="lh-relaxed text-dark fs-5 mb-4" style={{ opacity: 0.85, fontWeight: "400" }}>{listing.description}</p>
              
              <Row className="g-4 pt-4 border-top border-light">
                {listing.categories?.length > 0 && (
                  <Col md={6}>
                    <span className="clean-accent-label">Specialty Verticals</span>
                    <div className="d-flex flex-wrap gap-2">
                      {listing.categories.map((c, i) => <span key={i} className="badge bg-light border text-dark px-3 py-2 rounded font-monospace">{c.categoryName}</span>)}
                    </div>
                  </Col>
                )}
                {listing.specializedServices?.length > 0 && (
                  <Col md={6}>
                    <span className="clean-accent-label">Specializations</span>
                    <div className="d-flex flex-wrap gap-2">
                      {listing.specializedServices.map((s, i) => <span key={i} style={{ color: '#ff4e00', fontSize: '0.85rem' }} className="fw-semibold font-monospace d-block">✓ {s.serviceName}</span>)}
                    </div>
                  </Col>
                )}
              </Row>
            </div>

            {/* IMAGES */}
            {listing.photos?.length > 0 && (
              <div className="clean-white-block mb-4">
                <span className="clean-accent-label">Facility Tour</span>
                <Row className="g-3">
                  {listing.photos.map((img, i) => (
                    <Col md={4} sm={6} key={i}>
                      <div className="gallery-clean-frame" onClick={() => { setSelectedImage(img.url); setShowGalleryModal(true); }}>
                        <img src={img.url} alt={img.alt} className="w-100" style={{ height: "160px", objectFit: "cover", cursor: "pointer" }} />
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            )}

            {/* REVIEWS */}
            <div className="clean-white-block mb-4">
              <span className="clean-accent-label">Community Reviews</span>
              {reviews.map((r, index) => (
                <div key={r._id} className={`py-4 ${index !== reviews.length - 1 ? 'border-bottom border-light' : ''}`}>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="fw-bold text-dark mb-0">{r.userName}</h6>
                    <span className="text-muted small font-monospace">{new Date(r.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="mb-2">
                    {Array.from({ length: 5 }).map((_, idx) => <FaStar key={idx} color={idx < r.rating ? "#ff4e00" : "#e2e8f0"} />)}
                  </div>
                  <p className="text-secondary mb-0 small">{r.comment}</p>
                </div>
              ))}
            </div>
          </Col>

          {/* RIGHT PANELS */}
          <Col lg={4}>
            <div className="position-sticky" style={{ top: "2rem" }}>
              <div className="clean-white-block mb-4">
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <span className="headline-font fw-bold text-dark fs-5">Contact Hub</span>
                  <div className="d-flex align-items-center gap-2 text-dark small font-monospace">
                    <span className="live-glow-dot"></span> CONNECTED
                  </div>
                </div>

                <div className="mb-4">
                  <button className="btn-clean-primary w-100 py-3" onClick={() => setShowPhone(!showPhone)}>
                    {showPhone ? listing.phone : "Show Phone Identity"}
                  </button>
                </div>

                <div className="d-flex flex-column gap-3 text-sm border-top border-light pt-4 font-monospace">
                  <div className="d-flex align-items-start gap-3">
                    <FaEnvelope style={{ color: '#ff4e00' }} className="mt-1"/>
                    <div>
                      <span className="d-block text-muted small">Email Address</span>
                      <span className="text-dark small fw-medium">{listing.email}</span>
                    </div>
                  </div>
                  <div className="d-flex align-items-start gap-3">
                    <FaMapMarkerAlt style={{ color: '#ff4e00' }} className="mt-1"/>
                    <div>
                      <span className="d-block text-muted small">Location Coordinates</span>
                      <span className="text-dark small fw-medium">{listing.address}</span>
                    </div>
                  </div>
                </div>

                {/* SOCIAL BUTTONS */}
                {listing.socialAnchors && (
                  <div className="mt-4 pt-4 border-top border-light">
                    <span className="clean-accent-label">Social Channels</span>
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
                  <span className="clean-accent-label"><FaClock className="me-1"/> Practice Hours</span>
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

                {listing.whatsappNumber && (
                  <Button variant="success" className="w-100 rounded py-3 mt-4 d-flex align-items-center justify-content-center gap-2 fw-bold text-white border-0" style={{ background: '#22c55e' }} href={`https://wa.me/${listing.whatsappNumber}`} target="_blank">
                    <FaWhatsapp size={20}/> Message via WhatsApp
                  </Button>
                )}
              </div>

              {/* WRITE REVIEW */}
              <div className="clean-white-block">
                <span className="clean-accent-label text-center">Leave feedback</span>
                <Form onSubmit={handleSubmit}>
                  <div className="d-flex justify-content-center gap-2 mb-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <span key={i} style={{ fontSize: "1.8rem", cursor: "pointer", color: i <= rating ? "#ff4e00" : "#e2e8f0", transition: 'color 0.2s' }} onClick={() => setRating(i)}>★</span>
                    ))}
                  </div>
                  <Form.Group className="mb-3">
                    <Form.Control as="textarea" rows={3} placeholder="Describe your experience with the team..." value={comment} onChange={(e) => setComment(e.target.value)} required className="clean-input-field" />
                  </Form.Group>
                  <button type="submit" className="btn-clean-primary w-100 py-2.5">Submit Report</button>
                </Form>
              </div>
            </div>
          </Col>
        </Row>

        {/* OFFERS REEL */}
        {offers.length > 0 && (
          <div className="mt-5 pt-5 border-top border-light">
            <div className="d-flex align-items-center gap-2 mb-4">
              <span className="live-glow-dot"></span>
              <h3 className="headline-font text-dark fw-bold mb-0">Active Notices & Offers</h3>
            </div>
            <Row className="g-4">
              {offers.map((offer) => (
                <Col md={6} key={offer._id}>
                  <div className="clean-white-block h-100 p-0 overflow-hidden">
                    <div style={{ aspectRatio: '16/6', overflow: 'hidden' }} className="border-bottom border-light">
                      <img src={offer.media[0].url} alt={offer.title} className="w-100 h-100" style={{ objectFit: 'cover' }} />
                    </div>
                    <div className="p-4">
                      <h5 className="text-dark headline-font fw-bold mb-2">{offer.title}</h5>
                      <p className="text-muted small mb-0 lh-relaxed">{offer.description}</p>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        )}
      </Container>

      {/* LIGHTBOX MODAL */}
      <Modal show={showGalleryModal} onHide={() => setShowGalleryModal(false)} centered size="lg">
        <Modal.Body className="p-0 bg-transparent rounded overflow-hidden border-0">
          <img src={selectedImage} alt="Preview" className="w-100" style={{ maxHeight: "80vh", objectFit: "contain" }} />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ListingDetailPage;