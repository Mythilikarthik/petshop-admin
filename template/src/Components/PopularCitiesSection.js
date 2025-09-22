import React from 'react';
import './Css/PopularCitiesSection.css';
import { Row, Col, Container } from 'react-bootstrap';
import { AiFillHome } from "react-icons/ai";

const cities = [
  { name: 'Mumbai', listings: '1200+', color: '#D6A06A', iconColor: '#A05A00' },
  { name: 'Delhi', listings: '980+', color: '#A6B8E6', iconColor: '#3A5BA0' },
  { name: 'Bangalore', listings: '850+', color: '#A6E6B8', iconColor: '#2CA05A' },
  { name: 'Chennai', listings: '720+', color: '#C6A6E6', iconColor: '#7A3AA0' },
  { name: 'Hyderabad', listings: '680+', color: '#E6A6C6', iconColor: '#A03A7A' },
  { name: 'Kolkata', listings: '590+', color: '#E6E6A6', iconColor: '#A0A03A' },
  { name: 'Pune', listings: '520+', color: '#A6B8E6', iconColor: '#3A5BA0' },
  { name: 'Ahmedabad', listings: '480+', color: '#E6A6A6', iconColor: '#A03A3A' },
];

const PopularCitiesSection = () => (
  <section className="popular-cities-section">
    <Container fluid>
        <h2>
        Popular <span className="highlight">Cities</span>
        </h2>
        <p>Discover pet services in major cities across India</p>
        <Row>
            {cities.map((city) => (
            <Col xs={3} className="d-none d-md-block">
                <div className="cities-grid" 
                    style={{
                        background: `${city.color}`,
                        borderRadius: '18px', marginBottom: '20px'
                    }}>
                
                    <div
                    key={city.name}
                    className="city-card"
                    >
                    <span
                        className="city-icon"
                        style={{ color: city.iconColor }}
                        role="img"
                        aria-label="home"
                    >
                        <AiFillHome size={100} />
                    </span>
                    <div className="city-info">
                        <div className="city-name">{city.name}</div>
                        <div className="city-listings">{city.listings} listings</div>
                    </div>
                    </div>
                </div>
            </Col>
            
        ))}
        </Row>
        <button className="view-all-btn">View All Cities</button>
    </Container>
  </section>
);

export default PopularCitiesSection;