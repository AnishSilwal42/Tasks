import { OrderStatus } from "../Entities/order.js";
import { successResponse } from "../utils/apiResponse.js";
import * as orderServices from "../services/orderServices.js";

function getOrderId(ctx) {
  const id = Number(ctx.params.id);
  if (!Number.isSafeInteger(id) || id < 1) {
    ctx.throw(400, "Order ID must be a positive integer");
  }
  return id;
}

export async function checkout(ctx) {
  const order = await orderServices.checkout(ctx.state.user.jit);
  ctx.status = 201;
  ctx.body = successResponse("Order placed", order);
}

export async function listUserOrders(ctx) {
  const orders = await orderServices.listUserOrders(ctx.state.user.jit);
  ctx.status = 200;
  ctx.body = successResponse("Orders found", orders);
}

export async function getUserOrder(ctx) {
  const order = await orderServices.getUserOrder(
    ctx.state.user.jit,
    getOrderId(ctx),
  );
  if (!order) {
    ctx.throw(404, "Order not found");
  }
  ctx.status = 200;
  ctx.body = successResponse("Order found", order);
}

export async function listAllOrders(ctx) {
  const orders = await orderServices.listAllOrders();
  ctx.status = 200;
  ctx.body = successResponse("Orders found", orders);
}

export async function updateOrderStatus(ctx) {
  const orderId = getOrderId(ctx);
  const { status } = ctx.request.body ?? {};
  if (!Object.values(OrderStatus).includes(status)) {
    ctx.throw(400, "Invalid order status");
  }

  const order = await orderServices.updateOrderStatus(orderId, status);
  if (!order) {
    ctx.throw(404, "Order not found");
  }
  ctx.status = 200;
  ctx.body = successResponse("Order status updated", order);
}