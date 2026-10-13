import bcrypt,{compare} from "bcryptjs";
import jwt from "jsonwebtoken";
import { v6 as uuidv6 } from 'uuid';

import {registrationSchema,loginSchema,userUpdateSchema} from "../validations/userValidation.js";
import * as userServices from "../services/userServices.js";

export async function createUser(ctx) {
  const validatedData = await registrationSchema.validate(ctx.request.body, {
    abortEarly: false,
  });
  let uuid = uuidv6();
  validatedData.Id = uuid;
  await userServices.registerUser(validatedData);
  ctx.status = 201;
  ctx.body = {"message":"User Created"};
}

export async function userLogin(ctx) {
  const validatedData = await loginSchema.validate(ctx.request.body, {
    abortEarly: false,
  });
  const { email, password } = validatedData;
  const user = await userServices.findUserByEmail(email);
  if(!user){
    ctx.throw(401,"Invalid credentials");
  }else if(!(await bcrypt.compare(password, user.password))){
    ctx.throw(401, "Unauthorized Error");
  }
  const token = jwt.sign(
    { email: user.email, name: user.name, jit: user.Id},
    process.env.JWT_SECRET,
    {
      expiresIn: "2h",
      algorithm: "HS256",
    },
  );
  ctx.status = 200;
  ctx.body = {"message": "User Logged-In", "token":token};
}

export async function getUser(ctx) {
  const user = await userServices.findUserById(ctx.state.user.jit);
  if (!user || !(ctx.state.user.jit === user.Id))
  {
    ctx.throw(401,"Unauthorized Error");
  }
  const {Id,email,name,Role}=user;
  ctx.status = 200;
  ctx.body = {
    message: "User Found",
    Id,
    email,
    name,
    "role": Role.role
  }
}

export async function updateUser(ctx) {
  const validatedData = await userUpdateSchema.validate(ctx.request.body);
  if(validatedData === undefined){
    ctx.throw(400,"Bad Request");
  }
  let { email, password, name, role } = validatedData;
  let updateDetails = {};
  if (email != undefined) {
    updateDetails = {...updateDetails,email};
  }
  if (password != undefined) {
    const hashPassword = await bcrypt.hash(password, 10);
    updateDetails = {...updateDetails,hashPassword};
  }
  if (name != undefined) {
    updateDetails = {...updateDetails,name};
  }
  if (role != undefined){
    if (userServices.isValidRole(role)){
      updateDetails = {...updateDetails,role};
    }
  }
  const user = await userServices.updateUser(ctx.state.user.jit, updateDetails);
  ctx.status = 200;
  ctx.body = {"message":"User Updated",user};
}
