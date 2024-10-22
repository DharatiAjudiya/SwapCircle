import React, { lazy, Suspense, useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Image,
  Button,
  Tabs,
  Tab,
  Breadcrumb,
} from "react-bootstrap";
import { CSSTransition } from "react-transition-group";
import { FaRegEdit, FaEye } from "react-icons/fa";
import "./Profile.css";
import demoProfileImg from "/images/demo-profile.jpg";
import { useDispatch, useSelector } from "react-redux";
import {
  clearUserState,
  GetItemBySpecificUserApi,
  GetItemByUserApi,
  GetSingleUserApi,
  GetWishListByUserApi,
} from "../stores/User/UserSlice";
import { NODE_APP_URL } from "../config/app_config";
import VerticalItemCard from "../src/components/Cards/VerticalItemCard";
import {
  clearWishListState,
  GetWishListApi,
} from "../stores/WishList/WishListSlice";
import { useToastContext } from "../Hooks/ToastContextHook";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import WishListItemCard from "../src/components/Cards/WishListItemCard";
import { useMediaQuery } from "@mui/system";
import ProfileSidebarSkeleton from "../src/components/Skeletons/Layout/ProfileSidebarSkeleton";
import EditProfileFormSkeleton from "../src/components/Skeletons/Forms/EditProfileFormSkeleton";
const EditProfileForm = lazy(() =>
  import("../src/components/Forms/EditProfileForm")
);
const ProfileSidebar = lazy(() =>
  import("../src/components/layouts/ProfileSidebar")
);
const VerticalItemCardSkeleton = lazy(() =>
  import("../src/components/Skeletons/Cards/VerticalItemCardSkeleton")
);
const WishListItemCardSkeleton = lazy(() =>
  import("../src/components/Skeletons/Cards/WishListItemCardSkeleton")
);

