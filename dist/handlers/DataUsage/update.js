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
exports.updateDataUsage = void 0;
const utils_1 = require("./utils");
function isDataUsageBody(body) {
    if (body === undefined)
        return false;
    if (body["old-data"] === undefined)
        return false;
    if (body["0"] === undefined)
        return false;
    if (body["1"] === undefined)
        return false;
    return true;
}
const updateDataUsage = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    if (!isDataUsageBody(ctx.request.body))
        return ctx.throw(400, "Invalid data");
    const body = Object.assign(Object.assign({}, ctx.request.body), { "old-data": JSON.parse(ctx.request.body["old-data"]) });
    console.log(body);
    const todayStr = new Date().toISOString().slice(0, 10);
    const oldDataRecord = body["old-data"].find((o) => o.date === todayStr);
    const newRawRecords = [
        ...str2AppRecords(body["0"]),
        ...str2AppRecords(body["1"]),
        ...((oldDataRecord === null || oldDataRecord === void 0 ? void 0 : oldDataRecord.records) || []),
    ];
    const names = new Set();
    const records = [];
    newRawRecords.forEach((r) => {
        if (names.has(r.name))
            return;
        names.add(r.name);
        records.push(r);
    });
    const dataRecord = {
        date: todayStr,
        records,
    };
    if (oldDataRecord) {
        body["old-data"].shift();
    }
    const newRecords = [dataRecord, ...body["old-data"]];
    console.log(newRecords);
    ctx.body = (0, utils_1.normalizeOCR)(JSON.stringify(newRecords));
});
exports.updateDataUsage = updateDataUsage;
function str2AppRecords(str) {
    const usageReg = /(\d+\.?\d*)\s*mb/i;
    str = (0, utils_1.format2MB)(str);
    let names = [];
    let usages = [];
    const lines = str.split("\n").filter((l) => l !== "");
    for (const l of lines) {
        const match = l.match(usageReg);
        if (match) {
            const usage = parseFloat(match[1]);
            usages.push(usage);
        }
        else {
            names.push(l);
        }
    }
    const minLen = Math.min(names.length, usages.length);
    names = names.slice(0, minLen);
    usages = usages.slice(0, minLen);
    const records = [];
    for (let i = 0; i < minLen; i++) {
        records.push({ name: names[i], usage: usages[i] });
    }
    return records;
}
