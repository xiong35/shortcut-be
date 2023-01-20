export type DataRecord = {
  /** 什么时间进行的以下记录 */
  date: string;
  records: AppRecord[];
};

export type AppRecord = {
  /** app 名字 */
  name: string;
  /** app 当前使用了多少流量 */
  usage: number;
};

export function isAppRecord(data: any): data is AppRecord {
  return (
    typeof data === "object" &&
    typeof data.name === "string" &&
    typeof data.sum === "number"
  );
}

export function isDataRecord(data: any): data is DataRecord {
  return (
    typeof data === "object" &&
    typeof data.date === "string" &&
    Array.isArray(data.records)
  );
}
