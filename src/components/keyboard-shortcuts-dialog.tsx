'use client';

import { X, Keyboard, Command } from 'lucide-react';

interface KeyboardShortcutsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ShortcutItem {
  keys: string[];
  description: string;
  category: string;
}

const shortcuts: ShortcutItem[] = [
  // Editor shortcuts
  { keys: ['Ctrl', 'S'], description: '保存图表', category: '编辑器' },
  { keys: ['Ctrl', 'E'], description: '导出图表', category: '编辑器' },
  { keys: ['Ctrl', 'P'], description: '分享图表', category: '编辑器' },
  { keys: ['Ctrl', 'N'], description: '新建图表', category: '编辑器' },

  // Edit shortcuts
  { keys: ['Ctrl', 'Z'], description: '撤销', category: '编辑' },
  { keys: ['Ctrl', 'Shift', 'Z'], description: '重做', category: '编辑' },
  { keys: ['Ctrl', 'Y'], description: '重做 (备选)', category: '编辑' },

  // Navigation shortcuts
  { keys: ['?'], description: '显示快捷键帮助', category: '导航' },
  { keys: ['Esc'], description: '关闭对话框', category: '导航' },
];

export default function KeyboardShortcutsDialog({ isOpen, onClose }: KeyboardShortcutsDialogProps) {
  if (!isOpen) return null;

  const categories = Array.from(new Set(shortcuts.map(s => s.category)));

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white/95 backdrop-blur-md rounded-2xl p-8 w-full max-w-2xl shadow-2xl border border-white/20 max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Keyboard className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                键盘快捷键
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                使用快捷键提升工作效率
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center transition-colors group"
          >
            <X className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
          </button>
        </div>

        {/* Shortcuts List */}
        <div className="space-y-6">
          {categories.map((category) => (
            <div key={category}>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
                {category}
              </h3>
              <div className="space-y-2">
                {shortcuts
                  .filter((s) => s.category === category)
                  .map((shortcut, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all"
                    >
                      <span className="text-gray-700 font-medium">
                        {shortcut.description}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {shortcut.keys.map((key, i) => (
                          <div key={i} className="flex items-center gap-1.5">
                            {i > 0 && (
                              <span className="text-gray-400 text-xs">+</span>
                            )}
                            <kbd className="px-3 py-1.5 bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-gray-300 rounded-lg text-sm font-semibold text-gray-700 shadow-sm min-w-[40px] text-center">
                              {key}
                            </kbd>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Tip */}
        <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <div className="flex items-start gap-3">
            <Command className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-blue-900 font-medium">
                提示: Mac 用户请使用 ⌘ (Cmd) 代替 Ctrl
              </p>
              <p className="text-xs text-blue-700 mt-1">
                在任何页面按 <kbd className="px-2 py-0.5 bg-white rounded text-xs border border-blue-300">?</kbd> 可以快速查看快捷键
              </p>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          关闭 (Esc)
        </button>
      </div>
    </div>
  );
}
