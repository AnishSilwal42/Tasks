import { EntitySchema } from "typeorm";

export default new EntitySchema({
    name: "Category",
    tableName: "categories",
    columns:{
        id:{
            type:"int",
            primary:true,
            generated:true
        },
        name: {
            type:"varchar",
            length:"255"
        }
    },
    relations:{
        product:{
            type:"one-to-many",
            target:"products",
        }
    }
});