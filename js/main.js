import {
  DEFAULT_LANGUAGE,
  GROUP_COLORS,
  GROUP_FILTER_PREFIX,
  LANGUAGES,
  STORAGE_KEYS,
  LONG_PRESS_MS,
  MOBILE_QUERY,
} from "./config.js";
import {
  addDays,
  addMonths,
  formatDate,
  getLocalDateString,
  getNowTimeString,
  isTaskOverdue,
  isValidTime,
  parseLocalDate,
} from "./dates.js";
import { getLanguage, setLanguage, t } from "./i18n.js";
import {
  createId,
  loadGroups,
  loadPreference,
  loadTasks,
  saveGroups,
  savePreference,
  saveTasks,
} from "./storage.js";
import { makeSortable } from "./sortable.js";



const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const appShell = $(".app-shell");
const sidebar = $(".sidebar");
const sidebarToggle = $("#sidebar-toggle");
const groupsSection = $("#groups-section");
const openGroupDialogButton = $("#open-group-dialog");
const emptyGroupsHint = $("#empty-groups-hint");
const mobileGroupsSlot = $("#mobile-groups-slot");
const sectionHeading = $("#section-heading");
const searchBox = $("#search-box");
const searchToggle = $("#search-toggle");
const desktopSearchBox = $("#desktop-search-box");
const desktopSearchInput = $("#desktop-search-input");
const desktopSearchClear = $("#desktop-search-clear");


const langDropdown = $("#lang-dropdown");
const langDropdownTrigger = $("#lang-dropdown-trigger");
const langDropdownLabel = $("#lang-dropdown-label");
const langDropdownMenu = $("#lang-dropdown-menu");
const langDropdownOptions = $$("#lang-dropdown-menu [data-lang]");

const mobilePrefs = $("#mobile-prefs");
const mobilePrefsTrigger = $("#mobile-prefs-trigger");
const mobilePrefsPopover = $("#mobile-prefs-popover");
const mobilePrefsBackdrop = $("#mobile-prefs-backdrop");
const mobilePrefLangs = $$("#mobile-prefs-popover [data-lang]");
const mobilePrefThemeSegs = $$("#mobile-prefs-popover [data-theme-val]");
const langSegGlider = $("#lang-seg-glider");
const themeSegGlider = $("#theme-seg-glider");

const confirmClearDialog = $("#confirm-clear-dialog");
const confirmClearForm = $("#confirm-clear-form");
const confirmClearTitle = $("#confirm-clear-title");
const confirmClearCopy = $("#confirm-clear-copy");
const confirmClearSubmit = $("#confirm-clear-submit");
const closeConfirmClearButton = $("#close-confirm-clear");
const cancelConfirmClearButton = $("#cancel-confirm-clear");

const taskForm = $("#task-form");
const taskInput = $("#task-input");
const taskDateInput = $("#task-date");
const taskTimeInput = $("#task-time");
const taskDateControl = $("#task-date-control");
const taskTimeControl = $("#task-time-control");
const taskDateDisplay = $("#task-date-display");
const taskTimeDisplay = $("#task-time-display");
const clearTaskScheduleButton = $("#clear-task-schedule");
const mobileFab = $("#mobile-fab");
const mobileComposerBackdrop = $("#mobile-composer-backdrop");
const taskList = $("#task-list");
const planningList = $("#planning-list");
const navGlider = $("#nav-glider");
const groupList = $("#group-list");
const emptyState = $("#empty-state");
const searchInput = $("#search-input");
const searchClear = $("#search-clear");
const themeToggle = $("#theme-toggle");
const groupDialog = $("#group-dialog");
const groupForm = $("#group-form");
const groupNameInput = $("#group-name");
const groupSubmit = $("#group-form .group-submit");
const taskEditDialog = $("#task-edit-dialog");
const taskEditForm = $("#task-edit-form");
const taskEditInput = $("#task-edit-input");
const taskEditDateInput = $("#task-edit-date");
const taskEditTimeInput = $("#task-edit-time");
const taskEditDateTrigger = $("#task-edit-date-trigger");
const taskEditTimeTrigger = $("#task-edit-time-trigger");
const taskEditDateDisplay = $("#task-edit-date-display");
const taskEditTimeDisplay = $("#task-edit-time-display");
const taskEditGroupField = $("#task-edit-group-field");
const taskEditGroupList = $("#task-edit-group-list");
const taskEditGroupInput = $("#task-edit-group");
const groupContextMenu = $("#group-context-menu");
const editGroupAction = $("#edit-group-action");
const reorderGroupsAction = $("#reorder-groups-action");
const deleteGroupAction = $("#delete-group-action");
const taskContextMenu = $("#task-context-menu");
const editTaskAction = $("#edit-task-action");
const deleteTaskAction = $("#delete-task-action");


const dtPopover = $("#datetime-popover");
const dtBackdrop = $("#dt-backdrop");
const dtCard = $("#dt-card");
const dtDateView = $("#dt-date-view");
const dtTimeView = $("#dt-time-view");
const dtDatePresets = $("#dt-date-presets");
const dtPrevMonth = $("#dt-prev-month");
const dtNextMonth = $("#dt-next-month");
const dtMonthTitle = $("#dt-month-title");
const dtWeekdays = $("#dt-weekdays");
const dtDaysGrid = $("#dt-days-grid");
const dtTimeInput = $("#dt-time-input");
const dtTimePresets = $("#dt-time-presets");
const dtHoursWheel = $("#dt-hours-wheel");
const dtMinutesWheel = $("#dt-minutes-wheel");
const dtClearBtn = $("#dt-clear-btn");
const dtApplyBtn = $("#dt-apply-btn");

const ICONS = {
  calendar:
    '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="4" y="5.5" width="16" height="15" rx="2.5" stroke="currentColor" stroke-width="1.7"/><path d="M8 3.5v4M16 3.5v4M4 10h16" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
  clock:
    '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="1.7"/><path d="M12 7v5l3.2 2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  flag: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 21V4h13l-2.5 4.5L18 13H5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  trash:
    '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 6h18M8 6V4h8v2m3 0-1 14H6L5 6m4 4v6m6-6v6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  check:
    '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
};

const FILTER_TITLE_KEYS = {
  all: "filterAll",
  today: "filterToday",
  scheduled: "filterScheduled",
  favorites: "filterFavorites",
  completed: "filterCompleted",
};

const LANG_SHORT_LABELS = {
  ru: "РУ",
  uk: "УКР",
  en: "EN",
};

const PICKER_LABELS = {
  ru: { tomorrow: "Завтра", nextWeek: "+7 дн.", nextMonth: "+1 мес." },
  uk: { tomorrow: "Завтра", nextWeek: "+7 дн.", nextMonth: "+1 міс." },
  en: { tomorrow: "Tomorrow", nextWeek: "+7d", nextMonth: "+1 mo" },
};



setLanguage(loadPreference(STORAGE_KEYS.language, DEFAULT_LANGUAGE, LANGUAGES));
let theme = loadPreference(STORAGE_KEYS.theme, "light", ["light", "dark"]);
let sidebarCollapsed =
  loadPreference(STORAGE_KEYS.sidebar, "expanded", ["expanded", "collapsed"]) === "collapsed";

const loadedGroups = loadGroups();
const loadedTasks = loadTasks(loadedGroups.items);
let groups = loadedGroups.items;
let tasks = loadedTasks.items;

let currentFilter = "all";
let editingTaskId = null;
let editingGroupId = null;
let contextMenuGroupId = null;
let contextMenuTaskId = null;
let activeTaskLongPress = null;
let activeTaskSwipe = null;
let suppressTaskEditClick = false;
let mobileComposerOpen = false;
let mobileSearchExpanded = false;
let mobileGroupReorderMode = false;
let prefsCloseTimer = null;
let pendingConfirmAction = null;
let renderPending = false;
let searchQuery = "";



function setMobileGroupReorderMode(enabled) {
  const next = Boolean(enabled) && window.matchMedia(MOBILE_QUERY).matches && groups.length > 1;
  if (mobileGroupReorderMode === next) return;
  mobileGroupReorderMode = next;
  document.documentElement.classList.toggle("is-reordering-groups", mobileGroupReorderMode);

  const btnLabel = mobileGroupReorderMode ? t("doneReordering") : t("addGroup");
  openGroupDialogButton.setAttribute("aria-label", btnLabel);
  openGroupDialogButton.title = btnLabel;
}



function enableHorizontalDragAndWheelScroll(strip, { canScroll = () => true } = {}) {
  if (!strip) return;

  let pointerDown = false;
  let dragging = false;
  let startX = 0;
  let startScrollLeft = 0;
  let activePointerId = null;
  let suppressStripClick = false;

  strip.addEventListener(
    "wheel",
    (event) => {
      if (!canScroll()) {
        event.preventDefault();
        return;
      }
      if (strip.scrollWidth <= strip.clientWidth) return;
      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      if (!delta) return;
      event.preventDefault();
      strip.scrollLeft += delta;
    },
    { passive: false },
  );

  strip.addEventListener(
    "click",
    (event) => {
      if (!suppressStripClick) return;
      suppressStripClick = false;
      event.stopPropagation();
      event.preventDefault();
    },
    true,
  );

  strip.addEventListener("pointerdown", (event) => {
    if (!canScroll()) return;
    if (event.pointerType === "touch" || event.button !== 0) return;
    if (strip.scrollWidth <= strip.clientWidth) return;
    pointerDown = true;
    dragging = false;
    activePointerId = event.pointerId;
    startX = event.clientX;
    startScrollLeft = strip.scrollLeft;
  });

  strip.addEventListener("pointermove", (event) => {
    if (!pointerDown || event.pointerId !== activePointerId) return;
    if (!canScroll()) {
      pointerDown = false;
      activePointerId = null;
      strip.classList.remove("is-grabbing");
      return;
    }
    const dx = event.clientX - startX;
    if (!dragging) {
      if (Math.abs(dx) < 5) return;
      dragging = true;
      strip.classList.add("is-grabbing");
      try {
        strip.setPointerCapture(event.pointerId);
      } catch {
        
      }
    }
    strip.scrollLeft = startScrollLeft - dx;
  });

  function endStripDrag(event) {
    if (!pointerDown || event.pointerId !== activePointerId) return;
    pointerDown = false;
    activePointerId = null;
    strip.classList.remove("is-grabbing");
    if (dragging) {
      dragging = false;
      suppressStripClick = true;
      window.setTimeout(() => {
        suppressStripClick = false;
      }, 0);
    }
  }

  strip.addEventListener("pointerup", endStripDrag);
  strip.addEventListener("pointercancel", endStripDrag);
}

enableHorizontalDragAndWheelScroll(taskEditGroupList);
enableHorizontalDragAndWheelScroll(groupList, {
  canScroll: () => !mobileGroupReorderMode,
});



function syncGroupsPlacement() {
  const isMobile = window.matchMedia(MOBILE_QUERY).matches;
  const targetParent = isMobile ? mobileGroupsSlot : sidebar;
  if (groupsSection.parentElement !== targetParent) {
    targetParent.append(groupsSection);
  }
}



function updatePlanningGlider() {
  const buttons = [...planningList.querySelectorAll(".filter-button")];
  const activeIdx = buttons.findIndex((btn) => btn.dataset.filter === currentFilter);
  if (activeIdx === -1) {
    navGlider.classList.remove("is-visible");
    return;
  }
  navGlider.style.setProperty("--nav-index", String(activeIdx));
  navGlider.classList.add("is-visible");
}

function updatePrefsGliders() {
  const langOrder = ["uk", "ru", "en"];
  const langIdx = Math.max(0, langOrder.indexOf(getLanguage()));
  langSegGlider.style.setProperty("--seg-index", String(langIdx));

  const themeIdx = theme === "dark" ? 1 : 0;
  themeSegGlider.style.setProperty("--seg-index", String(themeIdx));
}



function isDialogBackdropClick(event, dialog) {
  if (activePicker) return false;
  if (event.target !== dialog) return false;
  const form = dialog.querySelector(".group-dialog-form");
  if (!form) return true;
  const rect = form.getBoundingClientRect();
  return (
    event.clientX < rect.left ||
    event.clientX > rect.right ||
    event.clientY < rect.top ||
    event.clientY > rect.bottom
  );
}



function openConfirmDialog({ title, copy, submitLabel, onConfirm }) {
  confirmClearTitle.textContent = title;
  confirmClearCopy.textContent = copy;
  confirmClearSubmit.textContent = submitLabel;
  pendingConfirmAction = onConfirm;
  confirmClearDialog.showModal();
  if (document.activeElement && document.activeElement !== document.body) {
    document.activeElement.blur();
  }
}

confirmClearForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const action = pendingConfirmAction;
  pendingConfirmAction = null;
  confirmClearDialog.close();
  action?.();
});

closeConfirmClearButton.addEventListener("click", () => confirmClearDialog.close());
cancelConfirmClearButton.addEventListener("click", () => confirmClearDialog.close());
confirmClearDialog.addEventListener("close", () => {
  pendingConfirmAction = null;
});
confirmClearDialog.addEventListener("click", (event) => {
  if (isDialogBackdropClick(event, confirmClearDialog)) confirmClearDialog.close();
});



const TEXT_INPUT_TYPES = new Set(["text", "search", "url", "tel", "email", "password", "number"]);

function isVirtualKeyboardTarget(element) {
  if (!element || !(element instanceof HTMLElement)) return false;
  if (element.isContentEditable || element.tagName === "TEXTAREA") return true;
  if (element.tagName === "INPUT") {
    return TEXT_INPUT_TYPES.has((element.type || "text").toLowerCase());
  }
  return false;
}

function ensureFocusedInputVisible() {
  const active = document.activeElement;
  if (!isVirtualKeyboardTarget(active)) return;

  const dialogForm = active.closest(".group-dialog-form");
  if (dialogForm) {
    window.requestAnimationFrame(() => {
      active.scrollIntoView({ block: "nearest", behavior: "smooth" });
    });
  }
}

function syncVisualViewport() {
  const root = document.documentElement;
  const vv = window.visualViewport;
  const isMobile = window.matchMedia(MOBILE_QUERY).matches;

  if (!vv || !isMobile) {
    root.style.setProperty("--kb-offset", "0px");
    root.style.setProperty("--vv-height", `${window.innerHeight}px`);
    root.style.setProperty("--vv-offset-top", "0px");
    root.classList.remove("is-keyboard-open", "is-search-focused");
    return;
  }

  const rawOffset = Math.round(window.innerHeight - (vv.height + vv.offsetTop));
  const kbOffset = Math.max(0, rawOffset);
  const active = document.activeElement;
  const hasInputFocus = isVirtualKeyboardTarget(active);
  const keyboardOpen = kbOffset > 90 || (hasInputFocus && kbOffset > 20);

  root.style.setProperty("--kb-offset", `${kbOffset}px`);
  root.style.setProperty("--vv-height", `${Math.round(vv.height)}px`);
  root.style.setProperty("--vv-offset-top", `${Math.max(0, Math.round(vv.offsetTop))}px`);

  root.classList.toggle("is-keyboard-open", keyboardOpen);
  root.classList.toggle("is-search-focused", active === searchInput);

  if (keyboardOpen) {
    ensureFocusedInputVisible();
  }
}

if (window.visualViewport) {
  window.visualViewport.addEventListener("resize", syncVisualViewport);
  window.visualViewport.addEventListener("scroll", syncVisualViewport);
}
window.addEventListener("resize", syncVisualViewport);

document.addEventListener("focusin", (event) => {
  if (!window.matchMedia(MOBILE_QUERY).matches) return;
  if (event.target === searchInput) {
    document.documentElement.classList.add("is-search-focused");
  }
  if (isVirtualKeyboardTarget(event.target)) {
    syncVisualViewport();
    window.setTimeout(syncVisualViewport, 120);
    window.setTimeout(syncVisualViewport, 320);
  }
});

document.addEventListener("focusout", () => {
  if (!window.matchMedia(MOBILE_QUERY).matches) return;
  window.setTimeout(syncVisualViewport, 80);
  window.setTimeout(syncVisualViewport, 280);
});



function flagInvalidField(element) {
  if (!element) return;
  element.classList.remove("is-invalid");
  void element.offsetWidth;
  element.classList.add("is-invalid");
  window.setTimeout(() => element.classList.remove("is-invalid"), 600);
}

function normalizeSearchText(value) {
  return String(value ?? "")
    .toLocaleLowerCase()
    .replace(/ё/g, "е");
}

function getSearchTokens(query = searchQuery) {
  const normalized = normalizeSearchText(query).trim();
  return normalized ? normalized.split(/\s+/).filter(Boolean) : [];
}

function matchesSearchQuery(task, tokens) {
  if (!tokens.length) return true;

  const group = groups.find((item) => item.id === task.groupId);
  const locale = t("dateLocale");
  let dateShort = "";
  let dateLong = "";
  if (task.dueDate) {
    const parsed = parseLocalDate(task.dueDate);
    dateShort = formatDate(parsed, locale, "numericDate");
    dateLong = formatDate(parsed, locale, "long");
  }

  const haystack = normalizeSearchText(
    [task.text, group?.name || "", task.dueDate || "", dateShort, dateLong, task.dueTime || ""].join(" "),
  );

  return tokens.every((token) => haystack.includes(token));
}

function appendHighlightedText(container, text, tokens) {
  container.textContent = "";
  if (!text) return;
  if (!tokens.length) {
    container.textContent = text;
    return;
  }

  const normalized = normalizeSearchText(text);
  const ranges = [];

  for (const token of tokens) {
    if (!token) continue;
    let fromIndex = 0;
    while (fromIndex < normalized.length) {
      const idx = normalized.indexOf(token, fromIndex);
      if (idx === -1) break;
      ranges.push([idx, idx + token.length]);
      fromIndex = idx + Math.max(1, token.length);
    }
  }

  if (!ranges.length) {
    container.textContent = text;
    return;
  }

  ranges.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const merged = [ranges[0]];
  for (let i = 1; i < ranges.length; i += 1) {
    const prev = merged[merged.length - 1];
    const curr = ranges[i];
    if (curr[0] <= prev[1]) {
      prev[1] = Math.max(prev[1], curr[1]);
    } else {
      merged.push(curr);
    }
  }

  let cursor = 0;
  for (const [start, end] of merged) {
    if (start > cursor) {
      container.append(document.createTextNode(text.slice(cursor, start)));
    }
    const mark = document.createElement("mark");
    mark.className = "search-highlight";
    mark.textContent = text.slice(start, end);
    container.append(mark);
    cursor = end;
  }
  if (cursor < text.length) {
    container.append(document.createTextNode(text.slice(cursor)));
  }
}

function moveById(list, id, offset, idOf = (item) => item) {
  const from = list.findIndex((item) => idOf(item) === id);
  const to = Math.max(0, Math.min(list.length - 1, from + offset));
  if (from === -1 || from === to) return list;
  const copy = [...list];
  copy.splice(to, 0, copy.splice(from, 1)[0]);
  return copy;
}

function reorderByIds(list, ids, idOf) {
  const byId = new Map(list.map((item) => [idOf(item), item]));
  const ordered = ids.map((id) => byId.get(id)).filter(Boolean);
  const missing = list.filter((item) => !ids.includes(idOf(item)));
  return [...ordered, ...missing];
}

const getGroupFilterId = (filter) =>
  filter.startsWith(GROUP_FILTER_PREFIX) ? filter.slice(GROUP_FILTER_PREFIX.length) : null;

const findTask = (id) => tasks.find((task) => task.id === id);

function reconcile(container, nodes) {
  const wanted = new Set(nodes);
  for (const child of [...container.children]) {
    if (!wanted.has(child)) child.remove();
  }
  nodes.forEach((node, index) => {
    const current = container.children[index];
    if (current !== node) container.insertBefore(node, current ?? null);
  });
}

function createKeyedCache() {
  let previous = new Map();
  let next = new Map();
  return {
    begin() {
      next = new Map();
    },
    get(key, signature, create) {
      const hit = previous.get(key);
      const entry = hit && hit.signature === signature ? hit : { signature, node: create() };
      next.set(key, entry);
      return entry.node;
    },
    end() {
      previous = next;
    },
  };
}

const taskCache = createKeyedCache();
const headingCache = createKeyedCache();
const groupCache = createKeyedCache();

const persistTasks = () => saveTasks(tasks);
const persistGroups = () => saveGroups(groups);
const setTaskCompletion = (task, completed) => {
  task.completed = completed;
  task.completedAt = completed ? getLocalDateString() : null;
};



function setMobileComposerOpen(open, { restoreFocus = false } = {}) {
  mobileComposerOpen = Boolean(open);
  appShell.classList.toggle("is-composer-open", mobileComposerOpen);
  mobileFab.setAttribute("aria-expanded", String(mobileComposerOpen));
  mobileComposerBackdrop.hidden = false;
  mobileComposerBackdrop.classList.toggle("is-visible", mobileComposerOpen);

  if (mobileComposerOpen) {
    setMobileGroupReorderMode(false);
    closeMobilePrefsPopover();
    if (mobileSearchExpanded && !searchQuery) {
      setMobileSearchExpanded(false);
    }
    window.requestAnimationFrame(() => {
      taskInput.focus();
      syncVisualViewport();
    });
  } else {
    closeCustomPicker();
    if (taskForm.contains(document.activeElement)) {
      document.activeElement.blur();
    }
    if (restoreFocus && window.matchMedia(MOBILE_QUERY).matches) {
      mobileFab.focus();
    }
    window.setTimeout(syncVisualViewport, 60);
  }
}

mobileFab.addEventListener("click", () => {
  setMobileComposerOpen(!mobileComposerOpen);
});

mobileComposerBackdrop.addEventListener("click", () => {
  setMobileComposerOpen(false);
});

window.matchMedia(MOBILE_QUERY).addEventListener("change", (event) => {
  syncGroupsPlacement();
  translateDocument();
  applySidebar();
  closeLangDropdown();
  closeMobilePrefsPopover();
  if (!event.matches) {
    setMobileGroupReorderMode(false);
    if (mobileComposerOpen) setMobileComposerOpen(false);
    if (mobileSearchExpanded) setMobileSearchExpanded(false);
  } else if (searchQuery) {
    setMobileSearchExpanded(true, { focus: false });
  }
  syncVisualViewport();
});



let activePicker = null;
let pickerViewYear = new Date().getFullYear();
let pickerViewMonth = new Date().getMonth();
let pickerSelectedDate = "";
let pickerSelectedHour = "09";
let pickerSelectedMinute = "00";

function buildTimeWheels() {
  dtHoursWheel.replaceChildren(
    ...Array.from({ length: 24 }, (_, h) => {
      const val = String(h).padStart(2, "0");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "dt-wheel-item";
      btn.dataset.value = val;
      btn.textContent = val;
      btn.addEventListener("click", (event) => {
        event.stopPropagation();
        pickerSelectedHour = val;
        updateTimeWheelSelection({ scroll: true, updateInput: true });
      });
      return btn;
    }),
  );

  const minuteSteps = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, "0"));
  dtMinutesWheel.replaceChildren(
    ...minuteSteps.map((val) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "dt-wheel-item";
      btn.dataset.value = val;
      btn.textContent = val;
      btn.addEventListener("click", (event) => {
        event.stopPropagation();
        pickerSelectedMinute = val;
        updateTimeWheelSelection({ scroll: true, updateInput: true });
      });
      return btn;
    }),
  );

  const timePresets = ["09:00", "12:00", "15:00", "18:00", "20:00"];
  dtTimePresets.replaceChildren(
    ...timePresets.map((preset) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "dt-chip";
      btn.dataset.time = preset;
      btn.textContent = preset;
      btn.addEventListener("click", (event) => {
        event.stopPropagation();
        const [hh, mm] = preset.split(":");
        pickerSelectedHour = hh;
        pickerSelectedMinute = mm;
        updateTimeWheelSelection({ scroll: true, updateInput: true });
      });
      return btn;
    }),
  );
}
buildTimeWheels();

dtTimeInput.addEventListener("input", () => {
  const digits = dtTimeInput.value.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) {
    dtTimeInput.value = `${digits.slice(0, 2)}:${digits.slice(2)}`;
  } else {
    dtTimeInput.value = digits;
  }

  if (digits.length === 4) {
    const hhNum = Math.min(23, Math.max(0, Number(digits.slice(0, 2))));
    const mmNum = Math.min(59, Math.max(0, Number(digits.slice(2, 4))));
    pickerSelectedHour = String(hhNum).padStart(2, "0");
    pickerSelectedMinute = String(mmNum).padStart(2, "0");
    dtTimeInput.value = `${pickerSelectedHour}:${pickerSelectedMinute}`;
    updateTimeWheelSelection({ scroll: true, updateInput: false });
  }
});

