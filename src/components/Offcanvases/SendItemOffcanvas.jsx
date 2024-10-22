import React, { lazy } from "react";
import { Button, Carousel, Col, Offcanvas, Row } from "react-bootstrap";
import { HiMiniArrowLongLeft, HiMiniArrowLongRight } from "react-icons/hi2";
const WishListItemCard = lazy(() => import("../Cards/WishListItemCard"));

const SendItemOffcanvas = ({
  showOffcanvas,
  handleCanvasClose,
  index,
  handlePrev,
  handleNext,
  groupedItems,
  handleSelect,
  handleClick,
  ProposeItemButton,
}) => {
  return (
    <Offcanvas
      placement="bottom"
      show={showOffcanvas}
      onHide={handleCanvasClose}
    >
      <Offcanvas.Header className="d-flex justify-content-between p-0 px-4" closeButton>
        <Offcanvas.Title
          style={{
            width: "100%",
          }}
        >
          Listed Items
        </Offcanvas.Title>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "end",
            width: "100%",
            marginRight: "2rem",
          }}
        >
          <Button
            className="indicator-btn me-2"
            onClick={(e) => handlePrev(e)}
            disabled={index === 0 ? true : false}
          >
            <HiMiniArrowLongLeft style={{ fontSize: "2rem" }} />
          </Button>
          <Button
            className="indicator-btn"
            onClick={(e) => handleNext(e)}
            disabled={
              groupedItems.length === 0 || index === groupedItems.length - 1
                ? true
                : false
            }
          >
            <HiMiniArrowLongRight style={{ fontSize: "2rem" }} />
          </Button>
        </div>
      </Offcanvas.Header>
      <Offcanvas.Body className="p-0 px-3">
        <Carousel
          activeIndex={index}
          indicators={false}
          controls={false}
        >
          {groupedItems &&
            groupedItems &&
            groupedItems.map((group, idx) => (
              <Carousel.Item key={idx}>
                <Row
                  style={{
                    display: "flex",
                    flexWrap: "nowrap",
                    // marginRight: "-15px",
                    // marginLeft: "-15px",
                    // padding: "0 1rem",
                    width: "100%",
                  }}
                >
                  {group.map((item, i) => (
                    <Col
                      key={i}
                      md={4}
                      sm={6}
                      xs={6}
                      style={{ flex: "0 0 auto" }}
                      className="p-0"
                    >
                      <WishListItemCard
                        handleClick={() => handleClick(item?._id)}
                        item={item}
                        ProposeItemButton={ProposeItemButton}
                      />
                    </Col>
                  ))}
                </Row>
              </Carousel.Item>
            ))}
        </Carousel>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default SendItemOffcanvas;
