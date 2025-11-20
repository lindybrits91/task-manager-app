/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface DragContextValue {
  draggedTaskId: number | null;
  setDraggedTaskId: (id: number | null) => void;
}

const DragContext = createContext<DragContextValue | undefined>(undefined);

export function DragProvider({ children }: { children: ReactNode }) {
  const [draggedTaskId, setDraggedTaskId] = useState<number | null>(null);

  return (
    <DragContext.Provider value={{ draggedTaskId, setDraggedTaskId }}>
      {children}
    </DragContext.Provider>
  );
}

export function useDrag() {
  const context = useContext(DragContext);
  if (!context) {
    throw new Error('useDrag must be used within a DragProvider');
  }
  return context;
}
