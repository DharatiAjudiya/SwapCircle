import React, { memo } from "react";
import { Card, Form } from "react-bootstrap";
import Skeleton from "@mui/material/Skeleton";

const FilterFormSkeleton = () => {
  return (
    <Card className="filters mt-4 p-2">
      {/* Title */}
      <Card.Title className="filter-header">
        <Skeleton width={150} height={50} />
      </Card.Title>
      <Card.Body>
        {/* Category */}
        <Form.Group className="mb-3">
          <Form.Label>
            <Skeleton width={100} />
          </Form.Label>
          <div className="filter-options">
            <Skeleton variant="rectangular" width="100%" height={40} />
          </div>
        </Form.Group>

        {/* Condition */}
        <Form.Group className="mb-3">
          <Form.Label>
            <Skeleton width={100} />
          </Form.Label>
          <div className="filter-options">
            {Array(5)
              .fill()
              .map((_, i) => (
                <div className="d-flex justify-content-start align-items-center align-content-center gap-3">
                  <Skeleton
                    key={i}
                    width={20}
                    height={30}
                    style={{ marginBottom: "10px" }}
                  />
                  <Skeleton
                    key={i}
                    width={120}
                    height={30}
                    style={{ marginBottom: "10px" }}
                  />
                </div>
              ))}
          </div>
        </Form.Group>

        {/* Condition */}
        <Form.Group className="mb-3">
          <Form.Label>
            <Skeleton width={100} />
          </Form.Label>
          <div className="filter-options">
            {Array(2)
              .fill()
              .map((_, i) => (
                <div className="d-flex justify-content-start align-items-center align-content-center gap-3">
                  <Skeleton
                    key={i}
                    width={20}
                    height={30}
                    style={{ marginBottom: "10px" }}
                  />
                  <Skeleton
                    key={i}
                    width={120}
                    height={30}
                    style={{ marginBottom: "10px" }}
                  />
                </div>
              ))}
          </div>
        </Form.Group>

        {/* Tags */}
        <Form.Group className="mb-3">
          <Form.Label>
            <Skeleton width={100} />
          </Form.Label>
          <div className="filter-options d-flex justify-content-between align-items-center align-content-center w-100">
            <Skeleton variant="rectangular" width="100%" height={40} />
            <Skeleton
              variant="rectangular"
              width={80}
              height={40}
              style={{ marginLeft: "1rem" }}
            />
          </div>
        </Form.Group>

        {/* User Rating */}
        <Form.Group className="mb-3">
          <Form.Label>
            <Skeleton width={120} />
          </Form.Label>
          <div className="filter-options d-flex justify-content-between align-items-center align-content-center">
            <Skeleton width={130} height={40} />
            <Skeleton variant="rectangular" width={80} height={40} />
          </div>
        </Form.Group>
      </Card.Body>
    </Card>
  );
};

export default memo(FilterFormSkeleton);
