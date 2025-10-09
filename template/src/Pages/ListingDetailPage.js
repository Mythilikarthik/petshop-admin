import React from 'react';
import { useParams } from 'react-router-dom';
import './Css/ListingDetailPage.css';
import dummyImage from '../dummy.jpg';
import { Col, Container, Row } from 'react-bootstrap';

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
  const { listingId } = useParams();
  const listing = allListings.find(l => l.id === Number(listingId));

  if (!listing) {
    return <div className="listing-detail-section"><h2>Listing not found.</h2></div>;
  }

  return (
    <section className="listing-detail-section">
      <Container>
        <h2>{listing.name}</h2>
      <div className="listing-type">{listing.type}</div>
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

      {/* Gallery Section */}
      {listing.gallery && listing.gallery.length > 0 && (
        <div className="listing-gallery">
          <h3>Gallery</h3>
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
      </Container>
    </section>
  );
};

export default ListingDetailPage;