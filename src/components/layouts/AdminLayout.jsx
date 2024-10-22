import React, { Suspense } from "react";
import "./AdminLayout.css";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { Container } from "react-bootstrap";
const AdminLayout = ({ content }) => {
  return (
    <>
      <div className="d-flex flex-column flex-md-row align-items-center">
        <Sidebar />
        {/*  */}
        {/* main page */}
        <Container
          fluid
          className="d-flex justify-content-center align-content-center align-items-center w-100"
          style={{ height: "92vh",maxHeight: "92vh", overflowY: "auto" }}
        >
          <Suspense>{content}</Suspense>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default AdminLayout;
