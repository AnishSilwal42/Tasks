import { EntitySchema } from "typeorm";

export default new EntitySchema({
    name: "Role",
    tableName:"role",
    columns: {
        id:{
            type:"int",
            primary:true,
            generated:true
        },
        role:{
            type: "varchar",
            length: "255"
        }
    },
    relations:{
        User:{
            type: "one-to-many",
            target: "users"
        }
    }
});