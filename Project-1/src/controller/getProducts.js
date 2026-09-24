import { AppDataSource } from "../DB/connection.js";
import Product from "../Entities/product.js";

export default async function getProducts(ctx){
    {
      const Products = AppDataSource.getRepository(Product);
      const allTuples = await Products.find({
        relations: {
          Category: true,
        },
      });
      if (allTuples) {
        ctx.body = allTuples;
      } else {
        ctx.throw(404, "Not found");
      }
    }
}