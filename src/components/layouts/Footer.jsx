import { Col, Container, Image, Row } from "react-bootstrap";
import {
  FaApple,
  FaFacebookF,
  FaGooglePlay,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import "./Footer.css"

const Footer = () => {
  return (
    <>
      <footer className="bd-footer py-5 bg-dark text-light">
        <Container>
          <Row>
            <Col lg={3} className="mb-3">
              <a
                className="d-inline-flex align-items-center mb-2 link-light text-decoration-none"
                href="/"
                aria-label="Bootstrap"
              >
                <Image
                  onClick={() => navigate("/home")}
                  src={"/images/SwapCircle-2.svg"}
                  alt="mdo"
                  width="35"
                  height="35"
                  roundedCircle
                  className="d-block me-2"
                />
                <span className="fs-5">Swap Circle</span>
              </a>
              <ul className="list-unstyled small text-light">
                <li className="mb-2">
                  Lorem Ipsum, 235 Simply,
                  <br />
                  printing, Pin 309 309
                </li>
                <li className="mb-2">loremipsum@gmail.com</li>
                <li className="mb-2">+1 00000 00000</li>
              </ul>
            </Col>
            <Col xs={6} lg={2} className="offset-lg-1 mb-3">
             <div className="text-effect-container">
             <h2 className="text-background">Category</h2>
             <h5 className="text-foreground">Category</h5>
             <ul className="list-unstyled">
                <li className="mb-2">
                  <a className="footer-link" href="#">
                    Electronics
                  </a>
                </li>
                <li className="mb-2">
                  <a className="footer-link" href="#">
                    Footwares
                  </a>
                </li>
                <li className="mb-2">
                  <a className="footer-link" href="#">
                    Accessories
                  </a>
                </li>
                <li className="mb-2">
                  <a className="footer-link" href="#">
                    Home & Living
                  </a>
                </li>
                <li className="mb-2">
                  <a className="footer-link" href="#">
                    Beauty
                  </a>
                </li>
              </ul>
              </div> 
            
            </Col>
            <Col xs={6} lg={2} className="mb-3">
            <div className="text-effect-container">
              <h2 className="text-background">Explore</h2>
              <h5 className="text-foreground">Explore</h5>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <a className="footer-link" href="#">
                    Toys
                  </a>
                </li>
                <li className="mb-2">
                  <a className="footer-link" href="#">
                   Books
                  </a>
                </li>
                <li className="mb-2">
                  <a className="footer-link" href="#">
                    Eyewares
                  </a>
                </li>
                <li className="mb-2">
                  <a className="footer-link" href="#">
                    Clothes
                  </a>
                </li>
                <li className="mb-2">
                  <a className="footer-link" href="#">
                    Sports
                  </a>
                </li>
              </ul>
            </div> 
            </Col>
            <Col xs={6} lg={2} className="mb-3">
            <div className="text-effect-container">
              <h2 className="text-background">Contact</h2>
              <h5 className="text-foreground">Contact Us</h5>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <a className="footer-link" href="#">
                    FAQ
                  </a>
                </li>
                <li className="mb-2">
                  <a className="footer-link" href="#">
                    Track Orders
                  </a>
                </li>
                <li className="mb-2">
                  <a className="footer-link" href="#">
                    Shipping
                  </a>
                </li>
                <li className="mb-2">
                  <a className="footer-link" href="#">
                    Canccellation
                  </a>
                </li>
                <li className="mb-2">
                  <a className="footer-link" href="#">
                    Returns
                  </a>
                </li>
              </ul>
            </div>
             
             
            </Col>
            <Col xs={6} lg={2} className="mb-3">
            <div className="text-effect-container">
            <h5 className="text-foreground">Support</h5>
              <h2 className="text-background">Support</h2>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <a className="footer-link" href="#">
                    Help Center
                  </a>
                </li>
                <li className="mb-2">
                  <a className="footer-link" href="#">
                    News
                  </a>
                </li>
                <li className="mb-2">
                  <a className="footer-link" href="#">
                    Career
                  </a>
                </li>
                <li className="mb-2">
                  <a className="footer-link" href="#">
                    Terms of Use
                  </a>
                </li>
              </ul>
            </div>
             
            </Col>
          </Row>
          <Row className="justify-content-between align-items-center">
            <Col md="auto">
              <span>
                &copy;{" "}
                {new Date().toISOString().split().shift().trim().slice(0, 4)}{" "}
                SWAP CIRCLE, All Rights Reserved.
              </span>
            </Col>
            <Col md="auto" className="ms-5">
              <span className="footer-link">Privacy Policy</span>
              <span className="footer-divider">|</span>
              <span className="footer-link">Terms & Conditions</span>
            </Col>
            <Col md="auto" className="social-icons">
              <FaFacebookF />
              <span className="footer-divider">|</span>
              <FaLinkedinIn />
              <span className="footer-divider">|</span>
              <FaTwitter />
              <span className="footer-divider">|</span>
              <FaInstagram />
              <span className="footer-divider">|</span>
              <FaApple />
              <span className="footer-divider">|</span>
              <FaGooglePlay />
              <span className="footer-divider">|</span>
              <FaYoutube />
            </Col>
          </Row>
        </Container>
      </footer>
    </>
  );
};

export default Footer;
