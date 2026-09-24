import Koa from "koa";

import { AppDataSource } from "./DB/datasource.js";
import router from "./routes/getRoute.js";
import errorHandler from "./middleware/errorHandler.js";

const app = new Koa();

app.use(errorHandler);

app.on("error", (err, ctx) => {
  console.error("Server error log:", err);
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(Number(process.env.PORT), () => {
  console.log("Server started...");
  AppDataSource.initialize()
    .then(() => console.log("Connection successful"))
    .catch((error) => console.log(error));
});
