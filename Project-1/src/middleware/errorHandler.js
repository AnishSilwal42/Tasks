export default async function errorHandler(ctx,next){
    try {
        await next();
      } catch (err) {
        if (err.name === "ValidationError"){
          ctx.status = 422;
          ctx.body = {
            message: "Validation Failed",
            details: err.errors
          }
          return;
        }

        ctx.status = err.status || 500;
        ctx.body = {
          error: true,
          status: err.status,
          message: err.message || "Internal Server Error",
        };
      }
}