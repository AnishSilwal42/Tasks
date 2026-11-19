import "dotenv/config"
import koaJwt from "koa-jwt";

const auth = koaJwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] });

export default auth;