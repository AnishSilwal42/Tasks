import { errorResponse } from "../utils/apiResponse.js";

export default async function errorHandler(ctx,next){
    try {
        await next();
      } catch (err) {
        if (err.name === "ValidationError"){
          ctx.status = 400;
          ctx.body = errorResponse("Validation failed", err.errors);
          return;
        }

        ctx.status = err.status || 500;
        ctx.body = errorResponse(
          ctx.status < 500 ? err.message : "Internal Server Error",
        );
      }
}