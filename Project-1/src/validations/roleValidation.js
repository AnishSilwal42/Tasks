import yup from "yup";

export const roleSchema = yup.object({
  role: yup
  .string()
  .trim()
  .required("Role is required")
  .min(2,"Role should be atleast of two characters.")
})