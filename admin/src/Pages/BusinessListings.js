import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Row, Col, Breadcrumb, ButtonGroup, ToggleButton } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import { useNavigate } from 'react-router-dom';
import Select from "react-select";

const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://petshop-admin.onrender.com"
    : "http://localhost:5000";

const itemsPerPage = 5;

const BusinessListings = () => {
  const [listings, setListings] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState("approved");
  const navigate = useNavigate();

  // Fetch listings
  const fetchListings = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/listing`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      console.log(data);
      if (data.success) setListings(data.listings);
    } catch (err) {
      console.error("Error fetching listings:", err);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/category`);
      const data = await res.json();
      if (data.success) {
        setCategoryList(data.categories.map(c => c.categoryName));
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  useEffect(() => {
    fetchListings();
    fetchCategories();
  }, []);

  // Filtered & paginated listings
  const filteredListings = listings.filter(l => {
    const matchesSearch =
      l.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.some(cat => l.categories?.includes(cat));

    const matchesStatus = l.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const pageCount = Math.ceil(filteredListings.length / itemsPerPage);
  const displayedListings = filteredListings.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageClick = ({ selected }) => setCurrentPage(selected);
  const handleEdit = (listing) => navigate('/edit-listing', { state: { listing } });
  const handleView = (listing) => navigate('/view-listing', { state: { listing } });

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/listing/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) setListings(prev => prev.filter(l => l._id !== id));
      else alert("Failed to delete listing");
    } catch (err) {
      console.error(err);
      alert("Error deleting listing");
    }
  };

  const handleToggleStatus = async (id) => {
    const listing = listings.find(l => l._id === id);
    if (!listing) return;
    const newStatus = listing.status === "approved" ? "approved" : "pending";

    try {
      const res = await fetch(`${API_BASE}/api/listing/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setListings(prev =>
          prev.map(l => l._id === id ? { ...l, status: newStatus } : l)
        );
      }
    } catch (err) {
      console.error(err);
      alert("Error updating status");
    }
  };

  return (
    <div className="container mt-4">
      <div className='pl-3 pr-3'>
        <Row className='mb-3 justify-content-between align-items-center'>
          <Col>
            <h2 className='main-title mb-0'>Business Listing</h2>
          </Col>
          <Col xs={'auto'}>
            <Breadcrumb className='top-breadcrumb'>
              <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
              <Breadcrumb.Item active>Business Listing</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>

        {/* Filters */}
        <Row className='mb-3'>
          <Col md={4}>
            <Form.Control
              type="text"
              placeholder="Search by name/email"
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setCurrentPage(0); }}
            />
          </Col>
          <Col md={4}>
            <Select
              isMulti
              options={categoryList.map(c => ({ value: c, label: c }))}
              value={selectedCategories.map(c => ({ value: c, label: c }))}
              onChange={selected => { 
                setSelectedCategories(selected ? selected.map(s => s.value) : []); 
                setCurrentPage(0);
              }}
              placeholder="Filter by Categories"
            />
          </Col>
          <Col md={4}>
            <ButtonGroup className='w-100'>
              <ToggleButton
                id="approved"
                type="radio"
                variant="outline-success"
                checked={statusFilter === "approved"}
                onChange={() => { setStatusFilter("approved"); setCurrentPage(0); }}
              >
                Approved
              </ToggleButton>
              <ToggleButton
                id="pending"
                type="radio"
                variant="outline-danger"
                checked={statusFilter === "pending"}
                onChange={() => { setStatusFilter("pending"); setCurrentPage(0); }}
              >
                Pending
              </ToggleButton>
            </ButtonGroup>
          </Col>
        </Row>

        {/* Table */}
        <Table bordered hover responsive>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>Email</th>
              <th>Category</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {console.log(displayedListings)}
            {displayedListings.map((listing, index) => (
              
              <tr key={listing._id}>
                <td>{currentPage * itemsPerPage + index + 1}</td>
                <td>{listing.shopName}</td>
                <td>{listing.email}</td>
                <td>{listing.categories?.join(", ")}</td>
                <td>
                  <Form.Check
                    type="switch"
                    id={`status-${listing._id}`}
                    label={listing.status === "approved" ? "Approved" : "Pending"}
                    checked={listing.status === "approved"}
                    onChange={() => handleToggleStatus(listing._id)}
                  />
                </td>
                <td>
                  <Button size="sm" variant="success" onClick={() => handleView(listing)}>View</Button>{' '}
                  <Button size="sm" variant="primary" onClick={() => handleEdit(listing)}>Edit</Button>{' '}
                  <Button size="sm" variant="danger" onClick={() => handleDelete(listing._id)}>Delete</Button>
                </td>
              </tr>
            ))}
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

export default BusinessListings;
