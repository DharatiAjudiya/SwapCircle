import { Skeleton } from "@mui/material";
import React, { memo } from "react";
import { ListGroup } from "react-bootstrap";

const ChatListSkeleton = () => {
  return (
    <>
      {Array(2)
        .fill()
        .map((_, index) => (
          <ListGroup.Item
            key={index}
            className="message-item d-flex flex-row gap-2"
          >
            <Skeleton
              variant="circular"
              width={50}
              height={50}
              className="message-avatar"
            />
            <div className="message-info">
              <Skeleton width={120} height={20} />
              <Skeleton width={60} height={15} />
            </div>
          </ListGroup.Item>
        ))}
    </>
  );
};

export default memo(ChatListSkeleton);
