import React, { useState, useEffect, useRef } from "react";
import Cookie from "js-cookie";
import { NavDropdown, Image, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useToastContext } from "../../../Hooks/ToastContextHook";
import demoProfileImg from "/images/demo-profile.jpg";
import { NODE_APP_URL } from "../../../config/app_config";
import "./SidebarProfileDropdown.css";
import { LogoutApi } from "../../../stores/auth/LoginSlice";
import { useSelector } from "react-redux";

const SidebarProfileDropdown = ({
  data,
  handleClose,
  handleToggle,
  show,
  setShow,
}) => {
  const { toastType, showToast } = useToastContext();
  const navigate = useNavigate();

  const dropdownRef = useRef(null);

  const [profile, setProfile] = useState(demoProfileImg);

  useEffect(() => {
    if (data?.profile && data?.profile.startsWith("http")) {
      setProfile(() => (data?.profile ? data?.profile : demoProfileImg));
    } else if (data?.profile) {
      setProfile(() =>
        data?.profile
          ? `${NODE_APP_URL}/uploads/users/${data.profile}`
          : demoProfileImg
      );
    }
  }, [data?.social_platform, data?.profile]);

  const handleLogout = () => {
    dispatch(LogoutApi());
    Cookie.remove("token");
    setShow(false);
    toastType.current = {
      severity: "success",
      summary: "Success",
      detail: "Logged Out.",
    };
    showToast("top-left");
    setTimeout(() => {
      navigate("/login");
    }, 100);
  };

  const handleNavigate = (path) => {
    setShow(false);
    navigate(path);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      handleClose();
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
      <div
        className="d-flex align-items-center justify-content-center profile-pic-container mb-4"
        onClick={handleToggle}
        // ref={dropdownRef}
      >
        <Image
          src={profile}
          alt="mdo"
          width="100"
          height="100"
          roundedCircle
          className="profile-pic"
        />
      </div>
      <div className="sidebar-profile-dropdown-container">
        <div
          className="d-flex justify-content-center align-items-start align-content-start flex-column"
          style={{ width: "100%" }}
        >
          <div>Username :</div>
          <div>
            <h6> {data?.username && `${data?.username}`}</h6>
          </div>
        </div>
        <div
          className="d-flex justify-content-center align-items-start align-content-start flex-column"
          style={{ width: "100%" }}
        >
          <div>Email :</div>
          <div>
            <h6>{data?.email && `${data?.email}`}</h6>
          </div>
        </div>
        <div
          className="d-flex justify-content-center align-items-start align-content-start flex-column"
          style={{ width: "100%" }}
        >
          <div>Phone : </div>
          <div>
            <h6>{data?.phone_number && `+61 ${data?.phone_number}`}</h6>
          </div>
        </div>

        <NavDropdown
          show={show}
          onToggle={handleToggle}
          id="navbarScrollingDropdown"
          align="end"
          className={`sidebar-profile-dropdown ${
            show ? "slide-in-up" : "slide-out-down"
          }`}
          bsPrefix="custom-dropdown"
        >
          <NavDropdown.Item onClick={() => handleNavigate("/profile")}>
            Profile
          </NavDropdown.Item>
          {/* <NavDropdown.Item onClick={() => handleNavigate("/swap/history")}>
          Swap History
        </NavDropdown.Item> */}
          <NavDropdown.Divider />
          <NavDropdown.Item onClick={handleLogout}>Sign out</NavDropdown.Item>
        </NavDropdown>
      </div>
    </>
  );
};

export default SidebarProfileDropdown;
