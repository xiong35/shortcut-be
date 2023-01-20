"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const Koa = require("koa");
const koa_body_1 = require("koa-body");
const logger = require("koa-logger");
const cors = require("@koa/cors");
const routes_1 = require("./routes");
const app = new Koa();
const httpServer = (0, http_1.createServer)(app.callback());
app
    .use(logger())
    .use(cors({ credentials: true, origin: "http://localhost:3000" }))
    .use((0, koa_body_1.default)())
    .use(routes_1.router.routes());
httpServer.listen(3014);
console.log("listen on 3014");
