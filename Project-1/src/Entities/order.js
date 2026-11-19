import { EntitySchema } from "typeorm";

export const OrderStatus = Object.freeze({
  PENDING: "pending",
  PAID: "paid",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
});

export const Order = new EntitySchema({
  name: "Order",
  tableName: "orders",
  columns: {
    id: { type: "int", primary: true, generated: true },
    status: {
      type: "enum",
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
    },
    total: { type: "float", default: 0 },
    createdAt: { type: "timestamp", createDate: true },
    updatedAt: { type: "timestamp", updateDate: true },
  },
  relations: {
    User: {
      type: "many-to-one",
      target: "User",
      nullable: false,
      onDelete: "CASCADE",
    },
    OrderItem: {
      type: "one-to-many",
      target: "OrderItem",
      inverseSide: "Order",
    },
  },
});
