import fs from 'fs/promises';

import * as productServices from '../services/productServices.js';
import {productSchema,productCategorySchema,productUpdateSchema} from '../validations/productValidation.js'

export async function getProduct(ctx){

  //find by id
  const id = ctx.params.id;
  const Product = await productServices.findProductById(id);
  if (Product) {
    ctx.body = Product;
  } else {
    ctx.throw(404, "Not found");
  }
}


export async function getProducts(ctx){
      const Products = await productServices.allProducts(ctx);
        ctx.status=200
        ctx.body = Products;
}


export async function insertProduct(ctx) {

    const {
        name,
        description,
        stock,
        price,
        category
    } = ctx.request.body;

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
        category
    });

    const product = await productServices.addProduct(validatedData);

    ctx.status = 201;

    ctx.body = {
        message: "Product added",
        product
    };
}

export async function insertCategory(ctx){
  const validatedData = await productCategorySchema.validate(ctx.request.body);
  const category = await productServices.addCategory(validatedData);
  ctx.status = 201;
  ctx.body = {
    "message": 201,
    category
  }
}

export async function updateProduct(ctx) {
  const id = ctx.params.id;
  const validData = await productUpdateSchema.validate(ctx.request.body);
  if(ctx.file){
      const oldImageURL = await productServices.findProductById(id);
      await fs.unlink(`${oldImageURL.imageURL}`);
      validData.imageURL = `uploads/${ctx.file.filename}`;
    };
  if (validData != undefined){
    let updatedProduct = await productServices.productDetailsUpdate(id,validData);
    ctx.status = 200;
    ctx.body = {
      "message": "Product Updated",
      updatedProduct
    }
  }
}

export async function deleteProduct(ctx){
  const id = ctx.params.id;
  await productServices.removeProduct(id);
  ctx.status = 204;
  console.log(`Product ID: ${id} deleted successfully.`);
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
        sort
    );

    const totalPages = Math.ceil(total / limit);

    ctx.status = 200;

    ctx.body = {
        data: products,
        pagination: {
            currentPage: page,
            perPage: limit,
            totalItems: total,
            totalPages: totalPages
        }
    };
}