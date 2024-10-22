import React, { useState, useEffect } from "react";
import { Card, Image, Container } from "react-bootstrap";
import { Rating } from "@mui/material";
import { motion } from "framer-motion";
import "./ProfileCard.css";
import { NODE_APP_URL } from "../../../config/app_config";
import { useNavigate } from "react-router-dom";

const ProfileCard = ({ topUsers }) => {
  const [isInView, setIsInView] = useState(false);
  const navigate = useNavigate();
  // Intersection observer to detect when the section is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
          }
        });
      },
      { threshold: 0.5 } // Increased threshold for a later trigger
    );

    const section = document.querySelector("#profile-section");
    if (section) observer.observe(section);

    return () => {
      if (section) observer.unobserve(section);
    };
  }, []);

  const renderCard = (user, index) => {
    // Define different animations and styles based on the index
    const positionStyles = [
      { initial: { opacity: 0, x: -100 }, delay: 0.2, order: 1 }, // Left
      { initial: { opacity: 0, y: -100 }, delay: 0.4, order: 0 }, // Center
      { initial: { opacity: 0, x: 100 }, delay: 0.6, order: 2 }, // Right
    ];

    const isMainCard = index === 0;

    return (
      <motion.div
        key={index}
        initial={positionStyles[index]?.initial}
        animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
        transition={{ duration: 1, delay: positionStyles[index]?.delay }}
        className={`order-${positionStyles[index]?.order}`}
      >
        <Card
          className={`leader-card ${isMainCard ? "main-card" : "lower-card"}`}
        >
          <div className="position-absolute image-box">
            <Card.Img
              variant="top"
              src={
                user?.profile && user?.profile.startsWith("http")
                  ? user?.profile
                  : `${NODE_APP_URL}/uploads/users/${user?.profile}`
              }
              className={`rounded-circle border border-3 ${
                isMainCard
                  ? "border-warning"
                  : index === 2
                  ? "border-success"
                  : "border-danger"
              }`}
            />
            <div
              className={`badge-circle bg-${
                isMainCard ? "warning" : index === 2 ? "success" : "danger"
              }`}
            >
              {index + 1}
            </div>
          </div>
          <Card.Body className="mt-3 pb-0 px-0">
            <Card.Title className="profile-card-title" onClick={() => navigate(`/user/profile/${user?._id}`)}>
              {user?.username}
            </Card.Title>
            <Card.Text className="text-warning score">{user?.points}</Card.Text>
            <Rating
              size="large"
              value={parseFloat(user?.average_rating)}
              precision={0.5}
              readOnly
            />
            <div className="description m-0">
              <Card.Text className="text-muted">
                Currently on level {user?.level}
              </Card.Text>
              {parseFloat(user?.level) > 3 && (
                <Image
                className="badge-img"
                  src="/images/gold.webp"
                  alt="Gold"
                />
              )}
              {parseFloat(user?.level) === 3 && (
                <Image
                className="badge-img"
                  src="/images/silver.webp"
                  alt="Silver"
                />
              )}
              {parseFloat(user?.level) < 3 && (
                <Image
                className="badge-img"
                  src="/images/bronze.webp"
                  alt="Bronze"
                />
              )}
              <Card.Text className="text-muted">
                Holds {user?.badges} badges
              </Card.Text>
            </div>
          </Card.Body>
        </Card>
      </motion.div>
    );
  };

  return (
    <Container
      id="profile-section"
      className="text-center py-5"
      style={{
        marginTop: "10px",
        backgroundImage: isInView ? "url('/images/leaderboard_background.svg')" : "none",
        transition: "background-image 1s ease-in-out", // Smooth transition for the background
        boxShadow: "15px 15px 15px rgba(0, 0, 0, 0.2)",
      }}
    >
      {/* Animate the whole section sliding from the top */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1 }}
      >
        <Container>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginLeft: "2rem",
            }}
          >
            <h1 className="text-white" style={{ marginRight: "auto" }}>
              Leaderboard Toppers
            </h1>
          </div>
        </Container>
        <div
          className="d-flex flex-sm-row flex-column justify-content-center align-items-center topUser-container"
        >
          {topUsers.map((user, index) => renderCard(user, index))}
        </div>
      </motion.div>
    </Container>
  );
};

export default ProfileCard;
