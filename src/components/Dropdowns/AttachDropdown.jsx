import React, { useEffect, useRef } from "react";
import {
  Button,
  Form,
  NavDropdown,
} from "react-bootstrap";
import "./AttachDropdown.css";
import { FaFile, FaImage } from "react-icons/fa";
import { RiAttachmentLine } from "react-icons/ri";
import {
  clearMessageState,
  sendAttachments,
} from "../../../stores/Message/MessageSlice";
import { useDispatch, useSelector } from "react-redux";
import { useToastContext } from "../../../Hooks/ToastContextHook";
import { FiUploadCloud } from "react-icons/fi";

const AttachDropdown = ({
  handleClose,
  handleToggle,
  show,
  chatId,
  handleOffcanvasShow,
}) => {
  const dropdownRef = useRef(null);
  const fileRef = useRef(null);
  const imageRef = useRef(null);
  const { toastType, showToast } = useToastContext();
  const dispatch = useDispatch();

  const fileChangeHandler = async (e, key) => {
    const files = Array.from(e.target.files);

    if (files.length <= 0) return;

    if (files.length > 5) {
      toastType.current = {
        severity: "error",
        summary: "Error",
        detail: `You can only send 5 ${key} at a time`,
      };
      return showToast("top-left");
    }
    dispatch(clearMessageState());
    handleClose();
    try {
      const data = new FormData();

      data.append("chatId", chatId);
      files.forEach((file) => data.append("attachments", file));

      dispatch(sendAttachments(data));

      // Fetching Here
    } catch (error) {
      toastType.current = {
        severity: "error",
        summary: "Error",
        detail: error.message,
      };
      showToast("top-left");
    }
  };

  const selectImage = (e) => {
    imageRef.current.click();
    // sendAttachments()
    handleClose();
  };

  const selectFile = () => {
    fileRef.current.click();
    handleClose();
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      handleClose();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div ref={dropdownRef} className={`attach-dropdown-container`}>
        <Button
          variant="primary"
          className="attachment-button"
          onClick={handleToggle} // Attach onClick to the Button
        >
          <RiAttachmentLine
            style={{
              fontSize: "1.4rem",
              color: "black",
              marginRight: "0.3rem",
            }}
          />
        </Button>
        <NavDropdown
          show={show}
          id="navbarScrollingDropdown"
          align="end"
          className={`attach-dropdown ${
            show ? "slide-in-up" : "slide-out-down"
          }`}
          bsPrefix="custom-dropdown"
        >
          <div
            style={{ width: "100%", padding: "5px", cursor: "pointer" }}
            onClick={selectFile}
          >
            <FaFile
              style={{
                fontSize: "1.4rem",
                color: "black",
                marginRight: "0.3rem",
              }}
            />{" "}
            File
            <Form.Control
              type="file"
              multiple
              ref={fileRef}
              onChange={(e) => fileChangeHandler(e, "File")}
              style={{ display: "none" }}
            />
          </div>
          <div
            style={{ width: "100%", padding: "5px", cursor: "pointer" }}
            onClick={selectImage}
          >
            <FaImage
              style={{
                fontSize: "1.4rem",
                color: "black",
                marginRight: "0.3rem",
              }}
            />{" "}
            Image / Video
            <Form.Control
              type="file"
              multiple
              ref={imageRef}
              accept="image/*, video/*"
              onChange={(e) => fileChangeHandler(e, "Media")}
              style={{ display: "none" }}
            />
          </div>
          <div
            style={{ width: "100%", padding: "5px", cursor: "pointer" }}
            onClick={handleOffcanvasShow}
          >
            <FiUploadCloud
              style={{
                fontSize: "1.4rem",
                color: "black",
                marginRight: "0.3rem",
              }}
            />{" "}
            Send your item
          </div>
        </NavDropdown>
      </div>
    </>
  );
};

export default AttachDropdown;
