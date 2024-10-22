import React, { memo } from "react";
import ChatSideBarSkeleton from "./Skeletons/Layout/ChatSideBarSkeleton";
import "../../Pages/Chat.css";
import { Breadcrumb, Col, Container, Row } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { Skeleton } from "@mui/material";
import MessageComponentSkeleton from "./Skeletons/Cards/MessageComponentSkeleton";

const ChatSkeleton = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  let chatId = queryParams.get("chatId");

  return (
    <Container fluid className="chat-container">
      {/* Breadcrumb */}
      <Breadcrumb>
        <Breadcrumb.Item href="#" onClick={() => navigate("/")}>
          Home
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Chats</Breadcrumb.Item>
      </Breadcrumb>

      <Row>
        <ChatSideBarSkeleton />

        {/* Main Chat Area */}
        <Col md={10} className="chat-area">
          {chatId ? (
            <>
              {/* Chat Header */}

              <div className="chat-header d-flex align-items-center">
                <Skeleton variant="circular" width={50} height={50} />
                <Skeleton
                  width={150}
                  height={30}
                  style={{ marginLeft: "1rem" }}
                />
              </div>

              <div className="messages">
                {/* {Array(5)
                  .fill()
                  .map((_, i) => (
                    <Skeleton
                      key={i}
                      width="100%"
                      height={50}
                      style={{ marginBottom: "1rem" }}
                    />
                  ))} */}
                <MessageComponentSkeleton />
              </div>

              <div className="message-input d-flex align-items-center">
                <Skeleton width="100%" height={60} style={{borderRadius:"25px"}}/>
              </div>
            </>
          ) : (
            <Container className="d-flex justify-content-center align-items-center h-100">
              <Skeleton width={200} height={50} />
            </Container>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default memo(ChatSkeleton);
