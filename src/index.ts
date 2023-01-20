import { createServer } from "http";
import * as Koa from "koa";
import KoaBody from "koa-body";
import * as logger from "koa-logger";

import * as cors from "@koa/cors";
import { router } from "./routes";

const app = new Koa<
  { isKnownError: Boolean },
  { error: (status: number, msg: string) => void }
>();

const httpServer = createServer(app.callback());

app
  .use(logger())
  .use(cors({ credentials: true, origin: "http://localhost:3000" }))
  .use(KoaBody())
  .use(router.routes());

httpServer.listen(3014);

console.log("listen on 3014");
