import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  InputGroup,
} from "react-bootstrap";
import "./Register.css"; // Import custom CSS
import { FcGoogle } from "react-icons/fc";
import { SiFacebook } from "react-icons/si";
import { useFormik } from "formik";
import schema from "../src/Schema/registerSchema";
// import { IconButton } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useToastContext } from "../Hooks/ToastContextHook";
import { clearRegisterState, RegisterApi } from "../stores/auth/RegisterSlice";
import { NODE_APP_URL } from "../config/app_config";
import { LoadingButton } from "@mui/lab";
// import { FaEye, FaEyeSlash } from "react-icons/fa6";

const Register = () => {
  //   const [passwordToggle, setPasswordToggle] = useState(true);
  //   const handleToggle = () => setPasswordToggle(!passwordToggle);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toastType, showToast } = useToastContext();

  const { loading, status, message } = useSelector(
    (state) => state.RegisterStore
  );
  const [isLoading, setLoading] = useState(false);

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
      dispatch(clearRegisterState());
      navigate("/login");
    } else if (status == false) {
      toastType.current = {
        severity: "error",
        summary: "Error",
        detail: message,
      };
      showToast("top-right");
      dispatch(clearRegisterState());
    }
    setLoading(false);
  }, [status]);

  const handleGoogleLogin = () => {
    window.open(`${NODE_APP_URL}/auth/google`, "_self");
  };
  const handleFacebookLogin = () => {
    window.open(`${NODE_APP_URL}/auth/facebook`, "_self");
  };

  const handleToggle = () => setPasswordToggle(!passwordToggle);
  const handleNavigate = () => {
    setLeaving(true);
    setTimeout(() => {
      navigate("/login");
    }, 500);
  };

  const initialValues = {
    username: "",
    email: "",
    phone_number: "",
    password: "",
  };

  const { errors, values, handleChange, handleSubmit, validateForm } =
    useFormik({
      initialValues,
      validationSchema: schema,
      onSubmit: async (values) => {
        try {
          dispatch(RegisterApi({ values }));
        } catch (error) {
          console.error("Form submission error:", error);
          setLoading(false);
        }
      },
    });

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate the form before submission
    const isFormValid = await validateForm();

    if (Object.keys(isFormValid).length !== 0) {
      setLoading(false);
      return;
    }

    handleSubmit(e);
  };

  return (
    <Container fluid className="register-container">
      <Row className="align-items-center justify-content-center vh-100">
        <Col md={10} lg={8}>
          <Card className="register-card">
            <Row>
              <Col md={5} className="register-section order-2 order-md-1">
                <div className="register-box">
                  <h1>Sign up</h1>
                  <Form
                    noValidate
                    onSubmit={(e) => handleFormSubmit(e)}
                    method="post"
                    className="register-form"
                  >
                    <Form.Control
                      placeholder="Your name"
                      aria-label="username"
                      name="username"
                      size="lg"
                      type="username"
                      value={values.username}
                      onChange={handleChange}
                      isInvalid={!!errors.username}
                      aria-describedby="basic-addon1"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.username}
                    </Form.Control.Feedback>
                    <Form.Control
                      placeholder="Phone"
                      aria-label="Phone"
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
                    <h6 style={{ fontSize: "0.7rem" }}>
                      * Kindly input your phone number, excluding 0 or +61.
                    </h6>
                    <Form.Control
                      placeholder="Email"
                      aria-label="email"
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
                    <Form.Control
                      placeholder="Password"
                      aria-label="password"
                      name="password"
                      type={"password"}
                      //   type={passwordToggle ? "password" : "text"}
                      size="lg"
                      value={values.password}
                      onChange={handleChange}
                      isInvalid={!!errors.password}
                      aria-describedby="basic-addon2"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                    {/* <IconButton
                          aria-label="password"
                          size="small"
                          sx={{ p: 0, color: "rgb(var(--color-black))" }}
                          onClick={handleToggle}
                          tabIndex={-1}
                        >
                          {passwordToggle ? (
                            <FaEye style={{ fontSize: "1.4rem" }} />
                          ) : (
                            <FaEyeSlash style={{ fontSize: "1.4rem" }} />
                          )}
                        </IconButton> */}
                    <LoadingButton
                      loading={isLoading}
                      loadingPosition="start"
                      startIcon={""}
                      variant="contained"
                      type="submit"
                      className="w-100 my-3"
                    >
                      CONTINUE
                    </LoadingButton>
                    <Form.Text className="text-muted">
                      Already have an account?{" "}
                      <Link
                        to="/login"
                        className="text-decoration-none text-dark"
                      >
                        Sign in
                      </Link>
                    </Form.Text>
                    <hr />
                    <div className="text-center mb-1">
                      <p className="m-0">Register with</p>
                      <div className="social-icons mt-2">
                        <a
                          className="social-icon"
                          onClick={handleFacebookLogin}
                        >
                          <SiFacebook
                            style={{
                              fontSize: "1.5rem",
                              color: "rgb(24, 119, 242)",
                              margin: "0 0.5rem",
                            }}
                          />
                        </a>
                        <a className="social-icon" onClick={handleGoogleLogin}>
                          <FcGoogle
                            style={{
                              fontSize: "1.56rem",
                              margin: "0 0.5rem",
                            }}
                          />
                        </a>
                      </div>
                    </div>
                  </Form>
                </div>
              </Col>
              <Col
                md={7}
                className="d-flex justify-content-center align-items-center align-content-center register-banner-section order-1 order-md-2"
              >
                {/* <div className="text-center discount-content">
                  <h2>Get Discount upto</h2>
                  <h1>50% OFF</h1>
                  <p>10 - 13 August</p>
                </div> */}
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
