import { Skeleton } from "@mui/material";
import React, { memo } from "react";
import { Col, Container, Row } from "react-bootstrap";
import "../../layouts/ProfileSidebar.css";
import { useLocation, useParams } from "react-router-dom";

const ProfileSidebarSkeleton = ({
  editMode,
  handleEditModeOff,
  handleEditModeOn,
}) => {
  const location = useLocation();
  const { id } = useParams();

  return (
    <>
      <Skeleton
        variant="circular"
        width={200}
        height={200}
        className="mb-3"
        animation="wave"
      />
      <div className="d-flex justify-content-center align-content-center align-items-center text-center flex-column">
        <Skeleton variant="text" width={150} height={30} className="mb-2" />
        <Skeleton variant="text" width={250} height={20} className="mb-2" />
        <Skeleton variant="text" width={200} height={20} className="mb-3" />

        <Container className="stats-display mb-3">
          <Row>
            <Col className="stat-item">
              <Skeleton
                variant="text"
                width={60}
                height={20}
                className="mb-1"
              />
              <Skeleton variant="text" width={40} height={30} />
            </Col>
            <Col className="divider">|</Col>
            <Col className="stat-item">
              <Skeleton
                variant="text"
                width={60}
                height={20}
                className="mb-1"
              />
              <Skeleton variant="text" width={40} height={30} />
            </Col>
            <Col className="divider">|</Col>
            <Col className="stat-item">
              <Skeleton
                variant="text"
                width={60}
                height={20}
                className="mb-1"
              />
              <Skeleton variant="text" width={40} height={30} />
            </Col>
          </Row>
        </Container>
        {/* {location.pathname.startsWith("/profile") && ( */}
          <>
            {!id && (
              <>
                {editMode ? (
                  <Skeleton
                    variant="rectangular"
                    width={250}
                    height={40}
                    onClick={handleEditModeOff}
                  />
                ) : (
                  <Skeleton
                    variant="rectangular"
                    width={250}
                    height={40}
                    onClick={handleEditModeOn}
                  />
                )}
              </>
            )}
          </>
        {/* )} */}
      </div>
    </>
  );
};

export default memo(ProfileSidebarSkeleton);
