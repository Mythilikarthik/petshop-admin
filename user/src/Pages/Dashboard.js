import { Row, Col, Card, Breadcrumb } from 'react-bootstrap';
import { AiFillRightCircle } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import './Dashboard.css';
import { MdEventNote, MdOutlineRemoveRedEye, MdMarkUnreadChatAlt, MdOutlineQuestionAnswer } from 'react-icons/md';
import { useEffect, useState } from 'react';

const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://petshop-admin.onrender.com"
    : "http://localhost:5000";

const Dashboard = () => {
  const [views, setViews] = useState(0);
  const [reviews, setReviews] = useState(0);
  const [messages, setMessages] = useState(0);

  // Dynamic chart data — updates when values change
  const activityData = [
    { name: 'Views', value: views },
    { name: 'Reviews', value: reviews },
    { name: 'Messages', value: messages },
  ];

  const details = [
    { text: 'text-white', bg: 'bg-info', number: views, label: 'Views', icon: <MdOutlineRemoveRedEye size={80} /> },
    { text: 'text-white', bg: 'bg-success', number: reviews, label: 'Reviews', icon: <MdOutlineQuestionAnswer size={80} /> },
    { text: '', bg: 'bg-warning', number: messages, label: 'Messages', icon: <MdMarkUnreadChatAlt size={80} /> },
  ];

  useEffect(() => {
    const fetchCounts = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${API_BASE}/api/listing/counts`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok && data.success) {
          setViews(data.counts.views || 0);
          setReviews(data.counts.reviews || 0);
          setMessages(data.counts.messages || 0);
        } else {
          console.error("Error fetching counts:", data.message);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchCounts();
  }, []);

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
      <Row className="mb-4 align-items-center">
        <Col lg={4} md={6} sm={6}>
          {details.map((stat, i) => (
            <Col className='mb-3' lg={12} md={12} sm={12} key={i}>
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
                    <Card.Footer className='bg-transparent border-top'>
                      More Info <AiFillRightCircle size={24} />
                    </Card.Footer>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          ))}
        </Col>

        {/* === Chart === */}
        <Col lg={8} md={12} sm={12}>
          <Card className='shadow-sm p-3 '>
            <h5 className='d-flex gap-1 align-items-center mb-3 font-magenta'><MdEventNote />Summary</h5>
            <Card.Body style={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" barSize={40} fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
