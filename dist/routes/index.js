"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const Router = require("koa-router");
const handlers_1 = require("./handlers");
exports.router = new Router();
exports.router
    .all("/ping", (ctx) => (ctx.body = "pong"))
    .use(handlers_1.handlerRouter.routes(), handlers_1.handlerRouter.allowedMethods());
