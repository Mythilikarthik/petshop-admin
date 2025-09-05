import React, { useState } from 'react';
import { Table, Button, Form, Row, Col, Breadcrumb, ButtonGroup, ToggleButton } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import { useNavigate } from 'react-router-dom';
import Select from "react-select";

const BusinessListings = () => {
  const initialListings = [
    { id: 1, name: 'John Doe', email: 'john@example.com', categories: ["Pet Shop", "Services"], status: "approved" },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', categories: ["Pet Food"], status: "pending" },
    { id: 3, name: 'Michael Scott', email: 'michael@dundermifflin.com', categories: ["Pet Shop"], status: "approved" },
    { id: 4, name: 'Dwight Schrute', email: 'dwight@dundermifflin.com', categories: ["Services", "Pet Insurance"], status: "pending" },
    { id: 5, name: 'Pam Beesly', email: 'pam@dundermifflin.com', categories: ["Pet Food"], status: "approved" }
  ];

  const categoryList = ["Pet Shop", "Pet Food", "Services", "Pet Insurance"];
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [listings, setListings] = useState(initialListings);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState("approved"); // default approved list
  const itemsPerPage = 5;

  const navigate = useNavigate();

  // Filter logic
  const filteredListings = listings.filter((l) => {
    const matchesSearch =
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.some((cat) => l.categories.includes(cat));

    const matchesStatus = l.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const pageCount = Math.ceil(filteredListings.length / itemsPerPage);
  const displayedListings = filteredListings.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageClick = ({ selected }) => setCurrentPage(selected);

  const handleEdit = (listing) => {
    navigate('/edit-listing', { state: { listing } });
  };

  const handleView = (listing) => {
    navigate('/view-listing', { state: { listing } });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      setListings((prevListings) => prevListings.filter(l => l.id !== id));
    }
  };

  // Approve/Unapprove toggle
  const handleToggleStatus = (id) => {
    setListings(prev =>
      prev.map(l => l.id === id ? { ...l, status: l.status === "approved" ? "pending" : "approved" } : l)
    );
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

        {/* Search + Categories */}
        <Row className='justify-content-center'>
          <Col>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="Search by name or email"
                className="mb-3"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(0);
                }}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3">
              <Select
                isMulti
                options={categoryList.map((c) => ({ value: c, label: c }))}
                value={selectedCategories.map((c) => ({ value: c, label: c }))}
                onChange={(selected) => {
                  setSelectedCategories(selected ? selected.map((s) => s.value) : []);
                  setCurrentPage(0);
                }}
                placeholder="Select by Categories"
              />
            </Form.Group>
          </Col>
          <Col>
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
                Pending Approval
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
              <th>Category</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedListings.map((listing, index) => (
              <tr key={listing.id}>
                <td>{currentPage * itemsPerPage + index + 1}</td>
                <td>{listing.name}</td>
                <td>{listing.categories ? listing.categories.join(", ") : ""}</td>
                <td>
                  <Form.Check
                    type="switch"
                    id={`status-${listing.id}`}
                    label={listing.status === "approved" ? "Approved" : "Pending"}
                    checked={listing.status === "approved"}
                    onChange={() => handleToggleStatus(listing.id)}
                  />
                </td>
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
                    onClick={() => handleDelete(listing.id)}
                  >
                    Delete
                  </Button>
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
