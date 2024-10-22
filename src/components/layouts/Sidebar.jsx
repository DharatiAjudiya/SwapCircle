import React, { useEffect, useState } from "react";
import {
  Navbar,
  Nav,
  Container,
  Offcanvas,
  Button,
  Col,
  Row,
  Image,
} from "react-bootstrap";
import { TbHome } from "react-icons/tb";
import { TbInvoice } from "react-icons/tb";
import { LuLayoutDashboard } from "react-icons/lu";
import { AiOutlineProduct } from "react-icons/ai";
import { MdOutlinePersonAddAlt } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { GiHamburgerMenu } from "react-icons/gi"; // Hamburger Icon
import { RiLogoutCircleRLine } from "react-icons/ri";
import { IoReorderThreeOutline } from "react-icons/io5";
import "./Sidebar.css";
import SidebarProfileDropdown from "../Dropdowns/SidebarProfileDropdown";
import { useLocation, useNavigate } from "react-router-dom";
import Cookie from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { GetUserProfileApi } from "../../../stores/User/UserSlice";
import { useToastContext } from "../../../Hooks/ToastContextHook";
import demoProfileImg from "/images/demo-profile.jpg";
import { NODE_APP_URL } from "../../../config/app_config";
import { LogoutApi } from "../../../stores/auth/LoginSlice";

const Sidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data } = useSelector((state) => state.AuthUserStore);
  const { profileData,loading } = useSelector((state) => state.UserStore);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [dropdownShow, setDropdownShow] = useState(false);
  const handleDropdownToggle = () => setDropdownShow(!dropdownShow);
  const handleDropdownClose = () => setDropdownShow(false);

  const handleNavClick = (path) => {
    navigate(path);
    handleClose(); // Close the offcanvas when a link is clicked
  };

  useEffect(() => {
    if (data?.id) {
      dispatch(GetUserProfileApi({ id: data?.id }));
    }
  }, [dispatch, data?.id]);

  const { toastType, showToast } = useToastContext();

  const [profile, setProfile] = useState(demoProfileImg);

  useEffect(() => {
    if (profileData?.profile && profileData?.profile.startsWith("http")) {
      setProfile(() =>
        profileData?.profile ? profileData?.profile : demoProfileImg
      );
    } else if (profileData?.profile) {
      setProfile(() =>
        profileData?.profile
          ? `${NODE_APP_URL}/uploads/users/${profileData.profile}`
          : demoProfileImg
      );
    }
  }, [profileData?.social_platform, profileData?.profile]);

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

  return (
    <>
      {/* Hamburger icon for mobile view */}
      <Navbar
        bg="dark"
        variant="dark"
        expand={false}
        className="d-md-none w-100"
      >
        <Container fluid>
          <Navbar.Brand href="#">SWAP CIRCLE</Navbar.Brand>
          <Button className="clear-filter-btn" onClick={handleShow}>
            <IoReorderThreeOutline style={{ fontSize: "2.5rem" }} />
          </Button>
        </Container>
      </Navbar>

      {/* Offcanvas for mobile sidebar */}
      <Offcanvas
        show={show}
        onHide={handleClose}
        className="sidebar-offcanvas sidebar"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <Image
              src={"/images/SwapCircle-2.svg"}
              alt="logo"
              width="40"
              height="40"
              roundedCircle
              className="me-3"
            />
            SWAP CIRCLE
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column sidebar-nav">
            <Nav.Item>
              <Nav.Link
                className={`${
                  location.pathname === "/admin/user" ? "active" : ""
                }`}
                onClick={() => handleNavClick("/admin/user")}
              >
                <MdOutlinePersonAddAlt
                  className="pe-none me-2"
                  style={{ fontSize: "1.5rem" }}
                />
                Users
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                className={`${
                  location.pathname === "/admin/item" ? "active" : ""
                }`}
                onClick={() => handleNavClick("/admin/item")}
              >
                <AiOutlineProduct
                  className="pe-none me-2"
                  style={{ fontSize: "1.5rem" }}
                />
                Items
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                className={`${
                  location.pathname === "/admin/category" ? "active" : ""
                }`}
                onClick={() => handleNavClick("/admin/category")}
              >
                <AiOutlineProduct
                  className="pe-none me-2"
                  style={{ fontSize: "1.5rem" }}
                />
                Categories
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                className={`${
                  location.pathname === "/admin/swap" ? "active" : ""
                }`}
                onClick={() => handleNavClick("/admin/swap")}
              >
                <TbInvoice
                  className="pe-none me-2"
                  style={{ fontSize: "1.5rem" }}
                />
                Swaps
              </Nav.Link>
            </Nav.Item>
            <hr />
            <Nav.Item>
              <Nav.Link onClick={() => handleNavClick("/profile")}>
                <CgProfile
                  className="pe-none me-2"
                  style={{ fontSize: "1.5rem" }}
                />
                View Profile
              </Nav.Link>
            </Nav.Item>
            <Nav.Item onClick={handleLogout}>
              <Nav.Link>
                <RiLogoutCircleRLine
                  className="pe-none me-2"
                  style={{ fontSize: "1.5rem" }}
                />
                Log out
              </Nav.Link>
            </Nav.Item>
          </Nav>
          <div className="sidebar-footer">
            <Image
              src={profile}
              alt="profile-pic"
              width="45"
              height="45"
              roundedCircle
              className="profile-picture"
            />
            <div className="profile-info">
              <span>{profileData?.username}</span>
              <small>{profileData?.email}</small>
            </div>
            <i className="icon-settings"></i>
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      <div className="sidebar d-none d-md-block">
        <div className="sidebar-header">
          <div className="sidebar-logo" onClick={() => handleNavClick("/")}>
            <Image
              src={"/images/SwapCircle-2.svg"}
              alt="logo"
              width="60"
              height="60"
              roundedCircle
              className="me-3"
            />
            <div className="sidebar-logo-text">
              <span>SWAP CIRCLE</span>
            </div>
          </div>
        </div>

        <Nav className="flex-column sidebar-nav">
          <Nav.Item>
            <Nav.Link
              className={`${
                location.pathname === "/admin/user" ? "active" : ""
              }`}
              onClick={() => handleNavClick("/admin/user")}
            >
              <MdOutlinePersonAddAlt
                className="pe-none me-2"
                style={{ fontSize: "1.5rem" }}
              />
              Users
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              className={`${
                location.pathname === "/admin/item" ? "active" : ""
              }`}
              onClick={() => handleNavClick("/admin/item")}
            >
              <AiOutlineProduct
                className="pe-none me-2"
                style={{ fontSize: "1.5rem" }}
              />
              Items
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              className={`${
                location.pathname === "/admin/category" ? "active" : ""
              }`}
              onClick={() => handleNavClick("/admin/category")}
            >
              <AiOutlineProduct
                className="pe-none me-2"
                style={{ fontSize: "1.5rem" }}
              />
              Categories
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              className={`${
                location.pathname === "/admin/swap" ? "active" : ""
              }`}
              onClick={() => handleNavClick("/admin/swap")}
            >
              <TbInvoice
                className="pe-none me-2"
                style={{ fontSize: "1.5rem" }}
              />
              Swaps
            </Nav.Link>
          </Nav.Item>
          <hr />
          <Nav.Item>
            <Nav.Link onClick={() => handleNavClick("/profile")}>
              <CgProfile
                className="pe-none me-2"
                style={{ fontSize: "1.5rem" }}
              />
              View Profile
            </Nav.Link>
          </Nav.Item>
          <Nav.Item onClick={handleLogout}>
            <Nav.Link>
              <RiLogoutCircleRLine
                className="pe-none me-2"
                style={{ fontSize: "1.5rem" }}
              />
              Log out
            </Nav.Link>
          </Nav.Item>
        </Nav>
        <div className="sidebar-footer">
          <Image
            src={profile}
            alt="profile-pic"
            width="45"
            height="45"
            roundedCircle
            className="profile-picture"
          />
          <div className="profile-info">
            <span>{profileData?.username}</span>
            <small>{profileData?.email}</small>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
