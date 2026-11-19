import Koa from "koa";

import productRouter from "./routes/productRoute.js";
import userRouter from "./routes/usersRoute.js"
import roleRouter from "./routes/roleRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import { AppDataSource } from "./DB/datasource.js";
import errorHandler from "./middleware/errorHandler.js";
import bodyParser from "@koa/bodyparser";
import { errorResponse } from "./utils/apiResponse.js";


const app = new Koa();

app.use(errorHandler);

app.on("error", (err, ctx) => {
  console.error("Server error log:", err);
});

app.use(bodyParser());

app.use(userRouter.routes());
app.use(userRouter.allowedMethods());

app.use(roleRouter.routes());
app.use(roleRouter.allowedMethods());

app.use(productRouter.routes());
app.use(productRouter.allowedMethods());

app.use(cartRouter.routes());
app.use(cartRouter.allowedMethods());

app.use(orderRouter.routes());
app.use(orderRouter.allowedMethods());

app.use(async (ctx, next) => {
  await next();
  if (ctx.status === 404 && ctx.body === undefined) {
    ctx.body = errorResponse("Route not found");
  }
});

app.listen(Number(process.env.PORT), () => {
  console.log("Server started...");
  AppDataSource.initialize()
    .then(() => console.log("Connection successful"))
    .catch((error) => console.log(error));
});
