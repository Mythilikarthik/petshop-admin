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
  // const [banner, setBanner] = useState(null);
  // const [bannerPreview, setBannerPreview] = useState(null);
  const [existingImages, setExistingImages] = useState([]);
const [newImages, setNewImages] = useState([]);
const [deletedImages, setDeletedImages] = useState([]);

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

        // if (data.banner) {
        //   // setFormData({ city: data.banner.city });
        //   setFormData({
        //     city: data.banner.city?._id || data.banner.city,
        //     content: data.banner.content || "",
        //     metaTitle: data.banner.metaTitle || "",
        //     metaDescription: data.banner.metaDescription || "",
        //     metaKeywords: data.banner.metaKeywords || "",
        //   });
        //   //setBannerPreview(data.banner.banner);
        // }
        if (data.banner) {

    setFormData({
        city: data.banner.city?._id || data.banner.city,
        content: data.banner.content || "",
        metaTitle: data.banner.metaTitle || "",
        metaDescription: data.banner.metaDescription || "",
        metaKeywords: data.banner.metaKeywords || "",
    });

    const imgs = (data.banner.images || []).map(img => ({

        _id: img._id,
        image: img.image,
        alt: img.alt || ""

    }));

    setExistingImages(imgs);

}
      } catch (err) {
        console.error("Failed to load banner");
      }
    };

    fetchBanner();
  }, [cityId]);

  /* -------------------- Image validation -------------------- */
  // const handleBannerChange = (e) => {
  //   const file = e.target.files[0];
  //   if (!file) return;

  //   const img = new Image();
  //   img.src = URL.createObjectURL(file);

  //   img.onload = () => {
  //     if (img.width === 1200 && img.height === 300) {
  //       setBanner(file);
  //       setBannerPreview(img.src);
  //     } else {
  //       alert("Image must be exactly 1200 × 300");
  //       fileInputRef.current.value = "";
  //     }
  //   };
  // };
  /* -------------------- Upload Multiple Images -------------------- */
const handleBannerChange = (e) => {
  const files = Array.from(e.target.files);

  files.forEach((file) => {
    const img = new Image();

    img.src = URL.createObjectURL(file);

    img.onload = () => {
      if (img.width !== 1200 || img.height !== 300) {
        alert(`${file.name} must be exactly 1200 × 300`);
        return;
      }

      setNewImages((prev) => [
        ...prev,
        {
          file,
          preview: img.src,
          alt: "",
        },
      ]);
    };
  });

  fileInputRef.current.value = "";
};

/* -------------------- Delete Existing Image -------------------- */

const removeExistingImage = (index) => {
  const img = existingImages[index];

  setDeletedImages((prev) => [...prev, img._id]);

  setExistingImages((prev) =>
    prev.filter((_, i) => i !== index)
  );
};

/* -------------------- Delete New Image -------------------- */

const removeNewImage = (index) => {
  setNewImages((prev) =>
    prev.filter((_, i) => i !== index)
  );
};

/* -------------------- Existing Image ALT -------------------- */

const updateExistingAlt = (index, value) => {
  setExistingImages((prev) =>
    prev.map((img, i) =>
      i === index
        ? { ...img, alt: value }
        : img
    )
  );
};

/* -------------------- New Image ALT -------------------- */

