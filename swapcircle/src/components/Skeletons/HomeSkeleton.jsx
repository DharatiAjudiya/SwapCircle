import { Skeleton } from "@mui/material";
import React, { memo, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import "../../../Pages/Home.css";
import VerticalItemCardSkeleton from "./Cards/VerticalItemCardSkeleton";
import ProfileCardSkeleton from "./Cards/ProfileCardSkeleton";
import CategoryCardSkeleton from "./Cards/CategoryCardSkeleton";

const HomeSkeleton = () => {
  return (
    <>
      <Container fluid className="carousel-container">
        <Skeleton variant="rectangular" width="100%" height={400} />
      </Container>

      <Container style={{ marginTop: "8rem" }}>
        <h1 style={{ marginLeft: "2rem" }}>
          <Skeleton width={250} height={40} />
        </h1>
        <Row className="mt-4" style={{ padding: "0 1rem", width: "100%" }}>
          {Array(4)
            .fill()
            .map((_, index) => (
              <Col key={index} xs={4} sm={3} md={4} lg={3}>
                <VerticalItemCardSkeleton />
              </Col>
            ))}
        </Row>
      </Container>

      <Container fluid className="m-4 d-flex justify-content-center">
        <ProfileCardSkeleton />
      </Container>

      <Container style={{ marginTop: "8rem", overflow: "hidden" }}>
        <h1 style={{ marginLeft: "2rem", marginBottom: "2rem" }}>
          <Skeleton width={250} height={40} />
        </h1>
        <CategoryCardSkeleton />
      </Container>

      <Container style={{ marginTop: "8rem", marginBottom: "8rem" }}>
        <Row>
          <Col md={6}>
            <Skeleton variant="rectangular" width="100%" height={300} />
          </Col>
          <Col md={6}>
            <Skeleton variant="rectangular" width="100%" height={300} />
          </Col>
        </Row>
      </Container>

      <Container style={{ marginBottom: "8rem" }}>
        <Row className="d-flex align-items-center justify-content-center">
          <Skeleton variant="rectangular" width="200%" height={400} />
        </Row>
      </Container>
    </>
  );
};

export default memo(HomeSkeleton);
