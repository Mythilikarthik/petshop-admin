import React, { useEffect, useState } from 'react';
import { Form, Button, Container, Row, Col, Breadcrumb } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import ParaEditor from '../Layout/ParaEditor';
import Select from 'react-select';

const API_BASE =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_URL
    : "http://localhost:5000";

const BlogEditPage = () => {
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();

  const [blog, setBlog] = useState({
    title: '',
    author: '',
    category: [],
    date: '',
    status: 'draft',
    excerpt: '',
    content: '',
    bannerImage: '',
    contentImage: ''
  });

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  // Fetch categories
  useEffect(() => {
    fetch(`${API_BASE}/api/category/show`)
      .then(res => res.json())
      .then(data => {
        if (data && data.success && Array.isArray(data.categories)) {
          const options = data.categories.map(cat => ({
            value: cat._id,
            label: cat.categoryName || cat.name,
          }));
          setCategories(options);
        }
      })
      .catch(err => console.error("Category fetch error:", err));
  }, []);

  // Fetch blog for edit
  useEffect(() => {
    if (!isNew) {
      setLoading(true);
      fetch(`${API_BASE}/api/blog/${id}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.success && data.blog) {
            // setBlog(data.blog);      
            setBlog({
            ...data.blog,
            category: data.blog.category.map(cat => cat._id), // ✅ FIX
          });      
          } else if (data && !data.success) {
            console.warn('Fetch blog returned no success');
          }
        })
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [id, isNew]);
  console.log("Blog:", blog);

  // ---------------------------
  // SAVE HANDLER (fixed)
  // ---------------------------
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const url = isNew ? `${API_BASE}/api/blog` : `${API_BASE}/api/blog/${id}`;
      const method = isNew ? 'POST' : 'PUT';

      const formData = new FormData();

      for (let key in blog) {
        if (key === "category") {
          blog[key].forEach((catId) => formData.append("category[]", catId));
        } else if (key !== "bannerImage" && key !== "contentImage") {
          formData.append(key, blog[key]);
        }
      }

      // Only append files if they are File objects (not existing URLs)
      if (blog.bannerImage instanceof File)
        formData.append("bannerImage", blog.bannerImage);
      if (blog.contentImage instanceof File)
        formData.append("contentImage", blog.contentImage);

      const res = await fetch(url, { method, body: formData });
      const data = await res.json();
      console.log("save response", data);
      if (data.success) navigate("/blog-listing");
      else alert(data.message || "Save failed");
    } catch (err) {
      console.error("save error", err);
      alert("Error saving blog");
    }
  };

  // ---------------------------
  // JSX RETURN
  // ---------------------------
  return (
    <Container className="mt-4">
      <div className="pl-3 pr-3">
        <Row className="mb-3 justify-content-end align-items-center">
          <Col>
            <h2 className="main-title mb-0">
              {isNew ? 'Add New Blog' : 'Edit Blog'}
            </h2>
            <Breadcrumb className="top-breadcrumb">
              <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
              <Breadcrumb.Item active>
                {isNew ? 'Add New Blog' : 'Edit Blog'}
              </Breadcrumb.Item>
            </Breadcrumb>
          </Col>
          <Col xs={'auto'}>
            <Button variant="secondary" onClick={() => navigate(-1)}>
              Go Back
            </Button>
          </Col>
        </Row>

        <div className="form-container">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <Form onSubmit={handleSave}>
              <Form.Group className="mb-4">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  required
                  value={blog.title}
                  onChange={(e) => setBlog({ ...blog, title: e.target.value })}
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Author</Form.Label>
                <Form.Control
                  value={blog.author}
                  onChange={(e) => setBlog({ ...blog, author: e.target.value })}
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Category</Form.Label>
                <Select
                  isMulti
                  options={categories}
                  value={categories.filter(opt =>
                    blog.category?.includes(opt.value)
                  )}
                  onChange={(selectedOptions) => {
                    setBlog({
                      ...blog,
                      category: selectedOptions.map(option => option.value),
                    });
                  }}
                  placeholder="Select category"
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  value={blog.date?.slice(0, 10) || ''}
                  onChange={(e) => setBlog({ ...blog, date: e.target.value })}
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={blog.status}
                  onChange={(e) => setBlog({ ...blog, status: e.target.value })}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Excerpt</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={blog.excerpt}
                  onChange={(e) => setBlog({ ...blog, excerpt: e.target.value })}
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Content</Form.Label>
                <ParaEditor
                  value={blog.content}
                  onChange={(value) => setBlog({ ...blog, content: value })}
                />
              </Form.Group>

              {/* Banner Image Upload */}
              <Form.Group className="mb-4">
                <Form.Label>Banner Image</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setBlog({ ...blog, bannerImage: e.target.files[0] })
                  }
                />
                <Form.Text className="text-muted">
                                Note : 1200x300 pixels.
                              </Form.Text> <br />
                {blog.bannerImage && typeof blog.bannerImage === "string" && (
                  <img
                    src={`${API_BASE}/${blog.bannerImage}`}
                    alt="Banner"
                    style={{
                      width: "100%",
                      maxWidth: "600px",
                      height: "auto",
                      marginTop: "10px",
                    }}
                  />
                )}
                
              </Form.Group>

              {/* Content Image Upload */}
              <Form.Group className="mb-4">
                <Form.Label>Content Image</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setBlog({ ...blog, contentImage: e.target.files[0] })
                  }
                />
                <Form.Text className="text-muted">
                                Note : 500x500 pixels.
                              </Form.Text>
                              <br />
                {blog.contentImage && typeof blog.contentImage === "string" && (
                  <img
                    src={`${API_BASE}/${blog.contentImage}`}
                    alt="Content"
                    style={{
                      width: "250px",
                      height: "250px",
                      objectFit: "cover",
                      marginTop: "10px",
                    }}
                  />
                )}
                
              </Form.Group>

              <Button type="submit" variant="primary">
                Save
              </Button>
            </Form>
          )}
        </div>
      </div>
    </Container>
  );
};

export default BlogEditPage;
