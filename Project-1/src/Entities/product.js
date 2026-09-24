import {EntitySchema} from "typeorm";

export default new EntitySchema({
    name: "Product",
    tableName:"products",
    columns: {
        id:{
            type:"int",
            primary:true,
            generated:true
        },
        name:{
            type: "varchar",
            length: "255"
        },
        description:{
            type:"text"
        },
        stock: {
            type:"int"
        },
        price:{
            type:"float"
        },
        imageURL:{
            type:"text"
        }
    },
    relations:{
        Category:{
            type:"many-to-one",
            target:"categories"
        }
    }
});