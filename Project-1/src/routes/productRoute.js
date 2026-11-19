import Router from "@koa/router"

import roleGuard from "../middleware/roleGuard.js";
import auth from "../middleware/auth.js"
import * as productContoller from '../controller/productsController.js';
import upload from "../middleware/upload.js";

const productRouter = new Router();


productRouter.get("/products", productContoller.getProducts);

productRouter.get("/products/:id", productContoller.getProduct);

productRouter.get("/search",productContoller.queryProduct);

productRouter.get("/api/categories", productContoller.getCategories);
productRouter.get("/api/categories/:id", productContoller.getCategory);

// Admin operations
productRouter.post("/api/products/insert",auth,roleGuard,upload.single("image"), productContoller.insertProduct );

productRouter.post("/api/category/insert",auth,roleGuard, productContoller.insertCategory);
productRouter.post("/api/categories",auth,roleGuard, productContoller.insertCategory);
productRouter.put("/api/categories/:id",auth,roleGuard, productContoller.updateCategory);
productRouter.delete("/api/categories/:id",auth,roleGuard, productContoller.deleteCategory);

productRouter.put("/api/products/update/:id",auth,roleGuard,upload.single("imageURL"), productContoller.updateProduct);

productRouter.delete("/api/products/delete/:id",auth,roleGuard, productContoller.deleteProduct);

export default productRouter;