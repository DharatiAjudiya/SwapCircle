import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Breadcrumb,
} from "react-bootstrap";
import "./Contact.css"; // Import custom CSS
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
import { BiPhone } from "react-icons/bi";
import {
  FaApple,
  FaFacebookF,
  FaGooglePlay,
  FaInstagram,
  FaLinkedinIn,
  FaPhoneVolume,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import { PiPhoneCallFill } from "react-icons/pi";
import { IoMailSharp } from "react-icons/io5";
import { HiLocationMarker } from "react-icons/hi";
import { GrLocation } from "react-icons/gr";
const Contact = () => {
  const [leave, setLeaving] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toastType, showToast } = useToastContext();
  const { loading, status, message } = useSelector((state) => state.LoginStore);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(loading);
  }, [loading]);

  useEffect(() => {
    if (status == true) {
      // const Token = Cookie.get("token");
      // if (Token) {
      //   if (values.rememberMe === true) {
      //     localStorage.setItem("email", values.email);
      //     localStorage.setItem("password", values.password);
      //     localStorage.setItem("rememberMe", values.rememberMe);
      //   } else {
      //     localStorage.removeItem("email");
      //     localStorage.removeItem("password");
      //     localStorage.removeItem("rememberMe");
      //   }
      // }

      toastType.current = {
        severity: "success",
        summary: "Success",
        detail: message,
      };
      showToast("top-left");
      dispatch(clearLoginState());
      dispatch(loadUserData());
      setTimeout(() => {
        navigate("/", { state: { from: window.location.pathname } });
      }, 500);
    } else if (status == false) {
      toastType.current = {
        severity: "error",
        summary: "Error",
        detail: message,
      };
      showToast("top-left");
      dispatch(clearLoginState());
    }
    setLoading(false);
  }, [status, toastType, message]);

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

  return (
    <Container fluid className="contact-container">
      <Breadcrumb>
        <Breadcrumb.Item href="#" onClick={() => navigate("/")}>
          Home
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Contact Us</Breadcrumb.Item>
      </Breadcrumb>
      <Container
        className="text-center"
        style={{ marginBottom: "3rem" }}
      >
        <div style={{ fontSize: "2.5rem", fontWeight: "bold" }}>Contact Us</div>
        <div>
          Any questions or remarks? just write to us a message and we will get
          back to you as soon as possible.
        </div>
      </Container>
      <Row className="align-items-center justify-content-center">
        <Col md={10} lg={8}>
          <Card className="contact-card">
            <Row>
              <Col
                md={5}
                className="d-flex justify-content-start align-items-center flex-column align-content-center discount-section"
              >
                <div className="discount-content my-auto">
                  <h3>Contact Inforamtion</h3>
                  <p>Say something to start a live chat</p>
                </div>
                <div className="my-auto contact-content">
                  <p>
                    <span>
                      <PiPhoneCallFill
                        style={{
                          fontSize: "1.5rem",
                          color: "#fff",
                        }}
                      />
                    </span>
                    <span>+1012 3456 789</span>
                  </p>
                  <p>
                    <span>
                      <IoMailSharp
                        style={{
                          fontSize: "1.5rem",
                          color: "#fff",
                        }}
                      />
                    </span>
                    <span>demo@gmail.com</span>
                  </p>
                  <p className="d-flex align-items-start justify-content-start">
                    <span>
                      <GrLocation
                        style={{
                          fontSize: "1.5rem",
                          color: "#fff",
                        }}
                      />
                    </span>
                    <span>
                      132 Dartmouth Street Boston, Massachusetts 02156 United
                      States
                    </span>
                  </p>
                </div>
                <div className="social-icons my-auto">
                  <Button variant="dark">
                    <FaFacebookF
                      style={{ fontSize: "1.5rem", color: "#fff" }}
                    />
                  </Button>
                  <Button variant="dark">
                    <FaLinkedinIn
                      style={{ fontSize: "1.5rem", color: "#fff" }}
                    />
                  </Button>
                  <Button variant="dark">
                    <FaTwitter style={{ fontSize: "1.5rem", color: "#fff" }} />
                  </Button>
                  <Button variant="dark">
                    <FaInstagram
                      style={{ fontSize: "1.5rem", color: "#fff" }}
                    />
                  </Button>
                </div>
              </Col>
              <Col md={7} className="contact-section">
                <div className="contact-box">
                  <Form
                    noValidate
                    onSubmit={(e) => handleFormSubmit(e)}
                    method="post"
                  >
                    <div className="form-row">
                      <Form.Group controlId="firstname" className="form-column">
                        <Form.Label>Fist Name</Form.Label>
                        <Form.Control
                          placeholder="Fist Name"
                          aria-label="firstname"
                          name="firstname"
                          size="lg"
                          type="firstname"
                          value={values.firstname}
                          onChange={handleChange}
                          isInvalid={!!errors.firstname}
                          aria-describedby="basic-addon1"
                          className="custom-input"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.firstname}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group controlId="lastname" className="form-column">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control
                          placeholder="Last Name"
                          aria-label="lastname"
                          name="lastname"
                          type="lastname"
                          size="lg"
                          value={values.lastname}
                          onChange={handleChange}
                          isInvalid={!!errors.lastname}
                          aria-describedby="basic-addon2"
                          className="custom-input"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.lastname}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </div>

                    <div className="form-row">
                      <Form.Group controlId="Email" className="form-column">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          placeholder="Email"
                          aria-label="email"
                          name="email"
                          size="lg"
                          type="email"
                          value={values.email}
                          className="custom-input"
                          onChange={handleChange}
                          isInvalid={!!errors.email}
                          aria-describedby="basic-addon1"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.email}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group controlId="First" className="form-column">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control
                          placeholder="Phone Number"
                          aria-label="Phone Number"
                          name="phone_number"
                          size="lg"
                          type="number"
                          min={0}
                          maxLength={10}
                          value={values.phone_number}
                          onChange={handleChange}
                          isInvalid={!!errors.phone_number}
                          aria-describedby="basic-addon1"
                          className="custom-input"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.phone_number}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </div>

                    <div className="form-row">
                      <Form.Group className="form-column">
                        <Form.Label>Select Subject?</Form.Label>
                        <div className="check-row">
                          <Form.Check
                            type="radio"
                            name="subject"
                            label="General Inquiry"
                            className="custom-radio"
                          />
                          <Form.Check
                            type="radio"
                            name="subject"
                            label="Support"
                            className="custom-radio"
                          />
                          <Form.Check
                            type="radio"
                            name="subject"
                            label="Feedback"
                            className="custom-radio"
                          />
                          <Form.Check
                            type="radio"
                            name="subject"
                            label="Other"
                            className="custom-radio"
                          />
                        </div>
                      </Form.Group>
                    </div>

                    <div className="form-row">
                      <Form.Group controlId="Message" className="form-column">
                        <Form.Label>Message</Form.Label>
                        <Form.Control
                          placeholder="Write your message..."
                          aria-label="message"
                          name="message"
                          size="lg"
                          as="textarea"
                          rows={3}
                          value={values.message}
                          className="custom-input"
                          onChange={handleChange}
                          isInvalid={!!errors.message}
                          aria-describedby="basic-addon1"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.message}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </div>

                    <div className="d-flex justify-content-end">
                      <Button
                        variant="dark"
                        type="submit"
                        className=" my-3 p-5 py-3"
                      >
                        Send Message
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

export default Contact;
