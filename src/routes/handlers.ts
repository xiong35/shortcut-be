import * as Router from "koa-router";
import { updateDataUsage } from "../handlers/DataUsage/update";
import { getDataUsageReport } from "../handlers/DataUsage/report";

export const handlerRouter = new Router();

handlerRouter.post("data-usage", "/data/update", updateDataUsage);
handlerRouter.post("data-usage", "/data/get-report", getDataUsageReport);
