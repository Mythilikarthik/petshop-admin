import React from 'react';
import { Button, Row, Col, Card, Container } from 'react-bootstrap';
import Badge from './Badge';
import './Css/badges.css';
import './Css/featuredPetServices.css';
import { BsLightningFill, BsTagFill, BsHouseFill, BsGeoAltFill, BsStarFill } from 'react-icons/bs';


const services = [
    {
        id: 1,
        title: 'Paws & Claws Clinic',
        category: 'Top Rated',
        description: "Premium veterinary services with state-of-the-art facilities for all your pet’s healthcare needs.",
        location: "Bandra West, Mumbai",
        rating: 4.9,
        tags: ['Veterinary', '24/7 Emergency', 'Pet Surgery'],
        icon: <BsTagFill size={100} color="#ff8800" />
    },
    {
        id: 2,
        title: 'Furry Friends Grooming',
        category: 'Popular',
        description: "Professional grooming services to keep your pets clean, healthy, and looking their best.",
        location: "Indiranagar, Bangalore",
        rating: 4.8,
        tags: ['Grooming', 'Spa', 'Pet Styling'],
        icon: <BsLightningFill size={100} color="#3b82f6" />
    },
    {
        id: 3,
        title: 'Happy Tails Boarding',
        category: 'New',
        description: "Luxury pet boarding with spacious accommodations, playtime, and personalized care.",
        location: "Gurgaon, Delhi NCR",
        rating: 4.7,
        tags: ['Boarding', 'Daycare', 'Training'],
        icon: <BsHouseFill size={100} color="#1ecb6b" />
    }
];

const categoryBg = {
    'Top Rated': 'card-top-rated',
    'Popular': 'card-popular',
    'New': 'card-new'
};

const tagColors = {
    'Veterinary': 'tag-orange',
    '24/7 Emergency': 'tag-green',
    'Pet Surgery': 'tag-blue',
    'Grooming': 'tag-pink',
    'Spa': 'tag-yellow',
    'Pet Styling': 'tag-purple',
    'Boarding': 'tag-green',
    'Daycare': 'tag-orange',
    'Training': 'tag-blue'
};

const FeaturedPetServicesSection = () => (
    <div className="featured-section">
        <Container fluid>
            <div className='title text-center'>
                <h2>
                    Featured <span className="highlight">Pet Services</span>
                </h2>
                <p className="subtitle">
                    Top-rated pet services loved by pet parents across India
                </p>
            </div>
            <Row className="justify-content-center">
                {services.map(service => (
                    <Col key={service.id} md={4} className="mb-4">
                        <Card className={`service-card `}>
                            <Card.Header className={`${categoryBg[service.category]}`}>
                                <Badge type={service.category} />
                                <div className="service-icon">{service.icon}</div>
                                
                            </Card.Header>
                            <Card.Body className='pos-rel'>
                                <Card.Title>{service.title}</Card.Title>
                                <Card.Text>{service.description}</Card.Text>
                                <div className="service-location">
                                    <span role="img" aria-label="location"> <BsGeoAltFill />  </span> {service.location}
                                </div>
                                <div className="service-tags">
                                    {service.tags.map(tag => (
                                        <span key={tag} className={`service-tag ${tagColors[tag]}`}>{tag}</span>
                                    ))}
                                </div>
                                <div className="service-rating align-item-center d-flex gap-2">
                                    <span className='d-block' role="img" aria-label="star" style={{"verticalAlign" : "unset"}}> <BsStarFill /> </span> 
                                    <span className='d-block'>{service.rating}</span>
                                </div>
                                <Button
                                    variant={
                                        service.category === 'Top Rated' ? 'warning'
                                        : service.category === 'Popular' ? 'primary'
                                        : 'success'
                                    }
                                    className="details-btn"
                                >
                                    View Details
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
            <div className="text-center mt-3">
                <button variant="warning" className="orange-btn py-2 px-4 border-2 border-orange-500 bg-orange-500 text-white rounded-full">
                    View All Listings
                </button>
            </div>
        </Container>
    </div>
);

export default FeaturedPetServicesSection;