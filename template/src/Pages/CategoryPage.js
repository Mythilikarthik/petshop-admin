import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { GiHollowCat, GiJumpingDog, GiHummingbird, GiTropicalFish, GiPawHeart, GiPhrygianCap } from "react-icons/gi";
import { FaStar, FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";
import './Css/CategoryPage.css';
import dummyImage from '../dummy.jpg';

const CategoryPage = () => {
  const { categoryName } = useParams();
  
  // Category data matching your original component
  const categories = {
    'dog': { 
      name: 'Dog', 
      icon: <GiJumpingDog />, 
      color: '#FFA726',
      description: 'Professional services for your loyal canine companions',
      services: ['Dog Walking', 'Dog Grooming', 'Dog Training', 'Veterinary Care', 'Pet Boarding', 'Dog Daycare'],
      tips: ['Regular exercise is essential for your dog\'s health', 'Maintain a consistent feeding schedule', 'Regular vet checkups prevent health issues']
    },
    'cat': { 
      name: 'Cat', 
      icon: <GiHollowCat />, 
      color: '#42A5F5',
      description: 'Specialized care for your independent feline friends',
      services: ['Cat Grooming', 'Veterinary Care', 'Cat Sitting', 'Litter Box Cleaning', 'Cat Behavioral Training', 'Emergency Care'],
      tips: ['Keep litter boxes clean and accessible', 'Provide vertical spaces for climbing', 'Regular grooming reduces shedding and hairballs']
    },
    'bird': { 
      name: 'Bird', 
      icon: <GiHummingbird />, 
      color: '#66BB6A',
      description: 'Expert care for your feathered companions',
      services: ['Bird Grooming', 'Avian Veterinary Care', 'Bird Sitting', 'Wing Clipping', 'Cage Cleaning', 'Behavioral Training'],
      tips: ['Provide a varied, nutritious diet', 'Ensure adequate social interaction', 'Maintain proper cage hygiene']
    },
    'fish': { 
      name: 'Fish', 
      icon: <GiTropicalFish />, 
      color: '#AB47BC',
      description: 'Professional aquatic pet care services',
      services: ['Aquarium Maintenance', 'Fish Health Consultation', 'Tank Setup', 'Water Quality Testing', 'Fish Feeding Service', 'Emergency Care'],
      tips: ['Monitor water quality regularly', 'Don\'t overfeed your fish', 'Maintain proper water temperature']
    },
    'small-pet': { 
      name: 'Small Pet', 
      icon: <GiPawHeart />, 
      color: '#EC407A',
      description: 'Caring services for rabbits, hamsters, guinea pigs, and more',
      services: ['Small Pet Grooming', 'Veterinary Care', 'Pet Sitting', 'Cage Cleaning', 'Nail Trimming', 'Health Checkups'],
      tips: ['Provide appropriate chew toys', 'Maintain a clean living environment', 'Handle gently and support properly']
    },
    'exotic-pet': { 
      name: 'Exotic Pet', 
      icon: <GiPhrygianCap />, 
      color: '#ffc107',
      description: 'Specialized care for unique and exotic animals',
      services: ['Exotic Veterinary Care', 'Specialized Grooming', 'Habitat Maintenance', 'Nutritional Consulting', 'Emergency Care', 'Behavioral Support'],
      tips: ['Research specific care requirements', 'Find exotic pet specialists', 'Maintain proper habitat conditions']
    }
  };

  // Sample service providers data
  const serviceProviders = [
    {
      id: 1,
      name: "Paws & Claws Veterinary Clinic",
      rating: 4.8,
      reviews: 156,
      location: "Downtown",
      phone: "(555) 123-4567",
      email: "info@pawsclaws.com",
      services: ["Veterinary Care", "Emergency Care", "Health Checkups"],
      image: dummyImage
    },
    {
      id: 2,
      name: "Happy Tails Grooming",
      rating: 4.9,
      reviews: 203,
      location: "Midtown",
      phone: "(555) 234-5678",
      email: "hello@happytails.com",
      services: ["Grooming", "Nail Trimming", "Behavioral Training"],
      image: dummyImage
    },
    {
      id: 3,
      name: "Pet Paradise Boarding",
      rating: 4.7,
      reviews: 89,
      location: "Uptown",
      phone: "(555) 345-6789",
      email: "stay@petparadise.com",
      services: ["Pet Boarding", "Pet Sitting", "Daycare"],
      image: dummyImage
    }
  ];

  const currentCategory = categories[categoryName] || categories['dog'];

  return (
    <div className="category-page">
      {/* Hero Section */}
      <section className="category-hero" style={{ backgroundColor: `${currentCategory.color}20` }}>
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <div className="category-hero-icon" style={{ color: currentCategory.color }}>
                {currentCategory.icon}
              </div>
              <h1>{currentCategory.name} Services</h1>
              <p className="hero-description">{currentCategory.description}</p>
              <Button 
                className="cta-button" 
                style={{ backgroundColor: currentCategory.color, borderColor: currentCategory.color }}
              >
                Find Services Near You
              </Button>
            </Col>
            <Col lg={6}>
              <div className="hero-image">
                <img 
                  src={dummyImage} 
                  alt={`${currentCategory.name} services`}
                  className="img-fluid rounded"
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Services Grid */}
      <section className="services-grid-section">
        <Container>
          <h2 className="section-title">Available Services</h2>
          <Row>
            {currentCategory.services.map((service, index) => (
              <Col md={4} className="mb-4" key={index}>
                <Card className="service-card h-100">
                  <Card.Body>
                    <div 
                      className="service-icon" 
                      style={{ backgroundColor: `${currentCategory.color}20`, color: currentCategory.color }}
                    >
                      {currentCategory.icon}
                    </div>
                    <Card.Title>{service}</Card.Title>
                    <Card.Text>
                      Professional {service.toLowerCase()} services for your {currentCategory.name.toLowerCase()}.
                    </Card.Text>
                    <Button 
                      variant="" 
                      style={{ borderColor: currentCategory.color, color: currentCategory.color }}
                    >
                      Learn More
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Service Providers */}
      <section className="service-providers-section">
        <Container>
          <h2 className="section-title">Top Service Providers</h2>
          <Row>
            {serviceProviders.map((provider) => (
              <Col lg={4} md={6} className="mb-4" key={provider.id}>
                <Card className="provider-card h-100">
                  <Card.Img variant="top" src={provider.image} alt={provider.name} />
                  <Card.Body className='d-flex flex-column justify-content-between'>
                    <Card.Title>{provider.name}</Card.Title>
                    <div className="provider-rating">
                      <FaStar className="star-icon" />
                      <span>{provider.rating}</span>
                      <span className="review-count">({provider.reviews} reviews)</span>
                    </div>
                    <div className="provider-info">
                      <div className="info-item">
                        <FaMapMarkerAlt />
                        <span>{provider.location}</span>
                      </div>
                      <div className="info-item">
                        <FaPhone />
                        <span>{provider.phone}</span>
                      </div>
                      <div className="info-item">
                        <FaEnvelope />
                        <span>{provider.email}</span>
                      </div>
                    </div>
                    <div className="provider-services">
                      <h6>Services:</h6>
                      <div className="service-tags">
                        {provider.services.map((service, index) => (
                          <span 
                            key={index} 
                            className="service-tag"
                            style={{ backgroundColor: `${currentCategory.color}20`, color: currentCategory.color }}
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Button 
                      className="w-100 mt-3" 
                      style={{ backgroundColor: currentCategory.color, borderColor: currentCategory.color }}
                    >
                      Contact Provider
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Care Tips */}
      <section className="care-tips-section" style={{ backgroundColor: `${currentCategory.color}10` }}>
        <Container>
          <h2 className="section-title">{currentCategory.name} Care Tips</h2>
          <Row>
            {currentCategory.tips.map((tip, index) => (
              <Col md={4} className="mb-3" key={index}>
                <Card className="tip-card h-100">
                  <Card.Body>
                    <div 
                      className="tip-number"
                      style={{ backgroundColor: currentCategory.color }}
                    >
                      {index + 1}
                    </div>
                    <Card.Text>{tip}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
            {/* Services by Cities */}
      <section className="services-by-city-section">
        <Container>
          <h2 className="section-title">Services by Cities</h2>
          <Card className="cities-box shadow-sm">
            <Card.Body>
              <div className="cities-list">
                {["Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Pune", "Kolkata"].map((city, index) => (
                  <Link to={`/city/${city.toLowerCase()}/${categoryName}`} key={index} className="city-link">
                    <span 
                      key={index} 
                      className="city-item"
                      style={{ color: currentCategory.color }}
                    >
                      {city}
                    </span>
                  </Link>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Container>
      </section>




      {/* Call to Action */}
      <section className="category-cta-section">
        <Container>
          <div className="cta-content text-center">
            <h2>Ready to Find the Best {currentCategory.name} Services?</h2>
            <p>Join thousands of pet owners who trust our platform for their pet care needs</p>
            <div className="cta-buttons">
              <Button 
                size="lg" 
                className="me-3"
                style={{ backgroundColor: currentCategory.color, borderColor: currentCategory.color }}
              >
                Find Services Now
              </Button>
              <Button variant="outline-secondary" size="lg"
              style={{ backgroundColor: currentCategory.color, borderColor: currentCategory.color, color: '#fff' }}>
                Learn More
              </Button>
            </div>
          </div>
        </Container>
      </section>
      
    </div>
  );
};

export default CategoryPage;