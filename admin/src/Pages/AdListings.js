import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Form,
  Row,
  Col,
  Breadcrumb,
  Spinner,
} from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://petshop-admin.onrender.com"
    : "http://localhost:5000";

const AdListings = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  const navigate = useNavigate();

  // 🔹 Fetch ads from backend
  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/ads`);
        const data = await res.json();
        if (data.success) {
          setAds(data.ads || []);
          console.log("ADs" + ads);
        }
      } catch (err) {
        console.error("Error fetching ads:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAds();
  }, []);

  // 🔹 Filter logic
  const filteredAds = ads.filter((ad) => {
    const cityName = ad.city?.city?.toLowerCase() || "";
    const categoryName = ad.category?.categoryName?.toLowerCase() || "";
    const matchesSearch =
      cityName.includes(searchTerm.toLowerCase()) ||
      categoryName.includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(ad.category?.categoryName);

    const matchesCity = !selectedCity || ad.city?.city === selectedCity;

    return matchesSearch && matchesCategory && matchesCity;
  });

  const pageCount = Math.ceil(filteredAds.length / itemsPerPage);
  const displayedAds = filteredAds.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageClick = ({ selected }) => setCurrentPage(selected);

  // 🔹 Delete Ad
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this Ad?")) return;

    try {
      const res = await fetch(`${API_BASE}/api/ads/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        alert("Ad deleted successfully!");
        setAds((prev) => prev.filter((ad) => ad._id !== id));
      } else {
        alert(data.message || "Failed to delete Ad");
      }
    } catch (err) {
      console.error("Error deleting Ad:", err);
    }
  };

  


  // 🔹 Extract unique categories & cities for filters
  const categoryOptions = Array.from(
    new Set(ads.map((ad) => ad.category?.categoryName).filter(Boolean))
  );
  const cityOptions = Array.from(
    new Set(ads.map((ad) => ad.city?.cityName).filter(Boolean))
  );

  return (
    <div className="container mt-4">
      <div className="pl-3 pr-3">
        {/* Header */}
        <Row className="mb-3 justify-content-between align-items-center">
          <Col>
            <h2 className="main-title mb-0">Ad Listing</h2>
          </Col>
          <Col xs="auto">
            <Breadcrumb className="top-breadcrumb">
              <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
              <Breadcrumb.Item active>Ad Listing</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>

        {/* Filters */}
        <Row className="align-items-center mb-3">
          <Col md={3}>
            <Form.Control
              type="text"
              placeholder="Search by city or category"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(0);
              }}
            />
          </Col>

          <Col md={3}>
            <Select
              isMulti
              options={categoryOptions.map((c) => ({ value: c, label: c }))}
              value={selectedCategories.map((c) => ({ value: c, label: c }))}
              onChange={(selected) =>
                setSelectedCategories(selected ? selected.map((s) => s.value) : [])
              }
              placeholder="Filter by Category"
            />
          </Col>

          <Col md={3}>
            <Form.Select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              <option value="">All Cities</option>
              {cityOptions.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={3} className="d-flex justify-content-end">
              <Button variant="primary" onClick={() => navigate('/ad-management')}>+ Add New</Button>
          </Col>
        </Row>

        {/* Table */}
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" />
            <p>Loading Ads...</p>
          </div>
        ) : (
          <Table bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Image</th>
                <th>City</th>
                <th>Category</th>
                <th>Position</th>
                <th>URL</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {console.log(displayedAds)}
              {displayedAds.length > 0 ? (
                displayedAds.map((ad, index) => (
                  <tr key={ad._id}>
                    <td>{currentPage * itemsPerPage + index + 1}</td>
                    <td>
                      <img
                        src={ad.image}
                        alt="Ad"
                        style={{
                          width: "70px",
                          height: "50px",
                          objectFit: "cover",
                          borderRadius: "4px",
                        }}
                      />
                    </td>
                    <td>{ad.city?.city || "-"}</td>
                    <td>{ad.category?.categoryName || "-"}</td>
                    <td>{ad.position}</td>
                    <td>
                      {ad.url ? (
                        <a href={ad.url} target="_blank" rel="noopener noreferrer">
                          Visit
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>                      
                      <Button
                        variant="primary"
                        size="sm"
                        className="me-2"
                        onClick={() => navigate("/ad-management/edit", { state: { id: ad._id } })}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(ad._id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    No ads found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}

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

export default AdListings;
