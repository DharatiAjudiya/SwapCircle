import React, { memo } from "react";
import {
  Container,
  Breadcrumb,
  Row,
  Col,
  Image,
  Button,
  Card,
  Tooltip,
  Carousel,
} from "react-bootstrap";
import Skeleton from "@mui/material/Skeleton";
import VerticalItemCardSkeleton from "./Cards/VerticalItemCardSkeleton";
import ItemDetailContainerSkeleton from "./Layout/ItemDetailContainerSkeleton";
import PreferenceContainerSkeleton from "./Layout/PreferenceContainerSkeleton";

const ItemDetailSkeleton = ({ isLoading = true, singleData = {} }) => {
  return (
    <Container className="detail-container">
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

      <ItemDetailContainerSkeleton />

      {/* Similar Products */}
      <Container style={{ marginTop: "8rem" }} className="similar-products">
        <PreferenceContainerSkeleton />
      </Container>

      {/* Customer Also Liked */}
      <Container style={{ marginTop: "8rem" }} className="customer-also-liked">
        <PreferenceContainerSkeleton />
      </Container>
    </Container>
  );
};

export default memo(ItemDetailSkeleton);
