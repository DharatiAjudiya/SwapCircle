import React, { memo } from "react";
import "../../Cards/VerticalItemCard.css";
import { Card } from "react-bootstrap";
import { Skeleton } from "@mui/material";

const VerticalItemCardSkeleton = () => {
  return (
    <Card className="v-item-card-container">
      <Skeleton variant="rectangular" width="100%" className="carousel-image" />
      <Card.Body className="ps-0">
        <Skeleton
          className="v-item-card-title"
          variant="text"
          height={30}
          width="80%"
        />
        <Skeleton
          className="v-item-card-text"
          variant="text"
          height={20}
          width="100%"
        />
      </Card.Body>
    </Card>
  );
};

export default memo(VerticalItemCardSkeleton);
