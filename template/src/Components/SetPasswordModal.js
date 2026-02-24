const SetPasswordModal = ({ show, onClose }) => {
  const [password, setPassword] = useState("");
  const { token } = useAuth(); // make sure token exists in context

  const handleSubmit = async () => {
    const res = await fetch(`${API_BASE}/api/auth/site/user/set-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ password }),
    });

    const data = await res.json();

    if (data.success) {
      alert("Password set successfully");
      onClose();
    } else {
      alert(data.message);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Set Your Password</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <input
          type="password"
          className="form-control"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button className="mt-3 w-100" onClick={handleSubmit}>
          Save Password
        </Button>
      </Modal.Body>
    </Modal>
  );
};