function normalizeTypedTimeInput() {
  const raw = dtTimeInput.value.trim();
  if (!raw) {
    dtTimeInput.value = `${pickerSelectedHour}:${pickerSelectedMinute}`;
    return;
  }
  const digits = raw.replace(/\D/g, "");
  if (!digits) {
    dtTimeInput.value = `${pickerSelectedHour}:${pickerSelectedMinute}`;
    return;
  }
  let hh = 9;
  let mm = 0;
  if (digits.length <= 2) {
    hh = Number(digits);
  } else if (digits.length === 3) {
    hh = Number(digits.slice(0, 1));
    mm = Number(digits.slice(1, 3));
  } else {
    hh = Number(digits.slice(0, 2));
    mm = Number(digits.slice(2, 4));
  }
  hh = Math.min(23, Math.max(0, hh));
  mm = Math.min(59, Math.max(0, mm));
  pickerSelectedHour = String(hh).padStart(2, "0");
  pickerSelectedMinute = String(mm).padStart(2, "0");
  updateTimeWheelSelection({ scroll: true, updateInput: true });
}

dtTimeInput.addEventListener("blur", normalizeTypedTimeInput);

dtPopover.addEventListener("click", (event) => {
  event.stopPropagation();
});
dtPopover.addEventListener("pointerdown", (event) => {
  event.stopPropagation();
});

dtPopover.addEventListener("keydown", (event) => {
  if (!activePicker) return;

  if (activePicker.mode === "date") {
    const dayOffsets = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -7,
      ArrowDown: 7,
    };
    if (event.key in dayOffsets) {
      event.preventDefault();
      event.stopPropagation();
      const baseIso = pickerSelectedDate || getLocalDateString();
      const nextIso = addDays(baseIso, dayOffsets[event.key]);
      pickerSelectedDate = nextIso;
      const nextDate = parseLocalDate(nextIso);
      pickerViewYear = nextDate.getFullYear();
      pickerViewMonth = nextDate.getMonth();
      renderCustomCalendar();
      dtDaysGrid.querySelector(`[data-iso="${nextIso}"]`)?.focus();
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();
      applyCustomPickerValue(pickerSelectedDate || getLocalDateString());
    }
  } else if (activePicker.mode === "time") {
    if (document.activeElement === dtTimeInput) {
      if (event.key === "Enter") {
        event.preventDefault();
        event.stopPropagation();
        normalizeTypedTimeInput();
        applyCustomPickerValue(`${pickerSelectedHour}:${pickerSelectedMinute}`);
      }
      return;
    }

    const inMinutes = dtMinutesWheel.contains(document.activeElement);
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
      event.stopPropagation();
      const step = event.key === "ArrowUp" ? -1 : 1;
      if (inMinutes) {
        const curIdx = Math.round(Number(pickerSelectedMinute) / 5);
        const nextIdx = (curIdx + step + 12) % 12;
        pickerSelectedMinute = String(nextIdx * 5).padStart(2, "0");
        updateTimeWheelSelection({ scroll: true, updateInput: true });
        dtMinutesWheel.querySelector(".dt-wheel-item.is-selected")?.focus();
      } else {
        const nextHour = (Number(pickerSelectedHour) + step + 24) % 24;
        pickerSelectedHour = String(nextHour).padStart(2, "0");
        updateTimeWheelSelection({ scroll: true, updateInput: true });
        dtHoursWheel.querySelector(".dt-wheel-item.is-selected")?.focus();
      }
    } else if (event.key === "ArrowRight" && !inMinutes) {
      event.preventDefault();
      dtMinutesWheel.querySelector(".dt-wheel-item.is-selected")?.focus();
    } else if (event.key === "ArrowLeft" && inMinutes) {
      event.preventDefault();
      dtHoursWheel.querySelector(".dt-wheel-item.is-selected")?.focus();
    } else if (event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();
      applyCustomPickerValue(`${pickerSelectedHour}:${pickerSelectedMinute}`);
    }
  }
});

dtPopover.addEventListener(
  "wheel",
  (event) => {
    const wheel = event.target.closest(".dt-wheel");
    if (!wheel) {
      event.preventDefault();
      return;
    }
    const atTop = wheel.scrollTop <= 0 && event.deltaY < 0;
    const atBottom = wheel.scrollTop + wheel.clientHeight >= wheel.scrollHeight - 1 && event.deltaY > 0;
    if (atTop || atBottom) {
      event.preventDefault();
    }
  },
  { passive: false },
);

dtPopover.addEventListener(
  "touchmove",
  (event) => {
    if (!event.target.closest(".dt-wheel")) {
      event.preventDefault();
    }
  },
  { passive: false },
);

function updateTimeWheelSelection({ scroll = false, updateInput = true } = {}) {
  const current = `${pickerSelectedHour}:${pickerSelectedMinute}`;
  if (updateInput && document.activeElement !== dtTimeInput) {
    dtTimeInput.value = current;
  }

  dtHoursWheel.querySelectorAll(".dt-wheel-item").forEach((btn) => {
    const active = btn.dataset.value === pickerSelectedHour;
    btn.classList.toggle("is-selected", active);
    btn.setAttribute("aria-selected", String(active));
    if (active && scroll) {
      btn.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  });

  const nearestMinuteWheel = String((Math.round(Number(pickerSelectedMinute) / 5) * 5) % 60).padStart(2, "0");
  dtMinutesWheel.querySelectorAll(".dt-wheel-item").forEach((btn) => {
    const active = btn.dataset.value === pickerSelectedMinute;
    btn.classList.toggle("is-selected", active);
    btn.setAttribute("aria-selected", String(active));
    if ((active || btn.dataset.value === nearestMinuteWheel) && scroll) {
      btn.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  });

  dtTimePresets.querySelectorAll(".dt-chip").forEach((chip) => {
    chip.classList.toggle("is-active", chip.dataset.time === current);
  });
}

function renderCustomCalendar() {
  const locale = t("dateLocale");
  const lang = getLanguage();
  const labels = PICKER_LABELS[lang] || PICKER_LABELS.ru;
  const today = getLocalDateString();
  const tomorrow = addDays(today, 1);
  const nextWeek = addDays(today, 7);
  const nextMonth = addMonths(today, 1);

  const presets = [
    { label: t("filterToday"), value: today },
    { label: labels.tomorrow, value: tomorrow },
    { label: labels.nextWeek, value: nextWeek },
    { label: labels.nextMonth, value: nextMonth },
  ];
  dtDatePresets.replaceChildren(
    ...presets.map(({ label, value }) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = `dt-chip${pickerSelectedDate === value ? " is-active" : ""}`;
      chip.textContent = label;
      chip.addEventListener("click", (event) => {
        event.stopPropagation();
        pickerSelectedDate = value;
        const parsed = parseLocalDate(value);
        pickerViewYear = parsed.getFullYear();
        pickerViewMonth = parsed.getMonth();
        renderCustomCalendar();
      });
      return chip;
    }),
  );

  const viewDate = new Date(pickerViewYear, pickerViewMonth, 1);
  const monthText = formatDate(viewDate, locale, "monthYear");
  dtMonthTitle.textContent = monthText.charAt(0).toLocaleUpperCase(locale) + monthText.slice(1);

  const startMonday = lang !== "en";
  const baseSunday = new Date(2026, 0, 4);
  const weekdayNodes = [];
  for (let i = 0; i < 7; i += 1) {
    const dayOffset = startMonday ? (i + 1) % 7 : i;
    const d = new Date(baseSunday);
    d.setDate(baseSunday.getDate() + dayOffset);
    const span = document.createElement("span");
    span.textContent = formatDate(d, locale, "weekdayShort").slice(0, 2);
    weekdayNodes.push(span);
  }
  dtWeekdays.replaceChildren(...weekdayNodes);

  const firstDayOfMonth = new Date(pickerViewYear, pickerViewMonth, 1);
  const rawDay = firstDayOfMonth.getDay();
  const leadingEmpty = startMonday ? (rawDay + 6) % 7 : rawDay;
  const daysInMonth = new Date(pickerViewYear, pickerViewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(pickerViewYear, pickerViewMonth, 0).getDate();

  const cells = [];

  for (let i = leadingEmpty - 1; i >= 0; i -= 1) {
    const dayNum = daysInPrevMonth - i;
    const cellDate = new Date(pickerViewYear, pickerViewMonth - 1, dayNum);
    const iso = getLocalDateString(cellDate);
    cells.push(createCalendarDayButton(dayNum, iso, today, true));
  }

  for (let dayNum = 1; dayNum <= daysInMonth; dayNum += 1) {
    const cellDate = new Date(pickerViewYear, pickerViewMonth, dayNum);
    const iso = getLocalDateString(cellDate);
    cells.push(createCalendarDayButton(dayNum, iso, today, false));
  }

  const totalCells = Math.ceil(cells.length / 7) * 7;
  const trailingCount = totalCells - cells.length;
  for (let dayNum = 1; dayNum <= trailingCount; dayNum += 1) {
    const cellDate = new Date(pickerViewYear, pickerViewMonth + 1, dayNum);
    const iso = getLocalDateString(cellDate);
    cells.push(createCalendarDayButton(dayNum, iso, today, true));
  }

  dtDaysGrid.replaceChildren(...cells);
}

function createCalendarDayButton(dayNum, iso, today, isOutside) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "dt-day";
  btn.dataset.iso = iso;
  if (isOutside) btn.classList.add("is-outside");
  if (iso === today) btn.classList.add("is-today");
  if (iso === pickerSelectedDate) btn.classList.add("is-selected");
  btn.textContent = dayNum;
  btn.addEventListener("click", (event) => {
    event.stopPropagation();
    pickerSelectedDate = iso;
    const parsed = parseLocalDate(iso);
    pickerViewYear = parsed.getFullYear();
    pickerViewMonth = parsed.getMonth();
    renderCustomCalendar();
    dtDaysGrid.querySelector(`[data-iso="${iso}"]`)?.focus();
  });
  return btn;
}

function positionCustomPicker(trigger) {
  const isMobile = window.matchMedia(MOBILE_QUERY).matches;
  const insideDialog = Boolean(trigger.closest("dialog"));

  if (isMobile || insideDialog) {
    dtCard.classList.add("is-centered");
    dtCard.style.removeProperty("left");
    dtCard.style.removeProperty("top");
    return;
  }

  dtCard.classList.remove("is-centered");
  const rect = trigger.getBoundingClientRect();
  const cardRect = dtCard.getBoundingClientRect();
  const margin = 10;

  let left = rect.left;
  if (left + cardRect.width > window.innerWidth - margin) {
    left = window.innerWidth - cardRect.width - margin;
  }
  left = Math.max(margin, left);

  let top = rect.bottom + 8;
  if (top + cardRect.height > window.innerHeight - margin) {
    top = Math.max(margin, rect.top - cardRect.height - 8);
  }

  dtCard.style.left = `${Math.round(left)}px`;
  dtCard.style.top = `${Math.round(top)}px`;
}

function openCustomPicker({ mode, input, trigger, onUpdate }) {
  if (document.activeElement && document.activeElement.tagName === "INPUT") {
    document.activeElement.blur();
  }

  const hostDialog = trigger.closest("dialog[open]");
  const targetHost = hostDialog || document.body;
  if (dtPopover.parentElement !== targetHost) {
    targetHost.append(dtPopover);
  }

  activePicker = { mode, input, trigger, onUpdate };

  const isDate = mode === "date";
  dtDateView.hidden = !isDate;
  dtTimeView.hidden = isDate;
  dtApplyBtn.hidden = false;

  if (isDate) {
    pickerSelectedDate = input.value || getLocalDateString();
    const baseDate = input.value ? parseLocalDate(input.value) : new Date();
    pickerViewYear = baseDate.getFullYear();
    pickerViewMonth = baseDate.getMonth();
    renderCustomCalendar();
  } else {
    const initialTime = isValidTime(input.value) ? input.value : "09:00";
    const [hh, mm] = initialTime.split(":");
    pickerSelectedHour = hh || "09";
    pickerSelectedMinute = mm || "00";
    updateTimeWheelSelection({ scroll: false, updateInput: true });
  }

  dtPopover.hidden = false;
  window.requestAnimationFrame(() => {
    dtPopover.classList.add("is-open");
    positionCustomPicker(trigger);
    if (isDate) {
      dtDaysGrid.querySelector(".dt-day.is-selected")?.focus();
    } else {
      updateTimeWheelSelection({ scroll: true, updateInput: true });
    }
  });
}

function closeCustomPicker({ restoreFocus = true } = {}) {
  if (!activePicker) return;
  const { trigger } = activePicker;
  activePicker = null;
  dtPopover.classList.remove("is-open");
  dtPopover.hidden = true;
  if (dtPopover.parentElement !== document.body) {
    document.body.append(dtPopover);
  }
  if (restoreFocus && trigger && !window.matchMedia(MOBILE_QUERY).matches) {
    trigger.focus();
  }
}

function applyCustomPickerValue(value) {
  if (!activePicker) return;
  const { input, onUpdate } = activePicker;
  input.value = value;
  input.dispatchEvent(new Event("change", { bubbles: true }));
  onUpdate?.();
  closeCustomPicker();
}

dtPrevMonth.addEventListener("click", (event) => {
  event.stopPropagation();
  pickerViewMonth -= 1;
  if (pickerViewMonth < 0) {
    pickerViewMonth = 11;
    pickerViewYear -= 1;
  }
  renderCustomCalendar();
});

dtNextMonth.addEventListener("click", (event) => {
  event.stopPropagation();
  pickerViewMonth += 1;
  if (pickerViewMonth > 11) {
    pickerViewMonth = 0;
    pickerViewYear += 1;
  }
  renderCustomCalendar();
});

dtClearBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  applyCustomPickerValue("");
});

dtApplyBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  if (!activePicker) return;
  if (activePicker.mode === "time") {
    normalizeTypedTimeInput();
    applyCustomPickerValue(`${pickerSelectedHour}:${pickerSelectedMinute}`);
  } else {
    applyCustomPickerValue(pickerSelectedDate || getLocalDateString());
  }
});

dtBackdrop.addEventListener("click", (event) => {
  event.stopPropagation();
  closeCustomPicker();
});



function toggleLangDropdown(force, { focusSelected = false } = {}) {
  const nextOpen = typeof force === "boolean" ? force : langDropdownMenu.hidden;
  langDropdownMenu.hidden = !nextOpen;
  langDropdown.classList.toggle("is-open", nextOpen);
  langDropdownTrigger.setAttribute("aria-expanded", String(nextOpen));
  if (nextOpen && focusSelected) {
    const selected = langDropdownMenu.querySelector(".lang-dropdown-option.is-selected") ?? langDropdownOptions[0];
    selected?.focus();
  }
}

function closeLangDropdown({ restoreFocus = false } = {}) {
  if (langDropdownMenu.hidden) return;
  toggleLangDropdown(false);
  if (restoreFocus) langDropdownTrigger.focus();
}

langDropdownTrigger.addEventListener("click", (event) => {
  event.stopPropagation();
  toggleLangDropdown();
});

langDropdownTrigger.addEventListener("keydown", (event) => {
  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    event.preventDefault();
    toggleLangDropdown(true, { focusSelected: true });
  }
});

langDropdownMenu.addEventListener("keydown", (event) => {
  const currentIndex = langDropdownOptions.indexOf(document.activeElement);
  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    event.preventDefault();
    const delta = event.key === "ArrowDown" ? 1 : -1;
    const base = currentIndex === -1 ? 0 : currentIndex;
    const nextIndex = (base + delta + langDropdownOptions.length) % langDropdownOptions.length;
    langDropdownOptions[nextIndex]?.focus();
  } else if (event.key === "Home") {
    event.preventDefault();
    langDropdownOptions[0]?.focus();
  } else if (event.key === "End") {
    event.preventDefault();
    langDropdownOptions[langDropdownOptions.length - 1]?.focus();
  } else if (event.key === "Tab") {
    closeLangDropdown();
  }
});

langDropdownOptions.forEach((option) => {
  option.addEventListener("click", (event) => {
    event.stopPropagation();
    changeLanguage(option.dataset.lang);
    closeLangDropdown({ restoreFocus: true });
  });
});

function toggleMobilePrefsPopover(force) {
  const isCurrentlyOpen = mobilePrefs.classList.contains("is-open");
  const nextOpen = typeof force === "boolean" ? force : !isCurrentlyOpen;

  window.clearTimeout(prefsCloseTimer);

  if (nextOpen) {
    setMobileGroupReorderMode(false);
    mobilePrefsPopover.hidden = false;
    mobilePrefsBackdrop.hidden = false;
    document.documentElement.classList.add("is-prefs-elevated");
  }

  updatePrefsGliders();
  window.requestAnimationFrame(() => {
    mobilePrefs.classList.toggle("is-open", nextOpen);
    mobilePrefsBackdrop.classList.toggle("is-visible", nextOpen);
    document.documentElement.classList.toggle("is-prefs-open", nextOpen);
    mobilePrefsTrigger.setAttribute("aria-expanded", String(nextOpen));

    if (!nextOpen) {
      prefsCloseTimer = window.setTimeout(() => {
        if (!mobilePrefs.classList.contains("is-open")) {
          document.documentElement.classList.remove("is-prefs-elevated");
          mobilePrefsBackdrop.hidden = true;
        }
      }, 280);
    }
  });
}

function closeMobilePrefsPopover() {
  if (!mobilePrefs.classList.contains("is-open")) return;
  toggleMobilePrefsPopover(false);
}

mobilePrefsTrigger.addEventListener("click", (event) => {
  event.stopPropagation();
  toggleMobilePrefsPopover();
});

mobilePrefsBackdrop.addEventListener("click", () => {
  closeMobilePrefsPopover();
});

mobilePrefLangs.forEach((btn) => {
  btn.addEventListener("click", (event) => {
    event.stopPropagation();
    changeLanguage(btn.dataset.lang);
  });
});

mobilePrefThemeSegs.forEach((btn) => {
  btn.addEventListener("click", (event) => {
    event.stopPropagation();
    setTheme(btn.dataset.themeVal);
  });
});



function setTheme(nextTheme) {
  if (!["light", "dark"].includes(nextTheme) || nextTheme === theme) return;
  theme = nextTheme;
  savePreference(STORAGE_KEYS.theme, theme);
  applyTheme();
}

function applyTheme() {
  document.documentElement.dataset.theme = theme;
  $('meta[name="theme-color"]').content = theme === "dark" ? "#1c1b25" : "#f8f7f5";
  const isDark = theme === "dark";
  const label = isDark ? t("themeSwitchToLight") : t("themeSwitchToDark");

  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggle.setAttribute("aria-label", label);
  themeToggle.title = label;
  themeToggle.classList.toggle("is-dark", isDark);

  mobilePrefThemeSegs.forEach((btn) => {
    const active = btn.dataset.themeVal === theme;
    btn.classList.toggle("is-active", active);
    btn.setAttribute("aria-pressed", String(active));
  });
  updatePrefsGliders();
}

function applySidebar() {
  appShell.classList.toggle("is-sidebar-collapsed", sidebarCollapsed);
  const label = sidebarCollapsed ? t("expandSidebar") : t("collapseSidebar");
  sidebarToggle.setAttribute("aria-expanded", String(!sidebarCollapsed));
  sidebarToggle.setAttribute("aria-label", label);
  sidebarToggle.title = label;
  planningList.querySelectorAll("[data-filter]").forEach((button) => {
    const text = button.querySelector(".filter-label").textContent;
    button.title = sidebarCollapsed ? text : "";
    button.setAttribute("aria-label", text);
  });
  updateGroupListOverflow();
}

function translateDocument() {
  const isMobile = window.matchMedia(MOBILE_QUERY).matches;
  $$("[data-i18n]").forEach((element) => {
    const key = isMobile && element.dataset.i18nMobile ? element.dataset.i18nMobile : element.dataset.i18n;
    element.textContent = t(key);
  });
  $$("[data-i18n-aria]").forEach((element) => {
    element.setAttribute("aria-label", t(element.dataset.i18nAria));
  });
  $$("[data-i18n-title]").forEach((element) => {
    element.title = t(element.dataset.i18nTitle);
  });
  $$("[data-i18n-placeholder]").forEach((element) => {
    element.placeholder = t(element.dataset.i18nPlaceholder);
  });
  if (mobileGroupReorderMode) {
    const doneLabel = t("doneReordering");
    openGroupDialogButton.setAttribute("aria-label", doneLabel);
    openGroupDialogButton.title = doneLabel;
  }
}

function applyLanguage() {
  const lang = getLanguage();
  document.documentElement.lang = lang;
  document.title = t("title");
  $('meta[name="description"]').content = t("description");

  langDropdownLabel.textContent = LANG_SHORT_LABELS[lang] || lang.toUpperCase();
  langDropdownOptions.forEach((opt) => {
    const active = opt.dataset.lang === lang;
    opt.classList.toggle("is-selected", active);
    opt.setAttribute("aria-selected", String(active));
  });
  mobilePrefLangs.forEach((btn) => {
    const active = btn.dataset.lang === lang;
    btn.classList.toggle("is-active", active);
    btn.setAttribute("aria-pressed", String(active));
  });
  updatePrefsGliders();

  translateDocument();
  updateGroupDialogMode();
  renderColorOptions();
  applySidebar();
  applyTheme();
  updateTaskScheduleDisplay();
  updateTaskEditScheduleDisplay();
  render();
}

function updateTaskScheduleDisplay() {
  const hasDate = Boolean(taskDateInput.value);
  const hasTime = Boolean(taskTimeInput.value);
  taskDateDisplay.textContent = hasDate
    ? formatDate(parseLocalDate(taskDateInput.value), t("dateLocale"), "numericDate")
    : "";
  taskTimeDisplay.textContent = taskTimeInput.value;
  taskDateControl.classList.toggle("has-value", hasDate);
  taskTimeControl.classList.toggle("has-value", hasTime);
  clearTaskScheduleButton.disabled = !taskInput.value && !hasDate && !hasTime;
}

function updateTaskEditScheduleDisplay() {
  const hasDate = Boolean(taskEditDateInput.value);
  const hasTime = Boolean(taskEditTimeInput.value);
  taskEditDateDisplay.textContent = hasDate
    ? formatDate(parseLocalDate(taskEditDateInput.value), t("dateLocale"), "numericDate")
    : t("sectionNoDate");
  taskEditTimeDisplay.textContent = hasTime ? taskEditTimeInput.value : t("noTime");
  taskEditDateTrigger.classList.toggle("has-value", hasDate);
  taskEditTimeTrigger.classList.toggle("has-value", hasTime);
}

function renderTaskEditGroupOptions(selectedGroupId) {
  taskEditGroupField.hidden = groups.length === 0;
  taskEditGroupInput.value = selectedGroupId || "";

  if (!groups.length) {
    taskEditGroupList.replaceChildren();
    return;
  }

  const options = [
    { id: "", name: t("noGroup"), color: null },
    ...groups.map((g) => ({ id: g.id, name: g.name, color: g.color })),
  ];

  taskEditGroupList.replaceChildren(
    ...options.map((opt) => {
      const btn = document.createElement("button");
      btn.type = "button";
      const isSelected = (selectedGroupId || "") === opt.id;
      btn.className = `task-edit-group-chip${isSelected ? " is-selected" : ""}`;
      btn.setAttribute("role", "radio");
      btn.setAttribute("aria-checked", String(isSelected));

      if (opt.color) {
        const dot = document.createElement("span");
        dot.className = "group-dot";
        dot.style.setProperty("--group-color", opt.color);
        btn.append(dot);
      }

      const label = document.createElement("span");
      label.className = "task-edit-group-chip-name";
      label.textContent = opt.name;
      btn.append(label);

      btn.addEventListener("click", () => {
        renderTaskEditGroupOptions(opt.id);
      });
      return btn;
    }),
  );
}



function positionMenu(menu, x, y) {
  menu.hidden = false;
  const bounds = menu.getBoundingClientRect();
  const vv = window.visualViewport;
  const maxWidth = vv ? vv.width : window.innerWidth;
  const maxHeight = vv ? vv.height + vv.offsetTop : window.innerHeight;
  const minTop = vv ? vv.offsetTop + 8 : 8;

  menu.style.left = `${Math.max(8, Math.min(x, maxWidth - bounds.width - 8))}px`;
  menu.style.top = `${Math.max(minTop, Math.min(y, maxHeight - bounds.height - 8))}px`;
}

function closeContextMenus() {
  groupContextMenu.hidden = true;
  taskContextMenu.hidden = true;
  contextMenuGroupId = null;
  contextMenuTaskId = null;
}

function openGroupContextMenu(groupId, x, y) {
  if (!groups.some((group) => group.id === groupId)) return;
  closeContextMenus();
  contextMenuGroupId = groupId;
  const isMobile = window.matchMedia(MOBILE_QUERY).matches;
  reorderGroupsAction.hidden = !isMobile || groups.length < 2;
  positionMenu(groupContextMenu, x, y);
  editGroupAction.focus();
}

function openTaskContextMenu(taskId, x, y) {
  if (!tasks.some((task) => task.id === taskId)) return;
  closeContextMenus();
  contextMenuTaskId = taskId;
  positionMenu(taskContextMenu, x, y);
  editTaskAction.focus();
}

