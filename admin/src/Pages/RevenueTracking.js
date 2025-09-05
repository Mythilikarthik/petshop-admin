import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Table, Breadcrumb, Form } from 'react-bootstrap';
import Select from "react-select";
import {
  MdAttachMoney,
  MdCalendarMonth,
  MdOutlineAdsClick,
  MdWorkspacePremium,
  MdEventNote,
  MdShowChart,
  MdOutlineSource,
} from 'react-icons/md';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./RevenueTracking.css";



export default function RevenueTracking() {
  // Sample revenue chart data
const revenueData = [
  { month: 'Jan', revenue: 1200 },
  { month: 'Feb', revenue: 2100 },
  { month: 'Mar', revenue: 800 },
  { month: 'Apr', revenue: 1600 },
  { month: 'May', revenue: 1900 },
  { month: 'Jun', revenue: 2200 },
];

// Pie chart (by source)
const revenueBySource = [
  { name: 'Subscriptions', value: 5000 },
  { name: 'Ads', value: 3200 },
  { name: 'Pay-Per-Lead', value: 1800 },
];

// Detailed revenue report
const detailedRevenue = [
  { date: "2025-08-10", source: "Subscription", amount: 999 },
  { date: "2025-08-12", source: "Ads", amount: 1200 },
  { date: "2025-09-02", source: "Subscription", amount: 1500 },
  { date: "2025-09-03", source: "Ads", amount: 700 },
  { date: "2025-09-05", source: "Pay-Per-Lead", amount: 500 },
];

const sources = ["Subscription", "Ads", "Pay-Per-Lead"];
const [searchTerm, setSearchTerm] = useState("");
const [selectedSources, setSelectedSources] = useState([]);

// Filter data


const COLORS = ['#0088FE', '#FF8042', '#00C49F'];
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  // Filter data by selected month
  const filteredData = detailedRevenue.filter((row) => {
    const rowDate = new Date(row.date); 
    const rowMonth = row.date.slice(0, 7); // e.g. "2025-09"
    const rowMonthName = rowDate.toLocaleString("default", { month: "long" }); // e.g. "September"
    const rowYear = rowDate.getFullYear().toString(); // "2025"

    const matchSearch =
      searchTerm === "" ||
      rowMonth.includes(searchTerm) ||                 // 2025-09
      rowMonthName.toLowerCase().includes(searchTerm.toLowerCase()) || // September
      rowYear.includes(searchTerm);                   // 2025

    const matchSource =
      selectedSources.length === 0 ||
      selectedSources.includes(row.source);

    return matchSearch && matchSource;
  });


  return (
    <Container fluid className="">
      {/* Page Title */}
      <Row className='mb-3 justify-content-end align-items-center'>
        <Col>
          <h2 className='main-title mb-0'>Revenue Tracking & Reports</h2>
        </Col>
        <Col xs={'auto'}>
          <Breadcrumb className='top-breadcrumb'>
            <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
            <Breadcrumb.Item active>Revenue Tracking & Reports</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
      </Row>

      {/* Summary Cards */}
      <Row className="mb-4">
        {/* Total Revenue */}
        <Col md={3}>
          <Card className="shadow-sm p-3 bg-info text-white">
            <Row>
              <Col xs={4}><MdAttachMoney size={60} /></Col>
              <Col xs={8}>
                <h6>Total Revenue</h6>
                <h4>₹10,000</h4>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* This Month - with calendar */}
        <Col md={3}>
          <Card
            className="shadow-sm text-center p-3 bg-success text-white"
            onClick={() => setShowCalendar(!showCalendar)}
            style={{ cursor: "pointer" }}
          >
            <Row>
              <Col xs={4}><MdCalendarMonth size={60} /></Col>
              <Col xs={8}>
                <h6>{selectedMonth.toLocaleString("default", { month: "long", year: "numeric" })}</h6>
                <h4>₹2,800</h4>
              </Col>
            </Row>
          </Card>
          {showCalendar && (
            <div className="mt-2">
              <DatePicker
                selected={selectedMonth}
                onChange={(date) => {
                  setSelectedMonth(date);
                  setShowCalendar(false);
                }}
                dateFormat="MMMM yyyy"
                showMonthYearPicker
                inline
              />
            </div>
          )}
        </Col>

        {/* Subscriptions */}
        <Col md={3}>
          <Card className="shadow-sm text-center p-3 bg-warning">
            <Row>
              <Col xs={4}><MdWorkspacePremium size={60} /></Col>
              <Col xs={8}>
                <h6>Subscriptions</h6>
                <h4>₹5,000</h4>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Ads */}
        <Col md={3}>
          <Card className="shadow-sm text-center p-3 bg-danger text-white">
            <Row>
              <Col xs={4}><MdOutlineAdsClick size={60} /></Col>
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
        {/* Revenue Over Time */}
        <Col md={8}>
          <Card className="shadow-sm p-3">
            <h5 className='d-flex gap-1 align-items-center mb-3 font-magenta'>
              <MdShowChart /> Revenue Over Time
            </h5>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Revenue by Source */}
        <Col md={4}>
          <Card className="shadow-sm p-3">
            <h5 className='d-flex gap-1 align-items-center mb-3 font-magenta'>
              <MdOutlineSource /> Revenue by Source
            </h5>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={revenueBySource}
                  cx="50%"
                  cy="50%"
                  outerRadius="80%"
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
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Revenue Table */}
      <Card className="shadow-sm p-3">
        <h5 className="d-flex gap-1 align-items-center mb-3 font-magenta">
          <MdEventNote /> Detailed Revenue Report
        </h5>

        {/* Filters */}
        <Row className="mb-3">
          <Col>
            <Form.Group>
              <Form.Control
                type="month"
                placeholder="Search by Month"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Form.Group>
          </Col>
          {/* <Col>
            <Form.Group>
              <Select
                isMulti
                options={sources.map((s) => ({ value: s, label: s }))}
                value={selectedSources.map((s) => ({ value: s, label: s }))}
                onChange={(selected) =>
                  setSelectedSources(selected ? selected.map((s) => s.value) : [])
                }
                placeholder="Filter by Source"
              />
            </Form.Group>
          </Col> */}
        </Row>

        {/* Table */}
        <div className="table-responsive">
          <Table bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Source</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((row, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>{row.date}</td>
                    <td>{row.source}</td>
                    <td>₹{row.amount}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center text-muted">
                    No matching records
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        {/* Export Buttons */}
        <div className="text-end">
          <Button variant="success" className="me-2">Download CSV</Button>
          <Button variant="primary" className="me-2">Download Excel</Button>
          <Button variant="danger">Download PDF</Button>
        </div>
      </Card>


    </Container>
  );
}
