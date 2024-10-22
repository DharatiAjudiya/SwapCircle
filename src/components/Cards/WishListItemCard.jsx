import React, { memo, useEffect, useState } from "react";
import { Card, Carousel, ButtonGroup, Button, Image } from "react-bootstrap";
import "./WishListItemCard.css"; // Custom CSS for styling
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// import { useSweetAlert } from "../../../Hooks/AlertHooks";
import { DeleteWishListApi } from "../../../stores/WishList/WishListSlice";
// import { useToastContext } from "../../../Hooks/ToastContextHook";
import { NODE_APP_URL } from "../../../config/app_config";
import { MdFavorite } from "react-icons/md";
import { RiMessengerLine } from "react-icons/ri";
import { GetWishListByUserApi } from "../../../stores/User/UserSlice";
import {
  AddChatRoomApi,
  clearChatroomState,
} from "../../../stores/Chat/ChatroomSlice";

const WishListItemCard = ({
  item,
  isWishlisted = false,
  handleClick,
  ProposeItemButton,
}) => {
  const [index, setIndex] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const { MySwal } = useToastContext();
  // const { showCancelledMessage, confirmDialog } = useSweetAlert();

  const unmarkAsWishlist = async () => {
    // const result = await confirmDialog({
    //   message: "Do you want to remove this item from your wishlist?",
    // });
    // if (result.isConfirmed) {
    await dispatch(DeleteWishListApi({ id: item?._id }));
    await dispatch(GetWishListByUserApi());
    // } else if (result.dismiss === MySwal.DismissReason.cancel) {
    //   showCancelledMessage();
    // }
  };

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  const [profile, setProfile] = useState("");
  useEffect(() => {
    if (item?.user_id?.profile) {
      let _src =
        item?.user_id?.profile.startsWith("http://") ||
        item?.user_id?.profile.startsWith("https://")
          ? item?.user_id?.profile
          : `${NODE_APP_URL}/uploads/users/${item?.user_id?.profile}`;
      setProfile(_src);
    }
  }, [item?.user_id?.profile]);

  const { status, singleChat } = useSelector((state) => state.ChatroomStore);

  useEffect(() => {
    if (status === true) {
      dispatch(clearChatroomState());
      window.location.href = `/chat?chatId=${singleChat?._id}`;
      // navigate(`/chat?chatId=${singleChat?._id}`);
    }
  }, [status]);

  const handleMessageClick = async () => {
    await dispatch(
      AddChatRoomApi({
        values: {
          values: { members_id: item?.user_id?._id },
          item_id: [item?._id],
        },
      })
    );
  };

  return (
    <Card className="custom-card">
      {/* Overlay only visible when item is sold */}
      {item?.selling_status === "sold" && (
        <div className="overlay">
          <h2 className="overlay-text">Swapped</h2>
        </div>
      )}
      <div className="card-body-content">
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
                  <Carousel.Item
                    key={imgIndex}
                    onClick={() => {
                      if (handleClick) {
                        handleClick(item?._id);
                        return;
                      } else {
                        navigate(`/item/${item?._id}`);
                      }
                    }}
                  >
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
        <div
          className="card-content"
          onClick={() => {
            if (handleClick) {
              handleClick(item?._id);
              return;
            } else {
              navigate(`/item/${item?._id}`);
            }
          }}
        >
          <h5 className="title">{item?.name}</h5>
          <p className="product-price">{item?.description}</p>
          <span className="author-name">{item?.user_id?.username}</span>
          <div className="profile-info">
            <Image
              src={profile}
              alt="seller image"
              roundedCircle
              className="me-3"
              width={50}
              height={50}
            />
            <span className="profile-name">
              Saved from {item?.user_id?.username}'s post
            </span>
          </div>
        </div>
      </div>
      {ProposeItemButton ? (
        <ProposeItemButton id={item?._id} />
      ) : (
        <ButtonGroup className="action-buttons">
          <Button
            variant="light"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              alignContent: "center",
              gap: "10px",
            }}
            onClick={handleMessageClick}
          >
            <RiMessengerLine style={{ fontSize: "1.4rem" }} />
            Message
          </Button>
          <Button
            variant="light"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              alignContent: "center",
              gap: "10px",
            }}
            onClick={unmarkAsWishlist}
          >
            <MdFavorite style={{ fontSize: "1.5rem" }} />
            Remove
          </Button>
        </ButtonGroup>
      )}
    </Card>
  );
};

export default memo(WishListItemCard);
