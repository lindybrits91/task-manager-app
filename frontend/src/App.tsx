import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DragProvider } from './contexts/DragContext';
import { TaskBoardProvider } from './contexts/TaskBoardContext';
import { TaskBoard } from './components/TaskBoard/TaskBoard';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TaskBoardProvider>
        <DragProvider>
          <TaskBoard />
        </DragProvider>
      </TaskBoardProvider>
    </QueryClientProvider>
  );
}

export default App;
