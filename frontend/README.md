# Task Management Board - Frontend

A modern, interactive task management application built with React, TypeScript, and Vite. Features drag-and-drop functionality, inline editing, user assignment, and a clean, responsive UI. This frontend connects to a FastAPI backend.

## Features

- **CRUD Operations**: Create, read, update, and delete tasks
- **Drag & Drop**: Move tasks between status columns (TODO, DOING, DONE)
- **Inline Editing**: Edit task descriptions directly by clicking on them
- **User Assignment**: Assign tasks to users with a dropdown selector
- **Real-time Updates**: Server state management with TanStack Query
- **Error Handling**: Comprehensive error handling for API failures with custom ApiError class
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Type Safety**: Full TypeScript coverage with strict type checking
- **Testing**: Comprehensive test coverage with Vitest and Testing Library

## Tech Stack

- **React 19** - Modern React with hooks
- **TypeScript 5.9** - Type-safe code
- **Vite 7** - Fast development server and build tool
- **TanStack Query 5** - Server state management and caching
- **React Context API** - Client state management for drag-and-drop
- **Vitest 4** - Unit testing framework
- **CSS3** - Custom styling with animations
- **Prettier** - Code formatting

## Project Structure

```
src/
├── apis/                # API layer
│   ├── apiUtils.ts      # Shared API utilities and error handling
│   ├── taskApi.ts       # Task API endpoints
│   ├── userApi.ts       # User API endpoints
│   ├── types.ts         # API response types (raw formats)
│   └── *.test.ts        # API tests
├── components/          # React components
│   ├── CreateTaskCard/  # Task creation form
│   ├── TaskBoard/       # Main board container
│   ├── TaskCard/        # Individual task display
│   ├── TaskColumn/      # Status column container
│   └── UserSelector/    # User assignment dropdown
├── contexts/            # React Context providers
│   ├── DragContext.tsx  # Drag-and-drop state
│   └── TaskBoardContext.tsx  # Task board state
├── hooks/               # Custom React hooks
│   ├── useTasks.ts      # Task data fetching and mutations
│   ├── useTaskBoardContext.ts  # Task board context hook
│   ├── useUsers.ts      # User data fetching
│   └── *.test.tsx       # Hook tests
├── types/               # TypeScript type definitions
│   ├── task.ts          # Task types
│   └── user.ts          # User types
├── constants/           # Application constants
│   └── queryKeys.ts     # TanStack Query cache keys
├── App.tsx              # Main application component
├── main.tsx             # Application entry point
└── index.css            # Global styles
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running (see backend README for setup instructions)

### Environment Variables

Create a `.env` file in the frontend directory (optional):

```env
VITE_API_BASE_URL=http://localhost:8000
```

If not set, defaults to `http://localhost:8000`.

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
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

- `npm run dev` - Start the development server (Vite)
- `npm run build` - Type check with TypeScript and build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm run test` - Run tests in watch mode
- `npm run test:ui` - Run tests with Vitest UI
- `npm run test:run` - Run tests once (CI mode)
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## Usage

### Creating a Task

1. Enter a task description in the "Task Description" field
2. Select a user from the dropdown (optional)
3. Choose a status (TODO, DOING, or DONE)
4. Click "Add Task"

### Editing a Task

- **Description**: Click on the task description to edit it inline
- **User**: Click on the user dropdown within the task card to change assignment
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
    └── TaskBoardProvider
        └── DragProvider
            └── TaskBoard
                ├── CreateTaskCard
                │   └── UserSelector
                └── TaskColumn (×3)
                    └── TaskCard (×N)
                        └── UserSelector
```

## API Layer

The application connects to a FastAPI backend with the following endpoints:

### Tasks
- `GET /api/tasks` - Fetch all tasks
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/{id}` - Update a task
- `DELETE /api/tasks/{id}` - Delete a task

### Users
- `GET /api/users` - Fetch all users

The API layer includes:
- Data transformation between snake_case (API) and camelCase (frontend)
- Custom `ApiError` class for structured error handling
- Centralized response handling with `handleResponse` utility
- Environment-based API URL configuration

## State Management

The application uses a layered state management approach:

- **Server State**: TanStack Query for data fetching, caching, and synchronization
  - Automatic background refetching
  - Optimistic updates for better UX
  - Query invalidation for cache management
- **Task Board State**: TaskBoardContext for managing selected tasks and edit modes
- **Drag State**: DragContext for drag-and-drop interactions

## Testing

The project includes comprehensive test coverage:

- **Unit Tests**: For hooks (useTasks, useUsers) and API functions
- **Test Framework**: Vitest with happy-dom
- **Testing Library**: React Testing Library for component testing
- **Run Tests**: `npm run test` (watch mode) or `npm run test:run` (CI mode)
- **UI Tests**: `npm run test:ui` for interactive test viewer

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Architecture Decisions

- **TypeScript Strict Mode**: Full type safety throughout the application
- **Component Co-location**: CSS files alongside component files for better organization
- **Custom Hooks**: Abstracted data fetching logic for reusability
- **Context Separation**: Different contexts for different concerns (drag state vs task board state)
- **API Transformation Layer**: Converts between backend snake_case and frontend camelCase

## Development

### Code Quality

- ESLint configured with React-specific rules
- Prettier for consistent code formatting
- TypeScript strict mode enabled
- React 19 with modern patterns

### Project Conventions

- camelCase for frontend variables and properties
- snake_case for API requests/responses (handled by transformation layer)
- Component folder structure with co-located styles
- Comprehensive error handling with typed errors
