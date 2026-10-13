import  * as userContoller from "../controller/userContoller.js";
import koaRouter from "@koa/router";
import koaJwt from "koa-jwt";

const router = new koaRouter();

const auth = koaJwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] });

router.post("/api/auth/register",userContoller.createUser);

router.post("/api/auth/login",userContoller.userLogin);

router.get("/api/users/me",auth, userContoller.getUser);

router.put("/api/users/me",auth, userContoller.updateUser);

export default router;