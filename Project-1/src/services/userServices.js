import bcrypt from "bcryptjs";

import User from "../Entities/user.js";
import Role from "../Entities/role.js";
import { AppDataSource } from "../DB/datasource.js";

export async function registerUser(data) {
  const { Id, email, password, name, role } = data;
  const hashedPassword = await bcrypt.hash(password, 10);
  const userRepository = AppDataSource.getRepository(User);
  const roleRepository = AppDataSource.getRepository(Role);
  let roleEntity = await roleRepository.findOne({
      where:{
        id: role
      }
    })
    if (!roleEntity){
      throw new Error("Role not found");
    }
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
  const userRepository = AppDataSource.getRepository(User);
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
  const userRepository = AppDataSource.getRepository(User);
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

export async function updateUser(key, email, password, name, role) {
  const userRepository = AppDataSource.getRepository(User);
  const roleRepository = AppDataSource.getRepository(Role);
  let user = await userRepository.findOne({
    where: {
      Id: key,
    },
    relations:{
      Role: true
    }
  });
  if (email != undefined) {
    user.email = email;
  }
  if (password != undefined) {
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password= hashedPassword;
  }
  if (name != undefined) {
    user.name = name;
  }
  if (role != undefined) {
    let roleEntity = await roleRepository.findOne({
      where:{
        id: role
      }
    })
    if (!roleEntity){
      throw new Error("Role not found");
    }
    user.Role = roleEntity;
  }
  await userRepository.update({ Id: key }, user);
  return user;
}
