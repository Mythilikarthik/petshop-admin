// import React, {useState, useEffect} from 'react'
// import PetHealthTips from '../Components/PetHealthTips';
// import AdSlider from '../Components/AdSlider';
// import { Image } from "react-bootstrap";

// const API_BASE =
//   process.env.NODE_ENV === "production"
//     ? process.env.REACT_APP_API_URL
//     : "http://localhost:5000";

// const Blog = () => {
//     const pgname ="blog";
//     const [blog, setBlog] = useState([]);
//     const [topHomeAds, setTopHomeAds] = useState([]);
//       const [bottomHomeAds, setBottomHomeAds] = useState([]);
//       const [middleHomeAds, setMiddleHomeAds] = useState([]);
//     const [adSettings, setAdSettings] = useState({ slideInterval: 5, maxImages: 5 });
//     const blogData = async () => {
//     try {
//         const blogRes = await fetch(`${API_BASE}/api/blog`);
//         const blogData = await blogRes.json();
//         if(blogData.success) {
//         //console.log("Blog Data:", blogData.blogs);
//         setBlog(blogData.blogs);
//         }
//     } catch (err) {
//         console.error("Error fetching blog data:", err);
//     }
//     };
//     const fetchBottomHomeAds = async () => {
//   try {
//     const res = await fetch(`${API_BASE}/api/ads/bottom/${pgname}`);
//     const data = await res.json();

//     if (data.success) {
//       // Apply the limit here
//       const limitedAds = data.ads.slice(0, data.settings.maxImages);

//       setBottomHomeAds(limitedAds);
//       setAdSettings(data.settings); 
//     }
//   } catch (err) {
//     console.error("Error fetching home ads:", err);
//   }
// };
// const fetchMiddleHomeAds = async () => {
//   try {
//     const res = await fetch(`${API_BASE}/api/ads/middle/${pgname}`);
//     const data = await res.json();

//     if (data.success) {
//       // Apply the limit here
//       const limitedAds = data.ads.slice(0, data.settings.maxImages);

//       setMiddleHomeAds(limitedAds);
//       setAdSettings(data.settings); 
//     }
//   } catch (err) {
//     console.error("Error fetching home ads:", err);
//   }
// };
//     const fetchTopHomeAds = async () => {
//   try {
//     const res = await fetch(`${API_BASE}/api/ads/top/${pgname}`);
//     const data = await res.json();

//     if (data.success) {
//       // Apply the limit here
//       const limitedAds = data.ads.slice(0, data.settings.maxImages);

//       setTopHomeAds(limitedAds);
//       setAdSettings(data.settings); 
//     }
//   } catch (err) {
//     console.error("Error fetching home ads:", err);
//   }
// };
// const [banner, setBanner] = useState(null);

// const Banner = async () => {
//   try {
//     const url = `${API_BASE}/api/blog-banner`;

//     const res = await fetch(url);

//     if (!res.ok) {
//       throw new Error("Failed to fetch banner");
//     }

//     const data = await res.json();
// // console.log(data);
//     if (data.success) {
//       setBanner(data.banner); // ✅ correct
//     }
    
//   } catch (err) {
//     console.error("Banner error:", err.message);
//   }
// };

//     useEffect(() => {
//       fetchTopHomeAds();
//     fetchBottomHomeAds();
//     fetchMiddleHomeAds();
//     blogData();
//     Banner();
//     }, []);
//   return (
//     <>
//     {banner?.banner && (
//       <Image
//         className='img-responsive'
//         src={`${API_BASE}/${banner.banner}`}
//         alt="Banner"
//         style={{ width: "100%", height: "300px", objectFit: "cover" }}
//       />
//     )}
//     {topHomeAds.length > 0 && (
//       <AdSlider ads={topHomeAds} maxImages={adSettings.maxImages} interval={adSettings.slideInterval} />
//     )}
//     {middleHomeAds.length > 0 && (
//             <AdSlider ads={middleHomeAds} maxImages={adSettings.maxImages} interval={adSettings.slideInterval} float={true}
//       side="right" />
//           )}
//     <PetHealthTips blog={blog} showViewAll={false} banner={true} />
//      {bottomHomeAds.length > 0 && (
//         <AdSlider ads={bottomHomeAds} maxImages={adSettings.maxImages} interval={adSettings.slideInterval} />
//       )}
//       </>
//   )
// }

