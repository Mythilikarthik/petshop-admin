import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Row, Col, Breadcrumb } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import { useNavigate } from 'react-router-dom';

const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://petshop-admin.onrender.com"
    : "http://localhost:5000";

const ViewMessage = () => {
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  // ✅ Fetch messages from backend
  useEffect(() => {
    const fetchMessages = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in");
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/api/messages/all`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (data.success) {
          setMessages(data.messages);
        } else {
          console.error("Failed to fetch messages:", data.message);
        }
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchMessages();
  }, []);

  // ✅ Filter messages by sender/receiver name or text
  const filteredMessages = messages.filter((msg) => {
    const search = searchTerm.toLowerCase();
    const sender = msg.senderId?.name?.toLowerCase() || "";
    const receiver = msg.receiverId?.name?.toLowerCase() || "";
    const content = msg.message?.toLowerCase() || "";
    return sender.includes(search) || receiver.includes(search) || content.includes(search);
  });

  const pageCount = Math.ceil(filteredMessages.length / itemsPerPage);
  const displayedMessages = filteredMessages.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageClick = ({ selected }) => setCurrentPage(selected);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE}/api/messages/${id}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (data.success) {
          setMessages((prev) => prev.filter((m) => m._id !== id));
          alert("Message deleted successfully");
        } else {
          alert(data.message);
        }
      } catch (err) {
        console.error("Error deleting message:", err);
      }
    }
  };

  return (
    <div className="container mt-4">
      <div className='pl-3 pr-3'>
        <Row className='mb-3 justify-content-between align-items-center'>
          <Col><h2 className='main-title mb-0'>View Messages</h2></Col>
          <Col xs="auto">
            <Breadcrumb className='top-breadcrumb'>
              <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
              <Breadcrumb.Item active>View Message</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>

        <Form.Control
          type="text"
          placeholder="Search by user or message"
          className="mb-3"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(0);
          }}
        />

        <Table bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Sender</th>
              <th>Receiver</th>
              <th>Message</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {displayedMessages.map((msg, index) => (
              <tr key={msg._id}>
                <td>{currentPage * itemsPerPage + index + 1}</td>
                <td>{msg.senderId?.name || "N/A"}</td>
                <td>{msg.receiverId?.name || "N/A"}</td>
                <td>{msg.message}</td>
                <td>{new Date(msg.createdAt).toLocaleString()}</td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(msg._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {pageCount > 1 && (
          <ReactPaginate
            pageCount={pageCount}
            pageRangeDisplayed={2}
            marginPagesDisplayed={1}
            onPageChange={handlePageClick}
            containerClassName="pagination justify-content-center"
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousLabel="«"
            nextLabel="»"
            previousClassName="page-item"
            nextClassName="page-item"
            previousLinkClassName="page-link"
            nextLinkClassName="page-link"
            activeClassName="active"
          />
        )}
      </div>
    </div>
  );
};

export default ViewMessage;
