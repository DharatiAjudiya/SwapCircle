import React from "react";
import { Button, Col, Container, Image, Row } from "react-bootstrap";
import { FaRegEdit } from "react-icons/fa";
import { FaEye } from "react-icons/fa6";
import "./ProfileSidebar.css";
import { useLocation, useParams } from "react-router-dom";

const ProfileSidebar = ({
  profile,
  singleData,
  editMode,
  handleEditModeOn,
  handleEditModeOff,
}) => {
  const location = useLocation();
  const { id } = useParams();

  return (
    <>
      <Image
        src={profile}
        fluid
        thumbnail
        roundedCircle
        className="mb-3"
        style={{ objectFit: "contain", width: "200px", height: "200px" }}
      />
      <div className="d-flex justify-content-center align-content-center align-items-center text-center flex-column">
        <h5 className="text-dark">{singleData?.username}</h5>
        <p className="text-dark">Email: {singleData?.email}</p>
        <p className="text-dark">
          Phone: {singleData?.phone_number && `+61 ${singleData?.phone_number}`}
        </p>
        <Container className="stats-display mb-3">
          <Row>
            <Col className="stat-item">
              <div className="stat-title points-title">points</div>
              <div className="stat-value points-value">
                {singleData?.points}
              </div>
            </Col>
            <Col className="divider">|</Col>
            <Col className="stat-item">
              <div className="stat-title badge-title">badge</div>
              <div className="stat-value badge-value">{singleData?.badges}</div>
            </Col>
            <Col className="divider">|</Col>
            <Col className="stat-item">
              <div className="stat-title level-title">level</div>
              <div className="stat-value level-value">{singleData?.level}</div>
            </Col>
          </Row>
        </Container>
        {location.pathname.startsWith("/profile") && (
          <>
            {!id && (
              <>
                {editMode ? (
                  <Button
                    variant="outline-dark"
                    className="d-flex justify-content-center align-content-center align-items-center edit-profile-btn"
                    onClick={handleEditModeOff}
                  >
                    <FaEye
                      style={{ fontSize: "1.5rem", marginRight: "0.5rem" }}
                    />{" "}
                    View Collection
                  </Button>
                ) : (
                  <Button
                    variant="outline-dark"
                    className="d-flex justify-content-center align-content-center align-items-center edit-profile-btn"
                    onClick={handleEditModeOn}
                  >
                    <FaRegEdit
                      style={{ fontSize: "1.5rem", marginRight: "0.5rem" }}
                    />{" "}
                    Edit Profile
                  </Button>
                )}
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default ProfileSidebar;
