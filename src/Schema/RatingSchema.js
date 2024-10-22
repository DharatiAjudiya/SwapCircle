import * as Yup from "yup";

const schema = Yup.object({
  review: Yup.string()
    .min(10, "Review must be at least 10 characters")
    .required("Review is required"),
  rating: Yup.number().required("Rating is required"),
  user_id: Yup.string().required("Field is required"),
});

export default schema;
