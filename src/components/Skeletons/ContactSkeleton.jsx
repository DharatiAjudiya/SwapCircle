import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Breadcrumb,
} from "react-bootstrap";
import "../../../Pages/Contact.css"; // Import custom CSS
import { Skeleton } from "@mui/material";

const ContactSkeleton = () => {
  return (
    <Container fluid className="contact-container">
      <Breadcrumb>
        <Breadcrumb.Item href="#" onClick={() => navigate("/")}>
          Home
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Contact Us</Breadcrumb.Item>
      </Breadcrumb>

      <Container
        className="text-center"
        style={{
          marginBottom: "3rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Skeleton variant="text" sx={{}} width={300} height={56} />

        <Skeleton variant="text" width={500} height={23} />
      </Container>

      <Row className="align-items-center justify-content-center">
        <Col md={10} lg={8}>
          <Card className="contact-card">
            <Row>
              {/* Contact Information Section */}
              <Col
                md={5}
                className="d-flex justify-content-start align-items-center flex-column align-content-center discount-section"
              >
                <div className="discount-content my-auto">
                  <Skeleton
                    sx={{ bgcolor: "grey.900" }}
                    variant="text"
                    width={200}
                    height={40}
                  />

                  <Skeleton
                    sx={{ bgcolor: "grey.900" }}
                    variant="text"
                    width={250}
                    height={20}
                  />
                </div>

                <div className="my-auto contact-content">
                  <Skeleton
                    sx={{ bgcolor: "grey.900" }}
                    variant="text"
                    width={180}
                    height={20}
                  />

                  <Skeleton
                    sx={{ bgcolor: "grey.900" }}
                    variant="text"
                    width={180}
                    height={20}
                  />

                  <Skeleton
                    sx={{ bgcolor: "grey.900" }}
                    variant="text"
                    width={300}
                    height={40}
                  />
                </div>

                <div className="social-icons my-auto">
                  <Skeleton
                    sx={{ bgcolor: "grey.900" }}
                    variant="circular"
                    width={40}
                    height={40}
                  />

                  <Skeleton
                    sx={{ bgcolor: "grey.900" }}
                    variant="circular"
                    width={40}
                    height={40}
                  />

                  <Skeleton
                    sx={{ bgcolor: "grey.900" }}
                    variant="circular"
                    width={40}
                    height={40}
                  />

                  <Skeleton
                    sx={{ bgcolor: "grey.900" }}
                    variant="circular"
                    width={40}
                    height={40}
                  />
                </div>
              </Col>

              {/* Contact Form Section */}
              <Col md={7} className="contact-section">
                <div className="contact-box">
                  <div className="form-row">
                    <Form.Group controlId="firstname" className="form-column">
                      <Skeleton variant="text" width={150} height={30} />
                      <Skeleton
                        variant="rectangular"
                        width="100%"
                        height={50}
                      />
                    </Form.Group>
                    <Form.Group controlId="lastname" className="form-column">
                      <Skeleton variant="text" width={150} height={30} />
                      <Skeleton
                        variant="rectangular"
                        width="100%"
                        height={50}
                      />
                    </Form.Group>
                  </div>
                  <div className="form-row">
                    <Form.Group controlId="firstname" className="form-column">
                      <Skeleton variant="text" width={150} height={30} />
                      <Skeleton
                        variant="rectangular"
                        width="100%"
                        height={50}
                      />
                    </Form.Group>
                    <Form.Group controlId="lastname" className="form-column">
                      <Skeleton variant="text" width={150} height={30} />
                      <Skeleton
                        variant="rectangular"
                        width="100%"
                        height={50}
                      />
                    </Form.Group>
                  </div>
                  <div className="form-row">
                    <Form.Group controlId="firstname" className="form-column">
                      <Skeleton variant="text" width={150} height={30} />
                      <Skeleton
                        variant="rectangular"
                        width="100%"
                        height={30}
                      />
                    </Form.Group>
                  </div>
                  <div className="form-row">
                    <Form.Group controlId="firstname" className="form-column">
                      <Skeleton variant="text" width={150} height={30} />
                      <Skeleton
                        variant="rectangular"
                        width="100%"
                        height={60}
                      />
                    </Form.Group>
                  </div>
                  <div className="d-flex justify-content-end">
                    <Skeleton variant="rectangular" height={50} width={160} />
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ContactSkeleton;
