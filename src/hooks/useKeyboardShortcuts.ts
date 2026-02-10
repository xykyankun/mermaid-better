import { useEffect, useCallback } from 'react';

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  action: () => void;
  description: string;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[], enabled = true) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      // Don't trigger shortcuts when typing in input/textarea (except for specific keys)
      const target = event.target as HTMLElement;
      const isInputField =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      for (const shortcut of shortcuts) {
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatch = shortcut.ctrlKey ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey;
        const shiftMatch = shortcut.shiftKey ? event.shiftKey : !event.shiftKey;
        const altMatch = shortcut.altKey ? event.altKey : !event.altKey;

        if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
          // Allow Ctrl+S even in input fields
          if (shortcut.ctrlKey && ['s', 'e', 'p'].includes(shortcut.key.toLowerCase())) {
            event.preventDefault();
            shortcut.action();
            return;
          }

          // For other shortcuts, skip if in input field
          if (!isInputField) {
            event.preventDefault();
            shortcut.action();
            return;
          }
        }
      }
    },
    [shortcuts, enabled]
  );

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown, enabled]);
}

// Predefined shortcut keys for common actions
export const SHORTCUTS = {
  SAVE: { key: 's', ctrlKey: true, description: 'Save diagram' },
  EXPORT: { key: 'e', ctrlKey: true, description: 'Export diagram' },
  SHARE: { key: 'p', ctrlKey: true, description: 'Share diagram' },
  NEW: { key: 'n', ctrlKey: true, description: 'New diagram' },
  HELP: { key: '?', shiftKey: true, description: 'Show keyboard shortcuts' },
  UNDO: { key: 'z', ctrlKey: true, description: 'Undo' },
  REDO: { key: 'z', ctrlKey: true, shiftKey: true, description: 'Redo' },
} as const;
