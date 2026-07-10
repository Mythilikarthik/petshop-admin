import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, ButtonGroup, Badge, Pagination, Spinner, Alert } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom'; // Imported hooks for reading/managing the query state
import { 
  BiTag, BiCalendar, BiSolidMegaphone, BiNews, 
  BiMap, BiTimeFive, BiShow, BiSolidHeart,
  BiPhone, BiMessageRoundedDots, BiChevronLeft, BiChevronRight
} from 'react-icons/bi';
import { useAuthProtectedAction } from '../hooks/useAuthProtectedAction';
import AuthGateModal from '../hooks/AuthGateModel'; // Adjust path as needed
import { useAuth } from '../contexts/AuthContext';

const API_BASE =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_URL
    : "http://localhost:5000";

const CATEGORIES = [
  { id: 'all', label: 'All Feeds', icon: BiNews },
  { id: 'Offers / Discounts', label: 'Offers & Deals', icon: BiTag },
  { id: 'Events', label: 'Events', icon: BiCalendar },
  { id: 'Announcements', label: 'Announcements', icon: BiSolidMegaphone }, 
];

const OfferSinglePage = () => {
  const [posts, setPosts] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [savedPosts, setSavedPosts] = useState({});
  const [carouselIndices, setCarouselIndices] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  
  // React Router location hooks to target the query matching strings
  const location = useLocation();
  const navigate = useNavigate();

  // Parsing lookups for tracking incoming parameters safely
  const queryParams = new URLSearchParams(location.search);
  const targetOfferId = queryParams.get('id');

  const { user, updateUser } = useAuth(); 

  // Sync frontend heart lights with the database user's wishlist array safely
  useEffect(() => {
    if (user && user.wishlist) {
      const databaseSavesMap = {};
      user.wishlist.forEach(item => {
        const id = typeof item === 'object' ? item._id : item; 
        if (id) {
          databaseSavesMap[id.toString()] = true;
        }
      });
      setSavedPosts(databaseSavesMap);
    } else {
      setSavedPosts({}); 
    }
  }, [user, user?.wishlist]);

  const itemsPerPage = 4;

  const { 
    showAuthModal, 
    setShowAuthModal, 
    executeProtectedAction, 
    handleAuthSuccess 
  } = useAuthProtectedAction();

  const handleActionClickProtected = (postId, actionType) => {
    executeProtectedAction(() => {
      handleActionClick(postId, actionType);
    });
  };

  const toggleSaveProtected = (postId) => {
    executeProtectedAction(() => {
      toggleSave(postId);
    });
  };

  // Fetch live records & trigger UNIQUE view tracking
  useEffect(() => {
    const fetchLiveFeeds = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/offers`);
        const data = await res.json();
        if (data.success) {
          const visibleOffers = (data.offers || []).filter(ad => ad.show !== 0);
          setPosts(visibleOffers);

          const viewedOffers = JSON.parse(localStorage.getItem('viewed_offers')) || [];
          const newViews = [];

          visibleOffers.forEach(post => {
            if (!viewedOffers.includes(post._id)) {
              newViews.push(post._id);
              post.analytics = { ...post.analytics, views: (post.analytics?.views || 0) + 1 };

              fetch(`${API_BASE}/api/offers/${post._id}/track-view`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' }
              }).catch(err => console.error("View tracking failed:", err));
            }
          });

          if (newViews.length > 0) {
            localStorage.setItem('viewed_offers', JSON.stringify([...viewedOffers, ...newViews]));
          }
        }
      } catch (err) {
        console.error("Error fetching live database feeds:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLiveFeeds();
  }, []);

  // Compute your filter logic dynamically
  const filteredPosts = (() => {
    // Priority 1: Filter exactly by the targeted offer ID if passed via query parameter
    if (targetOfferId) {
      return posts.filter(post => post._id === targetOfferId);
    }
    // Priority 2: Use your standard category logic
    return activeCategory === 'all' 
      ? posts 
      : posts.filter(post => post.category === activeCategory);
  })();

  // Reset category filters gracefully if a deep-link ID payload exists
  useEffect(() => {
    if (targetOfferId) {
      setActiveCategory('all');
    }
    setCurrentPage(1);
  }, [activeCategory, targetOfferId]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPosts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);

  const handleActionClick = async (postId, actionType) => {
    try {
      const token = localStorage.getItem('token'); 
      await fetch(`${API_BASE}/api/offers/${postId}/track-click`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ action: actionType })
      });
    } catch (err) {
      console.error(`Click tracking failed for ${actionType}:`, err);
    }
  };

  const toggleSave = async (postId) => {
    const token = localStorage.getItem('token'); 
    if (!token) return;

    const currentUserId = user?._id; 
    const isCurrentlySaved = !!savedPosts[postId];
    const nextSavedState = !isCurrentlySaved;

    setSavedPosts(prev => ({ ...prev, [postId]: nextSavedState }));

    try {
      const res = await fetch(`${API_BASE}/api/offers/${postId}/track-save`, {
        method: 'PUT',
        headers: { 
          "Content-Type": "application/json", 
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ 
          isSaving: nextSavedState, 
          userId: currentUserId 
        }) 
      });

      const data = await res.json();

      if (data.success && data.updatedAnalytics) {
        setPosts(prevPosts => 
          prevPosts.map(p => p._id === postId ? { 
            ...p, 
            analytics: {
              ...p.analytics, 
              ...data.updatedAnalytics, 
              saves: data.updatedAnalytics.saves
            }
          } : p)
        );

        if (updateUser && user) {
          const rawWishlist = user.wishlist || [];
          const updatedWishlist = nextSavedState 
            ? [...rawWishlist, postId]
            : rawWishlist.filter(item => (item._id || item) !== postId);
          
          updateUser({ ...user, wishlist: updatedWishlist });
        }
      } else {
        throw new Error(data.message || "Unsuccessful backend sync modification");
      }
    } catch (err) {
      console.error("Save tracking failed, reverting UI:", err.message);
      setSavedPosts(prev => ({ ...prev, [postId]: isCurrentlySaved }));
    }
  };

  const moveCarousel = (postId, direction, mediaLength) => {
    const currentIndex = carouselIndices[postId] || 0;
    let newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (newIndex >= mediaLength) newIndex = 0;
    if (newIndex < 0) newIndex = mediaLength - 1;
    setCarouselIndices(prev => ({ ...prev, [postId]: newIndex }));
  };

  // Helper method to completely strip tracking filters off the URL path cleanly
  const handleClearUrlFilter = () => {
    navigate('/offers', { replace: true });
  };

  let paginationItems = [];
  for (let number = 1; number <= totalPages; number++) {
    paginationItems.push(
      <Pagination.Item 
        key={number} 
        active={number === currentPage}
        onClick={() => {
          setCurrentPage(number);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        style={{
          '--bs-pagination-active-bg': '#ff4e00',
          '--bs-pagination-active-border-color': '#ff4e00',
          '--bs-pagination-color': '#475569',
        }}
      >
        {number}
      </Pagination.Item>
    );
  }

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
        
        <div className="mb-2">
          <h1 className="fw-extrabold text-dark tracking-tight m-0" style={{ fontSize: '1.75rem', fontWeight: 800 }}>
            Offer / Events / Announcements
          </h1>
        </div>

        {/* Dynamic Context Header Banner for Filtered Redirects */}
        {targetOfferId && !loading && (
          <Alert variant="info" className="d-flex align-items-center justify-content-between mb-4 border-0 shadow-sm" style={{ borderRadius: '12px', backgroundColor: '#e0f2fe', color: '#0369a1' }}>
            <div className="d-flex align-items-center gap-2">
              <span>Showing targeted specific record requested from post directory lookup.</span>
            </div>
            <Button 
              variant="link" 
              onClick={handleClearUrlFilter}
              className="p-0 text-decoration-none fw-bold small"
              style={{ color: '#0284c7' }}
            >
              Show All &rarr;
            </Button>
          </Alert>
        )}

        {/* <div className="bg-light-blur py-3 mb-4 border-bottom" style={{ zIndex: 1020, backdropFilter: 'blur(8px)', backgroundColor: 'rgba(248, 250, 252, 0.8)' }}>
          <div className="d-flex gap-2 overflow-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id && !targetOfferId;
              return (
                <Button
                  key={cat.id}
                  onClick={() => {
                    if (targetOfferId) handleClearUrlFilter();
                    setActiveCategory(cat.id);
                  }}
                  style={{
                    backgroundColor: isActive ? '#ff4e00' : '#ffffff',
                    color: isActive ? '#ffffff' : '#475569',
                    borderColor: isActive ? '#ff4e00' : '#e2e8f0',
                    borderRadius: '50px',
                    padding: '0.5rem 1.25rem',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                    transition: 'all 0.2s ease'
                  }}
                  className="d-flex align-items-center gap-2 border"
                >
                  <Icon size={16} />
                  {cat.label}
                </Button>
              );
            })}
          </div>
        </div> */}

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" style={{ color: '#ff4e00' }} />
            <p className="mt-2 text-muted">Fetching Offers / Events / Announcements...</p>
          </div>
        ) : (
          <Row className="g-4 align-items-center justify-content-center">
            {currentItems.length > 0 ? (
              currentItems.map((post) => {
                const currentImgIdx = carouselIndices[post._id] || 0;
                const isSaved = !!savedPosts[post._id];
                const currentMedia = post.media && post.media[currentImgIdx];

                const getMediaUrl = (url) => {
                  if (!url) return '';
                  return url.startsWith('http') ? url : `${API_BASE}/${url}`;
                };

                return (
                  <Col xs={12} md={6} key={post._id}>
                    <Card className="h-100 border-0 shadow-sm overflow-hidden" style={{ borderRadius: '16px' }}>
                      
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
                          style={{ backgroundColor: '#ff4e001a', borderRadius: '50px', padding: '0.4rem 0.75rem', fontWeight: 600 }}
                          className="d-flex align-items-center gap-1 small border-0"
                        >
                          <BiTimeFive size={12} />
                          <span>
                            {post.endDate ? `${Math.max(0, Math.ceil((new Date(post.endDate) - new Date()) / (1000 * 60 * 60 * 24)))} Days Left` : 'Active'}
                          </span>
                        </Badge>
                      </Card.Header>

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

                        <div className="position-absolute top-0 end-0 p-3 d-flex gap-2" style={{ zIndex: 10 }}>
                          <Button 
                            onClick={() => toggleSaveProtected(post._id)}
                            variant="light"
                            className="rounded-circle d-flex align-items-center justify-content-center shadow-sm p-0 border-0"
                            style={{ 
                              width: '36px', 
                              height: '36px', 
                              backgroundColor: 'rgba(255, 255, 255, 0.9)',
                              color: isSaved ? '#dc3545' : '#cbd5e1',
                              transition: 'color 0.2s ease'
                            }}
                          >
                            <BiSolidHeart size={20} />
                          </Button>
                        </div>
                      </div>

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

                        <div className="d-flex gap-3 px-3 py-2 rounded mb-3 border bg-light" style={{ fontSize: '12px', fontWeight: 500, color: '#64748b' }}>
                          <span className="d-flex align-items-center gap-1">
                            <BiShow size={14} /> 
                            {post.analytics?.viewedByIPs ? post.analytics.viewedByIPs.length : (post.analytics?.views || 0)} View(s)
                          </span>
                          <span className="d-flex align-items-center gap-1">
                            <BiSolidHeart size={14} style={{ color: isSaved ? '#dc3545' : '#94a3b8' }} /> 
                            {post.analytics?.savedByUsers ? post.analytics.savedByUsers.length : (post.analytics?.saves || 0)} Save(s)
                          </span>
                        </div>

                        <ButtonGroup className="w-100 gap-2">
                          {post.primaryActions?.includes('call') && (
                            <Button 
                              onClick={() => handleActionClickProtected(post._id, 'call')}
                              variant="outline-secondary"
                              className="w-100 d-flex align-items-center justify-content-center gap-2"
                              style={{ borderRadius: '10px', fontSize: '14px', fontWeight: 600, padding: '0.6rem' }}
                            >
                              <BiPhone size={16} /> Call
                            </Button>
                          )}

                          {post.primaryActions?.includes('whatsapp') && (
                            <Button 
                              onClick={() => handleActionClickProtected(post._id, 'whatsapp')}
                              variant="success"
                              className="w-100 d-flex align-items-center justify-content-center gap-2 text-white border-0"
                              style={{ borderRadius: '10px', fontSize: '14px', fontWeight: 600, padding: '0.6rem', backgroundColor: '#25D366' }}
                            >
                              <BiMessageRoundedDots size={16} /> WhatsApp
                            </Button>
                          )}

                          {post.primaryActions?.includes('book_now') && (
                            <Button 
                              onClick={() => handleActionClickProtected(post._id, 'book_now')}
                              className="w-100 d-flex align-items-center justify-content-center gap-2 text-white border-0"
                              style={{ borderRadius: '10px', fontSize: '14px', fontWeight: 600, padding: '0.6rem', backgroundColor: '#ff4e00' }}
                            >
                              <BiCalendar size={16} /> Book Now
                            </Button>
                          )}
                        </ButtonGroup>
                      </Card.Body>

                    </Card>
                  </Col>
                );
              })
            ) : (
              <Col xs={12} className="text-center py-5 text-muted">
                No active records discovered matching this feed criteria.
              </Col>
            )}
          </Row>
        )}

        {totalPages > 1 && !loading && (
          <div className="d-flex justify-content-center mt-5">
            <Pagination>
              <Pagination.Prev 
                disabled={currentPage === 1}
                onClick={() => {
                  setCurrentPage(prev => Math.max(prev - 1, 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
              {paginationItems}
              <Pagination.Next 
                disabled={currentPage === totalPages}
                onClick={() => {
                  setCurrentPage(prev => Math.min(prev + 1, totalPages));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </Pagination>
          </div>
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

export default OfferSinglePage;