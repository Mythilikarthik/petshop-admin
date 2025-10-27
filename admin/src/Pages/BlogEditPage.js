import React, { useEffect, useState } from 'react';
import { Form, Button, Container, Row, Col, Breadcrumb } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import ParaEditor from '../Layout/ParaEditor';

const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://petshop-admin.onrender.com"
    : "http://localhost:5000";

const BlogEditPage = () => {
  const { id } = useParams(); // undefined for /admin/blogs/new, defined for /admin/blogs/:id/edit
  const isNew = !id;
  const navigate = useNavigate();
  const [blog, setBlog] = useState({
    title: '',
    author: '',
    category: '',
    date: '',
    status: 'draft',
    excerpt: '',
    content: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isNew) {
      setLoading(true);
      fetch(`${API_BASE}/api/blog/${id}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.success && data.blog) {
            setBlog(data.blog);
          } else if (data && !data.success) {
            console.warn('Fetch blog returned no success');
          }
        })
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [id, isNew]);

  // ...existing code...
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const url = isNew ? `${API_BASE}/api/blog` : `${API_BASE}/api/blog/${id}`;
      const method = isNew ? 'POST' : 'PUT';
      const payload = { ...blog, date: blog.date || new Date().toISOString().slice(0,10) };
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      console.log('save response', data);
      if (data && data.success) {
        navigate('/blog-listing');
      } else {
        alert('Save failed — check console/network');
      }
    } catch (err) {
      console.error('save error', err);
      alert('Error saving blog — check console/network');
    }
  };
// ...existing code...

  return (
    <Container className="mt-4">
        <div className='pl-3 pr-3'>
            <Row className='mb-3 justify-content-end align-items-center'>
            <Col>
                <h2 className='main-title mb-0'>{isNew ? 'Add New Blog' : 'Edit Blog'}</h2>
            </Col>
            <Col xs={'auto'}>
                <Breadcrumb className='top-breadcrumb'>
                <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
                <Breadcrumb.Item active>{isNew ? 'Add New Blog' : 'Edit Blog'}</Breadcrumb.Item>
                </Breadcrumb>
            </Col>
            </Row>
            <div className='form-container'>
            {loading ? <div>Loading...</div> : (
        <Form onSubmit={handleSave}>
          <Form.Group className="mb-4">
            <Form.Label>Title</Form.Label>
            <Form.Control required value={blog.title} onChange={e => setBlog({ ...blog, title: e.target.value })} />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Author</Form.Label>
            <Form.Control value={blog.author} onChange={e => setBlog({ ...blog, author: e.target.value })} />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Category</Form.Label>
            <Form.Control value={blog.category} onChange={e => setBlog({ ...blog, category: e.target.value })} />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Date</Form.Label>
            <Form.Control type="date" value={blog.date?.slice(0,10) || ''} onChange={e => setBlog({ ...blog, date: e.target.value })} />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Status</Form.Label>
            <Form.Select value={blog.status} onChange={e => setBlog({ ...blog, status: e.target.value })}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Excerpt</Form.Label>
            <Form.Control as="textarea" rows={2} value={blog.excerpt} onChange={e => setBlog({ ...blog, excerpt: e.target.value })} />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Content</Form.Label>
            {/* <Form.Control as="textarea" rows={8} value={blog.content} onChange={e => setBlog({ ...blog, content: e.target.value })} /> */}
            <ParaEditor value={blog.content} onChange={value => setBlog({ ...blog, content: value })} />
          </Form.Group>

          <Button type="submit" variant="primary">Save</Button>
        </Form>
      )}
            </div>
        </div>
      {/* <Button variant="secondary" className="mb-3" onClick={() => navigate(-1)}>Back</Button> */}
      
    </Container>
  );
};

export default BlogEditPage;