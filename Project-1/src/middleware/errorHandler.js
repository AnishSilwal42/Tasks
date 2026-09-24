export default async function errorHandler(ctx,next){
    try {
        await next();
      } catch (err) {
        ctx.status = err.status || 500;
        ctx.body = {
          error: true,
          status: err.status,
          message: err.message || "Internal Server Error",
        };
      }
}