import { Skeleton } from "@mui/material";
import React, { memo } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";

const ItemDetailContainerSkeleton = () => {
  return (
    <Row>
      <Col md={8} className="my-3">
        <Row>
          {/* Thumbnails */}
          <Col xs={4} sm={3} lg={2} className="p-0">
            <Container className="my-3 thumbnail-container">
              <div className="thumbnail-scroll">
                {Array(3)
                  .fill()
                  .map((_, i) => (
                    <Skeleton
                      key={i}
                      variant="rectangular"
                      width={100}
                      height={100}
                      style={{ marginBottom: "10px" }}
                    />
                  ))}
              </div>
            </Container>
          </Col>

          {/* Main Image Carousel */}
          <Col xs={8} sm={9} lg={10} className="main-image-carousel">
            <Skeleton variant="rectangular" width="100%" height={437} />
          </Col>
        </Row>
      </Col>

      <Col md={4} className="my-3">
        <Card className="my-3 p-2">
          <Card.Title>
            <Skeleton variant="text" width="40%" height={50} />
          </Card.Title>
          <Card.Text style={{ fontSize: "0.8rem" }}>
            <Skeleton variant="text" width="90%" />
          </Card.Text>
          <Card.Text
            className="d-flex justify-content-start align-items-center"
            style={{ fontSize: "1.5rem" }}
          >
            <Skeleton variant="text" width="20%" height={50} sx={{ mr: 1 }} />
            -
            <Skeleton variant="text" width="20%" height={50} sx={{ ml: 1 }} />
          </Card.Text>

          <div
            style={{ width: "100%", gap: "1rem" }}
            className="d-flex justify-content-start align-items-center mb-4"
          >
            <Skeleton
              variant="rounded"
              width={"90%"}
              height={40}
              sx={{ borderRadius: "200px" }}
            />
            <Skeleton variant="circular" width={"17%"} height={50} />
          </div>

          <Card.Text style={{ fontSize: "1rem", fontWeight: "bold" }}>
            <Skeleton width="50%" height={40} />
          </Card.Text>
          <Card.Text style={{ fontSize: "0.8rem" }}>
            <Skeleton width="90%" />
          </Card.Text>
        </Card>

        {/* Seller Information */}
        <Card className="my-3 p-2">
          <Card.Text style={{ fontSize: "1rem", fontWeight: "bold" }}>
            <Skeleton variant="rounded" width="35%" height={30} />
          </Card.Text>
          <div className="d-flex gap-3 w-100">
            <Skeleton variant="circular" width="35%" height={50} />
            <div className="d-flex flex-column justify-content-center align-items-start gap-1 w-100">
              <Card.Text className="m-0">
                <Skeleton variant="rounded" width={100} height={20} />
              </Card.Text>
              <Skeleton variant="rounded" width={130} height={20} />
            </div>
            <div className="mx-auto d-flex justify-content-start align-items-center w-100">
              <Skeleton variant="rounded" width="80%" height={40} />
            </div>
          </div>
          <div className="d-flex gap-3 my-3">
            <Skeleton variant="circular" width="17%" height={50} />
            <div className="d-flex flex-column justify-content-center align-items-start w-100">
              <Card.Text className="m-0 w-100">
                <Skeleton variant="rounded" width="70%" height={20} />
              </Card.Text>
            </div>
          </div>
        </Card>

        {/* Map Reference */}
        <Card className="my-3 p-2">
          <Card.Text style={{ fontSize: "1rem", fontWeight: "bold" }}>
            <Skeleton variant="text" width="30%" height={40} />
          </Card.Text>
          <Skeleton variant="rectangular" width="100%" height={200} />
          <Skeleton variant="text" width="20%" height={30} />
          <Skeleton variant="text" width="40%" height={20} />
        </Card>
      </Col>
    </Row>
  );
};

export default memo(ItemDetailContainerSkeleton);
