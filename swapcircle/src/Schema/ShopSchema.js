import * as Yup from "yup";

const schema = Yup.object({
  lat: Yup.number(),
  lng: Yup.number(),
  radius: Yup.number(),
  condition: Yup.array().of(
    Yup.string().oneOf(
      ["vintage", "old", "used", "likely_new", "brand_new"],
      "Invalid Condition type"
    )
  ),
  env_condition: Yup.array().of(
    Yup.string().required("Each tag must be a string")
  ),
  tags: Yup.array().of(Yup.string().required("Each tag must be a string")),
  // rating: Yup.number(),
  filterby: Yup.string().oneOf(
    ["NONE", "NEW", "RATE_HIGH", "RATE_LOW"],
    "Invalid Condition type"
  ),
});

export default schema;
