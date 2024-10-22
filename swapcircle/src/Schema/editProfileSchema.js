import * as Yup from "yup";

const schema = Yup.object({
  username: Yup.string()
    .max(30, "Mobile number must be 10 digit long")
    .required("Field is required"),
  address: Yup.string(),
  email: Yup.string()
    .required("Field is required")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email format"
    ),
  phone_number: Yup.string()
    .matches(/^4\d{8}$/, "Input your phone number starting with 4, excluding 0 or +61.")
    .required("Field is required"),
  // old_password: Yup.string(),
  // new_password: Yup.string(),
  // confirm_password: Yup.string().oneOf(
  //   [Yup.ref("new_password"), null],
  //   "Passwords must match"
  // ),
});

export default schema;
