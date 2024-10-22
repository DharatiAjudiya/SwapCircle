import React, { useEffect, useState, useRef } from "react";
import {
  Container,
  Navbar,
  Nav,
  Button,
  Form,
  FormControl,
  Carousel,
  Image,
  Row,
  Col,
  Card,
} from "react-bootstrap";
import { CiSearch } from "react-icons/ci";
import "./Home.css"; // Custom CSS file
import { useNavigate } from "react-router-dom";
import {
  Autocomplete,
  InputAdornment,
  TextField,
  useMediaQuery,
} from "@mui/material";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaTwitter,
  FaInstagram,
  FaApple,
  FaGooglePlay,
  FaYoutube,
  FaRegHeart,
} from "react-icons/fa";
import { MdFavoriteBorder, MdOutlineSwapHoriz } from "react-icons/md";
import VerticalItemCard from "../src/components/Cards/VerticalItemCard";
import { categoryColors, itemData } from "../Data/items";
import {
  HiMiniArrowLongLeft,
  HiMiniArrowLongRight,
  HiOutlineArrowLongLeft,
} from "react-icons/hi2";
import ProfileDropdown from "../src/components/Dropdowns/ProfileDropdown";
import { debounce, groupItems } from "../Helpers/PreventScroll";
import { useDispatch, useSelector } from "react-redux";
import { GetItemApi } from "../stores/Item/ItemSlice";
import {
  clearWishListState,
  GetWishListApi,
} from "../stores/WishList/WishListSlice";
import { useToastContext } from "../Hooks/ToastContextHook";
import { GetCategoryApi } from "../stores/Category/CategorySlice";
import ProfileCard from "../src/components/Cards/ProfileCard";
import { GetHomeApi } from "../stores/Home/HomeSlice";
import { NODE_APP_URL } from "../config/app_config";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import { AutoScroll } from "@splidejs/splide-extension-auto-scroll"; // Import AutoScroll plugin
import VerticalItemCardSkeleton from "../src/components/Skeletons/Cards/VerticalItemCardSkeleton";
import ProfileCardSkeleton from "../src/components/Skeletons/Cards/ProfileCardSkeleton";
import CategoryCardSkeleton from "../src/components/Skeletons/Cards/CategoryCardSkeleton";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const topRatedRef = useRef(null);
  const categoryRef = useRef(null);
  const leftBannerRef = useRef(null);
  const rightBannerRef = useRef(null);
  const joinBannerRef = useRef(null);
  const [animateText, setAnimateText] = useState(false);
  const [animateCategories, setAnimateCategories] = useState(false);
  const [animateLeft, setAnimateLeft] = useState(false); // State for left banner animation
  const [animateRight, setAnimateRight] = useState(false); // State for right banner animation
  const [animateJoinBanner, setAnimateJoinBanner] = useState(false);
  const [displayedItems, setDisplayedItems] = useState(0);
  const [displayedCategories, setDisplayedCategories] = useState(1);
  const isMobile = useMediaQuery("(max-width: 575.98px)");
  const { topUsers, topRatedProducts, categories, loading } = useSelector(
    (state) => state.HomeStore
  );
  const {
    data: wishlistData,
    status,
    message,
  } = useSelector((state) => state.WishListStore);
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

  useEffect(() => {
    dispatch(GetHomeApi());
    dispatch(GetWishListApi());
  }, [dispatch]);

  let [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    if (wishlistData) {
      let _data = wishlistData.map((item) => item?.item_id?._id);
      setWishlistItems(_data);
    }
  }, [wishlistData]);

  const [index, setIndex] = useState(0); // State to track the active slide

  const [groupedItems, setGroupedItems] = useState([]);
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
        newItemsPerGroup = 2;
      } else {
        newItemsPerGroup = 1;
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
    setGroupedItems(groupItems(topRatedProducts, itemsPerGroup));
    setIndex(0); // Reset the carousel index when itemsPerGroup changes
  }, [topRatedProducts, itemsPerGroup]);

  // Trigger animation when text enters the viewport
  useEffect(() => {
    const handleScroll = () => {
      const rect = topRatedRef.current.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.8 && !animateText) {
        setAnimateText(false); // Reset animation trigger
        setTimeout(() => setAnimateText(true), 0); // Re-trigger animation
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [animateText]);

  // Animate items one by one with staggered delays
  useEffect(() => {
    if (animateText && displayedItems < topRatedProducts.length) {
      const timer = setTimeout(() => {
        setDisplayedItems((prev) =>
          Math.min(prev + 1, topRatedProducts.length)
        );
      }, 50); // Adjust the timing for smoother reveal (300 ms stagger delay)

      return () => clearTimeout(timer);
    }
  }, [animateText, displayedItems, topRatedProducts.length]);

  // Animation on scroll
  useEffect(() => {
    const handleScroll = () => {
      // For "Shop By Category"
      if (categoryRef.current) {
        const rect = categoryRef.current.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.8 && !animateCategories) {
          console.log("Category section entered viewport");
          setAnimateCategories(true);
        }
      }

      // For "Top Rated Seller"
      if (topRatedRef.current) {
        const rect = topRatedRef.current.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.8 && !animateText) {
          console.log("Top Rated Seller text entered viewport");
          setAnimateText(true);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup
    return () => window.removeEventListener("scroll", handleScroll);
  }, [animateCategories, animateText]);

  // Incremental display of categories
  useEffect(() => {
    if (animateCategories && displayedCategories < categories.length) {
      const timer = setTimeout(() => {
        setDisplayedCategories((prev) => Math.min(prev + 1, categories.length));
      }, 80); // Adjust timing for smoother reveal (300 ms stagger delay)

      return () => clearTimeout(timer);
    }
  }, [animateCategories, displayedCategories, categories.length]);

  // Scroll animation for banners
  useEffect(() => {
    const handleScroll = () => {
      const leftRect = leftBannerRef.current.getBoundingClientRect();
      const rightRect = rightBannerRef.current.getBoundingClientRect();

      // Trigger left banner animation
      if (leftRect.top <= window.innerHeight * 0.8 && !animateLeft) {
        setAnimateLeft(true);
      }
      // Trigger right banner animation
      if (rightRect.top <= window.innerHeight * 0.8 && !animateRight) {
        setAnimateRight(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [animateLeft, animateRight]);

  // Trigger animation when the join banner enters the viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animateJoinBanner) {
          setAnimateJoinBanner(true);
          setTimeout(() => {
            setAnimateText(true); // Trigger text animation after banner is visible
          }, 300); // Delay the text animation slightly
        }
      },
      { threshold: 0.5 }
    );

    if (joinBannerRef.current) {
      observer.observe(joinBannerRef.current);
    }

    return () => {
      if (joinBannerRef.current) {
        observer.unobserve(joinBannerRef.current);
      }
    };
  }, [animateJoinBanner]);

  // Handle previous and next actions
  const handlePrev = () => {
    setIndex((prevIndex) =>
      prevIndex === 0 ? groupedItems.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setIndex((prevIndex) =>
      prevIndex === groupedItems.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <>
      <Container fluid className="carousel-container">
        <Carousel controls={false}>
          <Carousel.Item>
            <div
              className="carousel-item-content justify-content-center align-items-end align-content-end"
              style={{
                backgroundImage: `url("/images/banner5.png")`,
                backgroundSize: "cover",
                backgroundPosition: "top left",
              }}
            >
              <h1 className="font-weight-bold animate__animated animate__fadeInDown">
                10K+ Items Swapped daily
              </h1>
              <h3 className="animate__animated animate__fadeInUp">
                List your item for free and get swapped for a better item
              </h3>
              <Button
                variant="outline-dark"
                className="carousel-btn mt-4 animate__animated animate__fadeIn"
                onClick={() => navigate("/shop")}
              >
                DISCOVER
              </Button>
            </div>
          </Carousel.Item>
          <Carousel.Item>
            <div
              className="carousel-item-content justify-content-center align-items-center align-content-center"
              style={{
                backgroundImage: `url("/images/banner2.jpg")`,
                backgroundSize: "cover",
              }}
            >
              <h3 className="animate__zoomIn animate__animated">
                One Man's Junk
              </h3>
              <h2 className="font-weight-bold animate__zoomIn animate__animated">
                Is Another
                <br /> Man's Treasure
              </h2>
              <Button
                variant="outline-dark"
                className="carousel-btn mt-4 animate__animated animate__fadeIn"
                onClick={() => navigate("/register")}
              >
                GET STARTED
              </Button>
            </div>
          </Carousel.Item>
          <Carousel.Item>
            <div
              className="carousel-item-content"
              style={{
                backgroundImage: `url("/images/banner4.jpg")`,
                backgroundSize: "cover",
                backgroundPosition: "right",
              }}
            >
              <h1 className="font-weight-bold animate__animated animate__fadeInDown">
                Why throw away ?
              </h1>
              <h3 className="animate__animated animate__fadeInDown">
                When you can SWAP
              </h3>
              <Button
                variant="outline-dark"
                className="carousel-btn mt-4 animate__animated animate__fadeIn"
                onClick={() => navigate("/shop")}
              >
                SWAP NOW
              </Button>
            </div>
          </Carousel.Item>
        </Carousel>
      </Container>

      <Container style={{ marginTop: "8rem" }} ref={topRatedRef}>
        <h1
          style={{ marginLeft: "2rem", opacity: animateText ? 1 : 0 }}
          className={`slide-in-left ${animateText ? "animate" : ""}`}
        >
          Top Rated Sellers Products
        </h1>
        <Row className="mt-4" style={{ padding: "0 1rem", width: "100%" }}>
          {loading ? (
            <>
              {Array(4)
                .fill()
                .map((_, index) => (
                  <Col key={index} xs={4} sm={3} md={4} lg={3}>
                    <VerticalItemCardSkeleton />
                  </Col>
                ))}
            </>
          ) : (
            <>
              {topRatedProducts.slice(0, displayedItems).map((item, index) => {
                const animateClass =
                  index % 4 === 0 || index % 4 === 1
                    ? "slide-in-left-item"
                    : "slide-in-right-item";
                return (
                  <Col
                    key={index}
                    xs={4}
                    sm={3}
                    md={4}
                    lg={3}
                    className={`item-col ${animateClass}`}
                    style={{ flex: "0 0 auto", opacity: 0 }}
                  >
                    <VerticalItemCard
                      item={item}
                      isWishlisted={wishlistItems.includes(item._id)}
                    />
                  </Col>
                );
              })}
            </>
          )}
        </Row>
      </Container>

      <Container fluid className="m-4 d-flex justify-content-center">
        <Button
          variant="outline-dark"
          className="carousel-btn m-4"
          onClick={() => navigate("/shop")}
        >
          VIEW ALL
        </Button>
      </Container>

      <Container fluid className="mt-4">
        {loading ? (
          <ProfileCardSkeleton />
        ) : (
          <ProfileCard topUsers={topUsers} />
        )}
      </Container>

      <Container
        ref={categoryRef}
        style={{ marginTop: "8rem", overflow: "hidden" }}
      >
        <h1
          style={{
            marginLeft: "2rem",
            marginBottom: "2rem",
            opacity: animateCategories ? 1 : 0,
          }}
          className={`slide-in-left ${animateCategories ? "animate" : ""}`}
        >
          Shop By Category
        </h1>

        {loading ? (
          <CategoryCardSkeleton />
        ) : (
          <Splide
            options={{
              type: "loop", // Infinite loop
              perPage: 5, // Number of slides visible per view
              pagination: false, // Disable pagination
              arrows: false, // Enable navigation arrows
              drag: true, // Enable dragging
              breakpoints: {
                1200: {
                  perPage: 4, // Show 4 items for screens <= 1200px
                },
                992: {
                  perPage: 3, // Show 3 items for screens <= 992px
                },
                768: {
                  perPage: 2, // Show 2 items for screens <= 768px
                },
                576: {
                  perPage:3, // Show 1 item for screens <= 576px
                },
              },
              autoScroll: {
                speed: 1, // Auto-scroll speed
                pauseOnHover: false, // Pause on hover
                pauseOnFocus: false, // Pause on focus
              },
            }}
            extensions={{ AutoScroll }} // Enable the AutoScroll plugin
            className="category-slider"
          >
            {categories.map((category, index) => (
              <SplideSlide key={index}>
                <div
                  className={`category-col mb-4`}
                  onClick={() =>
                    navigate(`/shop/${category?._id}`, {
                      state: { from: location.pathname },
                    })
                  }
                  style={{
                    cursor: "pointer",
                  }}
                >
                  <Card
                    className="category-card"
                    style={{
                      backgroundColor: "#e6e6e6",
                      backgroundImage: `url("${NODE_APP_URL}/uploads/categories/${category?.image}")`,
                      backgroundSize: "contain",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center",
                    }}
                  />
                  <Card.Text className="category-name">
                    {category?.category}
                  </Card.Text>
                </div>
              </SplideSlide>
            ))}
          </Splide>
        )}
      </Container>
      <div class="container" style={{marginTop: "3rem"}}><h1 class="container"
          style={{
           
            marginLeft: "2rem",
            marginBottom: "2rem",
            opacity: animateCategories ? 1 : 0,
          }}
          className={`slide-in-left ${animateCategories ? "animate" : ""}`}
        >
          Sustainable Future through Bartering
        </h1></div>
      
      {/* <Container className="promo-container" style={{ marginTop: "4rem" }}>
      
        <div
          ref={leftBannerRef} // Ref for left banner
          className={`promo-box d-flex align-items-start align-content-start justify-content-end ${
            animateLeft ? "slide-in-left" : "off-screen-left"
          }`}
          style={{
            position: "relative",
            overflow: "hidden", // Ensure the background stays within the container
          }}
        >
          
          <div
            className="promo-banner-container"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "90%",
              backgroundImage:
                "url('/images/promo-banner-1.jpeg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              filter:
                "brightness(0.8) contrast(0.8) saturate(1.5) hue-rotate(10deg) blur(1px)",
              zIndex: 0,
            }}
          />
          <div style={{ position: "relative", zIndex: 1 }}>
            <h2 className={`big-text text-right`}>
              Bartering Supports an <br />
              Environmentally Friendly Future
            </h2>
          </div>
        </div>
        <div
          ref={leftBannerRef} // Ref for left banner
          className={`promo-box d-flex align-items-start align-content-start justify-content-end ${
            animateLeft ? "slide-in-left" : "off-screen-left"
          }`}
          style={{
            position: "relative",
            overflow: "hidden", // Ensure the background stays within the container
          }}
        >
          
          <div
            className="promo-banner-container"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "90%",
              backgroundImage:
                "url('/images/promo-banner-1.jpeg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              filter:
                "brightness(0.8) contrast(0.8) saturate(1.5) hue-rotate(10deg) blur(1px)",
              zIndex: 0,
            }}
          />
          <div style={{ position: "relative", zIndex: 1 }}>
            <h2 className={`big-text text-right`}>
              Bartering Supports an <br />
              Environmentally Friendly Future
            </h2>
          </div>
        </div>
        <div
          ref={leftBannerRef} // Ref for left banner
          className={`promo-box d-flex align-items-start align-content-start justify-content-end ${
            animateLeft ? "slide-in-left" : "off-screen-left"
          }`}
          style={{
            position: "relative",
            overflow: "hidden", // Ensure the background stays within the container
          }}
        >
          
          <div
            className="promo-banner-container"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "90%",
              backgroundImage:
                "url('/images/promo-banner-1.jpeg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              filter:
                "brightness(0.8) contrast(0.8) saturate(1.5) hue-rotate(10deg) blur(1px)",
              zIndex: 0,
            }}
          />
          <div style={{ position: "relative", zIndex: 1 }}>
            <h2 className={`big-text text-right`}>
              Bartering Supports an <br />
              Environmentally Friendly Future
            </h2>
          </div>
        </div>
        
        <div
          ref={rightBannerRef} // Ref for right banner
          className={`promo-box d-flex align-items-start align-content-start justify-content-start ${
            animateRight ? "slide-in-right" : "off-screen-right"
          }`}
          style={{
            position: "relative",
            overflow: "hidden", // Ensure the background stays within the container
          }}
        >
        
          <div
            className="promo-banner-container"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "90%",
              backgroundImage:
                "url('/images/promo-banner-2.jpeg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              filter:
                "brightness(0.8) contrast(0.8) saturate(1.5) hue-rotate(10deg) blur(1px)",
              zIndex: 0,
            }}
          />
          <div style={{ position: "relative", zIndex: 1 }}>
            <h2 className={`big-text text-left`}>
              Strengthening Community Bonds <br />
              Through Bartering
            </h2>
          </div>
        </div>
      </Container> */}
      <Container className="promo-container" style={{ marginTop: "8rem", margin: "50px 170px 0px 110px" }}>
        <div
          ref={leftBannerRef} // Ref for left banner
          className={`promo-box ${
            animateLeft ? "slide-in-left" : "off-screen-left"
          }`}
          style={{
            backgroundImage: "url('/images/b1.jpg')",
            height:"260px",
            transform:"translateX(0%)",
            opacity:"1"
          }}
        >
          <div>
            <h2
              className={`big-text`}
              style={{ fontFamily: "var(--font-heading2)", color:"black", fontSize:"36px", textShadow:"none"}}
            >
              Barter, Connect, Conserve: SwapCircle for a Greener Future
            </h2>
          </div>
        </div>
        
        <div
          ref={leftBannerRef} // Ref for left banner
          className={`promo-box ${
            animateLeft ? "slide-in-left" : "off-screen-left"
          }`}
          style={{
            backgroundImage: "url('/images/b1.jpg')",
            height:"260px",
            transform:"translateX(0%)",
            opacity:"1"
          }}
        >
          <div>
            <h2
              className={`big-text`}
              style={{ fontFamily: "var(--font-heading2)", color:"black", fontSize:"36px", textShadow:"none"}}
            >
              Transform, Reuse, Innovate: Crafting New Life with SwapCircle

            </h2>
          </div>
        </div><div
          ref={leftBannerRef} // Ref for left banner
          className={`promo-box ${
            animateLeft ? "slide-in-left" : "off-screen-left"
          }`}
          style={{
            backgroundImage: "url('/images/b1.jpg')",
            height:"260px",
            transform:"translateX(0%)",
            opacity:"1"
          }}
        >
          <div>
            <h2
              className={`big-text`}
              style={{ fontFamily: "var(--font-heading2)", color:"black", fontSize:"36px", textShadow:"none"}}
            >
              Community and Sharing: The Heart of SwapCircle
            </h2>
          </div>
        </div>
        
      </Container>
      <Container
        className={`banner-container ${
          animateJoinBanner ? "slide-in-top" : ""
        }`}
        ref={joinBannerRef}
        style={{ marginBottom: "8rem" }}
      >
        <Row className="d-flex align-items-center justify-content-center">
          <Col
            md={6}
            className={`banner-content ${
              animateJoinBanner ? "slide-in-left" : ""
            }`}
          >
            <h1 className={animateText ? "slide-in-text" : ""}>
              Try Joining
              <br /> With Us For Free
            </h1>
            <p className={animateText ? "slide-in-text" : ""}>
              Earn points just by swapping your items...
            </p>
            <Button
              variant="dark"
              className="banner-button"
              onClick={() => navigate("/register")}
            >
              Become A Lister
            </Button>
          </Col>
          <Col md={6}>{/* Background image or empty column */}</Col>
        </Row>
      </Container>
    </>
  );
};

export default Home;
