// import React, { useState, useEffect, useRef } from "react";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import "./Css/ListingDetailPage.css";
// import dummyImage from "../dummy.jpg";
// import { FaStar, FaStarHalfAlt, FaRegStar, FaAngleLeft, FaAngleRight  } from "react-icons/fa";
// import { Form, Button, Container, Row, Col, Alert, Modal } from "react-bootstrap";
// import { useAuth } from "../contexts/AuthContext";
// import { incrementListingViews } from "../utils/engagementTracker";
// import { useEngagementGate } from "../hooks/useEngagementGate";
// import AuthGateModal from "../hooks/AuthGateModel";
// import { Helmet } from "react-helmet-async";
// import { validateField } from "../utils/formValidation";
// import { BiChevronLeft, BiChevronRight } from "react-icons/bi";



// const API_BASE =
//   process.env.NODE_ENV === "production"
//     ? process.env.REACT_APP_API_URL
//     : "http://localhost:5000";

// const ListingDetailPage = () => {
//   const alertRef = useRef(null);
// const [showAuthGate, setShowAuthGate] = useState(false);

//   const { user, authLoading } = useAuth();
//     const engagementGate = useEngagementGate(user);
  
//   const fileInputRef = useRef(null);
//   const navigate = useNavigate();
//   const [comment, setComment] = useState("");
//   const [userEmail, setUserEmail] = useState("");
//   const [userName, setUserName] = useState("");
//   const [photos, setPhotos] = useState([]);
//   const [showGalleryModal, setShowGalleryModal] = useState(false);
// const [selectedImage, setSelectedImage] = useState(null);
// const [offers, setOffers] = useState([]);
// const [currentPage, setCurrentPage] = useState(1);
// const offersPerPage = 2; 
// const [carouselIndices, setCarouselIndices] = useState({});

// const moveCarousel = (offerId, direction, totalMedia) => {
//   setCarouselIndices((prev) => {
//     const currentIdx = prev[offerId] || 0;
//     let nextIdx = direction === 'next' ? currentIdx + 1 : currentIdx - 1;

//     if (nextIdx >= totalMedia) nextIdx = 0;
//     if (nextIdx < 0) nextIdx = totalMedia - 1;

//     return { ...prev, [offerId]: nextIdx };
//   });
// };
// // 3️⃣ FETCH OFFERS FOR THIS LISTING

//   // const { listingId } = useParams(); // from URL
//   // const id = listingId;
// //   const { slugId } = useParams();
// //   const getIdFromSlug = (slugId) => {
// //   const parts = slugId.split("-");
// //   return parts[parts.length - 1]; // last part = Mongo _id
// // };
// // const id = getIdFromSlug(slugId);
// const { slug } = useParams();
// console.log("Listing slug:", slug);
//   const [listing, setListing] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [alert, setAlert] = useState({ show: false, type: "", message: "" });
//   const [listingName, setListingName] = useState("");
// const [isSubmitting, setIsSubmitting] = useState(false);
// const [rating, setRating] = useState(0);
//   // --- Review states ---
//   const [reviews, setReviews] = useState([]);
//  const [showPhone, setShowPhone] = useState(false);
// const [isTracking, setIsTracking] = useState(false);
//  const [showUrl, setShowUrl] = useState(false);
// const [urlIsTracking, setUrlIsTracking] = useState(false);

//   const [form, setForm] = useState({
//     userName: "",
//     rating: 5,
//     comment: "",
//   });
//   const [hoverRating, setHoverRating] = useState(0);

//   const renderStars = () => {
//     const stars = [];
//     for (let i = 1; i <= 5; i++) {
//       stars.push(
//         <span
//           key={i}
//           style={{
//             fontSize: "1.8rem",
//             cursor: "pointer",
//             color: i <= rating ? "#ffc107" : "#ccc",
//           }}
//           onClick={() => setRating(i)}
//         >
//           ★
//         </span>
//       );
//     }
//     return stars;
//   };
//   useEffect(() => {
//   if (!listing?._id) return;

//   const fetchListingOffers = async () => {
//     try {
//       const res = await fetch(`${API_BASE}/api/offers/listing/${listing._id}`);
//       const data = await res.json();
//       if (data.success) {
//         setOffers(data.offers);
//       }
//     } catch (err) {
//       console.error("Error fetching listing offers:", err);
//     }
//   };

//   fetchListingOffers();
// }, [listing?._id]);
// useEffect(() => {
//   if (!authLoading && !user && engagementGate) {
//     setShowAuthGate(true);
//   }
// }, [authLoading, user, engagementGate]);
// useEffect(() => {
//   if (user) {
//     setShowAuthGate(false);
//   }
// }, [user]);

//   useEffect(() => {
//   incrementListingViews();
// }, []);

//   useEffect(() => {
//   if (user) {
//     setUserName(user.name || "");
//     setUserEmail(user.email || "");
//   }
// }, [user]);
//   // ============================================================
//   // 1️⃣ FETCH LISTING DETAILS
//   // ============================================================
//   useEffect(() => {
//     const fetchListing = async () => {
//       try {
//         const res = await fetch(`${API_BASE}/api/listing/incviewsslug/slug/${slug}`);
//         const data = await res.json();

//         if (data.success) {
//           setListing(data.listing);
//           setListingName(data.listing.shopName);
//           console.log("Listing Data:", data.listing);
//         }
//       } catch (err) {
//         console.error("Error fetching listing:", err.message);
//       }
//       setLoading(false);
//     };

//     fetchListing();
//   }, [slug]);

// // ============================================================

//   useEffect(() => {
//   if (alert.show && alertRef.current) {
//     alertRef.current.scrollIntoView({
//       behavior: "smooth",
//       block: "center"
//     });

//     alertRef.current.focus();
//   }
// }, [alert]);
// useEffect(() => {
//   window.scrollTo({
//     top: 0,
//     behavior: "smooth", // optional
//   });
// }, [slug]);

//   // ============================================================
//   // 2️⃣ FETCH REVIEWS FOR THIS LISTING
//   // ============================================================
//   // useEffect(() => {
//   //   const fetchReviews = async () => {
//   //     try {
//   //       const res = await fetch(`${API_BASE}/api/reviews/list/${listing._id}`);
//   //       const data = await res.json();

//   //       if (data.success) {
//   //         setReviews(data.reviews);
//   //       }
//   //     } catch (err) {
//   //       console.error("Error fetching reviews:", err);
//   //     }
//   //   };

//   //   fetchReviews();
//   // }, [listing]);
//   useEffect(() => {
//   if (!listing?._id) return;

//   const fetchReviews = async () => {
//     try {
//       const res = await fetch(
//         `${API_BASE}/api/reviews/list/${listing._id}`
//       );

//       const data = await res.json();

//       if (data.success) {
//         setReviews(data.reviews);
//       }
//     } catch (err) {
//       console.error("Error fetching reviews:", err);
//     }
//   };

//   fetchReviews();
// }, [listing?._id]);

//   // ============================================================
//   // 3️⃣ CALCULATE AVERAGE RATING
//   // ============================================================
//   const averageRating = () => {
//     if (!reviews.length) return 0;
//     return (
//       reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
//     ).toFixed(1);
//   };

//   // ============================================================
//   // ⭐ STAR RENDER UTILITY
//   // ============================================================
//   const renderStarsCal = (value) => {
//     const full = Math.round(value);
//     return Array.from({ length: 5 }).map((_, i) => (
//       <FaStar
//         key={i}
//         color={i < full ? "#ffc107" : "#e4e5e9"}
//       />
//     ));
//   };
//   const renderAvgStarsCal = (value) => {
//   const stars = [];

//   const fullStars = Math.floor(value);
//   const hasHalfStar = value % 1 >= 0.5;
//   const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

//   // Full stars
//   for (let i = 0; i < fullStars; i++) {
//     stars.push(<FaStar key={`full-${i}`} color="#ffc107" />);
//   }

//   // Half star
//   if (hasHalfStar) {
//     stars.push(<FaStarHalfAlt key="half" color="#ffc107" />);
//   }

//   // Empty stars
//   for (let i = 0; i < emptyStars; i++) {
//     stars.push(<FaRegStar key={`empty-${i}`} color="#e4e5e9" />);
//   }

//   return stars;
// };
// // Full -round off
//   // const renderAvgStarsCal = (value) => {
//   //   const full = Math.round(value);
//   //   return Array.from({ length: 5 }).map((_, i) => (
//   //     <FaStar
//   //       key={i}
//   //       color={i < full ? "#ffc107" : "#e4e5e9"}
//   //     />
//   //   ));
//   // };

