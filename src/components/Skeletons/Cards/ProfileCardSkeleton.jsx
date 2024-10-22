import { Skeleton } from "@mui/material";
import React, { memo } from "react";
import { Container } from "react-bootstrap";

const ProfileCardSkeleton = () => {
  return (
    <Container
      id="profile-section"
      className="text-center py-5"
      style={{
        marginTop: "10px",
        transition: "background-image 1s ease-in-out", // Smooth transition for the background
        boxShadow: "15px 15px 15px rgba(0, 0, 0, 0.2)",
      }}
    >
      <Container>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginLeft: "2rem",
          }}
        >
          <Skeleton width={200} height={40} />
        </div>
      </Container>

      <div className="d-flex flex-sm-row flex-column justify-content-center align-items-center topUser-container">
        {Array(4) // Adjust the number according to your requirements
          .fill()
          .map((_, index) => (
            <div key={index} style={{ margin: "1rem" }}>
              <Skeleton variant="rectangular" width={150} height={200} />
              <Skeleton
                variant="text"
                width={150}
                height={20}
                style={{ marginTop: "0.5rem" }}
              />
            </div>
          ))}
      </div>
    </Container>
  );
};

export default memo(ProfileCardSkeleton);
