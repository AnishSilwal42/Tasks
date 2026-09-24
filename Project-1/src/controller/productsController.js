import {oneProduct, allProducts} from '../services/productServices.js';

export async function getProduct(ctx){

     //find by id
  const oneTuple = await oneProduct(ctx);
  if (oneTuple) {
    ctx.body = oneTuple;
  } else {
    ctx.throw(403, "Not found");
  }
}


export async function getProducts(ctx){
    {
      const allTuples = await allProducts(ctx);
        ctx.status=200
        ctx.body = allTuples;
    }
}