editGroupAction.addEventListener("click", () => {
  const group = groups.find((item) => item.id === contextMenuGroupId);
  closeContextMenus();
  setMobileGroupReorderMode(false);
  if (group) openGroupDialog(group);
});

reorderGroupsAction.addEventListener("click", () => {
  closeContextMenus();
  setMobileGroupReorderMode(true);
});

function performDeleteGroup(groupId) {
  groups = groups.filter((group) => group.id !== groupId);
  tasks = tasks.filter((task) => task.groupId !== groupId);
  if (groups.length < 2) setMobileGroupReorderMode(false);
  persistTasks();
  persistGroups();
  render();
}

deleteGroupAction.addEventListener("click", () => {
  const groupId = contextMenuGroupId;
  closeContextMenus();
  if (!groupId) return;

  const hasTasksInGroup = tasks.some((task) => task.groupId === groupId);
  if (hasTasksInGroup) {
    openConfirmDialog({
      title: t("confirmDeleteGroupTitle"),
      copy: t("confirmDeleteGroupCopy"),
      submitLabel: t("deleteGroup"),
      onConfirm: () => performDeleteGroup(groupId),
    });
  } else {
    performDeleteGroup(groupId);
  }
});

editTaskAction.addEventListener("click", () => {
  const task = tasks.find((item) => item.id === contextMenuTaskId);
  closeContextMenus();
  if (task) openTaskEditor(task);
});

deleteTaskAction.addEventListener("click", () => {
  const taskId = contextMenuTaskId;
  closeContextMenus();
  if (!taskId) return;
  tasks = tasks.filter((task) => task.id !== taskId);
  persistTasks();
  render();
});

window.addEventListener("pointerdown", (event) => {
  if (!groupContextMenu.hidden && !groupContextMenu.contains(event.target)) closeContextMenus();
  if (!taskContextMenu.hidden && !taskContextMenu.contains(event.target)) closeContextMenus();
  if (!langDropdownMenu.hidden && !langDropdown.contains(event.target)) closeLangDropdown();
  if (
    mobilePrefs.classList.contains("is-open") &&
    !mobilePrefs.contains(event.target) &&
    event.target !== mobilePrefsBackdrop
  ) {
    closeMobilePrefsPopover();
  }
  if (
    mobileGroupReorderMode &&
    !groupSortable.isDragging() &&
    !event.target.closest(".group-item") &&
    !groupsSection.contains(event.target) &&
    !groupContextMenu.contains(event.target)
  ) {
    setMobileGroupReorderMode(false);
  }
  if (
    mobileSearchExpanded &&
    !searchQuery &&
    !searchBox.contains(event.target) &&
    window.matchMedia(MOBILE_QUERY).matches
  ) {
    setMobileSearchExpanded(false);
  }
});

window.addEventListener(
  "keydown",
  (event) => {
    if (event.key === "Escape") {
      if (activePicker) {
        event.preventDefault();
        event.stopPropagation();
        closeCustomPicker();
        return;
      }
      if (!langDropdownMenu.hidden) {
        event.preventDefault();
        closeLangDropdown({ restoreFocus: true });
        return;
      }
      if (mobilePrefs.classList.contains("is-open")) {
        event.preventDefault();
        closeMobilePrefsPopover();
        return;
      }
      if (mobileGroupReorderMode) {
        event.preventDefault();
        setMobileGroupReorderMode(false);
        return;
      }
      closeContextMenus();
      if (mobileComposerOpen) setMobileComposerOpen(false, { restoreFocus: true });
    }
  },
  true,
);

[taskEditDialog, groupDialog, confirmClearDialog].forEach((dialog) => {
  dialog.addEventListener("cancel", (event) => {
    if (activePicker) {
      event.preventDefault();
      closeCustomPicker();
    }
  });
});

window.addEventListener("resize", () => {
  closeContextMenus();
  if (activePicker) positionCustomPicker(activePicker.trigger);
  updateGroupListOverflow();
});



function updateGroupDialogMode() {
  const isEditing = Boolean(editingGroupId);
  const name = isEditing ? t("saveTaskButton") : t("createGroupButton");
  $("#group-dialog-title").textContent = isEditing ? t("editGroup") : t("groupDialogTitle");
  groupSubmit.textContent = isEditing ? t("saveTaskButton") : `+ ${t("add")}`;
  groupSubmit.setAttribute("aria-label", name);
  groupSubmit.title = name;
}

function renderColorOptions() {
  $("#color-options").replaceChildren(
    ...GROUP_COLORS.map((color, index) => {
      const label = document.createElement("label");
      label.className = "color-option";
      label.title = t(color.key);

      const input = document.createElement("input");
      input.type = "radio";
      input.name = "groupColor";
      input.value = color.value;
      input.checked = index === 0;
      input.required = true;
      input.setAttribute("aria-label", t(color.key));

      const swatch = document.createElement("span");
      swatch.style.setProperty("--group-color", color.value);
      label.append(input, swatch);
      return label;
    }),
  );
}

function openGroupDialog(group = null) {
  editingGroupId = group ? group.id : null;
  groupForm.reset();
  renderColorOptions();
  if (group) {
    groupNameInput.value = group.name;
    const radio = groupForm.querySelector(`input[name="groupColor"][value="${group.color}"]`);
    if (radio) radio.checked = true;
  }
  updateGroupDialogMode();
  groupDialog.showModal();
  groupNameInput.focus();
  if (group) groupNameInput.select();
  syncVisualViewport();
}

function createGroupElement(group, counts) {
  const filter = `${GROUP_FILTER_PREFIX}${group.id}`;
  const isActive = currentFilter === filter;

  const row = document.createElement("div");
  row.className = "group-item";
  row.dataset.groupId = group.id;

  const dot = document.createElement("span");
  dot.className = "group-dot";
  dot.style.setProperty("--group-color", group.color);
  dot.setAttribute("aria-hidden", "true");

  const name = document.createElement("span");
  name.className = "group-name";
  name.textContent = group.name;

  const count = document.createElement("span");
  count.className = "group-count";
  count.textContent = counts.get(group.id) ?? 0;

  const button = document.createElement("button");
  button.type = "button";
  button.className = `group-filter-button${isActive ? " is-active" : ""}`;
  button.title = group.name;
  button.setAttribute("aria-pressed", String(isActive));
  button.setAttribute("aria-label", `${group.name}. ${t("manageGroup")}`);
  button.append(dot, name, count);
  button.addEventListener("click", () => {
    if (mobileGroupReorderMode) return;
    setFilter(filter);
  });

  row.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    if (mobileGroupReorderMode) return;
    openGroupContextMenu(group.id, event.clientX, event.clientY);
  });
  row.append(button);
  return row;
}

function renderGroups() {
  const counts = new Map();
  tasks.forEach((task) => {
    if (task.groupId && !task.completed) {
      counts.set(task.groupId, (counts.get(task.groupId) ?? 0) + 1);
    }
  });
  groupCache.begin();
  const nodes = groups.map((group) =>
    groupCache.get(
      group.id,
      JSON.stringify([
        getLanguage(),
        group.name,
        group.color,
        currentFilter === `${GROUP_FILTER_PREFIX}${group.id}`,
        counts.get(group.id) ?? 0,
      ]),
      () => createGroupElement(group, counts),
    ),
  );
  groupCache.end();
  reconcile(groupList, nodes);
  emptyGroupsHint.hidden = groups.length > 0;
  updateGroupListOverflow();
}

function updateGroupListOverflow() {
  const isDesktop = !window.matchMedia(MOBILE_QUERY).matches;
  const hasOverflow = isDesktop && groupList.scrollHeight > groupList.clientHeight;
  const scrollbarWidth = hasOverflow ? groupList.offsetWidth - groupList.clientWidth : 0;
  groupList.style.setProperty("--group-scrollbar-width", `${scrollbarWidth}px`);
  groupList.classList.toggle("has-overflow-gutter", scrollbarWidth > 0);
}

const groupSortable = makeSortable({
  container: groupList,
  itemSelector: ".group-item",
  handleSelector: ".group-filter-button",
  getId: (item) => item.dataset.groupId,
  placeholderClass: "group-item group-placeholder",
  draggingClass: "is-dragging",
  shadow: "0 12px 28px #302b4033",
  isMobileReorderEnabled: () => mobileGroupReorderMode,
  onReorder: (ids) => {
    groups = reorderByIds(groups, ids, (group) => group.id);
    persistGroups();
  },
  onCancel: renderGroups,
  onLongPress: openGroupContextMenu,
  onKeyMove: (id, offset) => {
    const moved = moveById(groups, id, offset, (group) => group.id);
    if (moved === groups) return;
    groups = moved;
    persistGroups();
    renderGroups();
    groupList.querySelector(`[data-group-id="${CSS.escape(id)}"] .group-filter-button`)?.focus();
  },
});

groupForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = groupNameInput.value.trim();
  if (!name) {
    flagInvalidField(groupNameInput);
    groupNameInput.focus();
    return;
  }
  const normalized = name.toLocaleLowerCase();
  if (groups.some((group) => group.id !== editingGroupId && group.name.toLocaleLowerCase() === normalized)) {
    flagInvalidField(groupNameInput);
    groupNameInput.focus();
    return;
  }

  const color = groupForm.querySelector('input[name="groupColor"]:checked')?.value;
  if (!GROUP_COLORS.some((option) => option.value === color)) return;

  const editedGroup = groups.find((group) => group.id === editingGroupId);
  if (editedGroup) {
    editedGroup.name = name;
    editedGroup.color = color;
    persistGroups();
    render();
    groupDialog.close();
    return;
  }

  groups.push({ id: createId(), name, color });
  persistGroups();
  render();
  groupDialog.close();
});

openGroupDialogButton.addEventListener("click", () => {
  if (mobileGroupReorderMode) {
    setMobileGroupReorderMode(false);
    return;
  }
  openGroupDialog();
});
emptyGroupsHint.addEventListener("click", () => openGroupDialog());
$("#close-group-dialog").addEventListener("click", () => groupDialog.close());
groupDialog.addEventListener("close", () => {
  editingGroupId = null;
  window.setTimeout(syncVisualViewport, 60);
});
groupDialog.addEventListener("click", (event) => {
  if (isDialogBackdropClick(event, groupDialog)) groupDialog.close();
});



$$("#planning-list [data-filter]").forEach((button) => {
  button.addEventListener("click", () => setFilter(button.dataset.filter));
});

function setFilter(filter) {
  currentFilter = filter;
  if (searchQuery || mobileSearchExpanded) {
    setSearch("");
    setMobileSearchExpanded(false);
  }
  render();
}




const GENIE_SLICES = 18;
const GENIE_FLIGHT_MS = 620;
const GENIE_STAGGER_MS = 160;


const GENIE_MOBILE_COLUMNS = 28;
const GENIE_MOBILE_FLIGHT_MS = 640;
const GENIE_MOBILE_STAGGER_MS = 300;

const GENIE_HOLD_MS = 0; 
const GENIE_COMMIT_MS = 290; 
const GENIE_ARRIVE_MS = 560; 
const genieBusy = new Set();

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getGenieTarget() {
  if (document.documentElement.classList.contains("is-keyboard-open")) return null;
  const button = planningList.querySelector('[data-filter="completed"]');
  if (!button) return null;
  const anchor = button.querySelector(".nav-icon") || button;
  const rect = anchor.getBoundingClientRect();
  if (!rect.width && !rect.height) return null;
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  if (x < 0 || y < 0 || x > window.innerWidth || y > window.innerHeight) return null;
  return { x, y, button };
}

function pulseGenieTarget(button) {
  if (!button) return;
  button.classList.remove("is-genie-receiving");
  void button.offsetWidth;
  button.classList.add("is-genie-receiving");
  window.setTimeout(() => button.classList.remove("is-genie-receiving"), 700);
}


