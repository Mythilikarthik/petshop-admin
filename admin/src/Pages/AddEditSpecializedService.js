// src/Pages/AddEditSpecializedService.js

import React, { useEffect, useState } from "react";
import { Form, Button, Container, Row, Col, Breadcrumb } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import useUnsavedChanges from "../Hooks/useUnsavedChanges";
import Select from 'react-select';


const API_BASE =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_URL
    : "http://localhost:5000";

export default function AddEditSpecializedService() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    serviceName: "",
    petCategories: [],
    // category: "",
    category: [],
    description: "",
    show: true,
  });
const { resetInitialSnapshot, confirmLeave, markAsSaved } =
    useUnsavedChanges(form);
  const [petCategories, setPetCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ✅ Load dropdown data
  useEffect(() => {
    fetchPetCategories();
    fetchCategories();

    if (id) {
      fetch(`${API_BASE}/api/specialized-service/${id}`)
        .then(res => res.json())
        .then(data => {
          setForm({
          serviceName: data.serviceName || "",
          petCategories: data.petCategories || [],
          // category: data.category || "",
          category: data.category ? data.category.map(c => c._id || c) : [],
          description: data.description || "",
          show: data.show ?? true,
        });
            setTimeout(() => resetInitialSnapshot(), 0);
        });
    }
  }, [id]);

  // 🐾 Fetch Pet Categories (only show = true)
  const fetchPetCategories = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/pet-category/show`);
      const data = await res.json();

      if (data.success) {
        setPetCategories(data.petCategories);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 📂 Fetch All Categories
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/category/show`);
      const data = await res.json();

      if (data.success) {
        setAllCategories(data.categories);
      }
    } catch (err) {
      console.error(err);
    }
  };
  console.log("allCategory", allCategories);

  // ✅ When PetCategory changes → filter Categories
//   useEffect(() => {
//   if (!form.petCategory) {
//     setFilteredCategories([]);
//     return;
//   }

//   const filtered = allCategories.filter(cat =>
//     cat.show === true &&
//     Array.isArray(cat.petCategories) &&
//     cat.petCategories.some(petId => String(petId._id) === String(form.petCategory))
//   );

//   setFilteredCategories(filtered);

//   // reset category if not valid
//   if (!filtered.some(c => String(c._id) === String(form.category))) {
//     setForm(prev => ({
//       ...prev,
//       category: filtered.length === 1 ? filtered[0]._id : ""
//     }));
//   }

// }, [form.petCategory, allCategories]);
// working except all types
// useEffect(() => {
//   if (!form.petCategories.length) {
//     setFilteredCategories([]);
//     return;
//   }

//   const isAllSelected = form.petCategories.includes("all");

//   const filtered = allCategories.filter(cat => {
//     if (!cat.show || !Array.isArray(cat.petCategories)) return false;

//     // ✅ If ALL selected → show all categories
//     // if (isAllSelected) return true;
//     const totalPetIds = petCategories.map(p => String(p._id));

// const filtered = allCategories.filter(cat => {
//   if (!cat.show || !Array.isArray(cat.petCategories)) return false;

//   const allowedPets = cat.petCategories.map(p => String(p._id));

//   // ✅ ALL selected → category must contain ALL pet types
//   if (isAllSelected) {
//     return (
//       allowedPets.length === totalPetIds.length &&
//       totalPetIds.every(p => allowedPets.includes(p))
//     );
//   }

//   // ✅ NORMAL exact match
//   const selectedPets = form.petCategories.map(String);

//   const isExactMatch =
//     allowedPets.length === selectedPets.length &&
//     selectedPets.every(p => allowedPets.includes(p));

//   return isExactMatch;
// });

//     const allowedPets = cat.petCategories.map(p => String(p._id));

//     const selectedPets = form.petCategories.map(String);

//     // ✅ EXACT MATCH CONDITION
//     const isExactMatch =
//       allowedPets.length === selectedPets.length &&
//       selectedPets.every(p => allowedPets.includes(p));

//     return isExactMatch;
//   });

//   setFilteredCategories(filtered);

//   // reset invalid category
//   if (!filtered.some(c => String(c._id) === String(form.category))) {
//     setForm(prev => ({
//       ...prev,
//       category: filtered.length === 1 ? filtered[0]._id : ""
//     }));
//   }

// }, [form.petCategories, allCategories]);
// useEffect(() => {
//   if (!form.petCategories.length) {
//     setFilteredCategories([]);
//     return;
//   }

//   const isAllSelected = form.petCategories.includes("all");
  

//   // ✅ Get ALL pet IDs from DB
//   const totalPetIds = petCategories.map(p => String(p._id));

