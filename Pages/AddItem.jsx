// AddItem.js

import React, { useEffect, useState } from "react";
import { Container, Row, Col, Breadcrumb } from "react-bootstrap";
import "./AddItem.css";
import ItemDetailPlaceholder from "../src/components/ItemDetailPlaceholder";
import { useDispatch } from "react-redux";
import { AddItemApi, clearItemState } from "../stores/Item/ItemSlice";
import { useDynamicToast } from "../Hooks/DynamicToastHook";
import { useFormik } from "formik";
import schema from "../src/Schema/itemSchema";
import AddItemForm from "../src/components/Forms/AddItemForm";
import { useNavigate } from "react-router-dom";

const AddItem = () => {
  const [images, setImages] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, setLoading } = useDynamicToast(
    "ItemStore",
    {
      clearState: clearItemState,
    },
    "/profile"
  );

  const initialValues = {
    images: [],
    name: "",
    description: "",
    price: [0, 5000],
    tags: [],
    category_id: "",
    condition: "",
    eco_friendly: false,
    recyclable: false,
    location: {
      lat: "",
      lng: "",
      postcode: "",
      city: "",
      state: "",
      country: "",
    },
  };

  const { values, ...formikHelpers } = useFormik({
    initialValues,
    validationSchema: schema,
    onSubmit: async (values) => {
      try {
        const formdata = new FormData();
        for (let key in values) {
          if (key === "images") {
            values.images.forEach((image, index) => {
              formdata.append(`images`, image);
            });
          } else if (["location", "tags", "price"].includes(key)) {
            let jsonString = JSON.stringify(values[key]);
            formdata.append(key, jsonString);
          } else {
            formdata.append(key, values[key]);
          }
        }
        dispatch(AddItemApi({ values: formdata }));
      } catch (error) {
        console.error("Form submission error:", error);
        setLoading(false);
      }
    },
  });

  return (
    <Container fluid>
      <Breadcrumb>
        <Breadcrumb.Item href="#" onClick={() => navigate("/")}>
          Home
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Item</Breadcrumb.Item>
        <Breadcrumb.Item active>Add</Breadcrumb.Item>
      </Breadcrumb>
      <Row>
        {/* Left Sidebar for Form */}
        <Col md={3}>
          <AddItemForm
            values={values}
            formikHelpers={formikHelpers}
            setLoading={setLoading}
            isLoading={isLoading}
            images={images}
            setImages={setImages}
          />
        </Col>
        {/* Right Section for Item Detail */}
        <Col md={9} className="item-detail">
          <ItemDetailPlaceholder data={values} imagepreview={images} />
        </Col>
      </Row>
    </Container>
  );
};

export default AddItem;
