// ...existing code...
import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Row, Col, Breadcrumb } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import { useNavigate } from 'react-router-dom';
import Select from "react-select";

const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://petshop-admin.onrender.com"
    : "http://localhost:5000";

const itemsPerPage = 5;

const FaqListing = () => {
  const [listings, setListings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();

  // Fetch listings
  const fetchListings = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/faq`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      console.log("fetch response:", data);
      // support both { success: true } and { status: "success" }
      if (data && (data.success || data.status === "success")) {
        setListings(data.listings || data.data || []);
      } else {
        // fallback if server returns array directly
        if (Array.isArray(data)) setListings(data);
        else setListings([]);
      }
    } catch (err) {
      console.error("Error fetching listings:", err);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  // Filtered & paginated listings
  const filteredListings = listings.filter(l => {
    const q = (l.question || "").toLowerCase();
    const a = (l.answer || "").toLowerCase();
    const term = searchTerm.toLowerCase();
    return q.includes(term) || a.includes(term);
  });

  const pageCount = Math.ceil(filteredListings.length / itemsPerPage);
  const displayedListings = filteredListings.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageClick = ({ selected }) => setCurrentPage(selected);
  const openView = (faq) => {
    const id = (faq && (faq._id || faq.id));
    if (!id) return;
    navigate(`/faq/${id}`);
  };

  const openEdit = (faq) => {
    if (!faq) return navigate('/faq/new');
    const id = faq._id || faq.id;
    navigate(`/faq/${id}/edit`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this FAQ?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/faq/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success || data.status === "success") {
        setListings(prev => prev.filter(l => (l._id || l.id) !== id));
      } else {
        alert("Failed to delete FAQ");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting FAQ");
    }
  };

  return (
    <div className="container mt-4">
      <div className='pl-3 pr-3'>
        <Row className='mb-3 justify-content-between align-items-center'>
          <Col>
            <h2 className='main-title mb-0'>FAQ Listing</h2>
          </Col>
          <Col xs={'auto'}>
            <Breadcrumb className='top-breadcrumb'>
              <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
              <Breadcrumb.Item active>FAQ Listing</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>

        {/* Filters */}
        <Row className='mb-3'>
          <Col md={8}>
            <Form.Control
              type="text"
              placeholder="Search by FAQ"
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setCurrentPage(0); }}
            />
          </Col>
          <Col md={4} className="text-end">
            <Button variant="primary" onClick={() => openEdit(null)}>+ Add New</Button>
          </Col>
        </Row>

        {/* Table */}
        <Table bordered hover responsive>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Question</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedListings.map((listing, index) => (
              <tr key={listing._id || listing.id || index}>
                <td>{currentPage * itemsPerPage + index + 1}</td>
                <td>{listing.question}</td>
                <td>
                  {/* <Button size="sm" variant="success" className="me-2" onClick={() => openView(listing)}>View</Button> */}
                  <Button size="sm" variant="primary" className="me-2" onClick={() => openEdit(listing)}>Edit</Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(listing._id || listing.id)}>Delete</Button>
                </td>
              </tr>
            ))}
            {displayedListings.length === 0 && (
              <tr><td colSpan="3" className="text-center">No FAQs found.</td></tr>
            )}
          </tbody>
        </Table>

        {/* Pagination */}
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

export default FaqListing;
// ...existing code...