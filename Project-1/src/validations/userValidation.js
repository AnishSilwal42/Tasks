import yup from "yup";

const registrationSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required()
    .min(3, "Name must contain at least 3 characters.")
    .max(100, "Name cannot exceed 100 characters."),

  email: yup
    .string()
    .trim()
    .lowercase()
    .required()
    .email("Please provide a valid email address."),

  password: yup.string().required(),

  role: yup.string().required().min(1, "Enter role"),
});

export default registrationSchema;
