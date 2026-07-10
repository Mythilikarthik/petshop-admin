import React, { useEffect, useState } from "react";
import { Table, Button, Form, Row, Col, Breadcrumb, Spinner, Badge } from "react-bootstrap";
import { FaVideo } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

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

  // 🔹 Updated Filter logic to track structural nested object layers
  // 🔹 Updated Filter logic to safely parse relational fields
const filteredAds = ads.filter((ad) => {
  // 1. Extract the name string out of the nested city reference model object
  const cityName = (typeof ad.business?.city === 'object' ? ad.business?.city?.city : ad.business?.city) || "";
  const categoryName = ad.category || "";
  const titleText = ad.title || "";
  const businessName = ad.business?.name || "";

  // 2. Perform case-insensitive search parameter checks safely
  const matchesSearch =
    cityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    titleText.toLowerCase().includes(searchTerm.toLowerCase()) ||
    businessName.toLowerCase().includes(searchTerm.toLowerCase());

  const matchesCategory =
    selectedCategories.length === 0 ||
    selectedCategories.includes(ad.category);

  // 3. Match selected dropdown value criteria matching strings or objects keys context
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

  // 🔹 Build dynamic filtering option arrays directly from live schema models
  const categoryOptions = Array.from(new Set(ads.map((ad) => ad.category).filter(Boolean)));
  const cityOptions = Array.from(new Set(ads.map((ad) => ad.business?.city).filter(Boolean)));

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
          
          <Col md={3} className="d-flex justify-content-md-end justify-content-start">
            <Button variant="primary" onClick={() => navigate('/add-edit-offers')}>+ Add New</Button>
          </Col>
        </Row>

        {/* Data Presentation Table Matrix */}
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" />
            <p className="mt-2">Loading System Feeds...</p>
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
                {/* <th>Buttons</th> */}
                <th>Status</th> {/* 👈 Add this column */}
                {/* <th>Views / Saves</th> */}
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
                        {/* <img 
                          src={ad.business?.logo?.startsWith('http') ? ad.business.logo : `${API_BASE}/${ad.business?.logo}`} 
                          alt="Logo" 
                          style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }}
                        /> */}
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
                    <td>{ad.business?.neighborhood}, {ad.business?.city}</td>
                    <td style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>
                      {ad.startDate ? new Date(ad.startDate).toLocaleDateString() : "-"} to <br/>
                      {ad.endDate ? new Date(ad.endDate).toLocaleDateString() : "-"}
                    </td>
                    {/* <td>
                      <div className="d-flex gap-1 flex-wrap">
                        {ad.primaryActions?.map(act => (
                          <Badge key={act} bg="info" className="text-dark">{act}</Badge>
                        ))}
                      </div>
                    </td> */}
                    <td>
  {ad.show === 1 ? (
    <Badge bg="success">Shown</Badge>
  ) : (
    <Badge bg="danger">Hidden</Badge>
  )}
</td>
                    {/* <td style={{ fontSize: '13px' }}>
                       {ad.analytics?.views || 0} Views <br/> {ad.analytics?.saves || 0} Saves
                    </td> */}
                    <td> 
                      <div className="d-flex gap-2">                     
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
                  <td colSpan="10" className="text-center py-4 text-muted">
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