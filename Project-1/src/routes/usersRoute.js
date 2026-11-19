import koaRouter from "@koa/router";

import auth from "../middleware/auth.js"
import  * as userContoller from "../controller/userController.js";

const router = new koaRouter();

router.post("/api/auth/register",userContoller.createUser);

router.post("/api/auth/login",userContoller.userLogin);

router.get("/api/users/me",auth, userContoller.getUser);

router.put("/api/users/me",auth, userContoller.updateUser);

export default router;