//   // ============================================================
//   // 4️⃣ SUBMIT NEW REVIEW (GUEST) without image
//   // ============================================================
//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();

//   //   if (!rating) {
//   //     setAlert({ show: true, type: "danger", message: "Please select a rating." });
//   //     return;
//   //   }

//   //   if (!comment.trim()) {
//   //     setAlert({ show: true, type: "danger", message: "Please enter a comment." });
//   //     return;
//   //   }

//   //   if (!userName.trim() || !userEmail.trim()) {
//   //     setAlert({
//   //       show: true,
//   //       type: "danger",
//   //       message: "Name and Email are required for guest reviews.",
//   //     });
//   //     return;
//   //   }

//   //   setIsSubmitting(true);
//   //   try {
//   //     const res = await fetch(`${API_BASE}/api/reviews`, {
//   //       method: "POST",
//   //       headers: { "Content-Type": "application/json" },
//   //       body: JSON.stringify({
//   //         listingId: id,
//   //         userName,
//   //         userEmail,
//   //         rating,
//   //         comment,
//   //         photos,
//   //       }),
//   //     });

//   //     const data = await res.json();
//   //     if (res.ok) {
//   //       setAlert({
//   //         show: true,
//   //         type: "success",
//   //         message: "Review submitted successfully! Awaiting admin approval.",
//   //       });
//   //       setRating(0);
//   //       setComment("");
//   //       setUserName("");
//   //       setUserEmail("");
//   //       setPhotos([]);
        
//   //     } else {
//   //       setAlert({ show: true, type: "danger", message: data.message || "Error submitting review." });
//   //     }
//   //   } catch (err) {
//   //     setAlert({ show: true, type: "danger", message: "Network error while submitting review." });
//   //   } finally {
//   //     setIsSubmitting(false);
//   //   }
//   // };

//   const handleSubmit = async (e) => {
//   e.preventDefault();
//   if (!rating) {
//     setAlert({ show: true, type: "danger", message: "Please select a rating." });
//     return;
//   }
//   if (!user) {
//       const nameError = validateField("name", userName, {maxLength: 50});
//       if (nameError) {
//         setAlert({ show: true, type: "danger", message: nameError });
//         return;
//       }
//       const emailError = validateField("email", userEmail);
//       if (emailError) {
//         setAlert({ show: true, type: "danger", message: emailError });
//         return;
//       }
//     }
//     const commentError = validateField("reviewText", comment, {
//       maxLength: 300,
//       label: "Comment"
//     });
//     if (commentError) {
//       setAlert({ show: true, type: "danger", message: commentError });
//       return;
//     }
//   // if (!comment.trim()) {
//   //     setAlert({ show: true, type: "danger", message: "Please enter a comment." });
//   //     return;
//   //   }
//   //   if (comment.length > 300) {
//   //     setAlert({
//   //       show: true,
//   //       type: "danger",
//   //       message: "Comment cannot exceed 300 characters.",
//   //     });
//   //     return;
//   //   }

//     // if (!userName.trim() || !userEmail.trim()) {
//     //   setAlert({
//     //     show: true,
//     //     type: "danger",
//     //     message: "Name and Email are required for guest reviews.",
//     //   });
//     //   return;
//     // }
//     if (!user && (!userName.trim() || !userEmail.trim())) {
//       setAlert({
//         show: true,
//         type: "danger",
//         message: "Name and Email are required for guest reviews.",
//       });
//       return;
//     }

//     setIsSubmitting(true);

//   const formData = new FormData();
//   formData.append("listingId", listing._id);
//   formData.append("userName", userName);
//   formData.append("userEmail", userEmail);
//   formData.append("rating", rating);
//   formData.append("comment", comment);

//   photos.forEach((file) => {
//     formData.append("photos", file);
//   });

//   try {
//     const res = await fetch(`${API_BASE}/api/reviews`, {
//       method: "POST",
//       body: formData, // ✅ NO headers
//     });

//     const data = await res.json();

//     if (res.ok) {
//       setAlert({
//         show: true,
//         type: "success",
//         message: "Review submitted successfully! Awaiting approval.",
//       });

//       setRating(0);
//       setComment("");
//       setUserName("");
//       setUserEmail("");
//       setPhotos([]);
//       fileInputRef.current.value = "";
//     }
//   } catch (err) {
//     setAlert({ show: true, type: "danger", message: err.message });
//   } finally {
//     setIsSubmitting(false);
//   }
// };


//   if (loading) return <div>Loading...</div>;
//   if (!listing) return <div>Listing not found.</div>;

//   // const handleShowPhone = async () => {
//   //   if (!user) {
//   //     window.google.accounts.id.prompt(); // force login
//   //     return;
//   //   }
//   //   setIsTracking(true);

//   //   await fetch(`${API_BASE}/api/enquiry`, {
//   //     method: "POST",
//   //     headers: { "Content-Type": "application/json" },
//   //     body: JSON.stringify({
//   //       listingId: listing._id,
//   //       userName: user.name,
//   //       userEmail: user.email,
//   //       action: "phone_view",
//   //     }),
//   //   });

//   //   setShowPhone(true);
//   // };
//   const handleShowPhone = async () => {
//   if (!user) {
//     setShowAuthGate(true);
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
//   setIsTracking(false);
// };
// const handleShowUrl = async () => {
//   if (!user) {
//     setShowAuthGate(true);
//     return;
//   }

//   setUrlIsTracking(true);

//   await fetch(`${API_BASE}/api/enquiry/url`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       listingId: listing._id,
//       userName: user.name,
//       userEmail: user.email,
//       action: "url_view",
//     }),
//   });

//   setShowUrl(true);
//   setUrlIsTracking(false);
// };

// const handleFileChange = (e) => {
//   const files = Array.from(e.target.files);

//   for (let file of files) {
//     if (file.size > 2 * 1024 * 1024) {
//       setAlert({
//         show: true,
//         type: "danger",
//         message: `${file.name} exceeds 2MB limit`,
//       });

//       e.target.value = ""; // reset input
//       return;
//     }
//   }

//   setPhotos(files);
// };
// const shortAddress = (address) => {
//   if (!address) return "";

//   // Remove pincode
//   address = address.replace(/\b\d{6}\b/g, "").trim();

//   // Split by comma
//   let parts = address
//     .split(",")
//     .map((part) => part.trim())
//     .filter(Boolean);

//   // Take last 3 parts
//   if (parts.length >= 3) {
//     return parts.slice(-3).join(", ");
//   }

//   return address;
// };

//   return (
//    <>
//    <Helmet>
//   <title>
//     {`Vet and Pets - ${shortAddress(
//       listing?.address
//     )}`}
//   </title>

//   <meta
//     name="description"
//     content={
//       listing?.description ||
//       "Find trusted pet care services on Vet & Pets."
//     }
//   />
// </Helmet>

//     <section className="listing-detail-section p-0 mt-0">
      
//        <AuthGateModal
//         show={showAuthGate}
//         onClose={() => setShowAuthGate(false)}
//       />
//       {listing.bannerImage && (
//           <div className="mb-4">
//             <img
//               src={`${API_BASE}/${listing.bannerImage}`}
//               alt={listing.shopName}
//               style={{
//                 width: "100%",
//                 height: "auto", // ✅ never cut
                
//               }}
//             />
//           </div>
//         )}
//       <Container>
        

//         <Row className="">
//           <Col md={8}>
          
//             <h2  className="mb-3">{listing.shopName}</h2>
//             <div className="d-flex gap-2">
//              {console.log("petcats:",listing.petCategories)}
//      {listing.petCategories?.length > 0 && (
//         listing.petCategories.map((cat, index) => (
//           <div className="listing-type">
//           <span key={index} className="">
//             {cat.categoryName}
//           </span>
//           </div>
//         ))
//       )}
//           </div>
        
          

//         {/* TOP AREA */}
//         <Row className="mt-3">
//           <Col md={12}>

//             <p className="listing-description text-align-justify">{listing.description}</p>

//           {listing.categories?.length > 0 && (
//         <div className="listing-category">
//           {listing.categories?.map((cat, index) => (
//           <span key={index} className="service-tag  bg-primary text-white">
//             {cat.categoryName}
//           </span>
//         ))}
//         </div>
//         )}
//         {listing.specializedServices?.length > 0 && (
//         <div className="listing-specialized-service">
//           {listing.specializedServices?.map((cat, index) => (
//           <span key={index} className="service-tag  bg-warning text-black">
//             {cat.serviceName}
//           </span>
//         ))}        
//         </div>
//         )}

            
//           </Col>

          
//         </Row>

