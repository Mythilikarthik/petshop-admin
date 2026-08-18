// import React, { useState, useEffect } from "react";
// import { Form, Button, Row, Col, Card, Spinner, Alert, Container, Breadcrumb } from "react-bootstrap";
// import { FaMapMarkerAlt, FaVideo, FaPhoneVolume } from "react-icons/fa";
// import { useNavigate, useLocation } from "react-router-dom";
// import useUnsavedChanges from "../Hooks/useUnsavedChanges";

// const API_BASE =
//   process.env.NODE_ENV === "production"
//     ? process.env.REACT_APP_API_URL
//     : "http://localhost:5000";

// const AddEditOffers = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const editId = location.state?.id || null;
//   const isEditMode = !!editId;

//   const [loading, setLoading] = useState(false);
//   const [fetchingData, setFetchingData] = useState(false);
//   const [errorMsg, setErrorMsg] = useState("");
//   const [businessList, setBusinessList] = useState([]);
  
//   const [formData, setFormData] = useState({
//     category: "Offers / Discounts",
//     businessListingId: "",
//     businessName: "",
//     businessLogo: "",
//     neighborhood: "",
//     city: "Chennai",
//     phone : "",
//     title: "",
//     description: "",
//     startDate: "",
//     endDate: "",
//     primaryActions: [],
//     bookNowUrl: "", // 🟢 Added booking target URL state
//     media: [], 
//     show: 1
//   });

//   const { shouldBlockNavigation, confirmLeave, markAsSaved } = useUnsavedChanges(formData);
//   const [uploadingMedia, setUploadingMedia] = useState(false);

//   useEffect(() => {
//     const fetchBusinesses = async () => {
//       try {
//         const res = await fetch(`${API_BASE}/api/offers/business/lookup`);
//         const data = await res.json();
//         if (data.success) {
//           setBusinessList(data.listings);
//         }
//       } catch (err) {
//         console.error("Failed to query dropdown businesses items index", err.message);
//       }
//     };
//     fetchBusinesses();
//   }, []);

//   useEffect(() => {
//     if (isEditMode) {
//       const fetchOfferDetails = async () => {
//         setFetchingData(true);
//         try {
//           const res = await fetch(`${API_BASE}/api/offers`);
//           const data = await res.json();
//           if (data.success) {
//             const target = data.offers.find((o) => o._id === editId);
//             if (target) {
//               setFormData({
//                 category: target.category,
//                 businessListingId: target.business?.listingId || "",
//                 businessName: target.business?.name || "",
//                 neighborhood: target.business?.neighborhood || "",
//                 city: target.business?.city || "Chennai",
//                 phone: target.business?.phone || target.business?.phone?.phone || "", 
//                 title: target.title || "",
//                 description: target.description || "",
//                 startDate: target.startDate ? target.startDate.split("T")[0] : "",
//                 endDate: target.endDate ? target.endDate.split("T")[0] : "",
//                 primaryActions: target.primaryActions || [],
//                 bookNowUrl: target.bookNowUrl || "", // 🟢 Populate booking URL during edits
//                 media: target.media || [],
//                 show: target.show !== undefined ? target.show : 1
//               });
//             }
//           }
//         } catch (err) {
//           console.error("Error fetching offer details:", err);
//           setErrorMsg("Failed to load existing offer information.");
//         } finally {
//           setFetchingData(false);
//         }
//       };
//       fetchOfferDetails();
//     }
//   }, [editId, isEditMode]);

//   const handleBusinessDropdownChange = (e) => {
//     const selectedId = e.target.value;
//     if (!selectedId) return;

//     const foundBusiness = businessList.find(b => b._id === selectedId);
//     if (foundBusiness) {
//       console.log("DEBUG - Selected business schema object data:", foundBusiness);

