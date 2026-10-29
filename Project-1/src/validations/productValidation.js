import yup from "yup";

export const productSchema = yup.object({
  name: yup.string("Invalid data-type").trim().required("Name is required"),
  description: yup
    .string("Invalid data-type")
    .required("Description is required"),

  stock: yup.number("Invalid data-type").required("Stock is required"),

  price: yup.number("Invalid data-type").required("Price is required"),

  imageURL: yup.string("Enter url of image").required("Image is required"),

  category: yup.number("Invalid data-type").required("Category is required"),
});

export const productCategorySchema = yup.object({
  name: yup.string("Invalid data-type").required("Category is required"),
});

export const productUpdateSchema = yup.object({
  name: yup.string("Invalid data-type").trim().min(3,"Name cannot be empty").optional(),

  description: yup.string("Invalid data-type").min(4,"Description cannot be empty").optional(),

  stock: yup.number("Invalid data-type").min(1,"Stock cannot be empty").optional(),

  price: yup.number("Invalid data-type").min(1,"Price cannot be empty").optional(),

  category: yup.number("Invalid data-type").min(1,"Category cannot be empty").optional(),
});
