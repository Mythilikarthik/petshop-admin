import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Card, Spinner, Alert, Container, Breadcrumb } from "react-bootstrap";
import { FaMapMarkerAlt, FaVideo, FaPhoneVolume } from "react-icons/fa";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import useUnsavedChanges from "../Hooks/useUnsavedChanges";

const API_BASE =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_URL
    : "http://localhost:5000";

const AddEditOffers = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  // 1. Identify edit offer ID from location state or URL params (e.g., /user/edit-user/:offerId)
  const editId = location.state?.id || params.offerId || params.id || null;
  const isEditMode = !!editId;

  // 2. Retrieve User ID dynamically from URL params (e.g., /user/edit-user/:userId or /user/:userId) 
  // Fall back to localStorage if not found in route parameters
  const paramUserId = params.userId || params.userid;
  const rawUserId = paramUserId || localStorage.getItem("userId");
  const userId = rawUserId && rawUserId !== "[object Object]" ? rawUserId : "";

  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  const [formData, setFormData] = useState({
    category: "Offers / Discounts",
    businessListingId: "",
    businessName: "",
    businessLogo: "",
    neighborhood: "",
    city: "Chennai",
    phone: "",
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    primaryActions: [],
    bookNowUrl: "",
    media: [], 
    show: 1
  });

  const { shouldBlockNavigation, confirmLeave, markAsSaved } = useUnsavedChanges(formData);
  const [uploadingMedia, setUploadingMedia] = useState(false);

  // 🟢 Fetch User's Listing via User ID (from Route / LocalStorage)
  useEffect(() => {
    if (!userId || isEditMode) return; // Skip auto-fill if editing an existing offer

    const fetchUserListing = async () => {
      setFetchingData(true);
      try {
        const res = await fetch(`${API_BASE}/api/listing/user/${userId}`);
        const data = await res.json();

        if (res.ok && data.success && data.listing) {
          const listing = data.listing;

          // Extract phone number robustly
          let extractedPhone = listing.phone || "";
          if (typeof extractedPhone === "object") {
            extractedPhone = extractedPhone.phone || extractedPhone.mobile || "";
          }

          // Extract city name
          const cityName = listing.city?.city || listing.city?.name || (typeof listing.city === "string" ? listing.city : "Chennai");

          setFormData((prev) => ({
            ...prev,
            businessListingId: listing._id || "",
            businessName: listing.shopName || "",
            businessLogo: listing.bannerImage || (listing.photos && listing.photos[0]) || "",
            neighborhood: listing.address || "Local Area",
            city: cityName,
            phone: extractedPhone,
          }));
        } else {
          setErrorMsg("No active business listing found for this user account.");
        }
      } catch (err) {
        console.error("Error fetching user listing:", err);
        setErrorMsg("Failed to load business listing details.");
      } finally {
        setFetchingData(false);
      }
    };

    fetchUserListing();
  }, [userId, isEditMode]);

  // 🟢 Load Offer Details in Edit Mode
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
                category: target.category || "Offers / Discounts",
                businessListingId: target.business?.listingId || "",
                businessName: target.business?.name || "",
                businessLogo: target.business?.logo || "",
                neighborhood: target.business?.neighborhood || "",
                city: target.business?.city || "Chennai",
                phone: target.business?.phone || "", 
                title: target.title || "",
                description: target.description || "",
                startDate: target.startDate ? target.startDate.split("T")[0] : "",
                endDate: target.endDate ? target.endDate.split("T")[0] : "",
                primaryActions: target.primaryActions || [],
                bookNowUrl: target.bookNowUrl || "",
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (action) => {
    setFormData((prev) => {
      const currentActions = [...prev.primaryActions];
      let updatedActions = [];
      
      if (currentActions.includes(action)) {
        updatedActions = currentActions.filter((a) => a !== action);
      } else {
        currentActions.push(action);
        updatedActions = currentActions;
      }

      const extraUpdates = {};
      if (!updatedActions.includes("book_now")) {
        extraUpdates.bookNowUrl = "";
      }

      return { 
        ...prev, 
        primaryActions: updatedActions,
        ...extraUpdates
      };
    });
  };

  const handleMediaUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (formData.media.length >= 5) {
      alert("You can upload a maximum of 5 media items.");
      e.target.value = "";
      return;
    }

    if (file.type.startsWith("video/")) {
      const videoElement = document.createElement("video");
      videoElement.preload = "metadata";
      videoElement.src = URL.createObjectURL(file);

      videoElement.onloadedmetadata = async () => {
        window.URL.revokeObjectURL(videoElement.src);
        if (videoElement.duration > 12.5) {
          alert("Video run-length exceeds your strict 12-second limitation profile!");
          e.target.value = ""; 
          return;
        }
        await directMediaUploadFile(file);
      };
    } else {
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

  const removeMediaItem = (idxToDrop) => {
    setFormData((prev) => ({
      ...prev,
      media: prev.media.filter((_, idx) => idx !== idxToDrop)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.businessListingId) {
      setErrorMsg("No business listing linked to this account. Please create a business listing first.");
      return;
    }
    if (formData.media.length === 0) {
      setErrorMsg("Please upload at least one main image or a 12-second video asset.");
      return;
    }
    if (formData.primaryActions.includes("book_now") && !formData.bookNowUrl.trim()) {
      setErrorMsg("Please provide a valid Booking Link URL for your Call-to-Action button.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    const payload = {
      category: formData.category,
      business: {
        listingId: formData.businessListingId,
        name: formData.businessName,
        neighborhood: formData.neighborhood,
        city: formData.city,
        phone: formData.phone,
      },
      title: formData.title,
      description: formData.description,
      startDate: formData.startDate,
      endDate: formData.endDate,
      media: formData.media,
      primaryActions: formData.primaryActions,
      bookNowUrl: formData.primaryActions.includes("book_now") ? formData.bookNowUrl : "",
      show: Number(formData.show),
      userId: userId
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
        navigate("/offers-management"); 
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
      <Container className="mt-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2 text-muted">Loading business listing and offer details...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row className="mb-3 justify-content-end align-items-center">
        <Col>
          <h2 className="main-title mb-0">{isEditMode ? "Edit Offer" : "Create New Offer"}</h2>
          <Breadcrumb className="top-breadcrumb">
            <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
            <Breadcrumb.Item active>{isEditMode ? "Edit Offer" : "Create New Offer"}</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Col xs={"auto"}>
          <Button variant="secondary" onClick={() => {
            if (!confirmLeave()) return; 
            navigate(-1);
          }}>Go Back</Button>
        </Col>
      </Row>
      <div className="form-container">
        {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

        <Form onSubmit={handleSubmit}>
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

          {/* Business Profile Details Card */}
          <Row className="mb-4">
            <Col md={12}>
              <Card className="p-3 border rounded bg-light">
                <Form.Label className="fw-semibold text-muted mb-2">Connected Business Listing</Form.Label>
                {formData.businessName ? (
                  <div className="d-flex align-items-center gap-3">
                    {formData.businessLogo && (
                      <img 
                        src={formData.businessLogo.startsWith("http") ? formData.businessLogo : `${API_BASE}/${formData.businessLogo}`} 
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
                      <span className="text-muted extra-small d-block" style={{ fontSize: "12px" }}>
                        <FaPhoneVolume /> {formData.phone || "No phone linked"}
                      </span>
                      <span className="badge bg-success mt-1" style={{ fontSize: "10px" }}>✓ Linked to User Account</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-danger small">
                    No business listing found for this user account.
                  </div>
                )}
              </Card>
            </Col>
          </Row>

          <hr className="my-4 text-muted" />

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Title</Form.Label>
            <Form.Control required type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g. Flat 20% Off" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Description</Form.Label>
            <Form.Control required as="textarea" rows={4} name="description" value={formData.description} onChange={handleInputChange} />
          </Form.Group>

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

          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">Media</Form.Label>
            <Form.Text className="text-muted d-block mb-2">Upload multiple images or a short marketing video clip <strong> <br /> (Maximum limit: 5 Images , Video Clip limit: 12 Seconds)</strong>.</Form.Text>
            <Form.Control type="file" accept="image/*,video/*" onChange={handleMediaUpload} disabled={uploadingMedia} />
            
            {uploadingMedia && (
              <div className="d-flex align-items-center gap-2 mt-2 text-info small">
                <Spinner animation="grow" size="sm" /> <span>Transmitting asset binaries, validating time length metrics properties configurations...</span>
              </div>
            )}

            {formData.media.length > 0 && (
              <div className="d-flex gap-3 flex-wrap mt-3 p-3 rounded bg-light border">
                {formData.media.map((item, index) => (
                  <div key={index} className="position-relative border rounded bg-white p-1" style={{ width: "110px", height: "80px" }}>
                    {item.type === "video" ? (
                      <div className="w-100 h-100 d-flex flex-column align-items-center justify-content-center text-center bg-dark text-white rounded" style={{ fontSize: "10px" }}>
                        <span> <FaVideo /> Video Asset</span>
                        <span className="extra-small text-muted text-truncate px-1" style={{ maxWidth: "100%" }}>12s Passed</span>
                      </div>
                    ) : (
                      <img src={item.url.startsWith("http") ? item.url : `${API_BASE}/${item.url}`} alt="preview" className="w-100 h-100 rounded" style={{ objectFit: "cover" }} />
                    )}
                    <Button variant="danger" size="sm" className="position-absolute p-0 rounded-circle d-flex align-items-center justify-content-center border-0 shadow-sm" style={{ top: "-8px", right: "-8px", width: "20px", height: "20px", fontSize: "11px" }} onClick={() => removeMediaItem(index)}>✕</Button>
                  </div>
                ))}
              </div>
            )}
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">Status</Form.Label>
            <Form.Check 
              type="switch" 
              id="visibility-toggle-switch"
              label={Number(formData.show) === 1 ? "Shown" : "Hidden"}
              checked={Number(formData.show) === 1}
              onChange={(e) => {
                const visibilityValue = e.target.checked ? 1 : 0;
                setFormData(prev => ({ ...prev, show: visibilityValue }));
              }}
              style={{ fontSize: "1.1rem", cursor: "pointer" }}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold d-block">Choose Interactive Buttons</Form.Label>
            <div className="d-flex gap-4 flex-wrap mb-3">
              <Form.Check type="checkbox" id="cta-whatsapp" label="WhatsApp Chat" checked={formData.primaryActions.includes("whatsapp")} onChange={() => handleCheckboxChange("whatsapp")} />
              <Form.Check type="checkbox" id="cta-call" label="Phone Call" checked={formData.primaryActions.includes("call")} onChange={() => handleCheckboxChange("call")} />
              <Form.Check type="checkbox" id="cta-book" label="Book Appointment" checked={formData.primaryActions.includes("book_now")} onChange={() => handleCheckboxChange("book_now")} />
            </div>

            {formData.primaryActions.includes("book_now") && (
              <Form.Group className="p-3 border rounded bg-light transition-fade">
                <Form.Label className="fw-semibold text-dark">Appointment Booking Link / URL</Form.Label>
                <Form.Control 
                  type="url" 
                  name="bookNowUrl"
                  value={formData.bookNowUrl} 
                  onChange={handleInputChange} 
                  placeholder="https://example.com/bookings-or-calendar-page" 
                  required={formData.primaryActions.includes("book_now")}
                />
                <Form.Text className="text-muted">Enter the destination address users land on when pressing the booking interactive button.</Form.Text>
              </Form.Group>
            )}
          </Form.Group>

          <div className="d-flex gap-2 justify-content-end mt-5 border-top pt-3">
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