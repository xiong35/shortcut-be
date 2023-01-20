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
    ctx.body = JSON.stringify(newRecords).replace(/末/g, "未");
});
exports.updateDataUsage = updateDataUsage;
function format2MB(str) {
    const numReg = /(\d+)[\. ](\d+)\s*([gkm]b)/gi;
    const gbReg = /(\d+)\.(\d+)\s*GB/gi;
    const zeroReg = /\d+\.\d+\s*KB/gi;
    const kbReg = /(\d+)\s*KB/gi;
    return str
        .replace(numReg, (match, p1, p2, p3) => `${p1}.${p2} ${p3}`)
        .replace(gbReg, (match, p1, p2) => `${p1}${p2}00 MB`)
        .replace(kbReg, (match, p1) => `0.${p1} MB`)
        .replace(zeroReg, "0 MB");
}
function str2AppRecords(str) {
    const usageReg = /(\d+\.?\d*)\s*mb/i;
    str = format2MB(str);
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
    const maxLen = Math.max(names.length, usages.length);
    names = names.slice(0, maxLen);
    usages = usages.slice(0, maxLen);
    const records = [];
    for (let i = 0; i < maxLen; i++) {
        records.push({ name: names[i], usage: usages[i] });
    }
    return records;
}