function playGenieFlight(item, rect, target) {
  const byColumns = window.matchMedia(MOBILE_QUERY).matches;
  const count = byColumns ? GENIE_MOBILE_COLUMNS : GENIE_SLICES;
  const flightMs = byColumns ? GENIE_MOBILE_FLIGHT_MS : GENIE_FLIGHT_MS;
  const staggerMs = byColumns ? GENIE_MOBILE_STAGGER_MS : GENIE_STAGGER_MS;

  const layer = document.createElement("div");
  layer.className = "genie-layer";
  layer.setAttribute("aria-hidden", "true");

  const base = item.cloneNode(true);
  base.classList.add("is-completed", "genie-clone");
  base.classList.remove("is-genie-leaving");
  base.removeAttribute("data-task-id");
  base.style.width = `${rect.width}px`;
  base.style.height = `${rect.height}px`;
  base.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
  base.querySelectorAll("button, input").forEach((el) => {
    el.tabIndex = -1;
  });
  const baseCheck = base.querySelector(".task-check");
  if (baseCheck) {
    baseCheck.checked = true;
    baseCheck.setAttribute("checked", "");
  }

  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const targetIsBelow = target.y > centerY;
  const sliceSize = (byColumns ? rect.width : rect.height) / count;

  
  const maxColumnDistance = byColumns
    ? Math.max(
        1,
        Math.abs(target.x - (rect.left + sliceSize / 2)),
        Math.abs(target.x - (rect.left + rect.width - sliceSize / 2)),
      )
    : 1;

  const animations = [];

  for (let i = 0; i < count; i += 1) {
    const slice = document.createElement("div");
    slice.className = "genie-slice";
    slice.style.left = `${rect.left}px`;
    slice.style.top = `${rect.top}px`;
    slice.style.width = `${rect.width}px`;
    slice.style.height = `${rect.height}px`;

    let dx;
    let dy;
    let order; 
    let mid;

    if (byColumns) {
      
      const clipLeft = i === 0 ? 0 : i * sliceSize - 0.75;
      const clipRight = i === count - 1 ? 0 : Math.max(0, rect.width - (i + 1) * sliceSize - 0.75);
      slice.style.clipPath = `inset(0 ${clipRight}px 0 ${clipLeft}px)`;

      const localCenterX = (i + 0.5) * sliceSize;
      slice.style.transformOrigin = `${localCenterX}px 50%`;

      dx = target.x - (rect.left + localCenterX);
      dy = target.y - centerY;
      order = Math.min(1, Math.abs(dx) / maxColumnDistance);
      mid = null; 
    } else {
      
      const clipTop = i === 0 ? 0 : i * sliceSize - 0.75;
      const clipBottom = i === count - 1 ? 0 : Math.max(0, rect.height - (i + 1) * sliceSize - 0.75);
      slice.style.clipPath = `inset(${clipTop}px 0 ${clipBottom}px 0)`;

      const localCenterY = (i + 0.5) * sliceSize;
      slice.style.transformOrigin = `50% ${localCenterY}px`;

      dx = target.x - centerX;
      dy = target.y - (rect.top + localCenterY);
      order = (targetIsBelow ? count - 1 - i : i) / (count - 1);
      mid = `translate3d(${dx * 0.14}px, ${dy * 0.2}px, 0) scale(0.7, 0.8)`;
    }

    slice.append(i === 0 ? base : base.cloneNode(true));
    layer.append(slice);

    const delay = GENIE_HOLD_MS + order * staggerMs;
    const timing = { duration: flightMs, delay, fill: "both", easing: "linear" };

    const finalTransform = `translate3d(${dx}px, ${dy}px, 0) scale(0.04, 0.04)`;
    const frames = mid
      ? [
          {
            offset: 0,
            transform: "translate3d(0, 0, 0) scale(1, 1)",
            easing: "cubic-bezier(0.3, 0, 0.3, 1)",
          },
          {
            offset: 0.38,
            transform: mid,
            easing: "cubic-bezier(0.55, 0, 0.85, 0.4)",
          },
          { offset: 1, transform: finalTransform },
        ]
      : [
          {
            offset: 0,
            transform: "translate3d(0, 0, 0) scale(1, 1)",
            easing: "cubic-bezier(0.4, 0, 0.75, 0.6)",
          },
          { offset: 1, transform: finalTransform },
        ];

    animations.push(
      slice.animate(frames, timing),
      slice.animate([{ opacity: 1 }, { opacity: 1, offset: 0.86 }, { opacity: 0 }], timing),
    );
  }

  const glow = document.createElement("div");
  glow.className = "genie-glow";
  glow.style.left = `${target.x}px`;
  glow.style.top = `${target.y}px`;
  layer.append(glow);
  animations.push(
    glow.animate(
      [
        { opacity: 0, transform: "translate(-50%, -50%) scale(0.3)" },
        { opacity: 0.8, transform: "translate(-50%, -50%) scale(1)", offset: 0.55 },
        { opacity: 0, transform: "translate(-50%, -50%) scale(1.5)" },
      ],
      { duration: 700, delay: 90, fill: "both", easing: "ease-out" },
    ),
  );

  document.body.append(layer);

  const cleanup = () => layer.remove();
  Promise.allSettled(animations.map((animation) => animation.finished)).then(cleanup);
  window.setTimeout(cleanup, GENIE_HOLD_MS + staggerMs + flightMs + 600);
}


function renderWithFlip() {
  const before = new Map();
  for (const child of taskList.children) {
    before.set(child, child.getBoundingClientRect().top);
  }

  render();

  if (prefersReducedMotion()) return;
  for (const child of taskList.children) {
    if (!before.has(child) || typeof child.animate !== "function") continue;
    const delta = before.get(child) - child.getBoundingClientRect().top;
    if (Math.abs(delta) < 1) continue;
    child.animate(
      [{ transform: `translate3d(0, ${delta}px, 0)` }, { transform: "translate3d(0, 0, 0)" }],
      { duration: 340, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
    );
  }
}

function completeTaskWithGenie(taskId, item) {
  if (genieBusy.has(taskId)) return;

  const commit = (withFlip) => {
    genieBusy.delete(taskId);
    const current = findTask(taskId);
    if (!current || current.completed) {
      render();
      return;
    }
    setTaskCompletion(current, true);
    persistTasks();
    if (withFlip) renderWithFlip();
    else render();
  };

  const target = getGenieTarget();
  const canAnimate =
    Boolean(target) &&
    Boolean(item) &&
    item.isConnected &&
    typeof item.animate === "function" &&
    !prefersReducedMotion();
  const rect = canAnimate ? item.getBoundingClientRect() : null;

  if (!canAnimate || rect.width < 1 || rect.height < 1 || rect.bottom < 0 || rect.top > window.innerHeight) {
    commit(false);
    return;
  }

  genieBusy.add(taskId);
  playGenieFlight(item, rect, target);
  item.classList.add("is-genie-leaving");

  window.setTimeout(() => commit(true), GENIE_COMMIT_MS);
  window.setTimeout(() => pulseGenieTarget(target.button), GENIE_ARRIVE_MS);
}



const SWIPE_START_PX = 12;
const SWIPE_TRIGGER_PX = 76;
const SWIPE_MAX_PX = 116;

function openTaskEditor(task) {
  editingTaskId = task.id;
  taskEditInput.value = task.text;
  taskEditDateInput.value = task.dueDate || "";
  taskEditTimeInput.value = task.dueTime || "";
  updateTaskEditScheduleDisplay();
  renderTaskEditGroupOptions(task.groupId);
  taskEditDialog.showModal();
  window.requestAnimationFrame(() => {
    taskEditGroupList.querySelector(".task-edit-group-chip.is-selected")?.scrollIntoView({
      inline: "center",
      block: "nearest",
    });
  });
  taskEditInput.focus();
  taskEditInput.select();
  syncVisualViewport();
}

function editTaskFromClick(taskId) {
  if (suppressTaskEditClick) {
    suppressTaskEditClick = false;
    return;
  }
  const task = findTask(taskId);
  if (task) openTaskEditor(task);
}

function createCombinedScheduleBadge(task, dateLabel, timeLabel, isOverdue, tokens) {
  const badge = document.createElement("button");
  badge.className = `task-schedule-badge${isOverdue ? " is-overdue" : ""}`;
  badge.type = "button";

  const textWrap = document.createElement("span");
  textWrap.className = "task-schedule-text";

  if (dateLabel && timeLabel) {
    const dateSpan = document.createElement("span");
    appendHighlightedText(dateSpan, dateLabel, tokens);
    const sep = document.createElement("span");
    sep.className = "task-schedule-sep";
    sep.textContent = "·";
    const timeSpan = document.createElement("span");
    appendHighlightedText(timeSpan, timeLabel, tokens);
    textWrap.append(dateSpan, sep, timeSpan);
  } else {
    appendHighlightedText(textWrap, dateLabel || timeLabel, tokens);
  }

  badge.append(textWrap);
  const fullTitle = [
    dateLabel ? `${t("scheduledDate")} ${dateLabel}` : "",
    timeLabel ? `${t("taskTime")}: ${timeLabel}` : "",
  ]
    .filter(Boolean)
    .join(", ");
  badge.title = fullTitle;
  badge.setAttribute("aria-label", `${t("editTask")}: ${task.text}, ${fullTitle}`);
  badge.addEventListener("click", () => editTaskFromClick(task.id));
  return badge;
}

function createTaskMeta(task, tokens) {
  const meta = document.createElement("div");
  meta.className = "task-meta";
  const today = getLocalDateString();
  const isSearching = tokens.length > 0;

  const group = groups.find((item) => item.id === task.groupId);
  if (
    group &&
    currentFilter !== "all" &&
    (isSearching || currentFilter !== `${GROUP_FILTER_PREFIX}${group.id}`)
  ) {
    const tag = document.createElement("button");
    tag.className = "task-group-tag";
    tag.type = "button";
    tag.style.setProperty("--group-color", group.color);
    tag.title = `${t("editTask")}: ${group.name}`;
    tag.setAttribute("aria-label", `${t("editTask")}: ${task.text}, ${t("groupTag")}: ${group.name}`);

    const dot = document.createElement("span");
    dot.className = "task-group-dot";
    dot.setAttribute("aria-hidden", "true");
    const name = document.createElement("span");
    name.className = "task-group-tag-name";
    appendHighlightedText(name, group.name, tokens);

    tag.append(dot, name);
    tag.addEventListener("click", () => editTaskFromClick(task.id));
    meta.append(tag);
  }

  const showDate = Boolean(task.dueDate && (task.dueDate !== today || isSearching));
  const dateLabel = showDate ? formatDate(parseLocalDate(task.dueDate), t("dateLocale"), "numericDate") : "";
  const timeLabel = task.dueTime || "";

  if (dateLabel || timeLabel) {
    const overdue = !task.completed && (isTaskOverdue(task) || Boolean(task.dueDate && task.dueDate < today));
    meta.append(createCombinedScheduleBadge(task, dateLabel, timeLabel, overdue, tokens));
  }

  return meta;
}

function getTaskSignature(task, tokens) {
  const group = groups.find((item) => item.id === task.groupId);
  const isSearching = tokens.length > 0;
  const showGroup =
    group &&
    currentFilter !== "all" &&
    (isSearching || currentFilter !== `${GROUP_FILTER_PREFIX}${group.id}`);
  return JSON.stringify([
    getLanguage(),
    getLocalDateString(),
    task.text,
    task.completed,
    task.favorite,
    task.dueDate,
    task.dueTime,
    isTaskOverdue(task),
    showGroup ? [group.id, group.name, group.color] : null,
    tokens,
  ]);
}

function getTaskElement(task, tokens) {
  return taskCache.get(task.id, getTaskSignature(task, tokens), () => createTaskElement(task, tokens));
}

function createTaskElement(task, tokens) {
  const item = document.createElement("li");
  item.className = `task-item${task.completed ? " is-completed" : ""}`;
  item.dataset.taskId = task.id;

  const swipeTrack = document.createElement("div");
  swipeTrack.className = "task-swipe-track";
  swipeTrack.setAttribute("aria-hidden", "true");
  swipeTrack.innerHTML = `
    <span class="task-swipe-action task-swipe-complete">${ICONS.check}</span>
    <span class="task-swipe-action task-swipe-delete">${ICONS.trash}</span>
  `;

  const surface = document.createElement("div");
  surface.className = "task-card-surface";

  const checkbox = document.createElement("input");
  checkbox.className = "task-check";
  checkbox.type = "checkbox";
  checkbox.checked = task.completed;
  checkbox.setAttribute("aria-label", `${task.completed ? t("markActive") : t("markComplete")}: ${task.text}`);

  const text = document.createElement("button");
  text.className = "task-text";
  text.type = "button";
  appendHighlightedText(text, task.text, tokens);
  text.setAttribute("aria-label", `${t("editTask")}: ${task.text}`);

  const content = document.createElement("div");
  content.className = "task-content";
  content.append(text);
  const meta = createTaskMeta(task, tokens);
  if (meta.childElementCount) content.append(meta);

  const favoriteLabel = task.favorite ? t("unfavoriteTask") : t("favoriteTask");
  const favoriteButton = document.createElement("button");
  favoriteButton.className = `favorite-button${task.favorite ? " is-favorite" : ""}`;
  favoriteButton.type = "button";
  favoriteButton.title = favoriteLabel;
  favoriteButton.setAttribute("aria-label", `${favoriteLabel}: ${task.text}`);
  favoriteButton.setAttribute("aria-pressed", String(task.favorite));
  favoriteButton.innerHTML = ICONS.flag;

  checkbox.addEventListener("change", () => {
    const current = findTask(task.id);
    if (!current) return;

    
    if (checkbox.checked && !current.completed) {
      completeTaskWithGenie(current.id, item);
      return;
    }

    setTaskCompletion(current, checkbox.checked);
    persistTasks();
    render();
  });
  favoriteButton.addEventListener("click", () => {
    const current = findTask(task.id);
    if (!current) return;
    current.favorite = !current.favorite;
    persistTasks();
    render();
  });
  text.addEventListener("click", () => editTaskFromClick(task.id));

  item.addEventListener("pointerdown", (event) => {
    suppressTaskEditClick = false;
    if (event.pointerType !== "touch" || event.button !== 0) return;
    if (event.target.closest(".task-check, .favorite-button")) return;

    const longPress = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      triggered: false,
      timer: null,
    };
    longPress.timer = window.setTimeout(() => {
      if (activeTaskLongPress !== longPress) return;
      longPress.triggered = true;
      activeTaskSwipe = null;
      openTaskContextMenu(task.id, longPress.startX, longPress.startY);
    }, LONG_PRESS_MS);
    activeTaskLongPress = longPress;

    activeTaskSwipe = {
      taskId: task.id,
      item,
      surface,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      dx: 0,
      swiping: false,
      ready: false,
    };
  });

  item.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    openTaskContextMenu(task.id, event.clientX, event.clientY);
  });

  surface.append(checkbox, content, favoriteButton);
  item.append(swipeTrack, surface);
  return item;
}

