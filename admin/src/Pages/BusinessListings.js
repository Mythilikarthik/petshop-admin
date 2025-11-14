import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, Form, Row, Col, Breadcrumb, ButtonGroup, ToggleButton } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import { Link, useNavigate } from 'react-router-dom';
import Select from "react-select";
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { FaUpload } from "react-icons/fa";

const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://petshop-admin.onrender.com"
    : "http://localhost:5000";

const itemsPerPage = 5;

const BusinessListings = () => {
  const [listings, setListings] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [typeList, setTypeList] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [uploadError, setUploadError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState("approved");
  const [imageFiles, setImageFiles] = useState([]);
  const listFileInputRef = useRef(null);
  const navigate = useNavigate();

  /** Fetch listings from server */
  const fetchListings = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/listing`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.listings)) {
        const normalized = data.listings.map(item => ({
          _id: item._id || item.id || `srv-${Math.random().toString(36).slice(2,9)}`,
          shopName: item.shopName || item.shopname || item.name || '',
          email: item.email || '',
          phone: item.phone || '',
          categories: item.categories?.map(c => c.categoryName) || [],
          petCategories: item.petCategories?.map(p => p.categoryName) || [],
          city: item.city || null,
          status: item.status || 'pending',
          created_by_type : item.created_by_type,
        }));
        setListings(normalized);
      }
    } catch (err) {
      console.error("Error fetching listings:", err);
    }
  };

  /** Fetch categories from server */
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/category/show`);
      const data = await res.json();
      if (data.success && Array.isArray(data.categories)) {
        setCategoryList(data.categories.map(c => c.categoryName));
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };
  const fetchTypes = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/pet-category/show`);
      const data = await res.json();
      if (data.success && Array.isArray(data.petCategories)) {
        setTypeList(data.petCategories.map(t => t.categoryName));
      }
    } catch (err) {
      console.error("Error fetching types:", err);
    }
  };

  useEffect(() => {
    fetchListings();
    fetchCategories();
    fetchTypes();
  }, []);

  /** Pagination & filtering */
  const filteredListings = listings.filter(l => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = !term || (l.shopName || '').toLowerCase().includes(term) || (l.city?.city || '').toLowerCase().includes(term);
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.some(cat => l.categories?.includes(cat));
    const matchesType = selectedTypes.length === 0 || selectedTypes.some(type => l.petCategories?.includes(type));
    const matchesStatus = l.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus && matchesType;
  });

  const pageCount = Math.ceil(filteredListings.length / itemsPerPage);
  const displayedListings = filteredListings.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);
  const handlePageClick = ({ selected }) => setCurrentPage(selected);

  /** CRUD handlers */
  const handleEdit = (listing) => navigate('/edit-listing', { state: { id: listing._id } });
  const handleView = (listing) => navigate('/view-listing', { state: { id: listing._id } });

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/listing/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) setListings(prev => prev.filter(l => l._id !== id));
      else alert("Failed to delete listing");
    } catch (err) {
      console.error(err);
      alert("Error deleting listing");
    }
  };

  const handleToggleStatus = async (id) => {
    const listing = listings.find(l => l._id === id);
    if (!listing) return;
    const newStatus = listing.status === "approved" ? "pending" : "approved";

    try {
      const res = await fetch(`${API_BASE}/api/listing/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setListings(prev =>
          prev.map(l => l._id === id ? { ...l, status: newStatus } : l)
        );
      }
    } catch (err) {
      console.error(err);
      alert("Error updating status");
    }
  };

  /** File import handler */
  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const name = (file.name || '').toLowerCase();

    if (name.endsWith('.csv')) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => addListingsFromRows(results.data),
        error: (err) => setUploadError('CSV parse error: ' + err.message),
      });
    } else if (name.endsWith('.xlsx') || name.endsWith('.xls')) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: '' });
        addListingsFromRows(rows);
      };
      reader.onerror = () => setUploadError('Failed reading Excel file');
      reader.readAsArrayBuffer(file);
    } else {
      setUploadError('Unsupported file type. Use .csv, .xlsx or .xls');
    }
    listFileInputRef.current.value = '';
    e.target.value = '';
  };

  /** Bulk import logic */
  const addListingsFromRows = async (rows = []) => {
  const timestamp = Date.now();

  // Fetch mapping data for categories, petcategories, cities
  const [catRes, petCatRes, cityRes] = await Promise.all([
    fetch(`${API_BASE}/api/category/show`),
    fetch(`${API_BASE}/api/pet-category/show`),
    fetch(`${API_BASE}/api/city/show`)
  ]);

  const [catData, petCatData, cityData] = await Promise.all([
    catRes.json(),
    petCatRes.json(),
    cityRes.json()
  ]);

  const categoryMap = Object.fromEntries(
    catData.categories.map(c => [c.categoryName.toLowerCase(), c._id])
  );

  const petCategoryMap = Object.fromEntries(
    petCatData.petCategories.map(p => [p.categoryName.toLowerCase(), p._id])
  );

  const cityMap = Object.fromEntries(
    cityData.cities.map(city => [city.city.toLowerCase(), city._id])
  );

  // const mapped = rows.map((row, idx) => {
  //   const safe = (v) => (v == null ? '' : String(v).trim());
  //   const shopName = String(row.shopname || row.shopName || '').trim();
  //   const email = String(row.email || '').trim();
  //   const phone = safe(row.phone);
  //   const address = (row.address || '').trim();
  //   const cityName = (row.city || '').trim().toLowerCase();

  //   const categoriesRaw = (row.categories || '').split(/[,;|]/).map(s => s.trim().toLowerCase()).filter(Boolean);
  //   const petCategoriesRaw = (row.petCategories || '').split(/[,;|]/).map(s => s.trim().toLowerCase()).filter(Boolean);

  //   // Convert names → ObjectIds using map
  //   const categoryIds = categoriesRaw.map(name => categoryMap[name]).filter(Boolean);
  //   const petCategoryIds = petCategoriesRaw.map(name => petCategoryMap[name]).filter(Boolean);
  //   const cityId = cityMap[cityName] || null;

  //   return {
  //     _id: `tmp-${timestamp}-${idx}`,
  //     shopName,
  //     email,
  //     phone,
  //     address,
  //     city: cityId,
  //     categories: categoryIds,
  //     petCategories: petCategoryIds,
  //     description: (row.description || '').trim(),
  //     mapUrl: (row.mapUrl || '').trim(),
  //     metaTitle: (row.metaTitle || '').trim(),
  //     metaDescription: (row.metaDescription || '').trim(),
  //     metaKeyword: (row.metaKeyword || '').trim(),
  //     status: (row.status || 'pending').trim().toLowerCase()
  //   };
  // }).filter(r => r.shopName);
  const mapped = [];
const missingCities = new Set();
const missingCategories = new Set();
const missingPetCategories = new Set();

for (let idx = 0; idx < rows.length; idx++) {
  const row = rows[idx];
  const safe = (v) => (v == null ? '' : String(v).trim());
  const shopName = safe(row.shopname || row.shopName);
  const email = safe(row.email);
  const phone = safe(row.phone);
  const address = safe(row.address);
  const cityName = safe(row.city).toLowerCase();

  const categoriesRaw = safe(row.categories)
    .split(/[,;|]/)
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  const petCategoriesRaw = safe(row.petCategories)
    .split(/[,;|]/)
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  // --- CITY CHECK ---
  const cityId = cityMap[cityName] || null;
  if (!cityId && cityName) missingCities.add(row.city);

  // --- CATEGORY CHECK ---
  const categoryIds = categoriesRaw.map((name) => categoryMap[name]).filter(Boolean);
  if (categoryIds.length !== categoriesRaw.length) {
    const missing = categoriesRaw.filter((name) => !categoryMap[name]);
    missing.forEach((m) => missingCategories.add(m));
  }

  // --- PET CATEGORY CHECK ---
  const petCategoryIds = petCategoriesRaw.map((name) => petCategoryMap[name]).filter(Boolean);
  if (petCategoryIds.length !== petCategoriesRaw.length) {
    const missing = petCategoriesRaw.filter((name) => !petCategoryMap[name]);
    missing.forEach((m) => missingPetCategories.add(m));
  }

  mapped.push({
    _id: `tmp-${timestamp}-${idx}`,
    shopName,
    email,
    phone,
    address,
    city: cityId,
    categories: categoryIds,
    petCategories: petCategoryIds,
    description: safe(row.description),
    mapUrl: safe(row.mapUrl),
    metaTitle: safe(row.metaTitle),
    metaDescription: safe(row.metaDescription),
    metaKeyword: safe(row.metaKeyword),
    status: safe(row.status || 'pending').toLowerCase(),
  });
}

// --- Final check ---
if (missingCities.size || missingCategories.size || missingPetCategories.size) {
  let message = "Import stopped due to missing values:\n\n";

  if (missingCities.size)
    message += `Missing Cities: ${Array.from(missingCities).join(", ")}\n`;
  if (missingCategories.size)
    message += `Missing Categories: ${Array.from(missingCategories).join(", ")}\n`;
  if (missingPetCategories.size)
    message += `Missing Pet Categories: ${Array.from(missingPetCategories).join(", ")}\n`;

  message += "\nPlease correct these and retry.";
  alert(message);
  return; // stop everything
}

if (!mapped.length) {
  alert("No valid rows found. Import stopped.");
  return;
}


  if (mapped.length === 0) {
    setUploadError('No valid rows found. Ensure "shopName" exists.');
    return;
  }

  const token = localStorage.getItem("token");
  try {
    const bulkRes = await fetch(`${API_BASE}/api/listing/bulk`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ listings: mapped }),
    });

    const data = await bulkRes.json();
    if (data.success) {
      alert(`${data.created.length} listing(s) saved successfully!`);
      fetchListings();
    } else {
      setUploadError(data.message || "Failed to save listings.");
    }
  } catch (err) {
    console.error("Bulk import error:", err);
    setUploadError("Server error during bulk upload.");
  }
};


  return (
    <div className="container mt-4">
      <div className='pl-3 pr-3'>
        <Row className='mb-3 justify-content-between align-items-center'>
          <Col>
            <h2 className='main-title mb-0'>Business Listing</h2>
            <Breadcrumb className='top-breadcrumb'>
              <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
              <Breadcrumb.Item active>Business Listing</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
          <Col xs={'auto'}>
          <Button variant="primary" onClick={() => navigate('/add-listing')}>+ Add New</Button>
            
          </Col>
          <Col xs={'auto'} className="d-flex align-items-center justify-content-center">
            <Form.Group className="text-center">
              {/* Hidden file input */}
              <Form.Control
                type="file"
                accept=".csv, .xlsx, .xls"
                onChange={handleFileChange}
                ref={listFileInputRef}
                style={{ display: "none" }}
                id="file-upload-input"
              />

              {/* Label acts as the visible button */}
              <label
                htmlFor="file-upload-input"
                className="btn btn-primary d-flex flex-column align-items-center justify-content-center circular-button"
                style={{ cursor: "pointer", padding: "12px", borderRadius: "100%" }}
              >
                <FaUpload size={20} />
                {/* <span style={{ fontSize: "0.85rem", marginTop: "5px" }}>
                  Upload File
                </span> */}
              </label>

              {/* <div className="text-muted mt-2" style={{ fontSize: "0.8rem" }}>
               [ CSV / Excel only ]
              </div> */}
            </Form.Group>
          </Col>
        </Row>
        <Row className='d-flex justify-content-center mb-5'>
          <Col md={6} >
            {uploadError && (
            <div
              className="text-danger mt-1"
              style={{ whiteSpace: "pre-line" }}
            >
              {uploadError}
            </div>
          )}
          </Col>
        </Row>

        {/* Filters */}
        <Row className='mb-3'>
          <Col md={3}>
            <Form.Control
              type="text"
              placeholder="Search by name/city"
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setCurrentPage(0); }}
            />
          </Col>
          <Col md={3}>
            <Select
              isMulti
              options={categoryList.map(c => ({ value: c, label: c }))}
              value={selectedCategories.map(c => ({ value: c, label: c }))}
              onChange={selected => { 
                setSelectedCategories(selected ? selected.map(s => s.value) : []); 
                setCurrentPage(0);
              }}
              placeholder="Filter by Categories"
            />
          </Col>
          <Col md={3}>
            <Select
              isMulti
              options={typeList.map(c => ({ value: c, label: c }))}
              value={selectedTypes.map(c => ({ value: c, label: c }))}
              onChange={selected => { 
                setSelectedTypes(selected ? selected.map(s => s.value) : []); 
                setCurrentPage(0);
              }}
              placeholder="Filter by Types"
            />
          </Col>
          <Col md={3}>
            <ButtonGroup className='w-100'>
              <ToggleButton
                id="approved"
                type="radio"
                variant="outline-success"
                checked={statusFilter === "approved"}
                onChange={() => { setStatusFilter("approved"); setCurrentPage(0); }}
              >
                Approved
              </ToggleButton>
              <ToggleButton
                id="pending"
                type="radio"
                variant="outline-danger"
                checked={statusFilter === "pending"}
                onChange={() => { setStatusFilter("pending"); setCurrentPage(0); }}
              >
                Pending
              </ToggleButton>
            </ButtonGroup>
          </Col>
          {/* <Col md={2}>
            <Form.Group className="mb-3">
              <Form.Control
                type="file"
                accept=".csv, .xlsx, .xls"
                onChange={handleFileChange}
                ref={listFileInputRef}
              />
              
              <div className="text-muted mt-2" style={{ fontSize: '0.85rem' }}>
                Upload CSV / Excel files
              </div>
            </Form.Group>
          </Col> */}
          
        </Row>

        {/* Table */}
        <Table bordered hover responsive>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>Type</th>
              <th>Category</th>
              <th>City</th>
              <th>Created By</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedListings.map((listing, index) => (
              <tr key={listing._id}>
                <td>{currentPage * itemsPerPage + index + 1}</td>
                <td>{listing.shopName}</td>
                <td>{listing.petCategories?.join(",")}</td>
                <td>{listing.categories?.join(", ")}</td>
                <td>{listing.city?.city}</td>
                <td>{listing.created_by_type.charAt(0).toUpperCase() + listing.created_by_type.slice(1)}</td>
                <td>
                  <Form.Check
                    type="switch"
                    id={`status-${listing._id}`}
                    label={listing.status === "approved" ? "Approved" : "Pending"}
                    checked={listing.status === "approved"}
                    onChange={() => handleToggleStatus(listing._id)}
                  />
                </td>
                <td>
                  {/* <Button size="sm" variant="success" onClick={() => handleView(listing)}>View</Button>{' '} */}
                  <Button size="sm" variant="primary" onClick={() => handleEdit(listing)}>Edit</Button>{' '}
                  <Button size="sm" variant="danger" onClick={() => handleDelete(listing._id)}>Delete</Button>
                  {/* <Button
  as={Link}
  to={`/add-review/${listing._id}`}
  variant="outline-primary"
>
  Write a Review
</Button> */}

                </td>
              </tr>
            ))}
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

        {/* Bulk import */}
        {/* <Row>
          <Col xs="auto">
            <h2 className='main-title mb-3 mt-3'>Import your Listing Files Here</h2>
            <Form.Group className="mb-3">
              <Form.Control
                type="file"
                accept=".csv, .xlsx, .xls"
                onChange={handleFileChange}
                ref={listFileInputRef}
              />
              {uploadError && <div className="text-danger mt-1">{uploadError}</div>}
              <div className="text-muted mt-1" style={{ fontSize: '0.85rem' }}>
                Expect columns: shopname, email, categories, phone.
              </div>
            </Form.Group>
          </Col>
        </Row> */}
      </div>
    </div>
  );
};

export default BusinessListings;
