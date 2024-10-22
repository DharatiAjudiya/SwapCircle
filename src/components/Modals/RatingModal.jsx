import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Rating } from "@mui/material"; // MUI Rating
import { Button, Col, Form, Image, Row } from "react-bootstrap"; // React-Bootstrap components
import { useFormik } from "formik";
import * as Yup from "yup";
import "./RatingModal.css"; // Custom CSS file for styling
import { LoadingButton } from "@mui/lab";
import { FaRegSave } from "react-icons/fa";
import schema from "../../Schema/RatingSchema";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useToastContext } from "../../../Hooks/ToastContextHook";
import { clearUserState, RateUserApi } from "../../../stores/User/UserSlice";
import { NODE_APP_URL } from "../../../config/app_config";

const RatingModal = ({ userData, closeModal, visible, setVisible }) => {
  const { loading, message, status } = useSelector((state) => state.UserStore);
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(false);

  const { toastType, showToast } = useToastContext();
  useEffect(() => {
    setLoading(loading);
  }, [loading]);

  useEffect(() => {
    if (status == true) {
      toastType.current = {
        severity: "success",
        summary: "Success",
        detail: message,
      };
      showToast("top-right");
      dispatch(clearUserState());
      closeModal();
    } else if (status == false) {
      toastType.current = {
        severity: "error",
        summary: "Error",
        detail: message,
      };
      showToast("top-right");
      dispatch(clearUserState());
    }
    setLoading(false);
  }, [status]);

  const initialValues = {
    rating: 0,
    user_id: "",
    review: "",
  };

  // useFormik for handling form submission and validation
  const {
    values,
    errors,
    touched,
    handleSubmit,
    handleChange,
    handleBlur,
    setValues,
  } = useFormik({
    initialValues: initialValues,
    validationSchema: schema,
    onSubmit: (values) => {
      try {
        dispatch(RateUserApi({ values }));
        setVisible(false); // Close the modal on successful submission
      } catch (error) {
        console.error("Form submission error:", error);
      }
    },
  });

  useEffect(() => {
    setValues({
      ...values,
      user_id: userData?.members_id[0],
    });
  }, [userData?.members_id[0]]);

  return (
    <div className="card flex justify-content-center">
      <Dialog
        visible={visible}
        style={{ width: "50vw" }}
        onHide={() => setVisible(false)}
      >
        <div className="p-4 text-center">
          <h5 className="modal-subtitle">
            Please take a moment to rate and review...
          </h5>

          <Form noValidate onSubmit={handleSubmit}>
            <Row>
              <Col xs={12} md={5} className="d-flex justify-content-end">
                <Image
                  src={
                    userData?.profile && userData?.profile.startsWith("http")
                      ? userData?.profile
                      : `${NODE_APP_URL}/uploads/users/${userData?.profile}`
                  }
                  fluid
                  thumbnail
                  roundedCircle
                  className="mb-3"
                  style={{
                    objectFit: "contain",
                    width: "100px",
                    height: "100px",
                  }}
                />
              </Col>
              <Col
                xs={12}
                md={7}
                className="d-flex flex-column justify-content-center align-items-start"
              >
                <p className="modal-subtitle">{userData?.name}</p>
                {/* MUI Rating */}
                <Rating
                  name="rating"
                  value={values.rating}
                  onChange={handleChange}
                  precision={0.5}
                  size="large"
                  sx={{
                    "& .MuiRating-icon": {
                      fontSize: "3rem", // Increase the size of the rating stars
                    },
                  }}
                />
                {errors.rating && touched.rating && (
                  <div className="text-danger">{errors.rating}</div>
                )}
              </Col>
            </Row>

            {/* React-Bootstrap Form.Control for textarea */}
            <Form.Group controlId="reviewTextarea" className="my-3">
              <Form.Control
                as="textarea"
                rows={3}
                name="review"
                value={values.review}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Type review..."
                isInvalid={!!errors.review && touched.review}
              />
              <Form.Control.Feedback type="invalid">
                {errors.review}
              </Form.Control.Feedback>
            </Form.Group>

            {/* React-Bootstrap Button */}
            <LoadingButton
              loading={isLoading}
              size="small"
              loadingPosition="start"
              startIcon={<></>}
              variant="contained"
              type="submit"
              sx={{
                borderRadius: "0",
                padding: "6px 40px",
                fontWeight: "500",
                backgroundColor: "rgb(var(--color-primary))",
                border: "1px solid rgb(var(--color-black))",
                color: "rgb(var(--color-black))",

                "&:hover": {
                  backgroundColor: "rgb(var(--color-black))",
                  color: "rgb(var(--color-primary))",
                },
              }}
            >
              Submit
            </LoadingButton>
          </Form>
        </div>
      </Dialog>
    </div>
  );
};

export default RatingModal;
