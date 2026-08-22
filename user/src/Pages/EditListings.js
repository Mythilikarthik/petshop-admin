import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Image, Breadcrumb, Alert, Spinner } from 'react-bootstrap';
import Select from "react-select";
import useUnsavedChanges from "../Hooks/useUnsavedChanges";

const API_BASE =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_URL
    : "http://localhost:5000";

// Predefined Select Options with "All" included
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
  { value: "all", label: "All" }, 
  { value: "Cash", label: "Cash" },
  { value: "Credit Card", label: "Credit Card" },
  { value: "Debit Card", label: "Debit Card" },
  { value: "UPI", label: "UPI" },
  { value: "Net Banking", label: "Net Banking" },
  { value: "Digital Wallet", label: "Digital Wallet" }
];

const EditListing = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const id = localStorage.getItem("userId") || "";

  const [loading, setLoading] = useState(true);
  const [listing, setListing] = useState(null);
  const [categoryList, setCategoryList] = useState([]);
  const [petCategoryList, setPetCategoryList] = useState([]);
  const [serviceList, setServiceList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [newKeyword, setNewKeyword] = useState("");
  const [banner, setBanner] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [existingBanner, setExistingBanner] = useState(null);
  const [noListing, setNoListing] = useState(false);
  const [newPhotoAlts, setNewPhotoAlts] = useState([]);

  // Video State
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
  const [existingVideo, setExistingVideo] = useState(null);

  // Tag helper states
  const [newCertification, setNewCertification] = useState("");
  const [newServiceArea, setNewServiceArea] = useState("");

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
    shopName: '',
    email: '',
    phone: '',
    whatsapp: '',
    address: '',
    city: '',
    country: '',
    mapUrl: '',
    description: '',
    categories: [],
    petCategories: [],
    specializedServices: [],
    photos: [],
    existingPhotos: [],
    photoAlts: {},
    metaTitle: '',
    metaKeyword: [],
    metaDescription: '',
    status: false,
    isVerified: false,
    u_name: '',
    claimStatus: "pending",
    verificationMethod: "",
    verificationDocs: [],
    isClaimed: false,
    isSignup: false,
    signupStatus: "pending",

    // ADDITIONAL FIELDS
    certifications: [],
    yearsInBusiness: 0,
    languagesSpoken: [],
    amenities: [],
    mapLink: '',
    serviceAreas: [],
    paymentMethods: [],
    appointmentRequired: false,
    startingPrice: 0,
    customersServed: 0,
    responseTime: 'Within a few hours',
    socialLinks: {
      facebook: "",
      instagram: "",
      youtube: "",
      twitter: "",
      linkedin: "",
      website: "",
    },
  });

  const { confirmLeave, markAsSaved, resetInitialSnapshot } =
    useUnsavedChanges(formData, { excludeKeys: ['photos', 'existingPhotos'] });

  const fetchServices = async (categories) => {
    try {
      const res = await fetch(`${API_BASE}/api/specialized-service/byCategories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categories })
      });
      const data = await res.json();
      if (data.success) {
        setServiceList(data.services.map(s => ({ value: s._id, label: s.serviceName })));
      } else {
        setServiceList([]);
      }
    } catch (err) {
      console.error("Service fetch error", err);
    }
  };

  useEffect(() => {
    if (formData.categories.length > 0) {
      fetchServices(formData.categories);
    } else {
      setServiceList([]);
    }
  }, [formData.categories]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/category/show`);
        const data = await res.json();
        if (data.success) {
          setCategoryList(data.categories.map(c => ({ value: c._id, label: c.categoryName })));
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    const fetchPetCategories = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/pet-category/show`);
        const data = await res.json();
        if (data.success) {
          setPetCategoryList(data.petCategories.map(c => ({ value: c._id, label: c.categoryName })));
        }
      } catch (err) {
        console.error("Error fetching pet categories:", err);
      }
    };

    const fetchCityList = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/city/show`);
        const data = await res.json();
        if (data.success) {
          setCityList(data.cities.map(c => ({ value: c._id, label: c.city })));
        }
      } catch (err) {
        console.error("Error fetching cities:", err);
      }
    };

    fetchCategories();
    fetchPetCategories();
    fetchCityList();
  }, []);

  // Clean up object URLs to prevent leaks
  useEffect(() => {
    return () => {
      if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
    };
  }, [videoPreviewUrl]);

  // Fetch listing details
  useEffect(() => {
    if (!id) return;

    const fetchListing = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/listing/user/${id}`);
        const data = await res.json();
        if (res.status === 404) {
          setNoListing(true);
          setLoading(false);
          return;
        }
        if (!res.ok) throw new Error(data.message);

        if (res.ok && data.success) {
          setListing(data.listing);
          setExistingBanner(data.listing.bannerImage || null);
          setExistingVideo(data.listing.videos || null);

          let parsedSocialLinks = {};
          if (typeof data.listing.socialLinks === 'string') {
            try {
              parsedSocialLinks = JSON.parse(data.listing.socialLinks);
            } catch (err) {
              console.error("Error parsing socialLinks JSON", err);
            }
          } else if (typeof data.listing.socialLinks === 'object' && data.listing.socialLinks !== null) {
            parsedSocialLinks = data.listing.socialLinks;
          }

          setFormData({
            u_name: data.listing.user_id?.name || '',
            shopName: data.listing.shopName || '',
            email: data.listing.email || '',
            phone: data.listing.phone || '',
            whatsapp: data.listing.whatsapp || '',
            address: data.listing.address || '',
            city: data.listing.city?._id || data.listing.city || '',
            country: data.listing.country || '',
            mapUrl: data.listing.mapUrl || '',
            description: data.listing.description || '',
            categories: data.listing.categories?.map(c => c._id || c) || [],
            petCategories: data.listing.petCategories?.map(c => c._id || c) || [],
            specializedServices: data.listing.specializedServices?.map(s => s._id || s) || [],
            photos: [],
            bannerImage: data.listing.bannerImage || null,
            existingPhotos: data.listing.photos || [],
            metaTitle: data.listing.metaTitle || '',
            metaKeyword: data.listing.metaKeyword
              ? (Array.isArray(data.listing.metaKeyword)
                  ? data.listing.metaKeyword.flatMap(k => k.split(',').map(x => x.trim())).filter(Boolean)
                  : data.listing.metaKeyword.split(',').map(k => k.trim()).filter(Boolean))
              : [],
            metaDescription: data.listing.metaDescription || '',
            status: data.listing.status === 'pending',
            isVerified: data.listing.isVerified || false,
            claimStatus: data.listing.claimStatus || "pending",
            signupStatus: data.listing.signupStatus || "pending",
            verificationMethod: data.listing.verificationMethod || "",
            verificationDocs: data.listing.verificationDocs || [],
            isClaimed: data.listing.isClaimed || false,
            isSignup: data.listing.isSignup || false,

            // POPULATE ADDITIONAL FIELDS
            certifications: data.listing.certifications || [],
            yearsInBusiness: data.listing.yearsInBusiness || 0,
            languagesSpoken: data.listing.languagesSpoken || [],
            amenities: data.listing.amenities || [],
            mapLink: data.listing.mapLink || '',
            serviceAreas: data.listing.serviceAreas || [],
            paymentMethods: data.listing.paymentMethods || [],
            appointmentRequired: data.listing.appointmentRequired || false,
            startingPrice: data.listing.startingPrice || 0,
            customersServed: data.listing.customersServed || 0,
            responseTime: data.listing.responseTime || 'Within a few hours',
            socialLinks: {
              facebook: parsedSocialLinks?.facebook || "",
              instagram: parsedSocialLinks?.instagram || "",
              youtube: parsedSocialLinks?.youtube || "",
              twitter: parsedSocialLinks?.twitter || "",
              linkedin: parsedSocialLinks?.linkedin || "",
              website: parsedSocialLinks?.website || "",
            },
          });

          if (data.listing.businessHours && data.listing.businessHours.length > 0) {
            setBusinessHours(data.listing.businessHours);
          }
        } else {
          alert('Failed to fetch listing');
          navigate('/business-listing');
        }
      } catch (err) {
        console.error('Error fetching listing:', err);
        alert('Error fetching listing');
        navigate('/business-listing');
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id, navigate]);

  useEffect(() => {
    if (!loading && listing) {
      resetInitialSnapshot();
    }
  }, [loading, listing]);
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
  useEffect(() => {
    if (!formData.petCategories || formData.petCategories.length === 0) {
      setCategoryList([]);
      return;
    }
    

    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/category/byPetCategories`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ petCategories: formData.petCategories })
        });

        const data = await res.json();
        if (data.success) {
          setCategoryList(data.categories.map(c => ({ value: c._id, label: c.categoryName })));
        } else {
          setCategoryList([]);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [formData.petCategories]);

  // Helper function to resolve video URL string safely
  const getExistingVideoUrl = (video) => {
    if (!video) return null;
    let target = video;
    if (Array.isArray(video) && video.length > 0) {
      target = video[0];
    }
    const path = typeof target === 'string' ? target : target?.url || target?.path || '';
    if (!path) return null;
    return path.startsWith("http") ? path : `${API_BASE}/${path.replace(/^\/+/, "")}`;
  };

  // General Handlers
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

  const handleCategoryChange = (selected) => {
    setFormData(prev => ({
      ...prev,
      categories: selected ? selected.map(s => s.value) : []
    }));
  };

  const handleServiceChange = (selected) => {
    setFormData(prev => ({
      ...prev,
      specializedServices: selected ? selected.map(s => s.value) : []
    }));
  };

  const handleCityChange = (selected) => {
    setFormData(prev => ({
      ...prev,
      city: selected ? selected.value : ''
    }));
  };

  // Multi-Select Handlers with "All" Support
  const handleMultiSelectWithAll = (field, options, selected) => {
    if (!selected || selected.length === 0) {
      setFormData(prev => ({ ...prev, [field]: [] }));
      return;
    }
    const realOptions = options.filter(opt => opt.value !== 'all').map(opt => opt.value);
    if (selected.some(s => s.value === 'all')) {
      setFormData(prev => ({ ...prev, [field]: realOptions }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: selected.map(s => s.value).filter(v => v !== 'all')
      }));
    }
  };

  // Image & File Handlers
  const handleExistingPhotoAltChange = (index, value) => {
    setFormData(prev => {
      const updatedPhotos = [...prev.existingPhotos];
      updatedPhotos[index] = { ...updatedPhotos[index], alt: value };
      return { ...prev, existingPhotos: updatedPhotos };
    });
  };

  const handleDeleteExistingPhoto = (index) => {
    setFormData(prev => ({
      ...prev,
      existingPhotos: prev.existingPhotos.filter((_, i) => i !== index)
    }));
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      photos: files,
      photoAlts: files.reduce((acc, _, index) => {
        acc[index] = "";
        return acc;
      }, {})
    }));
    setPreviewUrls(files.map(file => URL.createObjectURL(file)));
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const img = new window.Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      if (img.width === 1200 && img.height === 300) {
        setBanner(file);
        setBannerPreview(img.src);
      } else {
        alert("Image must be exactly 1200 × 300");
        e.target.value = "";
      }
    };
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (videoPreviewUrl) {
        URL.revokeObjectURL(videoPreviewUrl);
      }
      setVideoFile(file);
      setVideoPreviewUrl(URL.createObjectURL(file));
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

  const handleRemoveKeyword = (keyword) => {
    setFormData(prev => ({
      ...prev,
      metaKeyword: prev.metaKeyword.filter(k => k !== keyword)
    }));
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in");
      return;
    }

    try {
      const formDataToSend = new FormData();

      // Basic String / Number / Boolean fields
      formDataToSend.append("shopName", formData.shopName);
      formDataToSend.append("email", formData.email || "");
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("whatsapp", formData.whatsapp);
      formDataToSend.append("address", formData.address || "");
      formDataToSend.append("city", formData.city);
      formDataToSend.append("country", formData.country || "");
      formDataToSend.append("mapUrl", formData.mapUrl || "");
      formDataToSend.append("description", formData.description || "");
      formDataToSend.append("metaTitle", formData.metaTitle || "");
      formDataToSend.append("metaDescription", formData.metaDescription || "");
      formDataToSend.append("mapLink", formData.mapLink || "");
      formDataToSend.append("yearsInBusiness", formData.yearsInBusiness || 0);
      formDataToSend.append("customersServed", formData.customersServed || 0);
      formDataToSend.append("startingPrice", formData.startingPrice || 0);
      formDataToSend.append("appointmentRequired", formData.appointmentRequired);
      formDataToSend.append("responseTime", formData.responseTime || "Within a few hours");
      formDataToSend.append("businessHours", JSON.stringify(businessHours));

      // Array fields
      formData.categories.forEach(cat => formDataToSend.append("categories[]", cat));
      formData.petCategories.forEach(cat => formDataToSend.append("petCategories[]", cat));
      formData.specializedServices.forEach(service => formDataToSend.append("specializedServices[]", service));
      formData.languagesSpoken.forEach(lang => formDataToSend.append("languagesSpoken[]", lang));
      formData.certifications.forEach(cert => formDataToSend.append("certifications[]", cert));
      formData.amenities.forEach(amenity => formDataToSend.append("amenities[]", amenity));
      formData.serviceAreas.forEach(area => formDataToSend.append("serviceAreas[]", area));
      formData.paymentMethods.forEach(method => formDataToSend.append("paymentMethods[]", method));
      formData.metaKeyword.forEach(kw => formDataToSend.append("metaKeyword[]", kw));
      formDataToSend.append("socialLinks", JSON.stringify(formData.socialLinks));

      // Photos Handling
      formData.existingPhotos.forEach(photo => {
        formDataToSend.append("existingPhotos[]", JSON.stringify(photo));
      });

      formData.photos.forEach((photo, index) => {
        formDataToSend.append("photos", photo);
        formDataToSend.append("newPhotoAlts[]", newPhotoAlts[index] || "");
      });

      // Banner and Video
      if (banner) {
        formDataToSend.append("bannerImage", banner);
      }

      if (videoFile) {
        formDataToSend.append("videos", videoFile);
      } else if (existingVideo) {
        formDataToSend.append("existingVideo", typeof existingVideo === 'string' ? existingVideo : JSON.stringify(existingVideo));
      }

      console.log("userList", formDataToSend);

      const res = await fetch(`${API_BASE}/api/listing/user/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formDataToSend
      });

      const result = await res.json();
      if (res.ok && result.success) {
        alert("Listing updated successfully!");
        markAsSaved();
        navigate("/business-listing");
      } else {
        alert(result.message || "Failed to update listing");
      }
    } catch (err) {
      console.error("Submission Error:", err);
      alert("Error updating listing");
    }
  };

  if (!id) return <p className="text-danger text-center mt-4">No listing ID provided.</p>;

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (noListing) {
    return (
      <Container className="mt-5">
        <div className='pl-3 pr-3'>
          <Row className="mb-3 justify-content-end align-items-center">
            <Col>
              <h2 className="main-title mb-0">Edit Listing</h2>
              <Breadcrumb className="top-breadcrumb">
                <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                <Breadcrumb.Item active>Edit Listing</Breadcrumb.Item>
              </Breadcrumb>
            </Col>
          </Row>
          <div className='form-container'>
            <Alert variant="secondary" className='text-center'>
              <h5>You don’t have a listing yet.</h5>
            </Alert>
          </div>
        </div>
      </Container>
    );
  }

  const isPendingListing = listing?.status === "pending";
  const isPendingClaim = listing?.isClaimed && listing?.claimStatus === "pending";

  if (isPendingListing || isPendingClaim) {
    return (
      <Container className="mt-5">
        <div className='pl-3 pr-3'>
          <Row className="mb-3 justify-content-end align-items-center">
            <Col>
              <h2 className="main-title mb-0">Edit Listing</h2>
              <Breadcrumb className="top-breadcrumb">
                <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                <Breadcrumb.Item active>Edit Listing</Breadcrumb.Item>
              </Breadcrumb>
            </Col>
          </Row>
          <div className='form-container'>
            <Alert variant="warning" className='text-center'>
              <h5>Your listing is under review</h5>
              <p>Please wait for admin approval.</p>
            </Alert>
          </div>
        </div>
      </Container>
    );
  }

  const videoUrlToDisplay = getExistingVideoUrl(existingVideo);

  return (
    <Container className="mt-4">
      <div className='pl-3 pr-3'>
        <Row className="mb-3 justify-content-end align-items-center">
          <Col>
            <h2 className="main-title mb-0">Edit Listing</h2>
            <Breadcrumb className="top-breadcrumb">
              <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
              <Breadcrumb.Item active>Edit Listing</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>

        <div className='form-container'>
          <Form onSubmit={handleSubmit}>

            {/* Type / Pet Category Select */}
            <Form.Group className="mb-3">
              <Form.Label>Type <span className="text-danger">*</span></Form.Label>
              <Select
                isMulti
                options={[{ value: "all", label: "All Types" }, ...petCategoryList]}
                value={
                  petCategoryList.length > 0 && formData.petCategories.length === petCategoryList.length
                    ? [{ value: "all", label: "All Types" }]
                    : petCategoryList.filter(p => formData.petCategories.includes(p.value))
                }
                onChange={(selected) => handleMultiSelectWithAll("petCategories", petCategoryList, selected)}
              />
            </Form.Group>

            {/* Category Select */}
            <Form.Group className="mb-3">
              <Form.Label>Category <span className="text-danger">*</span></Form.Label>
              <Select
                isMulti
                options={categoryList}
                value={categoryList.filter(c => formData.categories.includes(c.value))}
                onChange={handleCategoryChange}
              />
            </Form.Group>

            {/* Specialized Services */}
            <Form.Group className="mb-3">
              <Form.Label>Specialized Services</Form.Label>
              <Select
                isMulti
                options={serviceList}
                value={serviceList.filter(s => formData.specializedServices.includes(s.value))}
                onChange={handleServiceChange}
                placeholder="Select Services"
              />
            </Form.Group>

            {/* Basic Info Fields */}
            <Form.Group className="mb-3">
              <Form.Label>Shop Name <span className="text-danger">*</span></Form.Label>
              <Form.Control type="text" name="shopName" value={formData.shopName} onChange={handleChange} required disabled />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email </Form.Label>
              <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
            </Form.Group>

            {/* Phone & WhatsApp Side-by-Side */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Phone <span className="text-danger">*</span></Form.Label>
                  <Form.Control type="number" name="phone" value={formData.phone} onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>WhatsApp Number</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="whatsapp" 
                    placeholder="e.g. +1234567890" 
                    value={formData.whatsapp} 
                    onChange={handleChange} 
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Business Hours */}
            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">Business Hours</Form.Label>
              {businessHours.map((item, index) => (
                <Row key={index} className="align-items-center mb-2">
                  <Col md={3}><strong>{item.day}</strong></Col>
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

            {/* Location Details */}
            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control type="text" name="address" value={formData.address} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>City <span className="text-danger">*</span></Form.Label>
              <Select
                options={cityList}
                value={cityList.find(c => c.value === formData.city) || null}
                onChange={handleCityChange}
                placeholder="Select City"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Country</Form.Label>
              <Form.Control type="text" name="country" value={formData.country} onChange={handleChange} disabled readOnly />
            </Form.Group>

            {/* Web & Map URLs */}
            <Form.Group className="mb-3">
              <Form.Label>Website / Embed Map URL</Form.Label>
              <Form.Control type="url" name="mapUrl" value={formData.mapUrl} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleChange} />
            </Form.Group>

            {/* Additional Info Section */}
            <hr className="my-4" />
            <h4 className="mb-3">Additional Business Details</h4>

            <Form.Group className="mb-3">
              <Form.Label>Google Map Link</Form.Label>
              <Form.Control
                type="url"
                name="mapLink"
                placeholder="https://maps.google.com/..."
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
                value={languageOptions.filter(opt => opt.value !== "all" && formData.languagesSpoken.includes(opt.value))}
                onChange={(selected) => handleMultiSelectWithAll("languagesSpoken", languageOptions, selected)}
              />
            </Form.Group>

            {/* Amenities Field */}
            <Form.Group className="mb-3">
              <Form.Label>Amenities</Form.Label>
              <Select
                isMulti
                options={amenityOptions}
                value={amenityOptions.filter(opt => opt.value !== "all" && formData.amenities?.includes(opt.value))}
                onChange={(selected) => handleMultiSelectWithAll("amenities", amenityOptions, selected)}
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
                  <Select
                    isMulti
                    options={paymentOptions}
                    value={paymentOptions.filter(opt => opt.value !== "all" && formData.paymentMethods.includes(opt.value))}
                    onChange={(selected) => handleMultiSelectWithAll("paymentMethods", paymentOptions, selected)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <hr className="my-4" />

            {/* Banner Upload */}
            <Form.Group className="mb-3">
              <Form.Label>Banner Image (1200 × 300)</Form.Label>
              <Form.Control
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleBannerChange}
              />
            </Form.Group>

            {/* Banner Preview */}
            {bannerPreview ? (
              <img
                src={bannerPreview}
                alt="New Banner Preview"
                style={{
                  width: "100%",
                  height: "300px",
                  objectFit: "contain",
                  background: "#f5f5f5",
                  borderRadius: "8px",
                  marginBottom: "10px"
                }}
              />
            ) : existingBanner ? (
              <img
                src={existingBanner.startsWith("http") ? existingBanner : `${API_BASE}/${existingBanner}`}
                alt="Existing Banner"
                style={{
                  width: "100%",
                  height: "300px",
                  objectFit: "contain",
                  background: "#f5f5f5",
                  borderRadius: "8px",
                  marginBottom: "10px"
                }}
              />
            ) : null}

            {/* Video Upload */}
            <Form.Group className="mb-3">
              <Form.Label>Business Video</Form.Label>
              <Form.Control
                type="file"
                accept="video/mp4,video/webm,video/ogg"
                onChange={handleVideoChange}
              />
            </Form.Group>

            {/* Video Preview */}
            {videoPreviewUrl ? (
              <div className="mb-3">
                <p className="mb-1 text-muted">New Video Preview:</p>
                <video
                  src={videoPreviewUrl}
                  controls
                  style={{ width: "100%", maxHeight: "300px", borderRadius: "8px", background: "#000" }}
                />
              </div>
            ) : videoUrlToDisplay ? (
              <div className="mb-3">
                <p className="mb-1 text-muted">Current Video:</p>
                <video
                  src={videoUrlToDisplay}
                  controls
                  style={{ width: "100%", maxHeight: "300px", borderRadius: "8px", background: "#000" }}
                />
              </div>
            ) : null}

            {/* Upload Photos */}
            <Form.Group className="mb-4">
              <Form.Label>Upload New Photos</Form.Label>
              <Form.Control type="file" name="photos" multiple accept="image/*" onChange={handlePhotoChange} />
              <Form.Text className="text-muted">
                Note: You can upload multiple images (JPG, PNG, WEBP) up to 2MB each.
              </Form.Text>
            </Form.Group>

            {/* Existing Photo Previews */}
            {formData.existingPhotos.length > 0 && (
              <Row className="mb-3">
                {formData.existingPhotos.map((photo, idx) => {
                  const imageUrl = photo.url?.startsWith("http")
                    ? photo.url
                    : `${API_BASE}/${photo.url?.replace(/^\/+/, "") || ''}`;

                  return (
                    <Col key={idx} xs={6} md={4} lg={3} className="mb-3 position-relative">
                      <Button
                        variant="danger"
                        size="sm"
                        className="position-absolute"
                        style={{
                          right: "15px",
                          top: "5px",
                          borderRadius: "50%",
                          width: "30px",
                          height: "30px",
                          zIndex: 10
                        }}
                        onClick={() => handleDeleteExistingPhoto(idx)}
                      >
                        ✕
                      </Button>
                      <Image src={imageUrl} thumbnail fluid />
                      <Form.Control
                        className="mt-2"
                        type="text"
                        placeholder="Image Alt Text"
                        value={photo.alt || ""}
                        onChange={(e) => handleExistingPhotoAltChange(idx, e.target.value)}
                      />
                    </Col>
                  );
                })}
              </Row>
            )}

            {/* New Photo Previews */}
            {previewUrls.length > 0 && (
              <Row className="mb-3">
                {previewUrls.map((url, idx) => (
                  <Col key={idx} xs={6} md={4} className="mb-3">
                    <Image src={url} thumbnail fluid />
                    <Form.Control
                      className="mt-2"
                      placeholder="Image Alt Text"
                      value={newPhotoAlts[idx] || ""}
                      onChange={(e) => {
                        const copy = [...newPhotoAlts];
                        copy[idx] = e.target.value;
                        setNewPhotoAlts(copy);
                      }}
                    />
                  </Col>
                ))}
              </Row>
            )}



            <h5 className="mt-4 mb-3 fw-bold">Social Links</h5>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Instagram URL</Form.Label>
                  <Form.Control
                    type="url"
                    name="instagram"
                    placeholder="https://instagram.com/yourhandle"
                    value={formData.socialLinks?.instagram || ""}
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
                    value={formData.socialLinks?.facebook || ""}
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
                    value={formData.socialLinks?.youtube || ""}
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
                    value={formData.socialLinks?.twitter || ""}
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
                    value={formData.socialLinks?.linkedin || ""}
                    onChange={handleSocialChange}
                  />
                </Form.Group>
              </Col>
            </Row>




            {/* Meta Title & Tags */}
            <Form.Group className="mb-3">
              <Form.Label>Meta Title</Form.Label>
              <Form.Control type="text" name="metaTitle" value={formData.metaTitle} onChange={handleChange} />
            </Form.Group>

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
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddKeyword(e))}
                />
                <Button variant="outline-primary" onClick={handleAddKeyword} className="ms-2">
                  Add
                </Button>
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Meta Description</Form.Label>
              <Form.Control as="textarea" rows={3} name="metaDescription" value={formData.metaDescription} onChange={handleChange} />
            </Form.Group>

            <Button variant="primary" type="submit" className="mt-3">
              Save Changes
            </Button>
          </Form>
        </div>
      </div>
    </Container>
  );
};

export default EditListing;