// export default Blog


import React, { useState, useEffect } from "react";
import AdSlider from "../Components/AdSlider";
import { Card, Col, Image, Row, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { BsLightningFill } from "react-icons/bs";
import backgroundImage from "../Components/Image/bg-image.svg";
import { Helmet } from "react-helmet-async";

const API_BASE =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_URL
    : "http://localhost:5000";

const BLOGS_PER_PAGE = 10;

const Blog = () => {
  const pgname = "blog";

  const [blog, setBlog] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);

  const [topHomeAds, setTopHomeAds] = useState([]);
  const [middleHomeAds, setMiddleHomeAds] = useState([]);
  const [bottomHomeAds, setBottomHomeAds] = useState([]);
  const [adSettings, setAdSettings] = useState({
    slideInterval: 5,
    maxImages: 5,
  });

  const [banner, setBanner] = useState(null);

  /* ---------------- BLOG DATA ---------------- */
  const blogData = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/blog`, {
        method: "GET"
      });
      const data = await res.json();
      if (data.success) {
        setBlog(data.blogs);
      }
    } catch (err) {
      console.error("Blog error:", err);
    }
  };

  /* ---------------- CATEGORIES ---------------- */
  const categoriesList = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/category/blog/show`);
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (err) {
      console.error("Category error:", err);
    }
  };

  /* ---------------- ADS ---------------- */
  const fetchAds = async (position, setter) => {
    try {
      const res = await fetch(`${API_BASE}/api/ads/${position}/${pgname}`);
      const data = await res.json();
      if (data.success) {
        setter(data.ads.slice(0, data.settings.maxImages));
        setAdSettings(data.settings);
      }
    } catch (err) {
      console.error("Ads error:", err);
    }
  };

  /* ---------------- BANNER ---------------- */
  const Banner = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/blog-banner`);
      const data = await res.json();
      if (data.success) {
        setBanner(data.banner);
      }
    } catch (err) {
      console.error("Banner error:", err);
    }
  };

  /* ---------------- FILTER + PAGINATION ---------------- */
  const filteredBlogs =
    selectedCategory === "all"
      ? blog
      : blog.filter((item) =>
          item.category?.some(
            (cat) => cat._id === selectedCategory
          )
        );

  const indexOfLastBlog = currentPage * BLOGS_PER_PAGE;
  const indexOfFirstBlog = indexOfLastBlog - BLOGS_PER_PAGE;
  const currentBlogs = filteredBlogs.slice(
    indexOfFirstBlog,
    indexOfLastBlog
  );

  const totalPages = Math.ceil(filteredBlogs.length / BLOGS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  /* ---------------- INIT ---------------- */
  useEffect(() => {
    blogData();
    categoriesList();
    Banner();
    fetchAds("top", setTopHomeAds);
    fetchAds("middle", setMiddleHomeAds);
    fetchAds("bottom", setBottomHomeAds);
  }, []);

  return (
    <>
    <Helmet>
        <title>Pet Care Blog India – Expert Tips, Health Guides & Advice for Pets</title>
        <meta
          name="description"
          content="Read expert pet care tips, health guides, nutrition advice, and training insights on the Vet & Pets blog to keep your pets healthy and happy."
        />
    </Helmet>
      {/* Banner */}
      {banner?.banner && (
        <Image
          src={`${API_BASE}/${banner.banner}`}
          alt="Banner"
          style={{ width: "100%", height: "auto", objectFit: "cover" }}
        />
      )}

      {/* Top Ads */}
      {topHomeAds.length > 0 && (
        <AdSlider
          ads={topHomeAds}
          maxImages={adSettings.maxImages}
          interval={adSettings.slideInterval}
        />
      )}

      {/* Middle Ads */}
      {middleHomeAds.length > 0 && (
        <AdSlider
          ads={middleHomeAds}
          maxImages={adSettings.maxImages}
          interval={adSettings.slideInterval}
          float
          side="right"
        />
      )}

      <div
        className="featured-section bg-image"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <Container>
          <div className="title text-center">
            <h2>
              Our <span className="highlight">Blog & Updates</span>
            </h2>
            <p className="subtitle">
              Stay informed with the latest articles and updates.
            </p>
          </div>

          <Row>
            {/* SIDEBAR */}
            <Col md={3} className="bg-grey mb-4">
            <div className="directory-filters sticky-top shadow-sm  rounded ">
              <Row className=" shadow-sm m-4 rounded  mb-4  ">
                <h5 style={{background: "#eaeaea", padding: "14px", textAlign: "center"}}>Categories</h5>

                <div
                  className={`cursor-pointer mb-2 ${
                    selectedCategory === "all"
                      ? "fw-bold text-orange-500"
                      : ""
                  }`}
                  onClick={() => setSelectedCategory("all")}
                  style={{"cursor" : "pointer"}}
                >
                  All
                </div>

                {categories.map((cat) => (
                  <div
                    key={cat._id}
                    className={`cursor-pointer mb-2 ${
                      selectedCategory === cat._id
                        ? "fw-bold text-orange-500"
                        : ""
                    }`}
                    onClick={() => setSelectedCategory(cat._id)}
                    style={{"cursor" : "pointer"}}
                  >
                    {/* {cat.categoryName} */}
                    <span>{cat.categoryName}</span>
                    <span className="text-muted small">({cat.blogCount || 0})</span>
                  </div>
                ))}
              </Row>
              </div>
            </Col>

            {/* BLOG LIST */}
            <Col md={9}>
              <Row>
                {currentBlogs.length > 0 ? (
                  currentBlogs.map((item) => (
                    <Col md={4} key={item._id} className="mb-4">
                      <Card className="pos-rel h-100 w-100">
                        <Card.Header className="p-0 own-height-style">
                          {item.bannerImage ? (
                            <img
                              src={`${API_BASE}/${item.bannerImage}`}
                              alt=""
                              className="img-fluid"
                            />
                          ) : (
                            <div className="text-center">
                              <BsLightningFill size={80} />
                            </div>
                          )}
                        </Card.Header>

                        <Card.Body>
                          <div className="mb-2">
                            {item.category?.map((cat, i) => (
                              <span
                                key={i}
                                className="badge badge-top-rated me-1"
                              >
                                {cat.categoryName}
                              </span>
                            ))}
                          </div>

                          <small className="text-muted d-block mb-2">
                            {new Date(item.date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "2-digit",
                                year: "numeric"
                            }).replace(" ", " ").replace(",", ",")}

                          </small>

                          <Card.Title>{item.title}</Card.Title>

                          <Card.Text>
                            {item.excerpt?.slice(0, 100)}...
                          </Card.Text>

                          {/* <Link style={{ color: "#ff6b00" }}  to={`/blog/${item._id}`}> */}
                          <Link style={{ color: "#ff6b00" }}  to={`/blog/${item.slug}`}>
                            Read More →
                          </Link>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))
                ) : (
                  <p className="text-center text-muted">
                    No blogs found.
                  </p>
                )}
              </Row>

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      className={`btn mx-1 ${
                        currentPage === i + 1
                          ? "border-2 border-orange-500 text-white bg-orange-500"
                          : "border-2 shadow-sm bg-white"
                      }`}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </Col>
          </Row>
        </Container>
      </div>

      {/* Bottom Ads */}
      {bottomHomeAds.length > 0 && (
        <AdSlider
          ads={bottomHomeAds}
          maxImages={adSettings.maxImages}
          interval={adSettings.slideInterval}
        />
      )}
    </>
  );
};

export default Blog;
