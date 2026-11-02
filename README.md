# SoftPlans

**A calm, responsive to-do app for planning the work and life in front of you.**

SoftPlans is a lightweight task manager built with semantic HTML, modern CSS, and vanilla JavaScript modules. Organize tasks into color-coded groups, plan work by date and time, and keep task and group changes in sync between browser tabs on the same site.

![SoftPlans desktop overview](./screenshots/desktop-overview.png)

> **Ready to explore:** on a new browser profile, SoftPlans creates a realistic English-language demo workspace automatically. It includes 4 groups, 10 active tasks, and 3 completed tasks so the interface is populated from the first visit.

## Features

- **A useful overview:** see active tasks grouped by their custom group.
- **Focused filters:** switch between All, Today, Scheduled, Important, and Completed.
- **Flexible planning:** assign a due date, a time, or both with the custom calendar and time picker.
- **Color-coded groups:** create, rename, delete, drag to reorder, and filter by groups.
- **Quick task actions:** complete, restore, flag, edit, or delete tasks. On touch screens, swipe right to complete and swipe left to delete.
- **Search:** find tasks by text; use `/` to focus search on a keyboard.
- **Light and dark themes:** choose the appearance that suits your workspace.
- **Responsive layouts:** desktop sidebar and mobile navigation, a horizontally scrollable group strip, and a floating task composer.
- **Three interface languages:** English, Ukrainian, and Russian. English is selected by default.
- **Local persistence:** tasks, groups, language, theme, and sidebar preference are saved in browser storage. Task and group changes in another tab are synchronized through the browser's storage event.
- **Installable web app metadata:** includes a web app manifest and app icon.

## Screenshots

The gallery below shows the real interface in desktop and mobile layouts, across task filters, themes, and dialogs.

### Desktop

<details open>
<summary><strong>All tasks — grouped overview</strong></summary>
<p><img src="./screenshots/desktop-overview.png" alt="Desktop overview showing tasks in Product, Design, Personal, and Learning groups" width="100%"></p>
</details>

<details>
<summary><strong>Today — tasks due today</strong></summary>
<p><img src="./screenshots/desktop-today.png" alt="Desktop Today filter with tasks grouped by time" width="100%"></p>
</details>

<details>
<summary><strong>Scheduled — overdue and upcoming work</strong></summary>
<p><img src="./screenshots/desktop-scheduled.png" alt="Desktop Scheduled filter with overdue and date-based sections" width="100%"></p>
</details>

<details>
<summary><strong>Important — flagged tasks</strong></summary>
<p><img src="./screenshots/desktop-important.png" alt="Desktop Important filter showing flagged tasks by due date" width="100%"></p>
</details>

<details>
<summary><strong>Completed — completion history</strong></summary>
<p><img src="./screenshots/desktop-completed.png" alt="Desktop Completed filter with tasks grouped by completion date" width="100%"></p>
</details>

<details>
<summary><strong>Design — a custom group</strong></summary>
<p><img src="./screenshots/desktop-design-group.png" alt="Desktop view filtered to the Design group" width="100%"></p>
</details>

<details>
<summary><strong>Dark theme</strong></summary>
<p><img src="./screenshots/desktop-dark.png" alt="SoftPlans desktop interface in dark theme" width="100%"></p>
</details>

<details>
<summary><strong>Edit a task</strong></summary>
<p><img src="./screenshots/desktop-task-editor.png" alt="Task editor with name, date, time, and group controls" width="100%"></p>
</details>

<details>
<summary><strong>Choose a date</strong></summary>
<p><img src="./screenshots/desktop-date-picker.png" alt="Custom date picker with quick date presets and a monthly calendar" width="100%"></p>
</details>

### Mobile

<details open>
<summary><strong>All tasks — mobile overview</strong></summary>
<p><img src="./screenshots/mobile-overview.png" alt="Mobile overview with the group carousel, task cards, floating add button, and bottom navigation" width="390"></p>
</details>

<details>
<summary><strong>Browse the group carousel</strong></summary>
<p><img src="./screenshots/mobile-scrolled.png" alt="Mobile group carousel scrolled to show later groups" width="390"></p>
</details>

<details>
<summary><strong>Completed tasks on mobile</strong></summary>
<p><img src="./screenshots/mobile-completed.png" alt="Mobile Completed view with completion dates and the clear-completed action" width="390"></p>
</details>

<details>
<summary><strong>Language and appearance settings</strong></summary>
<p><img src="./screenshots/mobile-settings.png" alt="Mobile preferences popover with language and light or dark theme controls" width="390"></p>
</details>

<details>
<summary><strong>Dark theme settings</strong></summary>
<p><img src="./screenshots/mobile-dark-settings.png" alt="Mobile preferences popover in the dark theme" width="390"></p>
</details>

