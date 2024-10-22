import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import schema from "../../Schema/CategorySchema";
import {
  EditCategoryApi,
  GetCategoryApi,
} from "../../../stores/Category/CategorySlice";
import { useToastContext } from "../../../Hooks/ToastContextHook";
import { useFormik } from "formik";
import { Form } from "react-bootstrap";
import { LoadingButton } from "@mui/lab";
import "./AddCategoryForm.css";

const EditCategoryForm = ({ singleData, closeModal }) => {
  const [isLoading, setLoading] = useState(null);
  const dispatch = useDispatch();

  const { loading, status } = useSelector((state) => state.CategoryStore);

  useEffect(() => {
    setLoading(loading);
  }, [loading]);

  useEffect(() => {
    if (status == true) {
      closeModal();
      dispatch(GetCategoryApi());
    }
  }, [status]);

  const initialValues = {
    category: "",
  };

  const { values, setValues, ...formikHelpers } = useFormik({
    initialValues,
    validationSchema: schema,
    onSubmit: async (values) => {
      try {
        dispatch(EditCategoryApi({ values, id: singleData._id }));
      } catch (error) {
        console.error("Form submission error:", error);
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    if (singleData) {
      let { category } = singleData;

      setValues({
        ...values,
        category,
      });
    }
  }, [singleData]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const isFormValid = await formikHelpers.validateForm();
    if (Object.keys(isFormValid).length !== 0) {
      setLoading(false);
      return;
    }
    formikHelpers.handleSubmit(e);
  };

  return (
    <>
      <div className="mx-5">
        <h4>Edit Item Details</h4>
        <Form
          className="my-3"
          noValidate
          onSubmit={handleFormSubmit}
          method="post"
        >
          <Form.Group className="mb-3">
            <Form.Label>Category Name</Form.Label>
            <Form.Control
              type="text"
              name="category"
              placeholder="Enter Category name"
              value={values.category}
              onChange={formikHelpers.handleChange}
              isInvalid={!!formikHelpers.errors.category}
            />
            <Form.Control.Feedback type="invalid">
              {formikHelpers.errors.category}
            </Form.Control.Feedback>
          </Form.Group>

          <LoadingButton
            loading={isLoading}
            loadingPosition="start"
            startIcon={""}
            variant="contained"
            type="submit"
            className="w-100 my-3 submit-btn"
          >
            Submit
          </LoadingButton>
        </Form>
      </div>
    </>
  );
};

export default EditCategoryForm;