function resetTaskSwipeStyle(item, surface) {
  item.classList.remove("is-swiping", "swipe-right", "swipe-left", "is-swipe-ready");
  surface.style.transition = "";
  surface.style.transform = "";
}

window.addEventListener("pointermove", (event) => {
  if (activeTaskLongPress && event.pointerId === activeTaskLongPress.pointerId) {
    const { startX, startY, timer } = activeTaskLongPress;
    if (Math.hypot(event.clientX - startX, event.clientY - startY) >= 8) {
      window.clearTimeout(timer);
      activeTaskLongPress = null;
    }
  }

  if (!activeTaskSwipe || event.pointerId !== activeTaskSwipe.pointerId) return;
  const dx = event.clientX - activeTaskSwipe.startX;
  const dy = event.clientY - activeTaskSwipe.startY;

  if (!activeTaskSwipe.swiping) {
    if (Math.abs(dy) > SWIPE_START_PX && Math.abs(dy) > Math.abs(dx)) {
      activeTaskSwipe = null;
      return;
    }
    if (Math.abs(dx) < SWIPE_START_PX || Math.abs(dx) <= Math.abs(dy) * 1.2) {
      return;
    }
    activeTaskSwipe.swiping = true;
    activeTaskSwipe.item.classList.add("is-swiping");
    activeTaskSwipe.surface.style.transition = "none";
    if (activeTaskLongPress) {
      window.clearTimeout(activeTaskLongPress.timer);
      activeTaskLongPress = null;
    }
  }

  activeTaskSwipe.dx = dx;
  const { item, surface } = activeTaskSwipe;
  const clamped = Math.max(-SWIPE_MAX_PX, Math.min(SWIPE_MAX_PX, dx));
  surface.style.transform = `translate3d(${clamped}px, 0, 0)`;

  item.classList.toggle("swipe-right", dx > 0);
  item.classList.toggle("swipe-left", dx < 0);

  const isReady = Math.abs(dx) >= SWIPE_TRIGGER_PX;
  if (isReady !== activeTaskSwipe.ready) {
    activeTaskSwipe.ready = isReady;
    item.classList.toggle("is-swipe-ready", isReady);
    if (isReady) {
      try {
        navigator.vibrate?.(10);
      } catch {
        
      }
    }
  }
});

function finishTaskTouchInteraction(event) {
  if (activeTaskLongPress && event.pointerId === activeTaskLongPress.pointerId) {
    const { triggered, timer } = activeTaskLongPress;
    window.clearTimeout(timer);
    activeTaskLongPress = null;
    if (triggered) {
      suppressTaskEditClick = true;
      window.setTimeout(() => {
        suppressTaskEditClick = false;
      }, 0);
    }
  }

  if (!activeTaskSwipe || event.pointerId !== activeTaskSwipe.pointerId) return;
  const { taskId, item, surface, dx, swiping } = activeTaskSwipe;
  activeTaskSwipe = null;

  if (!swiping) return;

  suppressTaskEditClick = true;
  window.setTimeout(() => {
    suppressTaskEditClick = false;
  }, 60);

  if (event.type === "pointercancel" || Math.abs(dx) < SWIPE_TRIGGER_PX) {
    surface.style.transition = "transform 240ms cubic-bezier(0.22, 1, 0.36, 1)";
    surface.style.transform = "translate3d(0, 0, 0)";
    window.setTimeout(() => resetTaskSwipeStyle(item, surface), 240);
    return;
  }

  const current = findTask(taskId);
  if (!current) {
    resetTaskSwipeStyle(item, surface);
    return;
  }

  if (dx > 0) {
    surface.style.transition = "transform 220ms cubic-bezier(0.22, 1, 0.36, 1)";
    surface.style.transform = "translate3d(0, 0, 0)";
    window.setTimeout(() => {
      resetTaskSwipeStyle(item, surface);
      if (current.completed) {
        setTaskCompletion(current, false);
        persistTasks();
        render();
      } else {
        
        const checkbox = item.querySelector(".task-check");
        if (checkbox) checkbox.checked = true;
        completeTaskWithGenie(taskId, item);
      }
    }, 180);
  } else {
    surface.style.transition = "transform 200ms cubic-bezier(0.22, 1, 0.36, 1)";
    surface.style.transform = "translate3d(-105%, 0, 0)";
    window.setTimeout(() => {
      resetTaskSwipeStyle(item, surface);
      tasks = tasks.filter((tItem) => tItem.id !== taskId);
      persistTasks();
      render();
    }, 190);
  }
}
window.addEventListener("pointerup", finishTaskTouchInteraction);
window.addEventListener("pointercancel", finishTaskTouchInteraction);

function groupBy(entries, keyOf) {
  const map = new Map();
  for (const entry of entries) {
    const key = keyOf(entry);
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(entry);
  }
  return map;
}


function buildBuckets(visibleTasks, effectiveFilter, tokens) {
  const entries = visibleTasks.map((task, index) => ({
    task,
    index,
    item: getTaskElement(task, tokens),
  }));
  const items = (list) => list.map((entry) => entry.item);

  const compareBySchedule = (a, b) =>
    (a.task.dueDate || "9").localeCompare(b.task.dueDate || "9") ||
    (a.task.dueTime || "99").localeCompare(b.task.dueTime || "99") ||
    Number(b.task.favorite) - Number(a.task.favorite) ||
    a.index - b.index;

  if (effectiveFilter === "scheduled") {
    const today = getLocalDateString();
    const overdueEntries = entries.filter((e) => e.task.dueDate < today || isTaskOverdue(e.task));
    const upcomingEntries = entries.filter((e) => e.task.dueDate >= today && !isTaskOverdue(e.task));

    const dateBuckets = [...groupBy(upcomingEntries, (entry) => entry.task.dueDate)]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, list]) => ({
        title: formatDate(parseLocalDate(date), t("dateLocale"), "long"),
        items: items(list.sort(compareBySchedule)),
      }));

    return [
      ...(overdueEntries.length
        ? [{ title: t("sectionOverdue"), kind: "overdue", items: items(overdueEntries.sort(compareBySchedule)) }]
        : []),
      ...dateBuckets,
    ];
  }

  if (effectiveFilter === "today") {
    const overdueToday = entries.filter((e) => isTaskOverdue(e.task));
    const activeToday = entries.filter((e) => !isTaskOverdue(e.task));

    const timeBuckets = [...groupBy(activeToday, (entry) => entry.task.dueTime || "")]
      .sort(([a], [b]) => (a && b ? a.localeCompare(b) : a ? -1 : b ? 1 : 0))
      .map(([time, list]) => ({ title: time || t("noTime"), items: items(list) }));

    return [
      ...(overdueToday.length
        ? [{ title: t("sectionOverdue"), kind: "overdue", items: items(overdueToday.sort(compareBySchedule)) }]
        : []),
      ...timeBuckets,
    ];
  }

  if (effectiveFilter === "all") {
    const byGroup = groupBy(entries, (entry) =>
      groups.some((group) => group.id === entry.task.groupId) ? entry.task.groupId : null,
    );
    return [
      ...(byGroup.has(null)
        ? [{ title: t("general"), items: items(byGroup.get(null).sort(compareBySchedule)) }]
        : []),
      ...groups
        .filter((group) => byGroup.has(group.id))
        .map((group) => ({
          title: group.name,
          color: group.color,
          items: items(byGroup.get(group.id).sort(compareBySchedule)),
        })),
    ];
  }

  if (
    effectiveFilter === "favorites" ||
    effectiveFilter.startsWith(GROUP_FILTER_PREFIX)
  ) {
    const today = getLocalDateString();
    const open = entries.filter((entry) => !entry.task.completed);
    const sections = [
      { title: t("sectionOverdue"), kind: "overdue", list: open.filter((e) => isTaskOverdue(e.task)) },
      { title: t("filterToday"), list: open.filter((e) => e.task.dueDate === today && !isTaskOverdue(e.task)) },
      { title: t("sectionUpcoming"), list: open.filter((e) => e.task.dueDate && e.task.dueDate > today) },
      { title: t("sectionNoDate"), list: open.filter((e) => !e.task.dueDate) },
    ];

    return sections
      .filter((section) => section.list.length)
      .map(({ title, kind, list }) => ({ title, kind, items: items(list.sort(compareBySchedule)) }));
  }

  if (effectiveFilter === "completed") {
    const today = getLocalDateString();
    const yesterday = addDays(today, -1);
    return [...groupBy(entries, (entry) => entry.task.completedAt || null)]
      .sort(([dateA], [dateB]) => {
        if (dateA === null) return dateB === null ? 0 : 1;
        if (dateB === null) return -1;
        return dateB.localeCompare(dateA);
      })
      .map(([date, list]) => {
        let title = t("completedDateUnknown");
        if (date === today) title = t("completedToday");
        else if (date === yesterday) title = t("completedYesterday");
        else if (date) title = formatDate(parseLocalDate(date), t("dateLocale"), "long");
        return { title, items: items(list) };
      });
  }

  return [{ title: "", items: items(entries) }];
}

function createSectionHeading(bucket, withClearButton) {
  const section = document.createElement("li");
  section.className = "task-section-heading";

  if (bucket.title) {
    const heading = document.createElement("h3");
    heading.className = `task-group-heading${bucket.kind ? ` is-${bucket.kind}` : ""}`;
    if (bucket.color) heading.style.setProperty("--group-color", bucket.color);
    heading.textContent = bucket.title;
    section.append(heading);
  }

  if (withClearButton) {
    const button = document.createElement("button");
    button.className = "clear-button";
    button.type = "button";
    button.innerHTML = `${ICONS.trash}<span class="clear-label"></span>`;
    button.querySelector(".clear-label").textContent = t("clearCompleted");
    button.addEventListener("click", requestClearCompletedTasks);
    section.append(button);
  }
  return section;
}

function renderTaskSections(visibleTasks, effectiveFilter, tokens) {
  return buildBuckets(visibleTasks, effectiveFilter, tokens).flatMap((bucket, index) => {
    const withClear = tokens.length === 0 && effectiveFilter === "completed" && index === 0;
    const heading = headingCache.get(
      `${effectiveFilter}|${bucket.kind ?? ""}|${bucket.title}|${bucket.color ?? ""}`,
      JSON.stringify([getLanguage(), bucket.items.length, bucket.color, withClear]),
      () => createSectionHeading(bucket, withClear),
    );
    return [heading, ...bucket.items];
  });
}


function matchesFilter(task, filter, today) {
  const groupId = getGroupFilterId(filter);
  if (groupId) return !task.completed && task.groupId === groupId;
  if (filter === "today") return !task.completed && task.dueDate === today;
  if (filter === "scheduled") return !task.completed && Boolean(task.dueDate);
  if (filter === "favorites") return !task.completed && task.favorite;
  if (filter === "completed") return task.completed;
  return true;
}

