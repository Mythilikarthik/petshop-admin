import React, { useEffect, useState } from 'react';
import { Button, Row, Col, Card, Container } from 'react-bootstrap';
import Badge from './Badge';
import './Css/badges.css';
import './Css/featuredPetServices.css';
import { BsLightningFill, BsTagFill, BsHouseFill, BsGeoAltFill, BsStarFill } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import dummyImage from '../dummy.jpg';
import { FaStar } from 'react-icons/fa';
import StarRating from './StarRating';
import petFriendlyRestaurantImg from "../assets/dummies/pet-friendly-restaurant.jpg";
import petSpaImg from "../assets/dummies/pet-spa.jpg";
import petFriendlyCafeImg from "../assets/dummies/pet-friendly-cafe.jpg";
import petSitterImg from "../assets/dummies/pet-sitter.jpg";
import dayCareImg from "../assets/dummies/day-care.jpg";
import petBoardingImg from "../assets/dummies/pet-boarding.jpg";
import petTaxiImg from "../assets/dummies/pet-taxi.jpg";
import forSaleImg from "../assets/dummies/for-sale.jpg";
import care247Img from "../assets/dummies/care-247.jpg";
import vetHospitalImg from "../assets/dummies/veterinary-hospital.jpg";
import groomingImg from "../assets/dummies/grooming.jpg";
import petRelocationImg from "../assets/dummies/pet-relocation.jpg";
import defaultImg from "../dummy.jpg";

const API_BASE =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_URL
    : "http://localhost:5000";
const categoryDummyImages = {
  "pet friendly restaurant": petFriendlyRestaurantImg,
  "pet spa": petSpaImg,
  "pet friendly cafe": petFriendlyCafeImg,
  "pet sitter": petSitterImg,
  "day care centre": dayCareImg,
  "pet boarding services": petBoardingImg,
  "pet taxi": petTaxiImg,
  "for sale": forSaleImg,
  "24/7 care": care247Img,
  "veterinary hospital": vetHospitalImg,
  "grooming": groomingImg,
  "pet relocation": petRelocationImg,
};
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

        useEffect(() => {
  const fetchReviews = async () => {
    try {
      const responses = await Promise.all(
        services.map(async (service) => {
          const res = await fetch(`${API_BASE}/api/reviews/list/${service.id}`);
          const data = await res.json();
          return {
            serviceId: service.id,
            reviews: data.success ? data.reviews : [],
          };
        })
      );

      const reviewsMap = {};
      responses.forEach(({ serviceId, reviews }) => {
        reviewsMap[serviceId] = reviews;
      });

      setReviewsByService(reviewsMap);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  if (services.length) {
    fetchReviews();
  }
}, [services]);
const [reviewsByService, setReviewsByService] = useState({});
const averageRating = (serviceId) => {
  const reviews = reviewsByService[serviceId] || [];
  if (!reviews.length) return 0;

  return (
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
  ).toFixed(1);
};

const renderAvgStarsCal = (value) => {
  const full = Math.round(value);
  return Array.from({ length: 5 }).map((_, i) => (
    <FaStar key={i} color={i < full ? "#ffc107" : "#e4e5e9"} />
  ));
};
const getFallbackImage = (listing) => {
  const firstCategory =
    listing.category?.[0]?.toLowerCase() || "";

  return categoryDummyImages[firstCategory] || defaultImg;
};

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
                {services.map(service => {
                    console.log("service:", service);
                    const safeSlug = service.slug && service.slug !== "undefined"
                                    ? service.slug
                                    : service.title
                                        ?.toLowerCase()
                                        .trim()
                                        .replace(/\s+/g, "-")
                                        .replace(/[^a-z0-9-]/g, "");

                    return (
                    <Col key={service.id} md={4} className="mb-4">
                        <Card className={`service-card w-100 h-100 d-flex flex-column`}>
                            <Card.Header className="card-top-rated p-0">
                                    
                                
                                {/* <div className="service-icon">
                                    <BsTagFill size={100} color="#ff8800" />
                                </div> */}
                                {/* {service.bannerImage && service.bannerImage.length > 0 ? (
                                          <Card.Img 
                                          variant="top" 
                                          src={`${API_BASE}/${service.bannerImage}`}
                                          alt={service.shopName}
                                        />
                                        ) : (
                                          <Card.Img variant="top" src={dummyImage} alt={service.shopName} className='w-100' />
                                        )} */}
                                        <Card.Img
                                            variant="top"
                                            src={
                                                service.bannerImage
                                                ? `${API_BASE}/${service.bannerImage}`
                                                : getFallbackImage(service)
                                            }
                                            alt={service.shopName}
                                            className="w-100"
                                            />
                                
                            </Card.Header>
                            <Card.Body className='pos-rel d-flex flex-grow-1 flex-column '>
                                
                                <Card.Title title={service.title}> 
                                    {service.title && service.title.length > 20 ? service.title.substring(0, 25) + "..." : service.title}</Card.Title>
                                <div className="service-tags">
                                {service.tags.map((tag, index) => (
                                        <span key={service.id + "-tag-" + index} className="badge badge-top-rated">{tag}</span>
                                    ))}
                                </div>
                                <Card.Text className='mt-4' title={service.description}>{service.description && service.description.length > 60 ? service.description.substring(0, 60) + "..." : service.description}</Card.Text>
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
                                {/* <div className="service-rating align-item-center d-flex gap-2">
                                    <span className='d-block' role="img" aria-label="star" style={{"verticalAlign" : "unset"}}> <BsStarFill /> </span> 
                                    <span className='d-block'>{service.rating}</span>
                                </div> */}
                                <div className="review-summary service-rating">
                                    <StarRating 
                                      rating={averageRating(service.id)} 
                                      reviewCount={renderAvgStarsCal(averageRating(service.id))} 
                                    />
  {/* <div className="rating-wrap">
    <div className="rating-value">
      {averageRating(service.id)}
    </div>
    <div>
      {renderAvgStarsCal(averageRating(service.id))}
      <div className="rating-count">
        {(reviewsByService[service.id] || []).length} review(s)
      </div>
    </div>
  </div> */}
</div>


                                <Button
                                    variant={"primary"}
                                    className="details-btn mt-auto"
                                    // onClick={() => navigate(`/listings/${safeSlug}-${service.id}`)}
                                    onClick={() => navigate(`/listings/${service.slug}`)}
                                >
                                    View Details
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                )
                })}
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