<details>
<summary><strong>Add a task</strong></summary>
<p><img src="./screenshots/mobile-task-composer.png" alt="Mobile task composer opened above the bottom navigation" width="390"></p>
</details>

<details>
<summary><strong>Schedule from a phone</strong></summary>
<p><img src="./screenshots/mobile-date-picker.png" alt="Mobile date picker opened from the task composer" width="390"></p>
</details>

## Get started

SoftPlans is a static web app built with vanilla JavaScript modules. It has no project dependencies, build step, account, or backend to configure. You need Node.js and npm to run the local server below.

1. Clone or download this repository.
2. From the project directory, start a local HTTP server with `npx`:

   ```bash
   npx --yes serve . --listen 8000
   ```

3. Open [http://localhost:8000](http://localhost:8000) in a modern browser.

`npx` downloads the small `serve` utility if it is not already cached. Serving the project over HTTP is required because the app uses JavaScript modules and browser storage.

### Deploy to GitHub Pages

The project is ready for static hosting. In your repository's **Settings → Pages**, select the branch and repository root as the source. No build command or output directory is required.

## Demo workspace and your data

When both task and group storage keys are absent, the first app launch seeds the browser with sample content:

| Group | Example tasks |
| --- | --- |
| **Product** | Launch brief, onboarding review, release notes, sprint ideas |
| **Design** | Empty-state illustrations, updated mobile screens |
| **Personal** | Groceries, weekend dinner |
| **Learning** | Reading |

The sample also includes an overdue important task and three completed tasks. Dates are generated relative to the day the sample is created, so the Today and Completed views are immediately useful. The sample is created only for a new workspace; existing tasks and groups are never replaced.

Tasks and groups are stored in `localStorage` for the current browser and site origin. They are not uploaded to a server and do not automatically sync between different devices or browsers. Language, theme, and sidebar preferences are stored locally as well.

To restore the initial demo workspace, first back up anything you want to keep, then open the browser developer console on the app's origin and run:

```js
localStorage.removeItem("softplans.tasks.v1");
localStorage.removeItem("softplans.groups.v1");
location.reload();
```

This removes the current tasks and groups for this site and creates a fresh sample on reload. It does not reset language, theme, or other browser data.

## How to use

### Tasks

- Use the task composer to add an item. On desktop it is visible above the list; on mobile, tap the **+** button.
- Add a date, time, or both before saving. The date picker includes quick presets for today, tomorrow, a week, and a month.
- Select a task's text to edit its name, schedule, and group.
- Use the checkbox to complete or restore a task. Completed items are collected in **Completed**, grouped by completion date.
- Use the flag on a task card to add or remove it from **Important**.
- On a touch screen, swipe right to complete a task or swipe left to delete it.
- On desktop, right-click a task to open its edit and delete actions. On touch screens, long-press a task to open its actions.

### Groups

- Create groups with the **+** button beside **My Groups**.
- Choose a color to make groups easier to scan.
- Select a group to focus on its tasks. In the All view, active tasks are arranged under their group headings.
- On desktop, drag groups to change their order; right-click a group to edit or delete it.
- On mobile, scroll the group strip horizontally. Long-press a group for its actions; the reorder action enables touch reordering.

### Filters and search

| Filter | Shows |
| --- | --- |
| **All** | Active tasks arranged by group |
| **Today** | Active tasks due today, grouped by time |
| **Scheduled** | Active tasks with a due date, organized by overdue status and date |
| **Important** | Active tasks marked with a flag, grouped by due date |
| **Completed** | Completed tasks grouped by completion date |

Search checks task text and highlights matches. Press `/` to focus search on a keyboard; press `Escape` to clear or close the search.

## Project structure

```text
.
├── index.html          # App shell, controls, dialogs, and metadata
├── styles.css          # Responsive layouts, themes, and components
├── manifest.json       # Installable web app metadata
├── icon.svg            # App icon
├── screenshots/        # README desktop and mobile screenshots
└── js/
    ├── config.js       # Storage keys, languages, and shared constants
    ├── dates.js        # Local date and time helpers
    ├── demo-data.js    # First-run sample workspace
    ├── i18n.js         # English, Ukrainian, and Russian translations
    ├── main.js         # Application state, rendering, and interactions
    ├── sortable.js     # Group reordering behavior
    └── storage.js      # Browser persistence and input validation
```

## Browser and privacy notes

- Use a modern browser with support for ES modules, `localStorage`, and the HTML dialog element.
- If browser storage is disabled or unavailable, saved work cannot persist between visits.
- Google Fonts are requested for the DM Sans and Manrope typefaces; system sans-serif fallbacks are used if those fonts cannot be loaded.
- SoftPlans has no sign-in, analytics, server API, or cloud backup.

## License

No license file is currently included in this repository.
