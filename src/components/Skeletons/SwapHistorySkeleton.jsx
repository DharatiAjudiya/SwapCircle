import React, { memo } from "react";
import VerticalItemCardSkeleton from "./Cards/VerticalItemCardSkeleton";
import { Breadcrumb, Col, Container, Row } from "react-bootstrap";
import { Skeleton } from "@mui/material";
import ProfileSidebarSkeleton from "./Layout/ProfileSidebarSkeleton";

const SwapHistorySkeleton = () => {
  return (
    <Container fluid>
      <Breadcrumb>
        <Breadcrumb.Item href="#" onClick={() => navigate("/")}>
          Home
        </Breadcrumb.Item>
        <Breadcrumb.Item active>History</Breadcrumb.Item>
      </Breadcrumb>
      <Row>
        <Col
          xs={12}
          sm={6}
          md={6}
          lg={3}
          className="d-flex flex-column align-items-center p-3"
          style={{ borderRight: "1px solid rgb(var(--color-black)))" }}
        >
          <ProfileSidebarSkeleton />
        </Col>

        <Col xs={12} sm={6} md={6} lg={9}>
          <Container fluid>
            <Container>
              {/* Header Row */}
              <Row className="d-flex justify-content-center align-content-center align-items-center mx-1 mb-3">
                {/* Left Title */}
                <Col
                  xs={4}
                  className="d-flex justify-content-center align-content-center align-items-center text-bg-dark"
                >
                  <Skeleton width={100} height={30} />
                </Col>

                {/* Center Title */}
                <Col
                  xs={4}
                  className="text-center d-flex justify-content-center align-content-center align-items-center"
                >
                  <Skeleton width={150} height={40} />
                </Col>

                {/* Right Title */}
                <Col
                  xs={4}
                  className="d-flex justify-content-center align-content-center align-items-center text-bg-dark"
                >
                  <Skeleton width={150} height={30} />
                </Col>
              </Row>

              <Row className="d-flex justify-content-center align-content-center align-items-center">
                <Col xs={4} className="mb-4">
                  <VerticalItemCardSkeleton />
                </Col>

                <Col
                  xs={4}
                  className="text-center d-flex justify-content-center align-content-center align-items-center swap-history-btn-container"
                >
                  <Skeleton width="100%" height={40} />
                </Col>

                <Col xs={4} className="mb-4">
                  <VerticalItemCardSkeleton />
                </Col>
              </Row>
            </Container>
          </Container>
        </Col>
      </Row>
    </Container>
  );
};

export default memo(SwapHistorySkeleton);