//         {/* GALLERY
//         {listing.photos?.length > 0 && (
//           <div className="listing-gallery mt-4">
//             <h2>Gallery</h2>
//             <Row>
//               {listing.photos && listing.photos.length > 0 && listing.photos.map((img, i) => (
//                 <Col md={4} key={i} className="mb-3">
//                   <img
//                     src={img}
//                     alt={`${listing.shopName}-${i}`}
//                     className="img-fluid"
//                     style={{ borderRadius: 10, objectFit: "cover" }}
//                   />
//                 </Col>
//               ))}
//             </Row>
//           </div>
//         )} */}
//         {/* GALLERY */}
// {listing.photos?.length > 0 && (
//   <div className="listing-gallery mt-4">
//     <h2>Gallery</h2>

//     <Row>
//       {listing.photos.map((img, i) => (
//         <Col md={4} sm={6} xs={12} key={i} className="mb-3">
//           <div
//             className="gallery-item"
//             onClick={() => {
//               setSelectedImage(img.url);
//               setShowGalleryModal(true);
//             }}
//           >
//             <img
//               src={`${API_BASE}/${img.url}`}
//               alt={img.alt || `${listing.shopName}-${i}`}
//               className="gallery-img"
//             />
//           </div>
//         </Col>
//       ))}
//     </Row>
//   </div>
// )}

//         <Modal
//   show={showGalleryModal}
//   onHide={() => setShowGalleryModal(false)}
//   centered
//   size="lg"
// >
//   <Modal.Body className="p-0">
//     <img
//       src={`${API_BASE}/${selectedImage}`}
//       alt="Gallery preview"
//       className="w-100"
//       style={{ maxHeight: "80vh", objectFit: "contain" }}
//     />
//   </Modal.Body>
// </Modal>
//         {/* REVIEWS SUMMARY */}
//         <hr />
//         {/* REVIEW LIST */}
//         <div className="review-list mt-3 ">
//           <div className="review-summary mb-3">
//             <div style={{ display: "flex", gap: 12, alignItems: "left" }}>
//               <div style={{ fontSize: 30, fontWeight: "bold" }}>
//                 {averageRating()}
//               </div>
//               <div>
//                 {renderAvgStarsCal(averageRating())}
//                 <div style={{ fontSize: 14, color: "#666" }}>
//                   {reviews.length} review(s)
//                 </div>
//               </div>
//             </div>
//           </div>
//           <h5 style={{background: "#eaeaea", padding: "14px", textAlign: "center"}}>Customer Reviews</h5>
//           {console.log(reviews)}
//           {reviews.length === 0 ? (
//             <p>No reviews yet.</p>
//           ) : (
            
//             reviews.map((r) => (
//               <div
//                 key={r._id}
//                 className="review-item"
//                 style={{
//                   borderBottom: "1px solid #ddd",
//                   padding: "10px 0",
//                 }}
//               >
//                 <div
//                   style={{
//                     fontWeight: "bold",
//                     display: "flex",
//                     justifyContent: "space-between",
//                   }}
//                 >
//                   <span>{r.userName}</span>
//                   <span style={{ color: "#888" }}>
//                     {new Date(r.created_at).toLocaleDateString()}
//                   </span>
//                 </div>
//                 <div>{renderStarsCal(r.rating)}</div>
//                 {/* {console.log("Review :",r.rating)} */}
//                 <p>{r.comment}</p>
//                 {r.photos && r.photos.length > 0 &&
//                   r.photos.map((item, index) => (
//                     <img width={250}
//                       key={index}
//                       src={`${API_BASE}/${item}`}
//                       alt={`Review-${index}`}
//                     />
//                   ))
//                 }

//               </div>
//             ))
//           )}
//         </div>

        

        
//           </Col>

//           <Col md={4} className="bg-grey"> 
//           {/* SIDE AREA - Placeholder for future content */}
//           {/* REVIEW FORM */}
//           <Row className="shadow-sm m-4 rounded">
//             <h5 style={{background: "#eaeaea", padding: "14px", textAlign: "center"}}>Contact Details</h5>
//             <div className="listing-contact mt-3 mb-3">
              
//               <ul>
//                 <li>
//                   {/* <strong>Phone:</strong>{" "} */}
//                   {/* <a href={`tel:${listing.phone}`}>{listing.phone}</a> */}
//                   <li>
//                     <strong>Phone:</strong>{" "}
//                     {!showPhone ? (
//                       <Button
//                         size="sm"
//                         variant="outline-primary"
//                         onClick={handleShowPhone}
//                         disabled={isTracking}
//                       >
//                         {isTracking ? "Please wait..." : "Show Number"}
//                       </Button>
//                     ) : (
//                       <a href={`tel:${listing.phone}`} className="ms-2">
//                         {listing.phone}
//                       </a>
//                     )}
//                   </li>

//                 </li>
//                 <li>
//                   <strong>Email:</strong>{" "}
//                   <a href={`mailto:${listing.email}`}>
//                     {listing.email}
//                   </a>
//                 </li>
//                 <li>
//                   <strong>Address:</strong> {listing.address}
//                 </li>
//                 <li>
//                   <strong>City:</strong> {listing.city?.city} {" "} {listing.country}
//                 </li>
//                 <li>
//                   <strong>Website:</strong>{" "}
//                    {listing.mapUrl &&
//                     listing.mapUrl.trim() !== "" &&
//                     (
//                   !showUrl ? (
//                     <Button
//                       size="sm"
//                       variant="outline-primary"
//                       onClick={handleShowUrl}
//                       disabled={urlIsTracking}
//                     >
//                       {isTracking ? "Please wait..." : "Show Website Url"}
//                     </Button>
//                   ) : (
//                     <a
//                       href={listing.mapUrl}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                     >
//                       {listing.mapUrl}
//                     </a>
//                   ))}
                  
//                 </li>
//                 <li>
//   <strong>Working Hours:</strong>
//   <div className="mt-2">
//     {listing.businessHours?.length > 0 ? (
//       listing.businessHours.map((bh, index) => (
//         <div key={index} className="d-flex justify-content-between">
//           <span>{bh.day}</span>
//           <span>
//             {bh.closed ? "Closed" : `${bh.open} - ${bh.close}`}
//           </span>
//         </div>
//       ))
//     ) : (
//       <span>Not available</span>
//     )}
//   </div>
// </li>
//               </ul>
//               {console.log("Created By Type:", listing.created_by_type)}
//         {listing.created_by_type && listing.created_by_type === "admin" && !(listing.isClaimed) && (
//           <Button
//             variant="primary"
//             className="w-100"
//             // onClick={() => navigate(`/claim/${listing._id}`)}
//             onClick={() => navigate(`/claim/${listing.slug}`)}
//           >
//             Claim this business
//           </Button>
//         )}
//             </div>
//           </Row>
//         <Row className=" shadow-sm m-4 rounded">
       
//           <h5 style={{background: "#eaeaea", padding: "14px", textAlign: "center"}}>Write Review</h5>
//         <Col md={12} lg={12}>
//           {alert.show && (
//             <Alert ref={alertRef}
//               variant={alert.type}
//               onClose={() => setAlert({ show: false })}
//               dismissible
//             >
//               {alert.message}
//             </Alert>
//           )}

//           <Form onSubmit={handleSubmit}>
//             <Form.Group className="mb-3 text-center">
//               <Form.Label><strong>Rating  <span className="text-red">*</span></strong></Form.Label>
//               <div>{renderStars()}</div>
//             </Form.Group>

//             {user ? (
//               <>
//               <Form.Group className="mb-3">
//                 {/* <Form.Label>Your Name</Form.Label> */}
//                 <Form.Control
//                   type="text"
//                   placeholder="Enter your name"
//                   value={userName}
//                   onChange={(e) => setUserName(e.target.value)}
//                   required
//                   hidden
//                 />
//               </Form.Group>

//               <Form.Group className="mb-3">
//                 {/* <Form.Label>Your Email</Form.Label> */}
//                 <Form.Control
//                   type="email"
//                   placeholder="Enter your email"
//                   value={userEmail}
//                   onChange={(e) => setUserEmail(e.target.value)}
//                   required
//                   hidden
//                 />
//               </Form.Group>
//               </>
//             ) : (
//               <>
//               <Form.Group className="mb-3">
//               <Form.Label>Your Name <span className="text-red">*</span></Form.Label>
//               <Form.Control
//                 type="text"
//                 placeholder="Enter your name"
//                 value={userName}
//                 onChange={(e) => setUserName(e.target.value)}
//                 required
                