//       let extractedPhone = "";
//       if (foundBusiness.phone) {
//         if (typeof foundBusiness.phone === "string") {
//           extractedPhone = foundBusiness.phone;
//         } else if (typeof foundBusiness.phone === "object") {
//           extractedPhone = foundBusiness.phone.phone || foundBusiness.phone.mobile || "";
//         }
//       } else if (foundBusiness.mobile) {
//         extractedPhone = foundBusiness.mobile;
//       }

//       setFormData(prev => ({
//         ...prev,
//         businessListingId: selectedId,
//         businessName: foundBusiness.shopName,
//         neighborhood: foundBusiness.address || "Local Area", 
//         city: foundBusiness.city?.city || "Chennai", 
//         phone: extractedPhone
//       }));
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleCheckboxChange = (action) => {
//     setFormData((prev) => {
//       const currentActions = [...prev.primaryActions];
//       let updatedActions = [];
      
//       if (currentActions.includes(action)) {
//         updatedActions = currentActions.filter((a) => a !== action);
//       } else {
//         currentActions.push(action);
//         updatedActions = currentActions;
//       }

//       // Clear the url input if user decides to uncheck book_now
//       const extraUpdates = {};
//       if (!updatedActions.includes("book_now")) {
//         extraUpdates.bookNowUrl = "";
//       }

//       return { 
//         ...prev, 
//         primaryActions: updatedActions,
//         ...extraUpdates
//       };
//     });
//   };

//   const handleMediaUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     if (file.type.startsWith("video/")) {
//       const videoElement = document.createElement("video");
//       videoElement.preload = "metadata";
//       videoElement.src = URL.createObjectURL(file);

//       videoElement.onloadedmetadata = async () => {
//         window.URL.revokeObjectURL(videoElement.src);
//         if (videoElement.duration > 122.5) {
//           alert("Video run-length exceeds your strict 12-second limitation profile!");
//           e.target.value = ""; 
//           return;
//         }
//         await directMediaUploadFile(file);
//       };
//     } else {
//       await directMediaUploadFile(file);
//     }
//   };

//   const directMediaUploadFile = async (file) => {
//     setUploadingMedia(true);
//     const uploadData = new FormData();
//     uploadData.append("file", file);

//     try {
//       const res = await fetch(`${API_BASE}/api/offers/upload-media`, {
//         method: "POST",
//         body: uploadData,
//       });
//       const data = await res.json();
//       if (data.success) {
//         setFormData((prev) => ({
//           ...prev,
//           media: [...prev.media, { type: data.type, url: data.url }]
//         }));
//       } else {
//         alert(data.error || "Media asset upload process rejected.");
//       }
//     } catch (err) {
//       console.error("Media upload error:", err);
//     } finally {
//       setUploadingMedia(false);
//     }
//   };

//   const removeMediaItem = (idxToDrop) => {
//     setFormData((prev) => ({
//       ...prev,
//       media: prev.media.filter((_, idx) => idx !== idxToDrop)
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!formData.businessListingId) {
//         setErrorMsg("Please select a valid business listing from the dropdown matrix.");
//         return;
//     }
//     if (formData.media.length === 0) {
//       setErrorMsg("Please upload at least one main feed image or a 12-second video asset.");
//       return;
//     }
//     if (formData.primaryActions.includes("book_now") && !formData.bookNowUrl.trim()) {
//       setErrorMsg("Please provide a valid Booking Link URL for your Call-to-Action button.");
//       return;
//     }

//     setLoading(true);
//     setErrorMsg("");

//     const payload = {
//       category: formData.category,
//       business: {
//         listingId: formData.businessListingId,
//         name: formData.businessName,
//         neighborhood: formData.neighborhood,
//         city: formData.city,
//         phone: formData.phone,
//       },
//       title: formData.title,
//       description: formData.description,
//       startDate: formData.startDate,
//       endDate: formData.endDate,
//       media: formData.media,
//       primaryActions: formData.primaryActions,
//       bookNowUrl: formData.primaryActions.includes("book_now") ? formData.bookNowUrl : "", // 🟢 Map into tracking payload
//       show: Number(formData.show)
//     };

//     const targetUrl = isEditMode ? `${API_BASE}/api/offers/${editId}` : `${API_BASE}/api/offers`;
//     const targetMethod = isEditMode ? "PUT" : "POST";

//     try {
//       const res = await fetch(targetUrl, {
//         method: targetMethod,
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });
//       const data = await res.json();
//       if (data.success) {
//         alert(isEditMode ? "Offer updated cleanly!" : "New offer saved successfully!");
//         markAsSaved();
//         navigate("/offers-management"); 
//       } else {
//         setErrorMsg(data.message || "Failed to commit record updates transactions.");
//       }
//     } catch (err) {
//       console.error("Form handling commit failure error log:", err);
//       setErrorMsg("Network error occurred processing system entries mappings.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Container className="mt-4">
//       <Row className='mb-3 justify-content-end align-items-center'>
//         <Col>
//           <h2 className='main-title mb-0'>{isEditMode ? "Edit Offer" : "Create New Offer"}</h2>
//           <Breadcrumb className='top-breadcrumb'>
//             <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
//             <Breadcrumb.Item active>{isEditMode ? "Edit Offer" : "Create New Offer"}</Breadcrumb.Item>
//           </Breadcrumb>
//         </Col>
//         <Col xs={'auto'}>
//           <Button variant="secondary" onClick={() => {
//             if (!confirmLeave()) return; 
//             navigate(-1)
//           }}>Go Back</Button>
//         </Col>
//       </Row>
//       <div className='form-container'>
//         {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

