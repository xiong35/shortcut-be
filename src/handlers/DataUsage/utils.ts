export function normalizeOCR(s: string): string {
  return s
    .replace(/末定/g, "未定")
    .replace(/事件[^"\n]/g, "事件簿")
    .replace(/(Q0|0Q|oQ|Qo)/gi, "QQ")
    .replace(/[^"\n]+热点/gi, "个人热点")
    .replace(/知[^"\n]{1,2}/gi, "知乎")
    .replace(/网易云音乐/gi, "易云音乐")
    .replace(/易云音乐/gi, "网易云音乐")
    .replace(/騰讯/gi, "腾讯")
    .replace(/S[^"\n]+rocket/g, "Shadowrocket")
    .replace(/S[^"\n]+bucks/g, "Starbucks")
    .replace(/App store/gi, "pp store")
    .replace(/pp store/gi, "App store")
    .replace(/CPU[^"\n]{0,3}/gi, 'CPU-X')
    .replace(/.捷指令/gi, '快捷指令')
    .replace(/[已己]卸载的 pp/gi, "已卸载的 App");
}

export function format2MB(str: string) {
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

export function isToday(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

export function isYesterday(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  return (
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate()
  );
}
