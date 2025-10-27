import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Form, Container, Spinner, Alert } from "react-bootstrap";
import ParaEditor from "../Layout/ParaEditor";

const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://petshop-admin.onrender.com"
    : "http://localhost:5000";

const FaqEditPage = () => {
  const { id } = useParams(); // if id === "new" -> create mode
  const navigate = useNavigate();

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [loading, setLoading] = useState(Boolean(id && id !== "new"));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id || id === "new") return;

    const fetchFaq = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/api/faq/${id}`);
        const data = await res.json();
        console.log("fetchFaq response:", data);

        // normalize FAQ object from multiple possible response shapes
        let faqObj = null;
        if (data && (data.success || data.status === "success")) {
          faqObj = data.faq || data.data || null;
        } else if (data && (data.question || data.answer || data._id)) {
          // server returned the FAQ object directly
          faqObj = data;
        } else if (Array.isArray(data) && data.length === 1) {
          // sometimes API returns array with single item
          faqObj = data[0];
        }

        if (faqObj && (faqObj.question || faqObj.answer)) {
          setQuestion(faqObj.question || "");
          setAnswer(faqObj.answer || "");
        } else {
          setError("FAQ not found.");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load FAQ.");
      } finally {
        setLoading(false);
      }
    };

    fetchFaq();
  }, [id]);

  const handleEditorChange = (content, words) => {
    setAnswer(content);
    if (typeof words === "number") setWordCount(words);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!question.trim()) {
      setError("Question is required.");
      return;
    }
    if (!answer || !answer.trim()) {
      setError("Answer is required.");
      return;
    }

    setSaving(true);
    try {
      const payload = { question: question.trim(), answer };
      const url =
        !id || id === "new" ? `${API_BASE}/api/faq` : `${API_BASE}/api/faq/${id}`;
      const method = !id || id === "new" ? "POST" : "PUT";

      console.log("Submitting FAQ", payload, url, method);
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      console.log("save response", data);

      if ((res.ok && (data.success || data.status === "success")) || res.ok) {
        // go back to listing; change to your actual listing route if different
        navigate("/faq-listing");
      } else {
        setError(data.message || "Save failed.");
      }
    } catch (err) {
      console.error(err);
      setError("Network error saving FAQ.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <Container className="mt-4">
        <Spinner animation="border" />
      </Container>
    );

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>{!id || id === "new" ? "Create FAQ" : "Edit FAQ"}</h3>
        <div>
          <Button variant="secondary" className="me-2" onClick={() => navigate(-1)}>
            Back
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={saving}>
            {saving ? (
              <>
                <Spinner as="span" animation="border" size="sm" /> Saving...
              </>
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="faqQuestion">
          <Form.Label>Question</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="faqAnswer">
          <Form.Label>Answer</Form.Label>
          <ParaEditor value={answer} onChange={handleEditorChange} />
          <div className="text-muted small mt-1">Word count: {wordCount}</div>
        </Form.Group>

        <div className="mt-3">
          <Button variant="primary" type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save FAQ"}
          </Button>{" "}
          <Button variant="outline-secondary" onClick={() => navigate("/faqs")}>
            Cancel
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default FaqEditPage;