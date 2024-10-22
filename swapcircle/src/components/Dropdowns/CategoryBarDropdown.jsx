import React, { useState, useEffect, useRef } from "react";
import { Nav, NavDropdown } from "react-bootstrap";
import "./CategoryBar.css";
import { useNavigate } from "react-router-dom";
import { FaAngleDown } from "react-icons/fa6";

const CategoryBarDropdown = ({ categories }) => {
  const dropdownRef = useRef(null);
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const handleToggle = () => setShow(!show);

  const handleClose = (id) => {
    navigate(`/shop/${id}`);
    setShow(false);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShow(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div ref={dropdownRef} className="category-dropdown-container">
        <Nav.Link
          style={{ fontWeight: "bolder" }}
          className="d-flex align-content-start align-items-start custom-navitem"
          onClick={handleToggle}
        >
          <FaAngleDown
            className={`down-arrow ${show ? "rotate" : ""}`}
            style={{ fontSize: "1.5rem" }}
          />{" "}
          ALL CATEGORIES
        </Nav.Link>
        <NavDropdown
          ref={dropdownRef}
          show={show}
          onToggle={handleToggle}
          align="start"
          className={`custom-navitem category-dropdown ${
            show ? "slide-in-up" : "slide-out-down"
          }`}
        >
          {categories &&
            categories.map((category) => (
              <>
                <NavDropdown.Item onClick={() => handleClose(category._id)}>
                  {category?.category}
                </NavDropdown.Item>
                <NavDropdown.Divider />
              </>
            ))}
        </NavDropdown>
      </div>
    </>
  );
};

export default CategoryBarDropdown;
