import Product from "../Entities/product.js";
import { AppDataSource } from "../DB/datasource.js";

export async function oneProduct(ctx){
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
      return selectedProduct;
}

export async function allProducts(ctx){
const Products = AppDataSource.getRepository(Product);
      const allTuples = await Products.find({
        relations: {
          Category: true,
        },
      });
      return allTuples;
}