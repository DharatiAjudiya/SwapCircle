import React, { Suspense, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToastContext } from "../Hooks/ToastContextHook";
import { clearWishListState } from "../stores/WishList/WishListSlice";
import demoProfileImg from "/images/demo-profile.jpg";
import {
  clearUserState,
  GetItemByUserApi,
  GetSingleUserApi,
  GetSwapHistoryByUserApi,
  GetWishListByUserApi,
} from "../stores/User/UserSlice";
import { Breadcrumb, Col, Container, Row, Tab, Tabs } from "react-bootstrap";
import ProfileSidebar from "../src/components/layouts/ProfileSidebar";
import { CSSTransition } from "react-transition-group";
import VerticalItemCard from "../src/components/Cards/VerticalItemCard";
import { NODE_APP_URL } from "../config/app_config";
import "./SwapHistory.css";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import ProfileSidebarSkeleton from "../src/components/Skeletons/Layout/ProfileSidebarSkeleton";
import VerticalItemCardSkeleton from "../src/components/Skeletons/Cards/VerticalItemCardSkeleton";
import { Skeleton } from "@mui/material";

const SwapHistory = () => {
  const { data } = useSelector((state) => state.AuthUserStore);
  const { singleData, history, loading } = useSelector(
    (state) => state.UserStore
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();
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

  useEffect(() => {
    if (data?.id) {
      dispatch(GetSingleUserApi({ id: data?.id }));
      dispatch(GetSwapHistoryByUserApi());
      setTimeout(() => {
        dispatch(clearUserState());
      }, 500);
    }
  }, [dispatch, data?.id]);

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

  return (
    <Container fluid>
      <Breadcrumb>
        <Breadcrumb.Item href="#" onClick={() => navigate("/")}>
          Home
        </Breadcrumb.Item>
        <Breadcrumb.Item active>History</Breadcrumb.Item>
      </Breadcrumb>
      <Row>
        <Col
          xs={12}
          sm={6}
          md={6}
          lg={3}
          className="d-flex flex-column align-items-center p-3"
          style={{ borderRight: "1px solid rgb(var(--color-black)))" }}
        >
          <Suspense fallback={<ProfileSidebarSkeleton />}>
            {loading ? (
              <ProfileSidebarSkeleton />
            ) : (
              <ProfileSidebar profile={profile} singleData={singleData} />
            )}
          </Suspense>
        </Col>

        <Col xs={12} sm={6} md={6} lg={9}>
          <Container fluid>
            <CSSTransition
              in={true}
              timeout={300}
              classNames="fade"
              unmountOnExit
            >
              <Container>
                <Row className="d-flex justify-content-center align-content-center align-items-center mx-1 mb-3">
                  <Col
                    xs={4}
                    className={`d-flex justify-content-center align-content-center align-items-center text-bg-dark`}
                  >
                    <div className="m-0 h5 swap-history-text">Your Items</div>
                  </Col>

                  {/* Swap Button */}
                  <Col
                    xs={4}
                    className={`text-center d-flex justify-content-center align-content-center align-items-center`}
                  >
                    <div className="text-center h2 swap-history-title">
                      Swap History
                    </div>
                  </Col>

                  {/* Second Card */}
                  <Col
                    xs={4}
                    className={`d-flex justify-content-center align-content-center align-items-center text-bg-dark`}
                  >
                    <div className="m-0 h5 swap-history-text">
                      Bartered With
                    </div>
                  </Col>
                </Row>
                {loading ? (
                  <Row className="d-flex justify-content-center align-content-center align-items-center">
                    <Col xs={4} className="mb-4">
                      <VerticalItemCardSkeleton />
                    </Col>

                    <Col
                      xs={4}
                      className="text-center d-flex justify-content-center align-content-center align-items-center swap-history-btn-container"
                    >
                      <Skeleton width="100%" height={40} />
                    </Col>

                    <Col xs={4} className="mb-4">
                      <VerticalItemCardSkeleton />
                    </Col>
                  </Row>
                ) : (
                  <>
                    {history &&
                      history.length > 0 &&
                      history.map((item, index) => (
                        <div key={index}>
                          <Row className="d-flex justify-content-center align-content-center align-items-center">
                            <Col
                              xs={4}
                              className={`item-col mb-4 ${
                                singleData?._id === item?.items[0].user_id?._id
                                  ? "order-1"
                                  : "order-3"
                              }`}
                            >
                              <VerticalItemCard
                                item={item?.items[0]}
                                isWishlisted={wishlistIds.includes(
                                  item?.items[0]?._id
                                )}
                              />
                            </Col>

                            {/* Swap Button */}
                            <Col
                              xs={4}
                              className={`text-center d-flex justify-content-center align-content-center align-items-center swap-history-btn-container order-2`}
                            >
                              Swapped on :{" "}
                              {moment(item?.createdAt).format(
                                "DD/MM/YYYY HH:mm A"
                              )}
                            </Col>

                            {/* Second Card */}
                            <Col
                              xs={4}
                              className={`item-col mb-4 ${
                                singleData?._id === item?.items[1].user_id?._id
                                  ? "order-1"
                                  : "order-3"
                              }`}
                            >
                              <VerticalItemCard
                                item={item?.items[1]}
                                isWishlisted={wishlistIds.includes(
                                  item?.items[1]?._id
                                )}
                              />
                            </Col>
                          </Row>
                        </div>
                      ))}
                  </>
                )}
              </Container>
            </CSSTransition>
          </Container>
        </Col>
      </Row>
    </Container>
  );
};

export default SwapHistory;
