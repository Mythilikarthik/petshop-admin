import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col, Image, Breadcrumb } from "react-bootstrap";
import Select from "react-select";
import useUnsavedChanges from "../Hooks/useUnsavedChanges";

const API_BASE =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_URL
    : "http://localhost:5000";

const AddListing = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { listing } = state || {};
const [filteredPetCategories, setFilteredPetCategories] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [petCategory, setPetCategory] = useState([]);
  const [serviceList, setServiceList] = useState([]);
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
// ------------------
// Input states for string arrays
  const [newCertification, setNewCertification] = useState("");
  
  const [newServiceArea, setNewServiceArea] = useState("");
// -----------------------


  const [formData, setFormData] = useState({
    shopName: listing?.shopName || "",
    email: listing?.email || "",
    phone: listing?.phone || "",
    whatsapp: listing?.whatsapp || "",
    address: listing?.address || "",
    city: listing?.city || "",
    country: listing?.country || "India",
    mapUrl: listing?.mapUrl || "",
    petCategories: listing?.petCategories || [],
    specializedServices: listing?.specializedServices || [],
    description: listing?.description || "",
    categories: listing?.categories || [],
    photos: [],
    metaTitle: listing?.metaTitle || "",
    metaKeyword: listing?.metaKeyword || [],
    metaDescription: listing?.metaDescription || "",
    // Social Links state
    socialLinks: {
      facebook: listing?.socialLinks?.facebook || "",
      instagram: listing?.socialLinks?.instagram || "",
      youtube: listing?.socialLinks?.youtube || "",
      twitter: listing?.socialLinks?.twitter || "",
      linkedin: listing?.socialLinks?.linkedin || "",
    },

    // ------------
    
    mapUrl: listing?.mapUrl || "",
    yearsInBusiness: listing?.yearsInBusiness || 0,
    customersServed: listing?.customersServed || 0,
    certifications: listing?.certifications || [],
    languagesSpoken: listing?.languagesSpoken || [],
    amenities: listing?.amenities || [],
    serviceAreas: listing?.serviceAreas || [],
    appointmentRequired: listing?.appointmentRequired || false,
    responseTime: listing?.responseTime || "Within a few hours",

    // Pricing & Payments
    startingPrice: listing?.startingPrice || 0,
    paymentMethods: listing?.paymentMethods || [],
    // ------------
  });

  // ---------
  const [video, setVideo] = useState(null);
