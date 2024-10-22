import * as Yup from "yup";

const schema = Yup.object({
  username: Yup.string().required("Field is required"),
  email: Yup.string()
    .required("Field is required")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email format"
    ),
  phone_number: Yup.string()
    .matches(/^4\d{8}$/, "Kindly input your phone number, excluding 0 or +61.")
    .required("Field is required"),
  password: Yup.string().required("Field is required"),
  // confirm_password: Yup.string()
  //   .oneOf([Yup.ref("password"), null], "Passwords must match")
  //   .required("Field is required"),
});

export default schema;
