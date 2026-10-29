export default async function roleGuard(ctx,next) {
    if(!ctx.state.user){
        ctx.throw(401,"Unauthorized Access");
    }
    if(!(ctx.state.user.role.role === "Admin")){
        
        ctx.throw(403,"Permisson not granted")
    }
    await next();
}