import React, { useState, useEffect, useRef } from 'react'
import { Container, Row, Col, Breadcrumb, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import useUnsavedChanges from "../Hooks/useUnsavedChanges";
const API_BASE = process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_URL
    : "http://localhost:5000";

const BannerManagement = () => {
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    banner: [],
  });
  //     const [banner, setBanner] = useState(null);
  // const [bannerPreview, setBannerPreview] = useState(null);
  const [existingBanners, setExistingBanners] = useState([]);
const [newBanners, setNewBanners] = useState([]);
  const navigate = useNavigate();

  const { shouldBlockNavigation, confirmLeave, markAsSaved } = useUnsavedChanges(formData);
  // const handleBannerChange = (e) => {
  //   const file = e.target.files[0];
  //   if (!file) return;
  
  //   const img = new window.Image(); // ✅ IMPORTANT
  //   img.src = URL.createObjectURL(file);
  
  //   img.onload = () => {
  //     if (img.width === 1200 && img.height === 300) {
  //       setBanner(file);
  //       setBannerPreview(img.src);
  //       setFormData({ banner: file });
  //     } else {
  //       alert(`${file.name} rejected ❌\nImage must be exactly 1200 × 300`);
  //       e.target.value = "";
  //     }
  //   };
  // };
  const handleBannerChange = (e) => {
    const files = Array.from(e.target.files);

    if (!files.length) return;

    const validImages = [];

    files.forEach((file) => {

        const img = new Image();

        img.src = URL.createObjectURL(file);

        img.onload = () => {

            if (img.width !== 1200 || img.height !== 300) {

                alert(`${file.name} must be exactly 1200 × 300`);

                return;

            }

            validImages.push({

                file,

                preview: img.src,

                alt: ""

            });

            if (validImages.length === files.length) {

                setNewBanners(prev => [...prev, ...validImages]);

                setFormData({
                    banners: [...newBanners, ...validImages]
                });

            }

        };

    });

};
  const handleGoBack = () => {
    if (!confirmLeave()) return; // user canceled
      navigate(-1);
    };
    const handleSubmit = async (e) => {
  e.preventDefault();

  // if (!banner) return alert("Please select banner");
if (newBanners.length === 0)
    return alert("Please select at least one banner");
  try {
    // const formData = new FormData();
    // formData.append("banner", banner);
    const formData = new FormData();

newBanners.forEach((item) => {
    formData.append("banners", item.file);
    formData.append("alts", item.alt);
});

    const res = await fetch(`${API_BASE}/api/directory-banner`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Upload failed");

    markAsSaved();
    //alert("Banner saved successfully");
    fileInputRef.current.value="";
    setNewBanners([]);
    setFormData({ banners: [] });

    await fetchBanner();

    alert("Banner saved successfully");
  } catch (err) {
    alert("Something went wrong");
  }
};
const fetchBanner = async () => {
    const res = await fetch(`${API_BASE}/api/directory-banner`);
    const data = await res.json();
    console.log(data);
    // if (data.banner) {
    //   setBannerPreview(data.banner.banner);
    // }
    if (data.banner) {
    setExistingBanners(data.banner.banners || []);
}
  };


  useEffect(() => {
  

  fetchBanner();
}, []);
const handleDelete = async () => {
  if (!window.confirm("Are you sure you want to delete this banner?")) return;

  try {
    const res = await fetch(`${API_BASE}/api/directory-banner/delete`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Delete failed");

    // setBanner(null);
    // setBannerPreview(null);
    // setFormData({ banner: null });
    setExistingBanners([]);
setNewBanners([]);

setFormData({
    banners:[]
});
    fileInputRef.current.value="";
    markAsSaved();
    alert("Banner deleted successfully");
    navigate("/directory-banner-management");
  } catch (err) {
    alert("Failed to delete banner");
  }
};
const handleDeleteImage = async (imageId) => {

    if (!window.confirm("Delete this image?")) return;

    try {

        const res = await fetch(
            `${API_BASE}/api/directory-banner/image/${imageId}`,
            {
                method: "DELETE",
            }
        );

        const data = await res.json();

        if (!res.ok) throw new Error(data.message);

        setExistingBanners(prev =>
            prev.filter(img => img._id !== imageId)
        );

        alert("Image deleted successfully");
        navigate("/directory-banner-management");

    } catch (err) {

        alert(err.message);

    }

};

  return (
    <Container className="mt-4">
      <div className="pl-3 pr-3">
        <Row className="mb-3 justify-content-end align-items-center">
          <Col>
            <h2 className="main-title mb-0">
              {/* {bannerPreview ? "Edit Directory Banner" : "Add Directory Banner"} */}
              {existingBanners.length > 0 ? "Edit Directory Banner" : "Add Directory Banner"}
            </h2>
            <Breadcrumb className="top-breadcrumb">
              <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
              <Breadcrumb.Item active>{existingBanners.length > 0 ? "Edit Directory Banner" : "Add Directory Banner"}</Breadcrumb.Item>
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
            {existingBanners.length > 0 && (

<div className="mb-4">

    {existingBanners.map((item,index)=>(

        <div
            key={index}
            className="mb-3"
        >

            <img
                src={`${API_BASE}/${item.image}`}
                alt={item.alt}
                style={{
                    width:"100%",
                    height:"300px",
                    objectFit:"contain",
                    background:"#f5f5f5",
                    borderRadius:"8px"
                }}
            />

            {/* <p className="mt-2">
                {item.alt}
            </p> */}
            <p className="mt-2">{item.alt}</p>

<Button
    variant="danger"
    size="sm"
    onClick={() => handleDeleteImage(item._id)}
>
    Delete Image
</Button>

        </div>

    ))}

</div>

)}
            {/* {bannerPreview && (
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
            )} */}
            <div className="d-flex gap-2">
              <Button variant="primary" type="submit">
                Save
              </Button>

              {/* {existingBanners.length > 0 && (
                <Button variant="danger" onClick={handleDelete}>
                  Delete
                </Button>
              )} */}
            </div>

          </Form>
        </div>
      </div>
    </Container>
  );
};

export default BannerManagement