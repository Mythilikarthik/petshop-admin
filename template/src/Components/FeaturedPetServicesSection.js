import React, { useEffect, useState } from 'react';
import { Button, Row, Col, Card, Container } from 'react-bootstrap';
import Badge from './Badge';
import './Css/badges.css';
import './Css/featuredPetServices.css';
import { BsLightningFill, BsTagFill, BsHouseFill, BsGeoAltFill, BsStarFill } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import dummyImage from '../dummy.jpg';

const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://petshop-admin.onrender.com"
    : "http://localhost:5000";
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

const FeaturedPetServicesSection = () => {
    const [services, setServices] = useState([]);
    const navigate = useNavigate();
    
        const fetchServices = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/listing/featured-services`);
                const data = await res.json();
    
                if (data.success) {
                    setServices(data.services);
                }
            } catch (err) {
                console.error("Error fetching featured services:", err);
            }
        };
    
        useEffect(() => {
            fetchServices();
        }, []);
    return (
    <div className="featured-section">
        <Container>
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
                        <Card className={`service-card w-100 h-100 d-flex flex-column`}>
                            <Card.Header className="card-top-rated">
                                
                                
                                    
                                
                                {/* <div className="service-icon">
                                    <BsTagFill size={100} color="#ff8800" />
                                </div> */}
                                {service.image && service.image.length > 0 ? (
                                          <Card.Img 
                                          variant="top" 
                                          src={service.image}
                                          alt={service.shopName}
                                        />
                                        ) : (
                                          <Card.Img variant="top" src={dummyImage} alt={service.shopName} className='w-100' />
                                        )}
                                
                            </Card.Header>
                            <Card.Body className='pos-rel d-flex flex-grow-1 flex-column '>
                                
                                <Card.Title>{service.title}</Card.Title>
                                <div className="service-tags">
                                {service.tags.map((tag, index) => (
                                        <span key={service.id + "-tag-" + index} className="badge badge-top-rated">{tag}</span>
                                    ))}
                                </div>
                                <Card.Text className='mt-4'>{service.description}</Card.Text>
                                <div className="service-location">
                                    <span role="img" aria-label="location"> <BsGeoAltFill />  </span> {service.location}
                                </div>
                                <div className="service-tags">
                                    {service.category.map((categoryItem, index) => (
                                        <span 
                                            key={service.id + "-cat-" + index}
                                            className="service-tag tag-orange"
                                        >
                                            {categoryItem}
                                        </span>
                                    ))}
                                </div>
                                <div className="service-rating align-item-center d-flex gap-2">
                                    <span className='d-block' role="img" aria-label="star" style={{"verticalAlign" : "unset"}}> <BsStarFill /> </span> 
                                    <span className='d-block'>{service.rating}</span>
                                </div>
                                <Button
                                    variant={"primary"}
                                    className="details-btn mt-auto"
                                    onClick={() => navigate(`/listing/${service.id}`)}
                                >
                                    View Details
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
            <div className="text-center mt-3">
                <button variant="warning" className="orange-btn py-2 px-4 border-2 border-orange-500 bg-orange-500 text-white rounded-full"
                onClick={() => navigate("/directory")}
                >
                    View All Listings
                </button>
            </div>
        </Container>
    </div>
    );
};

export default FeaturedPetServicesSection;