const [videoPreview, setVideoPreview] = useState(null);
  const amenityOptions = [
    { value: "all", label: "All" },
    { value: "24x7 Emergency Care", label: "24x7 Emergency Care" },
    { value: "24x7 Staff Supervision", label: "24x7 Staff Supervision" },
    { value: "24x7 Transit Support", label: "24x7 Transit Support" },
    { value: "Air-Conditioned Facility", label: "Air-Conditioned Facility" },
    { value: "Air-Conditioned Rooms", label: "Air-Conditioned Rooms" },
    { value: "Air-Conditioned Vehicle", label: "Air-Conditioned Vehicle" },
    { value: "Ambulance Available", label: "Ambulance Available" },
    { value: "Appointment Required", label: "Appointment Required" },
    { value: "CCTV Monitoring", label: "CCTV Monitoring" },
    { value: "Donation Facility", label: "Donation Facility" },
    { value: "Drinking Water for Pets", label: "Drinking Water for Pets" },
    { value: "Emergency Vet Contact Support", label: "Emergency Vet Contact Support" },
    { value: "Flexible Scheduling", label: "Flexible Scheduling" },
    { value: "Food & Water Bowls Provided", label: "Food & Water Bowls Provided" },
    { value: "Foster Network", label: "Foster Network" },
    { value: "GPS Tracking", label: "GPS Tracking" },
    { value: "Group Classes", label: "Group Classes" },
    { value: "Home Delivery", label: "Home Delivery" },
    { value: "Home Training Available", label: "Home Training Available" },
    { value: "Home Visit Available", label: "Home Visit Available" },
    { value: "Hydrotherapy Equipment", label: "Hydrotherapy Equipment" },
    { value: "Hygienic Sanitized Equipment", label: "Hygienic Sanitized Equipment" },
    { value: "Hypoallergenic Products", label: "Hypoallergenic Products" },
    { value: "ICU Facility", label: "ICU Facility" },
    { value: "In-house Laboratory", label: "In-house Laboratory" },
    { value: "In-house Pharmacy", label: "In-house Pharmacy" },
    { value: "Indoor Play Area", label: "Indoor Play Area" },
    { value: "Indoor Training Area", label: "Indoor Training Area" },
    { value: "Leash-Friendly Seating", label: "Leash-Friendly Seating" },
    { value: "Lighting for Evening Visits", label: "Lighting for Evening Visits" },
    { value: "One-on-One Sessions", label: "One-on-One Sessions" },
    { value: "Online Consultation Available", label: "Online Consultation Available" },
    { value: "Online Ordering", label: "Online Ordering" },
    { value: "Online Training Available", label: "Online Training Available" },
    { value: "Operation Theatre", label: "Operation Theatre" },
    { value: "Organic / Natural Products", label: "Organic / Natural Products" },
    { value: "Outdoor Garden Seating", label: "Outdoor Garden Seating" },
    { value: "Outdoor Play Area", label: "Outdoor Play Area" },
    { value: "Outdoor Training Area", label: "Outdoor Training Area" },
    { value: "Overnight Stay Available", label: "Overnight Stay Available" },
    { value: "Parking Available", label: "Parking Available" },
    { value: "Pet Beds Provided", label: "Pet Beds Provided" },
    { value: "Pet Play Area", label: "Pet Play Area" },
    { value: "Pet Play Area (Indoor)", label: "Pet Play Area (Indoor)" },
    { value: "Pet Play Area (Outdoor)", label: "Pet Play Area (Outdoor)" },
    { value: "Pets Allowed Indoors", label: "Pets Allowed Indoors" },
    { value: "Pets Allowed Outdoors", label: "Pets Allowed Outdoors" },
    { value: "Pickup & Drop Available", label: "Pickup & Drop Available" },
    { value: "Premium Grooming Products", label: "Premium Grooming Products" },
    { value: "Private Spa Rooms", label: "Private Spa Rooms" },
    { value: "Rescue Shelter", label: "Rescue Shelter" },
    { value: "Same-Day Delivery", label: "Same-Day Delivery" },
    { value: "Shaded Seating", label: "Shaded Seating" },
    { value: "Swimming Pool", label: "Swimming Pool" },
    { value: "Therapy Room", label: "Therapy Room" },
    { value: "Travel Insurance Assistance", label: "Travel Insurance Assistance" },
    { value: "Treats Available", label: "Treats Available" },
    { value: "Volunteer Registration", label: "Volunteer Registration" },
    { value: "Waiting Area", label: "Waiting Area" },
    { value: "Waste Disposal Bins", label: "Waste Disposal Bins" },
    { value: "Wheelchair Accessible", label: "Wheelchair Accessible" },
    { value: "Wifi accessible", label: "Wifi accessible" }
];
  const languageOptions = [
  { value: "all", label: "All" },
  { value: "English", label: "English" },
  { value: "Tamil", label: "Tamil" },
  { value: "Hindi", label: "Hindi" }
];
  const paymentOptions = [
    { value: "all", label: "All" }, // ✅ Added "Select All"
    { value: "Cash", label: "Cash" },
    { value: "Credit Card", label: "Credit Card" },
    { value: "Debit Card", label: "Debit Card" },
    { value: "UPI", label: "UPI" },
    { value: "Net Banking", label: "Net Banking" },
    { value: "Digital Wallet", label: "Digital Wallet" }
  ];
  // ---------

  // const [previewUrls, setPreviewUrls] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
