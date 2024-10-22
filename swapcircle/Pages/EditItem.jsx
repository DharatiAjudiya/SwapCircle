// AddItem.js

import React, { useEffect, useState } from "react";
import { Container, Row, Col, Breadcrumb } from "react-bootstrap";
import "./AddItem.css";
import ItemDetailPlaceholder from "../src/components/ItemDetailPlaceholder";
import { useDispatch, useSelector } from "react-redux";
import {
  AddItemApi,
  clearItemState,
  EditItemApi,
  GetItemApi,
} from "../stores/Item/ItemSlice";
import { useDynamicToast } from "../Hooks/DynamicToastHook";
import { useFormik } from "formik";
import schema from "../src/Schema/itemSchema";
import { useNavigate, useParams } from "react-router-dom";
import { GetSingleItemApi } from "../stores/Item/ItemSlice";
import EditItemForm from "../src/components/Forms/EditItemForm";
import { NODE_APP_URL } from "../config/app_config";
import { Skeleton } from "@mui/material";

const EditItem = () => {
  let { id } = useParams();
  const [images, setImages] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { singleData, loading } = useSelector((state) => state["ItemStore"]);

  useEffect(() => {
    dispatch(GetSingleItemApi({ id }));
  }, []);

  const { isLoading, setLoading } = useDynamicToast(
    "ItemStore",
    {
      clearState: clearItemState,
    },
    "/profile"
  );

  // useEffect(() => {
  //   if (status == true) {
  //     closeModal();

  //   }
  // }, [status]);

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

  const { values, setValues, ...formikHelpers } = useFormik({
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
        dispatch(EditItemApi({ values: formdata, id }));
        dispatch(GetItemApi());
      } catch (error) {
        console.error("Form submission error:", error);
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    if (singleData) {
      let { user_id, category_id, ...other } = singleData;

      setValues({
        ...values,
        category_id: category_id?._id,
        ...other,
      });
    }

    if (singleData && singleData.images) {
      let images = singleData.images.map((image) => {
        let _src =
          image.startsWith("http://") || image.startsWith("https://")
            ? image
            : `${NODE_APP_URL}/uploads/items/${image}`;
        return _src;
      });

      setImages(images);
    }
  }, [singleData]);

  return (
    <Container fluid>
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
          {" "}
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
        <Breadcrumb.Item active>Edit</Breadcrumb.Item>
      </Breadcrumb>
      <Row>
        {/* Left Sidebar for Form */}
        <Col md={3}>
          <EditItemForm
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

export default EditItem;
