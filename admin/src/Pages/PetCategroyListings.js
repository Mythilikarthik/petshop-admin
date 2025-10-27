import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Row, Col, Breadcrumb } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import { useNavigate } from 'react-router-dom';

const API_BASE = process.env.NODE_ENV === "production"
  ? "https://petshop-admin.onrender.com"
  : "http://localhost:5000";

const PetCategoryListings = () => {
  const [listings, setListings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 5;

  const navigate = useNavigate();

  // Fetch categories from backend
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/pet-category`);
      const data = await res.json();

      if (res.ok) {
        setListings(data.petCategories || []);
      } else {
        console.error('Error fetching categories:', data.message);
      }
    } catch (err) {
      console.error('Fetch categories error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Filter listings based on search
  const filteredListings = listings.filter(l =>
    l.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pageCount = Math.ceil(filteredListings.length / itemsPerPage);
  const displayedListings = filteredListings.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageClick = ({ selected }) => setCurrentPage(selected);

  const handleEdit = (listing) => {
    navigate('/edit-pet-category', { state: { listing } });
  };

  const handleView = (listing) => {
    navigate('/view-pet-category', { state: { listing } });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      const res = await fetch(`${API_BASE}/api/pet-category/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (res.ok) {
        setListings(prev => prev.filter(l => l._id !== id));
      } else {
        alert(data.message || "Failed to delete category");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="container mt-4">
      <div className='pl-3 pr-3'>
        <Row className='mb-3 justify-content-end align-items-center'>
          <Col>
            <h2 className='main-title mb-0'>Pet Category Listing</h2>
            
          </Col>
          <Col xs={'auto'}>
            <Breadcrumb className='top-breadcrumb'>
              <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
              <Breadcrumb.Item active>Category Listing</Breadcrumb.Item>
            </Breadcrumb>
            
          </Col>
        </Row>
        <Row className='mb-3'>
          <Col md={8} xs={12}>
              <Form.Control
              type="text"
              placeholder="Search by category"
              className="mb-3"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(0);
              }}
            />
          </Col>
          <Col md={4} xs={12} className="text-end">
            <Button variant="primary" onClick={() => navigate('/add-pet-category')}>+ Add New</Button>
          </Col>
        </Row>

        

        {loading ? (
          <p>Loading categories...</p>
        ) : (
          <>
            <Table bordered hover responsive>
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayedListings.map((listing, index) => (
                  <tr key={listing._id}>
                    <td>{currentPage * itemsPerPage + index + 1}</td>
                    <td>{listing.categoryName}</td>
                    <td>
                      <Button
                        variant="success"
                        size="sm"
                        className="me-2"
                        onClick={() => handleView(listing)}
                      >
                        View
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        className="me-2"
                        onClick={() => handleEdit(listing)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(listing._id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
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
          </>
        )}
      </div>
    </div>
  );
};

export default PetCategoryListings;
