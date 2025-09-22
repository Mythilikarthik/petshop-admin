import React, {useState} from 'react'
import { Row, Col, Form, Button } from 'react-bootstrap'
import backgroundImage from './Image/bg-image.svg';
import './Css/Banner.css'



const categories = [
  { value: "all", label: "All" },
  { value: "veterinarians", label: "Veterinarians" },
  { value: "grooming", label: "Pet Grooming" },
  { value: "boarding", label: "Pet Boarding" }
];

const cities = [
  { value: "mumbai", label: "Mumbai" },
  { value: "delhi", label: "Delhi" },
  { value: "bangalore", label: "Bangalore" }
];

const Banner = () => {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [city, setCity] = useState("");
    const handleSubmit = (e) => {
    e.preventDefault();   
        // Handle the search logic here
        console.log("Search:", search);
        console.log("Category:", category);
        console.log("City:", city);
    };
  return (
    <div className="banner">
      <div className="inner-banner">
          <div className='bg-image' style={{"background-image": `url(${backgroundImage})`}}>
            <div className=" pl-5 pr-5">
              <Row className='d-flex align-items-center pt-5 pb-5'>
                <Col>
                  <h1>Find Perfect <span className='highlight'>Pet Services</span> Near You</h1>
                  <p className='text-left'>Discover the best pet services, health tips, and pet-friendly places across India with our comprehensive directory.</p>
                  <div className='d-flex gap-3'>
                      <button className='orange-btn py-2 px-4 border-2 border-orange-500 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition duration-300'>Get Started</button>
                      <button className='border-btn py-2 px-4 border-2 border-orange-500 text-orange-500 rounded-full hover:bg-orange-500 hover:text-white transition duration-300'>Learn More</button>
                  </div>
                </Col>
                <Col>
                  <div className="image-container d-flex justify-content-center align-items-center">
                    <div className='round-image'>
                      <svg class="w-64 h-64 md:w-80 md:h-80 relative z-10" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                          <path fill="#FF9F1C" d="M47.7,-57.2C59.9,-45.8,66.8,-28.5,68.8,-11.1C70.8,6.3,67.8,23.8,58.4,36.9C48.9,50,32.9,58.7,15.4,63.9C-2.1,69.1,-21.2,70.8,-36.4,63.5C-51.7,56.2,-63.1,39.9,-68.8,21.8C-74.5,3.7,-74.5,-16.2,-66.1,-31.4C-57.7,-46.6,-40.9,-57.1,-24.3,-65.3C-7.7,-73.5,8.8,-79.4,24.4,-75.1C40,-70.8,54.7,-56.3,47.7,-57.2Z" transform="translate(100 100)"></path>
                          <circle cx="100" cy="90" r="10" fill="white"></circle>
                          <circle cx="130" cy="90" r="10" fill="white"></circle>
                          <path d="M85,110 Q100,125 115,110" stroke="white" stroke-width="3" fill="none"></path>
                          <path d="M70,70 Q75,60 85,65" stroke="white" stroke-width="3" fill="none"></path>
                          <path d="M130,65 Q140,60 145,70" stroke="white" stroke-width="3" fill="none"></path>
                      </svg>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
          <div className='form-section'>
            <div className='form-container'>
                <Form onSubmit={handleSubmit}>
                    <div className="d-flex flex-column flex-md-row align-items-center gap-2">
                        <Form.Control
                            type="text"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="me-md-2"
                            style={{ flex: "1 1 300px", minWidth: 0 }}
                        />

                        <Form.Select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            aria-label="All categories"
                            className="me-md-2"
                            style={{ width: 200, flex: "0 0 200px" }}
                        >
                            <option value="">All category</option>
                            {categories.map((c) => (
                            <option key={c.value} value={c.value}>
                                {c.label}
                            </option>
                            ))}
                        </Form.Select>

                        <Form.Select
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            aria-label="All cities"
                            className="me-md-2"
                            style={{ width: 180, flex: "0 0 180px" }}
                        >
                            <option value="">All city</option>
                            {cities.map((c) => (
                            <option key={c.value} value={c.value}>
                                {c.label}
                            </option>
                            ))}
                        </Form.Select>

                        <Button type="submit" className="mt-2 mt-md-0" style={{ whiteSpace: "nowrap" }}>
                            Search
                        </Button>
                    </div>
                </Form>
            </div>'
          </div>
      </div>
    </div>
  )
}

export default Banner