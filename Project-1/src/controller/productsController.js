import fs from "fs/promises";

import * as productServices from "../services/productServices.js";
import { successResponse } from "../utils/apiResponse.js";
import {
  productSchema,
  productCategorySchema,
  productUpdateSchema,
} from "../validations/productValidation.js";

function getCategoryId(ctx) {
  const id = Number(ctx.params.id);
  if (!Number.isSafeInteger(id) || id < 1) {
    ctx.throw(400, "Category ID must be a positive integer");
  }
  return id;
}

export async function getProduct(ctx) {
  //find by id
  const id = ctx.params.id;
  const Product = await productServices.findProductById(id);
  if (Product) {
    ctx.status = 200;
    ctx.body = successResponse("Product found", Product);
  } else {
    ctx.throw(404, "Not found");
  }
}

export async function getProducts(ctx) {
  const Products = await productServices.allProducts(ctx);
  ctx.status = 200;
  ctx.body = successResponse("Products found", Products);
}

export async function insertProduct(ctx) {
  const { name, description, stock, price, category } = ctx.request.body;

  const image = ctx.file;

  if (!image) {
    ctx.throw(400, "Please provide image of the product");
  }

  const imageURL = image.filename;

  const validatedData = await productSchema.validate({
    name,
    description,
    stock,
    price,
    imageURL,
    category,
  });

  const product = await productServices.addProduct(validatedData);

  ctx.status = 201;

  ctx.body = successResponse("Product added", product);
}

export async function insertCategory(ctx) {
  const validatedData = await productCategorySchema.validate(ctx.request.body, {
    abortEarly: false,
    stripUnknown: true,
  });
  const category = await productServices.addCategory(validatedData);
  ctx.status = 201;
  ctx.body = successResponse("Category added", category);
}

export async function getCategories(ctx) {
  const categories = await productServices.allCategories();
  ctx.status = 200;
  ctx.body = successResponse("Categories found", categories);
}

export async function getCategory(ctx) {
  const id = getCategoryId(ctx);
  const category = await productServices.findCategoryById(id);
  if (!category) {
    ctx.throw(404, "Category not found");
  }
  ctx.status = 200;
  ctx.body = successResponse("Category found", category);
}

export async function updateCategory(ctx) {
  const id = getCategoryId(ctx);
  const validatedData = await productCategorySchema.validate(ctx.request.body, {
    abortEarly: false,
    stripUnknown: true,
  });
  const category = await productServices.updateCategory(id, validatedData);
  if (!category) {
    ctx.throw(404, "Category not found");
  }
  ctx.status = 200;
  ctx.body = successResponse("Category updated", category);
}

export async function deleteCategory(ctx) {
  const id = getCategoryId(ctx);
  const category = await productServices.findCategoryById(id);
  if (!category) {
    ctx.throw(404, "Category not found");
  }
  if (await productServices.categoryHasProducts(id)) {
    ctx.throw(409, "Cannot delete a category that contains products");
  }
  await productServices.removeCategory(id);
  ctx.status = 200;
  ctx.body = successResponse("Category deleted");
}

export async function updateProduct(ctx) {
  const id = ctx.params.id;
  const validData = await productUpdateSchema.validate(ctx.request.body);
  if (ctx.file) {
    const oldImageURL = await productServices.findProductById(id);
    await fs.unlink(`${oldImageURL.imageURL}`);
    validData.imageURL = `uploads/${ctx.file.filename}`;
  }
  if (validData != undefined) {
    let updatedProduct = await productServices.productDetailsUpdate(
      id,
      validData,
    );
    ctx.status = 200;
    ctx.body = successResponse("Product updated", updatedProduct);
  }
}

export async function deleteProduct(ctx) {
  const id = ctx.params.id;
  await productServices.removeProduct(id);
  ctx.status = 200;
  ctx.body = successResponse("Product deleted");
}

export async function queryProduct(ctx) {
  const page = Number(ctx.query.page) || 1;
  const limit = Number(ctx.query.limit) || 10;

  const category = ctx.query.category;
  const minPrice =
    ctx.query.minPrice !== undefined ? Number(ctx.query.minPrice) : undefined;
  const maxPrice =
    ctx.query.maxPrice !== undefined ? Number(ctx.query.maxPrice) : undefined;
  const sort = ctx.query.sort || "ASC";

  const offset = (page - 1) * limit;

  const [products, total] = await productServices.searchQueryProduct(
    offset,
    limit,
    category,
    minPrice,
    maxPrice,
    sort,
  );

  const totalPages = Math.ceil(total / limit);

  ctx.status = 200;

  ctx.body = successResponse("Products found", {
    products,
    pagination: {
      currentPage: page,
      perPage: limit,
      totalItems: total,
      totalPages: totalPages,
    },
  });
}
