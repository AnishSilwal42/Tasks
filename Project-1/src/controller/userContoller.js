import bcrypt, { compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid';

import loginSchema  from "../validations/loginValidation.js";
import optionalSchema from "../validations/optionalValidation.js"
import registrationSchema from "../validations/userValidation.js";
import * as userServices from "../services/userServices.js";

export async function createUser(ctx) {
  const validatedData = await registrationSchema.validate(ctx.request.body, {
    abortEarly: false,
  });
  await userServices.registerUser(validatedData);
  ctx.status = 201;
  ctx.body = "User created";
}

export async function userLogin(ctx) {
  const validatedData = await loginSchema.validate(ctx.request.body, {
    abortEarly: false,
  });
  const { email, password } = validatedData;
  const user = await userServices.findUserByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    ctx.throw(401, "Unauthorized Error");
  }
  const uuid = uuidv4();
  await userServices.saveUuid(email,uuid);
  const token = jwt.sign(
    { email: user.email, name: user.name, jit: uuid},
    process.env.JWT_SECRET,
    {
      expiresIn: "2h",
      algorithm: "HS256",
    },
  );
  ctx.body = { token };
}

export async function getUser(ctx) {
  const user = await userServices.findUserByEmail(ctx.state.user.email);
  if (!user || !(ctx.state.user.jit === user.uuid))
  {
    ctx.throw(401,"Unauthorized Error");
  }
  ctx.body = {
    "email": user.email,
    "name": user.name,
    "role": user.role,
    "uuid": user.uuid
  }
}

export async function updateUser(ctx) {
  const validatedData = await optionalSchema.validate(ctx.request.body);
  const uuid = uuidv4();
  let { email, password, name, role } = validatedData;
  const user = await userServices.updateUser(ctx.state.user.email, email, password, name, role, uuid);
  const token = jwt.sign(
    { email: user.email, name: user.name, jit: user.uuid},
    process.env.JWT_SECRET,
    {
      expiresIn: "2h",
      algorithm: "HS256",
    },
  );
  ctx.body = {"message":"User Updated", "Token":{token}};
}
