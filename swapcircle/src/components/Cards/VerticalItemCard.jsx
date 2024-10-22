import React, { useEffect, useState } from "react";
import { Card, Button, Carousel } from "react-bootstrap";
import {
  MdFavoriteBorder,
  MdFavorite,
  MdOutlineSwapHoriz,
} from "react-icons/md";
import { TbEdit } from "react-icons/tb";
import "./VerticalItemCard.css"; // Import the CSS file
import { NODE_APP_URL } from "../../../config/app_config";
import { useDispatch, useSelector } from "react-redux";
import {
  AddWishListApi,
  DeleteWishListApi,
  GetWishListApi,
} from "../../../stores/WishList/WishListSlice";
import { Tooltip } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useSweetAlert } from "../../../Hooks/AlertHooks";
import { useToastContext } from "../../../Hooks/ToastContextHook";
import { FaRegHeart } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import {
  clearUserState,
  GetItemBySpecificUserApi,
  GetItemByUserApi,
} from "../../../stores/User/UserSlice";
import { DeleteItemApi } from "../../../stores/Item/ItemSlice";
import {
  AddChatRoomApi,
  clearChatroomState,
} from "../../../stores/Chat/ChatroomSlice";

const VerticalItemCard = ({ item, isWishlisted = false }) => {
  const [index, setIndex] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  let showEdit = location.pathname.startsWith("/profile") ? true : false;

  const { MySwal, toastType, showToast } = useToastContext();
  const { status, message } = useSelector((state) => state.ItemStore);

  useEffect(() => {
    if (status === true) {
      toastType.current = {
        severity: "success",
        summary: "Success",
        detail: message,
      };
      showToast("top-right");
      dispatch(clearUserState());
    } else if (status === false) {
      toastType.current = {
        severity: "error",
        summary: "Error",
        detail: message,
      };
      showToast("top-right");
      dispatch(clearUserState());
    }
  }, [status]);
  const { showCancelledMessage, confirmDialog } = useSweetAlert();

  const markAsWishlist = async (id) => {
    // const result = await confirmDialog({
    //   title: "Confirm",
    //   message: "Do you want to add this item to your wishlist?",
    // });
    // if (result.isConfirmed) {
    await dispatch(AddWishListApi({ id }));
    await dispatch(GetWishListApi());
    // } else if (result.dismiss === MySwal.DismissReason.cancel) {
    //   showCancelledMessage();
    // }
  };

  const unmarkAsWishlist = async (id) => {
    // const result = await confirmDialog({
    //   message: "Do you want to remove this item from your wishlist?",
    // });
    // if (result.isConfirmed) {
    await dispatch(DeleteWishListApi({ id }));
    await dispatch(GetWishListApi());
    // } else if (result.dismiss === MySwal.DismissReason.cancel) {
    //   showCancelledMessage();
    // }
  };

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  const handleItemEdit = () => {
    navigate(`/item/edit/${item._id}`);
  };

  const handleItemDelete = async (id) => {
    const result = await confirmDialog({});
    if (result.isConfirmed) {
      await dispatch(DeleteItemApi({ id }));
      await dispatch(GetItemBySpecificUserApi({ id: item?.user_id?._id }));
    } else if (result.dismiss === MySwal.DismissReason.cancel) {
      showCancelledMessage();
    }
  };

  const { status: chatroomStatus, singleChat } = useSelector(
    (state) => state.ChatroomStore
  );

  useEffect(() => {
    if (chatroomStatus === true) {
      dispatch(clearChatroomState());

      window.location.href = `/chat?chatId=${singleChat?._id}`;
      // navigate(`/chat?chatId=${singleChat?._id}`);
    }
  }, [chatroomStatus]);

  const handleSwapClick = async () => {
    await dispatch(
      AddChatRoomApi({
        values: {
          members_id: item?.user_id?._id,
          item_id: [item?._id],
        },
      })
    );
  };

  return (
    <>
      <Card className="v-item-card-container">
        {/* Overlay only visible when item is sold */}

        {/* Floating Button */}
        <div style={{ position: "relative", zIndex: "1" }}>
          <Carousel
            activeIndex={index}
            onSelect={handleSelect}
            style={{ zIndex: 1 }}
          >
            {item?.images.map((src, imgIndex) => {
              let imgUrl =
                src.startsWith("http") || src.startsWith("https")
                  ? src
                  : `${NODE_APP_URL}/uploads/items/${src}`;

              return (
                <Carousel.Item
                  key={imgIndex}
                  onClick={() => navigate(`/item/${item?._id}`)}
                >
                  <img
                    src={imgUrl}
                    alt={`Slide ${imgIndex}`}
                    className="carousel-image"
                  />
                </Carousel.Item>
              );
            })}
          </Carousel>

          {item?.selling_status !== "sold" && (
            <>
              {showEdit ? (
                <>
                  <Tooltip title="Edit Item" arrow placement="left">
                    <Button
                      className="edit-item-btn"
                      variant="light"
                      onClick={handleItemEdit}
                    >
                      <TbEdit />
                    </Button>
                  </Tooltip>
                  <Tooltip title="Delete Item" arrow placement="left">
                    <Button
                      className="delete-item-btn"
                      variant="light"
                      onClick={() => handleItemDelete(item._id)}
                    >
                      <RiDeleteBin6Line />
                    </Button>
                  </Tooltip>
                </>
              ) : (
                <>
                  {isWishlisted ? (
                    <Tooltip
                      title="Remove From  Wishlist"
                      arrow
                      placement="right"
                    >
                      <Button
                        className="wishlist-btn"
                        variant="light"
                        onClick={() => unmarkAsWishlist(item._id)}
                      >
                        <MdFavorite />
                      </Button>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Add To Wishlist" arrow placement="right">
                      <Button
                        className="wishlist-btn"
                        variant="light"
                        onClick={() => markAsWishlist(item._id)}
                      >
                        <MdFavoriteBorder />
                      </Button>
                    </Tooltip>
                  )}
                  <Tooltip title="Propose a swap" arrow placement="right">
                    <Button
                      className="swap-btn"
                      variant="light"
                      onClick={() => handleSwapClick()}
                      // onClick={() => unmarkAsWishlist(item._id)}
                    >
                      <MdOutlineSwapHoriz />
                    </Button>
                  </Tooltip>
                </>
              )}
            </>
          )}
        </div>

        {/* Card Content */}
        <Card.Body
          className="ps-0"
          onClick={() => navigate(`/item/${item?._id}`)}
        >
          <Card.Title className="v-item-card-title">{item?.name}</Card.Title>
          <Card.Text className="v-item-card-text">
            {item?.description}
          </Card.Text>
        </Card.Body>
      </Card>
    </>
  );
};

export default VerticalItemCard;
