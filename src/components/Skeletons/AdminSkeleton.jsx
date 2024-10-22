import React from "react";
import SidebarSkeleton from "./Layout/SidebarSkeleton";
import TableSkeleton from "./Layout/TableSkeleton";
import { Container } from "react-bootstrap";

const AdminSkeleton = () => {
  return (
    <div className="d-flex flex-column flex-md-row  ">
      <SidebarSkeleton />
      {/*  */}
      {/* main page */}
      <Container
        fluid
        className="d-flex justify-content-center align-content-center align-items-center w-100"
        style={{ height: "92vh", maxHeight: "92vh", overflowY: "auto" }}
      >
        <TableSkeleton />
      </Container>
    </div>
  );
};

export default AdminSkeleton;
