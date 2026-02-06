import React from 'react'
import './Css/Footer.css'
import { Container, Row, Col } from 'react-bootstrap'
import { AiFillFacebook, AiFillInstagram, AiFillTwitterCircle, AiFillYoutube, AiOutlineHeart } from 'react-icons/ai'
import { Link } from 'react-router-dom'
import { HiOutlineLocationMarker, HiOutlineMail, HiOutlinePhone, HiOutlineClock} from "react-icons/hi";
import CategoryPage from '../Pages/CategoryPage'

const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://petshop-admin.onrender.com"
    : "http://localhost:5000";

const Footer = ({home, categoryPage}) => {
  return (
    <div className='footer'>
        <footer className="bg-gray-900 text-white ">
            <Container>
                <div className="top-footer d-flex justify-content-between align-items-center mb-3">
                    <Row>
                        <Col>
                            <div className="footer-logo d-flex align-items-center">
                                {/* <span className='icon d-flex align-items-center justify-content-center'>
                                    <AiOutlineHeart size={28} style={{ color: '#fff',  padding: '4px' }} />
                                </span>
                                <b>PetPals</b><span className='highlight'><b>India</b></span>
                                 */}
                                 <img src={`${API_BASE}/${home.siteLogoLight}`} alt="PetPals India" className='site-logo' width={250} />
                            </div>
                            <p class="text-gray-400 mb-6 mt-4 text-justify">
                                {home.footerDescription}
                            </p>
                            <ul className="social-links list-unstyled d-flex gap-2">
                                <li><Link to="/" className="text-white"><AiFillFacebook size={25} /></Link></li>
                                <li><Link to="/" className="text-white"><AiFillTwitterCircle size={25} /></Link></li>
                                <li><Link to="/" className="text-white"><AiFillInstagram size={25} /></Link></li>
                                <li><Link to="/" className="text-white"><AiFillYoutube size={25}/></Link></li>
                            </ul>
                        </Col>
                        <Col>
                            <h5 className="mb-3">Quick Links</h5>
                            <ul className="list-unstyled">
                                <li><Link to="/" className="text-white">Home</Link></li>
                                <li><Link to="/about" className="text-white">About Us</Link></li>
                                <li><Link to="/pethealth" className="text-white">Pet Health</Link></li>
                                <li><Link to="/blog" className="text-white">Blogs</Link></li>                                
                                <li><Link to="/contact" className="text-white">Contact Us</Link></li>
                            </ul>
                        </Col>
                        <Col>
                            <h5 className="mb-3">Pet Categories</h5>
                            <ul className="list-unstyled">
                                {/* {console.log("Footer categoryPage:", categoryPage)} */}
                                {categoryPage && categoryPage.map((category) => (
                                    <li key={category.category._id}>
                                        <Link to={`/type/${category.category.categoryName.toLowerCase()}`} className="text-white">{category.category.categoryName}</Link>
                                    </li>
                                ))}
                                {/* <li><Link to="/directory?category=dogs" className="text-white">Dogs</Link></li>
                                <li><Link to="/directory?category=cats" className="text-white">Cats</Link></li>
                                <li><Link to="/directory?category=birds" className="text-white">Birds</Link></li>
                                <li><Link to="/directory?category=fish" className="text-white">Fish</Link></li>
                                <li><Link to="/directory?category=small-pets" className="text-white">Small Pets</Link></li>
                                <li><Link to="/directory?category=exotic-pets" className="text-white">Exotic Pets</Link></li> */}
                            </ul>

                        </Col>
                        <Col>
                            <h5 className="mb-3">Contact Us</h5>
                            <p className="d-flex align-items-center gap-3 text-gray-400"> <HiOutlineLocationMarker size={20} className='text-orange flex-shrink-0' /> <span>{home.footerAddress} {home.footerLocation}</span></p>
                            <p className="d-flex align-items-center gap-3 text-gray-400"> <HiOutlineMail  size={20} className='text-orange flex-shrink-0' /> <span>{home.footerEmail}</span></p>
                            <p className="d-flex align-items-center gap-3 text-gray-400"> <HiOutlinePhone size={20} className='text-orange flex-shrink-0' /> <span>{home.footerContact}</span></p>
                            <p className="d-flex align-items-center gap-3 text-gray-400"> <HiOutlineClock size={20} className='text-orange flex-shrink-0' /> <span>{home.footerWorkingHours}</span></p>
                        </Col>
                    </Row>
                </div>
                <div className="bottom-footer">
                    <Row className='align-items-center'>
                        <Col>
                            <p className='m-0'>&copy; {new Date().getFullYear()} Vet and Pets. All rights reserved.</p>
                        </Col>
                        <Col>
                            <ul className="list-unstyled d-flex gap-4 mb-0 justify-content-end">
                                <li><Link to="/termsandconditions" className="text-white">Terms of Service</Link></li>
                                <li><Link to="/privacypolicy" className="text-white">Privacy Policy</Link></li>
                                <li><Link to="/cookiepolicy" className="text-white">Cookie Policy</Link></li>
                            </ul>
                        </Col>
                    </Row>
                </div>
            </Container>
        </footer>
    </div>
  )
}

export default Footer