//               />
//             </Form.Group>

//             <Form.Group className="mb-3">
//               <Form.Label>Your Email <span className="text-red">*</span></Form.Label>
//               <Form.Control
//                 type="email"
//                 placeholder="Enter your email"
//                 value={userEmail}
//                 onChange={(e) => setUserEmail(e.target.value)}
//                 required
                
//               />
//             </Form.Group>
//             </>
//             )}

            
//             <Form.Group className="mb-4">
//               <Form.Label>Upload Photos [Optional]</Form.Label>
//               <Form.Control
//                 type="file"
//                 name="photos"
//                 multiple
//                 accept="image/*"
//                 // onChange={(e) => setPhotos(Array.from(e.target.files))}
//                 onChange={handleFileChange}
//                 ref = {fileInputRef}
//               />
//               <Form.Text className="text-muted">
//                 Note : You can upload multiple images (JPG, PNG, WEBP) up to 2MB each.
//               </Form.Text>
//             </Form.Group>

//             {/* <Form.Group className="mb-3">
//               <Form.Label>Comment <span className="text-red">*</span></Form.Label>
//               <Form.Control
//                 as="textarea"
//                 rows={4}
//                 placeholder="Write your review..."
//                 value={comment}
//                 onChange={(e) => setComment(e.target.value)}
//                 required
//               />
//             </Form.Group> */}
//             <Form.Group className="mb-3">
//               <Form.Label>Comment <span className="text-red">*</span></Form.Label>
//                 <Form.Control
//                   as="textarea"
//                   rows={4}
//                   placeholder="Write your review..."
//                   value={comment}
//                   onChange={(e) => setComment(e.target.value)}
//                   required
//                   maxLength={300} // ✅ limit to 300 characters
//                 />
//               </Form.Group>                
//             <div className="text-end text-muted">
//               {comment.length}/300 characters
//             </div>

//             <div className="mb-3">
//               <Button
//                 variant="primary"
//                 type="submit"
//                 disabled={isSubmitting}
//               >
//                 {isSubmitting ? "Submitting..." : "Submit Review"}
//               </Button>
//             </div>
//           </Form>
//         </Col>
//       </Row>
      
//           </Col>
//         </Row>

//        {/* ================= OFFERS SECTION ================= */}
// {/* {offers.length > 0 && (() => {
//   // Calculate Pagination Slices
//   const indexOfLastOffer = currentPage * offersPerPage;
//   const indexOfFirstOffer = indexOfLastOffer - offersPerPage;
//   const currentOffers = offers.slice(indexOfFirstOffer, indexOfLastOffer);
//   const totalPages = Math.ceil(offers.length / offersPerPage);
  

//   return (
//     <div className="listing-offers-section mt-4 mb-4">
//       <h3 className="mb-3" style={{ }}>
//         Active Offers & Announcements
//       </h3>
//       <Row>
//         {currentOffers.map((offer) => {
//           const currentImgIdx = carouselIndices[offer._id] || 0;
//           const currentMedia = offer.media && offer.media[currentImgIdx];
//           const encodedId = btoa(offer._id);

//           const getMediaUrl = (url) => {
//             if (!url) return '';
//             return url.startsWith('http') ? url : `${API_BASE}/${url}`;
//           };

//           return (
//             <Col md={6} key={offer._id} className="mb-3">
  
  
//   <Link to={`/offers?ref=${encodedId}`} className="text-decoration-none" style={{ display: 'block', height: '100%' }}>
//     <div className="card h-100 shadow-sm border-0" style={{ borderRadius: "12px", overflow: "hidden" }}>
      
      
//       <div 
//         className="position-relative bg-dark" 
//         style={{ aspectRatio: '16/9', overflow: "hidden", width: "100%" }}
//         onClick={(e) => {
//           if (offer.media?.length > 1) e.stopPropagation();
//         }}
//       >
//         {offer.media && offer.media.length > 0 && currentMedia ? (
//           <>
//             {currentMedia.type === 'image' ? (
//               <img 
//                 src={getMediaUrl(currentMedia.url)} 
//                 alt={offer.title} 
//                 className="w-100 h-100"
//                 style={{ objectFit: 'cover', position: 'absolute', top: 0, left: 0 }}
//               />
//             ) : (
//               <video
//                 src={getMediaUrl(currentMedia.url)}
//                 className="w-100 h-100"
//                 style={{ objectFit: 'cover', position: 'absolute', top: 0, left: 0 }}
//                 controls muted loop playsInline
//               />
//             )}

            
//             {offer.media.length > 1 && (
//               <>
//                 <Button 
//                   onClick={(e) => {
//                     e.preventDefault(); // Prevents link navigation
//                     e.stopPropagation();
//                     moveCarousel(offer._id, 'prev', offer.media.length);
//                   }}
//                   variant="light"
//                   className="position-absolute start-0 top-50 translate-middle-y m-2 rounded-circle d-flex align-items-center justify-content-center shadow-sm p-0 border-0"
//                   style={{ width: '32px', height: '32px', backgroundColor: 'rgba(250,250,250,0.85)', zIndex: 10 }}
//                 >
//                   <BiChevronLeft size={22} style={{ color: '#000000' }} />
//                 </Button>
//                 <Button 
//                   onClick={(e) => {
//                     e.preventDefault(); // Prevents link navigation
//                     e.stopPropagation();
//                     moveCarousel(offer._id, 'next', offer.media.length);
//                   }}
//                   variant="light"
//                   className="position-absolute end-0 top-50 translate-middle-y m-2 rounded-circle d-flex align-items-center justify-content-center shadow-sm p-0 border-0"
//                   style={{ width: '32px', height: '32px', backgroundColor: 'rgba(250,250,250,0.85)', zIndex: 10 }}
//                 >
//                   <BiChevronRight size={22} style={{ color: '#000000' }} />
//                 </Button>
//               </>
//             )}
//           </>
//         ) : (
//           <div className="w-100 h-100 d-flex align-items-center justify-content-center text-muted small">No Media Available</div>
//         )}
//       </div>

      
//       <div className="card-body d-flex flex-column">
//         <span 
//           style={{ color: '#ff4e00', backgroundColor: '#ff4e0012', fontSize: '10px', letterSpacing: '0.05em' }}
//           className="text-uppercase fw-bold px-2 py-1 rounded align-self-start mb-2"
//         >
//           {offer.category}
//         </span>
//         <h5 className="card-title text-dark fw-bold">{offer.title}</h5>
//         <p className="card-text text-muted small flex-grow-1">{offer.description}</p>
        
//         <div className="mt-2 pt-2 border-top d-flex justify-content-between text-muted xsmall" style={{ fontSize: "11px" }}>
//           <span>Valid: {new Date(offer.startDate).toLocaleDateString()}</span>
//           <span>Until: {new Date(offer.endDate).toLocaleDateString()}</span>
//         </div>
//       </div>

//     </div>
//   </Link>
// </Col>
//           );
//         })}
//       </Row>

      
//       {totalPages > 1 && (
//         <nav className="d-flex justify-content-center mt-3">
//           <ul className="pagination pagination-sm shadow-sm" style={{ borderRadius: "8px", overflow: "hidden" }}>
//             <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
//               <button type="button" className="page-link" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>
//                 <FaAngleLeft />
//               </button>
//             </li>
//             {[...Array(totalPages)].map((_, index) => {
//               const pageNumber = index + 1;
//               return (
//                 <li key={pageNumber} className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}>
//                   <button type="button" className="page-link" onClick={() => setCurrentPage(pageNumber)}>
//                     {pageNumber}
//                   </button>
//                 </li>
//               );
//             })}
//             <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
//               <button type="button" className="page-link" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}>
//                  <FaAngleRight />
//               </button>
//             </li>
//           </ul>
//         </nav>
//       )}
//     </div>
//   );
// })()} */}
// {/* ================================================== */}
//       </Container>
//     </section>
//     </>
//   );
// };

// export default ListingDetailPage;

