# Task Management Board

A modern, interactive task management application built with React, TypeScript, and Vite. Features drag-and-drop functionality, inline editing, and a clean, responsive UI.

## Features

- **CRUD Operations**: Create, read, update, and delete tasks
- **Drag & Drop**: Move tasks between status columns (TODO, DOING, DONE)
- **Inline Editing**: Edit task descriptions directly by clicking on them
- **Assignee Management**: Assign tasks to team members with visual avatars
- **Real-time Updates**: Optimistic UI updates with TanStack Query
- **Error Handling**: Comprehensive error handling for API failures
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe code
- **Vite** - Fast development server and build tool
- **TanStack Query** - Server state management
- **React Context API** - Client state management for drag-and-drop
- **CSS3** - Custom styling with animations

## Project Structure

```
src/
├── components/          # React components
│   ├── AssigneeSelector.tsx
│   ├── CreateTaskCard.tsx
│   ├── TaskBoard.tsx
│   ├── TaskCard.tsx
│   └── TaskColumn.tsx
├── context/            # React Context providers
│   └── DragContext.tsx
├── hooks/              # Custom React hooks
│   └── useTasks.ts
├── services/           # API layer
│   └── api.ts
├── types/              # TypeScript type definitions
│   └── task.ts
├── App.tsx            # Main application component
├── main.tsx           # Application entry point
└── index.css          # Global styles
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:
   ```bash
   cd task-manager
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Usage

### Creating a Task

1. Enter a task description in the "Task Description" field
2. Select an assignee from the dropdown
3. Choose a status (TODO, DOING, or DONE)
4. Click "Add Task"

### Editing a Task

- **Description**: Click on the task description to edit it inline
- **Assignee**: Click on the assignee dropdown within the task card to change
- **Status**: Drag and drop the task card to a different column

### Deleting a Task

Click the × button in the top-right corner of any task card

### Drag and Drop

1. Click and hold on any task card
2. Drag it to the desired column (TODO, DOING, or DONE)
3. Release to drop

## Component Hierarchy

```
App
└── QueryClientProvider
    └── DragProvider
        └── TaskBoard
            ├── CreateTaskCard
            │   └── AssigneeSelector
            └── TaskColumn (×3)
                └── TaskCard (×N)
                    └── AssigneeSelector
```

## API Layer

The application uses a mock API service (`src/services/api.ts`) that simulates async operations with:

- Configurable delay (300ms)
- Random error simulation (5% chance)
- In-memory data storage
- Proper error handling

In a production environment, replace the mock API calls with real backend endpoints.

## State Management

- **Server State**: Managed by TanStack Query for caching, synchronization, and optimistic updates
- **Client State**: React Context API for drag-and-drop state

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

- Persist data to a backend API
- Add task priorities and due dates
- Implement search and filtering
- Add user authentication
- Task comments and attachments
- Dark mode support

## License

MIT
