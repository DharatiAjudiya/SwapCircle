import React, { memo } from "react";
import { Col, Form, Container, Card, Row } from "react-bootstrap";
import { Divider, Skeleton } from "@mui/material";
import "../../../../src/components/Forms/EditProfileForm.css";

const EditProfileFormSkeleton = () => {
  return (
    <Container>
      <Card>
        <Card.Header>
          <Skeleton variant="text" width="20%" height={60} />
        </Card.Header>
        <Form className="edit-profile-form">
          <Card.Body>
            <Row>
              {/* Left Part: Input Fields */}
              <Col md={5}>
                <Skeleton variant="text" width="60%" height={30} />

                <Skeleton variant="text" width="100%" height={60} />
                <Skeleton variant="text" width="100%" height={120} />

                <Divider className="my-4 text-dark bg-dark" />

                <Skeleton variant="text" width="60%" height={30} />

                <Skeleton variant="text" width="100%" height={60} />
                <Skeleton variant="text" width="100%" height={60} />
              </Col>

              {/* Vertical Divider */}
              <Col
                md={1}
                className="d-flex align-items-center justify-content-center"
              >
                <Divider
                  orientation="vertical"
                  flexItem
                  className="my-4 text-dark bg-dark"
                />
              </Col>

              {/* Right Part: Image and Upload Button */}
              <Col md={6} className="d-flex flex-column">
                <Skeleton
                  variant="text"
                  width="40%"
                  height={30}
                  sx={{ mb: 2 }}
                />
                <Row className="image-container">
                  <Col xs="auto">
                    <div className="image-box-container">
                      <Skeleton
                        variant="circular"
                        width={150}
                        height={150}
                        className="image-box-image"
                      />
                    </div>
                  </Col>
                  <Col>
                    <Skeleton variant="rectangular" width="100%" height={160} />
                  </Col>
                </Row>
                <Divider className="my-4 text-dark bg-dark" />
              </Col>
            </Row>
          </Card.Body>
          <Card.Footer className="d-flex justify-content-between mb-3">
            <Skeleton variant="rectangular" width="10%" height={40} />
            <Skeleton variant="rectangular" width="20%" height={40} />
          </Card.Footer>
        </Form>
      </Card>
    </Container>
  );
};

export default memo(EditProfileFormSkeleton);
