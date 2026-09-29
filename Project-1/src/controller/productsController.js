import {oneProduct, allProducts} from '../services/productServices.js';

export async function getProduct(ctx){

  //find by id
  const Product = await oneProduct(ctx);
  if (Product) {
    ctx.body = Product;
  } else {
    ctx.throw(404, "Not found");
  }
}


export async function getProducts(ctx){
    {
      const Products = await allProducts(ctx);
        ctx.status=200
        ctx.body = Products;
    }
}