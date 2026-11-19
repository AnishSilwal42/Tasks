import { EntitySchema } from "typeorm";

export const CartItem = new EntitySchema({
    name: "CartItem",
    tableName: "cart_item",
    columns: {
        id: { type: "int", primary: true, generated: true },
        quantity: { type: "int", default: 1 },
    },
    relations: {
        Cart: {
            type: "many-to-one",
            target: "Cart",
            nullable: false,
            onDelete: "CASCADE",
            inverseSide: "CartItem",
        },
        Product: {
            type: "many-to-one",
            target: "Product",
            nullable: false,
            onDelete: "CASCADE"
        }
    },
    uniques: [{ name: "UQ_cart_item_cart_product", columns: ["Cart", "Product"] }],
    checks: [{ expression: `"quantity" > 0` }],
});