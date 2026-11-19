import Router from "@koa/router";

import auth from "../middleware/auth.js";
import roleGuard from "../middleware/roleGuard.js";
import * as orderController from "../controller/orderController.js";

const orderRouter = new Router({ prefix: "/api/orders" });

orderRouter.post("/", auth, orderController.checkout);
orderRouter.get("/admin", auth, roleGuard, orderController.listAllOrders);
orderRouter.patch(
  "/admin/:id",
  auth,
  roleGuard,
  orderController.updateOrderStatus,
);
orderRouter.get("/", auth, orderController.listUserOrders);
orderRouter.get("/:id", auth, orderController.getUserOrder);

export default orderRouter;
