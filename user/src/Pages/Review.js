import React, { useState, useEffect } from "react";
import {
  Table,
  Row,
  Col,
  Breadcrumb,
  Form,
  Badge
} from "react-bootstrap";
import ReactPaginate from "react-paginate";

const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://petshop-admin.onrender.com"
    : "http://localhost:5000";

const itemsPerPage = 8;

const Review = () => {
  const [reviews, setReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // all by default
  const [currentPage, setCurrentPage] = useState(0);

  /** Fetch reviews for user listings */
  const fetchReviews = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE}/api/reviews/user/user-listings`, {
      method: "GET",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
    });
    const data = await res.json();
    console.log("Fetched reviews:", data);

    if (data.reviews && Array.isArray(data.reviews)) {
      // Only keep approved reviews
      const approvedReviews = data.reviews.filter(r => r.status === "approved");
      setReviews(approvedReviews);
    } else {
      setReviews([]);
    }
  } catch (err) {
    console.error("Error fetching reviews:", err);
  }
};

  useEffect(() => {
    fetchReviews();
  }, []);

  /** Filtering by search term and status */
  const filteredReviews = reviews.filter((r) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      !term ||
      (r.userName || "").toLowerCase().includes(term) ||
      (r.userEmail || "").toLowerCase().includes(term) ||
      (r.listingId?.shopName || "").toLowerCase().includes(term);

    const matchesStatus =
      !statusFilter || r.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const pageCount = Math.ceil(filteredReviews.length / itemsPerPage);
  const displayedReviews = filteredReviews.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageClick = ({ selected }) => setCurrentPage(selected);

  return (
    <div className="container mt-4">
      <div className="pl-3 pr-3">
        <Row className="mb-3 justify-content-between align-items-center">
          <Col>
            <h2 className="main-title mb-0">Reviews</h2>
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
          {/* <Col md={3}>
            <Form.Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </Form.Select>
          </Col> */}
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
            </tr>
          </thead>
          <tbody>
            {displayedReviews.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center">
                  No reviews found.
                </td>
              </tr>
            ) : (
              displayedReviews.map((r, index) => (
                <tr key={r._id}>
                  <td>{currentPage * itemsPerPage + index + 1}</td>
                  <td>{r.listingId?.shopName || "—"}</td>
                  <td>{r.userId?.name || r.userName || "Guest"}</td>
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

export default Review;
