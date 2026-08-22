import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Image, Breadcrumb } from 'react-bootstrap';
import Select from "react-select";
import useUnsavedChanges from "../Hooks/useUnsavedChanges";

const API_BASE =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_URL
    : "http://localhost:5000";

const EditListing = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { id } = state || {};

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
const [newPhotoAlts,setNewPhotoAlts] = useState([]);

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];
// ------------------
// Input states for string arrays
  const [newCertification, setNewCertification] = useState("");
  
  const [newServiceArea, setNewServiceArea] = useState("");
// -----------------------
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
    city: '',          // 🧩 will hold city _id
    country: '',
    mapUrl: '',
    description: '',
    categories: [],     // 🧩 will hold category _ids
    petCategories: [],  // 🧩 will hold petCategory _ids
      specializedServices: [],   // ⭐ ADD THIS
    photos: [],
    existingPhotos: [],
    metaTitle: '',
    metaKeyword: '',
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

    socialLinks: {
      facebook: "",
      instagram: "",
      youtube: "",
      twitter: "",
      linkedin: "",
      website: "",
    },
    // ------------
    
    
    mapLink:  "",
    yearsInBusiness:  0,
    customersServed:  0,
    certifications:  [],
    languagesSpoken:   [],
    amenities:   [],
    serviceAreas:  [],
    appointmentRequired:  false,
    responseTime: "Within a few hours",

    // Pricing & Payments
    startingPrice:  0,
    paymentMethods: [],
    // ------------
  });

  // ---------
  // const amenityOptions = [
  //   { value: "all", label: "All" },
  //   { value: "WiFi", label: "WiFi" },
  //   { value: "Parking", label: "Parking" },
  //   { value: "Air Conditioning", label: "Air Conditioning" },
  //   { value: "Pet Friendly", label: "Pet Friendly" },
  //   { value: "Wheelchair Accessible", label: "Wheelchair Accessible" },
  //   { value: "Waiting Area", label: "Waiting Area" }
  // ];
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
  // Add these states at the top of EditListing
const [video, setVideo] = useState(null);
const [videoPreview, setVideoPreview] = useState(null);
const [existingVideo, setExistingVideo] = useState(null);
  // ✅ Helper function to place outside your component or near the top
const safeParseArray = (val) => {
  if (!val) return [];
  
  // If it's already an array, clean each element
  if (Array.isArray(val)) {
    return val.flatMap(item => safeParseArray(item)).filter(Boolean);
  }
  
  // If it's a string, check if it's JSON stringified (e.g. '["tag1", "tag2"]')
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed);
        return safeParseArray(parsed); // Recursively parse un-nested arrays
      } catch (e) {
        // Fallback if JSON parse fails
      }
    }
    // Handle standard comma-separated strings like "tag1, tag2"
    return trimmed.split(',').map(s => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
  }
  
  return [];
};
  // ---------
  const { confirmLeave, markAsSaved, resetInitialSnapshot } =
    useUnsavedChanges(formData, { excludeKeys: ['photos', 'existingPhotos'] });
const fetchServices = async (categories) => {
  try {
    const res = await fetch(`${API_BASE}/api/specialized-service/byCategories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        categories
      })
    });

    const data = await res.json();

    if (data.success) {
      setServiceList(
        data.services.map(s => ({
          value: s._id,
          label: s.serviceName
        }))
      );
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
  // ✅ Fetch categories, pet categories, and cities (ID + Name)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/category/show`);
        const data = await res.json();
        if (data.success) {
          // 🧩 Keep both id + name
          setCategoryList(
            data.categories.map(c => ({ value: c._id, label: c.categoryName }))
          );
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
          setPetCategoryList(
            data.petCategories.map(c => ({ value: c._id, label: c.categoryName }))
          );
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
          setCityList(
            data.cities.map(c => ({ value: c._id, label: c.city }))
          );
        }
      } catch (err) {
        console.error("Error fetching cities:", err);
      }
    };

    fetchCategories();
    fetchPetCategories();
    fetchCityList();
  }, []);

  // ✅ Fetch listing by ID
  // ✅ Helper to extract video URL as a clean string
