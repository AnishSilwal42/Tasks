import bcrypt from "bcryptjs";

import User from "../Entities/user.js";
import Role from "../Entities/role.js";
import { AppDataSource } from "../DB/datasource.js";

const userRepository = AppDataSource.getRepository(User);
const roleRepository = AppDataSource.getRepository(Role);

export async function registerUser(data) {
  const { Id, email, password, name, role } = data;
  const hashedPassword = await bcrypt.hash(password, 10);
  isValidRole(role);
  const user = userRepository.create({
    Id,
    email,
    password:hashedPassword,
    name,
    Role: {
      id: role,
    },
  });
  await userRepository.save(user);
  console.log("User registered:", user);
}

export async function findUserByEmail(email) {
  
  const user = await userRepository.findOne({
    where: {
      email: email,
    },
    select:{
      email: true,
      password:true,
      name: true,
      Id: true
    }
  });
  return user;
}

export async function findUserById(id) {
  const user = await userRepository.findOne({
    where:{
      Id: id
    },
    relations:{
      Role: true
    }
  })
  console.log(user);
  return user;
}

export async function updateUser(key, updateDetails) {
  await userRepository.update({ Id: key }, updateDetails);
  return findUserById(key);
}

export async function isValidRole(role) {
  let roleEntity = await roleRepository.findOne({
      where:{
        id: role
      }
    })
    if (!roleEntity){
      throw new Error("Role not found");
    }
    return true;
}