import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, ButtonGroup, Badge, Pagination, Spinner, Alert, Modal } from 'react-bootstrap';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'; 
import { 
  BiTag, BiCalendar, BiSolidMegaphone, BiNews, 
  BiMap, BiTimeFive, BiShow, BiSolidHeart,
  BiPhone, BiMessageRoundedDots, BiChevronLeft, BiChevronRight,
  BiShareAlt, BiZoomIn
} from 'react-icons/bi';
import { useAuthProtectedAction } from '../hooks/useAuthProtectedAction';
import AuthGateModal from '../hooks/AuthGateModel'; 
import { useAuth } from '../contexts/AuthContext';
import "./Css/Offers.css"

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
const GENERAL_OFFER_TERMS = "Offers are provided and fulfilled by the respective service providers; VetandPets.in does not guarantee offer availability, pricing, or service quality. Please confirm offer validity and terms directly with the provider before purchase.";

const Offers = () => {
  const [posts, setPosts] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [savedPosts, setSavedPosts] = useState({});
  const [carouselIndices, setCarouselIndices] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  
  // Looping Lightbox States
  const [lightboxData, setLightboxData] = useState({ 
    show: false, 
    mediaList: [], 
    currentIndex: 0 
  });


  // Add these state variables near the top of your Offers component
const [selectedCity, setSelectedCity] = useState('all');
const [expiryFilter, setExpiryFilter] = useState('all'); // 'all', 'ending_soon', 'active'
const [sortBy, setSortBy] = useState('newest'); // 'newest', 'most_viewed', 'most_saved'

// Extract unique cities dynamically from the loaded posts for the dropdown filter
const availableCities = [...new Set(posts.map(post => post.business?.city).filter(Boolean))];

  const handleOpenLightbox = (mediaArray, startIndex) => {
    setLightboxData({
      show: true,
      mediaList: mediaArray.filter(m => m.type === 'image'),
      currentIndex: startIndex
    });
  };

  const handleLightboxNav = (direction) => {
    setLightboxData(prev => {
      const length = prev.mediaList.length;
      let newIndex = direction === 'next' ? prev.currentIndex + 1 : prev.currentIndex - 1;
      if (newIndex >= length) newIndex = 0;       
      if (newIndex < 0) newIndex = length - 1;    
      return { ...prev, currentIndex: newIndex };
    });
  };
  
  const location = useLocation();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const encodedId = searchParams.get('ref');
  const targetOfferId = (encodedId && encodedId !== btoa("undefined")) 
  ? atob(encodedId) 
  : null;

  const { user, updateUser } = useAuth(); 

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

  const handleShareProtected = (post) => {
    executeProtectedAction(() => {
      handleShareClick(post);
    });
  };

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

  // 🟢 Fixed Auto-slide effect for posts containing multiple media items
  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIndices(prevIndices => {
        const updatedIndices = { ...prevIndices };
        posts.forEach(post => {
          if (post.media && post.media.length > 1) {
            const currentIndex = prevIndices[post._id] || 0;
            updatedIndices[post._id] = (currentIndex + 1) % post.media.length;
          }
        });
        return updatedIndices;
      });
    }, 4000); // Changes image every 4 seconds sequentially

    return () => clearInterval(interval);
  }, [posts]);

  // const filteredPosts = (() => {
  //   if (targetOfferId) {
  //     return posts.filter(post => post._id === targetOfferId);
  //   }
  //   return activeCategory === 'all' 
  //     ? posts 
  //     : posts.filter(post => post.category === activeCategory);
  // })();
  const filteredPosts = (() => {
    let result = [...posts];

    // 1. Target Offer ID from URL
    if (targetOfferId) {
      return result.filter(post => post._id === targetOfferId);
    }

    // 2. Category Filter
    if (activeCategory !== 'all') {
      result = result.filter(post => post.category === activeCategory);
    }

    // 3. City Filter
    if (selectedCity !== 'all') {
      result = result.filter(post => post.business?.city === selectedCity);
    }

    // 4. Expiry Filter
    if (expiryFilter === 'ending_soon') {
      const now = new Date();
      const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
      result = result.filter(post => {
        const end = new Date(post.endDate);
        return end >= now && end <= threeDaysFromNow;
      });
    }

    // 5. Sorting Logic
    result.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortBy === 'most_viewed') {
        const viewsA = a.analytics?.viewedByIPs?.length || a.analytics?.views || 0;
        const viewsB = b.analytics?.viewedByIPs?.length || b.analytics?.views || 0;
        return viewsB - viewsA;
      }
      if (sortBy === 'most_saved') {
        const savesA = a.analytics?.savedByUsers?.length || a.analytics?.saves || 0;
        const savesB = b.analytics?.savedByUsers?.length || b.analytics?.saves || 0;
        return savesB - savesA;
      }
      return 0;
    });

    return result;
  })();

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
        setPosts(prev => prev.map(p => p._id === postId ? { ...p, analytics: data.updatedAnalytics } : p));
      }
    } catch (err) {
      console.error(`Click tracking failed for ${actionType}:`, err);
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
        console.log('User cancelled share sheet interaction context.', err);
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

  const getMediaUrl = (url) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `${API_BASE}/${url}`;
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '2rem 0' }}>
      <Container>
        
        <div className="mb-2">
          <h1 className="fw-extrabold text-dark tracking-tight m-0" style={{ fontSize: '1.75rem', fontWeight: 800 }}>
            Offer / Events / Announcements
          </h1>
        </div>

        {targetOfferId && !loading && (
          <Alert variant="info" className="d-flex align-items-center justify-content-between mb-4 border-0 shadow-sm" style={{ borderRadius: '12px', backgroundColor: '#e0f2fe', color: '#0369a1' }}>
            <div className="d-flex align-items-center gap-2">
              <span>Showing targeted specific record requested from shared reference lookup link.</span>
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

        <Row>
          {/* <Col md={3}>
            <div className="position-sticky bg-light-blur py-3 mb-4 border-bottom" style={{ top: '120px', zIndex: 102, backdropFilter: 'blur(8px)', backgroundColor: 'rgba(248, 250, 252, 0.8)' }}>
              <div className="d-flex gap-2 flex-column overflow-auto pb-1" style={{ scrollbarWidth: 'none' }}>
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
            </div>
          </Col> */}
          <Col md={3}>
            <div className="position-sticky py-3 mb-4" style={{ top: '120px', zIndex: 102 }}>
              
              {/* Category Filters */}
              <div className="mb-4">
                <h6 className="fw-bold text-dark mb-3 px-1" style={{ fontSize: '0.9rem' }}>Feeds Category</h6>
                <div className="d-flex gap-2 flex-column">
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
                          borderRadius: '10px',
                          padding: '0.5rem 1rem',
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          textAlign: 'left',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                          transition: 'all 0.2s ease'
                        }}
                        className="d-flex align-items-center gap-2 border w-100"
                      >
                        <Icon size={16} />
                        {cat.label}
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* City Filter */}
              <div className="mb-4">
                <h6 className="fw-bold text-dark mb-2 px-1" style={{ fontSize: '0.9rem' }}>Filter by City</h6>
                <select 
                  className="form-select form-select-sm"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  style={{ borderRadius: '8px', padding: '0.5rem' }}
                >
                  <option value="all">All Cities</option>
                  {availableCities.map((city, idx) => (
                    <option key={idx} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              {/* Expiry Filter */}
              <div className="mb-4">
                <h6 className="fw-bold text-dark mb-2 px-1" style={{ fontSize: '0.9rem' }}>Expiry Filter</h6>
                <select 
                  className="form-select form-select-sm"
                  value={expiryFilter}
                  onChange={(e) => setExpiryFilter(e.target.value)}
                  style={{ borderRadius: '8px', padding: '0.5rem' }}
                >
                  <option value="all">All Active Offers</option>
                  <option value="ending_soon">Ending Soon (Next 3 Days)</option>
                </select>
              </div>

              {/* Sort By Filter */}
              <div className="mb-3">
                <h6 className="fw-bold text-dark mb-2 px-1" style={{ fontSize: '0.9rem' }}>Sort By</h6>
                <select 
                  className="form-select form-select-sm"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{ borderRadius: '8px', padding: '0.5rem' }}
                >
                  <option value="newest">Newest First</option>
                  <option value="most_viewed">Most Viewed</option>
                  <option value="most_saved">Most Saved</option>
                </select>
              </div>

              {/* Reset Filters Option */}
              {(activeCategory !== 'all' || selectedCity !== 'all' || expiryFilter !== 'all' || sortBy !== 'newest') && (
                <Button 
                  variant="outline-danger" 
                  size="sm" 
                  className="w-100 mt-2" 
                  style={{ borderRadius: '8px' }}
                  onClick={() => {
                    setActiveCategory('all');
                    setSelectedCity('all');
                    setExpiryFilter('all');
                    setSortBy('newest');
                    handleClearUrlFilter();
                  }}
                >
                  Reset All Filters
                </Button>
              )}

            </div>
          </Col>

          <Col md={9}>
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" style={{ color: '#ff4e00' }} />
                <p className="mt-2 text-muted">Fetching Offers / Events / Announcements...</p>
              </div>
            ) : (
              <>
              <Row className="g-4">
                {currentItems.length > 0 ? (
                  currentItems.map((post) => {
                    const currentImgIdx = carouselIndices[post._id] || 0;
                    const isSaved = !!savedPosts[post._id];
                    const currentMedia = post.media && post.media[currentImgIdx];
                    const totalImagesCount = post.media ? post.media.filter(m => m.type === 'image').length : 0;

                    return (
                      <Col xs={12} md={6} key={post._id}>
                        <Card className="h-100 border-0 shadow-sm overflow-hidden" style={{ borderRadius: '16px' }}>
                          
                          <Card.Header className="bg-white border-bottom-0 p-3 d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center gap-3">
                              <div>
                                <h6 className="m-0 fw-bold text-dark text-truncate" style={{ maxWidth: '180px', fontSize: '1.5rem', textTransform: 'capitalize' }}>
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
                              className="d-flex align-items-center gap-1 small border-0 text-white"
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
                                  <div 
                                    className="w-100 h-100 position-relative cursor-pointer group-image-wrapper"
                                    onClick={() => handleOpenLightbox(post.media, currentImgIdx)}
                                    style={{ cursor: 'pointer' }}
                                  >
                                    <img 
                                      src={getMediaUrl(currentMedia.url)} 
                                      alt="Main media asset" 
                                      className="img-fluid w-100 h-100"
                                      style={{ objectFit: 'cover', width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 1 }}
                                    />
                                    {/* Zoom Hint Badge */}
                                    <div className="position-absolute bottom-0 end-0 m-2 px-2 py-1 rounded bg-dark bg-opacity-75 text-white d-flex align-items-center gap-1 small" style={{ zIndex: 2, fontSize: '11px' }}>
                                      <BiZoomIn size={14} /> Click to zoom {totalImagesCount > 1 ? `(${currentImgIdx + 1}/${totalImagesCount})` : ''}
                                    </div>
                                  </div>
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

                            {/* Darker, High-Contrast Save Button Container */}
                            <div className="position-absolute top-0 end-0 p-3 d-flex gap-2" style={{ zIndex: 10 }}>
                              <Button 
                                onClick={() => toggleSaveProtected(post._id)}
                                variant="light"
                                title={isSaved ? "Saved to wishlist" : "Save this offer"}
                                className={`rounded-circle d-flex align-items-center justify-content-center shadow ${isSaved ? 'pulse-save-btn' : ''}`}
                                style={{ 
                                  width: '40px', 
                                  height: '40px', 
                                  backgroundColor: isSaved ? '#212529' : 'rgba(33, 37, 41, 0.85)',
                                  color: isSaved ? '#ff4e00' : '#ffffff',
                                  border: isSaved ? '2px solid #ff4e00' : '1px solid rgba(255, 255, 255, 0.3)',
                                  transform: isSaved ? 'scale(1.08)' : 'scale(1)',
                                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
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
                              <span className="d-flex align-items-center gap-1">
                                <BiShareAlt size={14} style={{ color: '#0284c7' }} /> 
                                {(post.analytics?.clicks?.share?.length || 0)} Share(s)
                              </span>
                            </div>

                            <ButtonGroup className="w-100 gap-2">
                              {post.primaryActions?.includes('call') && (
                                <Button 
                                  onClick={() => {
                                    handleActionClickProtected(post._id, 'call');
                                    window.location.href = `tel:${post.business?.phone}`;
                                  }} 
                                  variant="outline-secondary"
                                  className="w-100 d-flex align-items-center justify-content-center gap-2"
                                  style={{ borderRadius: '10px', fontSize: '14px', fontWeight: 600, padding: '0.6rem' }}
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
                                  className="w-100 d-flex align-items-center justify-content-center gap-2 text-white border-0"
                                  style={{ borderRadius: '10px', fontSize: '14px', fontWeight: 600, padding: '0.6rem', backgroundColor: '#25D366' }}
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
                                  className="w-100 d-flex align-items-center justify-content-center gap-2 text-white border-0"
                                  style={{ borderRadius: '10px', fontSize: '14px', fontWeight: 600, padding: '0.6rem', backgroundColor: '#ff4e00' }}
                                >
                                  <BiCalendar size={16} /> Book Now
                                </Button>
                              )}

                              <Button 
                                onClick={() => handleShareProtected(post)}
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
                  <Col xs={12} className="text-center py-5 text-muted">
                    No active records discovered matching this feed criteria.
                  </Col>
                )}
              </Row>
             
    <div 
      className="mt-2 p-2 rounded bg-light border-start border-3 border-warning text-muted" 
      style={{ fontSize: '11px', lineHeight: '1.4' }}
    >
      <span className="fw-bold text-dark">Terms: </span> 
      {GENERAL_OFFER_TERMS}
    </div>
  </>
            )}

            {totalPages > 1 && !loading && (
              <div className="d-flex justify-content-center mt-5">
                <Pagination>
                  <Pagination.Prev 
                    disabled={currentPage === 1}
                    onClick={() => {
                      setCurrentPage(prev => Math.max(prev - 1, 1));
                      window.scrollTo({ top: 'smooth' });
                    }}
                  />
                  {paginationItems}
                  <Pagination.Next 
                    disabled={currentPage === totalPages}
                    onClick={() => {
                      setCurrentPage(prev => Math.min(prev + 1, totalPages));
                      window.scrollTo({ top: 'smooth' });
                    }}
                  />
                </Pagination>
              </div>
            )}
          </Col>
        </Row>

        {/* Looping Lightbox Modal Component */}
        <Modal 
          show={lightboxData.show} 
          onHide={() => setLightboxData(prev => ({ ...prev, show: false }))} 
          centered 
          size="lg"
          contentClassName="bg-dark border-0 shadow-lg text-white"
        >
          <Modal.Header closeButton closeVariant="white" className="border-0 pb-0">
            <Modal.Title className="small text-muted">
              Image {lightboxData.currentIndex + 1} of {lightboxData.mediaList.length}
            </Modal.Title>
          </Modal.Header>
          
          <Modal.Body className="text-center p-0 d-flex align-items-center justify-content-center position-relative pb-4" style={{ minHeight: '60vh' }}>
            {lightboxData.mediaList.length > 0 && (
              <>
                <img 
                  src={getMediaUrl(lightboxData.mediaList[lightboxData.currentIndex]?.url)} 
                  alt="Enlarged looping view" 
                  className="img-fluid rounded px-5" 
                  style={{ maxHeight: '75vh', objectFit: 'contain' }} 
                />

                {lightboxData.mediaList.length > 1 && (
                  <>
                    <Button 
                      onClick={() => handleLightboxNav('prev')}
                      variant="dark"
                      className="position-absolute start-0 ms-3 top-50 translate-middle-y rounded-circle d-flex align-items-center justify-content-center shadow border-0"
                      style={{ width: '45px', height: '45px', backgroundColor: 'rgba(0, 0, 0, 0.7)', zIndex: 10 }}
                    >
                      <BiChevronLeft size={28} />
                    </Button>
                    <Button 
                      onClick={() => handleLightboxNav('next')}
                      variant="dark"
                      className="position-absolute end-0 me-3 top-50 translate-middle-y rounded-circle d-flex align-items-center justify-content-center shadow border-0"
                      style={{ width: '45px', height: '45px', backgroundColor: 'rgba(0, 0, 0, 0.7)', zIndex: 10 }}
                    >
                      <BiChevronRight size={28} />
                    </Button>
                  </>
                )}
              </>
            )}
          </Modal.Body>
        </Modal>

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

export default Offers;