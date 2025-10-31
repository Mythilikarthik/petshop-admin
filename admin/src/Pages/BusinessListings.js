import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, Form, Row, Col, Breadcrumb, ButtonGroup, ToggleButton } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import { Link, useNavigate } from 'react-router-dom';
import Select from "react-select";
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://petshop-admin.onrender.com"
    : "http://localhost:5000";

const itemsPerPage = 5;

const BusinessListings = () => {
  const [listings, setListings] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
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
          categories: Array.isArray(item.categories)
            ? item.categories
            : (item.categories ? String(item.categories).split(/[,;|]/).map(s => s.trim()).filter(Boolean) : []),
          petCategories: Array.isArray(item.petCategories) ? item.petCategories : [],
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
      const res = await fetch(`${API_BASE}/api/category`);
      const data = await res.json();
      if (data.success && Array.isArray(data.categories)) {
        setCategoryList(data.categories.map(c => c.categoryName));
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  useEffect(() => {
    fetchListings();
    fetchCategories();
  }, []);

  /** Pagination & filtering */
  const filteredListings = listings.filter(l => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = !term || (l.shopName || '').toLowerCase().includes(term) || (l.email || '').toLowerCase().includes(term);
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.some(cat => l.categories?.includes(cat));
    const matchesStatus = l.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
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
    const mapped = rows.map((row, idx) => {
      const shopName = (row.shopname || row.shopName || row.Shopname || row.SHOPNAME || row.name || '').toString().trim();
      const email = (row.email || row.Email || '').toString().trim();
      const phone = (row.phone || row.Phone || '').toString().trim();
      const categoriesRaw = (row.categories || row.Categories || row.CATEGORY || '').toString();
      const petCategoriesRaw = (row.petCategories || row.petCATEGORY || '').toString();

      return {
        _id: `tmp-${timestamp}-${idx}`,
        shopName,
        email,
        phone,
        categories: categoriesRaw ? categoriesRaw.split(/[,;|]/).map(s => s.trim()).filter(Boolean) : [],
        petCategories: petCategoriesRaw ? petCategoriesRaw.split(/[,;|]/).map(s => s.trim()).filter(Boolean) : [],
        imageFilename: (row.imageFilename || row.image || '').toString().trim(),
        imageUrl: (row.imageUrl || row.imageURL || '').toString().trim()
      };
    }).filter(r => r.shopName);

    if (mapped.length === 0) {
      setUploadError('No valid rows found. Ensure "shopName" exists.');
      return;
    }

    setUploadError(null);

    const token = localStorage.getItem("token");

    try {
      const bulkRes = await fetch(`${API_BASE}/api/listing/bulk`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listings: mapped.map(({ _id, imageFilename, imageUrl, ...rest }) => rest),
        }),
      });

      const data = await bulkRes.json();
      if (data.success) {
        alert(`${data.created.length} listing(s) saved to server`);
        await fetchListings(); // REFRESH state from server
        setCurrentPage(0);
      } else {
        setUploadError(data.message || "Failed to save listings");
      }
    } catch (err) {
      console.error("Error saving listings:", err);
      setUploadError("Server error while saving listings.");
    }
  };

  return (
    <div className="container mt-4">
      <div className='pl-3 pr-3'>
        <Row className='mb-3 justify-content-between align-items-center'>
          <Col>
            <h2 className='main-title mb-0'>Business Listing</h2>
          </Col>
          <Col xs={'auto'}>
            <Breadcrumb className='top-breadcrumb'>
              <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
              <Breadcrumb.Item active>Business Listing</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>

        {/* Filters */}
        <Row className='mb-3'>
          <Col md={3}>
            <Form.Control
              type="text"
              placeholder="Search by name/email"
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
          <Col md={4}>
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
          <Col md={2} xs={12} className="text-end mt-3 mt-md-0">
            <Button variant="primary" onClick={() => navigate('/add-listing')}>+ Add New</Button>
          </Col>
        </Row>

        {/* Table */}
        <Table bordered hover responsive>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>Type</th>
              <th>Category</th>
              <th>Created B y</th>
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
                  <Button size="sm" variant="success" onClick={() => handleView(listing)}>View</Button>{' '}
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
        <Row>
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
        </Row>
      </div>
    </div>
  );
};

export default BusinessListings;
