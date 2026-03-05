// src/Pages/Dashboard.js
import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Table, Breadcrumb, Form } from 'react-bootstrap';
import { 
  AiFillRightCircle, AiOutlineShopping, AiFillSignal, AiOutlineUserAdd, AiOutlinePieChart , AiOutlineShop, AiOutlineMessage
} from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis,  Legend } from 'recharts';
import './Dashboard.css';
import { MdEventNote, MdSecurity, MdShowChart } from 'react-icons/md';


const API_BASE = process.env.NODE_ENV === "production"
  ? "https://petshop-admin.onrender.com"
  : "http://localhost:5000";

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
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
const [claimedPendingCount, setClaimedPendingCount] = useState(0);
const [signupCount, setSignupCount] = useState(0);

  const [businessListing, setBusinessListing] = useState();
  const [pendingListing, setPendingListing] = useState();
  const [ userList,setUserList] = useState();
  const [categoryData, setCategoryData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [cityList, setCityList] = useState([]);
  const [newShopOwners, setNewShopOwners] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [quickFilter, setQuickFilter] = useState("");
  
  useEffect(() => {
    const fetchReviewCount = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/reviews/count/all`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        if (data.success) {
          setReviewCount(data.count);
        }
      } catch (err) {
        console.error("Error fetching review count:", err.message);
      }
    };
    const fetchNewShopOwners = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/listing/new/shop-owners`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    if (data.success) {
      setNewShopOwners(data.count);
    }
  } catch (err) {
    console.error("Error fetching new shop owners:", err.message);
  }
};
const fetchClaimedPendingCount = async () => {
  try {
    const res = await fetch(
      `${API_BASE}/api/listing/claimed/pending-count`
    );
    const data = await res.json();

    if (data.success) {
      setClaimedPendingCount(data.count);
    }
  } catch (err) {
    console.error("Error fetching claimed pending count:", err);
  }
};

const fetchSignupCount = async () => {
  try {
    const res = await fetch(
      `${API_BASE}/api/listing/signup/pending-count`
    );
    const data = await res.json();

    if (data.success) {
      setSignupCount(data.count);
    }
  } catch (err) {
    console.error("Error fetching claimed pending count:", err);
  }
};

  const fetchListings = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/listing`);
      const data = await res.json();

      if (data.success && data.listings) {
        setBusinessListing(data.listings.length);
       // alert(count);
      }
    } catch (err) {
      console.error("Failed to fetch listings:", err);
    }
  };
  const fetchPending = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/listing/pending`);
      const data = await res.json();
      if(data.success && data.listings) {
        //console.log(data);
        setPendingListing(data.listings.length);
      }
    } catch(err) {
      console.error("Error : ", err);
    }
  }
  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/user`);
      const data = await res.json();
      if(data.success && data.users) {
        //console.log(data);
        setUserList(data.users);
      }
    } catch (err) {
      console.error("Error: " , err);
    }
  }
  // const fetchCategoryStats = async () => {
  //     try {
  //       const res = await fetch(`${API_BASE}/api/stats/categories`);
  //       const data = await res.json();
  //       if (data.success) {
  //         //console.log (data.chartData)
  //         setCategoryData(data.chartData);
  //       }
  //     } catch (err) {
  //       console.error("Error fetching category stats:", err);
  //     }
  //   };
  

    const fetchUserStats = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/stats/user-activity`);
        const data = await res.json();
        if (data.success) {
          console.log ("activity", data.activity)
          setUserData(data.activity);
        }
      } catch (err) {
        console.error("Error fetching category stats:", err);
      }
    };
