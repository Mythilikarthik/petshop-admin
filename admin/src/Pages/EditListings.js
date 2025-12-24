import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Image, Breadcrumb } from 'react-bootstrap';
import Select from "react-select";
import useUnsavedChanges from "../Hooks/useUnsavedChanges";

const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://petshop-admin.onrender.com"
    : "http://localhost:5000";

const EditListing = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { id } = state || {};

  const [loading, setLoading] = useState(true);
  const [listing, setListing] = useState(null);
  const [categoryList, setCategoryList] = useState([]);
  const [petCategoryList, setPetCategoryList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [newKeyword, setNewKeyword] = useState("");
  const [banner, setBanner] = useState(null);
const [bannerPreview, setBannerPreview] = useState(null);
const [existingBanner, setExistingBanner] = useState(null);


  const [formData, setFormData] = useState({
    shopName: '',
    email: '',
    phone: '',
    address: '',
    city: '',          // 🧩 will hold city _id
    country: '',
    mapUrl: '',
    description: '',
    categories: [],     // 🧩 will hold category _ids
    petCategories: [],  // 🧩 will hold petCategory _ids
    photos: [],
    existingPhotos: [],
    metaTitle: '',
    metaKeyword: '',
    metaDescription: '',
    status: false,
    u_name: '',
  });

  const { confirmLeave, markAsSaved, resetInitialSnapshot } =
    useUnsavedChanges(formData, { excludeKeys: ['photos', 'existingPhotos'] });

  // ✅ Fetch categories, pet categories, and cities (ID + Name)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/category/show`);
        const data = await res.json();
        if (data.success) {
          // 🧩 Keep both id + name
          setCategoryList(
            data.categories.map(c => ({ value: c._id, label: c.categoryName }))
          );
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    const fetchPetCategories = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/pet-category/show`);
        const data = await res.json();
        if (data.success) {
          setPetCategoryList(
            data.petCategories.map(c => ({ value: c._id, label: c.categoryName }))
          );
        }
      } catch (err) {
        console.error("Error fetching pet categories:", err);
      }
    };

    const fetchCityList = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/city/show`);
        const data = await res.json();
        if (data.success) {
          setCityList(
            data.cities.map(c => ({ value: c._id, label: c.city }))
          );
        }
      } catch (err) {
        console.error("Error fetching cities:", err);
      }
    };

    fetchCategories();
    fetchPetCategories();
    fetchCityList();
  }, []);

  // ✅ Fetch listing by ID
  useEffect(() => {
    if (!id) return;

    const fetchListing = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/listing/${id}`);
        const data = await res.json();

        if (res.ok && data.success) {
          setListing(data.listing);
          setExistingBanner(data.listing.bannerImage || null);

          setFormData({
            u_name: data.listing.user_id?.name || '',
            shopName: data.listing.shopName || '',
            email: data.listing.email || '',
            phone: data.listing.phone || '',
            address: data.listing.address || '',
            city: data.listing.city?._id || data.listing.city || '',
            country: data.listing.country || '',
            mapUrl: data.listing.mapUrl || '',
            description: data.listing.description || '',
            categories: data.listing.categories?.map(c => c._id || c) || [],
            petCategories: data.listing.petCategories?.map(c => c._id || c) || [],
            photos: [],
            bannerImage: data.listing.bannerImage || null,
            existingPhotos: data.listing.photos || [],
            metaTitle: data.listing.metaTitle || '',
            metaKeyword: data.listing.metaKeyword
            ? (
                Array.isArray(data.listing.metaKeyword)
                  ? data.listing.metaKeyword
                      .flatMap(k => k.split(',').map(x => x.trim()))
                      .filter(k => k) 
                  : data.listing.metaKeyword
                      .split(',')
                      .map(k => k.trim())
                      .filter(k => k)
              )
            : [],
            metaDescription: data.listing.metaDescription || '',
            status: data.listing.status === 'approved',
          });
        } else {
          alert('Failed to fetch listing');
          navigate('/business-listing');
        }
      } catch (err) {
        console.error('Error fetching listing:', err);
        alert('Error fetching listing');
        navigate('/business-listing');
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id, navigate]);

  useEffect(() => {
    if (!loading && listing) {
      resetInitialSnapshot();
    }
  }, [loading, listing]);

  // ✅ Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (selected) => {
    setFormData(prev => ({
      ...prev,
      categories: selected ? selected.map(s => s.value) : []
    }));
  };

  const handlePetCategoryChange = (selected) => {
    setFormData(prev => ({
      ...prev,
      petCategories: selected ? selected.map(s => s.value) : []
    }));
  };

  const handleCityChange = (selected) => {
    setFormData(prev => ({
      ...prev,
      city: selected ? selected.value : ''
    }));
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({ ...prev, photos: files }));
    setPreviewUrls(files.map(file => URL.createObjectURL(file)));
  };

  const handleStatusToggle = () => {
    setFormData(prev => ({ ...prev, status: !prev.status }));
  };

  const handleAddKeyword = (e) => {
    e.preventDefault();
    if (newKeyword.trim() && !formData.metaKeyword.includes(newKeyword.trim())) {
      setFormData(prev => ({
        ...prev,
        metaKeyword: [...prev.metaKeyword, newKeyword.trim()]
      }));
      setNewKeyword("");
    }
  };

  const handleRemoveKeyword = (keyword) => {
    setFormData(prev => ({
      ...prev,
      metaKeyword: prev.metaKeyword.filter(k => k !== keyword)
    }));
  };

  // ✅ Submit
  const handleSubmit = async (e) => {
    const token = localStorage.getItem("token");
  if (!token) {
    alert("You must be logged in");
    return;
  }
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.entries({
        shopName: formData.shopName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        country: formData.country,
        mapUrl: formData.mapUrl,
        description: formData.description,
        metaTitle: formData.metaTitle,
        metaKeyword: formData.metaKeyword.join(','),
        metaDescription: formData.metaDescription,
        status: formData.status ? 'approved' : 'pending',
        createdBy: formData.createdBy,
      }).forEach(([key, val]) => formDataToSend.append(key, val));

      formData.categories.forEach(cat => formDataToSend.append('categories[]', cat));
      formData.petCategories.forEach(cat => formDataToSend.append('petCategories[]', cat));
      formData.photos.forEach(photo => formDataToSend.append('photos', photo));
      formData.existingPhotos.forEach(photo => formDataToSend.append('existingPhotos[]', photo));
      if (banner) {
  formDataToSend.append("bannerImage", banner);
}

      const res = await fetch(`${API_BASE}/api/listing/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`, // ✅ send token
        },
        body: formDataToSend
      });

      const result = await res.json();
      if (res.ok && result.success) {
        alert("Listing updated successfully!");
        markAsSaved();
        navigate("/business-listing");
      } else {
        alert(result.message || "Failed to update listing");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating listing");
    }
  };
  const handleBannerChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const img = new window.Image();
  img.src = URL.createObjectURL(file);

  img.onload = () => {
    if (img.width === 1200 && img.height === 300) {
      setBanner(file);
      setBannerPreview(img.src);
    } else {
      alert("Image must be exactly 1200 × 300");
      e.target.value = "";
    }
  };
};


  const handleGoBack = () => {
    if (!confirmLeave()) return;
    navigate(-1);
  };

  if (!id) return <p className="text-danger text-center mt-4">No listing ID provided.</p>;
  if (loading) return <p className="text-center mt-4">Loading listing details...</p>;
  if (!listing) return <p className="text-danger text-center mt-4">Listing not found.</p>;
  return (
    <Container className="mt-4">
      <div className='pl-3 pr-3'>
        <Row className="mb-3 justify-content-end align-items-center">
          <Col>
            <h2 className="main-title mb-0">Edit Listing</h2>
            <Breadcrumb className="top-breadcrumb">
              <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
              <Breadcrumb.Item active>Edit Listing</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
          <Col xs="auto">
            <Button variant="secondary" onClick={handleGoBack}>
              Go Back
            </Button>
          </Col>
        </Row>

        <div className='form-container'>
          {console.log("Form Data:", formData)}
          <Form onSubmit={handleSubmit}>
            {formData.u_name && (
              <h3 className="mb-4">Created by : {formData.u_name.toUpperCase()}</h3>
            )}

            {/* Status Toggle */}
            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                id="status-switch"
                label={formData.status ? "Approved" : "Pending"}
                checked={formData.status}
                onChange={handleStatusToggle}
              />
            </Form.Group>
            

            {/* Category Select */}
            <Form.Group className="mb-3">
              <Form.Label>Category <span className="text-danger">*</span></Form.Label>
               <Select
                isMulti
                options={categoryList}
                value={categoryList.filter(c => formData.categories.includes(c.value))}
                onChange={handleCategoryChange}
              />
            </Form.Group>

            {/* Pet Type Select */}
            <Form.Group className="mb-3">
              <Form.Label>Type <span className="text-danger">*</span></Form.Label>
              <Select
                isMulti
                options={petCategoryList}
                value={petCategoryList.filter(c => formData.petCategories.includes(c.value))}
                onChange={handlePetCategoryChange}
              />
            </Form.Group>

            {/* Basic Fields */}
            <Form.Group className="mb-3">
              <Form.Label>Shop Name <span className="text-danger">*</span></Form.Label>
              <Form.Control type="text" name="shopName" value={formData.shopName} onChange={handleChange} required disabled />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email <span className="text-danger">*</span></Form.Label>
              <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required disabled />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone <span className="text-danger">*</span></Form.Label>
              <Form.Control type="number" name="phone" value={formData.phone} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control type="text" name="address" value={formData.address} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>City <span className="text-danger">*</span></Form.Label>
              <Select
                options={cityList}
                value={cityList.find(c => c.value === formData.city) || null}
                onChange={handleCityChange}
                placeholder="Select City"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Country</Form.Label>
              <Form.Control type="text" name="country" value={formData.country} onChange={handleChange} disabled readOnly />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Website URL</Form.Label>
              <Form.Control type="url" name="mapUrl" value={formData.mapUrl} onChange={handleChange} />
            </Form.Group>

            {formData.mapUrl && (
              <div className="mb-3">
                <iframe
                  src={formData.mapUrl}
                  width="100%"
                  height="250"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title="Location Map"
                ></iframe>
              </div>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleChange} />
            </Form.Group>
            {/* Banner Image Upload */}
<Form.Group className="mb-3">
  <Form.Label>Banner Image (1200 × 300)</Form.Label>
  <Form.Control
    type="file"
    accept="image/jpeg,image/png,image/webp"
    onChange={handleBannerChange}
  />
</Form.Group>

{/* Banner Preview */}
{bannerPreview ? (
  <img
    src={bannerPreview}
    alt="New Banner Preview"
    style={{
      width: "100%",
      height: "300px",
      objectFit: "contain",
      background: "#f5f5f5",
      borderRadius: "8px",
      marginBottom: "10px"
    }}
  />
) : existingBanner ? (
  <img
    src={existingBanner.startsWith("http") ? existingBanner : `${API_BASE}${existingBanner}`}
    alt="Existing Banner"
    style={{
      width: "100%",
      height: "300px",
      objectFit: "contain",
      background: "#f5f5f5",
      borderRadius: "8px",
      marginBottom: "10px"
    }}
  />
) : null}



            {/* Photos */}
            <Form.Group className="mb-4">
              <Form.Label>Upload New Photos</Form.Label>
              <Form.Control type="file" name="photos" multiple accept="image/*" onChange={handlePhotoChange} />
              <Form.Text className="text-muted">
                              Note : You can upload multiple images (JPG, PNG, WEBP) up to 2MB each.
                            </Form.Text>
            </Form.Group>

            {/* Existing Photo Previews */}
            {formData.existingPhotos.length > 0 && (
              <Row className="mb-3">
                {formData.existingPhotos.map((url, idx) => {
                  const imageUrl = url.startsWith("http")
                    ? url
                    : `${url}`;
                  return (
                    <Col key={idx} xs={6} md={4} lg={3} className="mb-2">
                      <Image src={imageUrl} thumbnail fluid />
                    </Col>
                  );
                })}
              </Row>
            )}

            {/* New Photo Previews */}
            {previewUrls.length > 0 && (
              <Row className="mb-3">
                {previewUrls.map((url, idx) => (
                  <Col key={idx} xs={6} md={4} lg={3} className="mb-2">
                    <Image src={url} thumbnail fluid />
                  </Col>
                ))}
              </Row>
            )}

            {/* Meta Fields */}
            <Form.Group className="mb-3">
              <Form.Label>Meta Title</Form.Label>
              <Form.Control type="text" name="metaTitle" value={formData.metaTitle} onChange={handleChange} />
            </Form.Group>

            {/* ✅ Keyword Tags */}
            <Form.Group className="mb-3">
              <Form.Label>Meta Keywords</Form.Label>

              <div className="d-flex flex-wrap gap-2 mb-2">
                {console.log("Current keywords:", formData.metaKeyword)}
                {formData.metaKeyword.map((keyword, idx) => (
                  <span key={idx} className="badge bg-secondary d-flex align-items-center">
                    {keyword}
                    <Button
                      variant="link"
                      size="sm"
                      className="text-white ms-1 p-0"
                      onClick={() => handleRemoveKeyword(keyword)}
                      style={{ lineHeight: "1" }}
                    >
                      ✕
                    </Button>
                  </span>
                ))}
              </div>

              <div className="d-flex">
                <Form.Control
                  type="text"
                  placeholder="Type a keyword and press Add"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddKeyword(e)}
                />
                <Button variant="outline-primary" onClick={handleAddKeyword} className="ms-2">
                  Add
                </Button>
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Meta Description</Form.Label>
              <Form.Control as="textarea" rows={3} name="metaDescription" value={formData.metaDescription} onChange={handleChange} />
            </Form.Group>

            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Form>
        </div>
      </div>
    </Container>
  );
};

export default EditListing;
