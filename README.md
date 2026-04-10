# Panels — Project Board App

A modern, drag-and-drop task management board built with React 18, TypeScript, and Tailwind CSS v4.

---

## Features

- **Kanban Board** — Drag and drop tasks between columns using `react-beautiful-dnd`
- **Smart Completion** — Checking a task moves it to the Done column; unchecking restores it to its original column. Dragging a task into Done auto-checks it.
- **Task Detail Panel** — Click any card to open a slide-over sidebar with editable title, description, priority selector (Low / Medium / High), and tag management
- **Tag Management** — Add and remove colour-coded tags from the detail panel; tags appear on cards with ellipsis if too long
- **Column Management** — Add custom columns; click a column to select it and reveal a delete button
- **Filter Bar** — Filter tasks by All / Pending / Completed. Filters also block adding tasks to incompatible columns (e.g. can't add to Done when Pending filter is active)
- **Toast + Undo** — Deleting a task shows a toast notification with a 5-second Undo window to restore it
- **Dark Mode** — Full dark mode support toggled from the navbar, persisted to `localStorage`
- **Persistent State** — All tasks, columns, and preferences are saved to `localStorage`

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 18 + TypeScript |
| Styling | Tailwind CSS v4 |
| Drag & Drop | react-beautiful-dnd |
| State | React Context + useReducer-style callbacks |
| Persistence | localStorage via custom `useLocalStorage` hook |
| Icons | Lucide React |
| Build Tool | Vite |

---

## Getting Started

```bash
git clone https://github.com/varun-s20/Panels-limetray.git
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Project Structure

```
src/
├── components/
│   ├── Board/          # DragDropContext, column layout
│   ├── Column/         # Column header, droppable area, selection
│   ├── TaskCard/       # Draggable card with title, tags, description
│   ├── TaskDetailPanel/# Slide-over sidebar for editing task details
│   ├── FilterBar/      # All / Pending / Completed filter chips
│   ├── NavBar/         # Top bar with theme toggle
│   ├── AddTaskInput/   # Inline task creation input
│   └── Toast/          # Deletion notification with Undo
├── context/
│   └── TaskContext.tsx # Global state: tasks, columns, toast, filters
├── hooks/
│   └── useLocalStorage.ts
├── types/
│   └── index.ts
└── styles/
    └── global.css      # CSS variables, dark mode tokens, animations
```

---

## Live Demo

GitHub Repository: [Panels](https://panels-limetray.netlify.app)
