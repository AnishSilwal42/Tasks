import { DataSource } from "typeorm";

import Product from "../Entities/product.js";
import Category from "../Entities/category.js";
import "dotenv/config";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize:true,
    entities:[Product,Category],
    logging: false
});


AppDataSource.initialize()
.then(()=>console.log("Connection successful"))
.catch((error)=>console.log(error));


// Insert into category

// AppDataSource.initialize()
// .then(async ()=>{
//     console.log("Connected to database");
//     let obj =[{name:"electronics"},{name:"grocery"},{name:"clothes"}];
//     for(let x of obj){
//         let categoryrepo = AppDataSource.getRepository(Category);
//         await categoryrepo.save(x);
//     }
//     // display in console
//     let categoryrepo = AppDataSource.getRepository(Category);
//     let x = await categoryrepo.find();
//     console.log(x);
// })
// .catch((error)=>console.log(error));

//Insert into Product

// AppDataSource.initialize()
// .then(async()=>{
//     console.log("Connected to database");
//     let productrepo = AppDataSource.getRepository(Product);
//     let obj = productrepo.create({
//         name: "Samsung S26",
//         description: "MObile",
//         stock : 15,
//         price : 400000,
//         imageURL:"image",
//         Category:{
//             id:1
//         }
//     });
//     await productrepo.save(obj);
//     let data = await productrepo.find({
//         relations:{
//             Category:true
//         }
//     });
//     console.log(data);
// })