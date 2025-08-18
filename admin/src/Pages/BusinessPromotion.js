import React from "react";
import { Card, Button, Row, Col, Badge } from "react-bootstrap";
import { FaStar, FaSearch, FaGoogle, FaClock } from "react-icons/fa";

const BusinessPromotion = () => {
  const features = [
    {
      title: "Homepage Featured Listing",
      description: "Boost visibility by placing your business on the homepage for maximum exposure.",
      icon: <FaStar size={30} className="text-warning" />,
      action: "Manage Featured Listings"
    },
    {
      title: "Priority Placement in Search",
      description: "Get your business listed at the top of search results ahead of competitors.",
      icon: <FaSearch size={30} className="text-primary" />,
      action: "Set Priority Placement"
    },
    {
      title: "Manage Google Ads & Sponsored Listings",
      description: "Run paid campaigns directly from your dashboard to target specific audiences.",
      icon: <FaGoogle size={30} className="text-danger" />,
      action: "Manage Ads"
    },
    {
      title: "Run Limited-Time Promotions",
      description: "Highlight special offers like 'Top Vets in Mumbai' for a limited period.",
      icon: <FaClock size={30} className="text-info" />,
      action: "Create Promotion"
    }
  ];

  return (
    <div className="p-4">
      <h3 className="mb-4 fw-bold">
        Business Promotion
        <Badge bg="success" className="ms-2">Premium</Badge>
      </h3>

      <Row>
        {features.map((item, idx) => (
          <Col key={idx} md={6} lg={3} className="mb-4">
            <Card className="shadow-sm border-0 rounded-3 h-100">
              <Card.Body>
                <div className="mb-3">{item.icon}</div>
                <Card.Title className="fw-semibold">{item.title}</Card.Title>
                <Card.Text className="text-muted">{item.description}</Card.Text>
                <Button variant="primary" className="mt-2">{item.action}</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default BusinessPromotion;
