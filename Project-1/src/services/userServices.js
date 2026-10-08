import bcrypt from "bcryptjs";

import User from "../Entities/user.js";
import { AppDataSource } from "../DB/datasource.js";

export async function registerUser(data) {
  const { email, password, name, role } = data;
  const hashedPassword = await bcrypt.hash(password, 10);
  const userRepository = AppDataSource.getRepository(User);
  const user = userRepository.create({
    email: email,
    passwordHash: hashedPassword,
    name: name,
    role: role,
  });
  await userRepository.save(user);
  console.log("User registered:", user);
}

export async function findUserByEmail(email) {
  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOne({
    where: {
      email: email,
    },
  });
  return user;
}

export async function saveUuid(email,uuid){
  const userRepository = AppDataSource.getRepository(User);
  userRepository.update({email:email},{"uuid":uuid});
}

export async function updateUser(key, email, password, name, role, uuid) {
  const userRepository = AppDataSource.getRepository(User);
  let user = await userRepository.findOne({
    where: {
      email: key,
    },
  });
  if (email != undefined) {
    user.email = email;
  }
  if (password != undefined) {
    const hashedPassword = await bcrypt.hash(password, 10);
    user.passwordHash = hashedPassword;
  }
  if (name != undefined) {
    user.name = name;
  }
  if (role != undefined) {
    user.role = role;
  }
  user.uuid = uuid;
  await userRepository.update({ email: key }, user);
  return user;
}
