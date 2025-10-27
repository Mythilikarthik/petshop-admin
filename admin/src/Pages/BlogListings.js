// ...existing code...
import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Row, Col, Breadcrumb } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';

const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://petshop-admin.onrender.com"
    : "http://localhost:5000";

const itemsPerPage = 5;

const BlogListings = () => {
  const [blogs, setBlogs] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();

  const fetchBlogs = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/blog`);
      const data = await res.json();
      // backend: { success: true, blogs: [...] } or return array
      const list = data?.blogs || (Array.isArray(data) ? data : []);
      setBlogs(list);
      const cats = Array.from(new Set(list.map(b => b.category).filter(Boolean)));
      setCategoryList(cats);
    } catch (err) {
      console.error('fetchBlogs error', err);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const filtered = blogs.filter(b => {
    const matchesSearch =
      (b.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.author || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(b.category);

    return matchesSearch && matchesCategory;
  });

  const pageCount = Math.ceil(filtered.length / itemsPerPage);
  const displayed = filtered.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  const handlePageClick = ({ selected }) => setCurrentPage(selected);

  const openView = (blog) => {
    const id = blog._id || blog.id;
    if (!id) return;
    navigate(`/blogs/${id}`);
  };

  const openEdit = (blog) => {
    if (!blog) return navigate('/blogs/new');
    const id = blog._id || blog.id;
    navigate(`/blogs/${id}/edit`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this blog post?')) return;
    try {
      const res = await fetch(`${API_BASE}/api/blog/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data?.success) {
        setBlogs(prev => prev.filter(b => (b._id || b.id) !== id));
      } else {
        // fallback or backend didn't return success
        setBlogs(prev => prev.filter(b => (b._id || b.id) !== id));
      }
    } catch (err) {
      console.error('delete error', err);
      setBlogs(prev => prev.filter(b => (b._id || b.id) !== id));
    }
  };

  return (
    <div className="container mt-4">
      <div className='pl-3 pr-3'>
        <Row className='mb-3 justify-content-between align-items-center'>
          <Col>
            <h2 className='main-title mb-0'>Blog Listings</h2>
          </Col>
          <Col xs={'auto'}>
            <Breadcrumb className='top-breadcrumb'>
              <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
              <Breadcrumb.Item active>Blog Listings</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>

        <Row className='mb-3'>
          <Col md={4}>
            <Form.Control
              type="text"
              placeholder="Search by title/author"
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setCurrentPage(0); }}
            />
          </Col>
          <Col md={4}>
            <Select
              isMulti
              options={categoryList.map(c => ({ value: c, label: c }))}
              value={selectedCategories.map(c => ({ value: c, label: c }))}
              onChange={selected => { setSelectedCategories(selected ? selected.map(s => s.value) : []); setCurrentPage(0); }}
              placeholder="Filter by Category"
            />
          </Col>
          <Col md={4} className="text-end">
            <Button variant="primary" onClick={() => openEdit(null)}>+ Add New</Button>
          </Col>
        </Row>

        <Table bordered hover responsive>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Title</th>
              <th>Author</th>
              <th>Category</th>
              <th>Date</th>
              <th style={{ width: 220 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayed.map((b, i) => (
              <tr key={b._id || b.id}>
                <td>{currentPage * itemsPerPage + i + 1}</td>
                <td>{b.title}</td>
                <td>{b.author}</td>
                <td>{b.category}</td>
                <td>{b.date ? new Date(b.date).toISOString().slice(0,10) : ''}</td>
                <td>
                  <Button size="sm" variant="success" className="me-2" onClick={() => openView(b)}>View</Button>
                  <Button size="sm" variant="primary" className="me-2" onClick={() => openEdit(b)}>Edit</Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(b._id || b.id)}>Delete</Button>
                </td>
              </tr>
            ))}
            {displayed.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center">No posts found.</td>
              </tr>
            )}
          </tbody>
        </Table>

        {pageCount > 1 && (
          <ReactPaginate
            pageCount={pageCount}
            pageRangeDisplayed={2}
            marginPagesDisplayed={1}
            onPageChange={handlePageClick}
            containerClassName="pagination justify-content-center"
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousLabel="«"
            nextLabel="»"
            previousClassName="page-item"
            nextClassName="page-item"
            previousLinkClassName="page-link"
            nextLinkClassName="page-link"
            activeClassName="active"
          />
        )}
      </div>
    </div>
  );
};

export default BlogListings;
// ...existing code...