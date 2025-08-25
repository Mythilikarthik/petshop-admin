import React from 'react';
import { Container, Row, Col, Card, ListGroup, Badge } from 'react-bootstrap';
import Sidebar from '../Layout/Sidebar';
import DropdownHeader from '../Layout/DropdownHeader';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <Container fluid className="p-0">
      <Row>
        <Col md={2} className='p-0'>
          <Sidebar />
        </Col>
        <Col md={10} className="p-4">
          <DropdownHeader />

          {/* === Stats === */}
          <Row className="mb-4">
            <Col md={4}>
              <Card className="text-white bg-primary">
                <Card.Body>
                  <Card.Title>Total Active Listings</Card.Title>
                  <Card.Text>Free: 120 | Paid: 80</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="text-white bg-warning">
                <Card.Body>
                  <Card.Title>Pending Listings for Approval</Card.Title>
                  <Card.Text>23 New Listings</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="text-white bg-success">
                <Card.Body>
                  <Card.Title>Revenue</Card.Title>
                  <Card.Text>Subscriptions: ₹12,000 | Ads: ₹4,500</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* === Top Categories === */}
          <Row className="mb-4">
            <Col>
              <Card>
                <Card.Header>Top-Performing Categories</Card.Header>
                <ListGroup variant="flush">
                  <ListGroup.Item>Real Estate (45 Listings)</ListGroup.Item>
                  <ListGroup.Item>Services (30 Listings)</ListGroup.Item>
                  <ListGroup.Item>Vehicles (22 Listings)</ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>

          {/* === Recent User Activity & Reviews === */}
          <Row className="mb-4">
            <Col>
              <Card>
                <Card.Header>Recent User Activity & Reviews</Card.Header>
                <ListGroup variant="flush">
                  <ListGroup.Item>User John posted a new ad in Real Estate</ListGroup.Item>
                  <ListGroup.Item>User Alice left a review: ★★★★☆</ListGroup.Item>
                  <ListGroup.Item>User Mark updated his profile</ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>

          {/* === Fraud Alerts === */}
          <Row>
            <Col>
              <Card className="border-danger">
                <Card.Header className="text-danger">Fraud Alerts</Card.Header>
                <ListGroup variant="flush">
                  <ListGroup.Item><Badge bg="danger">Alert</Badge> Duplicate listing by user123</ListGroup.Item>
                  <ListGroup.Item><Badge bg="danger">Alert</Badge> Suspicious review from guest456</ListGroup.Item>
                  <ListGroup.Item><Badge bg="danger">Alert</Badge> Multiple accounts with same IP</ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
