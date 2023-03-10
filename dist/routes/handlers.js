"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlerRouter = void 0;
const Router = require("koa-router");
const update_1 = require("../handlers/DataUsage/update");
const report_1 = require("../handlers/DataUsage/report");
exports.handlerRouter = new Router();
exports.handlerRouter.post("data-usage", "/data/update", update_1.updateDataUsage);
exports.handlerRouter.post("data-usage", "/data/get-report", report_1.getDataUsageReport);