const getCities = async () => {
  try {
    const response = await fetch(`${API_BASE}/api/city/show`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    return data.cities || []; // [{_id, city, show}]
  } catch (error) {
    console.error("Error fetching cities:", error);
    return [];
  }
};
fetchUserStats();
    // fetchCategoryStats();
    fetchSignupCount();
    fetchClaimedPendingCount();
  fetchUsers();
  fetchListings();
  fetchPending();
  fetchNewShopOwners();
  fetchReviewCount();
  const fetchCities = async () => {
    const cities = await getCities();
    setCityList(cities);
  };
  fetchCities();
  
}, []);
useEffect(() => {
  const fetchCategoryStats = async () => {
    try {
      const url = selectedCity
        ? `${API_BASE}/api/stats/categories?city=${selectedCity}`
        : `${API_BASE}/api/stats/categories`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.success) {
        setCategoryData(data.chartData);
      }
    } catch (err) {
      console.error("Error fetching category stats:", err);
    }
  };
  fetchCategoryStats();
}, [selectedCity]);
useEffect(() => {
  const fetchStats = async () => {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    const query = params.toString() ? `?${params}` : "";

    try {
      const [
        listingsRes,
        pendingRes,
        usersRes,
        reviewsRes,
        newOwnersRes
      ] = await Promise.all([
        fetch(`${API_BASE}/api/stats/listings${query}`),
        fetch(`${API_BASE}/api/stats/pending-listings${query}`),
        fetch(`${API_BASE}/api/stats/users${query}`),
        fetch(`${API_BASE}/api/stats/reviews${query}`),
        fetch(`${API_BASE}/api/stats/new-shop-owners${query}`)
      ]);

      setBusinessListing((await listingsRes.json()).count);
      setPendingListing((await pendingRes.json()).count);
      setUserList((await usersRes.json()).count);
      setReviewCount((await reviewsRes.json()).count);
      setNewShopOwners((await newOwnersRes.json()).count);

    } catch (err) {
      console.error("Stats error:", err);
    }
  };

  fetchStats();
}, [startDate, endDate]);



  return (
    <div className='dashboard pl-3 pr-3'>
      {/* === Header === */}
      <Row className='mb-3 justify-content-end align-items-center'>
        <Col>
          <h2 className='main-title mb-0'>Dashboard</h2>
        </Col>
        <Col xs={'auto'}>
          <Breadcrumb className='top-breadcrumb'>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item active>Dashboard</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={4}>
          <Form.Label>Start Date</Form.Label>
          <div style={{"position" : "relative"}} >
            <Form.Control
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
            {startDate && (
              <span
                onClick={() => {
                  setStartDate("");
                }}
                style={{
                  position: "absolute",
                  right: "45px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  fontSize: "18px",
                  color: "#888"
                }}
              >
                ✕
              </span>
            )}
          </div>
          
        </Col>

        <Col md={4}>
        <Form.Label>End Date</Form.Label>
        <div style={{"position":"relative"}}>
            <Form.Control
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          {endDate && (
              <span
                onClick={() => {
                  setEndDate("");
                }}
                style={{
                  position: "absolute",
                  right: "45px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  fontSize: "18px",
                  color: "#888"
                }}
              >
                ✕
              </span>
            )}
        </div>
          
        </Col>

        <Col md={4}>
          <Form.Label>Quick Filter</Form.Label>
          <div style={{"position" : "relative"}}>
            <Form.Select
                value={quickFilter}
                onChange={(e) => {
                  const value = e.target.value;
                  setQuickFilter(value);

                  if (!value) {
                    setStartDate("");
                    setEndDate("");
                    return;
                  }
                  const today = new Date();
                  const past = new Date();
                  past.setDate(today.getDate() - e.target.value);

                  setStartDate(past.toISOString().split("T")[0]);
                  setEndDate(today.toISOString().split("T")[0]);
                }}
              >
                <option value="">Quick Filter</option>
                <option value="0">Today</option>
                <option value="7">Last 7 Days</option>
                <option value="30">Last 30 Days</option>
              </Form.Select>
            {quickFilter  && (
              <span
                onClick={() => {
                  setQuickFilter("");   // ⭐ reset select
                  setStartDate("");
                  setEndDate("");
                }}
                style={{
                  position: "absolute",
                  right: "45px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  fontSize: "18px",
                  color: "#888"
                }}
              >
                ✕
              </span>
            )}
          </div>
          
        </Col>
      </Row>

      {/* === Stats Cards === */}
      <Row className="mb-4 align-items-stretch">
        {[
          { text: 'text-white', bg: 'bg-info', number: `${businessListing}`, linkto : '/business-listing', label: 'Business Listings', icon: <AiOutlineShopping size={80} /> },
          { text: 'text-white', bg: 'bg-success', number: `${pendingListing}`, signupCount: signupCount, claimedPendingCount: claimedPendingCount, linkto : '/business-listing', label: 'Pending Listings', icon: <AiFillSignal size={80} /> },
          { text: '', bg: 'bg-warning', number: `${userList}`, label: 'Users', linkto : '/user-management', icon: <AiOutlineUserAdd size={80} /> },
          {
  text: 'text-white',
  bg: 'bg-primary',
  number: newShopOwners,
  linkto: '/business-listing',
  label: 'Service Providers',
  icon: <AiOutlineShop size={80} />
},         { text: 'text-white', bg: 'bg-danger', number: `${reviewCount}`, linkto : '/review-management', label: 'Total Reviews', icon: <AiOutlineMessage size={80} /> },
// {
//   text: "text-white",
//   bg: "bg-secondary",
//   number: claimedPendingCount,
//   linkto: "/business-listing",
//   label: "Claimed (Waiting Approval)",
//   icon: <AiOutlinePieChart size={80} />,
// },

        ].map((stat, i) => (
          <Col className='mb-3' lg={4} md={6} sm={6} key={i}>
            <Link to={`${stat.linkto}`}>
              <Card className={`${stat.text} ${stat.bg}  h-100`}>
                <Card.Body className='pl-0 pr-0 pb-0'>
                  <div className='pos-rel d-flex justify-content-between align-items-center'>
                    <div className='pl-3'>
                      <h2><b>{stat.number}</b></h2>
                      <p>{stat.label}
                        {stat.signupCount != null && stat.claimedPendingCount != null && (
                          <span className="d-block small mt-1">
                            [ Signup: {stat.signupCount}, Claimed: {stat.claimedPendingCount} ]
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="icon">{stat.icon}</div>
                  </div>
                </Card.Body>
                <Card.Footer className={`bg-transparent border-top  ${stat.number}`}>
                    More Info <AiFillRightCircle size={24} />
                  </Card.Footer>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>

      {/* === Top Categories (Pie Chart) === */}
      <Row className="mb-4">
        <Col lg={6} sm={12} className='mb-3'>
          
          <Card className='shadow-sm p-3 '>
            <h5 className='d-flex gap-1 align-items-center mb-3 font-magenta'> <MdShowChart /> Top-Performing Categories</h5>
            <Card.Body style={{ height: 400 }}>
             
  
  <Form.Group className="mb-3">
    <div style={{"position" : "relative"}}>
<Form.Select
    name="city"
    value={selectedCity}
    onChange={(e) => setSelectedCity(e.target.value)}
    required
  >
    <option value="">--Select City--</option>
    {cityList.map((c) => (
      <option key={c._id} value={c._id}>
        {c.city}
      </option>
    ))}
  </Form.Select>
      {selectedCity && (
              <span
                onClick={() => {
                  setSelectedCity("");
                }}
                style={{
                  position: "absolute",
                  right: "45px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  fontSize: "18px",
                  color: "#888"
                }}
              >
                ✕
              </span>
            )}
    </div>
                
                
  
              </Form.Group>

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
        <Col lg={6} sm={12} className='mb-3'>
          
          <Card className='shadow-sm p-3 '>
            <h5 className='d-flex gap-1 align-items-center mb-3 font-magenta'><MdEventNote /> Recent User ACtivity</h5>
            <Card.Body style={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={userData}>                  
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
      {/* <Card className="shadow-sm p-3">
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
      </Card> */}
    </div>
  );
};

export default Dashboard;
