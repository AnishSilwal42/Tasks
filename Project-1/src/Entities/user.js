import {EntitySchema} from 'typeorm';

export default new EntitySchema({
    name: "User",
    tableName:"users",
    columns: {
        Id:{
            type:"varchar",
            length: "255",
            primary:true
        },
        email:{
            type:"varchar",
            length: "255",
            unique:true,
        },
        password:{
            type:"text",
            select: false
        },
        name:{
            type:"varchar",
            length: "255"
        }
    },
    relations:{
        Role:{
            type: "many-to-one",
            target: "role"
        }
    }
});