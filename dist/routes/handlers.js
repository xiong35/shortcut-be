"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlerRouter = void 0;
const Router = require("koa-router");
const update_1 = require("../handlers/DataUsage/update");
const report_1 = require("../handlers/DataUsage/report");
const Agenda_1 = require("../handlers/Agenda");
exports.handlerRouter = new Router();
exports.handlerRouter.post("data-usage", "/data/update", update_1.updateDataUsage);
exports.handlerRouter.post("data-usage", "/data/get-report", report_1.getDataUsageReport);
exports.handlerRouter.post("agenda", "/agenda", Agenda_1.handleAgenda);
exports.handlerRouter.get("ping", "/ping", (ctx) => (ctx.body = "pong"));
