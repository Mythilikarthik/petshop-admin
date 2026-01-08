import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Spinner, Alert, Modal } from "react-bootstrap";
import { DiscussionEmbed } from "disqus-react";   // <-- ADD THIS

const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://petshop-admin.onrender.com"
    : "http://localhost:5000";

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/blog/${id}`);
        const data = await res.json();

        if (!data.success) {
          setError("Blog not found");
        } else {
          setBlog(data.blog);
        }
      } catch (err) {
        console.log(err);
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading)
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
      </div>
    );

  if (error)
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );

  // ---------------------------- DISQUS CONFIG ----------------------------
  const disqusShortname = "pets-directory";
  const disqusConfig = {
    url: window.location.href,
    identifier: blog?._id,
    title: blog?.title,
  };
  // -----------------------------------------------------------------------

  return (
    <div className="blog-detail pb-5">
      <div className="banner-section">
        {blog.bannerImage && (
          <Row className="mb-4">
            <Col className="d-flex justify-content-center">
              <img
                src={`${API_BASE}/${blog.bannerImage}`}
                alt={blog.title}
                className="img-responsive"
              />
            </Col>
          </Row>
        )}
      </div>
      <Container>
        {/* Banner Image */}
        

        <Row className="">
          <Col md={8}>
            {/* {new Date(blog.date).toLocaleDateString()} */}
            {/* Author + Date */}
<div className="listing-type">
          <span  className="">
            By {blog.author} - {new Date(blog.date).toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric"
            }).replace(" ", " ").replace(",", ",")}
          </span>
          </div>
           
            {/* Title */}
            <h1 className="mb-2">{blog.title}</h1>

            

            {/* Category */}

            <div class="listing-category">
              {blog.category?.length > 0 && (
                blog.category.map((c) => 
                  <span class="service-tag tag-blue">{c.categoryName}</span>
                )           
            )}
              
            </div>
            

            {/* Main Content */}
            <div
              className="mt-4"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            ></div>
            

            {/* Excerpt */}
            {/* <h5 className="mt-4 text-secondary">{blog.excerpt}</h5> */}
            {blog.contentImage?.length > 0 && (
              <div className="listing-gallery mt-4">
            
                <Row>
                    <Col md={4} sm={6} xs={12} className="mb-3">
                      <div
                        className="gallery-item"
                        onClick={() => {
                          setShowGalleryModal(true);
                        }}
                      >
                        <img
                          src={`${API_BASE}/${blog.contentImage}`}
                          alt={`${blog.title}`}
                          className="gallery-img"
                        />
                      </div>
                    </Col>
                </Row>
              </div>
            )}
            
                    <Modal
              show={showGalleryModal}
              onHide={() => setShowGalleryModal(false)}
              centered
              size="lg"
            >
              <Modal.Body className="p-0">
                <img
                  src={`${API_BASE}/${blog.contentImage}`}
                  alt="Gallery preview"
                  className="w-100"
                  style={{ maxHeight: "80vh", objectFit: "contain" }}
                />
              </Modal.Body>
            </Modal>

           

            
          </Col>
          <Col md={4}>
          {/* ---------------- DISQUS COMMENT BOX ---------------- */}
            <div className=" bg-grey p-5">
              <DiscussionEmbed shortname={disqusShortname} config={disqusConfig} />
            </div>
            {/* ----------------------------------------------------- */}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default BlogDetail;
