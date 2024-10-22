import React, { useState } from "react";
import { Card, Carousel } from "react-bootstrap";
import "./ChatReplyItemCard.css"; // Custom CSS for styling
import { NODE_APP_URL } from "../../../config/app_config";
import { useNavigate } from "react-router-dom";

const ChatReplyItemCard = ({ item, classNames }) => {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();
  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <Card className={`custom-item-reply-card`} onClick={() => {navigate(`/item/${item._id}`)}}>
      <div className="card-body-content">
        <div className="card-content">
          <h5 className={`title title-${classNames}`}>{item?.name}</h5>
          <p className={`product-price product-price-${classNames}`}>{item?.description}</p>
        </div>
        <div className="wishlist-carousel-container">
          <Carousel
            activeIndex={index}
            onSelect={handleSelect}
            style={{ zIndex: 1 }}
          >
            {item?.images &&
              item?.images.map((src, imgIndex) => {
                let imgUrl =
                  src.startsWith("http") || src.startsWith("https")
                    ? src
                    : `${NODE_APP_URL}/uploads/items/${src}`;

                return (
                  <Carousel.Item key={imgIndex}>
                    <img
                      className="d-block w-100 carousel-image"
                      src={imgUrl}
                      alt={`Slide ${imgIndex}`}
                    />
                  </Carousel.Item>
                );
              })}
          </Carousel>
        </div>
      </div>
    </Card>
  );
};

export default ChatReplyItemCard;
