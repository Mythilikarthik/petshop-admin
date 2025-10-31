import React, { useEffect, useState } from "react";
import {
  Button,
  Table,
  Row,
  Col,
  Form,
  Breadcrumb,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";

const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://petshop-admin.onrender.com"
    : "http://localhost:5000";

const itemsPerPage = 8; // number of items per page

const CustomPages = () => {
  const [pages, setPages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();

  /** ✅ Fetch all pages from backend */
  const fetchPages = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/custom-page`);
      const data = await res.json();
      if(data.success) {
        if (Array.isArray(data.pages)) setPages(data.pages);
        else console.warn("Unexpected response:", data);
      }
    } catch (err) {
      console.error("Error fetching pages:", err);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  /** ✅ Filter pages based on search term */
  const filteredPages = pages.filter((p) => {
    const term = searchTerm.toLowerCase();
    return (
      p.page.toLowerCase().includes(term) ||
      (p.category && p.category.toLowerCase().includes(term)) ||
      (p.city && p.city.toLowerCase().includes(term)) ||
      (p.pageTitle && p.pageTitle.toLowerCase().includes(term))
    );
  });

  /** ✅ Pagination logic */
  const pageCount = Math.ceil(filteredPages.length / itemsPerPage);
  const displayedPages = filteredPages.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageClick = ({ selected }) => setCurrentPage(selected);

  /** ✅ Delete page */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this page?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/custom-page/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        alert("Page deleted successfully");
        fetchPages();
      } else {
        alert(data.message || "Failed to delete page");
      }
    } catch (err) {
      console.error("Error deleting page:", err);
    }
  };

  return (
    <div className="container mt-4">
      <div className="pl-3 pr-3">
        {/* Header */}
        <Row className="mb-3 justify-content-between align-items-center">
          <Col>
            <h2 className="main-title mb-0">Custom Pages</h2>
          </Col>
          <Col xs={"auto"}>
            <Breadcrumb className="top-breadcrumb">
              <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
              <Breadcrumb.Item active>Custom Pages</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>

        {/* Search and Create */}
        <Row className="mb-3">
          <Col md={8}>
            <Form.Control
              type="text"
              placeholder="Search by Page, Category, City, or Title"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(0);
              }}
            />
          </Col>
          <Col md={4} className="text-end">
            <Button
              variant="primary"
              onClick={() => navigate("/custom-page/new")}
            >
              + Create New Page
            </Button>
          </Col>
        </Row>

        {/* Table */}
        <Table bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Page</th>
              <th>Category</th>
              <th>City</th>
              <th>Title</th>
              <th>Meta Keywords</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedPages.length > 0 ? (
              displayedPages.map((p, i) => (
                <tr key={p._id}>
                  <td>{currentPage * itemsPerPage + i + 1}</td>
                  <td>{p.page}</td>
                  <td>{p.category || "—"}</td>
                  <td>{p.city || "—"}</td>
                  <td>{p.pageTitle}</td>
                  <td>{p.metaKeyword || "—"}</td>
                  <td>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => navigate(`/custom-page/edit/`, {
                        state: {id : p._id}
                      })}
                    >
                      Edit
                    </Button>{" "}
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(p._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  No pages found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        {/* Pagination */}
        {pageCount > 1 && (
          <ReactPaginate
            previousLabel="«"
            nextLabel="»"
            breakLabel="..."
            pageCount={pageCount}
            marginPagesDisplayed={1}
            pageRangeDisplayed={2}
            onPageChange={handlePageClick}
            containerClassName="pagination justify-content-center"
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item"
            previousLinkClassName="page-link"
            nextClassName="page-item"
            nextLinkClassName="page-link"
            activeClassName="active"
          />
        )}
      </div>
    </div>
  );
};

export default CustomPages;
