export const STORAGE_KEYS = {
  tasks: "softplans.tasks.v1",
  groups: "softplans.groups.v1",
  language: "softplans.language",
  theme: "softplans.theme",
  sidebar: "softplans.sidebar",
};

export const LANGUAGES = ["ru", "uk", "en"];
export const DEFAULT_LANGUAGE = "ru";
export const GROUP_FILTER_PREFIX = "group:";

export const GROUP_COLORS = [
  { value: "#eb4e3e", key: "colorRed" },
  { value: "#f19a38", key: "colorOrange" },
  { value: "#f7ce46", key: "colorYellow" },
  { value: "#5dc466", key: "colorGreen" },
  { value: "#3478f7", key: "colorBlue" },
  { value: "#b67bd5", key: "colorPurple" },
  { value: "#998667", key: "colorBrown" },
];

export const LEGACY_GROUP_COLOR_MAP = {
  "#8b83c4": "#b67bd5",
  "#e18a9a": "#eb4e3e",
  "#e3a455": "#f19a38",
  "#6cae98": "#5dc466",
  "#6396ce": "#3478f7",
  "#b27bc3": "#b67bd5",
  "#d2b64d": "#f7ce46",
  "#6bafba": "#5dc466",
  "#d96b6b": "#eb4e3e",
  "#8a96a8": "#998667",
  "#7c3aed": "#b67bd5",
  "#e11d73": "#eb4e3e",
  "#ea580c": "#f19a38",
  "#16a34a": "#5dc466",
  "#2563eb": "#3478f7",
  "#c026d3": "#b67bd5",
  "#eab308": "#f7ce46",
  "#0d9488": "#5dc466",
  "#dc2626": "#eb4e3e",
  "#0891b2": "#3478f7",
  "#e53935": "#eb4e3e",
  "#fb8c00": "#f19a38",
  "#fdd835": "#f7ce46",
  "#43a047": "#5dc466",
  "#1e88e5": "#3478f7",
  "#8e24aa": "#b67bd5",
  "#8d6e63": "#998667",
};

export const MOBILE_QUERY = "(max-width: 720px)";
export const LONG_PRESS_MS = 550;