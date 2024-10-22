import React, { useState } from "react";
import { Container, Row, Col, Breadcrumb, Tabs, Tab } from "react-bootstrap";
import { CSSTransition } from "react-transition-group";
import { Skeleton } from "@mui/material"; // Import Skeleton
import { useMediaQuery } from "@mui/system";
import { useNavigate, useParams } from "react-router-dom";
import ProfileSidebarSkeleton from "./Layout/ProfileSidebarSkeleton";
import VerticalItemCardSkeleton from "./Cards/VerticalItemCardSkeleton";
import WishListItemCardSkeleton from "./Cards/WishListItemCardSkeleton";
import "../../../Pages/Profile.css";
import EditProfileForm from "../Forms/EditProfileForm";
import EditProfileFormSkeleton from "./Forms/EditProfileFormSkeleton";

const ProfileSkeleton = () => {
  const [editMode, setEditMode] = useState(false);
  const handleEditModeOn = () => setEditMode(true);
  const handleEditModeOff = () => setEditMode(false);

  const navigate = useNavigate();
  const { id } = useParams();

  const [activeTab, setActiveTab] = useState("ITEMS");

  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleTabSelect = (key) => setActiveTab(key);

  return (
    <Container fluid>
      <Breadcrumb>
        <Breadcrumb.Item href="#" onClick={() => navigate("/")}>
          Home
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Profile</Breadcrumb.Item>
      </Breadcrumb>
      <Row>
        {/* Profile Sidebar */}
        <Col
          xs={12}
          sm={6}
          md={6}
          lg={3}
          className={`d-flex flex-column align-items-center p-3 ${
            id ? (isMobile ? "order-1" : "order-2") : "order-1"
          }`}
          style={{ borderRight: "1px solid rgb(var(--color-black)))" }}
        >
          <ProfileSidebarSkeleton
            editMode={editMode}
            handleEditModeOff={handleEditModeOff}
            handleEditModeOn={handleEditModeOn}
          />
        </Col>

        {/* Main Content */}
        <Col
          xs={12}
          sm={6}
          md={6}
          lg={9}
          className={`${id ? (isMobile ? "order-2" : "order-1") : "order-2"}`}
        >
          <Container className="edit-profile-container" fluid>
            {!id && (
              <CSSTransition
                in={editMode}
                timeout={300}
                classNames="fade"
                unmountOnExit
              >
                <EditProfileFormSkeleton singleData={{}} />
              </CSSTransition>
            )}

            <CSSTransition
              in={!editMode}
              timeout={300}
              classNames="fade"
              unmountOnExit
            >
              <>
                <Container>
                  <Tabs
                    activeKey={activeTab}
                    onSelect={handleTabSelect}
                    defaultActiveKey="ITEMS"
                    className="mb-3"
                    fill
                  >
                    <Tab
                      eventKey="ITEMS"
                      title={
                        <Skeleton
                          width={"100%"}
                          height={50}
                          variant="rounded"
                        />
                      }
                    >
                      <Row style={{ marginTop: "20px", width: "100%" }}>
                        {Array(4)
                          .fill()
                          .map((_, i) => (
                            <Col
                              key={i}
                              xs={4}
                              sm={6}
                              md={6}
                              lg={3}
                              className="mb-4"
                            >
                              <VerticalItemCardSkeleton />
                            </Col>
                          ))}
                      </Row>
                    </Tab>

                    {!id && (
                      <Tab
                        eventKey="WISHLIST"
                        title={
                          <Skeleton
                            width={"100%"}
                            height={50}
                            variant="rounded"
                          />
                        }
                      >
                        <CSSTransition
                          in={activeTab === "WISHLIST"}
                          timeout={500}
                          classNames="slide"
                          unmountOnExit
                        >
                          <Row>
                            {Array(2)
                              .fill()
                              .map((_, i) => (
                                <Col key={i} md={12} lg={6} className="mb-4">
                                  <WishListItemCardSkeleton />
                                </Col>
                              ))}
                          </Row>
                        </CSSTransition>
                      </Tab>
                    )}
                  </Tabs>
                </Container>
              </>
            </CSSTransition>
          </Container>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfileSkeleton;