//         <Form onSubmit={handleSubmit}>
//           <Row className="mb-3">
//             <Col md={12}>
//               <Form.Group>
//                 <Form.Label className="fw-semibold">Category</Form.Label>
//                 <Form.Select name="category" value={formData.category} onChange={handleInputChange}>
//                   <option value="Offers / Discounts">Offers & Deals</option>
//                   <option value="Events">Events</option>
//                   <option value="Announcements">Announcements</option>
//                 </Form.Select>
//               </Form.Group>
//             </Col>
//           </Row>

//           <Row className="mb-4">
//             <Col md={12}>
//               <Card className="border-0 ">
//                 <Form.Group>
//                   <Form.Label className="fw-semibold">Business Listing</Form.Label>
//                   <Form.Select 
//                     value={formData.businessListingId || ""} 
//                     onChange={handleBusinessDropdownChange}
//                     required
//                   >
//                     <option value="">-- Select Business Listing --</option>
//                     {businessList.map((biz) => (
//                       <option key={biz._id} value={biz._id}>
//                         {biz.shopName} ({biz.city?.city || "Chennai"})
//                       </option>
//                     ))}
//                   </Form.Select>
//                 </Form.Group>

//                 {formData.businessName && (
//                   <div className="d-flex align-items-center gap-3 mt-3 pt-3 border-top">
//                     {formData.businessLogo && (
//                       <img 
//                         src={formData.businessLogo.startsWith('http') ? formData.businessLogo : `${API_BASE}/${formData.businessLogo}`} 
//                         alt="Shop Logo preview" 
//                         style={{ width: "50px", height: "50px", borderRadius: "8px", objectFit: "cover" }}
//                         className="border bg-white"
//                       />
//                     )}
//                     <div>
//                       <h6 className="m-0 fw-bold text-dark">{formData.businessName}</h6>
//                       <span className="text-muted extra-small d-block" style={{ fontSize: "12px" }}>
//                          <FaMapMarkerAlt /> {formData.neighborhood}, {formData.city}
//                       </span>
//                       <span className="text-muted extra-small d-block" style={{ fontSize: "12px" }}>
//                         <FaPhoneVolume /> {formData.phone}
//                       </span>
//                       <span className="badge bg-success mt-1" style={{ fontSize: "10px" }}>✓ Auto-Mapped Profile Verified Link</span>
//                     </div>
//                   </div>
//                 )}
//               </Card>
//             </Col>
//           </Row>

