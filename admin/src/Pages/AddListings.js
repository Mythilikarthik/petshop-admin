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
  const [formData, setFormData] = useState({
    shopName: listing?.shopName || "",
    email: listing?.email || "",
    phone: listing?.phone || "",
    address: listing?.address || "",
    city: listing?.city || "",
    country: listing?.country || "",
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
      const response = await fetch(`${API_BASE}/api/category`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      const categories = data.categories || [];
      // return categories.map((cat) => cat.categoryName);

      return categories;
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  };
  const getCities = async () => {
  try {
    const response = await fetch(`${API_BASE}/api/city`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    const cities = data.cities || [];
    // Use 'city' instead of 'cityName'
    return cities.map((c) => c.city);
  } catch (error) {
    console.error("Error fetching cities:", error);
    return [];
  }
};
const getTypes = async () => {
  try {
    const response = await fetch(`${API_BASE}/api/pet-category`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    const types = data.petCategories || [];
    return types.map((t) => t.categoryName); // ✅ correct key from model
  } catch (error) {
    console.error("Error fetching types:", error);
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
      formDataToSend.append("city", formData.city);
      formDataToSend.append("country", formData.country);
      formDataToSend.append("mapUrl", formData.mapUrl);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("metaTitle", formData.metaTitle);
      formDataToSend.append("metaKeyword", formData.metaKeyword);
      formDataToSend.append("metaDescription", formData.metaDescription);

      console.log(formData.categories);
      // append selected categories
      formData.categories.forEach((cat) => {
        formDataToSend.append("categories[]", cat);
      });
      formData.petCategories.forEach((type) => {
        formDataToSend.append("petCategories[]", type);
      }
      );
console.log(formDataToSend.getAll("categories[]"));
      // append image files
      formData.photos.forEach((photo) => {
        formDataToSend.append("photos", photo);
      });

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
  options={categoryList.map(c => ({ value: c.categoryName, label: c.categoryName }))}
  value={(formData.categories || []).map(c => ({ value: c, label: c }))}
  onChange={(selected) =>
    setFormData(prev => ({
      ...prev,
      categories: selected.map(s => s.value),
      petCategories: [] // clear pet types when category changes
    }))
  }
  required
/>
            </Form.Group>
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
              <Select
                isMulti
                options={filteredPetCategories}
                value={(formData.petCategories || []).map(c => ({
                  value: c,
                  label: c
                }))}
                onChange={(selected) =>
                  setFormData(prev => ({
                    ...prev,
                    petCategories: selected.map(s => s.value)
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
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
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
              <Form.Label>City</Form.Label>
              <Form.Select
              name="city"
              value={formData.city}
              onChange={handleChange}
              
            >
              <option value="">--Select City--</option>
              {cityList.map((element, index) => (
                <option key={index} value={element}>
                  {element}
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
              />
            </Form.Group>

            {/* Map */}
            <Form.Group className="mb-3">
              <Form.Label>Location Map URL</Form.Label>
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
