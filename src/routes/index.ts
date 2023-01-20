import Router from "koa-router";

import { handlerRouter } from "./handlers";

export const router = new Router();

router
  // .all("/test", test)
  .use(handlerRouter.routes(), handlerRouter.allowedMethods());
