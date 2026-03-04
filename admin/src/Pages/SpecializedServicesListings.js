// src/Pages/SpecializedServiceList.js

import React, { useEffect, useState } from "react";
import { Table, Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://petshop-admin.onrender.com"
    : "http://localhost:5000";

export default function SpecializedServiceList() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/specialized-service`);
      const data = await res.json();
      setServices(data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service?"))
      return;

    try {
      const res = await fetch(
        `${API_BASE}/api/specialized-service/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Delete failed");
        return;
      }

      fetchServices();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container className="mt-4">
      <h3>Specialized Services</h3>

      <Link to="/add-specialized-service">
        <Button className="mb-3">Add New</Button>
      </Link>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Service Name</th>
              <th>Category</th>
              <th>Pet Category</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {services.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">
                  No Services Found
                </td>
              </tr>
            ) : (
              services.map((service, index) => (
                <tr key={service._id}>
                  <td>{index + 1}</td>
                  <td>{service.serviceName}</td>
                  <td>{service.category?.categoryName}</td>
                  <td>{service.petCategory?.categoryName}</td>
                  <td>
                    <Link
                      to={`/edit-specialized-service/${service._id}`}
                    >
                      <Button size="sm" variant="warning">
                        Edit
                      </Button>
                    </Link>{" "}
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() =>
                        handleDelete(service._id)
                      }
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}
    </Container>
  );
}