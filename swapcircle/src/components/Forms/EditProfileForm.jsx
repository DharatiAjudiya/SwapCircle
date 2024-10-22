import { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import {
  Button,
  Col,
  Form,
  FloatingLabel,
  Container,
  Card,
  Image,
  Row,
  InputGroup,
} from "react-bootstrap";
import {
  FaRegSave,
  FaRegTrashAlt,
  FaEye,
  FaEyeSlash,
  FaCamera,
} from "react-icons/fa";
import LoadingButton from "@mui/lab/LoadingButton";
import { IconButton, Divider } from "@mui/material";
import schema from "../../Schema/editProfileSchema";
import { useLocation, useNavigate } from "react-router-dom";
import "./EditProfileForm.css";
import { numberInputOnWheelPreventChange } from "../../../Helpers/PreventScroll";
import demoProfileImg from "/images/demo-profile.jpg";

import {
  clearUserState,
  EditUserApi,
  GetSingleUserApi,
} from "../../../stores/User/UserSlice";
import { useDispatch, useSelector } from "react-redux";
import { useToastContext } from "../../../Hooks/ToastContextHook";
import { NODE_APP_URL } from "../../../config/app_config";

const EditProfileForm = ({ singleData = {}, closeModal = () => {} }) => {
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);
  const [passwordToggle, setPasswordToggle] = useState(true);
  const handleToggle = () => setPasswordToggle(!passwordToggle);
  const [isLoading, setLoading] = useState(false);

  const { loading, message, status } = useSelector((state) => state.UserStore);
  const location = useLocation();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // const { data } = useSelector((state) => state.AuthUserStore);
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
      if (
        location.pathname.startsWith("/admin") ||
        location.pathname.startsWith("/card")
      ) {
        closeModal();
      }
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
    username: "",
    address: "",
    email: "",
    phone_number: "",
    profile: null,
    old_password: "",
    new_password: "",
    confirm_password: "",
  };

  const {
    errors,
    values,
    handleChange,
    handleSubmit,
    validateForm,
    setValues,
    setFieldValue,
  } = useFormik({
    initialValues,
    validationSchema: schema,
    onSubmit: async (values) => {
      try {
        dispatch(EditUserApi({ values, id: singleData?._id }));
        dispatch(GetSingleUserApi({ id: singleData?._id }));
      } catch (error) {
        console.error("Form submission error:", error);
        setLoading(false);
        setImage(null);
      }
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file && String(file.type).startsWith("image/")) {
      setImage(URL.createObjectURL(file));
      setFieldValue("profile", file);
    } else {
      alert("Please upload a valid image file.");
    }
  };

  const handleDeleteImage = () => {
    setImage(null);
    setFieldValue("profile", null);
    fileInputRef.current.value = null;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const isFormValid = await validateForm();
    if (Object.keys(isFormValid).length !== 0) {
      setLoading(false);
      return;
    }
    handleSubmit(e);
  };

  const handleDiscard = () => {
    if (
      location.pathname.startsWith("/admin") ||
      location.pathname.startsWith("/card")
    ) {
      closeModal();
    } else {
      navigate(-1);
    }
  };
  //CHECKED
  useEffect(() => {
    if (singleData) {
      setValues((prev) => ({
        ...prev,
        username: singleData?.username || "",
        address: singleData?.address || "",
        email: singleData?.email || "",
        phone_number: singleData?.phone_number || "",
        profile: singleData?.profile || null,
      }));

      if (singleData?.profile) {
        let profile = singleData?.profile ? singleData?.profile : null;
        setImage(`${NODE_APP_URL}/uploads/users/${profile}`);
      }
    }
  }, [singleData]);

  useEffect(() => {
    if (singleData?.profile && singleData?.profile.startsWith("http")) {
      setImage(() =>
        singleData?.profile ? singleData?.profile : demoProfileImg
      );
    } else if (singleData?.profile) {
      setImage(() =>
        singleData?.profile
          ? `${NODE_APP_URL}/uploads/users/${singleData.profile}`
          : demoProfileImg
      );
    }
  }, [singleData?.social_platform, singleData?.profile]);

  return (
    <Container>
      <Card>
        <Card.Header>
          <h2>Edit Profile</h2>
        </Card.Header>
        <Form
          noValidate
          onSubmit={handleFormSubmit}
          method="post"
          className="edit-profile-form"
        >
          <Card.Body>
            <Row>
              {/* Left Part: Input Fields */}
              <Col md={5}>
                <h5>Basic Information</h5>
                <FloatingLabel
                  controlId="floatingInput"
                  label="Name"
                  className="mb-3"
                >
                  <Form.Control
                    type="text"
                    aria-label="username"
                    className="custom-input"
                    name="username"
                    size="lg"
                    value={values.username}
                    onChange={handleChange}
                    isInvalid={!!errors.username}
                    aria-describedby="basic-addon2"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.username}
                  </Form.Control.Feedback>
                </FloatingLabel>
                <FloatingLabel
                  controlId="floatingTextarea"
                  label="Address"
                  className="mb-3"
                >
                  <Form.Control
                    className="custom-input"
                    as="textarea"
                    value={values.address}
                    onChange={handleChange}
                    isInvalid={!!errors.address}
                    name="address"
                    style={{ height: "6.25rem" }}
                  />
                </FloatingLabel>
                <Form.Control.Feedback type="invalid">
                  {errors.address}
                </Form.Control.Feedback>

                <Divider className="my-4 text-dark bg-dark" />

                <h5>Contact Information</h5>
                <FloatingLabel
                  controlId="floatingInput"
                  label="Email"
                  className="mb-3"
                >
                  <Form.Control
                    aria-label="email"
                    className="custom-input"
                    name="email"
                    size="lg"
                    type="email"
                    value={values.email}
                    onChange={handleChange}
                    isInvalid={!!errors.email}
                    aria-describedby="basic-addon1"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </FloatingLabel>

                <FloatingLabel
                  controlId="floatingInput"
                  label="Phone"
                  className="mb-3"
                >
                  <Form.Control
                    aria-label="Phone"
                    className="custom-input"
                    name="phone_number"
                    size="lg"
                    type="string"
                    min={0}
                    maxLength={9}
                    value={values.phone_number}
                    onChange={handleChange}
                    isInvalid={!!errors.phone_number}
                    aria-describedby="basic-addon1"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.phone_number}
                  </Form.Control.Feedback>
                </FloatingLabel>
                <h6 style={{ fontSize: "0.7rem" }}>
                  * Kindly input your phone number, excluding 0 or +61.
                </h6>
              </Col>

              {/* Vertical Divider */}
              <Col
                md={1}
                className="d-flex align-items-center justify-content-center"
              >
                <Divider
                  orientation="vertical"
                  flexItem
                  className="my-4 text-dark bg-dark"
                />
              </Col>

              {/* Right Part: Image and Upload Button */}
              <Col md={6} className="d-flex flex-column">
                <h5 className="image-label">Profile Pic</h5>
                <Row className="image-container">
                  <Col xs="auto">
                    <div className="image-box-container">
                      {image ? (
                        <Image
                          src={image}
                          alt="Profile"
                          className="image-box-image"
                          roundedCircle
                          thumbnail
                          style={{ objectFit: "cover" }}
                        />
                      ) : (
                        <Image
                          thumbnail
                          src={demoProfileImg}
                          alt="Profile"
                          className="image-box-image"
                          roundedCircle
                        />
                      )}

                      <Form.Control
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        className="image-box-file-input"
                        onChange={handleImageChange}
                        name="profile"
                      />

                      <div
                        className="image-box-overlay"
                        onClick={() =>
                          image
                            ? handleDeleteImage()
                            : fileInputRef.current.click()
                        }
                      >
                        {image ? (
                          <FaRegTrashAlt className="image-box-icon" />
                        ) : (
                          <FaCamera className="image-box-icon" />
                        )}
                      </div>
                    </div>
                  </Col>
                  <Col>
                    <p>
                      Clear photos are an important way for buyers and sellers
                      to learn about each other. Be sure doesn't include any
                      personal or sensitive info you'd rather not have others
                      see.
                    </p>
                  </Col>
                </Row>
                <Divider className="my-4 text-dark bg-dark" />
                {/* <h5 className="d-flex justify-content-between align-content-center align-items-center">
                  Change Password{" "}
                  <Button className="password-save-btn" variant="light">
                    save
                  </Button>
                </h5>
                <Form.Group className="password-change-input">
                  <Form.Control
                    placeholder="Old Password"
                    aria-label="old_password"
                    name="old_password"
                    type={passwordToggle ? "password" : "text"}
                    size="lg"
                    className="custom-input mb-3"
                    value={values.old_password}
                    onChange={handleChange}
                    isInvalid={!!errors.old_password}
                    aria-describedby="basic-addon2"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.old_password}
                  </Form.Control.Feedback>
                  <IconButton
                    aria-label="delete"
                    size="small"
                    sx={{ p: 0, color: "rgb(var(--color-black))" }}
                    tabIndex={-1}
                    onClick={handleToggle}
                  >
                    {passwordToggle ? (
                      <FaEye style={{ fontSize: "1.4rem" }} />
                    ) : (
                      <FaEyeSlash style={{ fontSize: "1.4rem" }} />
                    )}
                  </IconButton>
                </Form.Group>
                <Form.Group className="password-change-input">
                  <Form.Control
                    placeholder="New Password"
                    aria-label="new_password"
                    name="new_password"
                    className="custom-input mb-3"
                    type={passwordToggle ? "password" : "text"}
                    size="lg"
                    value={values.new_password}
                    onChange={handleChange}
                    isInvalid={!!errors.new_password}
                    aria-describedby="basic-addon2"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.new_password}
                  </Form.Control.Feedback>
                  <IconButton
                    aria-label="delete"
                    size="small"
                    sx={{ p: 0, color: "rgb(var(--color-black))" }}
                    tabIndex={-1}
                    onClick={handleToggle}
                  >
                    {passwordToggle ? (
                      <FaEye style={{ fontSize: "1.4rem" }} />
                    ) : (
                      <FaEyeSlash style={{ fontSize: "1.4rem" }} />
                    )}
                  </IconButton>
                </Form.Group>
                <Form.Group className="password-change-input">
                  <Form.Control
                    className="custom-input"
                    placeholder="Confirm Password"
                    aria-label="confirm_password"
                    name="confirm_password"
                    type={passwordToggle ? "password" : "text"}
                    size="lg"
                    value={values.confirm_password}
                    onChange={handleChange}
                    isInvalid={!!errors.confirm_password}
                    aria-describedby="basic-addon2"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.confirm_password}
                  </Form.Control.Feedback>
                  <IconButton
                    aria-label="delete"
                    size="small"
                    sx={{ p: 0, color: "rgb(var(--color-black))" }}
                    tabIndex={-1}
                    onClick={handleToggle}
                  >
                    {passwordToggle ? (
                      <FaEye style={{ fontSize: "1.4rem" }} />
                    ) : (
                      <FaEyeSlash style={{ fontSize: "1.4rem" }} />
                    )}
                  </IconButton>
                </Form.Group> */}
              </Col>
            </Row>
          </Card.Body>
          <Card.Footer className="d-flex justify-content-between">
            <Button
              variant="outline-dark"
              onClick={handleDiscard}
              className="discard-btn"
            >
              Discard
            </Button>
            <LoadingButton
              loading={isLoading}
              size="small"
              loadingPosition="start"
              startIcon={<FaRegSave style={{ fontSize: "1.4rem" }} />}
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
              Save Changes
            </LoadingButton>
          </Card.Footer>
        </Form>
      </Card>
    </Container>
  );
};

export default EditProfileForm;