//   const filtered = allCategories.filter(cat => {
//     if (!cat.show || !Array.isArray(cat.petCategories)) return false;

//     const allowedPets = cat.petCategories.map(p => String(p._id));

//     // ✅ CASE 1: ALL selected
//     if (isAllSelected) {
//       return (
//         allowedPets.length === totalPetIds.length &&
//         totalPetIds.every(id => allowedPets.includes(id))
//       );
//     }

//     // ✅ CASE 2: Selected pets (exact match)
//     const selectedPets = form.petCategories.map(String);

//     return (
//       allowedPets.length === selectedPets.length &&
//       selectedPets.every(id => allowedPets.includes(id))
//     );
//   });

//   setFilteredCategories(filtered);

//   // reset invalid category
//   if (!filtered.some(c => String(c._id) === String(form.category))) {
//     setForm(prev => ({
//       ...prev,
//       category: filtered.length === 1 ? filtered[0]._id : ""
//     }));
//   }

// }, [form.petCategories, allCategories, petCategories]);
useEffect(() => {
  // if (!form.petCategories.length) {
  //   setFilteredCategories([]);
  //   return;
  // }
  if (
  !form.petCategories.length ||
  !allCategories.length ||
  !petCategories.length
) {
  return; 
}

  const isAllSelected = form.petCategories.includes("all");
  const totalPetIds = petCategories.map(p => String(p._id));

  const filtered = allCategories.filter(cat => {
    if (!cat.show || !Array.isArray(cat.petCategories)) return false;

    const allowedPets = cat.petCategories.map(p => String(p._id));

    // ✅ ALL selected
    if (isAllSelected) {
      return (
        allowedPets.length === totalPetIds.length &&
        totalPetIds.every(id => allowedPets.includes(id))
      );
    }

    // ✅ Exact match
    const selectedPets = form.petCategories.map(String);

    return (
      allowedPets.length === selectedPets.length &&
      selectedPets.every(id => allowedPets.includes(id))
    );
  });

  setFilteredCategories(filtered);

  // ✅ FIX for multi-category
  // if (!filtered.some(c => form.category.includes(String(c._id)))) {
  if (!id && !filtered.some(c => form.category.includes(String(c._id)))) {
    setForm(prev => ({
      ...prev,
      category: filtered.length === 1 ? [filtered[0]._id] : []
    }));
  }

}, [form.petCategories, allCategories, petCategories]);

  const handleChange = (e) => {
  const { name, value, type, checked } = e.target;

  if (name === "petCategory") {
    // reset category immediately when petCategory changes
    setForm(prev => ({
      ...prev,
      petCategory: value,
      // category: ""
      category: []
    }));
  } else {
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
//     const selectedCategory = allCategories.find(
//   c => String(c._id) === String(form.category)
// );

// if (!selectedCategory) {
//   setError("Invalid category selected");
//   setLoading(false);
//   return;
// }
// 
//
//const selectedCategories = allCategories.filter(c =>
//   form.category.includes(String(c._id))
// );

// if (!selectedCategories.length) {
//   setError("Invalid category selected");
//   setLoading(false);
//   return;
// }

// const allowedPets = (selectedCategory.petCategories || []).map(p =>
//   String(p._id)
// );

// // ✅ STRICT INTERSECTION CHECK
// // const isValid = form.petCategories.every(petId =>
// //   allowedPets.includes(String(petId))
// // );
// const isAllSelected = form.petCategories.includes("all");
// const finalPetCategories = isAllSelected
//   ? petCategories.map(p => String(p._id))
//   : form.petCategories;

// if (!isAllSelected) {
//   const selectedPets = form.petCategories.map(String);

//   const isExactMatch =
//     allowedPets.length === selectedPets.length &&
//     selectedPets.every(p => allowedPets.includes(p));

//   if (!isExactMatch) {
//     setError("Selected category is not valid for chosen pet types");
//     setLoading(false);
//     return;
//   }
const selectedCategories = allCategories.filter(c =>
  form.category.includes(String(c._id))
);

if (!selectedCategories.length) {
  setError("Invalid category selected");
  setLoading(false);
  return;
}

const isAllSelected = form.petCategories.includes("all");

const finalPetCategories = isAllSelected
  ? petCategories.map(p => String(p._id))
  : form.petCategories;

// ✅ Validate ALL selected categories
if (!isAllSelected) {
  const selectedPets = form.petCategories.map(String);

  for (let cat of selectedCategories) {
    const allowedPets = (cat.petCategories || []).map(p =>
      String(p._id)
    );

    const isExactMatch =
      allowedPets.length === selectedPets.length &&
      selectedPets.every(p => allowedPets.includes(p));

    if (!isExactMatch) {
      setError(`Category "${cat.categoryName}" is not valid for selected pet types`);
      setLoading(false);
      return;
    }
  }

}



    try {
      const url = id
        ? `${API_BASE}/api/specialized-service/${id}`
        : `${API_BASE}/api/specialized-service`;

      const method = id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        // body: JSON.stringify(form),
        body: JSON.stringify({
  ...form,
  petCategories: finalPetCategories
})
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }
      markAsSaved();
      setSuccess("Saved successfully!");
      setTimeout(() => navigate("/specialized-services-listing"), 1200);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <Row className="mb-3 justify-content-between align-items-center">
        <Col>
          <h2>{id ? "Edit" : "Add"} Specialized Service</h2>
          <Breadcrumb>
            <Breadcrumb.Item onClick={() => navigate("/")}>
              Home
            </Breadcrumb.Item>
            <Breadcrumb.Item active>
              {id ? "Edit Service" : "Add Service"}
            </Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Col xs="auto">
          <Button variant="secondary" onClick={() => {
            if(!(confirmLeave)) return
            navigate("/specialized-services-listing")
          }}>
            Go Back
          </Button>
        </Col>
      </Row>
{console.log("petcategories", petCategories)}
{console.log("categories" , filteredCategories)}
      <div className="form-container">
        <Form onSubmit={handleSubmit}>

          {/* Pet Category First */}
          {/* <Form.Group className="mb-3">
            <Form.Label>Select Pet Category</Form.Label>
            <Form.Select
              name="petCategory"
              value={form.petCategory}
              onChange={handleChange}
              required
            >
              <option value="">Select Pet Category</option>
              {petCategories.map(pet => (
                <option key={pet._id} value={pet._id}>
                  {pet.categoryName}
                </option>
              ))}
            </Form.Select>
          </Form.Group> */}
          <Form.Group className="mb-3">
  <Form.Label>Select Pet Categories</Form.Label>
  <Select
  isMulti
  options={[
    { value: "all", label: "All Types" }, // ✅ ADD THIS
    ...petCategories.map(p => ({
      value: p._id,
      label: p.categoryName
    }))
  ]}
  value={[
    ...(
      form.petCategories.includes("all")
        ? [{ value: "all", label: "All Types" }]
        : []
    ),
    ...petCategories
      .filter(opt => form.petCategories.includes(opt._id))
      .map(p => ({
        value: p._id,
        label: p.categoryName
      }))
  ]}
  onChange={(selected) => {
    const values = selected ? selected.map(s => s.value) : [];

    // 🔥 LOGIC: if "all" selected → ignore others
    if (values.includes("all")) {
      setForm(prev => ({
        ...prev,
        petCategories: ["all"],
        category: []
      }));
    } else {
      setForm(prev => ({
        ...prev,
        petCategories: values,
        category: []
      }));
    }
  }}
  placeholder="Select pet types..."
/>
</Form.Group>

          {/* Filtered Category */}
          {/* <Form.Group className="mb-3">
            <Form.Label>Select Category</Form.Label>
            <Form.Select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              disabled={!form.petCategories.length}
            >
              <option value="">Select Category</option>
              {filteredCategories.map(cat => (
                <option key={cat._id} value={cat._id}>
                  {cat.categoryName}
                </option>
              ))}
            </Form.Select>
          </Form.Group> */}
          <Form.Group className="mb-3">
  <Form.Label>Select Categories</Form.Label>

  <Select
    isMulti
    options={filteredCategories.map(cat => ({
      value: cat._id,
      label: cat.categoryName
    }))}

    value={filteredCategories
      // .filter(cat => form.category.includes(cat._id))
      .filter(cat => form.category.includes(String(cat._id)))
      .map(cat => ({
        value: cat._id,
        label: cat.categoryName
      }))
    }

    onChange={(selected) => {
      const values = selected ? selected.map(s => s.value) : [];

      setForm(prev => ({
        ...prev,
        category: values
      }));
    }}

    placeholder="Select categories..."
    isDisabled={!form.petCategories.length}
  />
</Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Service Name</Form.Label>
            <Form.Control
              type="text"
              name="serviceName"
              value={form.serviceName}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Check
            type="checkbox"
            label="Show"
            name="show"
            checked={form.show}
            onChange={handleChange}
            className="mb-3"
          />

          {error && <p className="text-danger">{error}</p>}
          {success && <p className="text-success">{success}</p>}

          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : id ? "Update Service" : "Create Service"}
          </Button>

        </Form>
      </div>
    </Container>
  );
}