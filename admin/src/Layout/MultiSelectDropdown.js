import { Dropdown, Form } from "react-bootstrap";
import "./MultiSelectDropdown.css";

const MultiSelectDropdown = ({ options, selected, onChange, label }) => {
  const handleCheckboxChange = (value) => {
    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <Dropdown className="mb-3">
      <Dropdown.Toggle variant="light"
        className="form-control text-start"
        id="dropdown-basic">
        {selected.length > 0 ? selected.join(", ") : label || "Select Options"}
      </Dropdown.Toggle>

      <Dropdown.Menu style={{ maxHeight: "200px", overflowY: "auto", width: "100%" }}>
        {options.map((option, index) => (
          <Dropdown.Item key={index} as="div">
            <Form.Check
              type="checkbox"
              id={`check-${index}`}
              label={option}
              checked={selected.includes(option)}
              onChange={() => handleCheckboxChange(option)}
            />
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default MultiSelectDropdown;