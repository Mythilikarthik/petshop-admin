import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col, Image, Breadcrumb } from "react-bootstrap";
import Select from "react-select";
import useUnsavedChanges from "../Hooks/useUnsavedChanges";

const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://petshop-admin.onrender.com"
    : "http://localhost:5000";

const AddListing = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { listing } = state || {};
const [filteredPetCategories, setFilteredPetCategories] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [petCategory, setPetCategory] = useState([]);
const [newKeyword, setNewKeyword] = useState("");
const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];

const [businessHours, setBusinessHours] = useState(
  daysOfWeek.map(day => ({
    day,
    open: "",
    close: "",
    closed: false
  }))
);
  const [formData, setFormData] = useState({
    shopName: listing?.shopName || "",
    email: listing?.email || "",
    phone: listing?.phone || "",
    address: listing?.address || "",
    city: listing?.city || "",
    country: listing?.country || "India",
    mapUrl: listing?.mapUrl || "",
    petCategories: listing?.petCategories || [],
    description: listing?.description || "",
    categories: listing?.categories || [],
    photos: [],
    metaTitle: listing?.metaTitle || "",
    metaKeyword: listing?.metaKeyword || [],
    metaDescription: listing?.metaDescription || ""
  });

  const [previewUrls, setPreviewUrls] = useState([]);
const { shouldBlockNavigation, confirmLeave, markAsSaved } =
    useUnsavedChanges(formData);

    const [banner, setBanner] = useState(null);
const [bannerPreview, setBannerPreview] = useState(null);

const handleBannerChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const img = new window.Image(); // ✅ IMPORTANT
  img.src = URL.createObjectURL(file);

  img.onload = () => {
    if (img.width === 1200 && img.height === 300) {
      setBanner(file);
      setBannerPreview(img.src);
    } else {
      alert(`${file.name} rejected ❌\nImage must be exactly 1200 × 300`);
      e.target.value = "";
    }
  };
};



  // handle normal input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // handle photo selection
  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      photos: files
    }));

    // image previews
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };
useEffect(() => {
  if (formData.categories.length > 0) {
    // find all selected categories
    const selectedCats = categoryList.filter(cat =>
      formData.categories.includes(cat.categoryName)
    );

    // collect all pet categories from selected categories
    const pets = selectedCats.flatMap(cat => cat.petCategories || []);
    // remove duplicates
    const uniquePets = Array.from(new Set(pets.map(p => p.categoryName)))
      .map(name => ({ value: name, label: name }));

    setFilteredPetCategories(uniquePets);
  } else {
    setFilteredPetCategories([]);
  }
}, [formData.categories, categoryList]);
  // fetch categories
  const getCategories = async () => {
  try {
    const response = await fetch(`${API_BASE}/api/category/show`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    return data.categories || []; // [{_id, categoryName, petCategories}]
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

  const getCities = async () => {
  try {
    const response = await fetch(`${API_BASE}/api/city/show`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    return data.cities || []; // [{_id, city, show}]
  } catch (error) {
    console.error("Error fetching cities:", error);
    return [];
  }
};

const getTypes = async () => {
  try {
    const response = await fetch(`${API_BASE}/api/pet-category/show`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    return data.petCategories || []; // [{_id, categoryName}]
  } catch (error) {
    console.error("Error fetching pet categories:", error);
    return [];
  }
};



 useEffect(() => {
  const fetchData = async () => {
    const categories = await getCategories();
    const cities = await getCities();
    const petCategory = await getTypes(); 
    setCategoryList(categories);
    setCityList(cities);
    setPetCategory(petCategory);
    //console.log(petCategory);
  };
  fetchData();
}, []);

  // handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
  if (!token) {
    alert("You must be logged in");
    return;
  }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("shopName", formData.shopName);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("address", formData.address);
      // formDataToSend.append("city", formData.city);
      formDataToSend.append("country", formData.country);
      formDataToSend.append("mapUrl", formData.mapUrl);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("metaTitle", formData.metaTitle);
      formDataToSend.append("metaKeyword", formData.metaKeyword);
      formDataToSend.append("metaDescription", formData.metaDescription);
      formDataToSend.append("businessHours", JSON.stringify(businessHours));

      console.log(formData.categories);
      // append selected categories
      formData.categories.forEach((catId) => {
        formDataToSend.append("categories[]", catId);
      });
      formData.petCategories.forEach((petId) => {
        formDataToSend.append("petCategories[]", petId);
      });
      formDataToSend.append("city", formData.city);

console.log(formDataToSend.getAll("categories[]"));
      // append image files
      formData.photos.forEach((photo) => {
        formDataToSend.append("photos", photo);
      });
if (banner) {
  formDataToSend.append("bannerImage", banner);
}
      const response = await fetch(`${API_BASE}/api/listing`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // ✅ send token
        },
        body: formDataToSend
      });

      const result = await response.json();

      if (response.ok) {
        alert("Listing saved successfully!");
        markAsSaved();
        navigate("/business-listing");
      } else {
        alert(result.error || result.message || "Failed to save listing");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Something went wrong!");
    }
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
const handleRemoveKeyword = (keywordToRemove) => {
    setFormData((prev) => ({
      ...prev,
      metaKeyword: prev.metaKeyword.filter((kw) => kw !== keywordToRemove)
    }));
  };
  const handleGoBack = () => {
    if (!confirmLeave()) return; // user canceled
    navigate(-1);
  };
useEffect(() => {
  // If no petCategories selected, clear category list
  if (!formData.petCategories || formData.petCategories.length === 0) {
    setCategoryList([]);
    return;
  }

  // Fetch categories based on selected pet categories
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/category/byPetCategories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ petCategories: formData.petCategories }),
      });
      const data = await res.json();
      console.log(data);
      if (data.success && Array.isArray(data.categories)) {
        setCategoryList(data.categories);
      } else {
        setCategoryList([]);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategoryList([]);
    }
  };

  fetchCategories();
}, [formData.petCategories]);

  return (
    <Container className="mt-4">
      <div className="pl-3 pr-3">
        <Row className="mb-3 justify-content-end align-items-center">
          <Col>
            <h2 className="main-title mb-0">Add Listing</h2>
            <Breadcrumb className="top-breadcrumb">
              <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
              <Breadcrumb.Item active>Add Listing</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
          <Col xs="auto">
            
            <Button variant="secondary" onClick={handleGoBack}>
                    Go Back
                  </Button>
          </Col>
        </Row>

        <div className="form-container">
          <Form onSubmit={handleSubmit}>
            {/* Category */}
            <Form.Group className="mb-3">
              <Form.Label>Type <span className="text-danger">*</span></Form.Label>
              {/* <Select
                isMulti
                options={petCategory.map((c) => ({ value: c, label: c }))}
                value={(formData.petCategories || []).map((c) => ({
                  value: c,
                  label: c
                }))}
                onChange={(selected) =>
                  setFormData((prev) => ({
                    ...prev,
                    petCategories: selected.map((s) => s.value)
                  }))
                }
              /> */}
              {/* <Select
  isMulti
  options={petCategory.map(c => ({ value: c._id, label: c.categoryName }))}
  value={petCategory
    .filter(p => formData.petCategories.includes(p._id))
    .map(p => ({ value: p._id, label: p.categoryName }))
  }
  onChange={(selected) =>
    
    setFormData(prev => ({
      ...prev,
      petCategories: selected.map(s => s.value)
    }))
  }
  required
/> */}
<Select
  isMulti
  options={[
    { value: "all", label: "All Types" },   // ✅ Add this
    ...petCategory.map(c => ({ value: c._id, label: c.categoryName }))
  ]}
  value={
    formData.petCategories.length === petCategory.length
      ? [{ value: "all", label: "All Types" }]
      : petCategory
          .filter(p => formData.petCategories.includes(p._id))
          .map(p => ({ value: p._id, label: p.categoryName }))
  }
  onChange={(selected) => {
    if (!selected) {
      setFormData(prev => ({ ...prev, petCategories: [] }));
      return;
    }

    // ✅ If "All" selected
    if (selected.some(s => s.value === "all")) {
      setFormData(prev => ({
        ...prev,
        petCategories: petCategory.map(p => p._id) // select all ids
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        petCategories: selected.map(s => s.value)
      }));
    }
  }}
/>

            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category <span className="text-danger">*</span></Form.Label>
              {/* <Select
                isMulti
                options={categoryList.map((c) => ({ value: c, label: c }))}
                value={(formData.categories || []).map((c) => ({
                  value: c,
                  label: c
                }))}
                onChange={(selected) =>
                  setFormData((prev) => ({
                    ...prev,
                    categories: selected.map((s) => s.value)
                  }))
                }
              /> */}
              <Select
  isMulti
  options={categoryList.map(c => ({
    value: c._id,
    label: c.categoryName
  }))}
  value={categoryList
    .filter(c => formData.categories.includes(c._id))
    .map(c => ({ value: c._id, label: c.categoryName }))
  }
  onChange={(selected) =>
    setFormData(prev => ({
      ...prev,
      categories: selected.map(s => s.value),
    }))
  }
  required
/>

            </Form.Group>
            


            {/* Basic Fields */}
            <Form.Group className="mb-3">
              <Form.Label>Shop Name <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                name="shopName"
                value={formData.shopName}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email </Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-4">
  <Form.Label className="fw-bold">Business Hours</Form.Label>

  {businessHours.map((item, index) => (
    <Row key={index} className="align-items-center mb-2">
      <Col md={3}>
        <strong>{item.day}</strong>
      </Col>

      <Col md={3}>
        <Form.Control
          type="time"
          value={item.open}
          disabled={item.closed}
          onChange={(e) => {
            const updated = [...businessHours];
            updated[index].open = e.target.value;
            setBusinessHours(updated);
          }}
        />
      </Col>

      <Col md={3}>
        <Form.Control
          type="time"
          value={item.close}
          disabled={item.closed}
          onChange={(e) => {
            const updated = [...businessHours];
            updated[index].close = e.target.value;
            setBusinessHours(updated);
          }}
        />
      </Col>

      <Col md={3}>
        <Form.Check
          type="checkbox"
          label="Closed"
          checked={item.closed}
          onChange={(e) => {
            const updated = [...businessHours];
            updated[index].closed = e.target.checked;
            if (e.target.checked) {
              updated[index].open = "";
              updated[index].close = "";
            }
            setBusinessHours(updated);
          }}
        />
      </Col>
    </Row>
  ))}
</Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>City <span className="text-danger">*</span></Form.Label>
              <Form.Select
  name="city"
  value={formData.city}
  onChange={handleChange}
  required
>
  <option value="">--Select City--</option>
  {cityList.map((c) => (
    <option key={c._id} value={c._id}>
      {c.city}
    </option>
  ))}
</Form.Select>

            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Country</Form.Label>
              <Form.Control
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                disabled
                readOnly
              />
            </Form.Group>

            {/* Map */}
            <Form.Group className="mb-3">
              <Form.Label>Website URL</Form.Label>
              <Form.Control
                type="url"
                name="mapUrl"
                value={formData.mapUrl}
                onChange={handleChange}
              />
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

            {/* Description */}
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-4">
  <Form.Label>Banner Image (1200 × 300)</Form.Label>
  <Form.Control
    type="file"
    accept="image/jpeg,image/png,image/webp"
    onChange={handleBannerChange}
  />
</Form.Group>

{bannerPreview && (
  <img
    src={bannerPreview}
    alt="Banner Preview"
    style={{
      width: "100%",
      height: "300px",
      objectFit: "contain", // ✅ NO CUT, NO SHARP
      background: "#f5f5f5",
      borderRadius: "8px",
    }}
  />
)}


            {/* Photos */}
            <Form.Group className="mb-4">
              <Form.Label>Upload Photos</Form.Label>
              <Form.Control
                type="file"
                name="photos"
                multiple
                accept="image/*"
                onChange={handlePhotoChange}
              />
              <Form.Text className="text-muted">
                Note : You can upload multiple images (JPG, PNG, WEBP) up to 2MB each.
              </Form.Text>
            </Form.Group>

            {/* Preview */}
            {previewUrls.length > 0 && (
              <Row className="mb-4">
                {previewUrls.map((url, index) => (
                  <Col key={index} xs={6} md={4} lg={3} className="mb-3">
                    <Image src={url} thumbnail fluid />
                  </Col>
                ))}
              </Row>
            )}

            {/* Meta Fields */}
            <Form.Group className="mb-4">
              <Form.Label>Page Title (Meta Title)</Form.Label>
              <Form.Control
                type="text"
                name="metaTitle"
                value={formData.metaTitle}
                onChange={handleChange}
              />
            </Form.Group>

            {/* <Form.Group className="mb-4">
              <Form.Label>Meta Keyword</Form.Label>
              <Form.Control
                type="text"
                name="metaKeyword"
                value={formData.metaKeyword}
                onChange={handleChange}
              />
            </Form.Group> */}
            {/* Meta Keywords - Dynamic Add/Remove */}
<Form.Group className="mb-3">
              <Form.Label>Meta Keywords</Form.Label>

              <div className="d-flex flex-wrap gap-2 mb-2">
                
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

            <Form.Group className="mb-4">
              <Form.Label>Meta Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="metaDescription"
                value={formData.metaDescription}
                onChange={handleChange}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Save
            </Button>
          </Form>
        </div>
      </div>
    </Container>
  );
};

export default AddListing;