function render() {
  renderPending = false;
  const today = getLocalDateString();

  const selectedGroupId = getGroupFilterId(currentFilter);
  const selectedGroup = selectedGroupId ? groups.find((group) => group.id === selectedGroupId) : null;
  if (selectedGroupId && !selectedGroup) currentFilter = "all";

  const activeTasks = tasks.filter((task) => !task.completed);
  const completedCount = tasks.length - activeTasks.length;

  
  const countByFilter = {
    all: activeTasks.length,
    today: activeTasks.filter((task) => task.dueDate === today).length,
    scheduled: activeTasks.filter((task) => task.dueDate).length,
    favorites: activeTasks.filter((task) => task.favorite).length,
    completed: completedCount,
  };

  const tokens = getSearchTokens(searchQuery);
  const isSearching = tokens.length > 0;
  document.documentElement.classList.toggle("is-searching", isSearching);
  const effectiveFilter = isSearching ? "all" : currentFilter;

  const visibleTasks = tasks.filter(
    (task) =>
      matchesFilter(task, effectiveFilter, today) &&
      (isSearching || currentFilter !== "all" || !task.completed) &&
      matchesSearchQuery(task, tokens),
  );

  planningList.querySelectorAll("[data-filter]").forEach((button) => {
    const isActive = button.dataset.filter === currentFilter;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
  updatePlanningGlider();

  $$("[data-count]").forEach((count) => {
    count.textContent = countByFilter[count.dataset.count];
  });

  
  const headingCountValue =
    !isSearching && currentFilter === "all" ? activeTasks.length : visibleTasks.length;

  $(".tasks-title").textContent = isSearching
    ? t("searchLabel")
    : (selectedGroup?.name ?? t(FILTER_TITLE_KEYS[currentFilter] ?? "filterAll"));
  $("#heading-count").textContent = headingCountValue;

  renderGroups();
  taskCache.begin();
  headingCache.begin();
  reconcile(taskList, renderTaskSections(visibleTasks, effectiveFilter, tokens));
  taskCache.end();
  headingCache.end();

  const hasVisibleTasks = visibleTasks.length > 0;
  taskList.hidden = !hasVisibleTasks;
  emptyState.hidden = hasVisibleTasks;
  const noCompleted = !isSearching && currentFilter === "completed" && completedCount === 0 && tasks.length > 0;
  const emptyKey = isSearching ? "noResults" : noCompleted ? "noCompleted" : "empty";
  $("#empty-title").textContent = t(`${emptyKey}Title`);
  $("#empty-copy").textContent = t(`${emptyKey}Copy`);
}



function requestClearCompletedTasks() {
  if (currentFilter === "all" || searchQuery.trim()) return;
  if (!tasks.some((task) => task.completed)) return;
  openConfirmDialog({
    title: t("confirmClearTitle"),
    copy: t("confirmClearCopy"),
    submitLabel: t("clearCompleted"),
    onConfirm: () => {
      tasks = tasks.filter((task) => !task.completed);
      persistTasks();
      render();
    },
  });
}



function updateSearchClearVisibility() {
  const isMobile = window.matchMedia(MOBILE_QUERY).matches;
  searchClear.hidden = !(searchQuery || (isMobile && mobileSearchExpanded));
  if (desktopSearchClear) desktopSearchClear.hidden = !searchQuery;
}

function setMobileSearchExpanded(expanded, { focus = false } = {}) {
  mobileSearchExpanded = Boolean(expanded);
  sectionHeading.classList.toggle("is-search-open", mobileSearchExpanded);
  searchToggle.setAttribute("aria-expanded", String(mobileSearchExpanded));
  updateSearchClearVisibility();

  if (mobileSearchExpanded) {
    setMobileGroupReorderMode(false);
    closeMobilePrefsPopover();
    if (focus) {
      window.requestAnimationFrame(() => {
        searchInput.focus();
      });
    }
  }
}

function setSearch(value) {
  searchQuery = value;
  searchInput.value = value;
  if (desktopSearchInput) desktopSearchInput.value = value;
  updateSearchClearVisibility();
}

searchToggle.addEventListener("click", () => {
  if (!window.matchMedia(MOBILE_QUERY).matches) {
    searchInput.focus();
    return;
  }
  if (!mobileSearchExpanded) {
    setMobileSearchExpanded(true, { focus: true });
  } else {
    searchInput.focus();
  }
});

searchInput.addEventListener("focus", () => {
  if (window.matchMedia(MOBILE_QUERY).matches && !mobileSearchExpanded) {
    setMobileSearchExpanded(true);
  }
});

searchInput.addEventListener("blur", () => {
  window.setTimeout(() => {
    if (
      window.matchMedia(MOBILE_QUERY).matches &&
      mobileSearchExpanded &&
      !searchQuery.trim() &&
      !searchBox.contains(document.activeElement)
    ) {
      setMobileSearchExpanded(false);
    }
  }, 140);
});

[searchInput, desktopSearchInput].filter(Boolean).forEach((input) => {
  input.addEventListener("input", () => {
    searchQuery = input.value;
    [searchInput, desktopSearchInput].filter(Boolean).forEach((field) => {
      if (field !== input) field.value = searchQuery;
    });
    updateSearchClearVisibility();
    render();
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      input.blur();
      return;
    }
    if (event.key !== "Escape") return;
    event.preventDefault();
    if (searchQuery) {
      setSearch("");
      render();
    }
    if (window.matchMedia(MOBILE_QUERY).matches) {
      setMobileSearchExpanded(false);
      input.blur();
    } else if (!searchQuery) {
      input.blur();
    }
  });
});

[searchClear, desktopSearchClear].filter(Boolean).forEach((button) => {
  button.addEventListener("click", () => {
    const isMobile = window.matchMedia(MOBILE_QUERY).matches;
    if (searchQuery) {
      setSearch("");
      render();
      if (isMobile) {
        setMobileSearchExpanded(false);
        searchInput.blur();
      } else {
        const focusTarget = desktopSearchInput || searchInput;
        focusTarget?.focus();
      }
    } else if (isMobile && mobileSearchExpanded) {
      setMobileSearchExpanded(false);
      searchInput.blur();
    }
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "/" || event.ctrlKey || event.metaKey || event.altKey) return;
  const target = event.target;
  if (["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) || target.isContentEditable) return;
  event.preventDefault();
  if (window.matchMedia(MOBILE_QUERY).matches) {
    setMobileSearchExpanded(true, { focus: true });
  } else {
    const focusTarget = desktopSearchInput || searchInput;
    focusTarget.focus();
    focusTarget.select();
  }
});



taskDateControl.addEventListener("click", (event) => {
  event.stopPropagation();
  openCustomPicker({
    mode: "date",
    input: taskDateInput,
    trigger: taskDateControl,
    onUpdate: updateTaskScheduleDisplay,
  });
});

taskTimeControl.addEventListener("click", (event) => {
  event.stopPropagation();
  openCustomPicker({
    mode: "time",
    input: taskTimeInput,
    trigger: taskTimeControl,
    onUpdate: updateTaskScheduleDisplay,
  });
});

taskEditDateTrigger.addEventListener("click", (event) => {
  event.stopPropagation();
  openCustomPicker({
    mode: "date",
    input: taskEditDateInput,
    trigger: taskEditDateTrigger,
    onUpdate: updateTaskEditScheduleDisplay,
  });
});

taskEditTimeTrigger.addEventListener("click", (event) => {
  event.stopPropagation();
  openCustomPicker({
    mode: "time",
    input: taskEditTimeInput,
    trigger: taskEditTimeTrigger,
    onUpdate: updateTaskEditScheduleDisplay,
  });
});

clearTaskScheduleButton.addEventListener("click", () => {
  taskForm.reset();
  taskDateInput.value = "";
  taskTimeInput.value = "";
  updateTaskScheduleDisplay();
  taskInput.focus();
});

for (const input of [taskInput, taskDateInput, taskTimeInput]) {
  input.addEventListener("input", updateTaskScheduleDisplay);
  input.addEventListener("change", updateTaskScheduleDisplay);
}

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = taskInput.value.trim();
  if (!text) {
    flagInvalidField(taskInput);
    taskInput.focus();
    return;
  }

  const today = getLocalDateString();
  const dueDate = taskDateInput.value || (currentFilter === "today" ? today : null);
  if (currentFilter === "scheduled" && !dueDate) {
    openCustomPicker({
      mode: "date",
      input: taskDateInput,
      trigger: taskDateControl,
      onUpdate: updateTaskScheduleDisplay,
    });
    return;
  }
  const time = taskTimeInput.value || null;

  setSearch("");
  setMobileSearchExpanded(false);
  const newTask = {
    id: createId(),
    text,
    completed: false,
    completedAt: null,
    favorite: currentFilter === "favorites",
    dueDate: dueDate || (time ? today : null),
    dueTime: time,
    groupId: getGroupFilterId(currentFilter),
  };
  tasks.unshift(newTask);
  persistTasks();
  if (currentFilter === "completed") setFilter("all");
  else render();
  taskForm.reset();
  taskDateInput.value = "";
  taskTimeInput.value = "";
  updateTaskScheduleDisplay();

  if (window.matchMedia(MOBILE_QUERY).matches) {
    setMobileComposerOpen(false);
  } else {
    taskInput.focus();
  }
});



taskEditForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = taskEditInput.value.trim();
  if (!text) {
    flagInvalidField(taskEditInput);
    taskEditInput.focus();
    return;
  }

  const task = tasks.find((item) => item.id === editingTaskId);
  if (!task) {
    taskEditDialog.close();
    return;
  }

  const previous = {
    text: task.text,
    dueDate: task.dueDate,
    dueTime: task.dueTime,
    groupId: task.groupId,
  };
  const time = taskEditTimeInput.value || null;
  const dueDate = taskEditDateInput.value || (time ? getLocalDateString() : null);
  const nextGroupId =
    taskEditGroupInput.value && groups.some((g) => g.id === taskEditGroupInput.value)
      ? taskEditGroupInput.value
      : null;

  Object.assign(task, {
    text,
    dueDate,
    dueTime: dueDate ? time : null,
    groupId: nextGroupId,
  });
  if (!persistTasks()) {
    Object.assign(task, previous);
    return;
  }

  taskEditDialog.close();
  render();
});

$("#close-task-edit-dialog").addEventListener("click", () => taskEditDialog.close());
$("#cancel-task-edit").addEventListener("click", () => taskEditDialog.close());
taskEditDialog.addEventListener("close", () => {
  editingTaskId = null;
  closeCustomPicker({ restoreFocus: false });
  window.setTimeout(syncVisualViewport, 60);
});
taskEditDialog.addEventListener("click", (event) => {
  if (isDialogBackdropClick(event, taskEditDialog)) taskEditDialog.close();
});



function changeLanguage(nextLang) {
  setLanguage(nextLang);
  savePreference(STORAGE_KEYS.language, getLanguage());
  applyLanguage();
}

function toggleTheme() {
  setTheme(theme === "light" ? "dark" : "light");
}

themeToggle.addEventListener("click", toggleTheme);

sidebarToggle.addEventListener("click", () => {
  sidebarCollapsed = !sidebarCollapsed;
  savePreference(STORAGE_KEYS.sidebar, sidebarCollapsed ? "collapsed" : "expanded");
  applySidebar();
});

$(".brand").addEventListener("click", (event) => {
  event.preventDefault();
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
});



function isBusy() {
  return (
    document.hidden ||
    groupSortable.isDragging() ||
    mobileGroupReorderMode ||
    Boolean(activeTaskLongPress) ||
    Boolean(activeTaskSwipe?.swiping) ||
    Boolean(activePicker) ||
    taskEditDialog.open ||
    groupDialog.open ||
    confirmClearDialog.open ||
    !groupContextMenu.hidden ||
    !taskContextMenu.hidden
  );
}

let lastMinuteKey = `${getLocalDateString()} ${getNowTimeString()}`;
function tick() {
  const key = `${getLocalDateString()} ${getNowTimeString()}`;
  if (key !== lastMinuteKey) {
    lastMinuteKey = key;
    renderPending = true;
  }
  if (renderPending && !isBusy()) render();
}
window.setInterval(tick, 10000);
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) tick();
});

const SYNCED_KEYS = [STORAGE_KEYS.tasks, STORAGE_KEYS.groups];
window.addEventListener("storage", (event) => {
  if (event.key !== null && !SYNCED_KEYS.includes(event.key)) return;
  groups = loadGroups().items;
  tasks = loadTasks(groups).items;
  if (isBusy()) {
    renderPending = true;
    return;
  }
  applySidebar();
  render();
});



syncGroupsPlacement();
syncVisualViewport();
applyLanguage();