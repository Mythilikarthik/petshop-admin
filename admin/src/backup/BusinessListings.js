import React, { useState } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
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

  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({ id: null, name: '', email: '' });

  const [showConfirm, setShowConfirm] = useState({ visible: false, action: '', id: null });

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
    setEditData(listing);
    setShowEditModal(true);
  };

  const handleEditSave = () => {
    setListings(prev =>
      prev.map(item => (item.id === editData.id ? editData : item))
    );
    setShowEditModal(false);
  };

  const handleApproveReject = (id, action) => {
    setShowConfirm({ visible: true, action, id });
  };

  const confirmAction = () => {
    console.log(`${showConfirm.action.toUpperCase()}ED: ID ${showConfirm.id}`);
    setShowConfirm({ visible: false, action: '', id: null });
  };
  const navigate = useNavigate();
  
  const handleView = (listing) => {
  // logic to view the listing
  console.log('Viewing listing:', listing);
  navigate('/view-listing')
  // Possibly open a modal or navigate to a detail page
};

  return (
    <div>
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
      <Table striped bordered hover responsive>
        <thead className="table-dark">
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
                {/* <Button
                  variant="success"
                  size="sm"
                  className="me-2"
                  onClick={() => handleApproveReject(listing.id, 'approve')}
                >
                  Approve
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  className="me-2"
                  onClick={() => handleApproveReject(listing.id, 'reject')}
                >
                  Reject
                </Button> */}
                <Button
                  variant="primary"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEdit(listing)}
                >
                  Edit
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleView(listing)}
                >
                  View
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

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Listing</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control
              value={editData.email}
              onChange={(e) => setEditData({ ...editData, email: e.target.value })}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEditSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Confirm Dialog */}
      <Modal show={showConfirm.visible} onHide={() => setShowConfirm({ visible: false })}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm {showConfirm.action}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to {showConfirm.action} this listing?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirm({ visible: false })}>
            Cancel
          </Button>
          <Button
            variant={showConfirm.action === 'approve' ? 'success' : 'danger'}
            onClick={confirmAction}
          >
            Yes, {showConfirm.action}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BusinessListings;
