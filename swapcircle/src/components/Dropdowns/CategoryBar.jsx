import Nav from "react-bootstrap/Nav";
import "./CategoryBar.css"; // Import the CSS file
import { FaChevronDown } from "react-icons/fa";
import CategoryBarDropdown from "./CategoryBarDropdown";
import { useState } from "react";

const CategoryBar = () => {
  const [show, setShow] = useState(false);
  const handleToggle = () => setShow(!show);

  return (
    <Nav className="custom-navbar sticky-top">
      <Nav.Item>
        <Nav.Link
          className="custom-navitem"
          onClick={handleToggle}
        >
          All Categories{" "}
          <FaChevronDown className={`chevron-icon ms-2 ${show ? "rotate" : ""}`} />
        </Nav.Link>
        <CategoryBarDropdown
          show={show}
          setShow={setShow}
        />
      </Nav.Item>
      <Nav.Item>
        <Nav.Link className="custom-navitem">Car</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="/" className="custom-navitem" active>
          Electronics
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link className="custom-navitem">Clothes</Nav.Link>
      </Nav.Item>
    </Nav>
  );
};

export default CategoryBar;
