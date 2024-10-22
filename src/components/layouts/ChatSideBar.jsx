import React, { useState } from "react";
import {
  Col,
  ListGroup,
  Image,
  Badge,
  Offcanvas,
  Button,
} from "react-bootstrap";
import "./ChatSideBar.css";
import { NODE_APP_URL } from "../../../config/app_config";
import { useNavigate } from "react-router-dom";
import { FaHouseMedicalCircleExclamation } from "react-icons/fa6";
import ChatListSkeleton from "../Skeletons/Cards/ChatListSkeleton";
import ChatSideBarSkeleton from "../Skeletons/Layout/ChatSideBarSkeleton";

const ChatSidebar = ({
  chats = [],
  chatId,
  onlineUsers = [],
  newMessagesAlert = [
    {
      chatId: "",
      count: 0,
    },
  ],
  loading,
}) => {
  const navigate = useNavigate();
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const handleClose = () => setShowOffcanvas(false);
  const handleShow = () => setShowOffcanvas(true);

  const ChatList = (
    <ListGroup variant="flush">
      {loading ? (
        <ChatListSkeleton />
      ) : (
        <>
          {chats.map((data, index) => {
            const { profile, _id, name, members_id } = data;

            const newMessageAlert = newMessagesAlert.find(
              ({ chatId }) => chatId === _id
            );
            const isOnline = members_id?.some((member) =>
              onlineUsers.includes(member)
            );
            const sameSender = chatId === _id;

            return (
              <ListGroup.Item
                key={index}
                className={`message-item ${sameSender ? "selected" : ""}`}
                onClick={() => {
                  navigate(`/chat?chatId=${_id}`);
                  if (showOffcanvas) {
                    handleClose();
                  }
                }}
              >
                <Image
                  src={
                    profile && profile?.startsWith("http")
                      ? profile
                      : `${NODE_APP_URL}/uploads/users/${profile}`
                  }
                  roundedCircle
                  className="message-avatar"
                />
                <div className="message-info">
                  <strong>{name}</strong>
                  {isOnline ? (
                    <div className="message-date">ONLINE</div>
                  ) : (
                    <div className="message-date">OFFLINE</div>
                  )}
                </div>
                {newMessageAlert && (
                  <Badge pill bg="success">
                    {newMessageAlert.count}
                  </Badge>
                )}
              </ListGroup.Item>
            );
          })}
        </>
      )}
    </ListGroup>
  );

  return (
    <>
      {loading ? (
        <ChatSideBarSkeleton />
      ) : (
        <>
          <Col md={2} className="chat-sidebar d-none d-md-block">
            <h5 className="chat-sidebar-title">All Messages</h5>
            {ChatList}
          </Col>

          {/* Offcanvas for screens <= 768px */}
          <Button
            variant="outline-dark"
            onClick={handleShow}
            className="d-md-none chat-toggle-btn"
          >
            View Chats
          </Button>

          <Offcanvas
            show={showOffcanvas}
            onHide={handleClose}
            className="chat-offcanvas"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>All Messages</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>{ChatList}</Offcanvas.Body>
          </Offcanvas>
        </>
      )}
    </>
  );
};

export default ChatSidebar;
