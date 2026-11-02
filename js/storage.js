import { GROUP_COLORS, LEGACY_GROUP_COLOR_MAP, STORAGE_KEYS } from "./config.js";
import { isValidDate, isValidTime } from "./dates.js";

export function createId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function write(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.error(`Не удалось сохранить ${key}:`, error);
    return false;
  }
}

function readList(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return { items: [], ok: true };
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error("Saved data is not a list");
    return { items: parsed, ok: true };
  } catch (error) {
    console.error(`Не удалось загрузить ${key}:`, error);
    return { items: [], ok: false };
  }
}

export function loadPreference(key, fallback, allowedValues) {
  try {
    const value = localStorage.getItem(key);
    return allowedValues.includes(value) ? value : fallback;
  } catch (error) {
    console.error(`Не удалось загрузить настройку ${key}:`, error);
    return fallback;
  }
}

export const savePreference = write;

export function loadGroups() {
  const { items, ok } = readList(STORAGE_KEYS.groups);
  const allowedColors = new Set(GROUP_COLORS.map((color) => color.value));
  const seen = new Set();
  const groups = [];
  for (const group of items) {
    const color = LEGACY_GROUP_COLOR_MAP[group?.color] || group?.color;
    if (
      !group ||
      typeof group.id !== "string" ||
      seen.has(group.id) ||
      typeof group.name !== "string" ||
      !group.name.trim() ||
      !allowedColors.has(color)
    ) {
      continue;
    }
    seen.add(group.id);
    groups.push({ id: group.id, name: group.name.trim(), color });
  }
  return { items: groups, ok };
}

export function loadTasks(groups) {
  const { items, ok } = readList(STORAGE_KEYS.tasks);
  const groupIds = new Set(groups.map((group) => group.id));
  const seen = new Set();
  const tasks = [];
  for (const task of items) {
    if (
      !task ||
      typeof task.id !== "string" ||
      seen.has(task.id) ||
      typeof task.text !== "string" ||
      !task.text.trim() ||
      typeof task.completed !== "boolean"
    ) {
      continue;
    }
    seen.add(task.id);
    const dueDate = isValidDate(task.dueDate) ? task.dueDate : null;
    tasks.push({
      id: task.id,
      text: task.text,
      completed: task.completed,
      completedAt: task.completed && isValidDate(task.completedAt) ? task.completedAt : null,
      favorite: task.favorite === true,
      dueDate,
      dueTime: dueDate && isValidTime(task.dueTime) ? task.dueTime : null,
      groupId: typeof task.groupId === "string" && groupIds.has(task.groupId) ? task.groupId : null,
    });
  }
  return { items: tasks, ok };
}

export const saveTasks = (tasks) => write(STORAGE_KEYS.tasks, JSON.stringify(tasks));
export const saveGroups = (groups) => write(STORAGE_KEYS.groups, JSON.stringify(groups));