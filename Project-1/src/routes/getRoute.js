import Router from 'koa-router';

import getProducts from '../controller/getProducts.js';
import getProduct from '../controller/getProduct.js';

const router = new Router();

router.get("/products", getProducts);

router.get("/products/:id", getProduct);

export default router;