//           <hr className="my-4 text-muted" />

//           <Form.Group className="mb-3">
//             <Form.Label className="fw-semibold">Title</Form.Label>
//             <Form.Control required type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g. Flat 20% Off" />
//           </Form.Group>

//           <Form.Group className="mb-3">
//             <Form.Label className="fw-semibold">Description</Form.Label>
//             <Form.Control required as="textarea" rows={4} name="description" value={formData.description} onChange={handleInputChange} />
//           </Form.Group>

//           <Row className="mb-4">
//             <Col md={6} xs={12}>
//               <Form.Group>
//                 <Form.Label className="fw-semibold">Start Date</Form.Label>
//                 <Form.Control required type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} />
//               </Form.Group>
//             </Col>
//             <Col md={6} xs={12}>
//               <Form.Group>
//                 <Form.Label className="fw-semibold">End Date</Form.Label>
//                 <Form.Control required type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} />
//               </Form.Group>
//             </Col>
//           </Row>

//           <hr className="my-4 text-muted" />

//           <Form.Group className="mb-4">
//             <Form.Label className="fw-semibold">Media</Form.Label>
//             <Form.Text className="text-muted d-block mb-2">Upload multiple images or a short marketing video clip <strong> <br /> (Maximum limit: 12 Seconds)</strong>.</Form.Text>
//             <Form.Control type="file" accept="image/*,video/*" onChange={handleMediaUpload} disabled={uploadingMedia} />
            
//             {uploadingMedia && (
//               <div className="d-flex align-items-center gap-2 mt-2 text-info small">
//                 <Spinner animation="grow" size="sm" /> <span>Transmitting asset binaries, validating time length metrics properties configurations...</span>
//               </div>
//             )}

//             {formData.media.length > 0 && (
//               <div className="d-flex gap-3 flex-wrap mt-3 p-3 rounded bg-light border">
//                 {formData.media.map((item, index) => (
//                   <div key={index} className="position-relative border rounded bg-white p-1" style={{ width: "110px", height: "80px" }}>
//                     {item.type === 'video' ? (
//                       <div className="w-100 h-100 d-flex flex-column align-items-center justify-content-center text-center bg-dark text-white rounded" style={{ fontSize: "10px" }}>
//                         <span> <FaVideo /> Video Asset</span>
//                         <span className="extra-small text-muted text-truncate px-1" style={{ maxWidth: "100%" }}>12s Passed</span>
//                       </div>
//                     ) : (
//                       <img src={item.url.startsWith('http') ? item.url : `${API_BASE}/${item.url}`} alt="preview" className="w-100 h-100 rounded" style={{ objectFit: "cover" }} />
//                     )}
//                     <Button variant="danger" size="sm" className="position-absolute p-0 rounded-circle d-flex align-items-center justify-content-center border-0 shadow-sm" style={{ top: "-8px", right: "-8px", width: "20px", height: "20px", fontSize: "11px" }} onClick={() => removeMediaItem(index)}>✕</Button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </Form.Group>

//           <Form.Group className="mb-4">
//             <Form.Label className="fw-semibold">Status</Form.Label>
//             <Form.Check 
//               type="switch" 
//               id="visibility-toggle-switch"
//               label={Number(formData.show) === 1 ? "Shown" : "Hidden"}
//               checked={Number(formData.show) === 1}
//               onChange={(e) => {
//                 const visibilityValue = e.target.checked ? 1 : 0;
//                 setFormData(prev => ({ ...prev, show: visibilityValue }));
//               }}
//               style={{ fontSize: "1.1rem", cursor: "pointer" }}
//             />
//           </Form.Group>

