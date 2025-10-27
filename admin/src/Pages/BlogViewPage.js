// ...existing code...
import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
// ...existing code...

const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://petshop-admin.onrender.com"
    : "http://localhost:5000";

const BlogViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/blog/${id}`);
        const data = await res.json();
        if (data && data.success && data.blog) setBlog(data.blog);
        else {
          // fallback: if API not available, you can pass state from listings or show message
          setBlog(null);
        }
      } catch (err) {
        console.error(err);
        setBlog(null);
      }
    };
    fetchBlog();
  }, [id]);

  if (!blog) return <div className="container mt-4"><h4>Blog not found or loading...</h4></div>;

  return (
    <div className="container mt-4">
      <div className="mb-3">
        <Button variant="secondary" onClick={() => navigate(-1)} className="me-2">Back</Button>
        <Button variant="warning" onClick={() => navigate(`/blogs/${id}/edit`)}>Edit</Button>
      </div>
      <h2>{blog.title}</h2>
      <div style={{ color: '#6b7280', marginBottom: 8 }}>
        <strong>Author:</strong> {blog.author} &nbsp; | &nbsp; <strong>Date:</strong> {blog.date} &nbsp; | &nbsp; <strong>Category:</strong> {blog.category}
      </div>
      <p><em>{blog.excerpt}</em></p>

      {/* Render sanitized HTML content */}
      <div
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(blog.content || '', {
            ADD_ATTR: ['target', 'rel'], // allow target/rel if needed
          }),
        }}
      />
    </div>
  );
};

export default BlogViewPage;
// ...existing code...