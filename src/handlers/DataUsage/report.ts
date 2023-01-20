/**
 * 接受数据类型：
 * 若 post 请求
 */

import { Middleware } from "koa";
import { DataRecord, isDataRecord } from "./type";
import koaBody from "koa-body";

type AppData = {
  /** app 名字 */
  name: string;
  endUsage?: {
    date: string;
    usage: number;
  };
  startUsage?: {
    date: string;
    usage: number;
  };
};

type FMTAppData = {
  name: string;
  diff: number;
  start: string;
  end: string;
};

function fmtAppDataSorter(a: FMTAppData, b: FMTAppData) {
  if (a.diff > b.diff) return -1;
  if (a.diff < b.diff) return 1;
  return 0;
}

export const getDataUsageReport: Middleware = async (ctx) => {
  // record 按照时间排序，最新的在最前，每天只能有一个 record
  const recordStr = ctx.request.body?.data;

  const records = JSON.parse(recordStr) as DataRecord[];
  console.log(records);
  if (
    !Array.isArray(records) ||
    records.length <= 0 ||
    !isDataRecord(records[0])
  )
    return ctx.throw(400, "Invalid data");

  /** key 是 app 名字，value 是当前记录和后续要找的记录 */
  const appsToHandle = new Map<string, AppData>();

  // 只处理最近5天的数据
  records.slice(0, 5).forEach((r) => setRecord(appsToHandle, r));

  // 接下来遍历 map，得到最近 app 的使用量差值
  // 排序方法为：
  // 1. 今天和昨天的差值（降序）
  // 2. 今天和以前某天的差值
  // 3. 只有 end 没有 start 的 app 数据
  // end 不是今天的不考虑

  const todayAndYesterday: AppData[] = [];
  const todayAndBefore: AppData[] = [];
  const onlyEnd: AppData[] = [];

  for (const r of appsToHandle.values()) {
    if (r.endUsage && r.startUsage) {
      if (!isToday(r.endUsage.date)) continue;
      if (isYesterday(r.startUsage.date)) {
        // 情况 1
        todayAndYesterday.push(r);
      } else {
        // 情况 2
        todayAndBefore.push(r);
      }
    } else if (r.endUsage) {
      onlyEnd.push(r);
    }
  }

  const fmtTodayAndYesterday: FMTAppData[] = todayAndYesterday
    .map((r) => ({
      name: r.name,
      diff: r.endUsage!.usage - r.startUsage!.usage,
      start: r.startUsage!.date,
      end: r.endUsage!.date,
    }))
    .filter((r) => r.diff > 1)
    .sort(fmtAppDataSorter);
  const fmtTodayAndBefore: FMTAppData[] = todayAndBefore
    .map((r) => ({
      name: r.name,
      diff: r.endUsage!.usage - r.startUsage!.usage,
      start: r.startUsage!.date,
      end: r.endUsage!.date,
    }))
    .filter((r) => r.diff > 1)
    .sort(fmtAppDataSorter);
  const fmtOnlyEnd: FMTAppData[] = onlyEnd
    .map((r) => ({
      name: r.name,
      diff: r.endUsage!.usage,
      end: r.endUsage!.date,
      start: "",
    }))
    .filter((r) => r.diff > 1)
    .sort(fmtAppDataSorter);

  const todayAndYesterdayStr =
    fmtTodayAndYesterday.length === 0
      ? ""
      : `
## 今天和昨天的差值

app | 使用量
--- | ---
${fmtTodayAndYesterday
  .map((d) => `${d.name} | ${d.diff.toFixed(1)} MB`)
  .join("\n")}`;

  const todayAndBeforeStr =
    fmtTodayAndBefore.length === 0
      ? ""
      : `
## 今天和以前某天的差值

app | 使用量 | 开始时间 | 结束时间
--- | --- | --- | ---
${fmtTodayAndBefore
  .map((d) => `${d.name} | ${d.diff.toFixed(1)} MB | ${d.start} | ${d.end}`)
  .join("\n")}`;

  const onlyEndStr =
    fmtOnlyEnd.length === 0
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
};

function isToday(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

function isYesterday(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  return (
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate()
  );
}

/** 遍历某天的数据并记录在 map 中 */
function setRecord(appsToHandle: Map<string, AppData>, dataRecord: DataRecord) {
  // 第一次遇到一个 app 的数据，设置他的 endUsage
  // 第二次遇到一个 app 的数据，设置他的 startUsage
  // 第三次或者以后遇到就不管了
  dataRecord.records.forEach((record) => {
    // 第一次，都不在 map 中
    if (!appsToHandle.has(record.name)) {
      appsToHandle.set(record.name, {
        name: record.name,
        endUsage: {
          date: dataRecord.date,
          usage: record.usage,
        },
      });
    } else {
      // 如果存在在 map 中
      const appData = appsToHandle.get(record.name)!;
      // 如果没有 startUsage，那就是第二次遇到
      if (!appData.startUsage) {
        appData.startUsage = {
          date: dataRecord.date,
          usage: record.usage,
        };
      } else {
        // 如果有 startUsage，那就是第三次或者以后遇到
        // 不做任何操作
      }
    }
  });
}
