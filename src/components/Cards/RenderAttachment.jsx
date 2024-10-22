import React from "react";
import { Image } from "react-bootstrap";
import { FcFile } from "react-icons/fc";

const RenderAttachment = (file, path, name, sameSender) => {
  switch (file) {
    case "video":
      return (
        <video
          src={path}
          preload="none"
          className="attachment-placeholder"
          controls
        />
      );

    case "image":
      return (
        <Image src={path} className="attachment-placeholder" alt="Attachment" />
      );

    default:
      return (
        <>
          <div
            className={`d-flex flex-column ${
              sameSender
                ? "justify-content-end align-items-end align-content-end"
                : "justify-content-start align-items-start align-content-start"
            }`}
          >
            <FcFile style={{ fontSize: "8rem" }} />
            <h6>{name}</h6>
          </div>
        </>
      );
  }
};

export default RenderAttachment;
