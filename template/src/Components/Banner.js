// import React, { useEffect, useState } from "react";
// import { Row, Col, Form, Button, Container, Carousel } from "react-bootstrap";
// import backgroundImage from "./Image/bg-image.svg";
// import "./Css/Banner.css";
// import { useLocation, useNavigate } from "react-router-dom";

// const API_BASE =
//   process.env.NODE_ENV === "production"
//     ? process.env.REACT_APP_API_URL
//     : "http://localhost:5000";

// const Banner = ({home}) => {
//   const navigate = useNavigate();
//   const [search, setSearch] = useState("");
//   const [category, setCategory] = useState("");
//   const [type, setType] = useState("");
//   const [city, setCity] = useState("");
//   const [categories, setCategories] = useState([]);
//   const [types, setTypes] = useState([]);
//   const [cities, setCities] = useState([]);

//   // ✅ Fetch all default data
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [typeRes, categoryRes, cityRes, homeRes] = await Promise.all([
//           fetch(`${API_BASE}/api/pet-category/show`),
//           fetch(`${API_BASE}/api/category/show`),
//           fetch(`${API_BASE}/api/city/show`),
//         ]);

//         const typeData = await typeRes.json();
//         const categoryData = await categoryRes.json();
//         const cityData = await cityRes.json();

//         if (typeData.success) setTypes(typeData.petCategories);
//         if (categoryData.success) setCategories(categoryData.categories);
//         if (cityData.success) setCities(cityData.cities);
//         //console.log("Homedata", homeData.home);
//       } catch (err) {
//         console.error("Error fetching initial data:", err);
//       }
//     };

//     fetchData();
//   }, []);

//   // ✅ When type changes, fetch categories related to it
//   useEffect(() => {
//     if (!type) {
//       // if no type selected, reset to all categories
//       fetch(`${API_BASE}/api/category/show`)
//         .then((res) => res.json())
//         .then((data) => setCategories(data.categories || []))
//         .catch((err) => console.error("Error resetting categories:", err));
//       return;
//     }

//     const fetchFilteredCategories = async () => {
//       try {
//         const res = await fetch(`${API_BASE}/api/category/byPetCategories`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ petCategories: [type] }), 
//         });

//         const data = await res.json();
//         console.log("Filtered categories:", data);

//         if (data.success && Array.isArray(data.categories)) {
//           setCategories(data.categories);
//         } else {
//           setCategories([]);
//         }
//       } catch (err) {
//         console.error("Error fetching filtered categories:", err);
//         setCategories([]);
//       }
//     };

//     fetchFilteredCategories();
//   }, [type]);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Search:", search);
//     console.log("Category:", category);
//     console.log("Type:", type);
//     console.log("City:", city);
//   };

//   return (
//     <div className="banner">
//       <div className="inner-banner">
//         {home.bannerImages && home.bannerImages.length > 0 && (
//         <Carousel fade interval={3000} className="home-banner-carousel">
//           {home.bannerImages.map((img, i) => (
//             <Carousel.Item key={i}>
//               <img
//                 className="d-block w-100"
//                 src={`${API_BASE}/${img}`}
//                 alt={`Banner ${i + 1}`}
//               />
//             </Carousel.Item>
//           ))}
//         </Carousel>
//       )}

//         {/* <div
//           className="bg-image"
//           style={{ backgroundImage: `url(${backgroundImage})` }}
//         >
//           <Container>
//             <Row className="d-flex align-items-center pt-5 pb-5">
//               <Col>
//                 <h1>
//                   {home && home.bannerTitle ? home.bannerTitle : ""}
//                 </h1>
//                 <p>
//                   {home && home.bannerSubtitle ? home.bannerSubtitle : ""}
//                 </p>
//                 <div className="d-flex gap-3">
//                   <button
//                     className="orange-btn py-2 px-4 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition duration-300"
//                     onClick={() => navigate('/directory')}
//                   >
//                     Get Started
//                   </button>
//                   <button className="border-btn py-2 px-4 border-orange-500 text-orange-500 rounded-full hover:bg-orange-500 hover:text-white transition duration-300"
//                     onClick={() => navigate('/about')}
//                   >

//                     Learn More
//                   </button>
//                 </div>
//               </Col>

//               <Col>
//                 <div className="image-container d-flex justify-content-center align-items-center">
//                     <div className='round-image'>
//                       <svg class="w-64 h-64 md:w-80 md:h-80 relative z-10" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
//                           <path fill="#FF9F1C" d="M47.7,-57.2C59.9,-45.8,66.8,-28.5,68.8,-11.1C70.8,6.3,67.8,23.8,58.4,36.9C48.9,50,32.9,58.7,15.4,63.9C-2.1,69.1,-21.2,70.8,-36.4,63.5C-51.7,56.2,-63.1,39.9,-68.8,21.8C-74.5,3.7,-74.5,-16.2,-66.1,-31.4C-57.7,-46.6,-40.9,-57.1,-24.3,-65.3C-7.7,-73.5,8.8,-79.4,24.4,-75.1C40,-70.8,54.7,-56.3,47.7,-57.2Z" transform="translate(100 100)"></path>
//                           <circle cx="100" cy="90" r="10" fill="white"></circle>
//                           <circle cx="130" cy="90" r="10" fill="white"></circle>
//                           <path d="M85,110 Q100,125 115,110" stroke="white" stroke-width="3" fill="none"></path>
//                           <path d="M70,70 Q75,60 85,65" stroke="white" stroke-width="3" fill="none"></path>
//                           <path d="M130,65 Q140,60 145,70" stroke="white" stroke-width="3" fill="none"></path>
//                       </svg>
//                     </div>
//                   </div>
//                 </Col>
//             </Row>
//           </Container>
//         </div> */}

//         {/* ✅ Filter Form */}
//         <div className="form-section">
//           <div className="form-container align-items-center">
//             <Form onSubmit={handleSubmit}>
//               <div className="d-flex flex-column flex-md-row align-items-center gap-2">
//                 {/* Type */}
//                 <Form.Select
//                   value={type}
//                   onChange={(e) => setType(e.target.value)}
//                   aria-label="All types"
//                   className="me-md-2"
//                   style={{ width: 200, }}
//                 >
//                   <option value="">All Types</option>
//                   {types.map((t) => (
//                     <option key={t._id} value={t._id}>
//                       {t.categoryName}
//                     </option>
//                   ))}
//                 </Form.Select>

//                 {/* Category */}
//                 <Form.Select
//                   value={category}
//                   onChange={(e) => setCategory(e.target.value)}
//                   aria-label="All categories"
//                   className="me-md-2"
//                   style={{ width: 200, }}
//                 >
//                   <option value="">All Categories</option>
//                   {categories.map((c) => (
//                     <option key={c._id} value={c._id}>
//                       {c.categoryName}
//                     </option>
//                   ))}
//                 </Form.Select>

//                 {/* City */}
//                 <Form.Select
//                   value={city}
//                   onChange={(e) => setCity(e.target.value)}
//                   aria-label="All cities"
//                   className="me-md-2"
//                   style={{ width: 180,  }}
//                 >
//                   <option value="">All Cities</option>
//                   {cities.map((c) => (
//                     <option key={c._id} value={c._id}>
//                       {c.city}
//                     </option>
//                   ))}
//                 </Form.Select>

//                 {/* Search Button */}
//                 {/* <Button type="submit" className="mt-2 mt-md-0"
//                 onClick={() => navigate(`/directory/${city.city}/${category.categoryName}/${type.categoryName}`)}
//                 >
//                   Search
//                 </Button> */}
//                 {/* <Button
//   type="submit"
//   className="mt-2 mt-md-0"
//   onClick={() => {
//     const cityObj = cities.find(c => c._id === city);
//     const catObj = categories.find(c => c._id === category);
//     const typeObj = types.find(t => t._id === type);

//     navigate(`/directory/${
//       cityObj ? cityObj.city.toLowerCase() : "all"
//     }/${
//       catObj ? catObj.categoryName.toLowerCase() : "all"
//     }/${
//       typeObj ? typeObj.categoryName.toLowerCase() : "all"
//     }`);
//   }}
// >
//   Search
// </Button> */}
// <Button
//   type="submit"
//   className="mt-2 mt-md-0"
//   onClick={() => {
//     const cityObj = cities.find(c => c._id === city);
//     const catObj = categories.find(c => c._id === category);
//     const typeObj = types.find(t => t._id === type);

//     navigate(`/directory/${
//       cityObj ? encodeURIComponent(cityObj.city.toLowerCase()) : "all"
//     }/${
//       catObj ? encodeURIComponent(catObj.categoryName.toLowerCase()) : "all"
//     }/${
//       typeObj ? encodeURIComponent(typeObj.categoryName.toLowerCase()) : "all"
//     }`);
//   }}
// >
//   Search
// </Button>

//               </div>
//             </Form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Banner;
// ---------
// types and city working
// -------

// import React, { useEffect, useMemo, useState } from "react";
// import { Row, Col, Form, Button, Container, Carousel } from "react-bootstrap";
// import backgroundImage from "./Image/bg-image.svg";
// import "./Css/Banner.css";
// import { useLocation, useNavigate } from "react-router-dom";

// const API_BASE =
//   process.env.NODE_ENV === "production"
//     ? process.env.REACT_APP_API_URL
//     : "http://localhost:5000";

// const Banner = ({home}) => {
//   const navigate = useNavigate();
//   const [search, setSearch] = useState("");
//   const [category, setCategory] = useState("");
//   const [type, setType] = useState("");
//   const [city, setCity] = useState("");
//   const [categories, setCategories] = useState([]);
//   const [types, setTypes] = useState([]);
//   const [cities, setCities] = useState([]);
//   const [allListings, setAllListings] = useState([]);

//   // ✅ Fetch all default data
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [typeRes, categoryRes, cityRes, homeRes] = await Promise.all([
//           fetch(`${API_BASE}/api/pet-category/show`),
//           fetch(`${API_BASE}/api/category/show`),
//           fetch(`${API_BASE}/api/city/show`),
//         ]);

//         const typeData = await typeRes.json();
//         const categoryData = await categoryRes.json();
//         const cityData = await cityRes.json();

//         if (typeData.success) setTypes(typeData.petCategories);
//         if (categoryData.success) setCategories(categoryData.categories);
//         if (cityData.success) setCities(cityData.cities);
//         //console.log("Homedata", homeData.home);
//       } catch (err) {
//         console.error("Error fetching initial data:", err);
//       }
//     };

//     fetchData();
//   }, []);

//   // ✅ When type changes, fetch categories related to it
//   // useEffect(() => {
//   //   if (!type) {
//   //     // if no type selected, reset to all categories
//   //     fetch(`${API_BASE}/api/category/show`)
//   //       .then((res) => res.json())
//   //       .then((data) => setCategories(data.categories || []))
//   //       .catch((err) => console.error("Error resetting categories:", err));
//   //     return;
//   //   }

//   //   const fetchFilteredCategories = async () => {
//   //     try {
//   //       const res = await fetch(`${API_BASE}/api/category/byPetCategories`, {
//   //         method: "POST",
//   //         headers: { "Content-Type": "application/json" },
//   //         body: JSON.stringify({ petCategories: [type] }), 
//   //       });

//   //       const data = await res.json();
//   //       console.log("Filtered categories:", data);

//   //       if (data.success && Array.isArray(data.categories)) {
//   //         setCategories(data.categories);
//   //       } else {
//   //         setCategories([]);
//   //       }
//   //     } catch (err) {
//   //       console.error("Error fetching filtered categories:", err);
//   //       setCategories([]);
//   //     }
//   //   };

//   //   fetchFilteredCategories();
//   // }, [type]);

//   useEffect(() => {
//   if (!type) {
//     fetch(`${API_BASE}/api/category/show`)
//       .then((res) => res.json())
//       .then((data) => {
//         setCategories(data.categories || []);
//         setCategory(""); // ✅ reset
//       })
//       .catch((err) => console.error("Error resetting categories:", err));
//     return;
//   }

//   const fetchFilteredCategories = async () => {
//     try {
//       const res = await fetch(`${API_BASE}/api/category/byPetCategories`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ petCategories: [type] }),
//       });

//       const data = await res.json();

//       if (data.success && Array.isArray(data.categories)) {
//         setCategories(data.categories);
//         setCategory(""); // ✅ reset after filtering
//       } else {
//         setCategories([]);
//         setCategory("");
//       }
//     } catch (err) {
//       console.error("Error fetching filtered categories:", err);
//       setCategories([]);
//       setCategory("");
//     }
//   };

//   fetchFilteredCategories();
// }, [type]);
// // const filteredCategories = useMemo(() => {
// //   if (!type) return categories;

// //   const set = new Set();

// //   allListings.forEach(l => {
// //     const typeMatch =
// //       !type ||
// //       (l.petCategories || []).some(p => p._id === type);

// //     if (typeMatch) {
// //       (l.categories || []).forEach(c => {
// //         set.add(c._id); // store category IDs
// //       });
// //     }
// //   });

// //   return categories.filter(c => set.has(c._id));
// // }, [type, allListings, categories]);
// useEffect(() => {
//   if (!type.length || type.includes("all")) {
    
//   } else {
//     // ⚠️ you must send IDs, not names
//     const selectedIds = types
//       .filter(p => type.includes(p.categoryName))
//       .map(p => p._id);

//     fetchCategoriesByPet(selectedIds);
//   }
// }, [type]);
// const fetchCategoriesByPet = async (petIds) => {
//   try {
//     const res = await fetch(`${API_BASE}/api/category/directory/byPetCategories`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({ petCategories: petIds })
//     });

//     const data = await res.json();

//     if (data.success) {
//       setCategories(data.categories);
//     }
//   } catch (err) {
//     console.error(err);
//   }
// };
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Search:", search);
//     console.log("Category:", category);
//     console.log("Type:", type);
//     console.log("City:", city);
//   };

  

// useEffect(() => {
//   const fetchListings = async () => {
//     try {
//       const res = await fetch(`${API_BASE}/api/listing/directory/approved`);
//       const data = await res.json();

//       if (data.success) {
//         setAllListings(data.listings);
//       }
//     } catch (err) {
//       console.error("Error fetching listings:", err);
//     }
//   };

//   fetchListings();
// }, []);
// const filteredCities = useMemo(() => {
//   if (!type && !category) return cities;

//   const set = new Set();

//   allListings.forEach(l => {
//     const typeMatch =
//       !type ||
//       (l.petCategories || []).some(p => p._id === type);

//     const categoryMatch =
//       !category ||
//       (l.categories || []).some(c => c._id === category);

//     if (typeMatch && categoryMatch) {
//       if (l.city?.city) {
//         set.add(l.city.city.toLowerCase()); // ✅ use name, not ID
//       }
//     }
//   });

//   return cities.filter(c =>
//     set.has(c.city.toLowerCase())
//   );
// }, [type, category, allListings, cities]);
// useEffect(() => {
//   setCategory(""); // reset category when type changes
// }, [type]);

//   return (
//     <div className="banner">
//       <div className="inner-banner">
//         {home.bannerImages && home.bannerImages.length > 0 && (
//         <Carousel fade interval={3000} className="home-banner-carousel">
//           {home.bannerImages.map((img, i) => (
//             <Carousel.Item key={i}>
//               <img
//                 className="d-block w-100"
//                 src={`${API_BASE}/${img}`}
//                 alt={`Banner ${i + 1}`}
//               />
//             </Carousel.Item>
//           ))}
//         </Carousel>
//       )}

//         {/* <div
//           className="bg-image"
//           style={{ backgroundImage: `url(${backgroundImage})` }}
//         >
//           <Container>
//             <Row className="d-flex align-items-center pt-5 pb-5">
//               <Col>
//                 <h1>
//                   {home && home.bannerTitle ? home.bannerTitle : ""}
//                 </h1>
//                 <p>
//                   {home && home.bannerSubtitle ? home.bannerSubtitle : ""}
//                 </p>
//                 <div className="d-flex gap-3">
//                   <button
//                     className="orange-btn py-2 px-4 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition duration-300"
//                     onClick={() => navigate('/directory')}
//                   >
//                     Get Started
//                   </button>
//                   <button className="border-btn py-2 px-4 border-orange-500 text-orange-500 rounded-full hover:bg-orange-500 hover:text-white transition duration-300"
//                     onClick={() => navigate('/about')}
//                   >

//                     Learn More
//                   </button>
//                 </div>
//               </Col>

//               <Col>
//                 <div className="image-container d-flex justify-content-center align-items-center">
//                     <div className='round-image'>
//                       <svg class="w-64 h-64 md:w-80 md:h-80 relative z-10" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
//                           <path fill="#FF9F1C" d="M47.7,-57.2C59.9,-45.8,66.8,-28.5,68.8,-11.1C70.8,6.3,67.8,23.8,58.4,36.9C48.9,50,32.9,58.7,15.4,63.9C-2.1,69.1,-21.2,70.8,-36.4,63.5C-51.7,56.2,-63.1,39.9,-68.8,21.8C-74.5,3.7,-74.5,-16.2,-66.1,-31.4C-57.7,-46.6,-40.9,-57.1,-24.3,-65.3C-7.7,-73.5,8.8,-79.4,24.4,-75.1C40,-70.8,54.7,-56.3,47.7,-57.2Z" transform="translate(100 100)"></path>
//                           <circle cx="100" cy="90" r="10" fill="white"></circle>
//                           <circle cx="130" cy="90" r="10" fill="white"></circle>
//                           <path d="M85,110 Q100,125 115,110" stroke="white" stroke-width="3" fill="none"></path>
//                           <path d="M70,70 Q75,60 85,65" stroke="white" stroke-width="3" fill="none"></path>
//                           <path d="M130,65 Q140,60 145,70" stroke="white" stroke-width="3" fill="none"></path>
//                       </svg>
//                     </div>
//                   </div>
//                 </Col>
//             </Row>
//           </Container>
//         </div> */}

//         {/* ✅ Filter Form */}
//         <div className="form-section">
//           <div className="form-container align-items-center">
//             <Form onSubmit={handleSubmit}>
//               <div className="d-flex flex-column flex-md-row align-items-center gap-2">
//                 {/* Type */}
//                 <Form.Select
//                   value={type}
//                   onChange={(e) => setType(e.target.value)}
//                   aria-label="All types"
//                   className="me-md-2"
//                   style={{ width: 200, }}
//                 >
//                   <option value="">All Types</option>
//                   {types.map((t) => (
//                     <option key={t._id} value={t._id}>
//                       {t.categoryName}
//                     </option>
//                   ))}
//                 </Form.Select>

//                 {/* Category */}
//                 <Form.Select
//                   value={category}
//                   onChange={(e) => setCategory(e.target.value)}
//                   aria-label="All categories"
//                   className="me-md-2"
//                   style={{ width: 200, }}
//                 >
//                   <option value="">All Categories</option>
//                   {filteredCategories.map((c) => (
//                     <option key={c._id} value={c._id}>
//                       {c.categoryName}
//                     </option>
//                   ))}
//                 </Form.Select>

//                 {/* City */}
//                 <Form.Select
//                   value={city}
//                   onChange={(e) => setCity(e.target.value)}
//                   aria-label="All cities"
//                   className="me-md-2"
//                   style={{ width: 180,  }}
//                 >
//                   <option value="">All Cities</option>
//                   {filteredCities.map((c) => (
//                     <option key={c._id} value={c._id}>
//                       {c.city}
//                     </option>
//                   ))}
//                 </Form.Select>

//                 {/* Search Button */}
//                 {/* <Button type="submit" className="mt-2 mt-md-0"
//                 onClick={() => navigate(`/directory/${city.city}/${category.categoryName}/${type.categoryName}`)}
//                 >
//                   Search
//                 </Button> */}
//                 {/* <Button
//   type="submit"
//   className="mt-2 mt-md-0"
//   onClick={() => {
//     const cityObj = cities.find(c => c._id === city);
//     const catObj = categories.find(c => c._id === category);
//     const typeObj = types.find(t => t._id === type);

//     navigate(`/directory/${
//       cityObj ? cityObj.city.toLowerCase() : "all"
//     }/${
//       catObj ? catObj.categoryName.toLowerCase() : "all"
//     }/${
//       typeObj ? typeObj.categoryName.toLowerCase() : "all"
//     }`);
//   }}
// >
//   Search
// </Button> */}
// <Button
//   type="submit"
//   className="mt-2 mt-md-0"
//   onClick={() => {
//     const cityObj = cities.find(c => c._id === city);
//     const catObj = categories.find(c => c._id === category);
//     const typeObj = types.find(t => t._id === type);

//     navigate(`/directory/${
//       cityObj ? encodeURIComponent(cityObj.city.toLowerCase()) : "all"
//     }/${
//       catObj ? encodeURIComponent(catObj.categoryName.toLowerCase()) : "all"
//     }/${
//       typeObj ? encodeURIComponent(typeObj.categoryName.toLowerCase()) : "all"
//     }`);
//   }}
// >
//   Search
// </Button>

//               </div>
//             </Form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Banner;
import React, { useEffect, useMemo, useState } from "react";
import { Form, Button, Carousel } from "react-bootstrap";
import "./Css/Banner.css";
import { useNavigate } from "react-router-dom";

const API_BASE =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_URL
    : "http://localhost:5000";
    const slugify = (text = "") =>
  text
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, "-");

const Banner = ({ home }) => {
  const navigate = useNavigate();

  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [city, setCity] = useState("");

  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [cities, setCities] = useState([]);
  const [allListings, setAllListings] = useState([]);

  // ✅ Load initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [typeRes, categoryRes, cityRes] = await Promise.all([
          fetch(`${API_BASE}/api/pet-category/show`),
          fetch(`${API_BASE}/api/category/show`),
          fetch(`${API_BASE}/api/city/show`),
        ]);

        const typeData = await typeRes.json();
        const categoryData = await categoryRes.json();
        const cityData = await cityRes.json();

        if (typeData.success) setTypes(typeData.petCategories);
        if (categoryData.success) setCategories(categoryData.categories);
        if (cityData.success) setCities(cityData.cities);
      } catch (err) {
        console.error("Error loading data:", err);
      }
    };

    fetchData();
  }, []);

  // ✅ Load listings (for city filtering)
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/listing/directory/approved`);
        const data = await res.json();

        if (data.success) {
          setAllListings(data.listings);
        }
      } catch (err) {
        console.error("Error fetching listings:", err);
      }
    };

    fetchListings();
  }, []);

  // ✅ CATEGORY FILTER (based on TYPE)
  useEffect(() => {
    if (!type) {
      // show all categories
      fetch(`${API_BASE}/api/category/show`)
        .then((res) => res.json())
        .then((data) => {
          setCategories(data.categories || []);
          setCategory("");
        })
        .catch((err) => console.error(err));
      return;
    }

    fetchCategoriesByPet([type]); // ✅ send ID array
  }, [type]);

  const fetchCategoriesByPet = async (petIds) => {
    try {
      const res = await fetch(
        `${API_BASE}/api/category/directory/byPetCategories`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ petCategories: petIds }),
        }
      );

      const data = await res.json();

      if (data.success) {
        setCategories(data.categories);
        setCategory("");
      } else {
        setCategories([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ CITY FILTER (based on TYPE + CATEGORY)
  const filteredCities = useMemo(() => {
    if (!type && !category) return cities;

    const set = new Set();

    allListings.forEach((l) => {
      const typeMatch =
        !type ||
        (l.petCategories || []).some((p) => p._id === type);

      const categoryMatch =
        !category ||
        (l.categories || []).some((c) => c._id === category);

      if (typeMatch && categoryMatch) {
        if (l.city?.city) {
          set.add(l.city.city.toLowerCase());
        }
      }
    });

    return cities.filter((c) =>
      set.has(c.city.toLowerCase())
    );
  }, [type, category, allListings, cities]);

  // ✅ RESET category when type changes
  useEffect(() => {
    setCategory("");
  }, [type]);

  // ✅ SUBMIT
  const handleSubmit = (e) => {
    e.preventDefault();

    const cityObj = cities.find((c) => c._id === city);
    const catObj = categories.find((c) => c._id === category);
    const typeObj = types.find((t) => t._id === type);

    // navigate(`/directory/${
    //   cityObj ? encodeURIComponent(cityObj.city.toLowerCase()) : "all"
    // }/${
    //   catObj ? encodeURIComponent(catObj.categoryName.toLowerCase()) : "all"
    // }/${
    //   typeObj ? encodeURIComponent(typeObj.categoryName.toLowerCase()) : "all"
    // }`);
    navigate(`/directory/${
  cityObj ? slugify(cityObj.city) : "all"
}/${
  catObj ? slugify(catObj.categoryName) : "all"
}/${
  typeObj ? slugify(typeObj.categoryName) : "all"
}`);
  };

  return (
    <div className="banner">
      <div className="inner-banner">

        {/* ✅ Banner Slider */}
        {home?.bannerImages?.length > 0 && (
          <Carousel fade interval={3000}>
            {home.bannerImages.map((img, i) => (
              <Carousel.Item key={i}>
                <img
                  className="d-block w-100"
                  src={`${API_BASE}/${img}`}
                  alt={`Banner ${i}`}
                />
              </Carousel.Item>
            ))}
          </Carousel>
        )}

        {/* ✅ Filter Form */}
        <div className="form-section">
          <div className="form-container">
            <Form onSubmit={handleSubmit}>
              <div className="d-flex flex-column flex-md-row gap-2">

                {/* TYPE */}
                <Form.Select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="">All Types</option>
                  {types.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.categoryName}
                    </option>
                  ))}
                </Form.Select>

                {/* CATEGORY */}
                <Form.Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.categoryName}
                    </option>
                  ))}
                </Form.Select>

                {/* CITY */}
                <Form.Select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                >
                  <option value="">All Cities</option>
                  {filteredCities.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.city}
                    </option>
                  ))}
                </Form.Select>

                {/* BUTTON */}
                <Button type="submit">
                  Search
                </Button>

              </div>
            </Form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Banner;