import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  FaStar, FaWhatsapp, FaFacebook, FaInstagram, FaTwitter, FaMapMarkerAlt, 
  FaShieldAlt, FaEnvelope, FaClock, FaTags, FaAngleLeft, 
  FaAngleRight, FaBookmark, FaPhoneAlt, FaDirections, FaGlobe, FaAward, 
  FaCheck, FaVideo, FaCar, FaSnowflake, FaTruck, FaWifi, FaCheckCircle,
  FaWheelchair, FaCouch, FaPlay, FaInfoCircle, FaConciergeBell, FaImages, FaComments, FaBullhorn,
  FaHourglassHalf, FaAmbulance, FaCalendarAlt, 
  FaVideoSlash, FaShoppingBag, FaLaptop, FaHospital, FaLightbulb, 
  FaUsers, FaTree, FaBed, FaSwimmingPool, FaHandsHelping, FaTrash, 
  FaUtensils, FaLeaf, FaWater, FaDonate, FaMoon, FaFirstAid, 
  FaNotesMedical, FaPills, FaHandHoldingMedical, FaRunning, FaBabyCarriage, 
  FaBookOpen, FaBuilding, FaVial, FaPhone, FaTools, FaHeart,
  FaYoutube,FaHandSparkles ,
  FaLinkedin
} from "react-icons/fa";
import { Form, Container, Row, Col, Modal, Badge, Nav, Tab, Alert, Button } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { incrementListingViews } from "../utils/engagementTracker";
import { useEngagementGate } from "../hooks/useEngagementGate";
import AuthGateModal from "../hooks/AuthGateModel";
import { Helmet } from "react-helmet-async";
import { validateField } from "../utils/formValidation";
import ReactPaginate from 'react-paginate';
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";

const API_BASE =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_URL
    : "http://localhost:5000";

// Ultra-Clean Modern Stylesheet with Custom Tab Styling
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

  /* React-Paginate Styles */
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
    color: #475569;
    padding-bottom: 6rem;
    letter-spacing: -0.01em;
  }

  .premium-monolith-header {
    height: 380px;
    background-size: cover;
    background-position: center;
    position: relative;
    border-bottom: 1px solid #e2e8f0;
  }
  
  .premium-monolith-header::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, rgba(250, 251, 254, 0.95) 100%);
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
    font-weight: 600;
    border-radius: 8px;
    padding: 12px 20px;
    transition: all 0.3s;
    font-size: 14px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    text-decoration: none;
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

