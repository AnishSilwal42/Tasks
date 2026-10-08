import {EntitySchema} from 'typeorm';

export default new EntitySchema({
    name: "User",
    tableName:"users",
    columns: {
        email:{
            type:"varchar",
            length: "255",
            unique:true,
            primary:true
        },
        passwordHash:{
            type:"text"
        },
        name:{
            type:"varchar",
            length: "255"
        },
        role:{
            type:"varchar",
            length: "255"
        },
        uuid:{
            type:"varchar",
            length: "255"
        }
    }
});