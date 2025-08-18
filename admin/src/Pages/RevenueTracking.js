import React from 'react';
import { Container, Row, Col, Card, Button, Table } from 'react-bootstrap';
import { MdAttachMoney, MdCalendarMonth, MdOutlineAdsClick, MdWorkspacePremium } from 'react-icons/md';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';

const revenueData = [
  { month: 'Jan', revenue: 1200 },
  { month: 'Feb', revenue: 2100 },
  { month: 'Mar', revenue: 800 },
  { month: 'Apr', revenue: 1600 },
];

const revenueBySource = [
  { name: 'Subscriptions', value: 5000 },
  { name: 'Ads', value: 3200 },
  { name: 'Pay-Per-Lead', value: 1800 },
];

const COLORS = ['#0088FE', '#FF8042', '#00C49F'];

export default function RevenueTracking() {
  return (
    <Container fluid className="p-4">
      <h3 className="mb-4">Revenue Tracking & Reports</h3>

      {/* Summary Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="shadow-sm p-3 bg-info text-white">
            <Row>
                <Col xs={4} >
                    <MdAttachMoney size={60} />
                </Col>
                <Col xs={8}>
                    <h6>Total Revenue</h6>
                    <h4>₹10,000</h4>
                </Col>
            </Row>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm text-center p-3 bg-success text-white">
            <Row>
                <Col xs={4} >
                    <MdCalendarMonth size={60} />
                </Col>
                <Col xs={8}>
                    <h6>This Month</h6>
                    <h4>₹2,800</h4>
                </Col>
            </Row>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm text-center p-3 bg-warning">
            <Row>
                <Col xs={4} >
                    <MdWorkspacePremium size={60} />
                </Col>
                <Col xs={8}>
                    <h6>Subscriptions</h6>
                    <h4>₹5,000</h4>
                </Col>
            </Row>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm text-center p-3 bg-danger text-white">
            <Row>
                <Col xs={4} >
                    <MdOutlineAdsClick size={60} />
                </Col>
                <Col xs={8}>
                    <h6>Ads</h6>
                    <h4>₹3,200</h4>
                </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row className="mb-4">
        <Col md={8}>
          <Card className="shadow-sm p-3">
            <h6>Revenue Over Time</h6>
            <LineChart width={600} height={300} data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
            </LineChart>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm p-3">
            <h6>Revenue by Source</h6>
            <PieChart width={300} height={300}>
              <Pie
                data={revenueBySource}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {revenueBySource.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </Card>
        </Col>
      </Row>

      {/* Revenue Table */}
      <Card className="shadow-sm p-3">
        <h6>Detailed Revenue Report</h6>
        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>Date</th>
              <th>Source</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2025-08-10</td>
              <td>Subscription</td>
              <td>₹999</td>
            </tr>
            <tr>
              <td>2025-08-12</td>
              <td>Ads</td>
              <td>₹1,200</td>
            </tr>
          </tbody>
        </Table>
        <div className="text-end">
          <Button variant="success" className="me-2">Download CSV</Button>
          <Button variant="primary" className="me-2">Download Excel</Button>
          <Button variant="danger">Download PDF</Button>
        </div>
      </Card>
    </Container>
  );
}
