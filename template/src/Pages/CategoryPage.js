import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import * as GiIcons from "react-icons/gi";
import { FaStar, FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";
import './Css/CategoryPage.css';
import dummyImage from '../dummy.jpg';
const API_BASE =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_URL
    : "http://localhost:5000";
const CategoryPage = () => {
  const navigate = useNavigate();
  const { categoryName } = useParams();
  // console.log("Category Name from URL:", categoryName);
  const [currentCategory, setCurrentCategory] = React.useState({
    name: '',
    icon: null,
    image: null,
    color: '#000',
    description: '',
    services: [],
    tips: []
  });
  const getIconComponent = (iconName) => {
  if (!iconName) return null;
  const Icon = GiIcons[iconName];   // pick the icon dynamically
  return Icon ? <Icon /> : null;    // return JSX icon
};
  
  // // Category data matching your original component
  // const categories = {
  //   'dogs': { 
  //     name: 'Dog', 
  //     icon: <GiJumpingDog />, 
  //     color: '#FFA726',
  //     description: 'Professional services for your loyal canine companions',
  //     services: ['Dog Walking', 'Dog Grooming', 'Dog Training', 'Veterinary Care', 'Pet Boarding', 'Dog Daycare'],
  //     tips: ['Regular exercise is essential for your dog\'s health', 'Maintain a consistent feeding schedule', 'Regular vet checkups prevent health issues']
  //   },
  //   'cats': { 
  //     name: 'Cat', 
  //     icon: <GiHollowCat />, 
  //     color: '#42A5F5',
  //     description: 'Specialized care for your independent feline friends',
  //     services: ['Cat Grooming', 'Veterinary Care', 'Cat Sitting', 'Litter Box Cleaning', 'Cat Behavioral Training', 'Emergency Care'],
  //     tips: ['Keep litter boxes clean and accessible', 'Provide vertical spaces for climbing', 'Regular grooming reduces shedding and hairballs']
  //   },
  //   'birds': { 
  //     name: 'Bird', 
  //     icon: <GiHummingbird />, 
  //     color: '#66BB6A',
  //     description: 'Expert care for your feathered companions',
  //     services: ['Bird Grooming', 'Avian Veterinary Care', 'Bird Sitting', 'Wing Clipping', 'Cage Cleaning', 'Behavioral Training'],
  //     tips: ['Provide a varied, nutritious diet', 'Ensure adequate social interaction', 'Maintain proper cage hygiene']
  //   },
  //   'fish': { 
  //     name: 'Fish', 
  //     icon: <GiTropicalFish />, 
  //     color: '#AB47BC',
  //     description: 'Professional aquatic pet care services',
  //     services: ['Aquarium Maintenance', 'Fish Health Consultation', 'Tank Setup', 'Water Quality Testing', 'Fish Feeding Service', 'Emergency Care'],
  //     tips: ['Monitor water quality regularly', 'Don\'t overfeed your fish', 'Maintain proper water temperature']
  //   },
  //   'small-pets': { 
  //     name: 'Small Pet', 
  //     icon: <GiPawHeart />, 
  //     color: '#EC407A',
  //     description: 'Caring services for rabbits, hamsters, guinea pigs, and more',
  //     services: ['Small Pet Grooming', 'Veterinary Care', 'Pet Sitting', 'Cage Cleaning', 'Nail Trimming', 'Health Checkups'],
  //     tips: ['Provide appropriate chew toys', 'Maintain a clean living environment', 'Handle gently and support properly']
  //   },
  //   'exotic-pets': { 
  //     name: 'Exotic Pet', 
  //     icon: <GiPhrygianCap />, 
  //     color: '#ffc107',
  //     description: 'Specialized care for unique and exotic animals',
  //     services: ['Exotic Veterinary Care', 'Specialized Grooming', 'Habitat Maintenance', 'Nutritional Consulting', 'Emergency Care', 'Behavioral Support'],
  //     tips: ['Research specific care requirements', 'Find exotic pet specialists', 'Maintain proper habitat conditions']
  //   }
  // };

  // Sample service providers data
  // const serviceProviders = [
  //   {
  //     id: 1,
  //     name: "Paws & Claws Veterinary Clinic",
  //     rating: 4.8,
  //     reviews: 156,
  //     location: "Downtown",
  //     phone: "(555) 123-4567",
  //     email: "info@pawsclaws.com",
  //     services: ["Veterinary Care", "Emergency Care", "Health Checkups"],
  //     image: dummyImage
  //   },
  //   {
  //     id: 2,
  //     name: "Happy Tails Grooming",
  //     rating: 4.9,
  //     reviews: 203,
  //     location: "Midtown",
  //     phone: "(555) 234-5678",
  //     email: "hello@happytails.com",
  //     services: ["Grooming", "Nail Trimming", "Behavioral Training"],
  //     image: dummyImage
  //   },
  //   {
  //     id: 3,
  //     name: "Pet Paradise Boarding",
  //     rating: 4.7,
  //     reviews: 89,
  //     location: "Uptown",
  //     phone: "(555) 345-6789",
  //     email: "stay@petparadise.com",
  //     services: ["Pet Boarding", "Pet Sitting", "Daycare"],
  //     image: dummyImage
  //   }
  // ];
  const [featuredListing, setFeaturedListing] = useState([]);
  const [blog, setBlog] = useState([]);
  const [cities, setCities] = useState([]);
      const fetchServices = async ()=> {
        try {
          const res = await fetch(`${API_BASE}/api/listing/by-pet-category`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ categoryName }),
          });
          const data = await res.json();

          if (data.success) {
              //console.log(data.listings);
              setFeaturedListing(data.listings.slice(0,3));
          }
        } catch (err) {
          console.error("Error fetching featured services:", err);
        }
      }
          // const fetchServices = async () => {
          //     try {
          //         const res = await fetch(`${API_BASE}/api/listing/featured-services`);
          //         const data = await res.json();
      
          //         if (data.success) {
          //             setFeaturedListing(data.services);
          //         }
          //     } catch (err) {
          //         console.error("Error fetching featured services:", err);
          //     }
          // };
      const fetchBlog =  async () => {
        try {
          const res = await fetch(`${API_BASE}/api/blog/by-pet-category`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ categoryName }),
          });
          const data = await res.json();

          if (data.success) {
              // console.log(data.blogs);
              setBlog(data.blogs.slice(0,3));
          }
        } catch (err) {
          console.error("Error fetching blogs:", err.message);
        }
       }
       const citiesList = async () => {
        try {
          const res = await fetch(`${API_BASE}/api/city/show`);
          const data = await res.json();
          if (data.success) {
            console.log("Fetched cities:", data.cities);
            setCities(data.cities);
          }
        } catch (err) {
          console.error("Error fetching cities:", err.message);
        }
      }
          useEffect(() => {
            // fetchByCategory();
            fetchBlog();
              fetchServices();
              citiesList();
          }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchCategoryData = async () => {
     try {
      const res = await fetch(`${API_BASE}/api/categorypage/by-name/${categoryName}`);
      const data = await res.json();
      if(data.success) {
        //console.log("Fetched category data:", data.page);
        setCurrentCategory({
          name: data.page.category.categoryName,
          icon: data.page.icon,
          image: data.page.image,
          color: data.page.color,
          description: data.page.description,
          services: data.page.services,
          tips: data.page.tips,
          content: data.page.content,
        });
      }
     } catch (err) {
        console.error("Error fetching category data:", err.message);
     }
    };
    fetchCategoryData();
  }, [categoryName])

  return (
    <div className="category-page">
      {/* Hero Section */}
      <section
  className="category-hero"
  style={{
    backgroundImage: `linear-gradient(
      rgba(0,0,0,0.55),
      rgba(0,0,0,0.55)
    ), url(${API_BASE}${currentCategory.image})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat"
  }}
>
  <Container>
    <Row className="align-items-center min-vh-50">
      <Col lg={8}>
        <div
          className="category-hero-icon mb-3"
          style={{ color: currentCategory.color }}
        >
          {getIconComponent(currentCategory.icon)}
        </div>

        <h1 className="text-white">
          {currentCategory.name} Services
        </h1>

        <p className="hero-description text-white">
          {currentCategory.description}
        </p>

        <Button
          className="cta-button"
          style={{
            backgroundColor: currentCategory.color,
            borderColor: currentCategory.color
          }}
          onClick={() => navigate(`/directory/all/all/${categoryName}`)}
        >
          Find Services Near You
        </Button>
      </Col>
    </Row>
  </Container>
</section>

      

<div dangerouslySetInnerHTML={{ __html: currentCategory.content }} />


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
                onClick={() => navigate("/directory")}
              >
                Find Services Now
              </Button>
              <Button variant="outline-secondary" size="lg"
              style={{ backgroundColor: currentCategory.color, borderColor: currentCategory.color, color: '#fff' }}
              onClick={() => navigate("/about")}
              
              >
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