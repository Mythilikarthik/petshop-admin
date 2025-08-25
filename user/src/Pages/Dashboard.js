
import { Row, Col, Card,  Breadcrumb } from 'react-bootstrap';
import { 
  AiFillRightCircle, 
} from 'react-icons/ai';
import { Link } from 'react-router-dom';
import {  ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import './Dashboard.css';
import { MdEventNote,  MdOutlineRemoveRedEye, MdMarkUnreadChatAlt, MdOutlineQuestionAnswer   } from 'react-icons/md';

const activityData = [
  { month: 'Jan', Enquiry: 6, Views: 6 },
  { month: 'Feb', Enquiry: 5, Views: 9 },
  { month: 'Mar', Enquiry: 6, Views: 9 },
  { month: 'Apr', Enquiry: 1, Views: 2 },
  { month: 'May', Enquiry: 3, Views: 5 },
  { month: 'June', Enquiry: 2, Views: 5 },
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
      <Row className="mb-4 align-items-center">
        <Col lg={4} md={6} sm={6}>
          {[
            { text: 'text-white', bg: 'bg-info', number: 150, label: 'Views', icon: <MdOutlineRemoveRedEye  size={80} /> },
            { text: 'text-white', bg: 'bg-success', number: 20, label: 'Enquiry', icon: <MdOutlineQuestionAnswer  size={80} /> },
            { text: '', bg: 'bg-warning', number: 50, label: 'Messages', icon: <MdMarkUnreadChatAlt  size={80} /> },
          ].map((stat, i) => (
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
                    <Card.Footer className={`bg-transparent border-top  ${stat.number}`}>
                      More Info <AiFillRightCircle size={24} />
                    </Card.Footer>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          ))}
        </Col>
        <Col lg={8} md={12} sm={12}>
          <Card className='shadow-sm p-3 '>
            <h5 className='d-flex gap-1 align-items-center mb-3 font-magenta'><MdEventNote />Summary</h5>
            <Card.Body style={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityData}>                  
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="Enquiry" barSize={30} fill="#8884d8" />
                  <Bar dataKey="Views" barSize={30} fill="#82ca9d" />
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
