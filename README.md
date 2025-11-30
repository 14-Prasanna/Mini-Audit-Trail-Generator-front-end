# Mini Audit Trail Generator - Folder Structure

## Project Structure

```
project/
│
├── public/                     # Static assets
│
├── src/
│   ├── components/            # React components
|   |   |__ Dashboard.tsx     #Basic Dashboard panel    
│   │   ├── Sidebar.tsx       # Left navigation panel with menu items
│   │   ├── Header.tsx        # Top header with page title and timestamp
│   │   ├── EditorScreen.tsx  # Content editor with save functionality
│   │   ├── VersionHistoryScreen.tsx  # Version history with expandable cards
│   │   └── SettingsScreen.tsx        # Settings panel with theme toggle
│   │
│   ├── data/
│   │   └── mockData.ts       # Mock version data for demonstration
│   │
│   ├── App.tsx               # Main application component with routing logic
│   ├── main.tsx              # Application entry point
│   ├── index.css             # Global styles (Tailwind directives)
│   └── vite-env.d.ts         # Vite TypeScript declarations
│
├── index.html                # HTML entry point
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── vite.config.ts            # Vite configuration
└── eslint.config.js          # ESLint configuration
```

## Component Hierarchy

```
App
├── ThemeProvider
│   ├── Sidebar (Navigation)
│   │   └── Menu Items (Dashboard, Editor, History, Settings)
│   │
│   ├── Header (Page Title & Timestamp)
│   │
│   └── Main Content Area (Dynamic)
│       ├── EditorScreen (Create/Edit Content)
│       ├── VersionHistoryScreen (View All Versions)
│       └── SettingsScreen (App Configuration)
│
└── Toaster (Notifications)
```

## Installation Commands (Windows)

### Prerequisites
- Node.js (v18 or higher)
- npm (comes with Node.js)

### Step 1: Install Dependencies
```cmd
npm install
```

### Step 2: Start Development Server
```cmd
npm run dev
```

### Step 3: Build for Production
```cmd
npm run build
```

### Step 4: Preview Production Build
```cmd
npm run preview
```

### Additional Commands
```cmd
# Type checking
npm run typecheck

# Linting
npm run lint
```


### Backend (/backend)

```Overview

Built with Node.js + Express and MongoDB

Tracks multiple versions of a task using a doubly linked list

Computes word differences (added, removed, changed) and generates a smart summary
```

### Doubly Linked List Concept

**Each version is a node in a linked list**

**prev → previous version number (null for first)**

**next → next version number (null for latest)**

Allows efficient traversal, version insertion, and history management
```
Version 1 <-> Version 2 <-> Version 3


backend/
├── server.js              # Main server with API routes
├── package.json
├── .env                   # MongoDB URI, port
└── node_modules/



```
## Key Dependencies

```
- **React 18.3.1** - UI library
- **TypeScript 5.5.3** - Type safety
- **Vite 5.4.2** - Build tool
- **Material UI (@mui/material)** - UI component library
- **Emotion** - CSS-in-JS styling for Material UI
- **Lucide React** - Icon library
- **React Hot Toast** - Toast notifications

```

## Features

### 1. Content Editor
- Title and content input fields
- Real-time word counter
- Save version functionality
- Success notifications

### 2. Version History
- Expandable version cards
- Word delta tracking (additions/removals)
- Added/removed word chips
- Full content preview
- Timestamp tracking

### 3. Settings
- Dark/Light mode toggle
- Clear all versions option
- About section

### 4. Responsive Design
- Mobile-first approach
- Collapsible sidebar on small screens
- Adaptive layouts for all screen sizes

## Design Philosophy

Inspired by enterprise monitoring tools like Datadog, featuring:
- Clean, professional interface
- Intuitive navigation
- Clear visual hierarchy
- Smooth transitions and animations
- Comprehensive data visualization
