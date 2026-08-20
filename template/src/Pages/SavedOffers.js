import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, ButtonGroup, Badge, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { 
  BiMap, BiTimeFive, BiShow, BiSolidHeart,
  BiPhone, BiMessageRoundedDots, BiCalendar,
  BiChevronLeft, BiChevronRight, BiShareAlt, BiBookmarkHeart
} from 'react-icons/bi';
import { useAuthProtectedAction } from '../hooks/useAuthProtectedAction';
import AuthGateModal from '../hooks/AuthGateModel';
import { useAuth } from '../contexts/AuthContext';
import "./Css/Offers.css";

const API_BASE =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_URL
    : "http://localhost:5000";

const SavedOffers = () => {
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [carouselIndices, setCarouselIndices] = useState({});
  
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  const { 
    showAuthModal, 
    setShowAuthModal, 
    executeProtectedAction, 
    handleAuthSuccess 
  } = useAuthProtectedAction();

  // Fetch all offers and filter by wishlist IDs
  useEffect(() => {
    const fetchSavedOffers = async () => {
      if (!user || !user.wishlist || user.wishlist.length === 0) {
        setSavedPosts([]);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/api/offers`);
        const data = await res.json();

        if (data.success) {
          // Normalize wishlist IDs to strings
          const wishlistIds = user.wishlist.map(item => 
            (typeof item === 'object' ? item._id : item)?.toString()
          );

          // Filter live offers that match user's wishlist
          const userSavedOffers = (data.offers || []).filter(
            post => post.show !== 0 && wishlistIds.includes(post._id.toString())
          );

          setSavedPosts(userSavedOffers);
        }
      } catch (err) {
        console.error("Error fetching saved offers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedOffers();
  }, [user]);

  // Handle tracking clicks for protected actions
  const handleActionClick = async (postId, actionType) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/offers/${postId}/track-click`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ action: actionType })
      });
      const data = await res.json();
      if (data.success && data.updatedAnalytics) {
        setSavedPosts(prev => prev.map(p => p._id === postId ? { ...p, analytics: data.updatedAnalytics } : p));
      }
    } catch (err) {
      console.error(`Click tracking failed for ${actionType}:`, err);
    }
  };

  const handleActionClickProtected = (postId, actionType) => {
    executeProtectedAction(() => {
      handleActionClick(postId, actionType);
    });
  };

  // Remove post from saved wishlist
  const handleUnsave = async (postId) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    // Optimistically remove from local state
    setSavedPosts(prev => prev.filter(post => post._id !== postId));

    try {
      const res = await fetch(`${API_BASE}/api/offers/${postId}/track-save`, {
        method: 'PUT',
        headers: { 
          "Content-Type": "application/json", 
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ 
          isSaving: false, 
          userId: user?._id 
        })
      });

      const data = await res.json();

      if (data.success && updateUser && user) {
        const updatedWishlist = (user.wishlist || []).filter(
          item => (item._id || item).toString() !== postId.toString()
        );
        updateUser({ ...user, wishlist: updatedWishlist });
      } else {
        throw new Error("Unsuccessful unsave sync");
      }
    } catch (err) {
      console.error("Failed to unsave post:", err);
      // Re-fetch to sync accurately on error
      window.location.reload();
    }
  };

  const handleShareClick = async (post) => {
    const baseShareUrl = `${window.location.origin}/offers`;
    const encryptedPayloadId = btoa(post._id);
    const fullyConstructedUrl = `${baseShareUrl}?ref=${encryptedPayloadId}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: `Check out ${post.title} from ${post.business?.name || 'our platform'}!`,
          url: fullyConstructedUrl,
        });
        await handleActionClick(post._id, 'share');
      } catch (err) {
        console.log('Native share cancelled.', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(fullyConstructedUrl);
        alert('Offer link copied successfully to clipboard!');
        await handleActionClick(post._id, 'share');
      } catch (err) {
        console.error('Failed to copy link:', err);
      }
    }
  };

  const moveCarousel = (postId, direction, mediaLength) => {
    const currentIndex = carouselIndices[postId] || 0;
    let newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (newIndex >= mediaLength) newIndex = 0;
    if (newIndex < 0) newIndex = mediaLength - 1;
    setCarouselIndices(prev => ({ ...prev, [postId]: newIndex }));
  };

  const shortAddress = (address) => {
    if (!address) return "";
    address = address.replace(/\b\d{6}\b/g, "").trim();
    let parts = address.split(",").map((part) => part.trim()).filter(Boolean);
    if (parts.length >= 3) return parts.slice(-3).join(", ");
    return address;
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '2rem 0' }}>
      <Container>
        
        {/* Header Title */}
        <div className="mb-4 d-flex align-items-center justify-content-between">
          <div>
            <h1 className="fw-extrabold text-dark tracking-tight m-0" style={{ fontSize: '1.75rem', fontWeight: 800 }}>
              Saved Offers & Feeds
            </h1>
            <p className="text-muted small m-0 mt-1">View and manage your bookmarked offers, events, and announcements.</p>
          </div>
          <Button 
            variant="outline-secondary" 
            onClick={() => navigate('/offers')}
            style={{ borderRadius: '10px', fontWeight: 600 }}
          >
            &larr; Back
          </Button>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" style={{ color: '#ff4e00' }} />
            <p className="mt-2 text-muted">Fetching your saved offers...</p>
          </div>
        ) : (
          <Row className="g-4">
            {savedPosts.length > 0 ? (
              savedPosts.map((post) => {
                const currentImgIdx = carouselIndices[post._id] || 0;
                const currentMedia = post.media && post.media[currentImgIdx];

                const getMediaUrl = (url) => {
                  if (!url) return '';
                  return url.startsWith('http') ? url : `${API_BASE}/${url}`;
                };

                return (
                  <Col xs={12} md={6} lg={4} key={post._id}>
                    <Card className="h-100 border-0 shadow-sm overflow-hidden" style={{ borderRadius: '16px' }}>
                      
                      {/* Card Header */}
                      <Card.Header className="bg-white border-bottom-0 p-3 d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center gap-3">
                          <div>
                            <h6 className="m-0 fw-bold text-dark text-truncate" style={{ maxWidth: '180px' }}>
                              {post.business?.name || "-"}
                            </h6>
                            <div className="d-flex align-items-center gap-1 text-muted extra-small" style={{ fontSize: '0.75rem' }}>
                              <BiMap size={12} className="text-muted" />
                              <span>{shortAddress(post.business?.neighborhood)}</span>
                            </div>
                          </div>
                        </div>

                        <Badge 
                          style={{ backgroundColor: '#ff4e001a', borderRadius: '50px', padding: '0.4rem 0.75rem', fontWeight: 600, color: '#ff4e00' }}
                          className="d-flex align-items-center gap-1 small border-0 text-white"
                        >
                          <BiTimeFive size={12} />
                          <span>
                            {post.endDate ? `${Math.max(0, Math.ceil((new Date(post.endDate) - new Date()) / (1000 * 60 * 60 * 24)))} Days Left` : 'Active'}
                          </span>
                        </Badge>
                      </Card.Header>

                      {/* Media Display */}
                      <div className="position-relative bg-dark style-media-container" style={{ aspectRatio: '16/9', overflow: 'hidden', width: '100%' }}>
                        {post.media && post.media.length > 0 && currentMedia ? (
                          <>
                            {currentMedia.type === 'image' ? (
                              <img 
                                src={getMediaUrl(currentMedia.url)} 
                                alt="Main media asset" 
                                className="img-fluid w-100 h-100"
                                style={{ objectFit: 'cover', width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 1 }}
                              />
                            ) : (
                              <video
                                src={getMediaUrl(currentMedia.url)}
                                className="w-100 h-100"
                                style={{ objectFit: 'cover', position: 'absolute', top: 0, left: 0, zIndex: 1 }}
                                controls muted loop playsInline
                              />
                            )}

                            {post.media.length > 1 && (
                              <>
                                <Button 
                                  onClick={() => moveCarousel(post._id, 'prev', post.media.length)}
                                  variant="light"
                                  className="position-absolute start-0 top-50 translate-middle-y m-2 rounded-circle d-flex align-items-center justify-content-center shadow-sm p-0 border-0"
                                  style={{ width: '32px', height: '32px', backgroundColor: 'rgba(250,250,250,0.85)', zIndex: 10 }}
                                >
                                  <BiChevronLeft size={22} style={{ color: '#000000' }} />
                                </Button>
                                <Button 
                                  onClick={() => moveCarousel(post._id, 'next', post.media.length)}
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
                          <div className="w-100 h-100 d-flex align-items-center justify-content-center text-muted" style={{ zIndex: 1 }}>No Media Available</div>
                        )}

                        {/* Unsave Button */}
                        <div className="position-absolute top-0 end-0 p-3 d-flex gap-2" style={{ zIndex: 10 }}>
                          <Button 
                            onClick={() => handleUnsave(post._id)}
                            variant="light"
                            title="Remove from saved"
                            className="rounded-circle d-flex align-items-center justify-content-center shadow-sm p-0 border-0"
                            style={{ 
                              width: '36px', 
                              height: '36px', 
                              backgroundColor: 'rgba(255, 255, 255, 0.9)',
                              color: '#dc3545'
                            }}
                          >
                            <BiSolidHeart size={20} />
                          </Button>
                        </div>
                      </div>

                      {/* Card Body */}
                      <Card.Body className="d-flex flex-column justify-content-between p-4">
                        <div>
                          <div className="mb-2 d-flex gap-2 align-items-center">
                            <span 
                              style={{ color: '#ff4e00', backgroundColor: '#ff4e0012', fontSize: '10px', letterSpacing: '0.05em' }}
                              className="text-uppercase fw-bold px-2 py-1 rounded"
                            >
                              {post.category}
                            </span>
                          </div>
                          
                          <Card.Title className="fw-bold mb-2 h5 tracking-tight text-dark" style={{ lineHeight: '1.3' }}>
                            {post.title}
                          </Card.Title>

                          <Card.Text 
                            className="text-secondary small mb-2"
                            style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '40px' }}
                          >
                            {post.description}
                          </Card.Text>
                        </div>

                        {/* Analytics indicators */}
                        <div className="d-flex gap-3 px-3 py-2 rounded mb-3 border bg-light" style={{ fontSize: '12px', fontWeight: 500, color: '#64748b' }}>
                          <span className="d-flex align-items-center gap-1">
                            <BiShow size={14} /> 
                            {post.analytics?.viewedByIPs ? post.analytics.viewedByIPs.length : (post.analytics?.views || 0)}
                          </span>
                          <span className="d-flex align-items-center gap-1">
                            <BiSolidHeart size={14} style={{ color: '#dc3545' }} /> 
                            {post.analytics?.savedByUsers ? post.analytics.savedByUsers.length : (post.analytics?.saves || 0)}
                          </span>
                          <span className="d-flex align-items-center gap-1">
                            <BiShareAlt size={14} style={{ color: '#0284c7' }} /> 
                            {(post.analytics?.clicks?.share?.length || 0)}
                          </span>
                        </div>

                        {/* Actions */}
                        <ButtonGroup className="w-100 gap-2">
                          {post.primaryActions?.includes('call') && (
                            <Button 
                              onClick={() => {
                                handleActionClickProtected(post._id, 'call');
                                window.location.href = `tel:${post.business?.phone}`;
                              }} 
                              variant="outline-secondary"
                              className="w-100 d-flex align-items-center justify-content-center gap-1"
                              style={{ borderRadius: '10px', fontSize: '12px', fontWeight: 600, padding: '0.6rem' }}
                            >
                              <BiPhone size={16} /> Call
                            </Button>
                          )}

                          {post.primaryActions?.includes('whatsapp') && (
                            <Button 
                              onClick={() => {
                                handleActionClickProtected(post._id, 'whatsapp');
                                const cleanPhone = post.business?.phone?.replace(/[^0-9]/g, ''); 
                                const shareMessage = encodeURIComponent(`Hi, I saw your post "${post.title}" on the Offers feed!`);
                                window.open(`https://wa.me/${cleanPhone}?text=${shareMessage}`, '_blank');
                              }}
                              variant="success"
                              className="w-100 d-flex align-items-center justify-content-center gap-1 text-white border-0"
                              style={{ borderRadius: '10px', fontSize: '12px', fontWeight: 600, padding: '0.6rem', backgroundColor: '#25D366' }}
                            >
                              <BiMessageRoundedDots size={16} /> WhatsApp
                            </Button>
                          )}

                          {post.primaryActions?.includes('book_now') && (
                            <Button 
                              onClick={() => {
                                handleActionClickProtected(post._id, 'book_now');
                                if (post.bookNowUrl) {
                                  const targetUrl = post.bookNowUrl.startsWith('http') 
                                    ? post.bookNowUrl 
                                    : `https://${post.bookNowUrl}`;
                                  window.open(targetUrl, '_blank', 'noopener,noreferrer');
                                }
                              }}
                              className="w-100 d-flex align-items-center justify-content-center gap-1 text-white border-0"
                              style={{ borderRadius: '10px', fontSize: '12px', fontWeight: 600, padding: '0.6rem', backgroundColor: '#ff4e00' }}
                            >
                              <BiCalendar size={16} /> Book Now
                            </Button>
                          )}

                          <Button 
                            onClick={() => executeProtectedAction(() => handleShareClick(post))}
                            variant="outline-primary"
                            className="d-flex align-items-center justify-content-center border custom-share-btn"
                          >
                            <BiShareAlt size={18} />
                          </Button>
                        </ButtonGroup>
                      </Card.Body>

                    </Card>
                  </Col>
                );
              })
            ) : (
              <Col xs={12} className="text-center py-5">
                <BiSolidHeart size={48} className="text-muted mb-3" />
                <h5 className="fw-bold text-dark">No saved offers found</h5>
                <p className="text-muted small mb-4">You haven't saved any offers or events to your wishlist yet.</p>
                <Button 
                  onClick={() => navigate('/offers')}
                  style={{ backgroundColor: '#ff4e00', borderColor: '#ff4e00', borderRadius: '10px', fontWeight: 600 }}
                >
                  Explore Offers
                </Button>
              </Col>
            )}
          </Row>
        )}

        <AuthGateModal 
          show={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
          defaultMode="login"
          onSuccess={handleAuthSuccess} 
        />

      </Container>
    </div>
  );
};

export default SavedOffers;