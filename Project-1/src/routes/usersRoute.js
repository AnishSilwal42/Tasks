import  * as user_interface from "../controller/userContoller.js";
import koaRouter from "@koa/router";
import koaJwt from "koa-jwt";

const router = new koaRouter();

const auth = koaJwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] });

router.post("/api/auth/register",user_interface.createUser);

router.post("/api/auth/login",user_interface.userLogin);

router.get("/api/users/me",auth, user_interface.getUser);

router.put("/api/users/me",auth, user_interface.updateUser);

export default router;