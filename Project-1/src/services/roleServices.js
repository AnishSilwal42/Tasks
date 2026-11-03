import Role from "../Entities/role.js";
import { AppDataSource } from "../DB/datasource.js";

const roleRepository = AppDataSource.getRepository(Role);

export async function getRoles() {
  return roleRepository.find({
    order: {
      id: "ASC",
    },
  });
}

export async function getRoleById(id) {
  return roleRepository.findOne({
    where: { id },
  });
}

export async function createRole(role) {
  const newRole = roleRepository.create(role);
  return roleRepository.save(newRole);
}

export async function updateRole(id, updatedRole) {
  const result = await roleRepository.update({ id }, updatedRole);
  if (!result.affected) {
    return null;
  }
  return getRoleById(id);
}

export async function deleteRole(id) {
  const result = await roleRepository.delete({ id });
  return Boolean(result.affected);
}