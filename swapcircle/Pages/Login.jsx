import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import "./Login.css"; // Import custom CSS
import { FcGoogle } from "react-icons/fc";
import { SiFacebook } from "react-icons/si";
import { useNavigate } from "react-router-dom";
import { useToastContext } from "../Hooks/ToastContextHook";
import { useDispatch, useSelector } from "react-redux";
import Cookie from "js-cookie";
import { clearLoginState, LoginApi } from "../stores/auth/LoginSlice";
import { loadUserData } from "../stores/auth/authUserSlice";
import { useFormik } from "formik";
import schema from "../src/Schema/loginSchema";
import { NODE_APP_URL } from "../config/app_config";
import { LoadingButton } from "@mui/lab";
import { useDynamicToast } from "../Hooks/DynamicToastHook";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isLoading, setLoading } = useDynamicToast("LoginStore", {
    clearState: clearLoginState,
    loadData: loadUserData,
  });

  // const [passwordToggle, setPasswordToggle] = useState(true);
  // const handleToggle = () => setPasswordToggle(!passwordToggle);

  // const handleNavigate = () => {
  //   setLeaving(true);
  //   setTimeout(() => {
  //     navigate("/register");
  //   }, 500);
  // };

  const initialValues = {
    email: "",
    password: "",
    rememberMe: false,
  };

  const {
    errors,
    values,
    handleChange,
    handleSubmit,
    validateForm,
    setFieldValue,
    setValues,
  } = useFormik({
    initialValues,
    validationSchema: schema,
    onSubmit: async (values) => {
      try {
        dispatch(LoginApi({ values }));
      } catch (error) {
        console.error("Form submission error:", error);
        setLoading(false);
      }
    },
  });

  // useEffect(() => {
  //   setValues({
  //     ...values,
  //     email: localStorage.getItem("email") || "",
  //     password: localStorage.getItem("password") || "",
  //     rememberMe: localStorage.getItem("rememberMe") || false,
  //   });
  // }, []);

  // useEffect(() => {
  //   const storedRememberMe = localStorage.getItem("rememberMe") === "true";
  //   if (storedRememberMe) {
  //     let email = localStorage.getItem("email") || "";
  //     setFieldValue("email", email);
  //     let password = localStorage.getItem("password") || "";
  //     setFieldValue("password", password);
  //   }
  //   setFieldValue("rememberMe", storedRememberMe);
  // }, []);

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

  const handleGoogleLogin = () => {
    window.open(`${NODE_APP_URL}/auth/google`, "_self");
  };
  const handleFacebookLogin = () => {
    window.open(`${NODE_APP_URL}/auth/facebook`, "_self");
  };

  return (
    <Container fluid className="login-container">
      <Row className="align-items-center justify-content-center vh-100">
        <Col md={10} lg={8}>
          <Card className="login-card">
            <Row>
              <Col
                md={8}
                className="d-flex justify-content-center align-items-center align-content-center login-banner-section"
              >
                {/* <div className="text-center discount-content">
                  <h2>Get Discount upto</h2>
                  <h1>50% OFF</h1>
                  <p>10 - 13 August</p>
                </div> */}
              </Col>
              <Col md={4} className="login-section">
                <div className="login-box">
                  <h1>Login</h1>
                  <Form
                    noValidate
                    onSubmit={(e) => handleFormSubmit(e)}
                    method="post"
                  >
                    <Form.Control
                      placeholder="Email or mobile phone number"
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
                    <h6 style={{ fontSize: "0.7rem" }}>
                      * Kindly input your phone number, excluding 0 or +61.
                    </h6>
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
                      className="w-100 my-3 login-btn"
                    >
                      CONTINUE
                    </LoadingButton>
                    <hr />
                    <div className="text-center mb-1">
                      <p className="m-0">Login with</p>
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
                    <Form.Text className="text-muted">
                      By continuing, you agree to Swap Circle's{" "}
                      <a href="#" className="text-decoration-none text-dark">
                        Conditions of Use and Privacy Notice.
                      </a>
                    </Form.Text>
                    <hr />
                    <div className="text-center">
                      <p>New to Swap Circle ?</p>
                      <Button
                        variant="outline-secondary"
                        className="w-100"
                        onClick={() => navigate("/register")}
                      >
                        Create New Account
                      </Button>
                    </div>
                  </Form>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