const { shouldBlockNavigation, confirmLeave, markAsSaved } =
    useUnsavedChanges(formData);

    const [banner, setBanner] = useState(null);
const [bannerPreview, setBannerPreview] = useState(null);

const handleSocialChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({
    ...prev,
    socialLinks: {
      ...prev.socialLinks,
      [name]: value,
    },
  }));
};
const handleVideoChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (file.size > 50 * 1024 * 1024) {
    alert("Video size must be less than 50MB.");
    e.target.value = "";
    return;
  }

  setVideo(file);
  setVideoPreview(URL.createObjectURL(file));
};
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
  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: value
  //   }));
  // };
  // ------
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAddCertification = (e) => {
    e.preventDefault();
    if (newCertification.trim() && !formData.certifications.includes(newCertification.trim())) {
      setFormData((prev) => ({
        ...prev,
        certifications: [...prev.certifications, newCertification.trim()]
      }));
      setNewCertification("");
    }
  };

  const handleRemoveCertification = (itemToRemove) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((item) => item !== itemToRemove)
    }));
  };

  

  const handleAddServiceArea = (e) => {
    e.preventDefault();
    if (newServiceArea.trim() && !formData.serviceAreas.includes(newServiceArea.trim())) {
      setFormData((prev) => ({
        ...prev,
        serviceAreas: [...prev.serviceAreas, newServiceArea.trim()]
      }));
      setNewServiceArea("");
    }
  };

  const handleRemoveServiceArea = (itemToRemove) => {
    setFormData((prev) => ({
      ...prev,
      serviceAreas: prev.serviceAreas.filter((item) => item !== itemToRemove)
    }));
  };
  // -----------

  // handle photo selection
  // const handlePhotoChange = (e) => {
  //   const files = Array.from(e.target.files);
  //   setFormData((prev) => ({
  //     ...prev,
  //     photos: files
  //   }));

  //   // image previews
  //   const urls = files.map((file) => URL.createObjectURL(file));
  //   setPreviewUrls(urls);
  // };
  const handlePhotoChange = (e) => {
  const files = Array.from(e.target.files);

  setFormData((prev) => ({
    ...prev,
    photos: files
  }));

  const images = files.map((file) => ({
    file,
    preview: URL.createObjectURL(file),
    alt: ""
  }));

  setGalleryImages(images);
};

  useEffect(() => {
  if (!formData.categories.length) {
    setServiceList([]);
    return;
  }

  const fetchServices = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/specialized-service/byCategories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          categories: formData.categories
        })
      });

      const data = await res.json();

      if (data.success) {
        setServiceList(data.services);
      } else {
        setServiceList([]);
      }
//console.log("ss", serviceList);
    } catch (err) {
      console.error("Service fetch error", err);
    }
  };

  fetchServices();
}, [formData.categories]);
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
      formDataToSend.append("whatsapp", formData.whatsapp);
      formDataToSend.append("address", formData.address);
      // formDataToSend.append("city", formData.city);
      formDataToSend.append("country", formData.country);
      formDataToSend.append("mapUrl", formData.mapUrl);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("metaTitle", formData.metaTitle);
      formDataToSend.append("metaKeyword", formData.metaKeyword);
      formDataToSend.append("metaDescription", formData.metaDescription);
      formDataToSend.append("businessHours", JSON.stringify(businessHours));
      formDataToSend.append("socialLinks", JSON.stringify(formData.socialLinks));
      // ----------
      if (video) {
  formDataToSend.append("videos", video);
}
      formDataToSend.append("mapLink", formData.mapLink);
      formDataToSend.append("yearsInBusiness", formData.yearsInBusiness);
      formDataToSend.append("customersServed", formData.customersServed);
      formDataToSend.append("certifications", JSON.stringify(formData.certifications));
      formDataToSend.append("languagesSpoken", JSON.stringify(formData.languagesSpoken));
      formDataToSend.append("amenities", JSON.stringify(formData.amenities));
      formDataToSend.append("serviceAreas", JSON.stringify(formData.serviceAreas));
      formDataToSend.append("appointmentRequired", formData.appointmentRequired);
      formDataToSend.append("responseTime", formData.responseTime);
      formDataToSend.append("startingPrice", formData.startingPrice);
      // formDataToSend.append("paymentMethods", formData.paymentMethods);
      // ✅ CORRECT
