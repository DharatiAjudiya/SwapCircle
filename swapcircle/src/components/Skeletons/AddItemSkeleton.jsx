import React, { memo } from "react";
import ItemDetailContainerSkeleton from "./Layout/ItemDetailContainerSkeleton";
import AddItemFormSkeleton from "./Forms/AddItemFormSkeleton";
import "../Forms/AddItemForm.css";
import { Breadcrumb, Col, Container, Row } from "react-bootstrap";
import { Skeleton } from "@mui/material";
import { useNavigate } from "react-router-dom";

const AddItemSkeleton = () => {
  const navigate = useNavigate();

  return (
    <Container fluid>
      <Breadcrumb>
        <Breadcrumb.Item href="#" onClick={() => navigate("/")}>
          Home
        </Breadcrumb.Item>
        <Breadcrumb.Item active>
          <Skeleton variant="text" height={"100%"} width={80} sx={{ ml: 2 }} />
        </Breadcrumb.Item>
        <Breadcrumb.Item active>
          <Skeleton variant="text" height={"100%"} width={80} sx={{ ml: 2 }} />
        </Breadcrumb.Item>
      </Breadcrumb>
      <Row>
        {/* Left Sidebar for Form */}
        <Col md={3}>
          <AddItemFormSkeleton />
        </Col>
        {/* Right Section for Item Detail */}
        <Col md={9} className="item-detail">
          <Container className="detail-container">
            <Skeleton variant="rounded" width="30%" height={30} />
            <ItemDetailContainerSkeleton />
          </Container>
        </Col>
      </Row>
    </Container>
  );
};

export default memo(AddItemSkeleton);
