import React, { memo } from "react";
import VerticalItemCardSkeleton from "./Cards/VerticalItemCardSkeleton";
import FilterFormSkeleton from "./Forms/FilterFormSkeleton";
import { Breadcrumb, Col, Container, Nav, Row } from "react-bootstrap";
import { Skeleton, Tooltip } from "@mui/material";

const ProductSkeleton = () => {
  return (
    <Container style={{ marginTop: "9rem", marginBottom: "8rem" }}>
      {/* Breadcrumb */}
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

      {/* Product Count and Sorting */}
      <Row className="align-items-center mb-3 sorting-row">
        <Col md={12}>
          <Nav className="d-flex justify-content-end align-content-center align-items-center">
            <span>
              <Skeleton width={70} />{" "}
            </span>
            {Array(3)
              .fill()
              .map((_, i) => (
                <Skeleton
                  key={i}
                  width={100}
                  height={30}
                  style={{ marginLeft: "1rem" }}
                />
              ))}
          </Nav>
        </Col>
      </Row>

      <Row>
        {/* Filters Section */}
        <Col md={3} className="d-none d-md-block">
          <FilterFormSkeleton />
        </Col>

        {/* Product Cards Section */}
        <Col md={9}>
          <Row
            className="mt-4 location-bar"
            style={{
              display: "flex",
              justifyContent: "end",
              padding: "0 1rem",
              width: "100%",
            }}
          >
            <Col xs={12} className="d-flex justify-content-end align-items-center">
              <Skeleton width="40%" height={40} />
            </Col>
          </Row>

          <Row className="mt-4" style={{ padding: "0 1rem", width: "100%" }}>
            {Array(3)
              .fill()
              .map((_, i) => (
                <Col key={i} xs={6} sm={3} md={4} style={{ flex: "0 0 auto" }}>
                  <VerticalItemCardSkeleton />
                </Col>
              ))}
          </Row>

          <Skeleton width="100%" height={50} />
        </Col>
      </Row>

      <hr />
    </Container>
  );
};

export default memo(ProductSkeleton);
