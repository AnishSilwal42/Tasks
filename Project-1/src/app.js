import Koa from 'koa';

import router from './routes/getRoute.js';
import errorHandler from './middleware/errorHandler.js';

const app = new Koa();

app.use(errorHandler);
app.on("error", (err, ctx) => {
  console.error("Server error log:", err);
});

app.use(router.routes());

app.use(router.allowedMethods());

app.listen(3000, () => {
    console.log('Server started...')
});
