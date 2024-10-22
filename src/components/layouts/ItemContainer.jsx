import React from "react";
import { Container, Row, Col, Carousel, Button, Image } from "react-bootstrap";
import ItemCard from "../Cards/ItemCard";
import { bannerData, categoryBannerData } from "../../../Data/items";
import { FaArrowRight } from "react-icons/fa6";
import VerticalItemCard from "../Cards/VerticalItemCard";
import CategoryBannerCard from "../Cards/CategoryBannerCard";

const ItemCardContainer = ({ data }) => {
  return (
    <>
      <Container
        fluid
        style={{ marginTop: "50px", width: "100%", height: "100%" }}
      >
        {/* Banner Carousel */}
        <Carousel
          style={{
            display: "flex",
            alignItems: "center",
            height: "80vh", // Set carousel height to 40vh
          }}
        >
          {bannerData.map((banner, index) => (
            <Carousel.Item key={index}>
              <Image
                src={banner.image} // Assuming each banner has an imageSrc property
                alt={banner.title}
                width="100%"
                height="100%"
                style={{ objectFit: "cover" }} // Ensures the image covers the entire area
              />
              <Carousel.Caption
                className={`${index % 2 == 0 ? "text-start" : "text-end"}`}
              >
                <h1>{banner?.title}</h1>
                <p>{banner?.description}</p>
                <Button size="lg" className="banner-btn">
                  {banner?.buttonText}
                </Button>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>

        {/* Item Cards */}
        <Container>
          <h2
            style={{
              color: "#353533",
              fontFamily: "var(--font-heading2)",
              fontSize: "3rem",
              textAlign: "center",
              marginTop: "30px",
              letterSpacing: "3px",
            }}
            className="d-flex justify-content-between align-items-center align-content-center"
          >
            Today's Picks
            <Button className="banner-btn">
              Show All{" "}
              <FaArrowRight style={{ fontSize: "1.2rem", marginLeft: "4px" }} />
            </Button>{" "}
          </h2>
          <Row style={{ marginTop: "10px", width: "100%" }}>
            {data.map((item, i) => (
              <Col key={i} xs={12} sm={6} md={4}>
                <ItemCard item={item} />
              </Col>
            ))}
          </Row>
        </Container>
        <h2
          style={{
            color: "rgb(var(--color-jet-grey))",
            fontFamily: "var(--font-heading2)",
            fontSize: "3rem",
            textAlign: "center",
            marginTop: "30px",
            letterSpacing: "1px",
          }}
        >
          Most Swapping Categories
        </h2>
        <Container className="my-5">
          <Row>
            {categoryBannerData.map((data, index) => (
              <Col key={index} md={6} className="mb-4">
                <CategoryBannerCard key={index} data={data} />
              </Col>
            ))}
          </Row>
        </Container>
        <Container>
          <h2
            style={{
              color: "#353533",
              fontFamily: "var(--font-heading2)",
              fontSize: "2rem",
              textAlign: "left",
              marginTop: "30px",
              letterSpacing: "1px",
            }}
            className="d-flex justify-content-between align-items-center align-content-center"
          >
            Electronics you would like
            <Button className="banner-btn">
              Show All{" "}
              <FaArrowRight style={{ fontSize: "1.2rem", marginLeft: "4px" }} />
            </Button>{" "}
          </h2>
          <div
            style={{ display: "flex", alignItems: "center", marginTop: "10px" }}
          >
            <div
              style={{ overflowX: "auto", whiteSpace: "nowrap", width: "100%" }}
            >
              <Row
                style={{
                  display: "flex",
                  flexWrap: "nowrap",
                  marginRight: "-15px",
                  marginLeft: "-15px",
                }}
              >
                {data.map((item, index) => (
                  <Col
                    key={index}
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    style={{ flex: "0 0 auto" }}
                  >
                    <VerticalItemCard item={item} />
                  </Col>
                ))}
              </Row>
            </div>
          </div>
        </Container>
      </Container>
    </>
  );
};

export default ItemCardContainer;
