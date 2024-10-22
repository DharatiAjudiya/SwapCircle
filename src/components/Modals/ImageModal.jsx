import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import RenderAttachment from "../Cards/RenderAttachment";
import { FaCloudDownloadAlt } from "react-icons/fa";
import { Button, Image } from "react-bootstrap";
import { width } from "@mui/system";
import { FcFile } from "react-icons/fc";

const ImageModal = ({ data, handleClose, open }) => {
  const handleDownload = () => {
    fetch(data?.path, {
      method: "GET",
    })
      .then((response) => {
        response.arrayBuffer().then(function (buffer) {
          const Url = window.URL.createObjectURL(new Blob([buffer]));
          const link = document.createElement("a");
          link.href = Url;
          let ext = data?.attachment.split(".").pop();
          link.setAttribute("download", `image.${ext}`); //or any other extension
          document.body.appendChild(link);
          link.click();
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className="card flex justify-content-center">
      <Dialog
        visible={open}
        style={{ width: "50vw", height: "100vh" }}
        onHide={() => {
          if (!open) return;
          handleClose();
        }}
      >
        {data?.file === "image" && (
          <Image
            style={{ width: "100%", height: "80%", objectFit: "contain" }}
            src={data?.path}
            alt="Attachment"
          />
        )}
        {data?.file === "video" && (
          <video src={data?.path} preload="none" controls />
        )}

        {!["image", "video"].includes(data?.file) && (
          <div
            className={`d-flex flex-column justify-content-center align-items-center align-content-center`}
          >
            <FcFile style={{ fontSize: "8rem" }} />
            <h6>{data?.attachment}</h6>
          </div>
        )}
        <div
          className={`d-flex  justify-content-center align-items-end align-content-end`}
        >
          <Button
            variant="outline-dark"
            className="download-btn mt-4"
            onClick={handleDownload}
          >
            <FaCloudDownloadAlt
              style={{ fontSize: "1.7rem", marginRight: "10px" }}
            />{" "}
            DOWNLOAD
          </Button>
        </div>
      </Dialog>
    </div>
  );
};

export default ImageModal;
