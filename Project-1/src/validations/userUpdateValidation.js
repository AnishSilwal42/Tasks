import yup from "yup";

const userUpdateSchema = yup.object({
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
    .min(5)
    .optional(),

  password: yup.string().min(5,"Password should be atleast 5 characters").optional(),

  role: yup.number("Role should be in number").min(1, "Please enter your role").optional(),
});

export default userUpdateSchema;
