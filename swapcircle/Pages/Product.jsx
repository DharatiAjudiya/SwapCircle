import React, { useEffect, useState } from "react";
import {
  Breadcrumb,
  Container,
  Row,
  Col,
  Card,
  Form,
  Nav,
  Button,
  Carousel,
  Modal,
  ButtonGroup,
  ToggleButton,
  Offcanvas,
} from "react-bootstrap";
import "./Product.css"; // Custom CSS file
import { itemData } from "../Data/items";
import VerticalItemCard from "../src/components/Cards/VerticalItemCard";
import Slider, { SliderThumb } from "@mui/material/Slider";
import { TbFilterBolt } from "react-icons/tb";
import { HiMiniArrowLongLeft, HiMiniArrowLongRight } from "react-icons/hi2";
import { Autocomplete, Chip, Rating, TextField, Tooltip } from "@mui/material";
import { debounce, groupItems } from "../Helpers/PreventScroll";
import { GEOAPIFY_API_KEY } from "../config/app_config";
import LocationFilterModal from "../src/components/Modals/LocationFilterModal";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  GetCategoryApi,
  GetSingleCategoryApi,
} from "../stores/Category/CategorySlice";
import { useFormik } from "formik";
import {
  GetShopByCatgoryApi,
  GetShopApi,
  clearShopState,
  resetPage,
  incrementPage,
} from "../stores/Shop/ShopSlice";
import schema from "../src/Schema/ShopSchema";
import {
  clearWishListState,
  GetWishListApi,
} from "../stores/WishList/WishListSlice";
import { useToastContext } from "../Hooks/ToastContextHook";
import useEffectAfterMount from "../Hooks/useEffectAfterMount";
import VerticalItemCardSkeleton from "../src/components/Skeletons/Cards/VerticalItemCardSkeleton";

