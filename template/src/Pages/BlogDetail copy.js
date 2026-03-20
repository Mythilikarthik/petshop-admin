import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Spinner, Alert } from "react-bootstrap";

const API_BASE =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_URL
    : "http://localhost:5000";

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/blog/${id}`);
        const data = await res.json();

        if (!data.success) {
          setError("Blog not found");
        } else {
            console.log(data.blog);
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

  return (
    <div className="blog-detail py-5">
      <Container>
        {/* Banner Image */}
        {blog.bannerImage && (
          <Row className="mb-4">
            <Col className="d-flex justify-content-center">
              <img
                src={`/${blog.bannerImage}`}
                alt={blog.title}
                className="img-fluid rounded"
              />
            </Col>
          </Row>
        )}

        <Row className="justify-content-center">
          <Col md={8}>
            {/* Title */}
            <h1 className="mb-3">{blog.title}</h1>

            {/* Author + Date */}
            <p className="text-muted">
              By <strong>{blog.author}</strong> •{" "}
              {new Date(blog.date).toLocaleDateString()}
            </p>

            {/* Category */}
            {blog.category?.length > 0 && (
              <p className="mb-3">
                <strong>Category:</strong>{" "}
                {blog.category.map((c) => c.categoryName).join(", ")}
              </p>
            )}

            {/* Excerpt */}
            <h5 className="mt-4 text-secondary">{blog.excerpt}</h5>

            {/* Content Image */}
            {blog.contentImage && (
              <img
                src={`/${blog.contentImage}`}
                alt="content"
                className="img-fluid rounded my-4"
              />
            )}

            {/* Main Content */}
            <div
              className="mt-4"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            ></div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default BlogDetail;
