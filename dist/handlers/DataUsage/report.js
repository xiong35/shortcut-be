"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDataUsageReport = void 0;
const type_1 = require("./type");
const utils_1 = require("./utils");
function fmtAppDataSorter(a, b) {
    if (a.diff > b.diff)
        return -1;
    if (a.diff < b.diff)
        return 1;
    return 0;
}
const getDataUsageReport = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const recordStr = (_a = ctx.request.body) === null || _a === void 0 ? void 0 : _a.data;
    const records = JSON.parse(recordStr);
    console.log(records);
    if (!Array.isArray(records) ||
        records.length <= 0 ||
        !(0, type_1.isDataRecord)(records[0]))
        return ctx.throw(400, "Invalid data");
    const appsToHandle = new Map();
    records.slice(0, 5).forEach((r) => setRecord(appsToHandle, r));
    const todayAndYesterday = [];
    const todayAndBefore = [];
    const onlyEnd = [];
    for (const r of appsToHandle.values()) {
        if (r.endUsage && r.startUsage) {
            if (!(0, utils_1.isToday)(r.endUsage.date))
                continue;
            if ((0, utils_1.isYesterday)(r.startUsage.date)) {
                todayAndYesterday.push(r);
            }
            else {
                todayAndBefore.push(r);
            }
        }
        else if (r.endUsage) {
            onlyEnd.push(r);
        }
    }
    const fmtTodayAndYesterday = todayAndYesterday
        .map((r) => ({
        name: r.name,
        diff: r.endUsage.usage - r.startUsage.usage,
        start: r.startUsage.date,
        end: r.endUsage.date,
    }))
        .filter((r) => r.diff > 1)
        .sort(fmtAppDataSorter);
    const fmtTodayAndBefore = todayAndBefore
        .map((r) => ({
        name: r.name,
        diff: r.endUsage.usage - r.startUsage.usage,
        start: r.startUsage.date,
        end: r.endUsage.date,
    }))
        .filter((r) => r.diff > 1)
        .sort(fmtAppDataSorter);
    const fmtOnlyEnd = onlyEnd
        .map((r) => ({
        name: r.name,
        diff: r.endUsage.usage,
        end: r.endUsage.date,
        start: "",
    }))
        .filter((r) => r.diff > 1)
        .sort(fmtAppDataSorter);
    const todayAndYesterdayStr = fmtTodayAndYesterday.length === 0
        ? ""
        : `
## 今天和昨天的差值

app | 使用量
--- | ---
${fmtTodayAndYesterday
            .map((d) => `${d.name} | ${d.diff.toFixed(1)} MB`)
            .join("\n")}`;
    const todayAndBeforeStr = fmtTodayAndBefore.length === 0
        ? ""
        : `
## 今天和以前某天的差值

app | 使用量 | 开始时间 | 结束时间
--- | --- | --- | ---
${fmtTodayAndBefore
            .map((d) => `${d.name} | ${d.diff.toFixed(1)} MB | ${d.start} | ${d.end}`)
            .join("\n")}`;
    const onlyEndStr = fmtOnlyEnd.length === 0
        ? ""
        : `
## 未记录完整的 App

app | 使用量
--- | ---
${fmtOnlyEnd.map((d) => `${d.name} | ${d.diff.toFixed(1)} MB`).join("\n")}`;
    const returnMDStr = `
# ${new Date().toLocaleDateString()} app 使用量报告
${todayAndYesterdayStr}
${todayAndBeforeStr}
${onlyEndStr}

<meta charset="utf-8">
`;
    ctx.body = { data: returnMDStr };
});
exports.getDataUsageReport = getDataUsageReport;
function setRecord(appsToHandle, dataRecord) {
    dataRecord.records.forEach((record) => {
        if (!appsToHandle.has(record.name)) {
            appsToHandle.set(record.name, {
                name: record.name,
                endUsage: {
                    date: dataRecord.date,
                    usage: record.usage,
                },
            });
        }
        else {
            const appData = appsToHandle.get(record.name);
            if (!appData.startUsage) {
                appData.startUsage = {
                    date: dataRecord.date,
                    usage: record.usage,
                };
            }
            else {
            }
        }
    });
}
