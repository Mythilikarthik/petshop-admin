import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './Css/ListingDetailPage.css';
import dummyImage from '../dummy.jpg';
import { Col, Container, Row } from 'react-bootstrap';
import { FaStar } from 'react-icons/fa';

const sampleReviews = [
  { id: 1, listingId: 1, user: 'Asha', rating: 5, title: 'Excellent care', body: 'Very kind staff and great service.', date: '2025-10-01' },
  { id: 2, listingId: 1, user: 'Rahul', rating: 4, title: 'Good clinic', body: 'Reasonable prices and quick service.', date: '2025-09-18' },
  { id: 3, listingId: 1, user: 'Meera', rating: 3, title: 'Okay experience', body: 'Waiting time was long but vets are skilled.', date: '2025-08-05' },
];
const allListings = [
  {
    id: 1,
    name: "Paws & Claws Clinic",
    type: "Veterinary",
    city: "Mumbai",
    category: "dog",
    location: "Bandra West, Mumbai",
    description:
      "Premium veterinary services for all your pet’s healthcare needs.",
    details:
      "Open 24/7. Specializing in surgery, grooming, and vaccinations.",
    contact: {
      phone: "9876543210",
      email: "info@demo.com",
      address: "123 Pet Street, Bandra West, Mumbai",
      website: "https://demo.com",
    },
    gallery: [
      dummyImage,
        dummyImage,
        dummyImage,
    ],
  },
  // ...other listings
];

