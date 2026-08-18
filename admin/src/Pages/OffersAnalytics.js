import React, { useEffect, useState } from "react";
import { Table, Button, Form, Row, Col, Breadcrumb, Badge, ButtonGroup, Modal } from "react-bootstrap";
import { FaFileExcel, FaChartBar, FaEye, FaBookmark, FaPhone, FaWhatsapp, FaCalendarCheck, FaShareAlt } from "react-icons/fa";
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
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  // Analytics Modal State
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [activeAnalyticsAd, setActiveAnalyticsAd] = useState(null);

  const navigate = useNavigate();

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
        setLoading(false); 
      }
    };
    fetchOffers();
  }, []);

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

  const prepareExportData = () => {
    return filteredAds.map((ad, idx) => ({
      "S.No": idx + 1,
      "Offer ID": ad._id || "",
      "Business Name": ad.business?.name || "-",
      "Neighborhood": ad.business?.neighborhood || "",
      "City": (typeof ad.business?.city === 'object' ? ad.business?.city?.city : ad.business?.city) || "",
      "Phone": ad.business?.phone || "-",
      "Category": ad.category || "",
      "Title": ad.title || "",
      "Description": ad.description || "",
      "Book Now URL": ad.bookNowUrl || "",
      "Start Date": ad.startDate ? new Date(ad.startDate).toLocaleDateString() : "-",
      "End Date": ad.endDate ? new Date(ad.endDate).toLocaleDateString() : "-",
      "Status": ad.show === 1 ? "Shown" : "Hidden",
      "Total Views": ad.analytics?.viewedByIPs?.length || 0,
      "Total Saves": ad.analytics?.saves || 0,
      "Call Clicks": ad.analytics?.clicks?.call?.length || 0,
      "WhatsApp Clicks": ad.analytics?.clicks?.whatsapp?.length || 0,
      "Book Now Clicks": ad.analytics?.clicks?.book_now?.length || 0,
      "Share Clicks": ad.analytics?.clicks?.share?.length || 0
    }));
  };

  const exportToExcel = () => {
    const data = prepareExportData();
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Offers");
    XLSX.writeFile(workbook, `offers_export_${Date.now()}.xlsx`);
  };

  const categoryOptions = Array.from(new Set(ads.map((ad) => ad.category).filter(Boolean)));
  const cityOptions = Array.from(new Set(ads.map((ad) => {
    return typeof ad.business?.city === 'object' ? ad.business?.city?.city : ad.business?.city;
  }).filter(Boolean)));

  const handleOpenAnalytics = (ad) => {
    setActiveAnalyticsAd(ad);
    setShowAnalyticsModal(true);
  };

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
          
          <Col md={4} className="d-flex justify-content-md-end justify-content-start gap-2">
            <ButtonGroup>
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
            <p className="mt-2">Loading...</p>
          </div>
        ) : (
          <Table bordered hover responsive className="align-middle">
            <thead>
              <tr>
                <th>#</th>
                <th>Business Name</th>
                <th>Category</th>
                <th>Title</th>
                <th>City / Area</th>
                {/* <th>Validity Range</th> */}
                <th>Analytics Summary</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedAds.length > 0 ? (
                displayedAds.map((ad, index) => (
                  <tr key={ad._id}>
                    <td>{currentPage * itemsPerPage + index + 1}</td>
                    <td>
                      <div>
                        <span className="">{ad.business?.name || "-"}</span>
                        {/* <div className="text-muted" style={{ fontSize: "11px" }}>Phone: {ad.business?.phone || "-"}</div> */}
                      </div>
                    </td>
                    <td><Badge bg="secondary">{ad.category}</Badge></td>
                    <td style={{ maxWidth: '200px' }} className="text-truncate">{ad.title}</td>
                    <td>{typeof ad.business?.city === 'object' ? ad.business?.city?.city : ad.business?.city}</td>
                    {/* <td style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>
                      {ad.startDate ? new Date(ad.startDate).toLocaleDateString() : "-"} to <br/>
                      {ad.endDate ? new Date(ad.endDate).toLocaleDateString() : "-"}
                    </td> */}
                    <td>
                      <div style={{ fontSize: "11px", lineHeight: "1.4", whiteSpace: "nowrap" }}>
                        <div><strong>Views:</strong> {ad.analytics?.viewedByIPs?.length || 0}</div>
                        <div><strong>Saves:</strong> {ad.analytics?.saves || 0}</div>
                        <div><strong>Total Clicks:</strong> {
                          (ad.analytics?.clicks?.call?.length || 0) +
                          (ad.analytics?.clicks?.whatsapp?.length || 0) +
                          (ad.analytics?.clicks?.book_now?.length || 0) +
                          (ad.analytics?.clicks?.share?.length || 0)
                        }</div>
                      </div>
                    </td>
                    <td>
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        onClick={() => handleOpenAnalytics(ad)}
                        title="View Detailed Analytics"
                      >
                        <FaChartBar className="me-1" /> Details
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-muted">
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

      {/* 🟩 DETAILED ANALYTICS MODAL */}
      <Modal show={showAnalyticsModal} onHide={() => setShowAnalyticsModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <FaChartBar className="me-2 text-primary" /> 
            Analytics: {activeAnalyticsAd?.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {activeAnalyticsAd && (
            <div>
              <div className="mb-3 p-3 bg-light rounded">
                <strong>Business:</strong> {activeAnalyticsAd.business?.name || "-"} |&nbsp;
                <strong>Category:</strong> {activeAnalyticsAd.category} |&nbsp;
                <strong>City:</strong> {typeof activeAnalyticsAd.business?.city === 'object' ? activeAnalyticsAd.business?.city?.city : activeAnalyticsAd.business?.city}
              </div>

              {/* Quick Stat Cards */}
              <Row className="text-center mb-4 g-2">
                <Col md={3}>
                  <div className="p-3 border rounded bg-white shadow-sm">
                    <FaEye className="text-info mb-1" size={20} />
                    <h5 className="mb-0">{activeAnalyticsAd.analytics?.viewedByIPs?.length || 0}</h5>
                    <small className="text-muted">Unique Views</small>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="p-3 border rounded bg-white shadow-sm">
                    <FaBookmark className="text-warning mb-1" size={20} />
                    <h5 className="mb-0">{activeAnalyticsAd.analytics?.saves || 0}</h5>
                    <small className="text-muted">Total Saves</small>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="p-3 border rounded bg-white shadow-sm">
                    <FaPhone className="text-success mb-1" size={20} />
                    <h5 className="mb-0">{activeAnalyticsAd.analytics?.clicks?.call?.length || 0}</h5>
                    <small className="text-muted">Call Clicks</small>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="p-3 border rounded bg-white shadow-sm">
                    <FaWhatsapp className="text-success mb-1" size={20} />
                    <h5 className="mb-0">{activeAnalyticsAd.analytics?.clicks?.whatsapp?.length || 0}</h5>
                    <small className="text-muted">WhatsApp Clicks</small>
                  </div>
                </Col>
              </Row>

              <Row className="text-center mb-4 g-2">
                <Col md={6}>
                  <div className="p-3 border rounded bg-white shadow-sm">
                    <FaCalendarCheck className="text-primary mb-1" size={20} />
                    <h5 className="mb-0">{activeAnalyticsAd.analytics?.clicks?.book_now?.length || 0}</h5>
                    <small className="text-muted">Book Now Clicks</small>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="p-3 border rounded bg-white shadow-sm">
                    <FaShareAlt className="text-secondary mb-1" size={20} />
                    <h5 className="mb-0">{activeAnalyticsAd.analytics?.clicks?.share?.length || 0}</h5>
                    <small className="text-muted">Share Clicks</small>
                  </div>
                </Col>
              </Row>

              {/* Detailed Activity Logs / Timestamps mapping schema sub-arrays */}
              <h6 className="mt-4 mb-2">Interaction History / Timestamp Logs</h6>
              <div style={{ maxHeight: "250px", overflowY: "auto" }} className="border rounded p-2 bg-white">
                <Table striped bordered size="sm" className="mb-0" style={{ fontSize: "12px" }}>
                  <thead>
                    <tr>
                      <th>Interaction Type</th>
                      <th>User ID Reference</th>
                      <th>Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeAnalyticsAd.analytics?.clicks?.call?.map((item, idx) => (
                      <tr key={`call-${idx}`}>
                        <td><Badge bg="success">Call Click</Badge></td>
                        <td>{item.userId || "N/A"}</td>
                        <td>{item.clickedAt ? new Date(item.clickedAt).toLocaleString() : "N/A"}</td>
                      </tr>
                    ))}
                    {activeAnalyticsAd.analytics?.clicks?.whatsapp?.map((item, idx) => (
                      <tr key={`wa-${idx}`}>
                        <td><Badge bg="success">WhatsApp Click</Badge></td>
                        <td>{item.userId || "N/A"}</td>
                        <td>{item.clickedAt ? new Date(item.clickedAt).toLocaleString() : "N/A"}</td>
                      </tr>
                    ))}
                    {activeAnalyticsAd.analytics?.clicks?.book_now?.map((item, idx) => (
                      <tr key={`book-${idx}`}>
                        <td><Badge bg="primary">Book Now Click</Badge></td>
                        <td>{item.userId || "N/A"}</td>
                        <td>{item.clickedAt ? new Date(item.clickedAt).toLocaleString() : "N/A"}</td>
                      </tr>
                    ))}
                    {activeAnalyticsAd.analytics?.clicks?.share?.map((item, idx) => (
                      <tr key={`share-${idx}`}>
                        <td><Badge bg="secondary">Share Click</Badge></td>
                        <td>{item.userId || "N/A"}</td>
                        <td>{item.clickedAt ? new Date(item.clickedAt).toLocaleString() : "N/A"}</td>
                      </tr>
                    ))}
                    {(!activeAnalyticsAd.analytics?.clicks?.call?.length &&
                      !activeAnalyticsAd.analytics?.clicks?.whatsapp?.length &&
                      !activeAnalyticsAd.analytics?.clicks?.book_now?.length &&
                      !activeAnalyticsAd.analytics?.clicks?.share?.length) && (
                      <tr>
                        <td colSpan="3" className="text-center text-muted py-3">
                          No detailed interaction timestamps recorded yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAnalyticsModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default OfferListings;