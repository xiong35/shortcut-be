import * as Router from "koa-router";

import { handlerRouter } from "./handlers";

export const router = new Router();

router
  .all("/ping", (ctx) => (ctx.body = "pong"))
  .use(handlerRouter.routes(), handlerRouter.allowedMethods());
