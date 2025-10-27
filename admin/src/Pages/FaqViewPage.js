// ...existing code...
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Button, Spinner, Alert } from "react-bootstrap";
import DOMPurify from "dompurify";

const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://petshop-admin.onrender.com"
    : "http://localhost:5000";

const FaqViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [faq, setFaq] = useState(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    const fetchFaq = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/api/faq/${id}`);
        const data = await res.json();
        // support different response shapes
        if (data && (data.success || data.status === "success")) {
          setFaq(data.faq || data.data || null);
        } else if (data && (data.faq || data.answer || data.question)) {
          // server might return the object directly
          setFaq(data);
        } else {
          setFaq(null);
          setError("FAQ not found.");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load FAQ.");
        setFaq(null);
      } finally {
        setLoading(false);
      }
    };
    fetchFaq();
  }, [id]);

  if (loading)
    return (
      <Container className="mt-4">
        <Spinner animation="border" />
      </Container>
    );

  if (error)
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Back
        </Button>
      </Container>
    );

  if (!faq)
    return (
      <Container className="mt-4">
        <h4>FAQ not found.</h4>
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Back
        </Button>
      </Container>
    );

  return (
    <Container className="mt-4">
      <div className="mb-3">
        <Button variant="secondary" onClick={() => navigate(-1)} className="me-2">
          Back
        </Button>
        <Button variant="warning" onClick={() => navigate(`/faq/${id}/edit`)}>
          Edit
        </Button>
      </div>

      <h3>{faq.question}</h3>

      <div className="text-muted mb-3">
        {/* optional meta fields if present */}
        {faq.category && <span>Category: {faq.category} &nbsp;|&nbsp; </span>}
        {faq.date && <span>Date: {faq.date}</span>}
      </div>

      <div
        // sanitize HTML answer before injecting
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(faq.answer || "", {
            ADD_ATTR: ["target", "rel"],
          }),
        }}
      />
    </Container>
  );
};

export default FaqViewPage;
// ...existing code...