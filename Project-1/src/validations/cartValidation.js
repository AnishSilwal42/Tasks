import yup from "yup";

const positiveInteger = (message) =>
  yup.number().integer(message).positive(message);

export const cartInsertionSchema = yup.object({
  productId: positiveInteger("Product ID must be a positive integer").required(
    "Product ID is required",
  ),
  quantity: positiveInteger("Quantity must be a positive integer").required(
    "Quantity is required",
  ),
});

export const cartUpdateSchema = yup.object({
  quantity: positiveInteger("Quantity must be a positive integer").required(
    "Quantity is required",
  ),
});
