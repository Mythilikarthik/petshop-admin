import React, { useEffect, useState } from 'react';

const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://petshop-admin.onrender.com"
    : "http://localhost:5000";
const ViewMessages = ({ senderId, receiverId }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/messages/conversation/${senderId}/${receiverId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setMessages(data.messages);
      });
  }, [senderId, receiverId]);

  return (
    <div>
      <h3>Conversation</h3>
      {messages.map((msg) => (
        <div key={msg._id}>
          <b>{msg.senderId === senderId ? 'You' : 'Them'}:</b> {msg.message}
        </div>
      ))}
    </div>
  );
};
export default ViewMessages;
