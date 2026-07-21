import { buildCategoryColors, CHART_GRAY } from "./chartColors";

const DEVICE_ORDER = ["Desktop", "Mobile", "Tablet"];
const BROWSER_ORDER = ["Chrome", "Firefox", "Safari", "Edge", "Opera"];
const OS_ORDER = ["Windows", "macOS", "iOS", "Android", "Linux"];

const DEVICE_COLORS = buildCategoryColors(DEVICE_ORDER);
const BROWSER_COLORS = buildCategoryColors(BROWSER_ORDER);
const OS_COLORS = buildCategoryColors(OS_ORDER);

function dayKey(time) {
  const d = new Date(time);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function shortDate(time) {
  return new Date(time).toLocaleDateString([], { month: "short", day: "numeric" });
}

// One row per calendar day for the last `days` days (today inclusive),
// zero-filled so a quiet day shows as a real dip rather than a gap.
export function getDailyVisitCounts(visits, days = 14) {
  const counts = new Map();
  for (const v of visits) {
    const key = dayKey(v.time);
    counts.set(key, (counts.get(key) || 0) + 1);
  }

  const rows = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    rows.push({ key, label: shortDate(d.getTime()), count: counts.get(key) || 0 });
  }
  return rows;
}

function orderedBreakdown(visits, field, order, colors) {
  const counts = new Map();
  for (const v of visits) {
    const key = v[field] || "Unknown";
    counts.set(key, (counts.get(key) || 0) + 1);
  }

  const rows = order
    .filter((name) => counts.get(name) > 0)
    .map((name) => ({ label: name, value: counts.get(name), color: colors.get(name) }));

  const otherTotal = [...counts.entries()]
    .filter(([name]) => !order.includes(name))
    .reduce((sum, [, c]) => sum + c, 0);
  if (otherTotal > 0) {
    rows.push({ label: "Other", value: otherTotal, color: CHART_GRAY });
  }

  return rows.sort((a, b) => b.value - a.value);
}

export function getDeviceBreakdown(visits) {
  return orderedBreakdown(visits, "device", DEVICE_ORDER, DEVICE_COLORS);
}

export function getBrowserBreakdown(visits) {
  return orderedBreakdown(visits, "browser", BROWSER_ORDER, BROWSER_COLORS);
}

export function getOsBreakdown(visits) {
  return orderedBreakdown(visits, "os", OS_ORDER, OS_COLORS);
}

// Top pages by visit count — an open-ended set (any route can appear), so
// this is ranked magnitude, not identity: every bar takes the same sequential
// hue, and only the top `limit` get their own row before the rest fold into
// "Other".
export function getTopPages(visits, limit = 6) {
  const counts = new Map();
  for (const v of visits) {
    const key = v.path || "/";
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  const top = sorted.slice(0, limit).map(([label, value]) => ({ label, value }));
  const otherTotal = sorted.slice(limit).reduce((sum, [, c]) => sum + c, 0);
  if (otherTotal > 0) top.push({ label: "Other", value: otherTotal });
  return top;
}

export function getUniqueVisitorCount(visits) {
  return new Set(visits.map((v) => v.ip)).size;
}

export function getTodayCount(visits) {
  const today = dayKey(Date.now());
  return visits.filter((v) => dayKey(v.time) === today).length;
}

export function getTopCountry(visits) {
  const counts = new Map();
  for (const v of visits) {
    const key = v.country || "Unknown";
    if (key === "Unknown") continue;
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  return sorted[0]?.[0] || "—";
}