//           <Form.Group className="mb-4">
//             <Form.Label className="fw-semibold d-block">Choose Interactive Buttons</Form.Label>
//             <div className="d-flex gap-4 flex-wrap mb-3">
//               <Form.Check type="checkbox" id="cta-whatsapp" label="WhatsApp Chat" checked={formData.primaryActions.includes("whatsapp")} onChange={() => handleCheckboxChange("whatsapp")} />
//               <Form.Check type="checkbox" id="cta-call" label="Phone Call" checked={formData.primaryActions.includes("call")} onChange={() => handleCheckboxChange("call")} />
//               <Form.Check type="checkbox" id="cta-book" label="Book Appointment" checked={formData.primaryActions.includes("book_now")} onChange={() => handleCheckboxChange("book_now")} />
//             </div>

//             {/* 🟢 CONDITIONAL FIELD: Only renders when Book Appointment is active */}
//             {formData.primaryActions.includes("book_now") && (
//               <Form.Group className="p-3 border rounded bg-light transition-fade">
//                 <Form.Label className="fw-semibold text-dark">Appointment Booking Link / URL</Form.Label>
//                 <Form.Control 
//                   type="url" 
//                   name="bookNowUrl"
//                   value={formData.bookNowUrl} 
//                   onChange={handleInputChange} 
//                   placeholder="https://example.com/bookings-or-calendar-page" 
//                   required={formData.primaryActions.includes("book_now")}
//                 />
//                 <Form.Text className="text-muted">Enter the destination address users land on when pressing the booking interactive button.</Form.Text>
//               </Form.Group>
//             )}
//           </Form.Group>

//           <div className="d-flex gap-2 justify-content-end mt-5 border-top pt-3">
//             <Button variant="primary" type="submit" disabled={loading || uploadingMedia} style={{ borderRadius: "8px", fontWeight: 600, padding: "0.6rem 2rem", backgroundColor: "#ff4e00", borderColor: "#ff4e00" }}>
//               {loading ? <Spinner animation="border" size="sm" /> : isEditMode ? "Save Changes" : "Save"}
//             </Button>
//           </div>
//         </Form>
//       </div>
//     </Container>
//   );
// };

// export default AddEditOffers;
import React, { useState, useEffect, useMemo } from "react";
import { Form, Button, Row, Col, Card, Spinner, Alert, Container, Breadcrumb } from "react-bootstrap";
import { FaMapMarkerAlt, FaVideo, FaPhoneVolume } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import useUnsavedChanges from "../Hooks/useUnsavedChanges";

const API_BASE =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_URL
    : "http://localhost:5000";

