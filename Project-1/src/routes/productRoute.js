import Router from "@koa/router"

import roleGuard from "../middleware/roleGuard.js";
import auth from "../middleware/auth.js"
import * as productContoller from '../controller/productsController.js';
import upload from "../middleware/upload.js";

const router = new Router();


router.get("/products", productContoller.getProducts);

router.get("/products/:id", productContoller.getProduct);

router.get("/search",productContoller.queryProduct);

router.get("/api/categories", productContoller.getCategories);
router.get("/api/categories/:id", productContoller.getCategory);

// Admin operations
router.post("/api/products/insert",auth,roleGuard,upload.single("image"), productContoller.insertProduct );

router.post("/api/category/insert",auth,roleGuard, productContoller.insertCategory);
router.post("/api/categories",auth,roleGuard, productContoller.insertCategory);
router.put("/api/categories/:id",auth,roleGuard, productContoller.updateCategory);
router.delete("/api/categories/:id",auth,roleGuard, productContoller.deleteCategory);

router.put("/api/products/update/:id",auth,roleGuard,upload.single("imageURL"), productContoller.updateProduct);

router.delete("/api/products/delete/:id",auth,roleGuard, productContoller.deleteProduct);

export default router;