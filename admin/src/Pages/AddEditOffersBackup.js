import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Card, Spinner, Alert, Container, Breadcrumb } from "react-bootstrap";
import { FaMapMarkerAlt, FaVideo } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import useUnsavedChanges from "../Hooks/useUnsavedChanges";


const API_BASE =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_URL
    : "http://localhost:5000";

const AddEditOffers = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editId = location.state?.id || null; // Accesses ID if editing
  const isEditMode = !!editId;

  // Form State Layout Matrix
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [businessList, setBusinessList] = useState([]);
  
  const [formData, setFormData] = useState({
    category: "Offers / Discounts",
    businessListingId: "",
    businessName: "",
    businessLogo: "",
    neighborhood: "",
    city: "Chennai",
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    primaryActions: [],
    media: [], // Stores objects: { type: 'image'|'video', url: '...' }
    show: 1
  });
const { shouldBlockNavigation, confirmLeave, markAsSaved } =
    useUnsavedChanges(formData);
  // Media Upload Progress Tracking
  const [uploadingMedia, setUploadingMedia] = useState(false);

  useEffect(() => {
  const fetchBusinesses = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/offers/business/lookup`);
      const data = await res.json();
      if (data.success) {
        console.log(data.listings);
        setBusinessList(data.listings);
      }
    } catch (err) {
      console.error("Failed to query dropdown businesses items index", err.message);
    }
  };
  fetchBusinesses();
}, []);
  // 🔹 Fetch existing data if in Edit Mode
  useEffect(() => {
    if (isEditMode) {
      const fetchOfferDetails = async () => {
        setFetchingData(true);
        try {
          const res = await fetch(`${API_BASE}/api/offers`);
          const data = await res.json();
          if (data.success) {
            const target = data.offers.find((o) => o._id === editId);
            if (target) {
              setFormData({
                category: target.category,
                businessListingId: target.business?.listingId || "",
                businessName: target.business?.name || "",
                // businessLogo: target.business?.logo || "",
                neighborhood: target.business?.neighborhood || "",
                city: target.business?.city || "Chennai",
                title: target.title || "",
                description: target.description || "",
                startDate: target.startDate ? target.startDate.split("T")[0] : "",
                endDate: target.endDate ? target.endDate.split("T")[0] : "",
                primaryActions: target.primaryActions || [],
                media: target.media || [],
                show: target.show !== undefined ? target.show : 1
              });
            }
          }
        } catch (err) {
          console.error("Error fetching offer details:", err);
          setErrorMsg("Failed to load existing offer information.");
        } finally {
          setFetchingData(false);
        }
      };
      fetchOfferDetails();
    }
  }, [editId, isEditMode]);

  const handleBusinessDropdownChange = (e) => {
  const selectedId = e.target.value;
  if (!selectedId) return;

  const foundBusiness = businessList.find(b => b._id === selectedId);
  if (foundBusiness) {
    setFormData(prev => ({
      ...prev,
      businessListingId: selectedId,
      businessName: foundBusiness.shopName,
    //   businessLogo: foundBusiness.bannerImage || "", // Maps business banner image as logo reference context
      neighborhood: foundBusiness.address || "Local Area", // Fallback text default values helper configurations
      city: foundBusiness.city?.city || "Chennai" // Extract strings nested layer parameter
    }));
  }
};
  // Handle standard input updates
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle dynamic multi-select primary actions array checkbox toggles
  //  NEW FIXED CODE
const handleCheckboxChange = (action) => {
  setFormData((prev) => {
    const currentActions = [...prev.primaryActions];
    if (currentActions.includes(action)) {
      return { 
        ...prev, 
        primaryActions: currentActions.filter((a) => a !== action) 
      };
    } else {
      currentActions.push(action);
      return { ...prev, primaryActions: currentActions };
    }
  });
};

  // 🔹 Handle Business Logo file asset generation upload
  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append("file", file);

    try {
      const res = await fetch(`${API_BASE}/api/offers/upload-media`, {
        method: "POST",
        body: uploadData,
      });
      const data = await res.json();
      if (data.success) {
        setFormData((prev) => ({ ...prev, businessLogo: data.url }));
      } else {
        alert(data.error || "Logo upload failed");
      }
    } catch (err) {
      console.error("Logo upload error:", err);
    }
  };

  // 🔹 Handle Feed Banner Media Input System (Supports images and strict 12s videos)
  const handleMediaUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Client-Side Video Duration Pre-validation Layer
    if (file.type.startsWith("video/")) {
      const videoElement = document.createElement("video");
      videoElement.preload = "metadata";
      videoElement.src = URL.createObjectURL(file);

      videoElement.onloadedmetadata = async () => {
        window.URL.revokeObjectURL(videoElement.src);
        if (videoElement.duration > 122.5) {
          alert("Video run-length exceeds your strict 12-second limitation profile!");
          e.target.value = ""; 
          return;
        }
        // Proceed with video transmission if inside specifications bounds
        await directMediaUploadFile(file);
      };
    } else {
      // Direct asset piping for normal images
      await directMediaUploadFile(file);
    }
  };

  const directMediaUploadFile = async (file) => {
    setUploadingMedia(true);
    const uploadData = new FormData();
    uploadData.append("file", file);

    try {
      const res = await fetch(`${API_BASE}/api/offers/upload-media`, {
        method: "POST",
        body: uploadData,
      });
      const data = await res.json();
      if (data.success) {
        // Appends file parameters context directly onto array to manage layouts sliders carousels 
        setFormData((prev) => ({
          ...prev,
          media: [...prev.media, { type: data.type, url: data.url }]
        }));
      } else {
        alert(data.error || "Media asset upload process rejected.");
      }
    } catch (err) {
      console.error("Media upload error:", err);
    } finally {
      setUploadingMedia(false);
    }
  };

  // Remove uploaded element index reference array node 
  const removeMediaItem = (idxToDrop) => {
    setFormData((prev) => ({
      ...prev,
      media: prev.media.filter((_, idx) => idx !== idxToDrop)
    }));
  };

  // 🔹 Form Submission Handling Matrix (Transforms data to meet Schema constraints)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.businessListingId) {
        setErrorMsg("Please select a valid business listing from the dropdown matrix.");
        return;
    }
    if (formData.media.length === 0) {
      setErrorMsg("Please upload at least one main feed image or a 12-second video asset.");
      return;
    }
    // if (!formData.businessLogo) {
    //   setErrorMsg("Please upload a business brand profile logo.");
    //   return;
    // }

    setLoading(true);
    setErrorMsg("");

    const payload = {
      category: formData.category,
      business: {
        listingId: formData.businessListingId,
        name: formData.businessName,
        // logo: formData.businessLogo,
        neighborhood: formData.neighborhood,
        city: formData.city
      },
      title: formData.title,
      description: formData.description,
      startDate: formData.startDate,
      endDate: formData.endDate,
      media: formData.media,
      primaryActions: formData.primaryActions,
      show: Number(formData.show)
    };

    const targetUrl = isEditMode ? `${API_BASE}/api/offers/${editId}` : `${API_BASE}/api/offers`;
    const targetMethod = isEditMode ? "PUT" : "POST";

    try {
      const res = await fetch(targetUrl, {
        method: targetMethod,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        alert(isEditMode ? "Offer updated cleanly!" : "New offer saved successfully!");
        markAsSaved();
        navigate("/offers-management"); // Returns route visibility matrix focus onto summary logs view dashboard table
      } else {
        setErrorMsg(data.message || "Failed to commit record updates transactions.");
      }
    } catch (err) {
      console.error("Form handling commit failure error log:", err);
      setErrorMsg("Network error occurred processing system entries mappings.");
    } finally {
      setLoading(false);
    }
  };

  if (fetchingData) {
    return (
      <div className="text-center py-5 mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2 text-muted">Parsing system records payload parameters structure matrices...</p>
      </div>
    );
  }

  return (
    <Container className="mt-4">
      <Row className='mb-3 justify-content-end align-items-center'>
        <Col>
          <h2 className='main-title mb-0'>{isEditMode ? "Edit Offer" : "Create New Offer"}</h2>
          <Breadcrumb className='top-breadcrumb'>
            <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
            <Breadcrumb.Item active>{isEditMode ? "Edit Offer" : "Create New Offer"}</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Col xs={'auto'}>
          <Button variant="secondary" onClick={() => {
            if (!confirmLeave()) return; 
            navigate(-1)
          }}>Go Back</Button>
        </Col>
      </Row>
    <div className='form-container'>
      
        {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

        <Form onSubmit={handleSubmit}>
          {/* Section 1: Classification Parameter configurations layout metrics */}
          <Row className="mb-3">
            <Col md={12}>
              <Form.Group>
                <Form.Label className="fw-semibold">Category</Form.Label>
                <Form.Select name="category" value={formData.category} onChange={handleInputChange}>
                  <option value="Offers / Discounts">Offers & Deals</option>
                  <option value="Events">Events</option>
                  <option value="Announcements">Announcements</option>
                </Form.Select>
              </Form.Group>
            </Col>
            
          </Row>

          {/* Section 2: Logo Tracking & Geolocation metrics configurations mapping parameters fields */}
          {/* Section 1.5 Real Directory Business dropdown selector linkage UI element */}
<Row className="mb-4">
  <Col md={12}>
    <Card className="border-0 " >
      <Form.Group>
        <Form.Label className="fw-semibold">Business Listing</Form.Label>
        <Form.Select 
          value={formData.businessListingId || ""} 
          onChange={handleBusinessDropdownChange}
          required
        >
          <option value="">-- Select Business Listing --</option>
          {businessList.map((biz) => (
            <option key={ biz._id } value={ biz._id }>
              { biz.shopName } ({ biz.city?.city || "Chennai" })
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      {/* Dynamic Auto-populated Metadata Info Box Tracker */}
      {formData.businessName && (
        <div className="d-flex align-items-center gap-3 mt-3 pt-3 border-top">
          {formData.businessLogo && (
            <img 
              src={formData.businessLogo.startsWith('http') ? formData.businessLogo : `${API_BASE}/${formData.businessLogo}`} 
              alt="Shop Logo preview" 
              style={{ width: "50px", height: "50px", borderRadius: "8px", objectFit: "cover" }}
              className="border bg-white"
            />
          )}
          <div>
            <h6 className="m-0 fw-bold text-dark">{formData.businessName}</h6>
            <span className="text-muted extra-small d-block" style={{ fontSize: "12px" }}>
               <FaMapMarkerAlt /> {formData.neighborhood}, {formData.city}
            </span>
            <span className="badge bg-success mt-1" style={{ fontSize: "10px" }}>✓ Auto-Mapped Profile Verified Link</span>
          </div>
        </div>
      )}
    </Card>
  </Col>
</Row>

          <hr className="my-4 text-muted" />

          {/* Section 3: Descriptive text components entries metrics boxes */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Title</Form.Label>
            <Form.Control required type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g. Flat 20% Off" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Description</Form.Label>
            <Form.Control required as="textarea" rows={4} name="description" value={formData.description} onChange={handleInputChange} placeholder="" />
          </Form.Group>

          {/* Section 4: Validation Range Calendars Schedules tracking fields box metrics logs */}
          <Row className="mb-4">
            <Col md={6} xs={12}>
              <Form.Group>
                <Form.Label className="fw-semibold">Start Date</Form.Label>
                <Form.Control required type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} />
              </Form.Group>
            </Col>
            <Col md={6} xs={12}>
              <Form.Group>
                <Form.Label className="fw-semibold">End Date</Form.Label>
                <Form.Control required type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} />
              </Form.Group>
            </Col>
          </Row>

          <hr className="my-4 text-muted" />

          {/* Section 5: Media Upload Processing Grid System Component (12-second validation enforcement) */}
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">Media</Form.Label>
            <Form.Text className="text-muted d-block mb-2">Upload multiple images or a short marketing video clip <strong> <br />
            (Maximum limit: 12 Seconds)</strong>.</Form.Text>
            <Form.Control type="file" accept="image/*,video/*" onChange={handleMediaUpload} disabled={uploadingMedia} />
            
            {uploadingMedia && (
              <div className="d-flex align-items-center gap-2 mt-2 text-info small">
                <Spinner animation="grow" size="sm" /> <span>Transmitting asset binaries, validating time length metrics properties configurations...</span>
              </div>
            )}

            {/* In-form file inventory thumbnail matrices logs trackers view maps */}
            {formData.media.length > 0 && (
              <div className="d-flex gap-3 flex-wrap mt-3 p-3 rounded bg-light border">
                {formData.media.map((item, index) => (
                  <div key={index} className="position-relative border rounded bg-white p-1" style={{ width: "110px", height: "80px" }}>
                    {item.type === 'video' ? (
                      <div className="w-100 h-100 d-flex flex-column align-items-center justify-content-center text-center bg-dark text-white rounded" style={{ fontSize: "10px" }}>
                        <span> <FaVideo /> Video Asset</span>
                        <span className="extra-small text-muted text-truncate px-1" style={{ maxWidth: "100%" }}>12s Passed</span>
                      </div>
                    ) : (
                      <img src={item.url.startsWith('http') ? item.url : `${API_BASE}/${item.url}`} alt="preview" className="w-100 h-100 rounded" style={{ objectFit: "cover" }} />
                    )}
                    <Button variant="danger" size="sm" className="position-absolute p-0 rounded-circle d-flex align-items-center justify-content-center border-0 shadow-sm" style={{ top: "-8px", right: "-8px", width: "20px", height: "20px", fontSize: "11px" }} onClick={() => removeMediaItem(index)}>✕</Button>
                  </div>
                ))}
              </div>
            )}
          </Form.Group>
          {/* Section 5.5: Visibility Toggle Switch Component */}
<Form.Group className="mb-4">
  <Form.Label className="fw-semibold">Status</Form.Label>
  <Form.Check 
    type="switch" // toggle pill layout. Use type="checkbox" if you want a basic box structure
    id="visibility-toggle-switch"
    label={Number(formData.show) === 1 ? "Shown" : "Hidden"}
    checked={Number(formData.show) === 1}
    onChange={(e) => {
      // If checked -> 1, if unchecked -> 0
      const visibilityValue = e.target.checked ? 1 : 0;
      setFormData(prev => ({ ...prev, show: visibilityValue }));
    }}
    style={{ fontSize: "1.1rem", cursor: "pointer" }}
  />
  {/* <Form.Text className="text-muted d-block mt-1">
    Uncheck this box to instantly pull the feed item from your user-facing interfaces without deleting it.
  </Form.Text> */}
</Form.Group>

          {/* Section 6: CTA Routing Action Triggers Flags check boxes config controls mapping array */}
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold d-block">Choose Interactive Buttons</Form.Label>
            {/* <Form.Text className="text-muted d-block mb-3">Choose which interactive shortcut triggers are dynamically added onto card summary block footprints views layout structures matrix elements fields.</Form.Text> */}
            <div className="d-flex gap-4 flex-wrap">
              <Form.Check type="checkbox" id="cta-whatsapp" label="WhatsApp Chat" checked={formData.primaryActions.includes("whatsapp")} onChange={() => handleCheckboxChange("whatsapp")} />
              <Form.Check type="checkbox" id="cta-call" label="Phone Call" checked={formData.primaryActions.includes("call")} onChange={() => handleCheckboxChange("call")} />
              <Form.Check type="checkbox" id="cta-book" label="Book Appointment" checked={formData.primaryActions.includes("book_now")} onChange={() => handleCheckboxChange("book_now")} />
            </div>
          </Form.Group>

          {/* Controls Footer buttons bars templates panels grids widgets row elements layout mappings */}
          <div className="d-flex gap-2 justify-content-end mt-5 border-top pt-3">
            {/* <Button variant="light" onClick={() => navigate("/offers-management")} disabled={loading} style={{ borderRadius: "8px", fontWeight: 500, padding: "0.6rem 1.5rem" }}>Cancel</Button> */}
            <Button variant="primary" type="submit" disabled={loading || uploadingMedia} style={{ borderRadius: "8px", fontWeight: 600, padding: "0.6rem 2rem", backgroundColor: "#ff4e00", borderColor: "#ff4e00" }}>
              {loading ? <Spinner animation="border" size="sm" /> : isEditMode ? "Save Changes" : "Save"}
            </Button>
          </div>
        </Form>
      
    </div>
    </Container>
  );
};

export default AddEditOffers;