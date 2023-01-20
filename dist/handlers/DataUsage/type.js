"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDataRecord = exports.isAppRecord = void 0;
function isAppRecord(data) {
    return (typeof data === "object" &&
        typeof data.name === "string" &&
        typeof data.sum === "number");
}
exports.isAppRecord = isAppRecord;
function isDataRecord(data) {
    return (typeof data === "object" &&
        typeof data.date === "string" &&
        Array.isArray(data.records));
}
exports.isDataRecord = isDataRecord;
