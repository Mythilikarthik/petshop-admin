import React from 'react';
import './Css/PopularCitiesSection.css';
import { Row, Col, Container } from 'react-bootstrap';
import { AiFillHome } from "react-icons/ai";
import { Link } from 'react-router-dom';
import cityBg from '../city-bg-4.jpg';
import cityBgChennai from '../city-bg-final.jpg';
import cityBgDelhi from '../city-bg-delhi.jpg';
import { HiOutlineArrowLongRight } from "react-icons/hi2";

const slugify = (text = "") =>
  text
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s]/g, "") // remove (), / , etc
    .trim()
    .replace(/\s+/g, "-");

const PopularCitiesSection = ({cities}) => (

  <section className="popular-cities-section bg-grey">
    <Container>
        <h2>
        Popular <span className="highlight">Cities</span>
        </h2>
        <p>Discover pet services in major cities across India</p>
        <Row>
            {cities.map((city) => (
            <Col key={city.city} xs={3} className="d-none d-md-block mb-4">
                {/* <Link to={`/directory/${city.city.toLowerCase()}`} style={{ textDecoration: 'none' }}> */}
                <Link to={`/directory/${slugify(city.city)}`}>
                {/* <div className="cities-grid" 
                    style={{
                        background: '#FDBA74',
                        borderRadius: '18px', marginBottom: '20px'
                    }}>
                    
                        <div
                        key={city.city}
                        className="city-card"
                        >
                        <span
                            className="city-icon"
                            style={{ color: "#F97316" }}
                            role="img"
                            aria-label="home"
                            
                        >
                            <img
                            className="img-responsive"
                            src={
                                city.city === "Chennai"
                                ? cityBgChennai
                                : city.city === "Delhi"
                                ? cityBgDelhi
                                : cityBg
                            }
                            alt=""
                            />

                            {/* <AiFillHome size={100} /> */}

                       {/* </span>
                        <div className="city-info">
                            <div className="city-name">{city.city}</div>
                            <div className="city-listings">{city.listingsCount}+ listings</div>
                        </div>
                        </div>
                </div> */}
                <div className="cities-grid-new pos-rel" 
                    style={{
                        background: '#fff', boxShadow: "0 0px 2px rgba(0,0,0,0.6)",
                        borderRadius: '0', marginBottom: '20px', textAlign: "left", padding: "1rem 1.5rem"
                    }}>
                        <div className="">
                            <h5 className='city-name-new'>{city.city}</h5>
                        </div>
                        <div className="city-listings-new">{city.listingsCount}+ listings</div>
                        <div className='pos-abs icon-arrow'>
                            <HiOutlineArrowLongRight />
                        </div>
                    </div>
                    </Link>
            </Col>
            
        ))}
        </Row>
        <Link to="/cities" className="view-all-btn">View All Cities</Link>
    </Container>
  </section>
);

export default PopularCitiesSection;