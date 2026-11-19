import { EntitySchema } from "typeorm";

export const OrderItem = new EntitySchema({
  name: "OrderItem",
  tableName: "order_item",
  columns: {
    id: { type: "int", primary: true, generated: true },
    quantity: { type: "int" },
    unitPrice: { type: "float" },
  },
  relations: {
    Order: {
      type: "many-to-one",
      target: "Order",
      nullable: false,
      onDelete: "CASCADE",
      inverseSide: "OrderItem",
    },
    Product: {
      type: "many-to-one",
      target: "Product",
      nullable: false,
      onDelete: "RESTRICT",
    },
  },
  checks: [{ expression: `"quantity" > 0` }],
});
