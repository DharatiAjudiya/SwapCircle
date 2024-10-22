import { Skeleton } from "@mui/material";
import React, { memo } from "react";
import { Col, Container, Row } from "react-bootstrap";
import VerticalItemCardSkeleton from "../Cards/VerticalItemCardSkeleton";

const PreferenceContainerSkeleton = () => {
  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginLeft: "2rem",
          marginBottom: "2rem",
        }}
      >
        <Skeleton
          variant="rounded"
          width="30%"
          height={50}
          sx={{ marginRight: "auto" }}
        />
        <Skeleton variant="circular" width={50} height={50} sx={{ mr: 1 }} />
        <Skeleton variant="circular" width={50} height={50} />
      </div>
      <Row
        style={{
          display: "flex",
          flexWrap: "nowrap",
          marginRight: "-15px",
          marginLeft: "-15px",
          padding: "0 1rem",
          width: "100%",
        }}
      >
        {Array(4)
          .fill()
          .map((item, i) => (
            <Col
              key={i}
              xs={6}
              sm={3}
              md={4}
              lg={3}
              style={{ flex: "0 0 auto" }}
            >
              <VerticalItemCardSkeleton />
            </Col>
          ))}
      </Row>
    </>
  );
};

export default memo(PreferenceContainerSkeleton);