const updateNewAlt = (index, value) => {
  setNewImages((prev) =>
    prev.map((img, i) =>
      i === index
        ? { ...img, alt: value }
        : img
    )
  );
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
// const handleSubmit = async (e) => {
//   e.preventDefault();

//   if (!formData.city) return alert("Please select a city");
//   if (!banner && !bannerPreview) return alert("Please upload banner");

//   try {
//     const fd = new FormData();
//     fd.append("city", formData.city);
//     fd.append("content", formData.content);
//     fd.append("metaTitle", formData.metaTitle);
//     fd.append("metaDescription", formData.metaDescription);
//     fd.append("metaKeywords", formData.metaKeywords);
//     if (banner) fd.append("banner", banner);

//     const url = cityId
//       ? `${API_BASE}/api/city-banner/${cityId}` // EDIT
//       : `${API_BASE}/api/city-banner`;          // ADD

//     const method = cityId ? "PUT" : "POST";

//     const res = await fetch(url, {
//       method,
//       body: fd,
//     });

//     const data = await res.json();

//     if (!res.ok) {
//       // 🔴 SHOW PROPER ALERT
//       if (res.status === 409) {
//         alert("Banner already added for this city");
//       } else {
//         alert(data.message || "Something went wrong");
//       }
//       return;
//     }

//     markAsSaved();
//     alert(data.message);
//     navigate("/city-banner-management");
//   } catch (err) {
//     alert("Server error");
//   }
// };
// const handleSubmit = async (e) => {
//   e.preventDefault();

//   if (!formData.city) {
//     alert("Please select a city");
//     return;
//   }

//   if (
//     existingImages.length === 0 &&
//     newImages.length === 0
//   ) {
//     alert("Please upload at least one image");
//     return;
//   }

//   try {
//     const fd = new FormData();

//     fd.append("city", formData.city);
//     fd.append("content", formData.content);
//     fd.append("metaTitle", formData.metaTitle);
//     fd.append("metaDescription", formData.metaDescription);
//     fd.append("metaKeywords", formData.metaKeywords);

//     /* Existing Images */
//     fd.append(
//       "existingImages",
//       JSON.stringify(existingImages)
//     );

//     /* Deleted Images */
//     fd.append(
//       "deletedImages",
//       JSON.stringify(deletedImages)
//     );

//     /* New Images */

//     newImages.forEach((img) => {

//       fd.append("images", img.file);

//       fd.append("alt", img.alt);

//     });

//     const url = cityId
//       ? `${API_BASE}/api/city-banner/${cityId}`
//       : `${API_BASE}/api/city-banner`;

//     const method = cityId ? "PUT" : "POST";

//     const res = await fetch(url, {
//       method,
//       body: fd,
//     });

//     const data = await res.json();

//     if (!res.ok) {

//       if (res.status === 409) {
//         alert("Banner already exists");
//       } else {
//         alert(data.message || "Something went wrong");
//       }

//       return;
//     }

//     markAsSaved();

//     alert(data.message);

//     navigate("/city-banner-management");

//   } catch (err) {

//     console.error(err);

//     alert("Server Error");

//   }
// };
/* -------------------- Updated Frontend Submit -------------------- */
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.city) {
    alert("Please select a city");
    return;
  }

  if (existingImages.length === 0 && newImages.length === 0) {
    alert("Please upload at least one image");
    return;
  }

  try {
    const fd = new FormData();

    fd.append("city", formData.city);
    fd.append("content", formData.content);
    fd.append("metaTitle", formData.metaTitle);
    fd.append("metaDescription", formData.metaDescription);
    fd.append("metaKeywords", formData.metaKeywords);

    /* Existing Images */
    fd.append("existingImages", JSON.stringify(existingImages));

    /* Deleted Images */
    fd.append("deletedImages", JSON.stringify(deletedImages));

    /* New Images */
    newImages.forEach((img) => {
      // ✅ FIX 1: Must match upload.array("newImages") on POST route
      // ✅ FIX 2: Must match upload.array("images") on PUT route
      if (cityId) {
        fd.append("images", img.file);
      } else {
        fd.append("newImages", img.file); 
      }

      // ✅ FIX 3: Append to 'altTexts' so backend array index parsing works perfectly
      fd.append("altTexts", img.alt); 
    });

    const url = cityId
      ? `${API_BASE}/api/city-banner/${cityId}`
      : `${API_BASE}/api/city-banner`;

    const method = cityId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      body: fd,
    });

    const data = await res.json();

    if (!res.ok) {
      if (res.status === 409) {
        alert("Banner already exists");
      } else {
        alert(data.message || "Something went wrong");
      }
      return;
    }

    markAsSaved();
    alert(data.message);
    navigate("/city-banner-management");
  } catch (err) {
    console.error(err);
    alert("Server Error");
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
                multiple
                accept="image/jpeg,image/png,image/webp"
                onChange={handleBannerChange}
                ref={fileInputRef}
              />
            </Form.Group>
{/* Existing Images */}

{existingImages.length > 0 && (
  <>
    <h5 className="mb-3">Existing Images</h5>

    <Row className="mb-4">
      {existingImages.map((img, index) => (
        <Col md={4} lg={3} key={img._id || index} className="mb-4">

          <div className="border rounded p-2">

            <img
              src={`${API_BASE}/${img.image}`}
              alt={img.alt}
              style={{
                width: "100%",
                height: "180px",
                objectFit: "cover",
                borderRadius: "5px",
              }}
            />

            <Form.Control
              className="mt-2"
              placeholder="Alt text"
              value={img.alt}
              onChange={(e) =>
                updateExistingAlt(index, e.target.value)
              }
            />

            <Button
              variant="danger"
              size="sm"
              className="mt-2 w-100"
              onClick={() => removeExistingImage(index)}
            >
              Delete
            </Button>

          </div>

        </Col>
      ))}
    </Row>
  </>
)}
{/* New Images */}

{newImages.length > 0 && (
  <>
    <h5 className="mb-3">New Images</h5>

    <Row className="mb-4">
      {newImages.map((img, index) => (
        <Col md={4} lg={3} key={index} className="mb-4">

          <div className="border rounded p-2">

            <img
              src={img.preview}
              alt=""
              style={{
                width: "100%",
                height: "180px",
                objectFit: "cover",
                borderRadius: "5px",
              }}
            />

            <Form.Control
              className="mt-2"
              placeholder="Alt text"
              value={img.alt}
              onChange={(e) =>
                updateNewAlt(index, e.target.value)
              }
            />

            <Button
              variant="danger"
              size="sm"
              className="mt-2 w-100"
              onClick={() => removeNewImage(index)}
            >
              Delete
            </Button>

          </div>

        </Col>
      ))}
    </Row>
  </>
)}
            {/* {bannerPreview && (
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
            )} */}

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
