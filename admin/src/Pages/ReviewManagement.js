import React, { useState, useEffect } from "react";
import { Table, Button, Form, Row, Col, Breadcrumb, ButtonGroup, ToggleButton, Badge } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";

const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://petshop-admin.onrender.com"
    : "http://localhost:5000";

const itemsPerPage = 8;

const ReviewManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();

  /** Fetch reviews from server */
  const fetchReviews = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/reviews`, {

        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setReviews(data);
      } else if (data.reviews) {
        setReviews(data.reviews);
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  /** Filtering */
  const filteredReviews = reviews.filter((r) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      !term ||
      (r.userName || "").toLowerCase().includes(term) ||
      (r.userEmail || "").toLowerCase().includes(term) ||
      (r.listingId?.shopName || "").toLowerCase().includes(term);
    const matchesStatus = !statusFilter || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pageCount = Math.ceil(filteredReviews.length / itemsPerPage);
  const displayedReviews = filteredReviews.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageClick = ({ selected }) => setCurrentPage(selected);

  /** Approve or Reject Review */
  const handleStatusChange = async (id, newStatus) => {
    if (!window.confirm(`Are you sure to mark this review as ${newStatus}?`)) return;
    try {
      const res = await fetch(`${API_BASE}/api/reviews/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, adminId: localStorage.getItem("userId") }), // replace with real admin id if available
      });
      const data = await res.json();
      if (res.ok) {
        setReviews((prev) =>
          prev.map((r) => (r._id === id ? { ...r, status: newStatus } : r))
        );
      } else {
        alert(data.message || "Failed to update status");
      }
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Server error while updating review status");
    }
  };

  return (
    <div className="container mt-4">
      <div className="pl-3 pr-3">
        <Row className="mb-3 justify-content-between align-items-center">
          <Col>
            <h2 className="main-title mb-0">Review Management</h2>
          </Col>
          <Col xs={"auto"}>
            <Breadcrumb className="top-breadcrumb">
              <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
              <Breadcrumb.Item active>Reviews</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>

        {/* Filters */}
        <Row className="mb-3">
          <Col md={4}>
            <Form.Control
              type="text"
              placeholder="Search by reviewer or listing"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(0);
              }}
            />
          </Col>
          <Col md={5}>
            <ButtonGroup className="w-100">
              <ToggleButton
                id="pending"
                type="radio"
                variant="outline-warning"
                checked={statusFilter === "pending"}
                onChange={() => {
                  setStatusFilter("pending");
                  setCurrentPage(0);
                }}
              >
                Pending
              </ToggleButton>
              <ToggleButton
                id="approved"
                type="radio"
                variant="outline-success"
                checked={statusFilter === "approved"}
                onChange={() => {
                  setStatusFilter("approved");
                  setCurrentPage(0);
                }}
              >
                Approved
              </ToggleButton>
              <ToggleButton
                id="rejected"
                type="radio"
                variant="outline-danger"
                checked={statusFilter === "rejected"}
                onChange={() => {
                  setStatusFilter("rejected");
                  setCurrentPage(0);
                }}
              >
                Rejected
              </ToggleButton>
              <ToggleButton
                id="all"
                type="radio"
                variant="outline-secondary"
                checked={statusFilter === ""}
                onChange={() => {
                  setStatusFilter("");
                  setCurrentPage(0);
                }}
              >
                All
              </ToggleButton>
            </ButtonGroup>
          </Col>
        </Row>

        {/* Reviews Table */}
        <Table bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Listing</th>
              <th>Reviewer</th>
              <th>Email</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedReviews.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center">
                  No reviews found.
                </td>
              </tr>
            ) : (
              displayedReviews.map((r, index) => (
                <tr key={r._id}>
                  <td>{currentPage * itemsPerPage + index + 1}</td>
                  <td>{r.listingId?.shopName || "—"}</td>
                  <td>{r.userId?.name || r.guestName || "Guest"}</td>
                  <td>{r.userEmail || "—"}</td>
                  <td>
                    <Badge bg="info">{r.rating}★</Badge>
                  </td>
                  <td style={{ maxWidth: "250px" }}>{r.comment}</td>
                  <td>
                    <Badge
                      bg={
                        r.status === "approved"
                          ? "success"
                          : r.status === "rejected"
                          ? "danger"
                          : "warning"
                      }
                    >
                      {r.status}
                    </Badge>
                  </td>
                  <td>{new Date(r.created_at).toLocaleDateString()}</td>
                  <td>
                    {r.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() => handleStatusChange(r._id, "approved")}
                        >
                          Approve
                        </Button>{" "}
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleStatusChange(r._id, "rejected")}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                    {r.status !== "pending" && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => navigate(`/reviews/${r._id}`)}
                      >
                        View
                      </Button>
                    )}
                  </td>
                </tr>
              ))
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

export default ReviewManagement;
