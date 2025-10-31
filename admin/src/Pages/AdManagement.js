import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Image,
  Breadcrumb,
  Spinner,
} from "react-bootstrap";
import Select from "react-select";

const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://your-server.com"
    : "http://localhost:5000";

const AdManagement = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const id = state?.id || null;
  console.log(id);

  const [formData, setFormData] = useState({
    category: "",
    city: "",
    position: "",
    url: "",
    image: "",
  });

  const [bannerFile, setBannerFile] = useState(null);
  const [categoryList, setCategoryList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch categories & cities
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, cityRes] = await Promise.all([
          fetch(`${API_BASE}/api/category`),
          fetch(`${API_BASE}/api/city`),
        ]);

        const catData = await catRes.json();
        const cityData = await cityRes.json();

        if (catData.success && cityData.success) {
          setCategoryList(catData.categories || []);
          setCityList(cityData.cities || []);
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 🔹 Load ad in edit mode
  useEffect(() => {
    if (id) {
      const fetchAd = async () => {
        try {
          const res = await fetch(`${API_BASE}/api/ads/${id}`);
          const data = await res.json();
          if (data.success) {
            const ad = data.ad;

            setFormData({
              category: ad.category?._id || ad.category || "",
              city: ad.city?._id || ad.city || "",
              position: ad.position || "",
              url: ad.url || "",
              image: ad.image || "",
            });
          }
        } catch (err) {
          console.error("Failed to load ad:", err);
        }
      };
      fetchAd();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBannerFile = (e) => {
    const file = e.target.files[0];
    if (file) setBannerFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!bannerFile && !id && !formData.image) {
      alert("Please select an image before saving!");
      return;
    }

    const formToSend = new FormData();
    formToSend.append("category", formData.category);
    formToSend.append("city", formData.city);
    formToSend.append("position", formData.position);
    formToSend.append("url", formData.url);

    if (bannerFile) formToSend.append("image", bannerFile);

    const method = id ? "PATCH" : "POST";
    const endpoint = id
      ? `${API_BASE}/api/ads/${id}`
      : `${API_BASE}/api/ads`;

    try {
      const res = await fetch(endpoint, {
        method,
        body: formToSend,
      });

      const data = await res.json();
      if (data.success) {
        alert(id ? "Ad updated successfully!" : "Ad added successfully!");
        navigate("/ad-listing");
      } else {
        alert(data.message || "Failed to save ad.");
      }
    } catch (error) {
      console.error("Error saving ad:", error);
      alert("Server error, please try again.");
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
        <p>Loading categories & cities...</p>
      </div>
    );
  }

  return (
    <Container className="mt-4">
      <div className="pl-3 pr-3">
        <Row className="mb-3 justify-content-between align-items-center">
          <Col>
            <h2 className="main-title mb-0">
              {id ? "Edit Ad" : "Add New Ad"}
            </h2>
            <Breadcrumb className="top-breadcrumb">
              <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
              <Breadcrumb.Item active>Ad Management</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
          <Col xs="auto">
            <Button variant="secondary" onClick={() => navigate(-1)}>
              Go Back
            </Button>
          </Col>
        </Row>

        <div className="form-container">
          <Form onSubmit={handleSubmit}>
            {/* Category */}
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Select
                name="category"
                options={categoryList.map((c) => ({
                  value: c._id,
                  label: c.categoryName,
                }))}
                value={
                  formData.category
                    ? {
                        value: formData.category,
                        label:
                          categoryList.find((x) => x._id === formData.category)
                            ?.categoryName || "Select Category",
                      }
                    : null
                }
                onChange={(selected) =>
                  setFormData((prev) => ({
                    ...prev,
                    category: selected ? selected.value : "",
                  }))
                }
              />
            </Form.Group>

            {/* City */}
            <Form.Group className="mb-3">
              <Form.Label>City</Form.Label>
              <Select
                name="city"
                options={cityList.map((c) => ({
                  value: c._id,
                  label: c.city,
                }))}
                value={
                  formData.city
                    ? {
                        value: formData.city,
                        label:
                          cityList.find((x) => x._id === formData.city)?.city ||
                          "Select City",
                      }
                    : null
                }
                onChange={(selected) =>
                  setFormData((prev) => ({
                    ...prev,
                    city: selected ? selected.value : "",
                  }))
                }
              />
            </Form.Group>

            {/* Position */}
            <Form.Group className="mb-3">
              <Form.Label>Position</Form.Label>
              <Form.Select
                name="position"
                value={formData.position}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Position --</option>
                <option value="top">Top</option>
                <option value="middle">Middle</option>
                <option value="bottom">Bottom</option>
              </Form.Select>
            </Form.Group>

            {/* URL */}
            <Form.Group className="mb-3">
              <Form.Label>Ad URL</Form.Label>
              <Form.Control
                type="text"
                name="url"
                value={formData.url}
                onChange={handleChange}
                placeholder="https://example.com"
              />
            </Form.Group>

            {/* Banner Image */}
            <Form.Group className="mb-4">
              <Form.Label>Banner Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleBannerFile}
              />
              {formData.image && !bannerFile && (
                <div className="mt-2 text-center">
                  <Image
                    src={formData.image}
                    thumbnail
                    style={{ width: "200px", height: "120px", objectFit: "cover" }}
                  />
                  <p className="small text-muted mt-1">Current Image</p>
                </div>
              )}
            </Form.Group>

            <Button type="submit" variant="primary">
              {id ? "Update Ad" : "Save Ad"}
            </Button>
          </Form>
        </div>
      </div>
    </Container>
  );
};

export default AdManagement;
