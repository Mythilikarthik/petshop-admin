// src/Pages/Dashboard.js
import React from 'react';
import { Row, Col, Card, Table, Breadcrumb } from 'react-bootstrap';
import { 
  AiFillRightCircle, AiOutlineShopping, AiFillSignal, AiOutlineUserAdd, AiOutlinePieChart 
} from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis,  Legend } from 'recharts';
import './Dashboard.css';
import { MdEventNote, MdSecurity, MdShowChart } from 'react-icons/md';

// Chart Data
const categoryData = [
  { name: 'Pet Shop', value: 45 },
  { name: 'Services', value: 30 },
  { name: 'Pet Foods', value: 22 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const activityData = [
  { name: 'John', listings: 1, reviews: 5 },
  { name: 'Alice', listings: 5, reviews: 1 },
  { name: 'Mark', listings: 4, reviews: 5 },
  { name: 'John', listings: 8, reviews: 5 },
  { name: 'Alice', listings: 10, reviews: 5 },
  { name: 'Mark', listings: 5, reviews: 5 },
];

const fraudData = [
  { id: 1, alert: 'Duplicate listing by user123', severity: 'High' },
  { id: 2, alert: 'Suspicious review from guest456', severity: 'High' },
  { id: 3, alert: 'Multiple accounts with same IP', severity: 'Medium' },
];

const Dashboard = () => {
  return (
    <div className='dashboard pl-3 pr-3'>
      {/* === Header === */}
      <Row className='mb-3 justify-content-end align-items-center'>
        <Col>
          <h2 className='main-title mb-0'>Dashboard</h2>
        </Col>
        <Col xs={'auto'}>
          <Breadcrumb className='top-breadcrumb'>
            <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
            <Breadcrumb.Item active>Dashboard</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
      </Row>

      {/* === Stats Cards === */}
      <Row className="mb-4">
        {[
          { text: 'text-white', bg: 'bg-info', number: 150, label: 'Business Listings', icon: <AiOutlineShopping size={80} /> },
          { text: 'text-white', bg: 'bg-success', number: 20, label: 'Waiting Listings', icon: <AiFillSignal size={80} /> },
          { text: '', bg: 'bg-warning', number: 50, label: 'New Users', icon: <AiOutlineUserAdd size={80} /> },
          { text: 'text-white', bg: 'bg-danger', number: 5, label: 'Fraud Cases', icon: <AiOutlinePieChart size={80} /> },
        ].map((stat, i) => (
          <Col md={3} key={i}>
            <Link to="/">
              <Card className={`${stat.text} ${stat.bg}`}>
                <Card.Body className='pl-0 pr-0 pb-0'>
                  <div className='pos-rel d-flex justify-content-between align-items-center'>
                    <div className='pl-3'>
                      <h2><b>{stat.number}</b></h2>
                      <p>{stat.label}</p>
                    </div>
                    <div className="icon">{stat.icon}</div>
                  </div>
                  <Card.Footer className={`bg-transparent border-top  ${stat.number}`}>
                    More Info <AiFillRightCircle size={24} />
                  </Card.Footer>
                </Card.Body>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>

      {/* === Top Categories (Pie Chart) === */}
      <Row className="mb-4">
        <Col xs={6}>
          
          <Card className='shadow-sm p-3 '>
            <h5 className='d-flex gap-1 align-items-center mb-3 font-magenta'> <MdShowChart /> Top-Performing Categories</h5>
            <Card.Body style={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6}>
          
          <Card className='shadow-sm p-3 '>
            <h5 className='d-flex gap-1 align-items-center mb-3 font-magenta'><MdEventNote /> Recent User ACtivity</h5>
            <Card.Body style={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityData}>                  
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="listings" barSize={30} fill="#8884d8" />
                  <Bar dataKey="reviews" barSize={30} fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* === Fraud Alerts (Stylish Table) === */}
      {/* <Row>
        <Col>
        <h5 className='d-flex gap-1 align-items-center mb-3'><MdSecurity/> Fraud Alerts</h5>
          <Card>
            
            <Card.Body>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Alert</th>
                  </tr>
                </thead>
                <tbody>
                  {fraudData.map((fraud) => (
                    <tr key={fraud.id}>
                      <td>{fraud.id}</td>
                      <td>{fraud.alert}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row> */}
      <Card className="shadow-sm p-3">
        <h5 className='d-flex gap-1 align-items-center mb-3 font-magenta'>
          <MdSecurity/> Fraud Alerts
        </h5>
        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Alert</th>
            </tr>
          </thead>
          <tbody>
            {fraudData.map((fraud) => (
              <tr key={fraud.id}>
                <td>{fraud.id}</td>
                <td>{fraud.alert}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
};

export default Dashboard;
