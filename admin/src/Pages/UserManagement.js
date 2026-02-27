import React, { useEffect, useState } from 'react';
import { Table, Button, Form, Badge, Row, Col, Breadcrumb } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import { useNavigate } from 'react-router-dom';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";


const API_BASE = process.env.NODE_ENV === "production"
  ? "https://petshop-admin.onrender.com"
  : "http://localhost:5000";

const UserManagement = () => {
  // const initialListings = [
  //   { id: 1, name: 'John Doe', type: "Premium", email: 'john@example.com', roll: "Admin", status: "Active" },
  //   { id: 2, name: 'Jane Smith', type: "Free", email: 'jane@example.com', roll: "User", status: "Active" },
  //   { id: 3, name: 'Michael Scott', type: "Premium", email: 'michael@dundermifflin.com', roll:  "User", status: "Active" },
  //   { id: 4, name: 'Dwight Schrute', type: "Free", email: 'dwight@dundermifflin.com', roll:  "User", status: "Active" },
  //   { id: 5, name: 'Pam Beesly', type: "Premium", email: 'pam@dundermifflin.com', roll:  "User", status: "Inactive" },
  //   { id: 6, name: 'Jim Halpert', type: "Premium", email: 'jim@dundermifflin.com', roll:  "User", status: "Active" },
  //   { id: 7, name: 'Ryan Howard', type: "Premium", email: 'ryan@dundermifflin.com', roll:  "User", status: "Active" },
  //   { id: 8, name: 'Kelly Kapoor', type: "Free", email: 'kelly@dundermifflin.com', roll:  "User", status: "Active" }
  // ];

  // const [listings, setListings] = useState(initialListings);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const handleView = (listingId) => {
    navigate(`/user-details/${listingId}`);
  };

const handleDelete = async (id) => {
  if (!window.confirm("Are you sure to delete?")) return;

  try {
    await fetch(
      `${API_BASE}/api/auth/user/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    setListings(prev => prev.filter(u => u._id !== id));
  } catch (err) {
    console.error(err);
  }
};

useEffect(() => {
  const fetchUsers = async () => {
    try {
      const res = await fetch(
        `${API_BASE}/api/auth/user/all`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await res.json();
      if (data.success) {
        setListings(data.users);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  fetchUsers();
}, []);
const handleDownload = () => {
  if (!listings.length) return;

  const formattedData = listings.map((user, index) => ({
    SNo: index + 1,
    Name: user.name,
    Email: user.email,
    Type: user.isPremium ? "Premium" : "Free",
    CreatedAt: user.created_at
      ? new Date(user.created_at).toLocaleDateString()
      : "",
  }));

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const file = new Blob([excelBuffer], {
    type:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
  });

  saveAs(file, "users.xlsx");
};
const lastLoggedInUser = [...listings]
  .filter(u => u.lastLogin)
  .sort((a, b) => new Date(b.lastLogin) - new Date(a.lastLogin))[0];

  return (
    <div className="container mt-4">
      <div className='pl-3 pr-3'>
        <Row className='mb-3 justify-content-end align-items-center'>
        <Col>
          <h2 className='main-title mb-0'>User Management</h2>
        </Col>
        <Col xs={'auto'}>
          <Breadcrumb className='top-breadcrumb'>
            <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
            <Breadcrumb.Item active>User Management</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
      </Row>

        {/* Search Input */}
        {/* <Form.Control
            type="text"
            placeholder="Search by name or email"
            className="mb-3"
            value={searchTerm}
            onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(0); // reset to first page
            }}
        /> */}
        <Row className="mb-3">
          <Col>
            <Form.Control
              type="text"
              placeholder="Search by name or email"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(0);
              }}
            />
          </Col>

          <Col xs="auto">
            <Button variant="primary" onClick={handleDownload}>
              Download Excel
            </Button>
          </Col>
          <Col xs="auto">
            {lastLoggedInUser && (
              <Button
              variant="primary"
              onClick={() => handleView(lastLoggedInUser._id)}
              >
              View Last Login Details
            </Button>
          )}
        </Col>
        </Row>
        

        {/* Table */}
        <Table  bordered hover responsive>
            <thead className="">
            <tr>
                <th>S.No</th>
                <th>Name</th>
                <th>Email</th>
                <th>Type</th>
                <th>Last Login</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
              {loading ? (
                <p className="text-center">Loading users...</p>
              ) : (
            displayedListings.map((listing, index) => (
                <tr key={listing.id}>
                <td>{currentPage * itemsPerPage + index + 1}</td>
                <td>{listing.name}</td>
                <td>{listing.email}</td>
                <td>
                  {listing.isPremium ? (
                    <Badge bg="success">Premium</Badge>
                  ) : (
                    <Badge bg="secondary">Free</Badge>
                  )}
                </td>
                <td>
                  {listing.lastLogin
                    ? new Date(listing.lastLogin).toLocaleString()
                    : "Never"}
                </td>
                
                <td>
                    
                    <Button
                        variant="success"
                        size="sm"
                        className="me-2"
                        onClick={() => handleView(listing._id)}
                        >
                        View
                        </Button>
                        {/* <Button
                        variant="primary"
                        size="sm"
                        className="me-2"
                        onClick={() => handleEdit(listing)}
                        >
                        Edit
                        </Button> */}
                        <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(listing._id)}
                        >
                        Delete
                        </Button>
                </td>
                </tr>
            )))}
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

export default UserManagement;
