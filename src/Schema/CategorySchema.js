import * as Yup from "yup";

const schema = Yup.object({
  category: Yup.string().required("Field is required"),
});

export default schema;
