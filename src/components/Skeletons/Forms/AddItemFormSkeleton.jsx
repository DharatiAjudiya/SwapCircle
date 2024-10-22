import { Skeleton } from "@mui/material";
import { borderRadius } from "@mui/system";
import React, { memo } from "react";
import { Card, Form } from "react-bootstrap";

const AddItemFormSkeleton = () => {
  return (
    <div className="sidebar-form">
      <div className="d-flex justify-content-between align-content-center align-items-center gap-3">
        <h4 className="page-title">
          <Skeleton width={120} height={30} />
        </h4>
        <Skeleton variant="rectangular" width={80} height={35} />
      </div>
      <Form className="my-3">
        <Card.Text style={{ fontSize: "0.8rem" }}>
          <Skeleton width={250} />
        </Card.Text>

        {/* Image Upload Section */}
        <div className="image-upload-container my-2 w-100 mb-4">
          <div className="image-preview-container w-100">
            <Skeleton variant="rectangular" width={90} height={90} />
          </div>
        </div>

        {/* Item Name */}
        <Form.Group controlId="formItemName" className="mb-3">
          <Skeleton width={100} />
          <Skeleton width="100%" height={70} />
        </Form.Group>

        {/* Item Description */}
        <Form.Group controlId="formItemDescription" className="mb-3">
          <Skeleton width={150} />
          <Skeleton width="100%" height={140} />
        </Form.Group>

        {/* Price Slider */}
        <Form.Group className="mb-3">
          <Skeleton width={120} />
          <Skeleton width="100%" height={70} />
        </Form.Group>

        {/* Price Slider */}
        <Form.Group className="mb-3">
          <Skeleton width={120} />
          <Skeleton width="100%" height={70} />
        </Form.Group>

        {/* Category */}
        <Form.Group className="mb-3">
          <Skeleton width={100} />
          <Skeleton width="100%" height={50} />
        </Form.Group>

        {/* Category */}
        <Form.Group className="mb-3">
          <Skeleton width={100} />
          <Skeleton width="100%" height={50} />
        </Form.Group>

        <Form.Group className="mb-3 d-flex justify-content-between align-items-start align-content-start">
          <div className="d-flex flex-row align-items-start align-content-start justify-content-start gap-1">
            <Skeleton
              variant="rounded"
              sx={{ borderRadius: "50px" }}
              width={30}
            />
            <Skeleton variant="rounded" width={60} />
          </div>
          <div className="d-flex flex-row align-items-start align-content-start justify-content-start gap-1">
            <Skeleton
              variant="rounded"
              sx={{ borderRadius: "50px" }}
              width={30}
            />
            <Skeleton variant="rounded" width={60} />
          </div>
        </Form.Group>

        <Form.Group controlId="formItemName" className="mb-3">
          <Skeleton width={100} />
          <Skeleton width="100%" height={70} />
        </Form.Group>

        <Skeleton variant="rectangular" width="100%" height={50} />
      </Form>
    </div>
  );
};

export default memo(AddItemFormSkeleton);
