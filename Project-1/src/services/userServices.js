import bcrypt from "bcryptjs";
import z from "zod";

import User from '../Entities/user.js';
import { AppDataSource } from "../DB/datasource.js";

export async function registerUser(ctx){
    const { email, password, name } = ctx.request.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const userRepository = AppDataSource.getRepository(User);
  const obj = userRepository.create({
    email: email,
    passwordHash: hashedPassword,
    name: name,
    role: "user",
  });
    await userRepository.save(obj);
    ctx.status = 201;
    console.log("User registered:", obj);
}

export async function findUserByEmail(email){
const userRepository = AppDataSource.getRepository(User);
const user = await userRepository.findOne({
    where: {
        email: email,
    }
});
return user;
}

const userSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().min(1, "Email is required").email("Invalid email"),
    password: z.string().min(1, "Password is required"),
    // role: z.string().min(1, "Role is required: Admin or User")
});

export  function userValidation(ctx) {
  const result = userSchema.safeParse(ctx.request.body);
    console.log("Validated")
  if (!result.success) {
    const error = new Error("Validation failed");
    error.status = 400;
    error.details = result.error.issues.map((issue) => ({
      field: issue.path[0],
      message: issue.message,
    }));
    throw error;
  }
}

export async function updateUser(key,email,password,name){
    const userRepository = AppDataSource.getRepository(User);
    let user = await userRepository.findOne({where:{
        email: key
    }});
    if(email != undefined){
        user.email= email;
    }
    if (password != undefined)
    {
        user.password = password;
    }
    if( name != undefined){
        user.name = name;
    }
    await userRepository.update({email:key},user);
    
}
