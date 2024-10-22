// ItemForm.js

import React, { useEffect, useRef, useState } from "react";
import { Form, Card, Image, Col, Button } from "react-bootstrap";
import { Autocomplete, Chip, Slider, TextField } from "@mui/material";
import { Tooltip } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { MdMyLocation, MdOutlineAddPhotoAlternate } from "react-icons/md";
import { ImCancelCircle } from "react-icons/im";
import {
  GeoapifyGeocoderAutocomplete,
  GeoapifyContext,
} from "@geoapify/react-geocoder-autocomplete";
import { useDropzone } from "react-dropzone";
import { LoadingButton } from "@mui/lab";
import { GEOAPIFY_API_KEY } from "../../../config/app_config";
import "./AddItemForm.css";
import { GetCategoryApi } from "../../../stores/Category/CategorySlice";
import { useDispatch, useSelector } from "react-redux";

const EditItemForm = ({
  values,
  formikHelpers,
  isLoading,
  setLoading,
  images,
  setImages,
}) => {
  const [autocompleteValue, setAutocompleteValue] = useState("");
  const { data: categories } = useSelector((state) => state.CategoryStore);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(GetCategoryApi());
  }, [dispatch]);

  const getCategoryOptions = () => {
    if (categories) {
      return categories.map((category) => (
        <option value={category._id} key={category._id}>
          {category.category}
        </option>
      ));
    }
  };

  const reverseGeocode = async (lat, lng) => {
    const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=${GEOAPIFY_API_KEY}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.features && data.features.length > 0) {
        const place = data.features[0];
        const address = place.properties.formatted;
        setAutocompleteValue(address);
        formikHelpers.setFieldValue("location", {
          ...values.location,
          lat: lat,
          lng: lng,
          postcode: place.properties.postcode,
          city: place.properties.city,
          state: place.properties.state,
          country: place.properties.country,
        });
      } else {
        console.error("No address found for the given coordinates");
      }
    } catch (error) {
      console.error("Reverse geocoding error: ", error);
    }
  };

  // Inside your component
  const hasGeocoded = useRef(false);

  useEffect(() => {
    const { lat, lng } = values?.location || {};
    // Ensure that reverseGeocode only runs if it hasn't been called before
    if (lat && lng && !hasGeocoded.current) {
      reverseGeocode(lat, lng);
      hasGeocoded.current = true; // Mark that geocoding has been performed
    }
  }, [values.location]); // Dependency array to check location changes

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          reverseGeocode(latitude, longitude);
        },
        (error) => {
          console.error("Error getting geolocation: ", error);
          formikHelpers.setFieldError(
            "location",
            `Error getting geolocation: ${error}`
          );
        }
      );
    }
  };

  const onPlaceSelect = (value) => {
    if (!value) {
      setAutocompleteValue("");
      formikHelpers.setFieldValue("location", {
        lat: "",
        lng: "",
        postcode: "",
        city: "",
        state: "",
        country: "",
      });
      return;
    }

    const { lat, lon, postcode, city, state, country } = value.properties;
    formikHelpers.setFieldValue("location", {
      ...values.location,
      lat: lat,
      lng: lon,
      postcode,
      city,
      state,
      country,
    });
  };

  const onDrop = (acceptedFiles, rejectedFiles) => {
    if (acceptedFiles.length) {
      if ([...values.images, ...acceptedFiles].length > 10) {
        formikHelpers.setFieldError(
          "images",
          "Maximum 10 images can be uploaded"
        );
      } else {
        formikHelpers.setFieldValue("images", [
          ...values.images,
          ...acceptedFiles,
        ]);
        setImages((previous) => [
          ...previous,
          ...acceptedFiles.map((file) => URL.createObjectURL(file)),
        ]);
      }
    }

    if (rejectedFiles.length) {
      if (rejectedFiles.length > 10) {
        formikHelpers.setFieldError(
          "images",
          "Maximum 10 images can be uploaded"
        );
        return;
      }
      formikHelpers.setFieldError(
        "images",
        "Only jpg, jpeg, webp, svg, gif, png files are allowed"
      );
    }
  };

  const removeImage = (index) => {
    const newImages = values.images.filter((_, i) => i !== index);
    formikHelpers.setFieldValue("images", newImages);
    const newPreviewImages = images.filter((_, i) => i !== index);
    setImages(newPreviewImages);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
    },
    maxFiles: 10,
    multiple: true,
    onDrop,
  });

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const isFormValid = await formikHelpers.validateForm();
    if (Object.keys(isFormValid).length !== 0) {
      setLoading(false);
      return;
    }
    formikHelpers.handleSubmit(e);
  };

  const handleFormReset = (e) => {
    setAutocompleteValue("");
    setImages([]);
    formikHelpers.handleReset(e);
  };

  return (
    <div className="sidebar-form">
      <div className="d-flex justify-content-between align-content-center align-items-center">
        <h4 className="page-title">Enter Item Details</h4>
        <Button
          variant="outline-dark"
          onClick={(e) => handleFormReset(e)}
          className="reset-btn"
        >
          Reset
        </Button>
      </div>
      <Form
        className="my-3"
        noValidate
        onSubmit={handleFormSubmit}
        method="post"
      >
        <Card.Text style={{ fontSize: "0.8rem" }}>
          Photos · {images.length}/10 – You can add up to 10 photos
        </Card.Text>
        <div className="image-upload-container my-2">
          <div className="image-preview-container">
            {images.map((image, index) => (
              <div key={index} className="image-wrapper">
                <Image src={image} thumbnail className="image-preview" />
                <ImCancelCircle
                  className="remove-icon"
                  onClick={() => removeImage(index)}
                />
              </div>
            ))}
            {images.length < 10 && (
              <div {...getRootProps({ className: "add-photo-wrapper" })}>
                <label className="add-photo-label">
                  <MdOutlineAddPhotoAlternate />
                  <div className="add-photo-text">Add photo</div>
                </label>
                <Form.Control
                  {...getInputProps()}
                  isInvalid={!!formikHelpers.errors.images}
                />
              </div>
            )}
          </div>
        </div>
        {formikHelpers.errors.images && (
          <div className="invalid-message">{formikHelpers.errors.images}</div>
        )}
        <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
        {/* Other form elements remain the same */}
        <Form.Group controlId="formItemName" className="mb-3">
          <Form.Label>Item Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            placeholder="Enter item name"
            value={values.name}
            onChange={formikHelpers.handleChange}
            isInvalid={!!formikHelpers.errors.name}
          />
          <Form.Control.Feedback type="invalid">
            {formikHelpers.errors.name}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formItemDescription" className="mb-3">
          <Form.Label>Item Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter item description"
            name="description"
            value={values.description}
            onChange={formikHelpers.handleChange}
            isInvalid={!!formikHelpers.errors.description}
          />
          <Form.Control.Feedback type="invalid">
            {formikHelpers.errors.description}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Estimated Value</Form.Label>
          <div className="d-flex justify-content-between align-items-end align-content-end">
            <div className="d-flex flex-column justify-content-between align-items-center align-content-center w-100">
              <div className="d-flex flex-row justify-content-between align-items-center align-content-center w-100">
                <span>${values.price[0]}</span>
                <span>${values.price[1]}</span>
              </div>
              <Slider
                getAriaLabel={(index) =>
                  index === 0 ? "Minimum price" : "Maximum price"
                }
                name="price"
                value={[...values.price]}
                onChange={formikHelpers.handleChange}
                sx={{
                  marginLeft: "1rem",
                  color: "black",
                  "& .MuiSlider-thumb": {
                    backgroundColor: "rgb(var(--color-primary))",
                    border: "2px solid rgb(var(--color-black))",
                  },
                  "& .MuiSlider-track": {
                    backgroundColor: "rgb(var(--color-black))",
                  },
                  "& .MuiSlider-rail": {
                    backgroundColor: "#ccc",
                  },
                }}
                min={0}
                max={5000}
                step={10}
              />
            </div>
          </div>
          {formikHelpers.errors.price && (
            <div className="invalid-message">{formikHelpers.errors.price}</div>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Tags</Form.Label>
          <Autocomplete
            multiple
            freeSolo
            options={[]}
            value={values.tags}
            onChange={(event, newValue) => {
              formikHelpers.setFieldValue("tags", newValue);
            }}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
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
                error={Boolean(formikHelpers.errors.tags)}
                helperText={formikHelpers.errors.tags}
              />
            )}
            sx={{
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
          {formikHelpers.errors.tags && (
            <div className="invalid-message">{formikHelpers.errors.tags}</div>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Category</Form.Label>
          <Form.Select
            value={values.category_id}
            onChange={formikHelpers.handleChange}
            name="category_id"
            isInvalid={!!formikHelpers.errors.category_id}
          >
            <option value="">select option</option>
            {getCategoryOptions()}
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            {formikHelpers.errors.category_id}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Item Condition</Form.Label>
          <Form.Select
            value={values.condition}
            isInvalid={!!formikHelpers.errors.condition}
            onChange={formikHelpers.handleChange}
            name="condition"
          >
            <option value="">select option</option>
            <option value="vintage">Vintage</option>
            <option value="old">Old</option>
            <option value="used">Used</option>
            <option value="likely_new">Likely New</option>
            <option value="brand_new">Brand New</option>
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            {formikHelpers.errors.condition}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3 d-flex justify-content-between align-items-start align-content-start">
          <div className="d-flex flex-column align-items-start align-content-start justify-content-start">
            <Form.Check
              type="switch"
              id="eco-friendly-switch"
              label="Eco-Friendly"
              name="eco_friendly"
              className="custom-switch"
              onChange={formikHelpers.handleChange}
              isInvalid={!!formikHelpers.errors.eco_friendly}
              value={values.eco_friendly}
              checked={Boolean(values.eco_friendly)}
            />
            <Form.Control.Feedback type="invalid">
              {formikHelpers.errors.eco_friendly}
            </Form.Control.Feedback>
          </div>
          <div className="d-flex flex-column align-items-start align-content-start justify-content-start">
            <Form.Check
              type="switch"
              id="recyclable-switch"
              label="Recyclable"
              name="recyclable"
              onChange={formikHelpers.handleChange}
              isInvalid={!!formikHelpers.errors.recyclable}
              value={values.recyclable}
              checked={Boolean(values.recyclable)}
              className="custom-switch"
            />
            <Form.Control.Feedback type="invalid">
              {formikHelpers.errors.recyclable}
            </Form.Control.Feedback>
          </div>
        </Form.Group>

        <Form.Group
          className="mb-3"
          style={{
            marginBottom: "20px",
            position: "relative",
            zIndex: 1000,
          }}
        >
          <Form.Label>Item Location</Form.Label>
          <GeoapifyContext apiKey={GEOAPIFY_API_KEY}>
            <GeoapifyGeocoderAutocomplete
              value={autocompleteValue}
              className="autocomplete-container"
              placeholder="Enter location here"
              placeSelect={onPlaceSelect}
            />
            <Tooltip title={"Current Location"} arrow>
              <IconButton
                aria-label="location"
                size="small"
                sx={{ position: "absolute", bottom: "1px", left: 0 }}
                onClick={handleCurrentLocation}
              >
                <MdMyLocation style={{ fontSize: "1.5rem" }} />
              </IconButton>
            </Tooltip>
          </GeoapifyContext>
        </Form.Group>
        {formikHelpers.errors.location &&
          Object.values(formikHelpers.errors.location).length > 0 && (
            <div className="invalid-message">
              {Object.values(formikHelpers.errors.location).join(", ")}
            </div>
          )}

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
  );
};

export default EditItemForm;
