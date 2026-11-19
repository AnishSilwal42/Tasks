import * as roleServices from "../services/roleServices.js";
import { roleSchema } from "../validations/roleValidation.js";
import { successResponse } from "../utils/apiResponse.js";

function getRoleId(ctx) {
  const id = Number(ctx.params.id);
  if (!Number.isSafeInteger(id) || id < 1) {
    ctx.throw(400, "Role ID must be a positive integer");
  }
  return id;
}

export async function getRoles(ctx) {
  const roles = await roleServices.getRoles();
  ctx.status = 200;
  ctx.body = successResponse("Roles found", roles);
}

export async function getRole(ctx) {
  const id = getRoleId(ctx);
  const role = await roleServices.getRoleById(id);
  if (!role) {
    ctx.throw(404, "Role not found");
  }
  ctx.status = 200;
  ctx.body = successResponse("Role found", role);
}

export async function createRole(ctx) {
  const validRole = await roleSchema.validate(ctx.request.body, {
    abortEarly: false,
    stripUnknown: true,
  });
  const role = await roleServices.createRole(validRole);
  ctx.status = 201;
  ctx.body = successResponse("Role created", role);
}

export async function updateRole(ctx) {
  const id = getRoleId(ctx);
  const validRole = await roleSchema.validate(ctx.request.body, {
    abortEarly: false,
    stripUnknown: true,
  });
  const role = await roleServices.updateRole(id, validRole);
  if (!role) {
    ctx.throw(404, "Role not found");
  }
  ctx.status = 200;
  ctx.body = successResponse("Role updated", role);
}

export async function deleteRole(ctx) {
  const id = getRoleId(ctx);
  const deleted = await roleServices.deleteRole(id);
  if (!deleted) {
    ctx.throw(404, "Role not found");
  }
  ctx.status = 200;
  ctx.body = successResponse("Role deleted");
}