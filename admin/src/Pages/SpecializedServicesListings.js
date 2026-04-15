// src/Pages/SpecializedServiceList.js

import React, { useEffect, useState } from "react";
import { Row, Table, Button, Form, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";

const API_BASE =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_URL
    : "http://localhost:5000";

export default function SpecializedServiceList() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [pageNumber, setPageNumber] = useState(0);
  const servicesPerPage = 10;

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
        { method: "DELETE" }
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

  const toggleShow = async (id, currentStatus) => {
    try {
      const res = await fetch(
        `${API_BASE}/api/specialized-service/${id}/toggle`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ show: !currentStatus }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Update failed");
        return;
      }

      fetchServices();
    } catch (err) {
      console.error(err);
    }
  };

  /* SEARCH FILTER */

  const filteredServices = services.filter((service) => {
    const searchText = search.toLowerCase();

    return (
      service.serviceName?.toLowerCase().includes(searchText) ||
      service.category?.categoryName?.toLowerCase().includes(searchText) ||
      service.petCategory?.categoryName?.toLowerCase().includes(searchText)
    );
  });

  /* PAGINATION */

  const pagesVisited = pageNumber * servicesPerPage;

  const displayServices = filteredServices
    .slice(pagesVisited, pagesVisited + servicesPerPage)
    .map((service, index) => (
      <tr key={service._id}>
        <td>{pagesVisited + index + 1}</td>
        <td>{service.serviceName}</td>
        {/* <td>{service.category?.categoryName}</td> */}
        <td>
  {service.category?.length > 0
    ? service.category.map(c => c.categoryName).join(", ")
    : "-"}
</td>
        <td>
  {service.petCategories?.length > 0
    ? service.petCategories.map(p => p.categoryName).join(", ")
    : "-"}
</td>

        <td>
          <Form.Check
            type="switch"
            checked={service.show}
            onChange={() => toggleShow(service._id, service.show)}
          />
        </td>

        <td>
          <Link to={`/edit-specialized-service/${service._id}`}>
            <Button size="sm" variant="primary">
              Edit
            </Button>
          </Link>{" "}
          <Button
            size="sm"
            variant="danger"
            onClick={() => handleDelete(service._id)}
          >
            Delete
          </Button>
        </td>
      </tr>
    ));

  const pageCount = Math.ceil(filteredServices.length / servicesPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  return (
    <div className="container mt-4">
      <div className="pl-3 pr-3">
        <h3>Specialized Services</h3>
        <Row className="d-flex align-items-center justify-content-between">
          <Col xs={10}>
          <div style={{"position" : "relative"}}>
             {/* SEARCH */}
        <Form.Control
          type="text"
          placeholder="Search by service, category, pet category"
          className="mb-3"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPageNumber(0);
          }}
        />
            {search && (
              <span
                onClick={() => {
                  setSearch("");
                  setPageNumber(0);
                }}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  fontSize: "18px",
                  color: "#888"
                }}
              >
                ✕
              </span>
            )}
          </div>
          
          </Col>
          <Col xs={2}>
           <Link to="/add-specialized-service">
          <Button className="mb-3">Add New</Button>
        </Link>
          </Col>
        </Row>

       

       

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Service Name</th>
                  <th>Category</th>
                  <th>Pet Category</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {displayServices.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No Services Found
                    </td>
                  </tr>
                ) : (
                  displayServices
                )}
              </tbody>
            </Table>

            {/* PAGINATION */}

            <ReactPaginate
              
              previousLabel="«"
            nextLabel="»"
              pageCount={pageCount}
              onPageChange={changePage}
              containerClassName={"pagination justify-content-center"}
              pageClassName={"page-item"}
              pageLinkClassName={"page-link"}
              previousClassName={"page-item"}
              previousLinkClassName={"page-link"}
              nextClassName={"page-item"}
              nextLinkClassName={"page-link"}
              activeClassName={"active"}
            />
          </>
        )}
      </div>
    </div>
  );
}