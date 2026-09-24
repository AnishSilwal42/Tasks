import Product from "../Entities/product.js";
import { AppDataSource } from "../DB/connection.js";

export default async function getProduct(ctx){
     //find by id
  const Products = AppDataSource.getRepository(Product);
  const selectedProduct = await Products.findOne({
    where: {
      id: ctx.params.id,
    },
    relations: {
      Category: true,
    },
  });
  if (selectedProduct) {
    ctx.body = selectedProduct;
  } else {
    ctx.throw(404, "Not found");
  }
}