import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Css/Directory.css';
import { Row, Col, Card, Button, Container, Badge, OverlayTrigger, Tooltip, Pagination } from "react-bootstrap";
import { BsGeoAltFill, BsBookmarkFill, BsBookmark, BsClockFill } from "react-icons/bs";
import { FaCar, FaSnowflake, FaWheelchair, FaCouch, FaWifi, FaHourglassHalf } from 'react-icons/fa';
import { GiTrophy } from 'react-icons/gi';
import { MdVerified } from "react-icons/md";
import { useAuth } from "../contexts/AuthContext";
import { Helmet } from 'react-helmet-async';
import AuthGateModal from "../hooks/AuthGateModel";
import defaultImg from "../dummy.jpg";
import Loader from '../Components/Loader';
import StarRating from '../Components/StarRating';

const API_BASE =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_URL
    : "http://localhost:5000";

const AMENITY_ICONS = {
  "Parking": <FaCar />,
  "Air Conditioning": <FaSnowflake />,
  "Wheelchair Accessible": <FaWheelchair />,
  "Pet Friendly": <FaCouch />,
  "WiFi": <FaWifi />,
  "Waiting Area": <FaHourglassHalf />,
};

// Fallback images per category
const categoryDummyImages = {
  clinic: defaultImg,
  grooming: defaultImg,
  store: defaultImg,
};

