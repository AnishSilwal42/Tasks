import Koa from "koa";

import router from "./routes/productRoute.js";
import userRouter from "./routes/usersRoute.js"
import { AppDataSource } from "./DB/datasource.js";
import errorHandler from "./middleware/errorHandler.js";
import bodyParser from "@koa/bodyparser";


const app = new Koa();

app.use(errorHandler);

app.on("error", (err, ctx) => {
  console.error("Server error log:", err);
});

app.use(bodyParser());

app.use(userRouter.routes());
app.use(userRouter.allowedMethods());

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(Number(process.env.PORT), () => {
  console.log("Server started...");
  AppDataSource.initialize()
    .then(() => console.log("Connection successful"))
    .catch((error) => console.log(error));
});
