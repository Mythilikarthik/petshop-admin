import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Breadcrumb, Form } from 'react-bootstrap';
import Select from "react-select";
import {
  
  
  AiOutlineEye,
  
  AiOutlineDollar
} from 'react-icons/ai';
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
import html2pdf from "html2pdf.js";
import * as XLSX from "xlsx";


const API_BASE =
  process.env.NODE_ENV === 'production'
    ? 'https://petshop-admin.onrender.com'
    : 'http://localhost:5000';
    


export default function RevenueTracking() {
  
const [detailedRevenue, setDetailedRevenue] = useState([]);
const [totalRevenue, setTotalRevenue] = useState(0);
const [monthlyRevenue, setMonthlyRevenue] = useState(0);
const [subscriptionCount, setSubscriptionCount] = useState(0);

const [searchTerm, setSearchTerm] = useState("");

  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
useEffect(() => {
  const fetchPayments = async () => {
    try {
      // Fetch all payments
      const res = await fetch(`${API_BASE}/api/payments/all`);
      const data = await res.json();

      if (data.success) {
        const formatted = data.payments.map((p) => ({
          date: p.createdAt.substring(0, 10),
          source: p.plan.charAt(0).toUpperCase() + p.plan.slice(1),
          amount: p.amount,
        }));

        setDetailedRevenue(formatted);
      }
    } catch (err) {
      console.error("Error fetching payments:", err);
    }
  };

  const fetchStats = async () => {
    try {
      // Total revenue
      const totalRes = await fetch(`${API_BASE}/api/payments/totalrevenue`);
      const totalData = await totalRes.json();
      if (totalData.success) setTotalRevenue(totalData.totalRevenue);

      // Subscription counts
      const countRes = await fetch(`${API_BASE}/api/payments/counts`);
      const countData = await countRes.json();
      if (countData.success) {
        setSubscriptionCount(countData.totalSuccessPayments);
      }

      // Monthly revenue (by month API)
      const month = String(selectedMonth.getMonth() + 1).padStart(2, "0");
      const year = selectedMonth.getFullYear();

      const monthlyRes = await fetch(
        `${API_BASE}/api/payments/revenue-by-month?month=${month}&year=${year}`
      );

      const monthlyData = await monthlyRes.json();

      if (monthlyData.success) {
        setMonthlyRevenue(monthlyData.total);
      } else {
        setMonthlyRevenue(0);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  fetchPayments();
  fetchStats();
}, [selectedMonth]);






  // Filter data by selected month
  const filteredData = detailedRevenue.filter((row) => {
  const rowDate = new Date(row.date); 
  const rowMonth = row.date.slice(0, 7);
  const rowMonthName = rowDate.toLocaleString("default", { month: "long" });
  const rowYear = rowDate.getFullYear().toString();

  const matchSearch =
    searchTerm === "" ||
    rowMonth.includes(searchTerm) ||
    rowMonthName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rowYear.includes(searchTerm);

  return matchSearch;
});

// ------------------ CSV DOWNLOAD ------------------
const downloadCSV = () => {
  if (!detailedRevenue.length) return alert("No data available!");

  const header = ["User", "Email", "Amount", "Plan", "Status", "Date"];
  const rows = detailedRevenue.map(p => [
    p.userId?.name || "",
    p.userId?.email || "",
    p.amount,
    p.plan,
    p.paymentStatus,
    new Date(p.createdAt).toLocaleString()
  ]);

  let csvContent =
    "data:text/csv;charset=utf-8," +
    [header, ...rows].map(e => e.join(",")).join("\n");

  const link = document.createElement("a");
  link.href = encodeURI(csvContent);
  link.download = "payments.csv";
  link.click();
};

// ------------------ EXCEL (.xlsx) DOWNLOAD ------------------


const downloadExcel = () => {
  if (!detailedRevenue.length) return alert("No data available!");

  const formatted = detailedRevenue.map(p => ({
    User: p.userId?.name || "",
    Email: p.userId?.email || "",
    Amount: p.amount,
    Plan: p.plan,
    Status: p.paymentStatus,
    Date: new Date(p.createdAt).toLocaleString()
  }));

  const worksheet = XLSX.utils.json_to_sheet(formatted);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Payments");

  XLSX.writeFile(workbook, "payments.xlsx");
};

// ------------------ PDF DOWNLOAD ------------------


const downloadPDF = () => {
  const element = document.getElementById("pdf-content");

  const options = {
    margin: 10,
    filename: "payments.pdf",
    image: { type: "jpeg", quality: 1 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };

  html2pdf().set(options).from(element).save();
};

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
                <h4>₹{totalRevenue}</h4>
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
                <h4>₹{monthlyRevenue}</h4>
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
                <h4>{subscriptionCount}</h4>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Ads */}
        {/* <Col md={3}>
          <Card className="shadow-sm text-center p-3 bg-danger text-white">
            <Row>
              <Col xs={4}><MdOutlineAdsClick size={60} /></Col>
              <Col xs={8}>
                <h6>Ads</h6>
                <h4>₹{(adTotals.earnings || 0).toFixed(2)}</h4>
              </Col>
            </Row>
          </Card>
        </Col> */}
      </Row>
      {/* <h5 class="d-flex gap-1 align-items-center mb-3 font-magenta"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="m3.5 18.49 6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z"></path></svg> Ad Overview</h5> */}
      

      

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
                placeholder="Search by Month or Year"
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
        <div className="table-responsive" id="pdf-content">
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
          <Button variant="success" className="me-2" onClick={downloadCSV}>
            Download CSV
          </Button>

          <Button variant="primary" className="me-2" onClick={downloadExcel}>
            Download Excel
          </Button>

          <Button variant="danger" onClick={downloadPDF}>
            Download PDF
          </Button>
        </div>
      </Card>


    </Container>
  );
}
