import { successResponse } from "../utils/apiResponse.js";
import {
  cartInsertionSchema,
  cartUpdateSchema,
} from "../validations/cartValidation.js";
import * as cartServices from "../services/cartServices.js";

function getCartItemId(ctx) {
  const id = Number(ctx.params.id);
  if (!Number.isSafeInteger(id) || id < 1) {
    ctx.throw(400, "Cart item ID must be a positive integer");
  }
  return id;
}

export async function addItemToCart(ctx) {
  const userId = ctx.state.user.jit;
  const { productId, quantity } = await cartInsertionSchema.validate(
    ctx.request.body,
    { abortEarly: false, stripUnknown: true },
  );
  const items = await cartServices.addItem(userId, productId, quantity);
  ctx.status = 201;
  ctx.body = successResponse("Item added to cart", items);
}

export async function updateCart(ctx) {
  const userId = ctx.state.user.jit;
  const itemId = getCartItemId(ctx);
  const { quantity } = await cartUpdateSchema.validate(ctx.request.body, {
    abortEarly: false,
    stripUnknown: true,
  });
  const items = await cartServices.updateItem(userId, itemId, quantity);
  if (!items) {
    ctx.throw(404, "Cart item not found");
  }
  ctx.status = 200;
  ctx.body = successResponse("Cart updated", items);
}

export async function removeItemFromCart(ctx) {
  const userId = ctx.state.user.jit;
  const itemId = getCartItemId(ctx);
  const removed = await cartServices.deleteItem(userId, itemId);
  if (!removed) {
    ctx.throw(404, "Cart item not found");
  }
  ctx.status = 200;
  ctx.body = successResponse("Item removed from cart");
}

export async function viewItemsFromCart(ctx) {
  const cart = await cartServices.getCurrentCart(ctx.state.user.jit);
  ctx.status = 200;
  ctx.body = successResponse("Cart found", cart);
}