const AddEditOffers = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editId = location.state?.id || null;
  const isEditMode = !!editId;

  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [businessList, setBusinessList] = useState([]);
  
  // 🟢 State for filtering by City
  const [selectedCityFilter, setSelectedCityFilter] = useState("");

  const [formData, setFormData] = useState({
    category: "Offers / Discounts",
    businessListingId: "",
    businessName: "",
    businessLogo: "",
    neighborhood: "",
    city: "",
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

  // Fetch business lookup list
  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/offers/business/lookup`);
        const data = await res.json();
        if (data.success) {
          setBusinessList(data.listings);
        }
      } catch (err) {
        console.error("Failed to query dropdown businesses items index", err.message);
      }
    };
    fetchBusinesses();
  }, []);

  // 🟢 Extract unique cities dynamically from the fetched business listings
  const availableCities = useMemo(() => {
    const citiesSet = new Set();
    businessList.forEach((b) => {
      const cityName = typeof b.city === "object" ? b.city?.city : b.city;
      if (cityName) citiesSet.add(cityName);
    });
    return Array.from(citiesSet).sort();
  }, [businessList]);

  // Fetch offer details in edit mode
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
              const offerCity = target.business?.city || "";
              
              // Set the city filter so the selected business remains visible in dropdown
              setSelectedCityFilter(offerCity);

              setFormData({
                category: target.category,
                businessListingId: target.business?.listingId || "",
                businessName: target.business?.name || "",
                neighborhood: target.business?.neighborhood || "",
                city: offerCity,
                phone: target.business?.phone || target.business?.phone?.phone || "", 
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

  // 🟢 Filter business list based on selected city filter
  const filteredBusinesses = useMemo(() => {
    if (!selectedCityFilter) return businessList;
    return businessList.filter((b) => {
      const cityName = typeof b.city === "object" ? b.city?.city : b.city;
      return cityName === selectedCityFilter;
    });
  }, [businessList, selectedCityFilter]);

  // Handle City Dropdown change
  const handleCityFilterChange = (e) => {
    const city = e.target.value;
    setSelectedCityFilter(city);
    
    // Reset business selection if city changes
    setFormData((prev) => ({
      ...prev,
      businessListingId: "",
      businessName: "",
      neighborhood: "",
      city: city,
      phone: ""
    }));
  };

  const handleBusinessDropdownChange = (e) => {
    const selectedId = e.target.value;
    if (!selectedId) {
      setFormData((prev) => ({
        ...prev,
        businessListingId: "",
        businessName: "",
        neighborhood: "",
        phone: ""
      }));
      return;
    }

    const foundBusiness = businessList.find((b) => b._id === selectedId);
    if (foundBusiness) {
      let extractedPhone = "";
      if (foundBusiness.phone) {
        if (typeof foundBusiness.phone === "string") {
          extractedPhone = foundBusiness.phone;
        } else if (typeof foundBusiness.phone === "object") {
          extractedPhone = foundBusiness.phone.phone || foundBusiness.phone.mobile || "";
        }
      } else if (foundBusiness.mobile) {
        extractedPhone = foundBusiness.mobile;
      }

      const businessCity = (typeof foundBusiness.city === "object" ? foundBusiness.city?.city : foundBusiness.city) || selectedCityFilter;

      setFormData((prev) => ({
        ...prev,
        businessListingId: selectedId,
        businessName: foundBusiness.shopName,
        neighborhood: foundBusiness.address || "Local Area", 
        city: businessCity, 
        phone: extractedPhone
      }));
    }
  };

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
      setErrorMsg("Please select a valid business listing from the dropdown matrix.");
      return;
    }
    if (formData.media.length === 0) {
      setErrorMsg("Please upload at least one main feed image or a 12-second video asset.");
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
            navigate(-1);
          }}>Go Back</Button>
        </Col>
      </Row>

      <div className='form-container'>
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

          <Row className="mb-4">
            <Col md={12}>
              <Card className="border-0">
                
                {/* 🟢 STEP 1: Select City First */}
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-semibold">Select City</Form.Label>
                      <Form.Select 
                        value={selectedCityFilter} 
                        onChange={handleCityFilterChange}
                      >
                        <option value="">-- All Cities --</option>
                        {availableCities.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  {/* 🟢 STEP 2: Filtered Business Listing */}
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-semibold">Business Listing</Form.Label>
                      <Form.Select 
                        value={formData.businessListingId || ""} 
                        onChange={handleBusinessDropdownChange}
                        required
                      >
                        <option value="">-- Select Business Listing --</option>
                        {filteredBusinesses.map((biz) => {
                          const cityName = typeof biz.city === "object" ? biz.city?.city : biz.city;
                          return (
                            <option key={biz._id} value={biz._id}>
                              {biz.shopName} ({cityName || "N/A"})
                            </option>
                          );
                        })}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

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
                      <span className="text-muted extra-small d-block" style={{ fontSize: "12px" }}>
                        <FaPhoneVolume /> {formData.phone}
                      </span>
                      <span className="badge bg-success mt-1" style={{ fontSize: "10px" }}>✓ Auto-Mapped Profile Verified Link</span>
                    </div>
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
            <Form.Text className="text-muted d-block mb-2">Upload multiple images or a short marketing video clip <strong> <br /> (Maximum limit: 12 Seconds)</strong>.</Form.Text>
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