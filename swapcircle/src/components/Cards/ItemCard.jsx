import React, { useState } from "react";
import { Card, Button, Carousel, Image } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { MdFavoriteBorder, MdFavorite } from "react-icons/md";
import { IoEyeOutline } from "react-icons/io5";
import "./ItemCard.css"; // Import the CSS file

const ItemCard = ({ item }) => {
  const [index, setIndex] = useState(0);
  const [wishlistitem, setWishlistitem] = useState(false);

  const markAsWishlist = () => setWishlistitem(!wishlistitem);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <Card className="item-card-container">
      <div className="carousel-container">
        <Carousel
          activeIndex={index}
          onSelect={handleSelect}
          style={{ zIndex: 1 }}
        >
          {item?.images.map((src, index) => (
            <Carousel.Item key={index}>
              <Image
                src={src}
                alt={`Slide ${index}`}
                className="carousel-image"
              />
            </Carousel.Item>
          ))}
        </Carousel>

        <div className="overlay">
          <Card.Body className="card-details">
            <Card.Title className="item-card-title">
              {item?.itemName}
            </Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              {item?.itemLocation}
            </Card.Subtitle>
            <Card.Text className="item-card-text">
              {item?.itemDescription}
            </Card.Text>
            <div className="d-flex justify-content-between align-items-center align-content-center">
              <Button
                className="chat-btn me-2"
                variant="outline-white"
                onClick={markAsWishlist}
              >
                {wishlistitem ? (
                  <>
                    <MdFavorite
                      style={{ fontSize: "1.5rem" }}
                      className="me-2"
                    />
                    Remove from Wishlist
                  </>
                ) : (
                  <>
                    <MdFavoriteBorder
                      style={{ fontSize: "1.5rem" }}
                      className="me-2"
                    />
                    Add to Wishlist
                  </>
                )}
              </Button>
              <Button className="view-profile-btn" variant="outline-white">
                <IoEyeOutline style={{ fontSize: "1.5rem" }} className="me-2" />
                View Details
              </Button>
            </div>
          </Card.Body>
        </div>
      </div>
    </Card>
  );
};

export default ItemCard;
