import Router from '@koa/router';

import { getProducts, getProduct } from '../controller/productsController.js';

const router = new Router();

router.get("/products", getProducts);

router.get("/products/:id", getProduct);

export default router;