import { EntitySchema } from "typeorm";

export const Cart = new EntitySchema({
  name: "Cart",
  tableName: "cart",
  columns: {
    id: { type: "int", primary: true, generated: true },
    createdAt: { type: "timestamp", createDate: true },
    updatedAt: { type: "timestamp", updateDate: true },
  },
  relations: {
    User: {
      type: "one-to-one",
      target: "User",
      joinColumn: { referencedColumnName: "Id" },
      nullable: false,
      onDelete: "CASCADE",
    },
    CartItem: {
      type: "one-to-many",
      target: "CartItem",
      inverseSide: "Cart",
    },
  },
});
