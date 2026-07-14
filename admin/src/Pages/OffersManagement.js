import React, { useEffect, useState } from "react";
import { Table, Button, Form, Row, Col, Breadcrumb, Spinner, Badge, ButtonGroup } from "react-bootstrap";
import { FaVideo, FaFileCsv, FaFileExcel } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

const API_BASE =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_URL
    : "http://localhost:5000";

const OfferListings = () => {
  const [ads, setAds] = useState([]); // Kept variable name 'ads' to protect local state patterns
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  const navigate = useNavigate();

  // 🔹 Fetch offers from backend matching updated schema endpoints
  // 🔹 Fetch offers from backend matching updated schema endpoints
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/offers/admin/all`);
        const data = await res.json();
        if (data.success) {
          setAds(data.offers || []);
        }
      } catch (err) {
        console.error("Error fetching offers:", err);
      } finally {
        // 🟢 FIX HERE: Change 'loading(false)' to 'setLoading(false)'
        setLoading(false); 
      }
    };
    fetchOffers();
  }, []);

  // 🔹 Updated Filter logic to track structural nested object layers
  const filteredAds = ads.filter((ad) => {
    const cityName = (typeof ad.business?.city === 'object' ? ad.business?.city?.city : ad.business?.city) || "";
    const categoryName = ad.category || "";
    const titleText = ad.title || "";
    const businessName = ad.business?.name || "";

    const matchesSearch =
      cityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      titleText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      businessName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(ad.category);

    const currentCityValue = typeof ad.business?.city === 'object' ? ad.business?.city?.city : ad.business?.city;
    const matchesCity = !selectedCity || currentCityValue === selectedCity;

    return matchesSearch && matchesCategory && matchesCity;
  });

  const pageCount = Math.ceil(filteredAds.length / itemsPerPage);
  const displayedAds = filteredAds.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageClick = ({ selected }) => setCurrentPage(selected);

  // 🔹 Delete Offer Item Route dispatch method
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this Offer?")) return;

    try {
      const res = await fetch(`${API_BASE}/api/offers/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        alert("Offer deleted successfully!");
        setAds((prev) => prev.filter((ad) => ad._id !== id));
      } else {
        alert(data.message || "Failed to delete Offer");
      }
    } catch (err) {
      console.error("Error deleting offer:", err);
    }
  };

  // 🟩 NEW: Export Data Normalization Logic
  const prepareExportData = () => {
    return filteredAds.map((ad, idx) => ({
      "S.No": idx + 1,
      "Offer ID": ad._id || "",
      "Business Name": ad.business?.name || "-",
      "Category": ad.category || "",
      "Title": ad.title || "",
      "Description": ad.description || "",
      "Neighborhood": ad.business?.neighborhood || "",
      "City": (typeof ad.business?.city === 'object' ? ad.business?.city?.city : ad.business?.city) || "",
      "Start Date": ad.startDate ? new Date(ad.startDate).toLocaleDateString() : "-",
      "End Date": ad.endDate ? new Date(ad.endDate).toLocaleDateString() : "-",
      "Status": ad.show === 1 ? "Shown" : "Hidden",
      "Media URL": ad.media && ad.media[0] ? ad.media[0].url : "-",
      "Media Type": ad.media && ad.media[0] ? ad.media[0].type : "-",
      "Primary Actions": ad.primaryActions ? ad.primaryActions.join(", ") : "",
      "Total Saves": ad.analytics?.saves || 0,
      "Call Clicks": ad.analytics?.clicks?.call?.length || 0,
      "WhatsApp Clicks": ad.analytics?.clicks?.whatsapp?.length || 0,
      "Book Now Clicks": ad.analytics?.clicks?.book_now?.length || 0,
      "Share Clicks": ad.analytics?.clicks?.share?.length || 0
    }));
  };

  // 🟩 NEW: Export to CSV
  const exportToCSV = () => {
    const data = prepareExportData();
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `offers_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 🟩 NEW: Export to Excel
  const exportToExcel = () => {
    const data = prepareExportData();
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Offers");
    XLSX.writeFile(workbook, `offers_export_${Date.now()}.xlsx`);
  };

  // 🔹 Build dynamic filtering option arrays directly from live schema models
  const categoryOptions = Array.from(new Set(ads.map((ad) => ad.category).filter(Boolean)));
  const cityOptions = Array.from(new Set(ads.map((ad) => {
    return typeof ad.business?.city === 'object' ? ad.business?.city?.city : ad.business?.city;
  }).filter(Boolean)));

  return (
    <div className="container mt-4">
      <div className="pl-3 pr-3">
        {/* Header Block UI Elements */}
        <Row className="mb-3 justify-content-between align-items-center">
          <Col>
            <h2 className="main-title mb-0">Offer Listings</h2>
          </Col>
          <Col xs="auto">
            <Breadcrumb className="top-breadcrumb">
              <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
              <Breadcrumb.Item active>Offers</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>

        {/* Multi-tier Filter Rows */}
        <Row className="align-items-center mb-3 g-2">
          <Col md={3}>
            <Form.Control
              type="text"
              placeholder="Search title, category, shop..."
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

          <Col md={2}>
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
          
          {/* 🟩 UPDATED: Added Export Button Layout Groups alongside Create Button */}
          <Col md={4} className="d-flex justify-content-md-end justify-content-start gap-2">
            <ButtonGroup>
              {/* <Button variant="outline-success" onClick={exportToCSV} title="Export CSV">
                <FaFileCsv size={16} className="me-1" /> CSV
              </Button> */}
              <Button variant="outline-success" onClick={exportToExcel} title="Export Excel">
                <FaFileExcel size={16} className="me-1" /> Export [ As Excel ]
              </Button>
            </ButtonGroup>
            <Button variant="primary" onClick={() => navigate('/add-edit-offers')}>+ Add New</Button>
          </Col>
        </Row>

        {/* Data Presentation Table Matrix */}
        {loading ? (
          <div className="text-center py-5">
            {/* <Spinner animation="border" /> */}
            <p className="mt-2">Loading...</p>
          </div>
        ) : (
          <Table bordered hover responsive className="align-middle">
            <thead>
              <tr>
                <th>#</th>
                <th>Business Name</th>
                <th>Media Preview</th>
                <th>Category</th>
                <th>Title</th>
                <th>City / Area</th>
                <th>Validity Range</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedAds.length > 0 ? (
                displayedAds.map((ad, index) => (
                  <tr key={ad._id}>
                    <td>{currentPage * itemsPerPage + index + 1}</td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <span className="">{ad.business?.name || "-"}</span>
                      </div>
                    </td>
                    <td>
                      {ad.media && ad.media[0] ? (
                        ad.media[0].type === 'video' ? (
                          <Badge bg="primary" className="p-2 text-uppercase" style={{ fontSize: '10px' }}><FaVideo /> 12s Video</Badge>
                        ) : (
                          <img
                            src={ad.media[0].url?.startsWith('http') ? ad.media[0].url : `${API_BASE}/${ad.media[0].url}`}
                            alt="Preview"
                            style={{ width: "60px", height: "40px", objectFit: "cover", borderRadius: "4px" }}
                          />
                        )
                      ) : (
                        "-"
                      )}
                    </td>
                    <td><Badge bg="secondary">{ad.category}</Badge></td>
                    <td style={{ maxWidth: '200px' }} className="text-truncate">{ad.title}</td>
                    <td>{ad.business?.neighborhood}, {typeof ad.business?.city === 'object' ? ad.business?.city?.city : ad.business?.city}</td>
                    <td style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>
                      {ad.startDate ? new Date(ad.startDate).toLocaleDateString() : "-"} to <br/>
                      {ad.endDate ? new Date(ad.endDate).toLocaleDateString() : "-"}
                    </td>
                    <td>
                      {ad.show === 1 ? (
                        <Badge bg="success">Shown</Badge>
                      ) : (
                        <Badge bg="danger">Hidden</Badge>
                      )}
                    </td>
                    <td> 
                      <div className="gap-2">     
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => navigate("/add-edit-offers", { state: { id: ad._id } })}
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
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center py-4 text-muted">
                    No active feeds found matching the specified parameters.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}

        {/* Client-Side Block List Pagination Navigation Controls */}
        {pageCount > 1 && (
          <ReactPaginate
            pageCount={pageCount}
            onPageChange={handlePageClick}
            containerClassName="pagination justify-content-center mt-4"
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

export default OfferListings;