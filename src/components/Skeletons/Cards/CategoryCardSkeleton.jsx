import { Skeleton } from "@mui/material";
import React, { memo } from "react";
import { Col, Row } from "react-bootstrap";

const CategoryCardSkeleton = () => {
  return (
    <>
      <Row className="mt-4" style={{ padding: "0 1rem", width: "100%" }}>
        {Array(4)
          .fill()
          .map((_, index) => (
            <Col key={index} xs={4} sm={3} md={4} lg={3} className={`mb-4`}>
              <Skeleton
                className="category-card"
                variant="rectangular"
                width="80%"
                height={200}
              />
              <Skeleton
                className="category-name"
                variant="rectangular"
                width="80%"
                height={20}
              />
            </Col>
          ))}
      </Row>
    </>
  );
};

export default memo(CategoryCardSkeleton);
