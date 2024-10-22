import { Box, Typography } from "@mui/material";
import React, { memo, useEffect, useState } from "react";
import moment from "moment";
import RenderAttachment from "./RenderAttachment";
import { fileFormat } from "../../../Helpers/PreventScroll";
import { NODE_APP_URL } from "../../../config/app_config";
import WishListItemCard from "./WishListItemCard";
import { Badge, Button, ButtonGroup, Col, Row } from "react-bootstrap";
import { RiMessengerLine } from "react-icons/ri";
import { FaAnglesLeft, FaAngleRight, FaAnglesRight } from "react-icons/fa6";
import { useSweetAlert } from "../../../Hooks/AlertHooks";
import { useDynamicToast } from "../../../Hooks/DynamicToastHook";
import { useDispatch, useSelector } from "react-redux";
import { denyProposal, makeSwap } from "../../../stores/Message/MessageSlice";
import { useToastContext } from "../../../Hooks/ToastContextHook";
import { height } from "@mui/system";
import ChatReplyItemCard from "./ChatReplyItemCard";

// Hooks/AlertHooks.js
const MessageComponent = ({
  message,
  user,
  setPreviewData,
  handlePreviewOpen,
  handleOffcanvasShow,
  chatId,
  setProposalIds,
}) => {
  const {
    sender_id,
    content,
    attachments = [],
    item_id = [],
    createdAt,
    _id,
    proposal_status,
  } = message;

  const sameSender = sender_id?._id === user?.id;

  const dispatch = useDispatch();

  const timeAgo = moment(createdAt).fromNow();

  const handleClickOpen = (data) => {
    setPreviewData(data);
    handlePreviewOpen();
  };

  const handleProposalClick = (id) => {
    handleOffcanvasShow();
    setProposalIds([id]);
  };

  const { confirmDialog, showCancelledMessage, MySwal } = useSweetAlert();

  const handleProposalDeny = async () => {
    const result = await confirmDialog({});
    if (result.isConfirmed) {
      await dispatch(denyProposal({ values: { chatId }, id: _id }));
    } else if (result.dismiss === MySwal.DismissReason.cancel) {
      showCancelledMessage();
    }
  };

  const handleProposalAccept = async (items) => {
    const result = await confirmDialog({});
    if (result.isConfirmed) {
      await dispatch(makeSwap({ data: { items, id: _id, chatId } }));
    } else if (result.dismiss === MySwal.DismissReason.cancel) {
      showCancelledMessage();
    }
  };

  const ProposeItemButton = ({ id }) => {
    return (
      <>
        {sameSender ? (
          <></>
        ) : (
          <ButtonGroup className="action-buttons">
            <Button
              variant="light"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                alignContent: "center",
                gap: "10px",
              }}
              onClick={() => handleProposalClick(id)}
            >
              <RiMessengerLine style={{ fontSize: "1.4rem" }} />
              Propose Your Item
            </Button>
          </ButtonGroup>
        )}
      </>
    );
  };

  return (
    <>
      {content && !item_id?.length && (
        <>
          <div className={`message ${sameSender ? "sender" : "recipient"}`}>
            <div className="message-content">
              <div style={{ padding: "16px" }}>
                <pre>{content}</pre>
                <div
                  className={`d-flex ${
                    sameSender ? "justify-content-end" : "justify-content-start"
                  } align-items-center align-content-center`}
                >
                  <Typography
                    className={`${sameSender ? "sender" : "recipient"}`}
                    variant="caption"
                    style={{
                      opacity: "0.5",
                    }}
                  >
                    {timeAgo}
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {attachments.length > 0 &&
        attachments.map((attachment, index) => {
          const file = fileFormat(attachment);
          let path =
            attachment && attachment.startsWith("http")
              ? attachment
              : `${NODE_APP_URL}/uploads/chats/${attachment}`;

          return (
            <div
              className={`message ${sameSender ? "sender" : "recipient"}`}
              key={index}
            >
              <div
                className="attachment-content"
                onClick={() =>
                  handleClickOpen({ file, path, attachment, sameSender })
                }
              >
                {RenderAttachment(file, path, attachment, sameSender)}
                <div
                  className={`d-flex ${
                    sameSender ? "justify-content-end" : "justify-content-start"
                  } align-items-center align-content-center`}
                >
                  <Typography
                    className={`${sameSender ? "sender" : "recipient"}`}
                    variant="caption"
                    style={{
                      opacity: "0.5",
                    }}
                  >
                    {timeAgo}
                  </Typography>
                </div>
              </div>
            </div>
          );
        })}

      {content?.length !== 0 && item_id?.length === 1 && (
        <div className={`message ${sameSender ? "sender" : "recipient"}`}>
          <div className="message-content">
            <ChatReplyItemCard
              item={item_id[0]}
              classNames={`${sameSender ? "sender" : "recipient"}`}
            />
            <div style={{ padding: "16px" }}>
              <pre>{content}</pre>
              <div
                className={`d-flex ${
                  sameSender ? "justify-content-end" : "justify-content-start"
                } align-items-center align-content-center`}
              >
                <Typography
                  className={`${sameSender ? "sender" : "recipient"}`}
                  variant="caption"
                  style={{
                    opacity: "0.5",
                  }}
                >
                  {timeAgo}
                </Typography>
              </div>
            </div>
          </div>
        </div>
      )}

      {item_id?.length === 1 && !content.length && (
        <div className={`message ${sameSender ? "sender" : "recipient"}`}>
          <div className="attachment-content">
            <WishListItemCard
              item={item_id[0]}
              ProposeItemButton={ProposeItemButton}
            />
            <div
              className={`d-flex ${
                sameSender ? "justify-content-end" : "justify-content-start"
              } align-items-center align-content-center`}
            >
              <Typography
                className={`${sameSender ? "sender" : "recipient"}`}
                variant="caption"
                style={{
                  opacity: "0.5",
                }}
              >
                {timeAgo}
              </Typography>
            </div>
          </div>
        </div>
      )}

      {item_id?.length === 2 && !content?.length && (
        <div>
          <div className="swap-card-container">
            <Row className="d-flex justify-content-center align-content-center align-items-center">
              <Col
                xs={12}
                md={4}
                className={`${
                  user?.id === item_id[0]?.user_id?._id ? "order-1" : "order-3"
                }`}
              >
                <WishListItemCard
                  item={item_id[0]}
                  ProposeItemButton={() => <></>}
                />
              </Col>

              <Col
                xs={12}
                md={4}
                className={`text-center d-flex justify-content-center align-content-center align-items-center chat-swap-btn-container order-2
                  ${proposal_status === "deny" && "border-danger-subtle"} 
                  ${proposal_status === "sold" && "border-success-subtle"}`}
              >
                {proposal_status ? (
                  <>
                    {proposal_status === "deny" && (
                      <Badge
                        pill
                        bg="danger"
                        style={{
                          transform: "rotate(-40deg)",
                        }}
                        className="px-5 status-badge"
                      >
                        DENIED
                      </Badge>
                    )}

                    {proposal_status === "sold" && (
                      <Badge
                        pill
                        bg="success"
                        style={{
                          transform: "rotate(40deg)",
                        }}
                        className="px-5 status-badge"
                      >
                        SWAPPED
                      </Badge>
                    )}
                  </>
                ) : (
                  <>
                    {!sameSender && (
                      <>
                        <Button
                          size="sm"
                          variant="success"
                          className="chat-swap-btn text-center d-flex justify-content-between align-content-center align-items-center"
                          onClick={() =>
                            handleProposalAccept([
                              item_id[0]._id,
                              item_id[1]._id,
                            ])
                          }
                        >
                          <FaAnglesLeft />
                          SWAP
                          <FaAnglesRight />
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          className="chat-swap-btn text-center d-flex justify-content-between align-content-center align-items-center"
                          onClick={handleProposalDeny}
                        >
                          <FaAnglesRight />
                          DENY
                          <FaAnglesLeft />
                        </Button>
                      </>
                    )}
                  </>
                )}
              </Col>

              <Col
                xs={12}
                md={4}
                className={`${
                  user?.id === item_id[1]?.user_id?._id ? "order-1" : "order-3"
                }`}
              >
                <WishListItemCard
                  item={item_id[1]}
                  ProposeItemButton={() => <></>}
                />
              </Col>
            </Row>
          </div>
          <div
            className={`d-flex ${
              sameSender ? "justify-content-end" : "justify-content-start"
            } align-items-center align-content-center`}
          >
            <Typography
              className={`${sameSender ? "sender" : "recipient"}`}
              variant="caption"
              style={{
                opacity: "0.5",
              }}
            >
              {timeAgo}
            </Typography>
          </div>
        </div>
      )}
    </>
  );
};

export default MessageComponent;
