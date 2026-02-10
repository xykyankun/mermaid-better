import { useState, useCallback, useRef } from 'react';

interface UndoRedoState<T> {
  past: T[];
  present: T;
  future: T[];
}

interface UseUndoRedoReturn<T> {
  state: T;
  setState: (newState: T, skipHistory?: boolean) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  clear: () => void;
  historySize: number;
}

/**
 * Custom hook for undo/redo functionality
 * @param initialState - The initial state
 * @param maxHistorySize - Maximum number of history items to keep (default: 50)
 */
export function useUndoRedo<T>(
  initialState: T,
  maxHistorySize: number = 50
): UseUndoRedoReturn<T> {
  const [history, setHistory] = useState<UndoRedoState<T>>({
    past: [],
    present: initialState,
    future: [],
  });

  // Track if we should skip adding to history (for programmatic updates)
  const skipHistoryRef = useRef(false);

  const setState = useCallback(
    (newState: T, skipHistory: boolean = false) => {
      if (skipHistory) {
        skipHistoryRef.current = true;
        setHistory((currentHistory) => ({
          ...currentHistory,
          present: newState,
        }));
        return;
      }

      setHistory((currentHistory) => {
        const { past, present } = currentHistory;

        // Don't add to history if state hasn't changed
        if (JSON.stringify(present) === JSON.stringify(newState)) {
          return currentHistory;
        }

        // Add current state to past
        const newPast = [...past, present];

        // Limit history size
        if (newPast.length > maxHistorySize) {
          newPast.shift(); // Remove oldest item
        }

        return {
          past: newPast,
          present: newState,
          future: [], // Clear future when new state is set
        };
      });
    },
    [maxHistorySize]
  );

  const undo = useCallback(() => {
    setHistory((currentHistory) => {
      const { past, present, future } = currentHistory;

      if (past.length === 0) {
        return currentHistory; // Nothing to undo
      }

      const previous = past[past.length - 1];
      const newPast = past.slice(0, past.length - 1);

      return {
        past: newPast,
        present: previous,
        future: [present, ...future],
      };
    });
  }, []);

  const redo = useCallback(() => {
    setHistory((currentHistory) => {
      const { past, present, future } = currentHistory;

      if (future.length === 0) {
        return currentHistory; // Nothing to redo
      }

      const next = future[0];
      const newFuture = future.slice(1);

      return {
        past: [...past, present],
        present: next,
        future: newFuture,
      };
    });
  }, []);

  const clear = useCallback(() => {
    setHistory((currentHistory) => ({
      past: [],
      present: currentHistory.present,
      future: [],
    }));
  }, []);

  return {
    state: history.present,
    setState,
    undo,
    redo,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
    clear,
    historySize: history.past.length + 1 + history.future.length,
  };
}