const Product = () => {
  const [index, setIndex] = useState(0); // State to track the active slide
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [autocompleteValue, setAutocompleteValue] = useState("");
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const { data: categories, singleData } = useSelector(
    (state) => state.CategoryStore
  );
  const { data, totalPages, message, status, page, loading } = useSelector(
    (state) => state.ShopStore
  );

  useEffect(() => {
    if (id) {
      dispatch(GetSingleCategoryApi({ id }));
    }
    dispatch(GetCategoryApi());
    dispatch(GetWishListApi());
  }, [dispatch, id]);

  const getCategoryOptions = () => {
    if (categories) {
      return categories.map((category) => (
        <option value={category._id} key={category._id}>
          {category.category}
        </option>
      ));
    }
  };

  const [groupedItems, setGroupedItems] = useState([]);
  const [itemsPerGroup, setItemsPerGroup] = useState(4);

  const reverseGeocode = async (lat, lng) => {
    const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=${GEOAPIFY_API_KEY}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data?.features && data?.features?.length > 0) {
        const place = data?.features[0];
        const address = `${place?.properties?.city} ${place?.properties?.state_code} ${place?.properties?.country}`;
        setAutocompleteValue(address);
      } else {
        console.error("No address found for the given coordinates");
      }
    } catch (error) {
      console.error("Reverse geocoding error: ", error);
    }
  };

  useEffect(() => {
    setGroupedItems(groupItems(itemData, itemsPerGroup));
    setIndex(0); // Reset the carousel index when itemsPerGroup changes
  }, [itemsPerGroup]);

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

  const handleCategoryChange = (e) => {
    if (e.target.value !== "") {
      navigate(`/shop/${e.target.value}`);
    }
  };

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  let search = queryParams.get("q");

  const initialValues = {
    lat: "",
    lng: "",
    radius: 100000000000,
    condition: [],
    env_condition: [],
    tags: [],
    rating: undefined,
    filterby: "NONE",
  };

  const {
    errors,
    values,
    handleChange,
    handleSubmit,
    validateForm,
    setValues,
    setFieldValue,
  } = useFormik({
    initialValues,
    validationSchema: schema,
    onSubmit: async (values) => {
      try {
        if (id) {
          dispatch(GetShopByCatgoryApi({ values, id, page: 1 }));
        } else {
          dispatch(GetShopApi({ values, page: 1 }));
        }
        dispatch(resetPage());
      } catch (error) {
        console.error("Form submission error:", error);
        setLoading(false);
      }
    },
  });

  const handleFilterChange = (val) => {
    setFieldValue("filterby", val);
  };

  useEffect(() => {
    handleFormSubmit();
  }, [values]);

  const handleFormSubmit = async () => {
    // setLoading(true);
    const isFormValid = await validateForm();
    if (Object.keys(isFormValid).length !== 0) {
      // setLoading(false);
      return;
    }
    handleSubmit();
  };

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

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          reverseGeocode(latitude, longitude);
          setFieldValue("lat", latitude);
          setFieldValue("lng", longitude);
          if (id) {
            dispatch(
              GetShopByCatgoryApi({
                values: {
                  lat: latitude,
                  lng: longitude,
                  radius: values.radius,
                },
                id,
                page: 1,
              })
            );
          } else {
            dispatch(
              GetShopApi({
                values: {
                  lat: latitude,
                  lng: longitude,
                  radius: values.radius,
                },
                page: 1,
              })
            );
          }
          dispatch(resetPage());
        },
        (error) => {
          console.error("Error getting geolocation: ", error);
        }
      );
    }

    return () => window.removeEventListener("resize", debounceResize);
  }, [id]);

  const [tags, setTags] = useState([]);

  const {
    data: wishlistData,
    status: wishlistStatus,
    message: wishlistMessage,
  } = useSelector((state) => state.WishListStore);
  const { toastType, showToast } = useToastContext();

  useEffectAfterMount(() => {
    if (status === true) {
      toastType.current = {
        severity: "success",
        summary: "Success",
        detail: message,
      };
      showToast("top-right");
      dispatch(clearShopState());
    } else if (status === false) {
      toastType.current = {
        severity: "error",
        summary: "Error",
        detail: message,
      };
      showToast("top-right");
      dispatch(clearShopState());
    }
  }, [status]);

  useEffect(() => {
    if (wishlistStatus === true) {
      toastType.current = {
        severity: "success",
        summary: "Success",
        detail: wishlistMessage,
      };
      showToast("top-right");
      dispatch(clearWishListState());
    } else if (wishlistStatus === false) {
      toastType.current = {
        severity: "error",
        summary: "Error",
        detail: wishlistMessage,
      };
      showToast("top-right");
      dispatch(clearWishListState());
    }
  }, [wishlistStatus]);

  let [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    if (wishlistData) {
      let _data = wishlistData.map((item) => item?.item_id?._id);
      setWishlistItems(_data);
    }
  }, [wishlistData]);

  const handleLoadMore = () => {
    dispatch(incrementPage());
  };

  useEffect(() => {
    if (totalPages && page <= totalPages) {
      if (id) {
        dispatch(GetShopByCatgoryApi({ values, id, page }));
      } else {
        dispatch(GetShopApi({ values, page }));
      }
    }
  }, [page, totalPages]);

  const [pageItems, setPageItems] = useState([]);

  useEffect(() => {
    if (page === 1) {
      setPageItems(data);
    } else {
      setPageItems((prev) => [...prev, ...data]);
    }
  }, [data]);

  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const handleClose = () => setShowOffcanvas(false);
  const handleShow = () => setShowOffcanvas(true);

  const FilterForm = (
    <Card className="filters mt-4">
      <Card.Title className="filter-header">Filters</Card.Title>
      <Card.Body>
        <Form.Group className="mb-3">
          <Form.Label>Category</Form.Label>
          <div className="filter-options">
            <Form.Select onChange={handleCategoryChange} value={id}>
              <option value="">select option</option>
              {getCategoryOptions()}
            </Form.Select>
          </div>
        </Form.Group>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Condition</Form.Label>

            <div className="filter-options">
              {["vintage", "old", "used", "likely_new", "brand_new"].map(
                (label, index) => (
                  <Form.Check
                    key={index}
                    type="checkbox"
                    name="condition"
                    value={label}
                    onChange={handleChange}
                    checked={values.condition.includes(label)}
                    label={`${label.toLowerCase().split("_").join(" ")}`}
                  />
                )
              )}
              <Form.Control.Feedback type="invalid">
                {errors.condition}
              </Form.Control.Feedback>
            </div>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Environmental Status</Form.Label>
            <div className="filter-options">
              {["eco_friendly", "recyclable"].map((label, index) => (
                <Form.Check
                  key={index}
                  type="checkbox"
                  name="env_condition"
                  value={label}
                  onChange={handleChange}
                  checked={values.env_condition.includes(label)}
                  label={`${label.toLowerCase().split("_").join(" ")}`}
                />
              ))}
              <Form.Control.Feedback type="invalid">
                {errors.env_condition}
              </Form.Control.Feedback>
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Tags</Form.Label>
            <div className="filter-options d-flex justify-content-between align-items-center align-content-center w-100">
              <Autocomplete
                multiple
                freeSolo
                options={[]}
                value={tags}
                onChange={(event, newValue) => {
                  setTags(newValue);
                }}
                renderTags={(value, getTagProps) =>
                  tags.map((option, index) => (
                    <Chip
                      variant="outlined"
                      label={option}
                      key={index}
                      {...getTagProps({ index })}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="medium"
                    variant="outlined"
                    placeholder="Item Tags"
                    error={Boolean(errors.tags)}
                    helperText={errors.tags}
                  />
                )}
                sx={{
                  width: "100%",
                  marginRight: "1rem",
                  transition:
                    "borderColor .15s ease-in-out, box-shadow .15s ease-in-out",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 0,
                  },
                  "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#86b7fe",
                    outline: 0,
                    boxShadow: "0 0 0 .25rem rgba(13, 110, 253, .25)",
                  },
                }}
              />
              <Button
                size="sm"
                style={{
                  borderRadius: "0",
                  backgroundColor: "#000",
                  border: "1px solid #000",
                }}
                onClick={() => setFieldValue("tags", tags)}
              >
                Submit
              </Button>
            </div>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>User Rating</Form.Label>
            <div className="filter-options d-flex justify-content-between align-items-center align-content-center">
              <Rating
                size="large"
                name="rating"
                precision={0.5}
                value={values.rating}
                onChange={handleChange}
                sx={{
                  "& .MuiRating-icon": {
                    fontSize: "2rem", // Increase the size of the rating stars
                  },
                }}
              />
              <Button
                size="sm"
                onClick={(e) => setFieldValue("rating", 0)}
                style={{
                  borderRadius: "0",
                  backgroundColor: "#000",
                  border: "1px solid #000",
                }}
              >
                Reset
              </Button>
            </div>
          </Form.Group>
          {/* <Form.Group className="mb-3">
        <Form.Label>Price Range</Form.Label>
        <div className="filter-options d-flex justify-content-between align-items-end align-content-end">
          <div className="d-flex flex-column justify-content-between align-items-center align-content-center  w-100">
            <div className="d-flex flex-row justify-content-between align-items-center align-content-center  w-100">
              <span>{value[0]}</span>
              <span>{value[1]}</span>
            </div>
            <AirbnbSlider
              slots={{ thumb: AirbnbThumbComponent }}
              getAriaLabel={(index) =>
                index === 0 ? "Minimum price" : "Maximum price"
              }
              value={value}
              onChange={handleChange}
              sx={{ marginLeft: "1rem" }}
              max={500000}
              min={0}
              step={10000}
            />
          </div>
          <Button
            size="sm"
            onClick={() => setRating(0)}
            style={{
              borderRadius: "0",
              backgroundColor: "#000",
              marginLeft: "2rem",
              border: "1px solid #000",
            }}
          >
            apply
          </Button>
        </div>
      </Form.Group> */}
        </Form>
      </Card.Body>
    </Card>
  );

  return (
    <Container style={{ marginTop: "9rem", marginBottom: "8rem" }}>
      {/* Breadcrumb */}
      <Breadcrumb>
        <Breadcrumb.Item href="#" onClick={() => navigate("/")}>
          Home
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Shop</Breadcrumb.Item>
        {singleData?.category && (
          <Breadcrumb.Item active>{singleData?.category}</Breadcrumb.Item>
        )}
      </Breadcrumb>

      {/* Product Count and Sorting */}
      <Row className="align-items-center mb-3 sorting-row">
        <Col md={12}>
          <Nav className="d-flex justify-content-end align-content-center align-items-center">
            <Tooltip placement="bottom" title="Filter" arrow>
              <Button
                variant="outline-white"
                style={{ borderRadius: "0" }}
                onClick={handleShow}
                className="d-md-none me-auto"
              >
                <TbFilterBolt style={{ fontSize: "1.5rem" }} />
              </Button>
            </Tooltip>
            <span>Sort by: </span>
            <Nav.Link
              className={`sorting-option ${
                values.filterby === "NEW" ? "active" : ""
              }`}
              onClick={(e) => handleFilterChange("NEW")}
            >
              What's New
            </Nav.Link>
            {/* <Nav.Link className="sorting-option">High to Low</Nav.Link>
            <Nav.Link className="sorting-option">Low to High</Nav.Link> */}
            <Nav.Link
              className={`sorting-option ${
                values.filterby === "RATE_HIGH" ? "active" : ""
              }`}
              onClick={(e) => handleFilterChange("RATE_HIGH")}
            >
              User Rating
            </Nav.Link>
            {/* <Nav.Link
              className={`sorting-option ${
                values.filterby === "RATE_LOW" ? "active" : ""
              }`}
              onClick={(e) => handleFilterChange("RATE_LOW")}
            >
              Low User Rating
            </Nav.Link> */}
          </Nav>
        </Col>
        <Col md={4}>
          {/* <span className="m-auto ">
            Showing 1 - 27 products of <strong>23250</strong> products
          </span> */}
        </Col>
      </Row>

      <Row>
        {/* Filters Section */}
        <Col md={3} className="d-none d-md-block">
          {FilterForm}
        </Col>
        {/* Product Cards */}
        <Col md={9}>
          <Row
            className="mt-4 location-bar"
            style={{
              display: "flex",
              justifyContent: "end",
              padding: "0 1rem",
              width: "100%",
            }}
          >
            <Col
              xs={12}
              // style={{ flex: "0 0 auto" }}
            >
              <Form.Group className="mb-3">
                <div className="d-flex justify-content-end align-items-center align-content-center  w-100">
                  <Form.Label>Location</Form.Label>
                </div>
                <div className="d-flex justify-content-end align-items-center align-content-center  w-100">
                  {/* Button to open modal */}
                  <Button
                    variant="link"
                    onClick={() => setShowModal(true)}
                    style={{
                      padding: "0",
                      textAlign: "right",
                      textDecoration: "none",
                      fontWeight: "bold",
                    }}
                  >
                    {autocompleteValue
                      ? `${autocompleteValue} -${parseInt(
                          values.radius / 1000
                        )} km`
                      : "location disabled"}
                  </Button>
                </div>
              </Form.Group>
            </Col>
          </Row>
          <Row className="mt-4" style={{ padding: "0 1rem", width: "100%" }}>
            {loading ? (
              Array(3)
                .fill()
                .map((_, i) => (
                  <Col
                    key={i}
                    xs={6}
                    sm={3}
                    md={4}
                    style={{ flex: "0 0 auto" }}
                  >
                    <VerticalItemCardSkeleton />
                  </Col>
                ))
            ) : (
              <>
                {pageItems && pageItems.length > 0 ? (
                  pageItems.map((item, index) => (
                    <Col
                      key={index}
                      xs={6}
                      sm={3}
                      md={4}
                      style={{ flex: "0 0 auto" }}
                    >
                      <VerticalItemCard
                        item={item}
                        isWishlisted={wishlistItems.includes(item._id)}
                      />
                    </Col>
                  ))
                ) : (
                  <div className="d-flex justify-content-center mt-5">
                    <h4>No items found</h4>
                  </div>
                )}
              </>
            )}
          </Row>
          {pageItems && totalPages && page < totalPages && (
            <Container fluid className="mt-5 d-flex justify-content-center">
              <Button
                variant="outline-dark"
                className="pagination-btn mt-5"
                onClick={handleLoadMore}
              >
                LOAD MORE
              </Button>
            </Container>
          )}
        </Col>
      </Row>

      <hr />

      <LocationFilterModal
        visible={showModal}
        setVisible={setShowModal}
        autocompleteValue={autocompleteValue}
        setAutocompleteValue={setAutocompleteValue}
        setFieldValue={setFieldValue}
        values={values}
        reverseGeocode={reverseGeocode}
        setValues={setValues}
      />

      <Offcanvas
        show={showOffcanvas}
        onHide={handleClose}
        className="chat-offcanvas"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>All FIlters</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="p-0">{FilterForm}</Offcanvas.Body>
      </Offcanvas>
    </Container>
  );
};

export default Product;
