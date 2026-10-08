import yup from "yup";

const loginSchema = yup.object({

  email: yup
    .string()
    .trim()
    .lowercase()
    .required("Email is required.")
    .email("Please provide a valid email address."),

  password: yup.string().required("Password is required."),

});

export default loginSchema;
