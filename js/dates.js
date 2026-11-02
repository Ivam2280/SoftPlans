const PRESETS = {
  short: { day: "numeric", month: "short" },
  numericDate: { day: "2-digit", month: "2-digit", year: "numeric" },
  long: { weekday: "long", day: "numeric", month: "long" },
  today: { weekday: "short", day: "numeric", month: "long" },
  clock: { hour: "2-digit", minute: "2-digit", hourCycle: "h23" },
  monthYear: { month: "long", year: "numeric" },
  weekdayShort: { weekday: "short" },
};

const formatterCache = new Map();

function getFormatter(locale, preset) {
  const key = `${locale}|${preset}`;
  if (!formatterCache.has(key)) {
    formatterCache.set(key, new Intl.DateTimeFormat(locale, PRESETS[preset]));
  }
  return formatterCache.get(key);
}

export function formatDate(date, locale, preset) {
  if (preset === "numericDate") {
    const parts = getFormatter(locale, preset).formatToParts(date);
    const part = (type) => parts.find((item) => item.type === type).value;
    return `${part("day")}.${part("month")}.${part("year")}`;
  }
  return getFormatter(locale, preset).format(date);
}

export function parseLocalDate(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function getLocalDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function addDays(dateString, days) {
  const date = parseLocalDate(dateString);
  date.setDate(date.getDate() + days);
  return getLocalDateString(date);
}


export function addMonths(dateString, months) {
  const [year, month, day] = dateString.split("-").map(Number);
  const targetMonthIndex = month - 1 + months;
  const daysInTargetMonth = new Date(year, targetMonthIndex + 1, 0).getDate();
  const clampedDay = Math.min(day, daysInTargetMonth);
  return getLocalDateString(new Date(year, targetMonthIndex, clampedDay));
}

export function getNowTimeString(date = new Date()) {
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

export function isValidDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

export function isValidTime(value) {
  return typeof value === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

export function isTaskOverdue(task) {
  if (task.completed || !task.dueDate) return false;
  const today = getLocalDateString();
  if (task.dueDate < today) return true;
  return task.dueDate === today && Boolean(task.dueTime) && task.dueTime < getNowTimeString();
}