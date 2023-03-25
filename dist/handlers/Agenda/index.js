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
exports.processInputs = exports.getConflict = exports.handleAgenda = void 0;
const handleAgenda = (context) => __awaiter(void 0, void 0, void 0, function* () {
    const { request, response } = context;
    const { body } = request;
    let data = JSON.parse(body.data.replace(/\n/g, ""));
    data = processInputs(data);
    const conflicts = getConflict(data);
    const description = describeConflicts(conflicts);
    response.body = {
        conflicts: description,
    };
});
exports.handleAgenda = handleAgenda;
function getConflict(inputs) {
    const conflicts = [];
    for (let i = 0; i < inputs.length; i++) {
        for (let j = i + 1; j < inputs.length; j++) {
            if (hasConflict(inputs[i], inputs[j])) {
                conflicts.push([inputs[i], inputs[j]]);
            }
        }
    }
    return conflicts;
}
exports.getConflict = getConflict;
function toDate(dateString, timeString) {
    const date = new Date(dateString);
    const timeComponents = timeString.split(":").map(Number);
    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    if (timeComponents.length === 3) {
        [hours, minutes, seconds] = timeComponents;
    }
    else if (timeComponents.length === 2) {
        [minutes, seconds] = timeComponents;
    }
    else if (timeComponents.length === 1) {
        [seconds] = timeComponents;
    }
    else {
        throw new Error("Invalid duration format");
    }
    date.setHours(date.getHours() + hours);
    date.setMinutes(date.getMinutes() + minutes);
    date.setSeconds(date.getSeconds() + seconds);
    return date;
}
function hasConflict(a, b) {
    const aStart = new Date(a.startTime);
    const aEnd = toDate(a.startTime, a.duration);
    const bStart = new Date(b.startTime);
    const bEnd = toDate(b.startTime, b.duration);
    return aStart < bEnd && bStart < aEnd;
}
function formatDate(dateString) {
    const date = new Date(dateString);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${month}-${day} ${hours}:${minutes}`;
}
function describeConflicts(conflicts) {
    if (conflicts.length === 0) {
        return null;
    }
    const header = "| 标题 | 开始时间 | 持续时间 |\n| --- | ------- | ------ |\n";
    const conflictDescriptions = conflicts.map(([input1, input2], index) => {
        const conflict1 = `| ${input1.name}（${input1.type === "calendar" ? "日历" : "待办事项"}）| ${formatDate(input1.startTime)} | ${input1.duration} |`;
        const conflict2 = `| ${input2.name}（${input2.type === "calendar" ? "日历" : "待办事项"}）| ${formatDate(input2.startTime)} | ${input2.duration} |`;
        return `**冲突 ${index + 1}**：\n\n${header}${conflict1}\n${conflict2}`;
    });
    return `## 发现以下冲突：\n\n${conflictDescriptions.join("\n")}`;
}
function processInputs(inputs) {
    return inputs.map((input) => {
        const processedInput = Object.assign({}, input);
        if (processedInput.type === "todo") {
            const durationRegex = /#(\d{1,2}:\d{2}:\d{2}|\d{1,2}:\d{2})/;
            const match = processedInput.name.match(durationRegex);
            if (match) {
                processedInput.duration = match[1];
                if (processedInput.duration.length <= 5) {
                    processedInput.duration = processedInput.duration + ":00";
                }
            }
        }
        if (processedInput.name.length > 10) {
            processedInput.name = processedInput.name.substring(0, 10) + "...";
        }
        return processedInput;
    });
}
exports.processInputs = processInputs;
