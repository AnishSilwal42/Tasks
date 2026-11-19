import { AppDataSource } from "../DB/datasource.js";
import { Cart } from "../Entities/cart.js";
import { CartItem } from "../Entities/cartItems.js";
import { Order, OrderStatus } from "../Entities/order.js";
import { OrderItem } from "../Entities/orderItems.js";
import Product from "../Entities/product.js";

function throwHttpError(status, message) {
  const error = new Error(message);
  error.status = status;
  throw error;
}

export async function checkout(userId) {
  return AppDataSource.transaction(async (manager) => {
    const cartRepository = manager.getRepository(Cart);
    const cart = await cartRepository.findOne({
      where: { User: { Id: userId } },
      lock: { mode: "pessimistic_write" },
    });
    if (!cart) {
      throwHttpError(400, "Cart is empty");
    }

    const cartItemRepository = manager.getRepository(CartItem);
    const cartItems = await cartItemRepository.find({
      where: { Cart: { id: cart.id } },
      relations: { Product: true },
    });
    if (cartItems.length === 0) {
      throwHttpError(400, "Cart is empty");
    }
    cartItems.sort((a, b) => a.Product.id - b.Product.id);

    const productRepository = manager.getRepository(Product);
    const orderItemRepository = manager.getRepository(OrderItem);
    const orderItems = [];
    let total = 0;

    for (const cartItem of cartItems) {
      const product = await productRepository.findOne({
        where: { id: cartItem.Product.id },
        lock: { mode: "pessimistic_write" },
      });
      if (!product || product.stock < cartItem.quantity) {
        throwHttpError(
          409,
          `Insufficient stock for ${cartItem.Product.name}`,
        );
      }

      const unitPrice = Number(product.price);
      product.stock -= cartItem.quantity;
      await productRepository.save(product);

      total += unitPrice * cartItem.quantity;
      orderItems.push({
        quantity: cartItem.quantity,
        unitPrice,
        Product: { id: product.id },
      });
    }

    const orderRepository = manager.getRepository(Order);
    const order = orderRepository.create({
      total,
      status: OrderStatus.PENDING,
      User: { Id: userId },
    });
    const savedOrder = await orderRepository.save(order);

    await orderItemRepository.save(
      orderItems.map((item) =>
        orderItemRepository.create({
          ...item,
          Order: { id: savedOrder.id },
        }),
      ),
    );
    await cartItemRepository.remove(cartItems);

    return orderRepository.findOne({
      where: { id: savedOrder.id },
      relations: { OrderItem: { Product: true } },
    });
  });
}

export async function listUserOrders(userId) {
  return AppDataSource.getRepository(Order).find({
    where: { User: { Id: userId } },
    relations: { OrderItem: { Product: true } },
    order: { createdAt: "DESC" },
  });
}

export async function getUserOrder(userId, orderId) {
  return AppDataSource.getRepository(Order).findOne({
    where: { id: orderId, User: { Id: userId } },
    relations: { OrderItem: { Product: true } },
  });
}

export async function listAllOrders() {
  return AppDataSource.getRepository(Order).find({
    relations: { User: true, OrderItem: { Product: true } },
    order: { createdAt: "DESC" },
  });
}

export async function updateOrderStatus(orderId, status) {
  const orderRepository = AppDataSource.getRepository(Order);
  const order = await orderRepository.findOneBy({ id: orderId });
  if (!order) {
    return null;
  }

  order.status = status;
  await orderRepository.save(order);
  return orderRepository.findOne({
    where: { id: orderId },
    relations: { User: true, OrderItem: { Product: true } },
  });
}
 