const extractVideoUrl = (val) => {
  if (!val) return null;
  if (typeof val === "string") return val;
  if (Array.isArray(val) && val.length > 0) {
    // If videos is stored as an array like ["uploads/..."] or [{ url: "..." }]
    const first = val[0];
    if (typeof first === "string") return first;
    if (first && typeof first === "object" && first.url) return first.url;
  }
  if (typeof val === "object" && val.url) return val.url;
  return null;
};


  useEffect(() => {
    if (!id) return;

    const fetchListing = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/listing/${id}`);
        const data = await res.json();
        // Inside fetchListing (useEffect) in EditListing.js:

        console.log(data.listing);
        if (res.ok && data.success) {
          setListing(data.listing);
          setExistingBanner(data.listing.bannerImage || null);
          //setExistingVideo(data.listing.videos || null);
          if (data.listing.videos && data.listing.videos.length > 0) {
  // Extract url from the schema object
  const firstVideo = data.listing.videos[0];
  const videoUrl = typeof firstVideo === "string" ? firstVideo : firstVideo.url;
  setExistingVideo(videoUrl);
} else {
  setExistingVideo(null);
}

// Safely parse socialLinks if stored as a stringified JSON object
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
            videos: data.listing.videos || null,
            existingPhotos:
  (data.listing.photos || []).map(photo => ({
    url: photo.url || photo,
    alt: photo.alt || ""
  })),
            metaTitle: data.listing.metaTitle || '',
            // metaKeyword: data.listing.metaKeyword
            // ? (
            //     Array.isArray(data.listing.metaKeyword)
            //       ? data.listing.metaKeyword
            //           .flatMap(k => k.split(',').map(x => x.trim()))
            //           .filter(k => k) 
            //       : data.listing.metaKeyword
            //           .split(',')
            //           .map(k => k.trim())
            //           .filter(k => k)
            //   )
            // : [],
            metaDescription: data.listing.metaDescription || '',
            status: data.listing.status === 'approved',
            isVerified: data.listing.isVerified || false, // 
            claimStatus: data.listing.claimStatus || "pending",
            signupStatus: data.listing.signupStatus || "pending",
            verificationMethod: data.listing.verificationMethod || "",
            verificationDocs: data.listing.verificationDocs || [],
            isClaimed: data.listing.isClaimed || false,
            isSignup: data.listing.isSignup || false,
            socialLinks: {
              facebook: parsedSocialLinks?.facebook || "",
              instagram: parsedSocialLinks?.instagram || "",
              youtube: parsedSocialLinks?.youtube || "",
              twitter: parsedSocialLinks?.twitter || "",
              linkedin: parsedSocialLinks?.linkedin || "",
              website: parsedSocialLinks?.website || "",
            },

            // ------------
    
    mapLink: data.listing.mapLink || "",
    yearsInBusiness: data.listing.yearsInBusiness || 0,
    customersServed: data.listing.customersServed || 0,
    // certifications: data.listing.certifications || [],
    // languagesSpoken: data.listing.languagesSpoken || [],
    // serviceAreas: data.listing.serviceAreas || [],
    appointmentRequired: data.listing.appointmentRequired || false,
    responseTime: data.listing.responseTime || "Within a few hours",

    // Pricing & Payments
    startingPrice: data.listing.startingPrice || 0,
    // paymentMethods: data.listing.paymentMethods || [],
    // ✅ CLEAN & SAFE
metaKeyword: safeParseArray(data.listing.metaKeyword),
certifications: safeParseArray(data.listing.certifications),
languagesSpoken: safeParseArray(data.listing.languagesSpoken),
amenities: safeParseArray(data.listing.amenities),
serviceAreas: safeParseArray(data.listing.serviceAreas),
paymentMethods: safeParseArray(data.listing.paymentMethods),

    // ------------
          });
          // ✅ Load business hours from DB
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
  console.log("check",formData);

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

  // Max 50MB limit check
  if (file.size > 50 * 1024 * 1024) {
    alert("Video size must be less than 50MB.");
    e.target.value = "";
    return;
  }

  setVideo(file);
  setVideoPreview(URL.createObjectURL(file));
};

const handleRemoveVideo = () => {
  setVideo(null);
  setVideoPreview(null);
};

  const handleExistingPhotoAltChange = (index,value)=>{

  setFormData(prev=>{

    const updatedPhotos = [...prev.existingPhotos];

    updatedPhotos[index] = {
      ...updatedPhotos[index],
      alt:value
    };

    console.log("UPDATED PHOTO ALT:", updatedPhotos[index]);

    return {
      ...prev,
      existingPhotos:updatedPhotos
    };

  });

};
const handleDeleteExistingPhoto = (index) => {

  setFormData(prev => {

    const updatedPhotos = prev.existingPhotos.filter(
      (_, i) => i !== index
    );

    console.log("AFTER DELETE EXISTING PHOTOS:", updatedPhotos);

    return {
      ...prev,
      existingPhotos: updatedPhotos
    };

  });

};
  const handleServiceChange = (selected) => {
  setFormData(prev => ({
    ...prev,
    specializedServices: selected ? selected.map(s => s.value) : []
  }));
};

  useEffect(() => {
    if (!loading && listing) {
      resetInitialSnapshot();
    }
  }, [loading, listing]);
  useEffect(() => {
  if (!formData.petCategories || formData.petCategories.length === 0) {
    setCategoryList([]);
    return;
  }

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/category/byPetCategories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          petCategories: formData.petCategories
        })
      });

      const data = await res.json();

      if (data.success) {
        setCategoryList(
          data.categories.map(c => ({
            value: c._id,
            label: c.categoryName
          }))
        );
      } else {
        setCategoryList([]);
      }

    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  fetchCategories();
}, [formData.petCategories]);

  const handleVerifiedToggle = () => {
  setFormData(prev => ({
    ...prev,
    isVerified: !prev.isVerified
  }));
};
  // ✅ Handlers
  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData(prev => ({ ...prev, [name]: value }));
  // };
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

  const handleCategoryChange = (selected) => {
    setFormData(prev => ({
      ...prev,
      categories: selected ? selected.map(s => s.value) : []
    }));
  };

  const handlePetCategoryChange = (selected) => {
    setFormData(prev => ({
      ...prev,
      petCategories: selected ? selected.map(s => s.value) : []
    }));
  };

  const handleCityChange = (selected) => {
    setFormData(prev => ({
      ...prev,
      city: selected ? selected.value : ''
    }));
  };

  // const handlePhotoChange = (e) => {
  //   const files = Array.from(e.target.files);
  //   setFormData(prev => ({ ...prev, photos: files }));
  //   setPreviewUrls(files.map(file => URL.createObjectURL(file)));
  // };
  const handlePhotoChange = (e) => {

  const files = Array.from(e.target.files);
    console.log("Selected files:", files);
  setFormData(prev => ({
    ...prev,
    photos: files
  }));


  setNewPhotoAlts(
    files.map(() => "")
  );


  setPreviewUrls(
    files.map(file => URL.createObjectURL(file))
  );

};

  const handleStatusToggle = () => {
    setFormData(prev => ({ ...prev, status: !prev.status }));
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

  // ✅ Submit
  const handleSubmit = async (e) => {
    const token = localStorage.getItem("token");
  if (!token) {
    alert("You must be logged in");
    return;
  }
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.entries({
        shopName: formData.shopName,
        email: formData.email,
        phone: formData.phone,
        whatsapp: formData.whatsapp,
        address: formData.address,
        city: formData.city,
        country: formData.country,
        mapUrl: formData.mapUrl,
        description: formData.description,
        metaTitle: formData.metaTitle,
        //metaKeyword: formData.metaKeyword.join(','),
        metaDescription: formData.metaDescription,
        status: formData.status ? 'approved' : 'pending',
        isVerified: formData.isVerified, 
        createdBy: formData.createdBy,
      }).forEach(([key, val]) => formDataToSend.append(key, val));
formDataToSend.append("businessHours", JSON.stringify(businessHours));


// ----------
formDataToSend.append("socialLinks", JSON.stringify(formData.socialLinks));
      formDataToSend.append("mapLink", formData.mapLink);
      formDataToSend.append("yearsInBusiness", formData.yearsInBusiness);
      formDataToSend.append("customersServed", formData.customersServed);
      //formDataToSend.append("certifications", JSON.stringify(formData.certifications));
     // formDataToSend.append("languagesSpoken", JSON.stringify(formData.languagesSpoken));
      //formDataToSend.append("serviceAreas", JSON.stringify(formData.serviceAreas));
      formDataToSend.append("appointmentRequired", formData.appointmentRequired);
      formDataToSend.append("responseTime", formData.responseTime);
      formDataToSend.append("startingPrice", formData.startingPrice);
      // formDataToSend.append("paymentMethods", formData.paymentMethods);
      if (video) {
  formDataToSend.append("videos", video);
}


      // ✅ In handleSubmit:
formDataToSend.append("metaKeyword", formData.metaKeyword.join(','));
formDataToSend.append("certifications", JSON.stringify(formData.certifications));
formDataToSend.append("languagesSpoken", JSON.stringify(formData.languagesSpoken));
formDataToSend.append("amenities", JSON.stringify(formData.amenities));
formDataToSend.append("serviceAreas", JSON.stringify(formData.serviceAreas));
      // ✅ CORRECT
if (Array.isArray(formData.paymentMethods)) {
  formData.paymentMethods.forEach((method) => {
    formDataToSend.append("paymentMethods[]", method);
  });
}
      // ----------
      formData.categories.forEach(cat => formDataToSend.append('categories[]', cat));
      formData.petCategories.forEach(cat => formDataToSend.append('petCategories[]', cat));
      // formData.photos.forEach(photo => formDataToSend.append('photos', photo));
      formData.photos.forEach((photo,index)=>{

 formDataToSend.append(
   "photos",
   photo
 );


 formDataToSend.append(
   "newPhotoAlts[]",
   newPhotoAlts[index] || ""
 );

});
      formData.specializedServices.forEach(service =>
  formDataToSend.append("specializedServices[]", service)
);
      formData.existingPhotos.forEach(photo => {

 formDataToSend.append(
   "existingPhotos[]",
   JSON.stringify(photo)
 );

});
      if (banner) {
  formDataToSend.append("bannerImage", banner);  
}
if (formData.isClaimed) {
  formDataToSend.append("claimStatus", formData.claimStatus);
}
// console.log("Submitting claimStatus:", formData.claimStatus);
console.log("=== NEW PHOTOS ===");

for (let pair of formDataToSend.entries()) {
  if (pair[0] === "photos") {
    console.log("Photo file:", pair[1]);
  }

  if (pair[0] === "newPhotoAlts[]") {
    console.log("Photo Alt:", pair[1]);
  }
}

console.log("=== EXISTING PHOTOS ===");

for (let pair of formDataToSend.entries()) {
  if (pair[0] === "existingPhotos[]") {
    console.log(
      "Existing Photo:",
      JSON.parse(pair[1])
    );
  }
}
      const res = await fetch(`${API_BASE}/api/listing/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`, // ✅ send token
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
      console.error(err);
      alert("Error updating listing");
    }
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


  const handleGoBack = () => {
    if (!confirmLeave()) return;
    navigate(-1);
  };

  if (!id) return <p className="text-danger text-center mt-4">No listing ID provided.</p>;
  if (loading) return <p className="text-center mt-4">Loading listing details...</p>;
  if (!listing) return <p className="text-danger text-center mt-4">Listing not found.</p>;
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
          <Col xs="auto">
            <Button variant="secondary" onClick={handleGoBack}>
              Go Back
            </Button>
          </Col>
        </Row>

        <div className='form-container'>
          {/* {console.log("Form Data:", formData)} */}
          <Form onSubmit={handleSubmit}>
            {formData.u_name && (
              <h3 className="mb-4">Created by : {formData.u_name.toUpperCase()}</h3>
            )}

            {formData.isClaimed && (
              <Form.Group className="mb-3">
                <Form.Check
                  type="switch"
                  id="claim-status-switch"
                  label={
                    formData.claimStatus === "approved"
                      ? "Claim Approved"
                      : "Claim Pending"
                  }
                  checked={formData.claimStatus === "approved"}
                  onChange={() =>
                    setFormData(prev => ({
                      ...prev,
                      claimStatus: prev.claimStatus === "approved" ? "pending" : "approved"
                    }))
                  }
                />
              </Form.Group>
            )}

            {/* Verified Toggle */}
            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                id="verified-switch"
                label={formData.isVerified ? "Verified Listing" : "Not Verified"}
                checked={formData.isVerified}
                onChange={handleVerifiedToggle}
              />
            </Form.Group>

            {/* Status Toggle */}
            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                id="status-switch"
                label={formData.status ? "Approved" : "Pending"}
                checked={formData.status}
                onChange={handleStatusToggle}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Type <span className="text-danger">*</span></Form.Label>
              {/* <Select
                isMulti
                options={petCategoryList}
                value={petCategoryList.filter(c => formData.petCategories.includes(c.value))}
                onChange={handlePetCategoryChange}
              /> */}
              <Select
  isMulti
  options={[
    { value: "all", label: "All Types" },   // ✅ Add All option
    ...petCategoryList
  ]}
  value={
    petCategoryList.length > 0 &&
formData.petCategories.length === petCategoryList.length
      ? [{ value: "all", label: "All Types" }]
      : petCategoryList.filter(p =>
          formData.petCategories.includes(p.value)
        )
  }
  onChange={(selected) => {
    if (!selected) {
      setFormData(prev => ({ ...prev, petCategories: [] }));
      return;
    }

    // ✅ If All selected
    if (selected.some(s => s.value === "all")) {
      setFormData(prev => ({
        ...prev,
        petCategories: petCategoryList.map(p => p.value)
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

            {/* Pet Type Select */}
            
            <Form.Group className="mb-3">
              <Form.Label>Specialized Services</Form.Label>

              <Select
                isMulti
                options={serviceList}
                value={serviceList.filter(s =>
                  formData.specializedServices.includes(s.value)
                )}
                onChange={handleServiceChange}
                placeholder="Select Services"
              />
            </Form.Group>

            {/* Basic Fields */}
            <Form.Group className="mb-3">
              <Form.Label>Shop Name <span className="text-danger">*</span></Form.Label>
              <Form.Control type="text" name="shopName" value={formData.shopName} onChange={handleChange} required disabled />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email </Form.Label>
              <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone <span className="text-danger">*</span></Form.Label>
              <Form.Control type="number" name="phone" value={formData.phone} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Whatsapp <span className="text-danger">*</span></Form.Label>
              <Form.Control type="number" name="whatsapp" value={formData.whatsapp} onChange={handleChange} required />
            </Form.Group>
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

            <Form.Group className="mb-3">
              <Form.Label>Website URL</Form.Label>
              <Form.Control type="url" name="mapUrl" value={formData.mapUrl} onChange={handleChange} />
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

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleChange} />
            </Form.Group>
            {/* Banner Image Upload */}
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



            {/* Photos */}
            <Form.Group className="mb-4">
              <Form.Label>Upload New Photos</Form.Label>
              <Form.Control type="file" name="photos" multiple accept="image/*" onChange={handlePhotoChange} />
              <Form.Text className="text-muted">
                              Note : You can upload multiple images (JPG, PNG, WEBP) up to 2MB each.
                            </Form.Text>
            </Form.Group>

            {/* Existing Photo Previews */}
            {/* {formData.existingPhotos.length > 0 && (
<Row className="mb-3">

{formData.existingPhotos.map((photo, idx)=>{

const imageUrl =
photo.url?.startsWith("http")
? photo.url
: `${API_BASE}/${photo.url.replace(/^\/+/,"")}`;


return (

<Col key={idx} xs={6} md={4} lg={3} className="mb-3">

<Image 
src={imageUrl}
thumbnail
fluid
/>


<Form.Control
className="mt-2"
type="text"
placeholder="Image Alt Text"
value={photo.alt || ""}
onChange={(e)=>
 handleExistingPhotoAltChange(
 idx,
 e.target.value
 )
}
/>


</Col>

)

})}

</Row>
)} */}
{formData.existingPhotos.length > 0 && (
  <Row className="mb-3">
    {formData.existingPhotos.map((photo, idx) => {
      // 1. Safely extract a string URL regardless of how photo data is structured
      let rawUrl = "";
      if (typeof photo.url === "string") {
        rawUrl = photo.url;
      } else if (typeof photo === "string") {
        rawUrl = photo;
      } else if (photo?.url && typeof photo.url === "object" && photo.url.url) {
        rawUrl = photo.url.url; // Handles nested objects if any
      }

      // 2. Build the full image URL safely
      const imageUrl = rawUrl.startsWith("http")
        ? rawUrl
        : `${API_BASE}/${rawUrl.replace(/^\/+/, "")}`;

      return (
        <Col 
          key={idx} 
          xs={6} 
          md={4} 
          lg={3} 
          className="mb-3 position-relative"
        >
          {/* DELETE BUTTON */}
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

          <Image 
            src={imageUrl}
            thumbnail
            fluid
          />

          <Form.Control
            className="mt-2"
            type="text"
            placeholder="Image Alt Text"
            value={photo.alt || ""}
            onChange={(e) =>
              handleExistingPhotoAltChange(idx, e.target.value)
            }
          />
        </Col>
      );
    })}
  </Row>
)}

            {/* New Photo Previews */}
            {/* {previewUrls.length > 0 && (
              <Row className="mb-3">
                {previewUrls.map((url, idx) => (
                  <Col key={idx} xs={6} md={4} lg={3} className="mb-2">
                    <Image src={url} thumbnail fluid />
                  </Col>
                ))}
              </Row>
            )} */}
            {previewUrls.map((url,idx)=>(

<Col key={idx} xs={6} md={4}>

<Image src={url} thumbnail fluid />


<Form.Control
 className="mt-2"
 placeholder="Image Alt Text"
 value={newPhotoAlts[idx] || ""}
 onChange={(e)=>{

   const copy=[...newPhotoAlts];

   copy[idx]=e.target.value;

   setNewPhotoAlts(copy);

 }}
/>

</Col>

))}

{/* Video Upload Section */}
<Form.Group className="mb-4">
  <Form.Label className="fw-bold">Upload Listing Video</Form.Label>
  <Form.Control
    type="file"
    accept="video/mp4,video/webm,video/ogg"
    onChange={handleVideoChange}
  />
  <Form.Text className="text-muted">
    Upload MP4, WebM, or OGG format (Max 50MB).
  </Form.Text>

  {/* Preview newly selected video */}
  {videoPreview && (
    <div className="mt-3 position-relative" style={{ maxWidth: "400px" }}>
      <Button
        variant="danger"
        size="sm"
        className="position-absolute"
        style={{ top: "10px", right: "10px", zIndex: 10, borderRadius: "50%" }}
        onClick={handleRemoveVideo}
      >
        ✕
      </Button>
      <video
        controls
        src={videoPreview}
        style={{ width: "100%", borderRadius: "8px" }}
      />
    </div>
  )}

  {/* ✅ SAFE VIDEO DISPLAY COMPONENT */}
{!videoPreview && existingVideo && (
  <div className="mt-3" style={{ maxWidth: "400px" }}>
    <p className="text-muted mb-1">Current Saved Video:</p>
    <video
      controls
      src={
        typeof existingVideo === "string" && existingVideo.startsWith("http")
          ? existingVideo
          : `${API_BASE}/${existingVideo}`
      }
      style={{ width: "100%", borderRadius: "8px" }}
    />
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

            {/* Meta Fields */}
            <Form.Group className="mb-3">
              <Form.Label>Meta Title</Form.Label>
              <Form.Control type="text" name="metaTitle" value={formData.metaTitle} onChange={handleChange} />
            </Form.Group>

            {/* ✅ Keyword Tags */}
            <Form.Group className="mb-3">
              <Form.Label>Meta Keywords</Form.Label>

              <div className="d-flex flex-wrap gap-2 mb-2">
                {/* {console.log("Current keywords:", formData.metaKeyword)} */}
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

            <Form.Group className="mb-3">
              <Form.Label>Meta Description</Form.Label>
              <Form.Control as="textarea" rows={3} name="metaDescription" value={formData.metaDescription} onChange={handleChange} />
            </Form.Group>

            {formData.isSignup && (
              <Form.Group className="mb-3">
                <Form.Label>Verification Method</Form.Label>
                <Form.Select
                  value={formData.verificationMethod}
                  disabled
                >
                  <option value="">Not selected</option>
                  <option value="email">Email OTP</option>
                  <option value="document">Document Verification</option>
                </Form.Select>
              </Form.Group>


            )}

            {formData.isSignup && formData.verificationMethod === "document" &&
  formData.verificationDocs.length > 0 && (
    <Form.Group className="mb-4">
      <Form.Label>Verification Documents</Form.Label>

      <Row>
        {formData.verificationDocs.map((doc, idx) => {
          const docUrl = doc.startsWith("http")
            ? doc
            : `${API_BASE}/${doc}`;

          // ✅ Better detection
          const lower = doc.toLowerCase();
          const isPdf = lower.includes(".pdf");
          const isImage =
            lower.includes(".jpg") ||
            lower.includes(".jpeg") ||
            lower.includes(".png") ||
            lower.includes(".webp");

          return (
            <Col key={idx} md={4} className="mb-3">

              {/* ✅ IMAGE PREVIEW */}
              {isImage && (
                <a href={docUrl} target="_blank" rel="noreferrer">
                  <img
                    src={docUrl}
                    alt={`doc-${idx}`}
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      border: "1px solid #ddd"
                    }}
                  />
                </a>
              )}

              {/* ✅ PDF VIEW BUTTON */}
              {isPdf && (
                <a
                  href={docUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-danger w-100"
                >
                  View PDF {idx + 1}
                </a>
              )}

              {/* ✅ FALLBACK */}
              {!isPdf && !isImage && (
                <a
                  href={docUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary w-100"
                >
                  Open File {idx + 1}
                </a>
              )}
            </Col>
          );
        })}
      </Row>
    </Form.Group>
)}

            {formData.isClaimed && (
              <Form.Group className="mb-3">
                <Form.Label>Verification Method</Form.Label>
                <Form.Select
                  value={formData.verificationMethod}
                  disabled
                >
                  <option value="">Not selected</option>
                  <option value="email">Email OTP</option>
                  <option value="document">Document Verification</option>
                </Form.Select>
              </Form.Group>


            )}

              {/* {formData.isClaimed && formData.verificationMethod === "document" &&
                formData.verificationDocs.length > 0 && (
                  <Form.Group className="mb-4">
                    <Form.Label>Verification Documents</Form.Label>

                    <Row>
                      {formData.verificationDocs.map((doc, idx) => {
                        const docUrl = doc.startsWith("http")
                          ? doc
                          : `${API_BASE}/${doc}`;

                        const isPdf = doc.endsWith(".pdf");

                        return (
                          <Col key={idx} md={4} className="mb-3">
                            {isPdf ? (
                              <iframe
                                src={docUrl}
                                title={`doc-${idx}`}
                                width="100%"
                                height="250"
                                style={{ border: "1px solid #ddd" }}
                              />
                            ) : (
                              <a
                                href={docUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="btn btn-outline-primary w-100"
                              >
                                View Document {idx + 1}
                              </a>
                            )}
                          </Col>
                        );
                      })}
                    </Row>
                  </Form.Group>
              )} */}
              {formData.isClaimed && formData.verificationMethod === "document" &&
  formData.verificationDocs.length > 0 && (
    <Form.Group className="mb-4">
      <Form.Label>Verification Documents</Form.Label>

      <Row>
        {formData.verificationDocs.map((doc, idx) => {
          const docUrl = doc.startsWith("http")
            ? doc
            : `${API_BASE}/${doc}`;

          // ✅ Better detection
          const lower = doc.toLowerCase();
          const isPdf = lower.includes(".pdf");
          const isImage =
            lower.includes(".jpg") ||
            lower.includes(".jpeg") ||
            lower.includes(".png") ||
            lower.includes(".webp");

          return (
            <Col key={idx} md={4} className="mb-3">

              {/* ✅ IMAGE PREVIEW */}
              {isImage && (
                <a href={docUrl} target="_blank" rel="noreferrer">
                  <img
                    src={docUrl}
                    alt={`doc-${idx}`}
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      border: "1px solid #ddd"
                    }}
                  />
                </a>
              )}

              {/* ✅ PDF VIEW BUTTON */}
              {isPdf && (
                <a
                  href={docUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-danger w-100"
                >
                  View PDF {idx + 1}
                </a>
              )}

              {/* ✅ FALLBACK */}
              {!isPdf && !isImage && (
                <a
                  href={docUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary w-100"
                >
                  Open File {idx + 1}
                </a>
              )}
            </Col>
          );
        })}
      </Row>
    </Form.Group>
)}

            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Form>
        </div>
      </div>
    </Container>
  );
};

export default EditListing;
