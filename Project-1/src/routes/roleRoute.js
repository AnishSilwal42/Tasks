import koaRouter from "@koa/router";

import auth from "../middleware/auth.js"
import  * as roleController from "../controller/roleController.js";

const router = new koaRouter();

router.get("/api/roles", auth, roleController.getRoles);

router.get("/api/roles/:id", auth, roleController.getRole);

router.post("/api/roles", auth, roleController.createRole);

router.put("/api/roles/:id", auth, roleController.updateRole);

router.delete("/api/roles/:id", auth, roleController.deleteRole);

export default router;