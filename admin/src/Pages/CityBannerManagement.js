import React, { useState, useEffect, useRef } from "react";
import { Table, Button, Form, Row, Col, Breadcrumb } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";

const API_BASE =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_URL
    : "http://localhost:5000";

const itemsPerPage = 5;

const CityBannerListings = () => {
  const [listings, setListings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);

  const navigate = useNavigate();

  /* ================= FETCH LISTINGS ================= */
  const fetchListings = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/city-banner`);
      const data = await res.json();

      if (data.success && Array.isArray(data.listings)) {
        setListings(data.listings); // ✅ keep full object
      }
    } catch (err) {
      console.error("Error fetching listings:", err);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  /* ================= FILTER + PAGINATION ================= */
  const filteredListings = listings.filter((l) => {
    const term = searchTerm.toLowerCase();
    return (
      !term ||
      (l.city?.city || "").toLowerCase().includes(term)
    );
  });

  const pageCount = Math.ceil(filteredListings.length / itemsPerPage);
  const displayedListings = filteredListings.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  /* ================= ACTIONS ================= */
  const handleEdit = (cityId) => {
    navigate("/add-city-banner", {
      state: { cityId },
    });
  };

  const handleDelete = async (bannerId) => {
    if (!window.confirm("Are you sure you want to delete this city banner?"))
      return;

    try {
      const res = await fetch(
        `${API_BASE}/api/city-banner/delete/${bannerId}`,
        { method: "DELETE" }
      );
      const data = await res.json();

      if (data.success) {
        setListings((prev) =>
          prev.filter((item) => item._id !== bannerId)
        );
      } else {
        alert("Failed to delete banner");
      }
    } catch (err) {
      console.error(err.message);
      alert("Error deleting banner");
    }
  };

  /* ================= RENDER ================= */
  return (
    <div className="container mt-4">
      <div className="pl-3 pr-3">
        <Row className="mb-3 align-items-center">
          <Col>
            <h2 className="main-title mb-0">City Banners Listing</h2>
            <Breadcrumb className="top-breadcrumb">
              <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
              <Breadcrumb.Item active>City Banners</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>

        {/* Search + Add */}
        <Row className="mb-3">
          <Col md={8} className="p-0">
          <div style={{ "position" : "relative"}}>
              <Form.Control
              type="text"
              placeholder="Search by city name"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(0);
              }}
            />


              {searchTerm && (
              <span
                onClick={() => {
                  setSearchTerm("");
                  setCurrentPage(0);
                }}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  fontSize: "18px",
                  color: "#888"
                }}
              >
                ✕
              </span>
            )}
            </div>
            
          </Col>
          <Col md={4} className="d-flex justify-content-end p-0">
            <Button
              variant="primary"
              onClick={() => navigate("/add-city-banner")}
            >
              + Add New
            </Button>
          </Col>
        </Row>

        {/* Table */}
        <Table bordered hover responsive>
          <thead>
            <tr>
              <th>S.No</th>
              <th>City</th>
              <th>Images</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedListings.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center">
                  No banners found
                </td>
              </tr>
            ) : (
              displayedListings.map((listing, index) => (
                <tr key={listing._id}>
                  <td>{currentPage * itemsPerPage + index + 1}</td>
                  <td>{listing.city?.city || "-"}</td>
                  {/* <td>
                    {listing.banner && (
                      <img
                        src={`${API_BASE}/${listing.banner}`}
                        alt="banner"
                        style={{
                          width: "120px",
                          height: "40px",
                          objectFit: "cover",
                        }}
                      />
                    )}
                  </td> */}
                  {/* <td>
  {listing.images?.length > 0 ? (
    <div className="d-flex align-items-center">

      <img
        src={`${API_BASE}/${listing.images[0].image}`}
        alt={listing.images[0].alt}
        style={{
          width: 120,
          height: 40,
          objectFit: "cover",
          borderRadius: 4,
        }}
      />

      <span className="badge bg-success"
        style={{
          marginLeft: 10,
          fontWeight: 600,
        }}
      >
        {listing.images.length} Image
        {listing.images.length > 1 ? "s" : ""}
      </span>

    </div>
  ) : (
    "-"
  )}
</td> */}
<td>
  <div
    style={{
      display: "flex",
      gap: 5,
      flexWrap: "wrap",
    }}
  >
    {listing.images?.map((img) => (
      <img
        key={img._id}
        src={`${API_BASE}/${img.image}`}
        alt={img.alt}
        style={{
          width: 55,
          height: 40,
          objectFit: "cover",
          borderRadius: 4,
          border: "1px solid #ddd",
        }}
      />
    ))}
  </div>
</td>
                  <td>
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleEdit(listing.city?._id)}
                    >
                      Edit
                    </Button>{" "}
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(listing._id)}
                    >
                      Delete
                    </Button>
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

export default CityBannerListings;
