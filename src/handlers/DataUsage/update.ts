import { Middleware } from "koa";
import { AppRecord, DataRecord } from "./type";

type DataUsageBody = {
  0: string;
  1: string;
  "old-data": string;
};
function isDataUsageBody(body: any): body is DataUsageBody {
  if (body === undefined) return false;
  if (body["old-data"] === undefined) return false;
  if (body["0"] === undefined) return false;
  if (body["1"] === undefined) return false;
  return true;
}

export const updateDataUsage: Middleware = async (ctx) => {
  if (!isDataUsageBody(ctx.request.body)) return ctx.throw(400, "Invalid data");
  const body = {
    ...ctx.request.body,
    "old-data": JSON.parse(ctx.request.body["old-data"]),
  } as {
    0: string;
    1: string;
    "old-data": DataRecord[];
  };

  console.log(body);

  const todayStr = new Date().toISOString().slice(0, 10);
  const oldDataRecord = body["old-data"].find((o) => o.date === todayStr);

  const newRawRecords = [
    ...str2AppRecords(body["0"]),
    ...str2AppRecords(body["1"]),
    ...(oldDataRecord?.records || []),
  ];

  // 去重
  const names = new Set<string>();
  const records: AppRecord[] = [];

  newRawRecords.forEach((r) => {
    if (names.has(r.name)) return;

    names.add(r.name);
    records.push(r);
  });

  const dataRecord: DataRecord = {
    date: todayStr,
    records,
  };

  if (oldDataRecord) {
    body["old-data"].shift();
  }

  // 新的在前面
  const newRecords = [dataRecord, ...body["old-data"]];

  console.log(newRecords);

  ctx.body = JSON.stringify(newRecords).replace(/末/g, "未");
};

function format2MB(str: string) {
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

function str2AppRecords(str: string): AppRecord[] {
  const usageReg = /(\d+\.?\d*)\s*mb/i;

  str = format2MB(str);

  let names: string[] = [];
  let usages: number[] = [];
  const lines = str.split("\n").filter((l) => l !== "");

  for (const l of lines) {
    const match = l.match(usageReg);
    if (match) {
      const usage = parseFloat(match[1]);
      usages.push(usage);
    } else {
      names.push(l);
    }
  }

  const minLen = Math.min(names.length, usages.length);
  names = names.slice(0, minLen);
  usages = usages.slice(0, minLen);

  const records: AppRecord[] = [];
  for (let i = 0; i < minLen; i++) {
    records.push({ name: names[i], usage: usages[i] });
  }

  return records;
}