const ListingDetailPage = () => {
  const [form, setForm] = useState({ user: '', rating: 5, title: '', body: '' });
  const [hoverRating, setHoverRating] = useState(0); // <-- new: track hover for star input
  const { listingId } = useParams();
  const listing = allListings.find(l => l.id === Number(listingId));
  const [reviews, setReviews] = useState(() => sampleReviews.filter(r => r.listingId === listing.id));
  if (!listing) {
    return <div className="listing-detail-section"><h2>Listing not found.</h2></div>;
  } 
  

  const averageRating = () => {
    if (!reviews.length) return 0;
    return (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length);
  };

  const renderStars = (value) => {
    const full = Math.round(value);
    return Array.from({ length: 5 }).map((_, i) => (
      <FaStar key={i} color={i < full ? '#ffc107' : '#e4e5e9'} />
    ));
  };

  const addReview = (review) => {
    // in real app send to backend then update state with response
    const newReview = { id: Date.now(), listingId: listing.id, date: new Date().toISOString().slice(0,10), ...review };
    setReviews(prev => [newReview, ...prev]);
  };

  // Simple controlled form state
  

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.user || !form.body) return; // minimal validation
    addReview({ user: form.user, rating: Number(form.rating), title: form.title, body: form.body });
    setForm({ user: '', rating: 5, title: '', body: '' });
    setHoverRating(0);
  };
  return (
    <section className="listing-detail-section">
      <Container>
        <h2>{listing.name}</h2>
      <div className="listing-type">{listing.type}</div>
      <div className='top-left'>
        <Row className='d-flex align-items-center'>
          <Col md={6}>
            <div className="listing-location">{listing.location} ({listing.city})</div>
            <div className="listing-category">Category: {listing.category}</div>
            <p className="listing-description">{listing.description}</p>
            <div className="listing-details">{listing.details}</div>
            {/* Contact Info Section */}
            <div className="listing-contact">
              <h3>Contact Information</h3>
              <ul>
                <li><strong>Phone:</strong> <a href={`tel:${listing.contact.phone}`}>{listing.contact.phone}</a></li>
                <li><strong>Email:</strong> <a href={`mailto:${listing.contact.email}`}>{listing.contact.email}</a></li>
                <li><strong>Address:</strong> {listing.contact.address}</li>
                {listing.contact.website && (
                  <li>
                    <strong>Website:</strong>{" "}
                    <a href={listing.contact.website} target="_blank" rel="noopener noreferrer">
                      {listing.contact.website}
                    </a>
                  </li>
                )}
              </ul>
            </div>            
          </Col>
          <Col md={6}>
            <div className="listing-image">
              <img className='img-responsive' src={dummyImage} alt={listing.name} width={535} height={355} />
            </div>
          </Col>
        </Row>
      </div>

      {/* Gallery Section */}
      {listing.gallery && listing.gallery.length > 0 && (
        <div className="listing-gallery">
          <h2>Gallery</h2 >
          <div className="gallery-grid">
            <Row>
                
                    {listing.gallery.map((img, index) => (
                        <Col xs={12} md={4} className="mb-3">
                    <div key={index} className="gallery-item">
                        <img className='img-responsive' src={img} alt={`${listing.name} ${index + 1}`} />
                    </div>
                </Col>
                    ))}
            </Row>
          </div>
        </div>
      )}
<h2>Reviews</h2>
      <div className="review-summary" style={{ marginTop: 18, marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ fontSize: 28, fontWeight: 700 }}>{averageRating().toFixed(1)}</div>
                  <div>
                    <div>{renderStars(averageRating())}</div>
                    <div style={{ color: '#6b7280', fontSize: 14 }}>{reviews.length} review{reviews.length !== 1 ? 's' : ''}</div>
                  </div>
                </div>
              </div>
              

              {/* Write review form */}
              <div className="write-review pt-4 pb-4" style={{ marginTop: 12, marginBottom: 20 }}>
                <Row>
                  <Col md={6}>
                    <h4 className='mb-4'>Ratings & Reviews</h4>
                    <div className='mb-4'>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          {Array.from({ length: 5 }).map((_, i) => {
                            const val = i + 1;
                            const active = val <= (hoverRating || form.rating);
                            return (
                              <FaStar
                                key={val}
                                size={22}
                                color={active ? '#ffc107' : '#e4e5e9'}
                                style={{ cursor: 'pointer' }}
                                onMouseEnter={() => setHoverRating(val)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setForm({ ...form, rating: val })}
                                aria-label={`${val} star`}
                              />
                            );
                          })}
                          <div style={{ marginLeft: 8, color: '#6b7280' }}>{form.rating} / 5</div>
                        </div>
                      </div>
                    <form onSubmit={handleSubmit}>
                      <div style={{ marginBottom: 8 }}>
                        <input
                          type="text"
                          placeholder="Your name"
                          value={form.user}
                          onChange={e => setForm({ ...form, user: e.target.value })}
                          className="form-control"
                        />
                      </div>
                      
                      {/* <div style={{ marginBottom: 8 }}>
                        <select value={form.rating} onChange={e => setForm({ ...form, rating: e.target.value })} className="form-control">
                          <option value={5}>5 - Excellent</option>
                          <option value={4}>4 - Very good</option>
                          <option value={3}>3 - Average</option>
                          <option value={2}>2 - Poor</option>
                          <option value={1}>1 - Terrible</option>
                        </select>
                      </div> */}
                      <div style={{ marginBottom: 8 }}>
                        <input
                          type="text"
                          placeholder="Review title (optional)"
                          value={form.title}
                          onChange={e => setForm({ ...form, title: e.target.value })}
                          className="form-control"
                        />
                      </div>
                      <div style={{ marginBottom: 8 }}>
                        <textarea
                          placeholder="Share your experience"
                          value={form.body}
                          onChange={e => setForm({ ...form, body: e.target.value })}
                          className="form-control"
                          rows={3}
                        />
                      </div>
                      <div>
                        <button type="submit" className="btn btn-primary mt-4">Submit review</button>
                      </div>
                    </form>
                  </Col>
                </Row>
              </div>

              {/* Review list */}
              <div className="review-list">
                <h2>Customer reviews</h2>
                {reviews.length === 0 ? (
                  <div>No reviews yet. Be the first to review.</div>
                ) : (
                  reviews.map(r => (
                    <div key={r.id} className="review-item" style={{ borderBottom: '1px solid #e6e9ef', padding: '12px 0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontWeight: 600 }}>{r.user}</div>
                        <div style={{ color: '#6b7280', fontSize: 13 }}>{r.date}</div>
                      </div>
                      <div style={{ margin: '6px 0' }}>{renderStars(r.rating)}</div>
                      {r.title && <div style={{ fontWeight: 700 }}>{r.title}</div>}
                      <div style={{ marginTop: 6 }}>{r.body}</div>
                    </div>
                  ))
                )}
              </div>
      </Container>
    </section>
  );
};

export default ListingDetailPage;