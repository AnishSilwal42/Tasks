import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import z from "zod";
import * as userServices from "../services/userServices.js";

export async function createUser(ctx) {
  userServices.userValidation(ctx);
  await userServices.registerUser(ctx);
  ctx.body = "User created";
}

export async function userLogin(ctx) {
  const userSchema = z.object({
    email: z.string().min(1, "Enter email"),
    password: z.string().min(1, "Enter Password"),
  });

  const result = userSchema.safeParse(ctx.request.body);
  const { email, password } = ctx.request.body;
  if (result.success) {
    const user = await userServices.findUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      ctx.throw(401, "Unauthorized Error");
    } 
     const token = jwt.sign(
    { email: user.email, name: user.name },
    process.env.JWT_SECRET,
    {
      expiresIn: "2h",
      algorithm: "HS256",
    },
  );
  ctx.body = { token };
  } else{
    const error = new Error("Validation failed");
    error.status = 401;
    error.details = result.error.issues.map((issue) => ({
      field: issue.path[0],
      message: issue.message,
    }));
    throw error;
  } 
}

export async function getUser(ctx) {
  ctx.body = { email: ctx.state.user.email, name: ctx.state.user.name };
}

export async function updateUser(ctx) {
  const userSchema = z.object({
    name: z.string().min(1, "Name is required").optional(),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email")
      .optional(),
    password: z.string().min(1, "Password is required").optional(),
  });
  const result = userSchema.safeParse(ctx.request.body);
  if (!result.success) {
    const error = new Error("Validation failed");
    error.status = 400;
    error.details = result.error.issues.map((issue) => ({
      field: issue.path[0],
      message: issue.message,
    }));
    throw error;
  }

  let { email, password, name } = result.data;

  userServices.updateUser(ctx.state.user.email, email, password, name);
  ctx.body = "User Updated";
}
