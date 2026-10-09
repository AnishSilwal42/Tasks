import yup from "yup";

const registrationSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Name is required")
    .min(3, "Name must contain at least 3 characters.")
    .max(50, "Name cannot exceed 50 characters."),

  email: yup
    .string()
    .trim()
    .lowercase()
    .required("Email is required")
    .email("Please provide a valid email address."),

  password: yup.string().min(5,"Password should be atleast 5 characters").required("Password is required"),

  role: yup.number().required("Role is required")
});

export default registrationSchema;
