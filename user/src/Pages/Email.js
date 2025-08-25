import React, { useState } from "react";
import { Table, Form, Button, Card } from "react-bootstrap";

const EmailAutomation = () => {
  const [automations, setAutomations] = useState({
    welcomeEmail: true,
    approvalEmail: true,
    rejectionEmail: true,
    expiringReminder: true,
    leadNotification: true,
  });

  const toggleAutomation = (key) => {
    setAutomations({ ...automations, [key]: !automations[key] });
  };

  return (
    <div className="container mt-4">
      <h4>📧 Email Automation</h4>

      {/* Automation Toggles */}
      <Card className="p-3 mb-4">
        <h5>Automation Settings</h5>
        {Object.entries(automations).map(([key, value]) => (
          <Form.Check
            type="switch"
            id={key}
            key={key}
            label={key.replace(/([A-Z])/g, " $1")}
            checked={value}
            onChange={() => toggleAutomation(key)}
          />
        ))}
      </Card>

      {/* Templates */}
      <Card className="p-3 mb-4">
        <h5>Email Templates</h5>
        <Form.Group className="mb-3">
          <Form.Label>Template for Approval Email</Form.Label>
          <Form.Control as="textarea" rows={4} defaultValue="Hello {businessName}, your listing has been approved..." />
        </Form.Group>
        <Button variant="primary">Save Template</Button>
      </Card>

      {/* Preview & Test */}
      <Card className="p-3 mb-4">
        <h5>Preview & Test Email</h5>
        <Form.Control type="email" placeholder="Enter test email address" className="mb-2" />
        <Button variant="success">Send Test Email</Button>
      </Card>

      {/* Sent Email Log */}
      <Card className="p-3">
        <h5>Sent Email Log</h5>
        <Table striped bordered>
          <thead>
            <tr>
              <th>Date</th>
              <th>Recipient</th>
              <th>Type</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2025-08-14</td>
              <td>john@example.com</td>
              <td>Welcome Email</td>
              <td>✅ Sent</td>
            </tr>
          </tbody>
        </Table>
      </Card>
    </div>
  );
};

export default EmailAutomation;
