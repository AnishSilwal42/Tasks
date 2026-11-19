import Router from "@koa/router";

import auth from "../middleware/auth.js";
import * as cartController from "../controller/cartController.js";

const cartRouter = new Router();

cartRouter.post("/api/cart", auth, cartController.addItemToCart);

cartRouter.put("/api/cart/:id", auth, cartController.updateCart);

cartRouter.delete("/api/cart/:id", auth, cartController.removeItemFromCart);

cartRouter.get("/api/cart", auth, cartController.viewItemsFromCart);

export default cartRouter;