const ListingDetailPage = () => {
  // const AMENITY_ICONS = {
  //   "Parking": <FaCar />,
  //   "Air Conditioning": <FaSnowflake />,
  //   "Home Pickup & Drop": <FaTruck />,
  //   "Online Consultations": <FaVideo />,
  //   "Wheelchair Accessible": <FaWheelchair />,
  //   "Pet Friendly": <FaCouch />,
  //   "WiFi": <FaWifi />,
  //   "Waiting Area" : <FaHourglassHalf />,
  // };
  const AMENITY_ICONS = {
  // Existing & Mapped Icons
  "Parking": <FaCar />,
  "Parking Available": <FaCar />,
  "Air Conditioning": <FaSnowflake />,
  "Air-Conditioned Facility": <FaSnowflake />,
  "Air-Conditioned Rooms": <FaSnowflake />,
  "Air-Conditioned Vehicle": <FaSnowflake />,
  "Pickup & Drop Available": <FaTruck />,
  "Home Pickup & Drop": <FaTruck />,
  "Home Delivery": <FaTruck />,
  "Same-Day Delivery": <FaTruck />,
  "Online Consultations": <FaVideo />,
  "Online Consultation Available": <FaVideo />,
  "Wheelchair Accessible": <FaWheelchair />,
  "Pet Friendly": <FaCouch />,
  "Pets Allowed Indoors": <FaCouch />,
  "Pets Allowed Outdoors": <FaTree />,
  "WiFi": <FaWifi />,
  "Wifi accessible": <FaWifi />,
  "Waiting Area": <FaHourglassHalf />,

  // New Amenities Icon Mapping
  "24x7 Emergency Care": <FaAmbulance />,
  "24x7 Staff Supervision": <FaShieldAlt />,
  "24x7 Transit Support": <FaMapMarkerAlt />,
  "Ambulance Available": <FaAmbulance />,
  "Appointment Required": <FaCalendarAlt />,
  "CCTV Monitoring": <FaShieldAlt />,
  "Donation Facility": <FaDonate />,
  "Drinking Water for Pets": <FaWater />,
  "Emergency Vet Contact Support": <FaPhone />,
  "Flexible Scheduling": <FaCalendarAlt />,
  "Food & Water Bowls Provided": <FaUtensils />,
  "Foster Network": <FaHandsHelping />,
  "GPS Tracking": <FaMapMarkerAlt />,
  "Group Classes": <FaUsers />,
  "Home Training Available": <FaRunning />,
  "Home Visit Available": <FaCar />,
  "Hydrotherapy Equipment": <FaWater />,
  "Hygienic Sanitized Equipment": <FaTools />,
  "Hypoallergenic Products": <FaLeaf />,
  "ICU Facility": <FaHospital />,
  "In-house Laboratory": <FaVial />,
  "In-house Pharmacy": <FaPills />,
  "Indoor Play Area": <FaCouch />,
  "Indoor Training Area": <FaRunning />,
  "Leash-Friendly Seating": <FaCouch />,
  "Lighting for Evening Visits": <FaLightbulb />,
  "One-on-One Sessions": <FaUsers />,
  "Online Ordering": <FaShoppingBag />,
  "Online Training Available": <FaLaptop />,
  "Operation Theatre": <FaHospital />,
  "Organic / Natural Products": <FaLeaf />,
  "Outdoor Garden Seating": <FaTree />,
  "Outdoor Play Area": <FaTree />,
  "Outdoor Training Area": <FaTree />,
  "Overnight Stay Available": <FaMoon />,
  "Pet Beds Provided": <FaBed />,
  "Pet Play Area": <FaCouch />,
  "Pet Play Area (Indoor)": <FaCouch />,
  "Pet Play Area (Outdoor)": <FaTree />,
  "Premium Grooming Products": <FaHandSparkles  />, // Or FaStar if sparkles isn't imported
  "Private Spa Rooms": <FaBuilding />,
  "Rescue Shelter": <FaHeart />,
  "Shaded Seating": <FaTree />,
  "Swimming Pool": <FaSwimmingPool />,
  "Therapy Room": <FaNotesMedical />,
  "Travel Insurance Assistance": <FaShieldAlt />,
  "Treats Available": <FaUtensils />,
  "Volunteer Registration": <FaHandsHelping />,
  "Waste Disposal Bins": <FaTrash />
};
  const alertRef = useRef(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { slug } = useParams();

  const { user, authLoading } = useAuth();
  const engagementGate = useEngagementGate(user);
  console.log("User Details", user);

  // Listing & Offers State
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [offers, setOffers] = useState([]);
  const [currentOfferPage, setCurrentOfferPage] = useState(1);
  const offersPerPage = 2;
  const [currentPage, setCurrentPage] = useState(1);
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

  // Interaction & Tracking States
  const [showAuthGate, setShowAuthGate] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [showUrl, setShowUrl] = useState(false);
  const [urlIsTracking, setUrlIsTracking] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaveTracking, setIsSaveTracking] = useState(false);

  // Review & Form States
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [photos, setPhotos] = useState([]);
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  // Modals
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Auth Gate Handlers
  useEffect(() => {
    if (!authLoading && !user && engagementGate) {
      setShowAuthGate(true);
    }
  }, [authLoading, user, engagementGate]);

  useEffect(() => {
    if (user) {
      setShowAuthGate(false);
      setUserName(user.name || "");
      setUserEmail(user.email || "");
    }
  }, [user]);

  useEffect(() => {
    incrementListingViews();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  // Fetch Listing Details
  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/listing/incviewsslug/slug/${slug}`);
        const data = await res.json();

        if (data.success && data.listing) {
          let parsedSocials = {};

          if (typeof data.listing.socialLinks === "string") {
            try {
              parsedSocials = JSON.parse(data.listing.socialLinks);
            } catch (e) {
              parsedSocials = {};
            }
          } else if (
            typeof data.listing.socialLinks === "object" &&
            data.listing.socialLinks !== null
          ) {
            parsedSocials = data.listing.socialLinks;
          }

          setListing({
            ...data.listing,
            socialLinks: parsedSocials,
          });
        }
      } catch (err) {
        console.error("Error fetching listing:", err.message);
      } finally {
        setLoading(false);
      }
      };

    fetchListing();
  }, [slug]);
console.log(listing);
  // Fetch Listing Offers
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

  // Fetch Listing Reviews
  useEffect(() => {
    if (!listing?._id) return;
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/reviews/list/${listing._id}`);
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

  // Scroll to Alert Message
  useEffect(() => {
    if (alert.show && alertRef.current) {
      alertRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      alertRef.current.focus();
    }
  }, [alert]);
  useEffect(() => {
  if (listing && user) {
    const saved = listing.savedBy?.some(
      (id) => id.toString() === user.id.toString() || id === user.id
    );
    setIsSaved(!!saved);
  } else {
    setIsSaved(false);
  }
}, [listing, user]);
const handleSaveListing = async () => {
  // 1. Gate: Prompt login modal if user is not logged in
  if (!user) {
    setShowAuthGate(true);
    return;
  }

  setIsSaveTracking(true);

  try {
    const res = await fetch(`${API_BASE}/api/listing/${listing._id}/save`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        action: "save_listing",
      }),
    });

    const data = await res.json();

    if (data.success) {
      setIsSaved(data.isSaved);
    } else {
      setAlert({ show: true, type: "danger", message: data.message });
    }
  } catch (err) {
    console.error("Error toggling save status:", err);
    setAlert({
      show: true,
      type: "danger",
      message: "Network error while saving listing.",
    });
  } finally {
    setIsSaveTracking(false);
  }
};

  // Rating Utilities
  const averageRating = () => {
    if (!reviews.length) return 0;
    return (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);
  };

  const renderStarsCal = (value) => {
    const full = Math.round(value);
    return Array.from({ length: 5 }).map((_, i) => (
      <FaStar key={i} color={i < full ? "#ff4e00" : "#e2e8f0"} />
    ));
  };

  // Actions
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
        e.target.value = "";
        return;
      }
    }
    setPhotos(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) {
      setAlert({ show: true, type: "danger", message: "Please select a rating." });
      return;
    }
    if (!user) {
      const nameError = validateField("name", userName, { maxLength: 50 });
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
        body: formData,
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
        if (!user) {
          setUserName("");
          setUserEmail("");
        }
        setPhotos([]);
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
    let parts = address.split(",").map((p) => p.trim()).filter(Boolean);
    return parts.length >= 3 ? parts.slice(-3).join(", ") : address;
  };

  if (loading) return <div className="text-center py-5">Loading listing...</div>;
  if (!listing) return <div className="text-center py-5">Listing not found.</div>;

  // Pagination for Offers
  const indexOfLastOffer = currentOfferPage * offersPerPage;
  const indexOfFirstOffer = indexOfLastOffer - offersPerPage;
  const currentOffersSlice = offers.slice(indexOfFirstOffer, indexOfLastOffer);
  const totalOfferPages = Math.ceil(offers.length / offersPerPage);

  const getBusinessStatus = (businessHours) => {
  // 1. Handle missing, empty, or unconfigured business hours
  if (!businessHours || !Array.isArray(businessHours) || businessHours.length === 0) {
    return { status: "UNAVAILABLE", text: "HOURS N/A", colorClass: "text-muted", dotClass: "bg-secondary" };
  }

  const now = new Date();
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const currentDay = daysOfWeek[now.getDay()];

  // Find today's schedule (case-insensitive)
  const todaySchedule = businessHours.find(
    (b) => b.day.toLowerCase() === currentDay.toLowerCase()
  );

  // 2. Handle missing day entry or missing open/close values
  if (!todaySchedule || (!todaySchedule.closed && (!todaySchedule.open || !todaySchedule.close))) {
    return { status: "UNAVAILABLE", text: "HOURS N/A", colorClass: "text-muted", dotClass: "bg-secondary" };
  }

  // 3. Handle explicit "closed" days
  if (todaySchedule.closed) {
    return { status: "CLOSED", text: "CLOSED TODAY", colorClass: "text-danger", dotClass: "bg-danger" };
  }

  // 4. Time comparison (24-hour format "HH:MM")
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const currentTime = `${hours}:${minutes}`;

  const { open, close } = todaySchedule;

  // Handle standard daytime hours vs overnight shifts (e.g., 18:00 to 02:00)
  let isOpen = false;
  if (close < open) {
    // Overnight shift: open late today OR open early morning after midnight
    isOpen = currentTime >= open || currentTime < close;
  } else {
    // Regular shift
    isOpen = currentTime >= open && currentTime < close;
  }

  if (isOpen) {
    return { status: "OPEN", text: "OPEN NOW", colorClass: "text-success", dotClass: "bg-success" };
  } else {
    return { status: "CLOSED", text: "CLOSED", colorClass: "text-danger", dotClass: "bg-danger" };
  }
};
const { text, colorClass, dotClass } = getBusinessStatus(listing.businessHours);

  return (
    <div className="aesthetic-detail-page">
      <style>{STYLES}</style>
      <Helmet>
        <title>{`Vet and Pets - ${shortAddress(listing?.address)}`}</title>
        <meta name="description" content={listing?.description || "Find trusted pet care services on Vet & Pets."} />
      </Helmet>

      <AuthGateModal show={showAuthGate} onClose={() => setShowAuthGate(false)} />

      {/* HEADER HERO SECTION */}
      <div 
        className="premium-monolith-header" 
        style={{ backgroundImage: `url(${listing.bannerImage ? `${API_BASE}/${listing.bannerImage}` : ''})` }}
      >
        <div className="hero-absolute-cluster">
          <Container>
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
              <div>
                <div className="mb-2 d-flex gap-2">
                  {listing.isVerified && (
                    <span className="cyber-badge-premium"><FaShieldAlt className="me-1"/> Verified</span>
                  )}
                  {listing.isFeatured && (
                    <span className="cyber-badge-premium"><FaTags className="me-1"/> Featured</span>
                  )}
                </div>
                <h1 className="text-dark fw-bold display-5 mb-0" style={{ letterSpacing: "-0.03em" }}>
                  {listing.shopName}
                </h1>
              </div>

              {/* ACTION BUTTONS BAR */}
              <div className="d-flex flex-wrap gap-2">
                <button 
                className={`btn ${isSaved ? 'btn-danger' : 'btn-clean-outline'}`}
                onClick={handleSaveListing}
                disabled={isSaveTracking}
              >
                <FaBookmark /> {isSaveTracking ? "Processing..." : isSaved ? 'Saved' : 'Save'}
              </button>
                
                {/* <button className="btn-clean-outline" onClick={handleShowPhone} disabled={isTracking}>
                  <FaPhoneAlt /> {showPhone ? listing.phone : "Call"}
                </button> */}

                {listing.whatsappNumber && (
                  <a href={`https://wa.me/${listing.whatsappNumber}`} target="_blank" rel="noreferrer" className="btn-clean-primary" style={{ background: '#22c55e' }}>
                    <FaWhatsapp /> WhatsApp
                  </a>
                )}

                {listing.address && (
                  <a 
                    href={`https://maps.google.com/?q=${encodeURIComponent(listing.address)}`} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="btn-clean-outline"
                  >
                    <FaDirections /> Directions
                  </a>
                )}

                {/* {listing.mapUrl && (
                  <button className="btn-clean-outline" onClick={handleShowUrl} disabled={urlIsTracking}>
                    <FaGlobe /> Website
                  </button>
                )}
                 */}
                 {/* {listing.mapUrl &&
                    listing.mapUrl.trim() !== "" &&
                    (
                  !showUrl ? (
                    <Button
                      className="btn-clean-outline"
                     // variant="outline-primary"
                      onClick={handleShowUrl}
                      disabled={urlIsTracking}
                    >
                      {isTracking ? "Please wait..." : "Show Website Url"}
                    </Button>
                  ) : (
                    <Button
                    className="btn-clean-outline"
                      size="sm"
                      //variant="outline-primary"
                      onClick={handleShowUrl}
                      disabled={urlIsTracking}
                    >
                      {listing.mapUrl}
                    </Button>
                  ))} */}
              </div>
            </div>
          </Container>
        </div>
      </div>

      <Container className="mt-4">
        <Row className="g-4">
          {/* LEFT CONTENT COLUMN */}
          <Col lg={8}>
            {/* PET CATEGORIES */}
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-4">
              <div className="d-flex flex-wrap gap-2">
                {listing.petCategories?.map((cat, i) => (
                  <span className="tag-pet-pill" key={i}>{cat.categoryName}</span>
                ))}
              </div>
              <div className="d-flex align-items-center gap-2 font-monospace small">
                <span className={`live-glow-dot ${dotClass}`}></span> 
                <span className={`${colorClass} fw-bold`}>
                  {text}
                </span>
              </div>
            </div>

            {/* TAB CONTENT CONTAINER */}
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
                    <p className="mb-4 text-justify" style={{ lineHeight: '1.7' }}>{listing.description}</p>

                    <Row className="g-3 mb-4">
                      
                        <Col sm={6}>
                          <div className="stat-card">
                            <span className="d-block text-muted small">Experience</span>
                            <strong className="fs-5 text-dark">
                              {listing.yearsInBusiness || "--"}
                              </strong>
                          </div>
                        </Col>
                      
                      
                        <Col sm={6}>
                          <div className="stat-card">
                            <span className="d-block text-muted small">Customers Served</span>
                            <strong className="fs-5 text-dark">
                            {listing.customersServed || "--"}
                            </strong>
                          </div>
                        </Col>
                      
                    </Row>

                    {/* CERTIFICATIONS & LANGUAGES */}
                    {(listing.certifications?.length > 0 || listing.languagesSpoken?.length > 0) && (
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
                    )}
                  </div>
                </Tab.Pane>

                {/* SERVICES & AMENITIES TAB */}
                <Tab.Pane eventKey="services">
                  <div className="clean-white-block mb-4">
                    <Row className="g-4">
                      {listing.categories?.length > 0 && (
                        <Col md={6}>
                          <span className="clean-accent-label">Categories</span>
                          <div className="d-flex flex-wrap gap-2">
                            {listing.categories.map((c, i) => (
                              <span key={i} className="badge bg-light border text-dark px-3 py-2 rounded font-monospace">
                                {c.categoryName}
                              </span>
                            ))}
                          </div>
                        </Col>
                      )}
                      {listing.specializedServices?.length > 0 && (
                        <Col md={6}>
                          <span className="clean-accent-label">Specialized Services</span>
                          <div className="d-flex flex-column gap-2">
                            {listing.specializedServices.map((s, i) => (
                              <span key={i} className="d-block" style={{ fontSize: "14px" }}>
                                <FaCheck className="text-success me-2" /> {s.serviceName}
                              </span>
                            ))}
                          </div>
                        </Col>
                      )}
                    </Row>

                    {/* AMENITIES */}
                    {Array.isArray(listing.amenities) && listing.amenities.length > 0 && (
                      <div className="mt-4 pt-4 border-top border-light">
                        <span className="clean-accent-label">Amenities</span>
                        <Row className="g-2">
                          {listing.amenities.map((amenity, index) => (
                            <Col key={index} md={4} sm={6}>
                              <div className="amenity-chip available">
                                {AMENITY_ICONS[amenity] || <FaCheckCircle />} {amenity}
                              </div>
                            </Col>
                          ))}
                        </Row>
                      </div>
                    )}
                  </div>
                </Tab.Pane>

                {/* GALLERY TAB */}
                <Tab.Pane eventKey="gallery">
                  <div className="clean-white-block mb-4">
                    <span className="clean-accent-label">Gallery & Media</span>
                    {listing.photos?.length > 0 ? (
                      <Row className="g-3">
                        {listing.photos.map((img, i) => (
                          <Col md={4} sm={6} key={i}>
                            <div 
                              className="gallery-clean-frame" 
                              onClick={() => { setSelectedImage(img.url); setShowGalleryModal(true); }}
                            >
                              <img 
                                src={`${API_BASE}/${img.url}`} 
                                alt={img.alt || `${listing.shopName}-${i}`} 
                                className="w-100" 
                                style={{ height: "160px", objectFit: "cover", cursor: "pointer" }} 
                              />
                            </div>
                          </Col>
                        ))}
                      </Row>
                    ) : (
                      <p className="text-muted mb-0">No gallery photos uploaded yet.</p>
                    )}

                    {listing.videos?.length > 0 && (
                      <div className="pt-4 border-top border-light mt-4">
                        <span className="clean-accent-label">Videos</span>
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
                    <div className="d-flex align-items-center justify-content-between mb-4">
                      <div>
                        <span className="clean-accent-label">Customer Reviews</span>
                        <div className="d-flex align-items-center gap-2">
                          <span className="fs-3 fw-bold text-dark">{averageRating()}</span>
                          <div>{renderStarsCal(averageRating())}</div>
                        </div>
                      </div>
                      <span className="text-muted small font-monospace">{reviews.length} Review(s)</span>
                    </div>

                    {reviews.length === 0 ? (
                      <p className="text-muted">No reviews yet. Be the first to share your experience!</p>
                    ) : (
                      reviews.map((r, index) => (
                        <div key={r._id || index} className={`py-3 ${index !== reviews.length - 1 ? 'border-bottom border-light' : ''}`}>
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <h6 className="fw-bold text-dark mb-0">{r.userName}</h6>
                            <span className="text-muted small font-monospace">
                              {new Date(r.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="mb-2">{renderStarsCal(r.rating)}</div>
                          <p className="text-secondary mb-2 small">{r.comment}</p>
                          {r.photos?.length > 0 && (
                            <div className="d-flex flex-wrap gap-2 mt-2">
                              {r.photos.map((img, idx) => (
                                <img 
                                  key={idx} 
                                  src={`${API_BASE}/${img}`} 
                                  alt={`Review-${idx}`} 
                                  className="rounded border" 
                                  style={{ width: '80px', height: '80px', objectFit: 'cover' }} 
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
            {/* ================= OFFERS SECTION ================= */}
{offers.length > 0 && (() => {
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
  
  
  {/* <Link to={`/offers?ref=${encodedId}`} className="text-decoration-none" style={{ display: 'block', height: '100%' }}> */}
  <Link to={`/offers`} className="text-decoration-none" style={{ display: 'block', height: '100%' }}>
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
 })()} 
 {/* ================================================== */}

            {/* OFFERS & ANNOUNCEMENTS
            {offers.length > 0 && (
              <div className="clean-white-block mb-4">
                <span className="clean-accent-label">
                  <FaBullhorn className="me-1" /> Active Offers & Announcements
                </span>
                
                <Row className="g-3">
                  {currentOffersSlice.map((offer) => (
                    <Col md={6} key={offer._id}>
                      <div className="border border-light rounded overflow-hidden h-100 bg-white shadow-sm">
                        {offer.media && offer.media.length > 0 && (
                          <div style={{ aspectRatio: '16/9', overflow: 'hidden' }}>
                            <img 
                              src={offer.media[0].url.startsWith('http') ? offer.media[0].url : `${API_BASE}/${offer.media[0].url}`} 
                              alt={offer.title} 
                              className="w-100 h-100" 
                              style={{ objectFit: 'cover' }} 
                            />
                          </div>
                        )}
                        <div className="p-3">
                          <h6 className="text-dark fw-bold mb-1">{offer.title}</h6>
                          <p className="text-muted small mb-0">{offer.description}</p>
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
            )} */}

            {/* LOCATION MAP */}
            {listing.address && (
              <div className="clean-white-block mb-4 overflow-hidden p-0">
                <div className="p-4 pb-0 d-flex align-items-center justify-content-between">
                  <div>
                    <span className="clean-accent-label mb-2">
                      <FaMapMarkerAlt className="me-1" /> Location & Directions
                    </span>
                    <p className="text-muted small mb-0">{listing.address}</p>
                  </div>
                  <a 
                    href={`https://maps.google.com/?q=${encodeURIComponent(listing.address)}`} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="btn btn-sm btn-outline-secondary font-monospace"
                  >
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
              
              {/* PRICING WIDGET */}
              {listing.pricing && (
                <div className="clean-white-block mb-4">
                  <span className="clean-accent-label">Pricing</span>
                  {listing.pricing.startingFrom && (
                    <div className="p-3 bg-light rounded border border-light mb-3">
                      <span className="d-block text-muted small">Starting Price</span>
                      <span className="fs-4 fw-bold text-dark">{listing.pricing.startingFrom}</span>
                    </div>
                  )}
                  
                  <div className="d-flex flex-column gap-2 small font-monospace">
                    {listing.appointmentRequired !== undefined && (
                      <div><strong>Appointment:</strong> {listing.appointmentRequired ? "Required" : "Walk-ins Welcome"}</div>
                    )}
                    {listing.responseTime && (
                      <div><strong>Response Time:</strong> {listing.responseTime}</div>
                    )}
                    {listing.pricing?.paymentMethods?.length > 0 && (
                      <div>
                        <strong>Payment Methods:</strong> 
                        <div className="d-flex flex-wrap gap-1 mt-2">
                          {listing.pricing.paymentMethods.map((pm, i) => (
                            <Badge bg="white" text="dark" className="border py-1 px-2 font-monospace" key={i}>{pm}</Badge>
                          ))}
                        </div> 
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* CONTACT DETAILS PANEL */}
              <div className="clean-white-block mb-4">
                <span className="fw-bold text-dark fs-5 d-block mb-3">Contact Details</span>

                <div className="mb-4 d-flex flex-column gap-2">
                  {!showPhone ? (
                    <button className="btn-clean-primary w-100" onClick={handleShowPhone} disabled={isTracking}>
                      <FaPhoneAlt /> {isTracking ? "Please wait..." : "Show Number"}
                    </button>
                  ) : (
                    <a href={`tel:${listing.phone}`} className="btn-clean-primary w-100">
                      <FaPhoneAlt /> {listing.phone}
                    </a>
                  )}

                  {/* {listing.mapUrl && listing.mapUrl.trim() !== "" && (
                    !showUrl ? (
                      <button className="btn-clean-outline w-100" onClick={handleShowUrl} disabled={urlIsTracking}>
                        <FaGlobe /> {urlIsTracking ? "Please wait..." : "Show Website Url"}
                      </button>
                    ) : (
                      <a href={listing.mapUrl} target="_blank" rel="noopener noreferrer" className="btn-clean-outline w-100">
                        <FaGlobe /> Visit Website
                      </a>
                    )
                  )} */}
                  {listing.mapUrl &&
                    listing.mapUrl.trim() !== "" &&
                    (
                  !showUrl ? (
                    <Button
                      className="btn-clean-outline w-100"
                     // variant="outline-primary"
                      onClick={handleShowUrl}
                      disabled={urlIsTracking}
                    >
                      {isTracking ? "Please wait..." : "Show Website Url"}
                    </Button>
                  ) : (
                    <Button
                    className="btn-clean-outline w-100"
                      size="sm"
                      //variant="outline-primary"
                      onClick={handleShowUrl}
                      disabled={urlIsTracking}
                    >
                      {listing.mapUrl}
                    </Button>
                  ))}
                </div>

                <div className="d-flex flex-column gap-3 text-sm border-top border-light pt-4 font-monospace">
                  {listing.email && (
                    <div className="d-flex align-items-start gap-3">
                      <FaEnvelope style={{ color: '#ff4e00' }} className="mt-1"/>
                      <div>
                        <span className="d-block text-muted small">Email</span>
                        <a href={`mailto:${listing.email}`} className="text-dark small fw-medium text-decoration-none">
                          {listing.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {listing.address && (
                    <div className="d-flex align-items-start gap-3">
                      <FaMapMarkerAlt style={{ color: '#ff4e00' }} className="mt-1"/>
                      <div>
                        <span className="d-block text-muted small">Location</span>
                        <span className="text-dark small fw-medium">
                          {listing.address} {listing.city?.city && `, ${listing.city.city}`}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* CLAIM BUSINESS BUTTON */}
                {listing.created_by_type === "admin" && !listing.isClaimed && (
                  <div className="mt-3 pt-3 border-top border-light">
                    <Button
                      variant="primary"
                      className="w-100 btn-clean-primary"
                      onClick={() => navigate(`/claim/${listing.slug}`)}
                    >
                      Claim this business
                    </Button>
                  </div>
                )}

                {/* SOCIAL MEDIA */}
                {listing.socialLinks && (
                  <div className="mt-4 pt-4 border-top border-light">
                    <span className="clean-accent-label">Social Media</span>
                    <div className="d-flex gap-2 mt-2">
                      {listing.socialLinks.facebook && (
                        <a href={listing.socialLinks.facebook} target="_blank" rel="noreferrer" className="social-clean-btn">
                          <FaFacebook size={18} />
                        </a>
                      )}
                      {listing.socialLinks.instagram && (
                        <a href={listing.socialLinks.instagram} target="_blank" rel="noreferrer" className="social-clean-btn">
                          <FaInstagram size={18} />
                        </a>
                      )}
                      {listing.socialLinks.youtube && (
                        <a href={listing.socialLinks.youtube} target="_blank" rel="noreferrer" className="social-clean-btn">
                          <FaYoutube size={18} />
                        </a>
                      )}
                      {listing.socialLinks.twitter && (
                        <a href={listing.socialLinks.twitter} target="_blank" rel="noreferrer" className="social-clean-btn">
                          <FaTwitter size={16} />
                        </a>
                      )}
                      {listing.socialLinks.linkedin && (
                        <a href={listing.socialLinks.linkedin} target="_blank" rel="noreferrer" className="social-clean-btn">
                          <FaLinkedin size={16} />
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* BUSINESS HOURS */}
                {listing.businessHours?.length > 0 && (
                  <div className="mt-4 pt-4 border-top border-light">
                    <span className="clean-accent-label"><FaClock className="me-1"/> Operating Hours</span>
                    <div className="p-2 rounded bg-light border border-light mt-2">
                      {listing.businessHours.map((bh, idx) => (
                        <div key={idx} className="hours-matrix-row text-dark">
                          <span className="text-uppercase font-monospace small" style={{ color: '#64748b' }}>
                            {bh.day ? bh.day.substring(0,3) : ''}
                          </span>
                          <span className="font-monospace small fw-medium">
                            {bh.closed ? <span className="text-danger">Closed</span> : `${bh.open} - ${bh.close}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* WRITE REVIEW FORM */}
              <div className="clean-white-block">
                <span className="clean-accent-label text-center">Write a Review</span>

                {alert.show && (
                  <Alert 
                    ref={alertRef}
                    variant={alert.type}
                    onClose={() => setAlert({ show: false })}
                    dismissible
                  >
                    {alert.message}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <div className="d-flex justify-content-center gap-2 mb-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <span 
                        key={i} 
                        style={{ 
                          fontSize: "1.8rem", 
                          cursor: "pointer", 
                          color: i <= rating ? "#ff4e00" : "#e2e8f0", 
                          transition: 'color 0.2s' 
                        }} 
                        onClick={() => setRating(i)}
                      >
                        ★
                      </span>
                    ))}
                  </div>

                  {!user && (
                    <>
                      <Form.Group className="mb-3">
                        <Form.Control 
                          type="text" 
                          placeholder="Your Name *" 
                          value={userName} 
                          onChange={(e) => setUserName(e.target.value)} 
                          required 
                          className="clean-input-field" 
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Control 
                          type="email" 
                          placeholder="Your Email *" 
                          value={userEmail} 
                          onChange={(e) => setUserEmail(e.target.value)} 
                          required 
                          className="clean-input-field" 
                        />
                      </Form.Group>
                    </>
                  )}

                  <Form.Group className="mb-3">
                    <Form.Control 
                      type="file" 
                      name="photos" 
                      multiple 
                      accept="image/*" 
                      onChange={handleFileChange} 
                      ref={fileInputRef} 
                      className="clean-input-field" 
                    />
                    <Form.Text className="text-muted small">
                      Max file size: 2MB per photo.
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-1">
                    <Form.Control 
                      as="textarea" 
                      rows={3} 
                      placeholder="Write your review... *" 
                      value={comment} 
                      onChange={(e) => setComment(e.target.value)} 
                      required 
                      maxLength={300} 
                      className="clean-input-field" 
                    />
                  </Form.Group>
                  <div className="text-end text-muted small mb-3">
                    {comment.length}/300 characters
                  </div>

                  <button 
                    type="submit" 
                    className="btn-clean-primary w-100 py-2.5" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Review"}
                  </button>
                </Form>
              </div>

            </div>
          </Col>
        </Row>
      </Container>

      {/* PHOTO LIGHTBOX MODAL */}
      <Modal show={showGalleryModal} onHide={() => setShowGalleryModal(false)} centered size="lg">
        <Modal.Body className="p-0 bg-transparent rounded overflow-hidden border-0">
          {selectedImage && (
            <img 
              src={selectedImage.startsWith('http') ? selectedImage : `${API_BASE}/${selectedImage}`} 
              alt="Preview" 
              className="w-100" 
              style={{ maxHeight: "80vh", objectFit: "contain" }} 
            />
          )}
        </Modal.Body>
      </Modal>

      {/* VIDEO PLAYER MODAL */}
      <Modal show={showVideoModal} onHide={() => setShowVideoModal(false)} centered size="lg">
        <Modal.Body className="p-0 bg-black rounded overflow-hidden border-0">
          {selectedVideo && (
            <video src={selectedVideo} controls autoPlay className="w-100" style={{ maxHeight: "80vh" }} />
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ListingDetailPage;