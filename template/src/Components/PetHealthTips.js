import React from 'react';
import { Link } from 'react-router-dom';
import {  Row, Col, Card, Container } from 'react-bootstrap';
import './Css/badges.css';
import './Css/featuredPetServices.css';
import { BsLightningFill, BsTagFill, BsHouseFill,  } from 'react-icons/bs';
import backgroundImage from './Image/bg-image.svg';

const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://petshop-admin.onrender.com"
    : "http://localhost:5000";




const PetHealthTips = ({ blog, showViewAll= true , banner=false}) => (

    <div className="featured-section bg-image" style={{ backgroundImage: `url(${backgroundImage})` }}>
        <Container>
            <div className='title text-center'>
                <h2>
                    Our <span className="highlight"> Blog & Updates</span>
                </h2>
                <p className="subtitle">
                    Stay informed with the latest articles, news, and helpful information.
                </p>
            </div>

            <Row className="justify-content-center">
                {blog && blog.length > 0 ? (
                    blog.map((item) => (
                        <Col key={item._id} md={4} className="mb-4">
                            <Card className="pethealth-card w-100 h-100">
{console.log(item)}
                             {item.bannerImage && item.bannerImage.length > 0 ? (
                                <Card.Header className="blog-card-header p-0">
                                   <img src={`{${API_BASE}/${item.bannerImage}`} alt="" className='img-responsive' />
                                    
                                </Card.Header>
                                
                            ) : (
                                <Card.Header className="blog-card-header">
                                   <div className="service-icon">
                                        <BsLightningFill size={100} color="#3b82f6" />
                                    </div>
                                    
                                </Card.Header>
                            )}
                                

                                <Card.Body className='pos-rel'>

                                    {/* Blog Date */}
                                    <span className="category-badge mb-3 d-block">
                                       {new Date(item.date).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric"
}).replace(" ", " ").replace(",", ",")}


                                    </span>

                                    {/* Blog Title */}
                                    <Card.Title>{item.title}</Card.Title>

                                    {/* Blog Excerpt */}
                                    <Card.Text>
                                        {item.excerpt ? item.excerpt.slice(0, 100) + "..." : ""}
                                    </Card.Text>

                                    {/* Blog Link */}
                                    <Link 
                                        style={{ color: "#ff6b00" }} 
                                        to={`/blog/${item._id}`}
                                    >
                                        Read More
                                    </Link>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <p className="text-center text-muted">No blogs available.</p>
                )}
            </Row>

            <div className="text-center mt-3">
                <Link to="/blog">
                {showViewAll && (
                    <button className="view-all-btn">
                        View All Articles
                    </button>
                )}
                </Link>
            </div>
        </Container>
    </div>
);


export default PetHealthTips;