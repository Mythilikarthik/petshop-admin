import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col, Breadcrumb } from "react-bootstrap";
import useUnsavedChanges from "../Hooks/useUnsavedChanges";
import ParaEditor from "../Layout/ParaEditor";

const API_BASE =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_URL
    : "http://localhost:5000";

const AddCityBanner = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const cityId = state?.cityId || null;
console.log(cityId);
  const fileInputRef = useRef(null);

  const [cityList, setCityList] = useState([]);
  const [banner, setBanner] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);

  // const [formData, setFormData] = useState({
  //   city: "",
  // });
  const [formData, setFormData] = useState({
  city: "",
  content: "",
  metaTitle: "",
  metaDescription: "",
  metaKeywords: "",
});

  const { confirmLeave, markAsSaved } = useUnsavedChanges(formData);

  /* -------------------- Fetch cities -------------------- */
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/city/show`);
        const data = await res.json();
        setCityList(data.cities || []);
      } catch (err) {
        console.error("Failed to load cities");
      }
    };
    fetchCities();
  }, []);

  /* -------------------- Load banner (EDIT MODE) -------------------- */
  useEffect(() => {
    if (!cityId) return;

    const fetchBanner = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/city-banner/${cityId}`);
        const data = await res.json();

        if (data.banner) {
          // setFormData({ city: data.banner.city });
          setFormData({
            city: data.banner.city?._id || data.banner.city,
            content: data.banner.content || "",
            metaTitle: data.banner.metaTitle || "",
            metaDescription: data.banner.metaDescription || "",
            metaKeywords: data.banner.metaKeywords || "",
          });
          setBannerPreview(data.banner.banner);
        }
      } catch (err) {
        console.error("Failed to load banner");
      }
    };

    fetchBanner();
  }, [cityId]);

  /* -------------------- Image validation -------------------- */
  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      if (img.width === 1200 && img.height === 300) {
        setBanner(file);
        setBannerPreview(img.src);
      } else {
        alert("Image must be exactly 1200 × 300");
        fileInputRef.current.value = "";
      }
    };
  };

  /* -------------------- Submit -------------------- */
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.city) return alert("Please select a city");
//     if (!banner && !bannerPreview) return alert("Please upload banner");

//     try {
//       const fd = new FormData();
//       fd.append("city", formData.city);
//       if (banner) fd.append("banner", banner);

//       const res = await fetch(`${API_BASE}/api/city-banner`, {
//         method: "POST",
//         body: fd,
//       });

//       const data = await res.json();

//       if (!res.ok) throw new Error(data.message);

//       markAsSaved();
//       alert(data.message);
//       navigate("/city-banner-management");
//     } catch (err) {
//       alert(err.message || "Something went wrong");
//     }
//   };
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.city) return alert("Please select a city");
  if (!banner && !bannerPreview) return alert("Please upload banner");

  try {
    const fd = new FormData();
    fd.append("city", formData.city);
    fd.append("content", formData.content);
    fd.append("metaTitle", formData.metaTitle);
    fd.append("metaDescription", formData.metaDescription);
    fd.append("metaKeywords", formData.metaKeywords);
    if (banner) fd.append("banner", banner);

    const url = cityId
      ? `${API_BASE}/api/city-banner/${cityId}` // EDIT
      : `${API_BASE}/api/city-banner`;          // ADD

    const method = cityId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      body: fd,
    });

    const data = await res.json();

    if (!res.ok) {
      // 🔴 SHOW PROPER ALERT
      if (res.status === 409) {
        alert("Banner already added for this city");
      } else {
        alert(data.message || "Something went wrong");
      }
      return;
    }

    markAsSaved();
    alert(data.message);
    navigate("/city-banner-management");
  } catch (err) {
    alert("Server error");
  }
};


  /* -------------------- Back -------------------- */
  const handleGoBack = () => {
    if (!confirmLeave()) return;
    navigate(-1);
  };

  return (
    <Container className="mt-4">
      <div className="pl-3 pr-3">
        <Row className="mb-3 justify-content-between align-items-center">
          <Col>
            <h2 className="main-title mb-0">
              {cityId ? "Edit City Banner" : "Add City Banner"}
            </h2>
            <Breadcrumb className="top-breadcrumb">
              <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
              <Breadcrumb.Item active>
                {cityId ? "Edit City Banner" : "Add City Banner"}
              </Breadcrumb.Item>
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
            {/* City */}
            <Form.Group className="mb-3">
              <Form.Label>
                City <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
                value={formData.city}
                onChange={(e) =>
                  setFormData({ city: e.target.value })
                }
                disabled={!!cityId}
                required
              >
                <option value="">-- Select City --</option>
                {cityList.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.city}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {/* Banner */}
            <Form.Group className="mb-4">
              <Form.Label>Banner Image (1200 × 300)</Form.Label>
              <Form.Control
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleBannerChange}
                ref={fileInputRef}
              />
            </Form.Group>

            {bannerPreview && (
              <img
                src={bannerPreview}
                alt="Preview"
                style={{
                  width: "100%",
                  height: "300px",
                  objectFit: "contain",
                  background: "#f5f5f5",
                  borderRadius: "8px",
                  marginBottom: "15px",
                }}
              />
            )}
            <Form.Group className="mb-4">
              <Form.Label>Content</Form.Label>

              <ParaEditor
                value={formData.content}
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    content: value,
                  })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Meta Title</Form.Label>
              <Form.Control
                type="text"
                value={formData.metaTitle}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    metaTitle: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Meta Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.metaDescription}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    metaDescription: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Meta Keywords</Form.Label>
              <Form.Control
                type="text"
                placeholder="pet clinic, vet, grooming"
                value={formData.metaKeywords}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    metaKeywords: e.target.value,
                  })
                }
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

export default AddCityBanner;
