import React, { useState } from "react";
import { Table, Card, Button, Form, Row, Col } from "react-bootstrap";

const PaymentPage = () => {
  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    status: "",
    method: ""
  });

  const transactions = [
    {
      id: "TXN12345",
      business: "Pet Groomers Inc",
      listing: "Deluxe Grooming",
      amount: 120,
      currency: "USD",
      method: "PayPal",
      status: "Paid",
      date: "2025-08-13"
    }
  ];

  return (
    <div className="container mt-4">
      <h4>💳 Payments & Transactions</h4>

      {/* Summary Cards */}
      <Row className="mb-4">
        <Col><Card className="p-3">Total Revenue: $5,200</Card></Col>
        <Col><Card className="p-3">Paid: 48</Card></Col>
        <Col><Card className="p-3">Pending: 5</Card></Col>
        <Col><Card className="p-3">Failed: 2</Card></Col>
      </Row>

      {/* Filters */}
      <Card className="p-3 mb-4">
        <Row>
          <Col><Form.Control type="date" value={filters.dateFrom} onChange={(e) => setFilters({...filters, dateFrom: e.target.value})} /></Col>
          <Col><Form.Control type="date" value={filters.dateTo} onChange={(e) => setFilters({...filters, dateTo: e.target.value})} /></Col>
          <Col>
            <Form.Select value={filters.status} onChange={(e) => setFilters({...filters, status: e.target.value})}>
              <option value="">Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </Form.Select>
          </Col>
          <Col>
            <Form.Select value={filters.method} onChange={(e) => setFilters({...filters, method: e.target.value})}>
              <option value="">Payment Method</option>
              <option>PayPal</option>
              <option>Stripe</option>
              <option>Razorpay</option>
              <option>Bank Transfer</option>
            </Form.Select>
          </Col>
          <Col><Button variant="primary">Filter</Button></Col>
        </Row>
      </Card>

      {/* Transactions Table */}
      <Card className="p-3">
        <Table bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Business</th>
              <th>Listing</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Status</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn) => (
              <tr key={txn.id}>
                <td>{txn.id}</td>
                <td>{txn.business}</td>
                <td>{txn.listing}</td>
                <td>{txn.amount} {txn.currency}</td>
                <td>{txn.method}</td>
                <td>{txn.status}</td>
                <td>{txn.date}</td>
                <td>
                  <Button size="sm" variant="info">Invoice</Button>{" "}
                  {txn.status === "Paid" && <Button size="sm" variant="danger">Refund</Button>}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
};

export default PaymentPage;
