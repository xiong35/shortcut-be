import { createServer } from "http";
import Koa from "koa";
import KoaBody from "koa-body";
import logger from "koa-logger";

import cors from "@koa/cors";

const app = new Koa<
  { isKnownError: Boolean },
  { error: (status: number, msg: string) => void }
>();

const httpServer = createServer(app.callback());

app
  .use(logger())
  .use(cors({ credentials: true, origin: "http://localhost:3000" }))
  .use(KoaBody());

httpServer.listen(3014);

console.log("listen on 3014");
