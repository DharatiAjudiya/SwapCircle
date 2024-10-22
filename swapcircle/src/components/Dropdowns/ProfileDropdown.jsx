import React, { useState, useEffect, useRef } from "react";
import Cookie from "js-cookie";
import { NavDropdown, Image } from "react-bootstrap";
import "./ProfileDropdown.css";
import { useNavigate } from "react-router-dom";
import { useToastContext } from "../../../Hooks/ToastContextHook";
import demoProfileImg from "/images/demo-profile.jpg";
import { NODE_APP_URL } from "../../../config/app_config";
import { useDispatch } from "react-redux";
import { LogoutApi } from "../../../stores/auth/LoginSlice";

const ProfileDropdown = ({ data }) => {
  const { toastType, showToast } = useToastContext();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [show, setShow] = useState(false);
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

  const handleToggle = () => setShow(!show);
  const handleClose = () => setShow(false);
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
    <div ref={dropdownRef} className={`profile-dropdown-container  `}>
      <Image
        src={profile}
        // src={demoProfileImg}
        alt="Profile"
        width="40"
        height="40"
        roundedCircle
        style={{ cursor: "pointer" }}
        className="me-2 profile-pic"
        onClick={handleToggle}
      />
      <NavDropdown
        show={show}
        onToggle={handleToggle}
        id="navbarScrollingDropdown"
        align="end"
        className={`profile-dropdown ${
          show ? "slide-in-up" : "slide-out-down"
        }`}
        bsPrefix="custom-dropdown"
      >
        <NavDropdown.Header className="d-flex align-items-center justify-content-between mb-2">
          <Image
            src={profile}
            // src={demoProfileImg}
            alt="Profile"
            width="40"
            height="40"
            roundedCircle
            className="me-2 profile-pic"
          />
          {/* <span>Super Adminn</span> */}
          <span>{data?.username}</span>
        </NavDropdown.Header>
        <NavDropdown.Item onClick={() => handleNavigate("/profile")}>
          Profile
        </NavDropdown.Item>
        <NavDropdown.Item onClick={() => handleNavigate("/swap/history")}>
          Swap History
        </NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item onClick={handleLogout}>Sign out</NavDropdown.Item>
      </NavDropdown>
    </div>
  );
};

export default ProfileDropdown;
