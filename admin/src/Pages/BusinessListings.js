import React, { useState } from 'react';
import { Table, Button, Form } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import { useNavigate } from 'react-router-dom';

const BusinessListings = () => {
  const initialListings = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    { id: 3, name: 'Michael Scott', email: 'michael@dundermifflin.com' },
    { id: 4, name: 'Dwight Schrute', email: 'dwight@dundermifflin.com' },
    { id: 5, name: 'Pam Beesly', email: 'pam@dundermifflin.com' },
    { id: 6, name: 'Jim Halpert', email: 'jim@dundermifflin.com' },
    { id: 7, name: 'Ryan Howard', email: 'ryan@dundermifflin.com' },
    { id: 8, name: 'Kelly Kapoor', email: 'kelly@dundermifflin.com' }
  ];

  const [listings, setListings] = useState(initialListings);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  const navigate = useNavigate();

  const filteredListings = listings.filter(l =>
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pageCount = Math.ceil(filteredListings.length / itemsPerPage);
  const displayedListings = filteredListings.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageClick = ({ selected }) => setCurrentPage(selected);

  const handleEdit = (listing) => {
    console.log('Navigating to edit:', listing);
    navigate('/edit-listing', { state: { listing } });
  };

  const handleView = (listing) => {
    console.log('Navigating to view:', listing);
    navigate('/view-listing', { state: { listing } });
  };
  const handleDelete = (id) => {
  if (window.confirm("Are you sure you want to delete this listing?")) {
    setListings((prevListings) => prevListings.filter(l => l.id !== id));
  }
};

  return (
    <div className="container mt-4">
      <div className='pl-3 pr-3'>
        <h2 className="mb-4">Business Listings</h2>

        {/* Search Input */}
        <Form.Control
          type="text"
          placeholder="Search by name or email"
          className="mb-3"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(0); // reset to first page
          }}
        />

        {/* Table */}
        <Table bordered hover responsive>
          <thead className="">
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedListings.map((listing, index) => (
              <tr key={listing.id}>
                <td>{currentPage * itemsPerPage + index + 1}</td>
                <td>{listing.name}</td>
                <td>{listing.email}</td>
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
