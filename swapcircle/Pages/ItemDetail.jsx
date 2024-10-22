import React, { useEffect, useRef, useState } from "react";
import {
  Container,
  Row,
  Col,
  Carousel,
  Image,
  Button,
  Card,
  Breadcrumb,
} from "react-bootstrap";
import { IoShareSocialOutline } from "react-icons/io5";
import { RiMessengerLine } from "react-icons/ri";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { IoChatboxEllipsesOutline, IoEyeOutline } from "react-icons/io5";
import "./ItemDetail.css";
import { Rating, Skeleton, Tooltip } from "@mui/material";
import VerticalItemCard from "../src/components/Cards/VerticalItemCard";
import { debounce, groupItems } from "../Helpers/PreventScroll";
import { HiMiniArrowLongLeft, HiMiniArrowLongRight } from "react-icons/hi2";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GetSingleItemApi } from "../stores/Item/ItemSlice";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import { NODE_APP_URL } from "../config/app_config";
import { useSweetAlert } from "../Hooks/AlertHooks";
import { useToastContext } from "../Hooks/ToastContextHook";
import {
  AddWishListApi,
  clearWishListState,
  DeleteWishListApi,
  GetWishListApi,
} from "../stores/WishList/WishListSlice";
import {
  AddChatRoomApi,
  clearChatroomState,
} from "../stores/Chat/ChatroomSlice";
import {
  GetCustomerLikedApi,
  GetSimilarItemApi,
} from "../stores/Preference/PreferenceSlice";
import ItemDetailContainerSkeleton from "../src/components/Skeletons/Layout/ItemDetailContainerSkeleton";
import PreferenceContainerSkeleton from "../src/components/Skeletons/Layout/PreferenceContainerSkeleton";

const ItemDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { singleData, loading } = useSelector((state) => state.ItemStore);
  const {
    spData,
    clData,
    loading: prefLoading,
  } = useSelector((state) => state.PreferenceStore);
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

  const markerRef = useRef(null);
  const mapRef = useRef(null);

  const [itemsPerGroup, setItemsPerGroup] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      let newItemsPerGroup = 4;

      if (screenWidth >= 992) {
        newItemsPerGroup = 4;
      } else if (screenWidth >= 768) {
        newItemsPerGroup = 3;
      } else if (screenWidth >= 576) {
        newItemsPerGroup = 4;
      } else {
        newItemsPerGroup = 2;
      }

      setItemsPerGroup(newItemsPerGroup);
    };

    // Debounce the resize event handler
    const debounceResize = debounce(handleResize, 100);

    window.addEventListener("resize", debounceResize);
    handleResize(); // Initial check

    return () => window.removeEventListener("resize", debounceResize);
  }, []);

  useEffect(() => {
    dispatch(GetSingleItemApi({ id }));
    dispatch(GetWishListApi());
  }, [dispatch, id]);

  useEffect(() => {
    if (singleData?.category_id?._id) {
      dispatch(
        GetSimilarItemApi({
          id: singleData?._id,
          categoryId: singleData?.category_id?._id,
          name: singleData?.name,
        })
      );
      dispatch(
        GetCustomerLikedApi({
          id: singleData?._id,
          categoryId: singleData?.category_id?._id,
        })
      );
    }
  }, [dispatch, id, singleData?.category_id?._id]);

  const { data, status, message } = useSelector((state) => state.WishListStore);
  const { toastType, showToast } = useToastContext();

  useEffect(() => {
    if (status === true) {
      toastType.current = {
        severity: "success",
        summary: "Success",
        detail: message,
      };
      showToast("top-right");
      dispatch(clearWishListState());
    } else if (status === false) {
      toastType.current = {
        severity: "error",
        summary: "Error",
        detail: message,
      };
      showToast("top-right");
      dispatch(clearWishListState());
    }
  }, [status]);

  const [index, setIndex] = useState({
    imageCarousel: 0,
    SpIndex: 0,
    ClIndex: 0,
  });

  const handleSelect = (selectedIndex, module) => {
    setIndex((prev) => {
      let newIndex = prev;
      newIndex[module] = selectedIndex;
      return { ...newIndex };
    });
  };

  const [groupedItems, setGroupedItems] = useState({
    SpIndex: [],
    ClIndex: [],
  });

  useEffect(() => {
    setGroupedItems((prev) => {
      let _SpIndex = groupItems(spData, itemsPerGroup);
      let _ClIndex = groupItems(clData, itemsPerGroup);
      return {
        ...prev,
        SpIndex: _SpIndex,
        ClIndex: _ClIndex,
      };
    });
    setIndex((prev) => {
      return {
        ...prev,
        SpIndex: 0,
        ClIndex: 0,
      };
    });
  }, [itemsPerGroup, spData, clData]);

  // Handle previous and next actions
  const handlePrev = (e, module) => {
    setIndex((prev) => {
      let newIndex = prev;
      newIndex[module] =
        newIndex[module] === 0
          ? groupedItems[module].length - 1
          : newIndex[module] - 1;
      return { ...newIndex };
    });
  };

  const handleNext = (e, module) => {
    setIndex((prev) => {
      let newIndex = prev;
      newIndex[module] =
        newIndex[module] === groupedItems[module].length - 1
          ? 0
          : newIndex[module] + 1;
      return { ...newIndex };
    });
  };

  const [images, setImages] = useState([]);
  const [profile, setProfile] = useState("");
  useEffect(() => {
    if (singleData?.images) {
      let imgs = singleData?.images.map((src) => {
        let _src =
          src.startsWith("http://") || src.startsWith("https://")
            ? src
            : `${NODE_APP_URL}/uploads/items/${src}`;
        return _src;
      });
      setImages(imgs);
    }
    if (singleData?.user_id?.profile) {
      let _src =
        singleData?.user_id?.profile.startsWith("http://") ||
        singleData?.user_id?.profile.startsWith("https://")
          ? singleData?.user_id?.profile
          : `${NODE_APP_URL}/uploads/users/${singleData?.user_id?.profile}`;
      setProfile(_src);
    }
  }, [singleData?.images, singleData?.user_id?.profile]);

  useEffect(() => {
    // Re-center the map whenever the position changes
    let zoom;
    if (singleData?.location?.city) {
      zoom = 9;
    } else if (singleData?.location?.state) {
      zoom = 6;
    } else if (singleData?.location?.country) {
      zoom = 3;
    } else {
      zoom = 12;
    }

    if (mapRef.current) {
      mapRef.current.setView(
        [singleData?.location?.lat, singleData?.location?.lng],
        zoom
      );
    }
  }, [singleData?.location]);

  let [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (data) {
      let _data = data.map((item) => item?.item_id?._id);
      let _ = _data.includes(singleData?._id);
      setIsWishlisted(_);
    }
  }, [data]);
  const { MySwal } = useToastContext();
  const { showCancelledMessage, confirmDialog } = useSweetAlert();

  const markAsWishlist = async () => {
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

  const unmarkAsWishlist = async () => {
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

  const handleMessageClick = async () => {
    await dispatch(
      AddChatRoomApi({
        values: {
          members_id: singleData?.user_id?._id,
          item_id: [singleData?._id],
        },
      })
    );
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  return (
    <Container className="detail-container">
      <Breadcrumb>
        <Breadcrumb.Item href="#" onClick={() => navigate("/")}>
          Home
        </Breadcrumb.Item>
        <Breadcrumb.Item
          href="#"
          onClick={() => navigate(`/shop/${singleData?.category_id?._id}`)}
        >
          {loading ? (
            <Skeleton
              variant="text"
              height={"100%"}
              width={80}
              sx={{ ml: 2 }}
            />
          ) : (
            singleData?.category_id?.category
          )}
        </Breadcrumb.Item>
        <Breadcrumb.Item active>
          {loading ? (
            <Skeleton
              variant="text"
              height={"100%"}
              width={80}
              sx={{ ml: 2 }}
            />
          ) : (
            singleData?.name
          )}
        </Breadcrumb.Item>
      </Breadcrumb>

      {loading ? (
        <ItemDetailContainerSkeleton />
      ) : (
        <Row>
          <Col md={8} className="my-3">
            <Row>
              <Col xs={4} sm={3} lg={2} className="p-0">
                <Container className="my-3 thumbnail-container">
                  <div className="thumbnail-scroll">
                    {images.map((src, imgIndex) => {
                      return (
                        <Image
                          key={imgIndex}
                          src={src}
                          className={`img-thumbnail ${
                            index["imageCarousel"] === imgIndex
                              ? "img-thumbnail-selected"
                              : ""
                          }`}
                          onClick={() =>
                            handleSelect(imgIndex, "imageCarousel")
                          }
                        />
                      );
                    })}
                  </div>
                </Container>
              </Col>

              <Col xs={8} sm={9} lg={10} className="main-image-carousel">
                <Carousel
                  activeIndex={index["imageCarousel"]}
                  onSelect={(selectedIndex) =>
                    handleSelect(selectedIndex, "imageCarousel")
                  }
                  style={{ zIndex: 1 }}
                >
                  {images.map((src, imgIndex) => {
                    return (
                      <Carousel.Item key={imgIndex}>
                        <Image
                          className="w-100"
                          src={src}
                          alt={`Slide ${imgIndex + 1}`}
                        />
                      </Carousel.Item>
                    );
                  })}
                </Carousel>
              </Col>
            </Row>
          </Col>

          <Col md={4} className="my-3">
            <Card className="my-3">
              {/* <Card.Title>Item Name</Card.Title> */}
              <Card.Title>{singleData?.name}</Card.Title>
              <Card.Text style={{ fontSize: "0.8rem" }}>
                {singleData?.description}
              </Card.Text>
              <Card.Text style={{ fontSize: "1.5rem" }}>
                {singleData?.price &&
                  `${singleData?.price[0] || ""} - ${
                    singleData?.price[1] || ""
                  }`}
              </Card.Text>

              {singleData?.selling_status !== "sold" && (
                <div
                  style={{ width: "100%", gap: "1rem" }}
                  className="d-flex justify-content-between align-items-center align-content-center mb-4"
                >
                  <Button className="chat-btn" onClick={handleMessageClick}>
                    <RiMessengerLine
                      style={{ fontSize: "1.4rem" }}
                      className="me-2"
                    />
                    Message
                  </Button>
                  {isWishlisted ? (
                    <Tooltip title="Remove From  Wishlist" arrow>
                      <Button
                        className="detail-wishlist-btn"
                        variant="light"
                        onClick={unmarkAsWishlist}
                      >
                        <MdFavorite style={{ fontSize: "1.5rem" }} />
                      </Button>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Add To Wishlist" arrow>
                      <Button
                        className="detail-wishlist-btn"
                        variant="light"
                        onClick={markAsWishlist}
                      >
                        <MdFavoriteBorder style={{ fontSize: "1.5rem" }} />
                      </Button>
                    </Tooltip>
                  )}
                </div>
              )}
              <Card.Text style={{ fontSize: "1rem", fontWeight: "bold" }}>
                Description
              </Card.Text>
              <Card.Text style={{ fontSize: "0.8rem" }}>
                {singleData?.description}
              </Card.Text>
            </Card>

            <Card className="my-3">
              <Card.Text style={{ fontSize: "1rem", fontWeight: "bold" }}>
                Seller information
              </Card.Text>
              <div className="d-flex ">
                <Image
                  src={profile}
                  alt="seller image"
                  roundedCircle
                  className="me-3"
                  width={50}
                  height={50}
                />
                <div className="d-flex flex-column justify-content-center align-items-start">
                  <Card.Text style={{ fontSize: "0.8rem" }} className="m-0">
                    {singleData?.user_id?.username}
                  </Card.Text>
                  <Rating
                    size="large"
                    name="rating"
                    value={parseFloat(singleData?.user_id?.average_rating) || 0}
                    precision={0.5}
                    readOnly
                    sx={{
                      "& .MuiRating-icon": {
                        fontSize: "1.3rem", // Increase the size of the rating stars
                        color: "rgb(var(--color-black))",
                      },
                    }}
                  />
                </div>
                <div className="mx-auto d-flex justify-content-center align-items-center">
                  <Button
                    variant="light"
                    onClick={() =>
                      navigate(`/user/profile/${singleData?.user_id?._id}`)
                    }
                  >
                    <IoEyeOutline
                      style={{ fontSize: "1.4rem" }}
                      className="me-2"
                    />
                    View Profile
                  </Button>
                </div>
              </div>
              <div className="d-flex my-3">
                {parseFloat(singleData?.user_id?.level) > 3 && (
                  <Image
                    src="/images/gold.webp"
                    className="me-3"
                    width={50}
                    height={50}
                    alt="Gold"
                    style={{ objectFit: "contain" }}
                  />
                )}
                {parseFloat(singleData?.user_id?.level) === 3 && (
                  <Image
                    src="/images/silver.webp"
                    className="me-3"
                    width={50}
                    height={50}
                    alt="Silver"
                    style={{ objectFit: "contain" }}
                  />
                )}

                {parseFloat(singleData?.user_id?.level) < 3 && (
                  <Image
                    src="/images/bronze.webp"
                    className="me-3"
                    width={50}
                    height={50}
                    alt="Bronze"
                    style={{ objectFit: "contain" }}
                  />
                )}
                <div className="d-flex flex-column justify-content-center align-items-start">
                  <Card.Text style={{ fontSize: "0.8rem" }} className="m-0">
                    Currently on
                    <strong> Level {singleData?.user_id?.level} </strong>{" "}
                    holding
                    <strong> {singleData?.user_id?.badges} badges</strong>{" "}
                  </Card.Text>
                </div>
              </div>
            </Card>

            <Card className="my-3">
              <Card.Text style={{ fontSize: "1rem", fontWeight: "bold" }}>
                Map Reference
              </Card.Text>
              <div style={{ height: "40vh", width: "100%" }}>
                <MapContainer
                  center={[
                    singleData?.location?.lat || 0,
                    singleData?.location?.lng || 0,
                  ]} // Center on the current data?.location?
                  zoom={14}
                  scrollWheelZoom={false}
                  style={{ height: "100%", width: "100% " }}
                  ref={mapRef}
                >
                  <TileLayer
                    attribution={`<a href="https://maps.google.com/?q=${singleData?.location?.lat},${singleData?.location?.lng}" target="_blank" rel="noopener noreferrer" style="font-size:1rem;">Open in larger map</a>`}
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker
                    position={[
                      singleData?.location?.lat || 0,
                      singleData?.location?.lng || 0,
                    ]}
                    ref={markerRef}
                  />
                  {/* <Marker position={[data?.location?.lat, data?.location?.lng]} ref={markerRef} /> */}
                </MapContainer>
              </div>
              <Card.Text className="mt-4 m-0">
                {singleData?.location?.city &&
                  `${singleData?.location?.city}, `}
                {singleData?.location?.state &&
                  `${singleData?.location?.state}, `}
                {singleData?.location?.country &&
                  `${singleData?.location?.country}`}
                {singleData?.location?.postcode &&
                  `- ${singleData?.location?.postcode}`}
              </Card.Text>
              <Card.Text style={{ fontSize: "0.8rem" }}>
                Location is approximate
              </Card.Text>
            </Card>
          </Col>
        </Row>
      )}
      <Container style={{ marginTop: "8rem" }} className="similar-products">
        {prefLoading ? (
          <PreferenceContainerSkeleton />
        ) : (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginLeft: "2rem",
              }}
            >
              <h1 style={{ marginRight: "auto" }}>Similar Products</h1>
              <Button
                className="indicator-btn me-2"
                onClick={(e) => handlePrev(e, "SpIndex")}
                disabled={index["SpIndex"] === 0 ? true : false}
              >
                <HiMiniArrowLongLeft style={{ fontSize: "2rem" }} />
              </Button>
              <Button
                className="indicator-btn"
                onClick={(e) => handleNext(e, "SpIndex")}
                disabled={
                  index["SpIndex"] >= groupedItems["SpIndex"].length - 1
                    ? true
                    : false
                }
              >
                <HiMiniArrowLongRight style={{ fontSize: "2rem" }} />
              </Button>
            </div>

            <Carousel
              activeIndex={index["SpIndex"]}
              onSelect={(selectedIndex) =>
                handleSelect(selectedIndex, "SpIndex")
              }
              indicators={false}
              controls={false}
              className="mt-4"
            >
              {groupedItems &&
                groupedItems["SpIndex"] &&
                groupedItems["SpIndex"].map((group, idx) => (
                  <Carousel.Item key={idx}>
                    <Row
                      style={{
                        display: "flex",
                        flexWrap: "nowrap",
                        marginRight: "-15px",
                        marginLeft: "-15px",
                        padding: "0 1rem",
                        width: "100%",
                      }}
                    >
                      {group.map((item, i) => (
                        <Col
                          key={i}
                          xs={6}
                          sm={3}
                          md={4}
                          lg={3}
                          style={{ flex: "0 0 auto" }}
                        >
                          <VerticalItemCard item={item} />
                        </Col>
                      ))}
                    </Row>
                  </Carousel.Item>
                ))}
            </Carousel>
          </>
        )}
      </Container>

      <Container
        style={{ marginTop: "8rem", marginBottom: "8rem" }}
        className="customer-also-liked"
      >
        {prefLoading ? (
          <PreferenceContainerSkeleton />
        ) : (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginLeft: "2rem",
              }}
            >
              <h1 style={{ marginRight: "auto" }}>Customer Also Liked</h1>
              <Button
                className="indicator-btn me-2"
                onClick={(e) => handlePrev(e, "ClIndex")}
                disabled={index["ClIndex"] === 0 ? true : false}
              >
                <HiMiniArrowLongLeft style={{ fontSize: "2rem" }} />
              </Button>
              <Button
                className="indicator-btn"
                onClick={(e) => handleNext(e, "ClIndex")}
                disabled={
                  index["ClIndex"] >= groupedItems["ClIndex"].length - 1
                    ? true
                    : false
                }
              >
                <HiMiniArrowLongRight style={{ fontSize: "2rem" }} />
              </Button>
            </div>

            <Carousel
              activeIndex={index["ClIndex"]}
              onSelect={(selectedIndex) =>
                handleSelect(selectedIndex, "ClIndex")
              }
              indicators={false}
              controls={false}
              className="mt-4"
            >
              {groupedItems &&
                groupedItems["ClIndex"] &&
                groupedItems["ClIndex"].map((group, idx) => (
                  <Carousel.Item key={idx}>
                    <Row
                      style={{
                        display: "flex",
                        flexWrap: "nowrap",
                        marginRight: "-15px",
                        marginLeft: "-15px",
                        padding: "0 1rem",
                        width: "100%",
                      }}
                    >
                      {group.map((item, i) => (
                        <Col
                          key={i}
                          xs={6}
                          sm={3}
                          md={4}
                          lg={3}
                          style={{ flex: "0 0 auto" }}
                        >
                          <VerticalItemCard item={item} />
                        </Col>
                      ))}
                    </Row>
                  </Carousel.Item>
                ))}
            </Carousel>
          </>
        )}
      </Container>
    </Container>
  );
};

export default ItemDetail;