const Profile = () => {
  const [editMode, setEditMode] = useState(false);
  const { data } = useSelector((state) => state.AuthUserStore);
  const { singleData, loading } = useSelector((state) => state.UserStore);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { toastType, showToast } = useToastContext();

  const {
    data: wishlistData,
    status,
    message,
  } = useSelector((state) => state.WishListStore);
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

  const handleEditModeOn = () => setEditMode(true);
  const handleEditModeOff = () => setEditMode(false);

  useEffect(() => {
    if (id) {
      dispatch(GetSingleUserApi({ id: id }));
      dispatch(GetItemBySpecificUserApi({ id: id }));
    } else {
      dispatch(GetSingleUserApi({ id: data?.id }));
      dispatch(GetItemBySpecificUserApi({ id: data?.id }));
      dispatch(GetWishListByUserApi());
    }
    setTimeout(() => {
      dispatch(clearUserState());
    }, 500);
  }, [dispatch, data?.id, id]);

  let [wishlistIds, setWishlistIds] = useState([]);

  useEffect(() => {
    if (wishlistData) {
      let _data = wishlistData.map((item) => item?.item_id?._id);
      setWishlistIds(_data);
    }
  }, [wishlistData]);

  const [profile, setProfile] = useState(demoProfileImg);

  useEffect(() => {
    let _profile =
      singleData?.profile && singleData?.profile.startsWith("http")
        ? singleData?.profile
        : `${NODE_APP_URL}/uploads/users/${singleData?.profile}`;

    setProfile(_profile);
  }, [singleData?.profile]);

  const [activeTab, setActiveTab] = useState("ITEMS");

  useEffect(() => {
    let hash = window.location.hash.replace("#", "") || "ITEMS";
    hash = hash.toUpperCase();
    if (hash === "WISHLIST") {
      setActiveTab("WISHLIST");
    } else {
      setActiveTab("ITEMS");
    }
  }, [window.location.hash]);

  const handleTabSelect = (key) => {
    setActiveTab(key);
  };

  const [wishlistItems, setWishlistItems] = useState([]);
  useEffect(() => {
    if (singleData?.wishlist) {
      let _data = singleData?.wishlist.map((item) => item?.item_id);
      setWishlistItems(_data);
    }
  }, [singleData?.wishlist]);

  const isMobile = useMediaQuery("(max-width: 768px)"); // Add media query

  return (
    <Container fluid>
      <Breadcrumb>
        <Breadcrumb.Item href="#" onClick={() => navigate("/")}>
          Home
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Profile</Breadcrumb.Item>
      </Breadcrumb>
      <Row>
        <Col
          xs={12}
          sm={6}
          md={6}
          lg={3}
          className={`d-flex flex-column align-items-center p-3 ${
            id ? (isMobile ? "order-1" : "order-2") : "order-1"
          }`}
          style={{ borderRight: "1px solid rgb(var(--color-black)))" }}
        >
          <Suspense fallback={<ProfileSidebarSkeleton />}>
            {loading ? (
              <ProfileSidebarSkeleton />
            ) : (
              <ProfileSidebar
                profile={profile}
                singleData={singleData}
                editMode={editMode}
                handleEditModeOff={handleEditModeOff}
                handleEditModeOn={handleEditModeOn}
              />
            )}
          </Suspense>
        </Col>

        <Col
          xs={12}
          sm={6}
          md={6}
          lg={9}
          className={`${id ? (isMobile ? "order-2" : "order-1") : "order-2"}`}
        >
          <Container className="edit-profile-container" fluid>
            {!id && (
              <CSSTransition
                in={editMode}
                timeout={300}
                classNames="fade"
                unmountOnExit
              >
                <Suspense fallback={<EditProfileFormSkeleton />}>
                  {loading ? (
                    <EditProfileFormSkeleton />
                  ) : (
                    <EditProfileForm singleData={singleData} />
                  )}
                </Suspense>
              </CSSTransition>
            )}
            <CSSTransition
              in={!editMode}
              timeout={300}
              classNames="fade"
              unmountOnExit
            >
              <>
                <Container className="tab-container">
                  <Tabs
                    activeKey={activeTab}
                    onSelect={handleTabSelect}
                    defaultActiveKey="ITEMS"
                    className="mb-3"
                    fill
                  >
                    <Tab eventKey="ITEMS" title="Listed Items">
                      <Row style={{ marginTop: "20px", width: "100%" }}>
                        {loading ? (
                          Array(4)
                            .fill()
                            .map((_, i) => (
                              <Col
                                key={i}
                                xs={4}
                                sm={6}
                                md={6}
                                lg={3}
                                className="mb-4"
                              >
                                <VerticalItemCardSkeleton />
                              </Col>
                            ))
                        ) : (
                          <>
                            {singleData?.items &&
                              singleData?.items?.map((item, i) => {
                                return (
                                  <Col
                                    key={i}
                                    xs={4}
                                    sm={6}
                                    md={6}
                                    lg={3}
                                    className={`item-col mb-4`}
                                    // style={{ flex: "0 0 auto", opacity: 0 }}
                                  >
                                    <Suspense
                                      fallback={<VerticalItemCardSkeleton />}
                                    >
                                      <VerticalItemCard
                                        item={item}
                                        isWishlisted={wishlistIds.includes(
                                          item._id
                                        )}
                                      />
                                    </Suspense>
                                  </Col>
                                );
                              })}
                          </>
                        )}
                      </Row>
                    </Tab>
                    {!id && (
                      <Tab eventKey="WISHLIST" title="Wish List">
                        <CSSTransition
                          in={activeTab === "WISHLIST"}
                          timeout={500}
                          classNames="slide"
                          unmountOnExit
                        >
                          <Row>
                            {loading ? (
                              Array(2)
                                .fill()
                                .map((_, i) => (
                                  <Col key={i} md={12} lg={6} className="mb-4">
                                    <WishListItemCardSkeleton />
                                  </Col>
                                ))
                            ) : (
                              <>
                                {wishlistItems?.map((item, i) => (
                                  <Col key={i} md={12} lg={6} className="mb-4">
                                    <Suspense
                                      fallback={<WishListItemCardSkeleton />}
                                    >
                                      <WishListItemCard
                                        item={item}
                                        isWishlisted={wishlistIds.includes(
                                          item._id
                                        )}
                                      />
                                    </Suspense>
                                  </Col>
                                ))}
                              </>
                            )}
                          </Row>
                        </CSSTransition>
                      </Tab>
                    )}
                  </Tabs>
                </Container>
              </>
            </CSSTransition>
          </Container>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
