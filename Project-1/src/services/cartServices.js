import { AppDataSource } from "../DB/datasource.js";

import {Cart} from "../Entities/cart.js";
import {CartItem} from "../Entities/cartItems.js";
import Product from "../Entities/product.js";

const cartRepository = AppDataSource.getRepository(Cart);
const cartItemsRepository = AppDataSource.getRepository(CartItem);
const productRepository = AppDataSource.getRepository(Product);

function throwHttpError(status, message) {
  const error = new Error(message);
  error.status = status;
  throw error;
}

async function findOrCreateCart(userId) {
  let cart = await cartRepository.findOne({
    where: { User: { Id: userId } },
  });

  if (!cart) {
    cart = cartRepository.create({ User: { Id: userId } });
    cart = await cartRepository.save(cart);
  }

  return cart;
}

async function getCartItems(userId) {
  const cart = await cartRepository.findOne({
    where: { User: { Id: userId } },
    relations: { CartItem: { Product: true } },
  });
  return (cart?.CartItem ?? []).map((item) => ({
    ...item,
    totalPrice: item.quantity * Number(item.Product.price),
  }));
}

export async function addItem(userId, productId, quantity) {
  const product = await productRepository.findOneBy({ id: productId });
  if (!product) {
    throwHttpError(404, "Product not found");
  }
  const cart = await findOrCreateCart(userId);

  let item = await cartItemsRepository.findOne({
    where: { Cart: { id: cart.id }, Product: { id: productId } },
  });
  const requestedQuantity = (item ? item.quantity:0) + quantity;
  if (requestedQuantity > product.stock) {
    throwHttpError(
      409,
      `Stock insufficient. Only ${product.stock} item(s) are available`,
    );
  }

  if (item) {
    item.quantity = requestedQuantity;
  } else {
    item = cartItemsRepository.create({
      quantity,
      Cart: { id: cart.id },
      Product: { id: productId },
    });
  }
  await cartItemsRepository.save(item);
  return getCartItems(userId);
}

export async function updateItem(userId, itemId, quantity) {
  const item = await cartItemsRepository.findOne({
    where: {
      id: itemId,
      Cart: { User: { Id: userId } },
    },
    relations: { Product: true },
  });
  if (!item) {
    return null;
  }
  if (quantity > item.Product.stock) {
    throwHttpError(
      409,
      `Stock insufficient. Only ${item.Product.stock} item(s) are available`,
    );
  }

  item.quantity = quantity;
  await cartItemsRepository.save(item);
  return getCartItems(userId);
}

export async function deleteItem(userId, itemId) {
  const item = await cartItemsRepository.findOne({
    where: {
      id: itemId,
      Cart: { User: { Id: userId } },
    },
  });
  if (!item) {
    return false;
  }

  await cartItemsRepository.remove(item);
  return true;
}

export async function getCurrentCart(userId) {
  const items = await getCartItems(userId);
  const totalItems = items.length;
  const totalPrice = items.reduce(
    (total, item) => total + item.quantity * Number(item.Product.price),
    0,
  );

  return { items, totalItems, totalPrice };
}