if (Array.isArray(formData.paymentMethods)) {
  formData.paymentMethods.forEach((method) => {
    formDataToSend.append("paymentMethods[]", method);
  });
}
      // ----------
      

      //console.log(formData.categories);
      // append selected categories
      formData.categories.forEach((catId) => {
        formDataToSend.append("categories[]", catId);
      });
      formData.petCategories.forEach((petId) => {
        formDataToSend.append("petCategories[]", petId);
      });
      formData.specializedServices.forEach((serviceId) => {
        formDataToSend.append("specializedServices[]", serviceId);
      });
      formDataToSend.append("city", formData.city);

//console.log(formDataToSend.getAll("categories[]"));
      // append image files
      // formData.photos.forEach((photo) => {
      //   formDataToSend.append("photos", photo);
      // });
      galleryImages.forEach((img) => {
  formDataToSend.append("photos", img.file);
});
formDataToSend.append(
  "photoAlts",
  JSON.stringify(
    galleryImages.map((img) => img.alt)
  )
);
if (banner) {
  formDataToSend.append("bannerImage", banner);
}

console.log("Data:", formData);
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
      //console.log(data);
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
  //console.log(categoryList);

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
            <Form.Group className="mb-3">
  <Form.Label>Specialized Services</Form.Label>

  <Select
    isMulti
    options={serviceList.map(s => ({
      value: s._id,
      label: s.serviceName
    }))}
    value={serviceList
      .filter(s => formData.specializedServices.includes(s._id))
      .map(s => ({ value: s._id, label: s.serviceName }))
    }
    onChange={(selected) =>
      setFormData(prev => ({
        ...prev,
        specializedServices: selected ? selected.map(s => s.value) : []
      }))
    }
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
            <Form.Group className="mb-3">
              <Form.Label>Whatsapp <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="number"
                name="whatsapp"
                value={formData.whatsapp}
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
                  title="Website Url"
                ></iframe>
              </div>
            )}
{/* Newly added Fields */}
            {/* Map Link */}
            <Form.Group className="mb-3">
              <Form.Label>Map Link</Form.Label>
              <Form.Control
                type="url"
                name="mapLink"
                value={formData.mapLink}
                onChange={handleChange}
              />
            </Form.Group>

            {formData.mapLink && (
              <div className="mb-3">
                <iframe
                  src={formData.mapLink}
                  width="100%"
                  height="250"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title="Location Map"
                ></iframe>
              </div>
            )}

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Years in Business</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    name="yearsInBusiness"
                    value={formData.yearsInBusiness}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Customers Served</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    name="customersServed"
                    value={formData.customersServed}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Certifications Array */}
            <Form.Group className="mb-3">
              <Form.Label>Certifications</Form.Label>
              <div className="d-flex flex-wrap gap-2 mb-2">
                {formData.certifications.map((item, idx) => (
                  <span key={idx} className="badge bg-secondary d-flex align-items-center">
                    {item}
                    <Button
                      variant="link"
                      size="sm"
                      className="text-white ms-1 p-0"
                      onClick={() => handleRemoveCertification(item)}
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
                  placeholder="Add certification..."
                  value={newCertification}
                  onChange={(e) => setNewCertification(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddCertification(e)}
                />
                <Button variant="outline-primary" onClick={handleAddCertification} className="ms-2">
                  Add
                </Button>
              </div>
            </Form.Group>

            {/* Languages Spoken Array */}
            <Form.Group className="mb-3">
  <Form.Label>Languages Spoken</Form.Label>
  <Select
    isMulti
    options={languageOptions}
    value={languageOptions.filter(
      (opt) => opt.value !== "all" && formData.languagesSpoken.includes(opt.value)
    )}
    onChange={(selected) => {
      if (!selected || selected.length === 0) {
        setFormData((prev) => ({ ...prev, languagesSpoken: [] }));
        return;
      }

      // Filter real options (excluding 'all')
      const realLanguages = languageOptions
        .filter((opt) => opt.value !== "all")
        .map((opt) => opt.value);

      // If "Select All" was clicked
      if (selected.some((s) => s.value === "all")) {
        setFormData((prev) => ({
          ...prev,
          languagesSpoken: realLanguages
        }));
      } else {
        // Normal selection
        const selectedValues = selected
          .map((s) => s.value)
          .filter((v) => v !== "all");

        setFormData((prev) => ({
          ...prev,
          languagesSpoken: selectedValues
        }));
      }
    }}
  />
</Form.Group>
{/* Amenities Field */}
<Form.Group className="mb-3">
  <Form.Label>Amenities</Form.Label>
  <Select
    isMulti
    options={amenityOptions}
    value={amenityOptions.filter(
      (opt) => opt.value !== "all" && formData.amenities?.includes(opt.value)
    )}
    onChange={(selected) => {
      if (!selected || selected.length === 0) {
        setFormData((prev) => ({ ...prev, amenities: [] }));
        return;
      }

      // Filter real amenity values (excluding 'all')
      const realAmenities = amenityOptions
        .filter((opt) => opt.value !== "all")
        .map((opt) => opt.value);

      // If "Select All" was clicked
      if (selected.some((s) => s.value === "all")) {
        setFormData((prev) => ({
          ...prev,
          amenities: realAmenities
        }));
      } else {
        // Normal selection
        const selectedValues = selected
          .map((s) => s.value)
          .filter((v) => v !== "all");

        setFormData((prev) => ({
          ...prev,
          amenities: selectedValues
        }));
      }
    }}
  />
</Form.Group>
            {/* Service Areas Array */}
            <Form.Group className="mb-3">
              <Form.Label>Service Areas</Form.Label>
              <div className="d-flex flex-wrap gap-2 mb-2">
                {formData.serviceAreas.map((item, idx) => (
                  <span key={idx} className="badge bg-secondary d-flex align-items-center">
                    {item}
                    <Button
                      variant="link"
                      size="sm"
                      className="text-white ms-1 p-0"
                      onClick={() => handleRemoveServiceArea(item)}
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
                  placeholder="e.g. Downtown, South City..."
                  value={newServiceArea}
                  onChange={(e) => setNewServiceArea(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddServiceArea(e)}
                />
                <Button variant="outline-primary" onClick={handleAddServiceArea} className="ms-2">
                  Add
                </Button>
              </div>
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Appointment Required"
                    name="appointmentRequired"
                    checked={formData.appointmentRequired}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Response Time</Form.Label>
                  <Form.Control
                    type="text"
                    name="responseTime"
                    placeholder="e.g. Within a few hours"
                    value={formData.responseTime}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Pricing & Payments */}
            <h4 className="mt-4 mb-3 text-primary">Pricing & Payment Methods</h4>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Starting Price (₹)</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    name="startingPrice"
                    value={formData.startingPrice}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Payment Methods Accepted</Form.Label>
                  {/* ✅ NEW SELECT CODE WITH "ALL" OPTION */}
                    <Select
  isMulti
  options={paymentOptions}
  value={paymentOptions.filter(
    (opt) => opt.value !== "all" && formData.paymentMethods.includes(opt.value)
  )}
  onChange={(selected) => {
    if (!selected || selected.length === 0) {
      setFormData((prev) => ({ ...prev, paymentMethods: [] }));
      return;
    }

    // List of real payment values (excluding 'all')
    const realOptions = paymentOptions
      .filter((opt) => opt.value !== "all")
      .map((opt) => opt.value);

    // If 'all' was selected from the dropdown
    if (selected.some((s) => s.value === "all")) {
      setFormData((prev) => ({
        ...prev,
        paymentMethods: realOptions // Save only real payment options!
      }));
    } else {
      // Filter out 'all' explicitly just in case
      const selectedValues = selected
        .map((s) => s.value)
        .filter((v) => v !== "all");

      setFormData((prev) => ({
        ...prev,
        paymentMethods: selectedValues
      }));
    }
  }}
/>
                </Form.Group>
              </Col>
            </Row>
            


            {/* End Newly added Fields */}
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
            {/* {previewUrls.length > 0 && (
              <Row className="mb-4">
                {previewUrls.map((url, index) => (
                  <Col key={index} xs={6} md={4} lg={3} className="mb-3">
                    <Image src={url} thumbnail fluid />
                  </Col>
                ))}
              </Row>
            )} */}
            {galleryImages.length > 0 && (
  <Row className="mb-4">
    {galleryImages.map((img, index) => (
      <Col key={index} xs={6} md={4} lg={3} className="mb-3">
        <Image src={img.preview} thumbnail fluid />

        <Form.Control
          className="mt-2"
          type="text"
          placeholder="Image Alt Text"
          value={img.alt}
          onChange={(e) => {
            const updated = [...galleryImages];
            updated[index].alt = e.target.value;
            setGalleryImages(updated);
          }}
        />
      </Col>
    ))}
  </Row>
)}
<Form.Group className="mb-4">
  <Form.Label className="fw-bold">Upload Listing Video</Form.Label>
  <Form.Control
    type="file"
    accept="video/mp4,video/webm,video/ogg"
    onChange={handleVideoChange}
  />
  {videoPreview && (
    <div className="mt-3" style={{ maxWidth: "400px" }}>
      <video controls src={videoPreview} style={{ width: "100%", borderRadius: "8px" }} />
    </div>
  )}
</Form.Group>


<h5 className="mt-4 mb-3 fw-bold">Social Links</h5>
<Row>
  <Col md={6}>
    <Form.Group className="mb-3">
      <Form.Label>Instagram URL</Form.Label>
      <Form.Control
        type="url"
        name="instagram"
        placeholder="https://instagram.com/yourhandle"
        value={formData.socialLinks.instagram}
        onChange={handleSocialChange}
      />
    </Form.Group>
  </Col>
  <Col md={6}>
    <Form.Group className="mb-3">
      <Form.Label>Facebook URL</Form.Label>
      <Form.Control
        type="url"
        name="facebook"
        placeholder="https://facebook.com/yourpage"
        value={formData.socialLinks.facebook}
        onChange={handleSocialChange}
      />
    </Form.Group>
  </Col>
  <Col md={6}>
    <Form.Group className="mb-3">
      <Form.Label>YouTube URL</Form.Label>
      <Form.Control
        type="url"
        name="youtube"
        placeholder="https://youtube.com/@yourchannel"
        value={formData.socialLinks.youtube}
        onChange={handleSocialChange}
      />
    </Form.Group>
  </Col>
  <Col md={6}>
    <Form.Group className="mb-3">
      <Form.Label>Twitter / X URL</Form.Label>
      <Form.Control
        type="url"
        name="twitter"
        placeholder="https://x.com/yourhandle"
        value={formData.socialLinks.twitter}
        onChange={handleSocialChange}
      />
    </Form.Group>
  </Col>
  <Col md={6}>
    <Form.Group className="mb-3">
      <Form.Label>LinkedIn URL</Form.Label>
      <Form.Control
        type="url"
        name="linkedin"
        placeholder="https://linkedin.com/company/yourpage"
        value={formData.socialLinks.linkedin}
        onChange={handleSocialChange}
      />
    </Form.Group>
  </Col>
  
</Row>




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
