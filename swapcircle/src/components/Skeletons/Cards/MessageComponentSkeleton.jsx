import { Skeleton } from "@mui/material";
import React, { memo } from "react";

const MessageComponentSkeleton = () => {
  return (
    <>
      <div className={`message sender`}>
        <div className="message-content">
          <div style={{ padding: "16px" }}>
            <Skeleton width={200} height={40} />
            <div
              className={`d-flex justify-content-end align-items-center align-content-center`}
            >
              <Skeleton width={80} height={20} />
            </div>
          </div>
        </div>
      </div>
      <div className={`message recipient`}>
        <div className="message-content">
          <div style={{ padding: "16px" }}>
            <Skeleton width={200} height={40} />
            <div
              className={`d-flex justify-content-start align-items-center align-content-center`}
            >
              <Skeleton width={80} height={20} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(MessageComponentSkeleton);
