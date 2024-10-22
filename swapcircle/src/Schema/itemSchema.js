import * as Yup from "yup";

const schema = Yup.object({
  images: Yup.array()
    .of(Yup.string().required())
    .min(1, "Please upload at least 1 image")
    .max(10, "Maximum 10 Images Is allowed")
    .required("Field is required"),
  name: Yup.string().required("Field is required"),
  description: Yup.string().required("Field is required"),
  price: Yup.array()
    .of(Yup.number().required("price range must be number"))
    .max(2, "values are out of range")
    .required("Field is required"),
  tags: Yup.array().of(Yup.string().required("Each tag must be a string")),
  category_id: Yup.string().required("Field is required"),
  condition: Yup.string()
    .required("Field is required")
    .oneOf(
      ["vintage", "old", "used", "likely_new", "brand_new"],
      "Invalid Condition type"
    ),
  ecoFriendly: Yup.boolean(),
  recyclable: Yup.boolean(),
  location: Yup.object({
    lat: Yup.number().required("Latitude is required"),
    lng: Yup.number().required("Longitude is required"),
    postcode: Yup.number().notRequired(),
    city: Yup.string().notRequired(),
    state: Yup.string().notRequired(),
    country: Yup.string().notRequired(),
  }).required("Location is required"),
});

export default schema;