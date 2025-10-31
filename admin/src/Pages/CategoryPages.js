import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Container,
  Row,
  Col,
  Breadcrumb,
  Form,
} from "react-bootstrap";
import ReactPaginate from "react-paginate";
import Select from "react-select";
import { useNavigate } from "react-router-dom";

const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://petshop-admin.onrender.com"
    : "http://localhost:5000";

const itemsPerPage = 5;

const CategoryPages = () => {
  const [pages, setPages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();

  // ✅ Fetch category pages
  const fetchPages = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/categorypage`);
      const data = await res.json();
      if (data.success && Array.isArray(data.pages)) {
        setPages(data.pages);
      }
    } catch (err) {
      console.error("Error fetching category pages:", err);
    }
  };

  // ✅ Fetch category list for filter
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/pet-category`);
      const data = await res.json();
      if (data.success && Array.isArray(data.petCategories)) {
        setCategories(
          data.petCategories.map((cat) => ({
            label: cat.categoryName,
            value: cat._id,
          }))
        );
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  useEffect(() => {
    fetchPages();
    fetchCategories();
  }, []);

  // ✅ Delete handler
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this page?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/categorypage/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        alert("Page deleted successfully!");
        setPages((prev) => prev.filter((p) => p._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Filter logic
  const filteredPages = pages.filter((p) => {
    const term = search.toLowerCase();
    const matchesSearch =
      !term ||
      p.displayName?.toLowerCase().includes(term) ||
      p.metaTitle?.toLowerCase().includes(term) ||
      p.metaDescription?.toLowerCase().includes(term) ||
      p.category?.categoryName?.toLowerCase().includes(term);

    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.some((cat) => p.category?._id === cat);

    return matchesSearch && matchesCategory;
  });

  // ✅ Pagination
  const pageCount = Math.ceil(filteredPages.length / itemsPerPage);
  const displayedPages = filteredPages.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageClick = ({ selected }) => setCurrentPage(selected);

  return (
    <Container className="mt-4">
      {/* Header */}
      <Row className="mb-3 justify-content-between align-items-center">
        <Col>
          <h2 className="main-title mb-0">Category Pages</h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Dashboard</Breadcrumb.Item>
            <Breadcrumb.Item active>Category Pages</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        
      </Row>

      {/* Filters */}
      <Row className="mb-3">
        <Col md={5}>
          <Form.Control
            type="text"
            placeholder="Search by name, category, or meta..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(0);
            }}
          />
        </Col>
        <Col md={5}>
          <Select
            isMulti
            options={categories}
            value={categories.filter((cat) =>
              selectedCategories.includes(cat.value)
            )}
            onChange={(selected) => {
              setSelectedCategories(selected ? selected.map((s) => s.value) : []);
              setCurrentPage(0);
            }}
            placeholder="Filter by Category"
          />
        </Col>
        <Col md={2} className="d-flex justify-content-end">
          <Button variant="primary" onClick={() => navigate("/category-pages/add")}>
            + Add New
          </Button>
        </Col>
      </Row>

      {/* Table */}
      <Table bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Category</th>
            <th>Display Name</th>
            <th>Meta Title</th>
            <th>Meta Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {displayedPages.length > 0 ? (
            displayedPages.map((p, i) => (
              <tr key={p._id}>
                <td>{currentPage * itemsPerPage + i + 1}</td>
                <td>{p.category?.categoryName}</td>
                <td>{p.displayName}</td>
                <td>{p.metaTitle}</td>
                <td>{p.metaDescription?.slice(0, 60)}...</td>
                <td>
                  <Button
                    variant="primary"
                    size="sm"
                    className="me-2"
                    onClick={() =>
                      navigate("/category-pages/edit", { state: { id: p._id } })
                    }
                  >
                    Edit
                  </Button>
                  {/* <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(p._id)}
                  >
                    Delete
                  </Button> */}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center">
                No category pages found.
              </td>
            </tr>
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
    </Container>
  );
};

export default CategoryPages;
