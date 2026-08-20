import React, { useEffect, useState } from "react";
import { Table, Button, Form, Row, Col, Breadcrumb, Spinner, Card, Alert, InputGroup, Badge } from "react-bootstrap";
import { BiSave, BiPlus, BiTrash, BiCreditCard, BiCheckShield, BiStar, BiListCheck } from "react-icons/bi";

const API_BASE =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_URL
    : "http://localhost:5000";

const PaymentSettings = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  const [formData, setFormData] = useState({
    razorpay: {
      keyId: "",
      keySecret: "",
      webhookSecret: "",
      enabled: true,
      mode: "test"
    },
    featuredCityPlan: {
      name: "Featured City Plan",
      amount: 999,
      billingCycle: "monthly",
      features: ["Unlimited Directory Access", "Priority Support", "Advanced Platform Features"],
      enabled: true
    },
    premiumVerifiedPlan: {
      name: "Premium Verified Plan",
      amount: 2999,
      billingCycle: "yearly",
      features: ["Unlimited Directory Access", "Priority Support", "Advanced Platform Features"],
      enabled: true
    },
    purchaseSettings: {
      maxPurchaseLimit: 5,
      allowMultipleSubscriptions: false
    }
  });

  useEffect(() => {
    fetchPaymentSettings();
  }, []);

  const fetchPaymentSettings = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/payment-settings`);
      const data = await res.json();
      if (data.success && data.settings) {
        setFormData(data.settings);
      }
    } catch (err) {
      showAlert("danger", "Failed to load payment settings");
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: "", message: "" }), 4000);
  };

  const handleRazorpayChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      razorpay: { ...prev.razorpay, [field]: value }
    }));
  };

  const handlePlanChange = (planType, field, value) => {
    setFormData(prev => ({
      ...prev,
      [planType]: { ...prev[planType], [field]: value }
    }));
  };

  const handleFeatureChange = (planType, index, value) => {
    const updatedFeatures = [...formData[planType].features];
    updatedFeatures[index] = value;
    handlePlanChange(planType, "features", updatedFeatures);
  };

  const addFeature = (planType) => {
    const updatedFeatures = [...formData[planType].features, ""];
    handlePlanChange(planType, "features", updatedFeatures);
  };

  const removeFeature = (planType, index) => {
    const updatedFeatures = formData[planType].features.filter((_, i) => i !== index);
    handlePlanChange(planType, "features", updatedFeatures);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/payment-settings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        showAlert("success", "Settings saved successfully!");
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      showAlert("danger", err.message || "Failed to update settings");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2 text-muted">Fetching Settings...</p>
      </div>
    );
  }

  return (
    <div className="container mt-4 mb-5">
      <div className="pl-3 pr-3">
        <Row className="mb-4 justify-content-between align-items-center">
          <Col>
            <h2 className="main-title mb-0 fw-bold">Payment Settings</h2>
          </Col>
          <Col xs="auto">
            <Breadcrumb className="top-breadcrumb m-0">
              <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
              <Breadcrumb.Item active>Payment Settings</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>

        {alert.show && <Alert variant={alert.type}>{alert.message}</Alert>}

        <Form onSubmit={handleSubmit}>
          {/* 1. RAZORPAY CONFIG */}
          <Card className="shadow-sm border-0 mb-4 rounded-3">
            <Card.Header className="bg-white border-bottom py-3 d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-2">
                <BiCreditCard className="text-primary fs-4" />
                <h5 className="m-0 fw-bold">1. Razorpay Gateway Integration</h5>
              </div>
              <Form.Check 
                type="switch"
                id="razorpay-switch"
                label={formData.razorpay.enabled ? "Active" : "Disabled"}
                checked={formData.razorpay.enabled}
                onChange={(e) => handleRazorpayChange("enabled", e.target.checked)}
              />
            </Card.Header>
            <Card.Body>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">Razorpay Key ID</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="rzp_test_xxxxxx"
                      value={formData.razorpay.keyId}
                      onChange={(e) => handleRazorpayChange("keyId", e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">Razorpay Key Secret</Form.Label>
                    <Form.Control 
                      type="password" 
                      placeholder="Key Secret"
                      value={formData.razorpay.keySecret}
                      onChange={(e) => handleRazorpayChange("keySecret", e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">Webhook Secret</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="whsec_xxxxxx"
                      value={formData.razorpay.webhookSecret}
                      onChange={(e) => handleRazorpayChange("webhookSecret", e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">Environment Mode</Form.Label>
                    <Form.Select 
                      value={formData.razorpay.mode}
                      onChange={(e) => handleRazorpayChange("mode", e.target.value)}
                    >
                      <option value="test">Test / Sandbox</option>
                      <option value="live">Live / Production</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* 2. PLANS */}
          <h5 className="fw-bold mb-3 d-flex align-items-center gap-2 text-secondary">
            <BiStar className="text-warning fs-4" /> 2. Premium Plans
          </h5>

          <Row className="g-4 mb-4">
            {/* 2.1 FEATURED CITY PLAN */}
            <Col lg={6}>
              <Card className="shadow-sm border-0 h-100 rounded-3">
                <Card.Header className="bg-light border-bottom py-3 d-flex align-items-center justify-content-between">
                  <Badge bg="primary">2.1 Featured City Plan</Badge>
                  <Form.Check 
                    type="switch"
                    checked={formData.featuredCityPlan.enabled}
                    onChange={(e) => handlePlanChange("featuredCityPlan", "enabled", e.target.checked)}
                  />
                </Card.Header>
                <Card.Body>
                  <Row className="g-3 mb-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">Amount (INR)</Form.Label>
                        <InputGroup>
                          <InputGroup.Text>₹</InputGroup.Text>
                          <Form.Control 
                            type="number"
                            value={formData.featuredCityPlan.amount}
                            onChange={(e) => handlePlanChange("featuredCityPlan", "amount", e.target.value)}
                          />
                        </InputGroup>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">Billing Frequency</Form.Label>
                        <Form.Select 
                          value={formData.featuredCityPlan.billingCycle}
                          onChange={(e) => handlePlanChange("featuredCityPlan", "billingCycle", e.target.value)}
                        >
                          <option value="monthly">Billed Every Month</option>
                          <option value="yearly">Billed Every Year</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Label className="fw-semibold d-flex justify-content-between align-items-center mb-2">
                    <span>Plan Features</span>
                    <Button variant="outline-primary" size="sm" onClick={() => addFeature("featuredCityPlan")}><BiPlus /></Button>
                  </Form.Label>
                  {formData.featuredCityPlan.features.map((feat, idx) => (
                    <InputGroup key={idx} className="mb-2">
                      <InputGroup.Text><BiListCheck /></InputGroup.Text>
                      <Form.Control 
                        type="text" 
                        value={feat}
                        onChange={(e) => handleFeatureChange("featuredCityPlan", idx, e.target.value)}
                      />
                      <Button variant="outline-danger" onClick={() => removeFeature("featuredCityPlan", idx)}><BiTrash /></Button>
                    </InputGroup>
                  ))}
                </Card.Body>
              </Card>
            </Col>

            {/* 2.2 PREMIUM VERIFIED PLAN */}
            <Col lg={6}>
              <Card className="shadow-sm border-0 h-100 rounded-3">
                <Card.Header className="bg-light border-bottom py-3 d-flex align-items-center justify-content-between">
                  <Badge bg="success">2.2 Premium Verified Plan</Badge>
                  <Form.Check 
                    type="switch"
                    checked={formData.premiumVerifiedPlan.enabled}
                    onChange={(e) => handlePlanChange("premiumVerifiedPlan", "enabled", e.target.checked)}
                  />
                </Card.Header>
                <Card.Body>
                  <Row className="g-3 mb-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">Amount (INR)</Form.Label>
                        <InputGroup>
                          <InputGroup.Text>₹</InputGroup.Text>
                          <Form.Control 
                            type="number"
                            value={formData.premiumVerifiedPlan.amount}
                            onChange={(e) => handlePlanChange("premiumVerifiedPlan", "amount", e.target.value)}
                          />
                        </InputGroup>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">Billing Frequency</Form.Label>
                        <Form.Select 
                          value={formData.premiumVerifiedPlan.billingCycle}
                          onChange={(e) => handlePlanChange("premiumVerifiedPlan", "billingCycle", e.target.value)}
                        >
                          <option value="monthly">Billed Every Month</option>
                          <option value="yearly">Billed Every Year</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Label className="fw-semibold d-flex justify-content-between align-items-center mb-2">
                    <span>Plan Features</span>
                    <Button variant="outline-primary" size="sm" onClick={() => addFeature("premiumVerifiedPlan")}><BiPlus /></Button>
                  </Form.Label>
                  {formData.premiumVerifiedPlan.features.map((feat, idx) => (
                    <InputGroup key={idx} className="mb-2">
                      <InputGroup.Text><BiListCheck /></InputGroup.Text>
                      <Form.Control 
                        type="text" 
                        value={feat}
                        onChange={(e) => handleFeatureChange("premiumVerifiedPlan", idx, e.target.value)}
                      />
                      <Button variant="outline-danger" onClick={() => removeFeature("premiumVerifiedPlan", idx)}><BiTrash /></Button>
                    </InputGroup>
                  ))}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* 3. PURCHASE LIMIT SETTINGS */}
          <Card className="shadow-sm border-0 mb-4 rounded-3">
            <Card.Header className="bg-white border-bottom py-3">
              <div className="d-flex align-items-center gap-2">
                <BiCheckShield className="text-success fs-4" />
                <h5 className="m-0 fw-bold">3. Purchase Limits</h5>
              </div>
            </Card.Header>
            <Card.Body>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">Maximum Purchase Limit (Per User)</Form.Label>
                    <Form.Control 
                      type="number" 
                      min="1"
                      value={formData.purchaseSettings.maxPurchaseLimit}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        purchaseSettings: { ...prev.purchaseSettings, maxPurchaseLimit: e.target.value }
                      }))}
                    />
                  </Form.Group>
                </Col>
                <Col md={6} className="d-flex align-items-center">
                  <Form.Check 
                    type="checkbox"
                    id="allow-multiple"
                    label="Allow concurrent subscriptions"
                    checked={formData.purchaseSettings.allowMultipleSubscriptions}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      purchaseSettings: { ...prev.purchaseSettings, allowMultipleSubscriptions: e.target.checked }
                    }))}
                  />
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Button type="submit" variant="primary" size="lg" disabled={submitting} className="px-5">
            {submitting ? <Spinner animation="border" size="sm" /> : <><BiSave /> Save Settings</>}
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default PaymentSettings;