import React from 'react';
import { Link } from 'react-router-dom';
import {  Row, Col, Card, Container } from 'react-bootstrap';
import './Css/badges.css';
import './Css/featuredPetServices.css';
import { BsLightningFill, BsTagFill, BsHouseFill,  } from 'react-icons/bs';
import backgroundImage from './Image/bg-image.svg';


const services = [
    {
        id: 1,
        title: 'Paws & Claws Clinic',
        category: 'Top Rated',
        description: "Premium veterinary services with state-of-the-art facilities for all your pet’s healthcare needs.",
        location: "Bandra West, Mumbai",
        date: 'Aug 15, 2023',
        tags: ['Veterinary', '24/7 Emergency', 'Pet Surgery'],
        icon: <BsTagFill size={100} color="#ff8800" />,
        color:"#ff8800" 
    },
    {
        id: 2,
        title: 'Furry Friends Grooming',
        category: 'Popular',
        description: "Professional grooming services to keep your pets clean, healthy, and looking their best.",
        location: "Indiranagar, Bangalore",
        date: 'Aug 15, 2023',
        tags: ['Grooming', 'Spa', 'Pet Styling'],
        icon: <BsLightningFill size={100} color="#3b82f6" />,
        color: "#3b82f6" 
    },
    {
        id: 3,
        title: 'Happy Tails Boarding',
        category: 'New',
        description: "Luxury pet boarding with spacious accommodations, playtime, and personalized care.",
        location: "Gurgaon, Delhi NCR",
        date: 'Aug 15, 2023',
        tags: ['Boarding', 'Daycare', 'Training'],
        icon: <BsHouseFill size={100} color="#1ecb6b" />,
        color: "#1ecb6b" 
    }
];

const categoryBg = {
    'Top Rated': 'card-top-rated',
    'Popular': 'card-popular',
    'New': 'card-new'
};


const PetHealthTips = () => (
    <div className="featured-section bg-image"  style={{"background-image": `url(${backgroundImage})`}}>
        <Container fluid>
            <div className='title text-center'>
                <h2>
                    Pet Health <span className="highlight">Tips & Articles</span>
                </h2>
                <p className="subtitle">
                    Expert advice to keep your pets happy and healthy
                </p>
            </div>
            <Row className="justify-content-center">
                {services.map(service => (
                    <Col key={service.id} md={4} className="mb-4">
                        <Card className={`pethealth-card `}>
                            <Card.Header className={`${categoryBg[service.category]}`}>                            
                                <div className="service-icon">{service.icon}</div>                            
                            </Card.Header>
                            <Card.Body className='pos-rel'>
                                <span className="category-badge mb-3 d-block">{service.date}</span>
                                <Card.Title>{service.title}</Card.Title>
                                <Card.Text>{service.description}</Card.Text>
                                <Link as button style={{color: `${service.color}`}} to={`/services/${service.id}`}>
                                    Read More                            
                                </Link>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
            <div className="text-center mt-3">
                <button  className="view-all-btn">
                    View All Articles
                </button>
            </div>
        </Container>
    </div>
);

export default PetHealthTips;