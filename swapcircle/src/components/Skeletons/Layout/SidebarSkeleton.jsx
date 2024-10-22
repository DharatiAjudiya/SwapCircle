import React, { memo } from "react";
import {
  Container,
  Offcanvas,
  Navbar,
  Nav,
  Image,
  Button,
} from "react-bootstrap";
import { Skeleton } from "@mui/material";
import "../../layouts/Sidebar.css";

const SidebarSkeleton = () => {
  return (
    <>
      <Navbar
        bg="dark"
        variant="dark"
        expand={false}
        className="d-md-none w-100"
      >
        <Container fluid>
          <Navbar.Brand href="#">SWAP CIRCLE</Navbar.Brand>
          <Skeleton variant="rectangular" width={40} height={40} />
        </Container>
      </Navbar>

      <div className="sidebar d-none d-md-block">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <Skeleton variant="circular" width={60} height={60} />
            <Skeleton width={120} height={20} style={{ marginLeft: "10px" }} />
          </div>
        </div>

        <Nav className="flex-column sidebar-nav">
          {Array(4)
            .fill()
            .map((_, index) => (
              <div key={index} className="mb-3">
                <Skeleton variant="rectangular" width="100%" height={40} />
              </div>
            ))}
        </Nav>
        <div className="sidebar-footer">
          <Skeleton
            variant="circular"
            width={145}
            height={45}
            className="profile-picture"
          />
          <div className="profile-info">
            <Skeleton width={80} height={20} style={{ marginLeft: "10px" }} />
            <Skeleton width={140} height={20} style={{ marginLeft: "10px" }} />
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(SidebarSkeleton);
