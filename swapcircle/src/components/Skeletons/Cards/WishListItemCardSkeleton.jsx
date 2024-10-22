import { Skeleton } from "@mui/material";
import React, { memo } from "react";
import { Card } from "react-bootstrap";
import "../../Cards/WishListItemCard.css";

const WishListItemCardSkeleton = () => {
  return (
    <Card className="custom-card">
      <div className="card-body-content">
        <div className="wishlist-carousel-container">
          <Skeleton
            className="d-block w-100 carousel-image"
            variant="rectangular"
          />
        </div>
        <div className="card-content">
          <Skeleton className="title" variant="text" width="60%" />
          <Skeleton className="product-price" variant="text" width="40%" />
          <Skeleton className="author-name" variant="text" width="20%" />
          <div className="profile-info">
            <Skeleton
              variant="circular"
              width={50}
              height={50}
              sx={{ mr: 2 }}
            />
            <Skeleton className="profile-name" variant="text" width="70%" />
          </div>
        </div>
      </div>
      <div className="action-buttons">
        <Skeleton
          variant="rectangular"
          width="100%"
          height="35px"
          sx={{ mr: 2 }}
        />
        <Skeleton variant="rectangular" width="100%" height="35px" />
      </div>
    </Card>
  );
};

export default memo(WishListItemCardSkeleton);
