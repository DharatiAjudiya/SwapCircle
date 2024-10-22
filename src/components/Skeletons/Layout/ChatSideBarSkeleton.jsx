import React, { memo } from "react";
import ChatListSkeleton from "../Cards/ChatListSkeleton";
import { Skeleton } from "@mui/material";
import { Button, Col, ListGroup } from "react-bootstrap";

const ChatSideBarSkeleton = () => {
  return (
    <>
      <Col md={2} className="chat-sidebar d-none d-md-block">
        <h5 className="chat-sidebar-title">
          <Skeleton width={120} height={30} />
        </h5>
        <ListGroup variant="flush">
          <ChatListSkeleton />
        </ListGroup>
      </Col>
      <Skeleton width={80} height={30} className="d-md-none chat-toggle-btn" />
    </>
  );
};

export default memo(ChatSideBarSkeleton);