const SavedListings = () => {
  const [loading, setLoading] = useState(true);
  const [savedListings, setSavedListings] = useState([]);
  const [savedListingIds, setSavedListingIds] = useState([]);
  const [savingId, setSavingId] = useState(null);
  const [showAuthGate, setShowAuthGate] = useState(false);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Set number of items per page

  const { user } = useAuth();
  const navigate = useNavigate();

  const getFallbackImage = (listing) => {
    const firstCategory =
      listing.categories?.[0]?.categoryName?.toLowerCase() || "";

    return categoryDummyImages[firstCategory] || defaultImg;
  };

  // Fetch saved listings for the logged-in user
  useEffect(() => {
    const fetchSavedListings = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/api/listing/user/${user.id}/saved-listings`);
        const data = await res.json();

        if (data.success) {
          const listingsData = data.listings || [];
          setSavedListings(listingsData);
          setSavedListingIds(listingsData.map((item) => item._id));
        }
      } catch (err) {
        console.error("Error fetching saved listings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedListings();
  }, [user]);

  // Handle Save / Bookmark listing directly from grid
  const handleSaveListing = async (e, listingId) => {
    e.stopPropagation();

    if (!user) {
      setShowAuthGate(true);
      return;
    }

    setSavingId(listingId);

    try {
      const res = await fetch(`${API_BASE}/api/listing/${listingId}/save`, {
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
        // Toggle item out of list if it is unsaved
        const updatedListings = savedListings.filter((item) => item._id !== listingId);
        setSavedListings(updatedListings);
        setSavedListingIds((prev) => prev.filter((id) => id !== listingId));

        // Adjust page if current page becomes empty
        const totalPagesAfterRemove = Math.ceil(updatedListings.length / itemsPerPage);
        if (currentPage > totalPagesAfterRemove && totalPagesAfterRemove > 0) {
          setCurrentPage(totalPagesAfterRemove);
        }
      }
    } catch (err) {
      console.error("Error toggling saved state:", err);
    } finally {
      setSavingId(null);
    }
  };

  // Business Open / Closed status evaluator
  const getBusinessStatus = (businessHours) => {
    if (!businessHours || !Array.isArray(businessHours) || businessHours.length === 0) {
      return { status: "UNAVAILABLE", text: "N/A", colorClass: "text-muted" };
    }

    const now = new Date();
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const currentDay = daysOfWeek[now.getDay()];

    const todaySchedule = businessHours.find(
      (b) => b.day?.toLowerCase() === currentDay.toLowerCase()
    );

    if (!todaySchedule || (!todaySchedule.closed && (!todaySchedule.open || !todaySchedule.close))) {
      return { status: "UNAVAILABLE", text: "N/A", colorClass: "text-muted" };
    }

    if (todaySchedule.closed) {
      return { status: "CLOSED", text: "Closed", colorClass: "text-danger" };
    }

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const currentTime = `${hours}:${minutes}`;

    const { open, close } = todaySchedule;

    let isOpen = false;
    if (close < open) {
      isOpen = currentTime >= open || currentTime < close;
    } else {
      isOpen = currentTime >= open && currentTime < close;
    }

    return isOpen
      ? { status: "OPEN", text: "Open Now", colorClass: "text-success" }
      : { status: "CLOSED", text: "Closed", colorClass: "text-danger" };
  };

  // Calculate current listings for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentListings = savedListings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(savedListings.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return <Loader />;

  return (
    <Container className="py-4">
      <Helmet>
        <title>Saved Listings - User Profile</title>
      </Helmet>

      <AuthGateModal show={showAuthGate} onClose={() => setShowAuthGate(false)} />

      <div className="mb-4">
        <h4 className="fw-bold">Saved Listings</h4>
      </div>

      {savedListings.length === 0 ? (
        <div className="text-center py-5 border rounded bg-light">
          <BsBookmarkFill className="text-muted fs-1 mb-2" />
          <h5>No Saved Listings Found</h5>
          <p className="text-muted small">You haven't bookmarked any listings yet.</p>
          <Button variant="primary" size="sm" onClick={() => navigate('/directory')}>
            Browse Directory
          </Button>
        </div>
      ) : (
        <>
          <Row className="g-4">
            {currentListings.map((listing) => {
              const { text: statusText, colorClass: statusColor } = getBusinessStatus(listing.businessHours);
              const isListingSaved = savedListingIds.includes(listing._id);

              return (
                <Col key={listing._id} md={3} className="mb-4 d-flex">
                  <Card className="provider-card w-100 h-100 d-flex flex-column">
                    <Card.Header className="card-top-rated p-0 pos-rel">
                      <Card.Img
                        variant="top"
                        src={
                          listing.bannerImage
                            ? `${API_BASE}/${listing.bannerImage}`
                            : getFallbackImage(listing)
                        }
                        alt={listing.shopName}
                      />

                      {/* Save / Bookmark Button Indicator */}
                      <Button
                        variant="light"
                        size="sm"
                        className="position-absolute top-0 end-0 m-2 rounded-circle shadow-sm border-0 d-flex align-items-center justify-content-center"
                        style={{ width: "36px", height: "36px", zIndex: 5 }}
                        onClick={(e) => handleSaveListing(e, listing._id)}
                        disabled={savingId === listing._id}
                      >
                        {isListingSaved ? (
                          <BsBookmarkFill style={{ color: "#ff4e00" }} />
                        ) : (
                          <BsBookmark className="text-dark" />
                        )}
                      </Button>

                      {/* Business Open / Closed Status Badge */}
                      <Badge
                        bg="light"
                        className={`position-absolute bottom-0 start-0 m-2 border shadow-sm ${statusColor} font-monospace px-2 py-1`}
                      >
                        ● {statusText}
                      </Badge>
                    </Card.Header>

                    <Card.Body className="pos-rel d-flex flex-column flex-grow-1">
                      <div className="status-updates mt-5 mb-2 d-flex gap-2 align-items-center">
                        {listing.isVerified && (
                          <div className="verified-identification">
                            <OverlayTrigger
                              placement="top"
                              overlay={<Tooltip id={`verified-tooltip-${listing._id}`}>Verified</Tooltip>}
                            >
                              <span
                                tabIndex="0"
                                className="d-inline-flex align-items-center text-primary icon-badge-hover"
                              >
                                <MdVerified size={24} />
                              </span>
                            </OverlayTrigger>
                          </div>
                        )}

                        {(listing.rating >= 4 || listing.avgRating >= 4) && (
                          <div className="top-rated-identification">
                            <OverlayTrigger
                              placement="top"
                              overlay={<Tooltip id={`top-rated-tooltip-${listing._id}`}>Top Rated</Tooltip>}
                            >
                              <span
                                tabIndex="0"
                                className="d-inline-flex align-items-center text-warning icon-badge-hover"
                              >
                                <GiTrophy size={22} />
                              </span>
                            </OverlayTrigger>
                          </div>
                        )}
                      </div>

                      <Card.Title
                        title={listing.shopName}
                        style={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: "200px",
                          cursor: "pointer",
                          marginTop: "12px",
                        }}
                      >
                        {listing.shopName}
                      </Card.Title>

                      {/* Amenities */}
                      <div className="amenities-updates mt-2 mb-2 d-flex gap-2 align-items-center">
                        {listing.amenities?.map((amenityName, index) => {
                          const icon = AMENITY_ICONS[amenityName];
                          if (!icon) return null;

                          return (
                            <div key={index} className="amenity-identification">
                              <OverlayTrigger
                                placement="top"
                                overlay={
                                  <Tooltip id={`amenity-tooltip-${listing._id}-${index}`}>
                                    {amenityName}
                                  </Tooltip>
                                }
                              >
                                <span
                                  tabIndex="0"
                                  className="d-inline-flex align-items-center icon-badge-hover"
                                  style={{
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    color: '#ff4e00',
                                  }}
                                >
                                  {icon}
                                </span>
                              </OverlayTrigger>
                            </div>
                          );
                        })}
                      </div>

                      {/* CATEGORY */}
                      <div className="service-tags mt-2">
                        {listing.categories?.map((cat, index) => (
                          <span key={index} className="badge badge-popular me-1">
                            {cat.categoryName || cat}
                          </span>
                        ))}
                      </div>

                      {/* SPECIALIZED SERVICES */}
                      {listing.specializedServices
                        ?.filter((s) => s.show !== false)
                        .map((s, i) => (
                          <div key={i} className="text-muted small mt-1">
                            <span className="service-tag bg-warning text-black">
                              {s.serviceName}
                            </span>
                          </div>
                        ))}

                      <div className="service-rating d-flex align-items-center gap-2 mt-2">
                        <StarRating 
                          rating={listing.rating} 
                          reviewCount={listing.reviewCount} 
                        />
                      </div>

                      <Card.Text
                        className="mt-2"
                        title={listing.description}
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          cursor: "pointer",
                        }}
                      >
                        {listing.description}
                      </Card.Text>

                      <div className="service-location mt-2 d-flex gap-2 align-items-center">
                        <BsGeoAltFill /> {listing.city?.city || listing.city || "N/A"}
                      </div>

                      <div className="service-location mt-2 d-flex gap-2 align-items-center">
                        <BsClockFill />
                        {(() => {
                          const today = new Date().toLocaleString("en-US", { weekday: "long" });
                          const todayHours = listing.businessHours?.find(
                            (bh) => bh.day?.toLowerCase() === today.toLowerCase()
                          );

                          if (!todayHours) return "Hours not available";
                          if (todayHours.closed) return "Closed Today";
                          if (!todayHours.open || !todayHours.close) return "Hours not available";

                          return `Open Today: ${todayHours.open} - ${todayHours.close}`;
                        })()}
                      </div>

                      {/* Button pushed to bottom */}
                      <Button
                        variant="primary"
                        className="details-btn mt-auto"
                        onClick={() => navigate(`/listings/${listing.slug || listing._id}`)}
                      >
                        View Details
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <Pagination>
                {/* <Pagination.First 
                  onClick={() => handlePageChange(1)} 
                  disabled={currentPage === 1} 
                /> */}
                <Pagination.Prev 
                  onClick={() => handlePageChange(currentPage - 1)} 
                  disabled={currentPage === 1} 
                />

                {[...Array(totalPages)].map((_, idx) => {
                  const pageNumber = idx + 1;
                  return (
                    <Pagination.Item
                      key={pageNumber}
                      active={pageNumber === currentPage}
                      onClick={() => handlePageChange(pageNumber)}
                    >
                      {pageNumber}
                    </Pagination.Item>
                  );
                })}

                <Pagination.Next 
                  onClick={() => handlePageChange(currentPage + 1)} 
                  disabled={currentPage === totalPages} 
                />
                {/* <Pagination.Last 
                  onClick={() => handlePageChange(totalPages)} 
                  disabled={currentPage === totalPages} 
                /> */}
              </Pagination>
            </div>
          )}
        </>
      )}
    </Container>
  );
};

export default SavedListings;