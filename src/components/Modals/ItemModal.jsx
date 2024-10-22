import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import EditItemForm from "../Forms/EditItemForm";
import { useDispatch, useSelector } from "react-redux";
import { useToastContext } from "../../../Hooks/ToastContextHook";
import {
  AddItemApi,
  clearItemState,
  EditItemApi,
  GetItemApi,
} from "../../../stores/Item/ItemSlice";
import schema from "../../Schema/itemSchema";
import { useFormik } from "formik";
import { NODE_APP_URL } from "../../../config/app_config";

const ItemModal = ({ singleData, visible, setVisible }) => {
  const closeModal = () => {
    setVisible(false);
  };

  const [images, setImages] = useState([]);
  const [isLoading, setLoading] = useState(null);
  const dispatch = useDispatch();

  const { loading, status } = useSelector((state) => state["ItemStore"]);

  useEffect(() => {
    setLoading(loading);
  }, [loading]);

  useEffect(() => {
    if (status == true) {
      closeModal();
    }
  }, [status]);

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
        await dispatch(EditItemApi({ values: formdata, id: singleData._id }));
        await dispatch(GetItemApi());
      } catch (error) {
        console.error("Form submission error:", error);
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    if (singleData) {
      let { user_id, category, username, ...other } = singleData;

      setValues({
        ...values,
        ...other,
      });
    }

    if (singleData && singleData.images) {
      let images = singleData.images.map((image) => {
        if (image.includes("http")) {
          return image;
        } else {
          return `${NODE_APP_URL}/uploads/items/${image}`;
        }
      });

      setImages(images);
    }
  }, [singleData]);

  return (
    <div className="card flex justify-content-center">
      <Dialog
        visible={visible}
        style={{ width: "50vw" }}
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
      >
        <EditItemForm
          values={values}
          formikHelpers={formikHelpers}
          setLoading={setLoading}
          isLoading={isLoading}
          images={images}
          setImages={setImages}
        />
      </Dialog>
    </div>
  );
};

export default ItemModal;
