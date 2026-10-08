import yup from "yup";

const optionalSchema = yup.object({
  name: yup
    .string()
    .trim()
    .min(3, "Name must contain at least 3 characters.")
    .max(100, "Name cannot exceed 100 characters.")
    .optional(),

  email: yup
    .string()
    .trim()
    .lowercase()
    .email("Please provide a valid email address.")
    .optional(),

  password: yup.string().min(1,"Enter password").optional(),

  role: yup.string().min(1, "Enter role").optional(),
});

export default optionalSchema;
