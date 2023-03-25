"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const testInputs = [
    {
        name: "Meeting A",
        type: "calendar",
        startTime: "2023-04-01T09:00:00Z",
        duration: "01:30:00",
    },
    {
        name: "Meeting B",
        type: "calendar",
        startTime: "2023-04-01T10:00:00Z",
        duration: "00:45:00",
    },
    {
        name: "ToDo 1",
        type: "todo",
        startTime: "2023-04-01T11:00:00Z",
        duration: "00:15:00",
    },
    {
        name: "Meeting C",
        type: "calendar",
        startTime: "2023-04-01T12:00:00Z",
        duration: "02:00:00",
    },
];
const conflicts = (0, _1.getConflict)(testInputs);
console.log("Conflicts:");
conflicts.forEach(([input1, input2], index) => {
    console.log(`Conflict ${index + 1}:`);
    console.log(`  - ${input1.name} (${input1.type}): ${input1.startTime} for ${input1.duration}`);
    console.log(`  - ${input2.name} (${input2.type}): ${input2.startTime} for ${input2.duration}`);
});
const testInputs2 = [
    {
        name: 'Long Meeting Name 1234567890',
        type: 'calendar',
        startTime: '2023-04-01T09:00:00Z',
        duration: '01:30:00',
    },
    {
        name: 'ToDo with duration #00:20:00',
        type: 'todo',
        startTime: '2023-04-01T11:00:00Z',
        duration: '00:15:00',
    },
    {
        name: 'ToDo with duration #00:30',
        type: 'todo',
        startTime: '2023-04-01T12:00:00Z',
        duration: '00:15:00',
    },
];
const processedInputs = (0, _1.processInputs)(testInputs2);
console.log('Processed Inputs:');
processedInputs.forEach((input, index) => {
    console.log(`Input ${index + 1}:`);
    console.log(`  - name: ${input.name}`);
    console.log(`  - type: ${input.type}`);
    console.log(`  - startTime: ${input.startTime}`);
    console.log(`  - duration: ${input.duration}`);
});
