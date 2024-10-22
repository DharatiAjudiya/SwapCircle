import React, { useEffect, useState } from "react";
import {
  Container,
  Navbar,
  Nav,
  NavDropdown,
  Button,
  Form,
  FormControl,
  Stack,
  Image,
} from "react-bootstrap";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { InputAdornment, Tooltip } from "@mui/material";
import "./Header.css";
import ProfileDropdown from "../Dropdowns/ProfileDropdown";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { MdFavoriteBorder } from "react-icons/md";
import { LuMessagesSquare } from "react-icons/lu";
import { LuPackagePlus } from "react-icons/lu";
import { CiSearch } from "react-icons/ci";
import CategoryBarDropdown from "../Dropdowns/CategoryBarDropdown";
import { GetCategoryApi } from "../../../stores/Category/CategorySlice";
import {
  clearUserState,
  GetSingleUserApi,
  GetUserProfileApi,
} from "../../../stores/User/UserSlice";
import { GetItemApi } from "../../../stores/Item/ItemSlice";
import { styled, lighten, darken } from "@mui/system";

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.AuthUserStore);
  const { data: categories } = useSelector((state) => state.CategoryStore);
  const { data: items } = useSelector((state) => state.ItemStore);
  const { profileData } = useSelector((state) => state.UserStore);

  useEffect(() => {
    dispatch(GetCategoryApi());
    dispatch(GetItemApi());
    setTimeout(() => {
      dispatch(clearUserState());
    }, 1000);
  }, [dispatch]);

  useEffect(() => {
    if (data?.id) {
      dispatch(GetUserProfileApi({ id: data?.id }));
    }
  }, [dispatch, data?.id]);

  const navigateUrl = (url) => {
    navigate(url);
  };

  const GroupHeader = styled("div")(() => ({
    position: "sticky",
    top: "-8px",
    fontWeight: "bold",
    padding: "4px 10px",
    color: "rgb(var(--color-black))",
    borderColor: "rgb(var(--color-black))",
    backgroundColor: "rgb(var(--color-black),0.1)",
  }));

  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (categories && items) {
      const _categories = categories?.map((category) => ({
        id: category?._id,
        title: category?.category,
        group: "Categories",
      }));

      const _items = items?.map((item) => ({
        id: item?._id,
        title: item?.name,
        group: "Items",
      }));

      setOptions([..._items, ..._categories]);
    }
  }, [categories, items]);

  const handleChange = (event, newValue) => {
    event.preventDefault();
    if (typeof newValue === "string") {
      navigateUrl(`/shop?q=${newValue}`);
    } else if (newValue && newValue.title) {
      if (newValue.group === "Categories") {
        navigateUrl(`/shop/${newValue.id}`);
      } else if (newValue.group === "Items") {
        navigateUrl(`/item/${newValue.id}`);
      }
    }
  };

  const handleSelect = (item) => {
    if (item.group === "Categories") {
      navigateUrl(`/shop/${item.id}`);
    } else if (item.group === "Items") {
      navigateUrl(`/item/${item.id}`);
    }
  };

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  let query = queryParams.get("q");

  const [inputValue, setInputValue] = useState(query || "");

  useEffect(() => {
    setInputValue(query || "");
  }, [query]);

  const handleInputChange = (event, newInputValue) => {
    setInputValue(newInputValue);
  };

  return (
    <>
      <div className="top-bar">
        Trade What You Have, Get What You Need — No Money Involved
      </div>
      {/* Main Navbar */}
      <Navbar expand="lg" variant="light" className="main-navbar">
        <Container fluid className="p-0">
          <Nav className="mr-auto d-flex flex-row justify-content-between align-items-center align-content-center">
            <Navbar.Brand
              onClick={() => navigateUrl("/")}
              style={{ cursor: "pointer" }}
            >
              <Image
                onClick={() => navigateUrl("/")}
                src={"/images/SwapCircle-2.svg"}
                alt="mdo"
                width="60"
                height="60"
                roundedCircle
                className="ms-3"
              />
            </Navbar.Brand>
          </Nav>
          <Navbar.Collapse
            id="basic-navbar-nav"
            className="justify-content-between"
          >
            <Nav className="m-auto">
              <CategoryBarDropdown categories={categories} />
              {categories &&
                categories.map((category, i) => {
                  if (i <= 1) {
                    return (
                      <Nav.Link
                        className="custom-navitem"
                        onClick={() => navigateUrl(`/shop/${category._id}`)}
                      >
                        {category?.category}
                      </Nav.Link>
                    );
                  }
                })}
              <Nav.Link
                className="custom-navitem"
                onClick={() => navigateUrl("/contact")}
              >
                Contact
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
          <div
            style={{ maxWidth: "30rem", width: "100%" }}
            className="d-flex justify-content-between align-items-center align-content-center"
          >
            <Form
              inline
              className="d-flex justify-content-center align-items-center align-content-center"
              style={{ width: "100%" }}
              role="search"
            >
              <Autocomplete
                freeSolo
                id="free-solo-2-demo"
                className="w-100"
                options={options}
                groupBy={(option) => option.group}
                getOptionLabel={(option) => option.title}
                inputValue={inputValue}
                onInputChange={handleInputChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    placeholder="Live your life daily"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <CiSearch
                            style={{
                              color: "rgb(var(--color-jet-grey))",
                              fontSize: "1.2rem",
                            }}
                          />
                        </InputAdornment>
                      ),
                      sx: {
                        backgroundColor: "transparent",
                        color: "rgb(var(--color-jet-grey))",
                        fontFamily: "var(--font-heading)",
                        borderRadius: "50px",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "rgb(var(--color-jet-grey))",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "rgb(var(--color-jet-grey))",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "rgb(var(--color-jet-grey))",
                        },
                        "& .MuiSvgIcon-root": {
                          color: "rgb(var(--color-jet-grey))", // Clear button icon color
                        },
                        "& input::placeholder": {
                          color: "rgb(var(--color-jet-grey))", // Placeholder color
                          opacity: 1, // Ensure the placeholder is fully visible
                        },
                      },
                    }}
                  />
                )}
                onChange={handleChange}
                renderGroup={(params) => (
                  <li key={params.key}>
                    <GroupHeader>{params.group}</GroupHeader>
                    <ul
                      className="p-0"
                      onClick={() => handleSelect(params.children)}
                    >
                      {params.children.map((child, index) => (
                        <li
                          key={index}
                          onClick={() =>
                            handleSelect(
                              options.find(
                                (opt) => opt.title === child.props.children
                              )
                            )
                          }
                        >
                          {child}
                        </li>
                      ))}
                    </ul>
                  </li>
                )}
              />
            </Form>
            <Nav className="ml-auto d-flex flex-row justify-content-between align-items-center align-content-center">
              <Tooltip title="Wishlist" arrow>
                <Nav.Link
                  className="custom-navitem m-0 mx-2 d-flex flex-row justify-content-between align-items-center align-content-center"
                  onClick={() => navigateUrl("/profile#WISHLIST")}
                >
                  <MdFavoriteBorder style={{ fontSize: "1.5rem" }} />
                </Nav.Link>
              </Tooltip>
              <Tooltip title="Message" arrow>
                <Nav.Link
                  className=" custom-navitem m-0 mx-2 d-flex flex-row justify-content-between align-items-center align-content-center"
                  onClick={() => navigateUrl("/chat")}
                >
                  <LuMessagesSquare style={{ fontSize: "1.5rem" }} />
                </Nav.Link>
              </Tooltip>
              <Tooltip title="List Item" arrow>
                <Nav.Link
                  onClick={() => navigateUrl("/item/create")}
                  className="custom-navitem m-0 mx-2 d-flex flex-row justify-content-between align-items-center align-content-center"
                >
                  <LuPackagePlus style={{ fontSize: "1.5rem" }} />
                </Nav.Link>
              </Tooltip>
              <ProfileDropdown data={profileData} />
            </Nav>
          </div>
        </Container>
      </Navbar>
    </>
  );
}

export default Header;
