'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { MermaidEditor, MermaidEditorRef } from '@/components/mermaid-editor';
import { neonClient } from '@/lib/neon/client';
import ShareDialog from '@/components/share-dialog';
import KeyboardShortcutsDialog from '@/components/keyboard-shortcuts-dialog';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useUndoRedo } from '@/hooks/useUndoRedo';
import { exportSVG, exportSVGToPNG, exportSVGToPDF } from '@/utils/export-utils';
import {
  Sparkles,
  Save,
  Share2,
  Layout,
  Home,
  FileCode2,
  Loader2,
  Check,
  Keyboard,
  Download,
  Undo2,
  Redo2
} from 'lucide-react';

function EditorPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const diagramId = searchParams.get('id');
  const templateId = searchParams.get('template');

  const [title, setTitle] = useState('Untitled Diagram');
  const [diagramType, setDiagramType] = useState('flowchart');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const editorRef = useRef<MermaidEditorRef>(null);

  // Undo/Redo state management
  const {
    state: code,
    setState: setCode,
    undo,
    redo,
    canUndo,
    canRedo,
    clear: clearHistory,
  } = useUndoRedo<string>('');

  // Load existing diagram or template
  useEffect(() => {
    if (diagramId) {
      loadDiagram(diagramId);
    } else if (templateId) {
      loadTemplate(templateId);
    }
  }, [diagramId, templateId]);

  const loadDiagram = async (id: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await neonClient
        .from('diagrams')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data) {
        setTitle(data.title);
        setCode(data.content, true); // Skip history when loading
        setDiagramType(data.type);
        clearHistory(); // Clear history after loading
      }
    } catch (error) {
      console.error('Failed to load diagram:', error);
      alert('Failed to load diagram');
    } finally {
      setIsLoading(false);
    }
  };

  const loadTemplate = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/templates/${id}`);
      if (!response.ok) {
        throw new Error('Failed to load template');
      }
      const data = await response.json();

      setTitle(`New ${data.title}`);
      setCode(data.content, true); // Skip history when loading
      setDiagramType(data.type);
      clearHistory(); // Clear history after loading
    } catch (error) {
      console.error('Failed to load template:', error);
      alert('Failed to load template');
    } finally {
      setIsLoading(false);
    }
  };

  const detectDiagramType = (content: string): string => {
    const firstLine = content.trim().split('\n')[0].toLowerCase();
    if (firstLine.includes('sequencediagram')) return 'sequence';
    if (firstLine.includes('classDiagram')) return 'class';
    if (firstLine.includes('erDiagram')) return 'er';
    if (firstLine.includes('gantt')) return 'gantt';
    if (firstLine.includes('journey')) return 'journey';
    if (firstLine.includes('gitgraph')) return 'gitgraph';
    if (firstLine.includes('pie')) return 'pie';
    if (firstLine.includes('mindmap')) return 'mindmap';
    return 'flowchart';
  };

  const handleSave = async () => {
    if (!code.trim()) {
      alert('Please add some content to your diagram');
      return;
    }

    setIsSaving(true);
    try {
      const type = detectDiagramType(code);

      if (diagramId) {
        // Update existing diagram
        const { error } = await neonClient
          .from('diagrams')
          .update({
            title,
            content: code,
            type,
            updated_at: new Date().toISOString(),
          })
          .eq('id', diagramId);

        if (error) throw error;
        alert('Diagram updated successfully!');
      } else {
        // Create new diagram
        const { data, error } = await neonClient
          .from('diagrams')
          .insert({
            title,
            content: code,
            type,
          })
          .select()
          .single();

        if (error) throw error;

        alert('Diagram saved successfully!');

        // Update URL with new diagram ID
        if (data) {
          router.push(`/editor?id=${data.id}`);
        }
      }
    } catch (error) {
      console.error('Failed to save diagram:', error);
      alert('Failed to save diagram');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = async (format: 'svg' | 'png' | 'pdf') => {
    setShowExportMenu(false);

    if (!editorRef.current) {
      alert('编辑器未就绪');
      return;
    }

    if (editorRef.current.hasError()) {
      alert('图表有语法错误,无法导出。请先修复错误。');
      return;
    }

    const svgElement = editorRef.current.getSVGElement();
    if (!svgElement) {
      alert('没有找到可导出的图表');
      return;
    }

    setIsExporting(true);
    try {
      const filename = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${Date.now()}`;

      switch (format) {
        case 'svg':
          exportSVG(svgElement, `${filename}.svg`);
          break;
        case 'png':
          await exportSVGToPNG(svgElement, `${filename}.png`, 2);
          break;
        case 'pdf':
          await exportSVGToPDF(svgElement, `${filename}.pdf`);
          break;
      }

      alert(`成功导出为 ${format.toUpperCase()} 格式!`);
    } catch (error) {
      console.error('Export error:', error);
      alert(`导出失败: ${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setIsExporting(false);
    }
  };

  const handleNewDiagram = () => {
    if (confirm('创建新图表? 未保存的更改将会丢失。')) {
      router.push('/editor');
    }
  };

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 's',
      ctrlKey: true,
      action: handleSave,
      description: 'Save diagram',
    },
    {
      key: 'e',
      ctrlKey: true,
      action: () => setShowExportMenu(true),
      description: 'Export diagram',
    },
    {
      key: 'p',
      ctrlKey: true,
      action: () => diagramId && setShowShareDialog(true),
      description: 'Share diagram',
    },
    {
      key: 'n',
      ctrlKey: true,
      action: handleNewDiagram,
      description: 'New diagram',
    },
    {
      key: 'z',
      ctrlKey: true,
      action: undo,
      description: 'Undo',
    },
    {
      key: 'z',
      ctrlKey: true,
      shiftKey: true,
      action: redo,
      description: 'Redo',
    },
    {
      key: 'y',
      ctrlKey: true,
      action: redo,
      description: 'Redo (alternative)',
    },
    {
      key: '?',
      shiftKey: true,
      action: () => setShowKeyboardShortcuts(true),
      description: 'Show keyboard shortcuts',
    },
    {
      key: 'Escape',
      action: () => {
        setShowShareDialog(false);
        setShowKeyboardShortcuts(false);
        setShowExportMenu(false);
      },
      description: 'Close dialogs',
    },
  ]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500">
        <div className="relative">
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-white"></div>
          <FileCode2 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-white animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/3 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-purple-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Header */}
      <header className="relative backdrop-blur-sm bg-white/80 border-b border-white/20 shadow-sm px-4 sm:px-6 py-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Left Side - Logo & Title */}
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-3 group"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="hidden sm:block text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Mermaid Better
              </span>
            </button>
            <span className="hidden sm:block text-gray-300">|</span>
            <div className="flex-1 sm:flex-none">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full sm:w-64 px-4 py-2 bg-white/60 backdrop-blur-sm border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                placeholder="Untitled Diagram"
              />
            </div>
          </div>

          {/* Right Side - Action Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => router.push('/templates')}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 font-medium rounded-xl hover:bg-white/50 transition-all"
            >
              <Layout className="w-4 h-4" />
              <span className="hidden sm:inline">Templates</span>
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 font-medium rounded-xl hover:bg-white/50 transition-all"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </button>

            {/* Undo/Redo Buttons */}
            <div className="flex items-center gap-1 px-2 py-1 bg-white/60 rounded-xl border border-gray-200">
              <button
                onClick={undo}
                disabled={!canUndo}
                className="p-2 rounded-lg hover:bg-gray-100 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                title="Undo (Ctrl+Z)"
              >
                <Undo2 className="w-4 h-4 text-gray-700" />
              </button>
              <div className="w-px h-4 bg-gray-300"></div>
              <button
                onClick={redo}
                disabled={!canRedo}
                className="p-2 rounded-lg hover:bg-gray-100 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                title="Redo (Ctrl+Shift+Z or Ctrl+Y)"
              >
                <Redo2 className="w-4 h-4 text-gray-700" />
              </button>
            </div>

            {/* Keyboard Shortcuts Button */}
            <button
              onClick={() => setShowKeyboardShortcuts(true)}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 font-medium rounded-xl hover:bg-white/50 transition-all"
              title="Keyboard Shortcuts (Shift + ?)"
            >
              <Keyboard className="w-4 h-4" />
              <span className="hidden sm:inline">?</span>
            </button>

            {/* Export Menu */}
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                disabled={isExporting}
                className="flex items-center gap-2 px-4 py-2 bg-white/80 text-gray-700 font-medium rounded-xl hover:bg-white hover:shadow-md transition-all border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="hidden sm:inline">Exporting...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Export</span>
                  </>
                )}
              </button>

              {showExportMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 overflow-hidden z-10">
                  <button
                    onClick={() => handleExport('svg')}
                    className="w-full px-4 py-3 text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all flex items-center gap-3"
                  >
                    <FileCode2 className="w-4 h-4 text-blue-600" />
                    <div>
                      <div className="font-medium text-gray-900">SVG</div>
                      <div className="text-xs text-gray-500">矢量图格式</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleExport('png')}
                    className="w-full px-4 py-3 text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all flex items-center gap-3"
                  >
                    <FileCode2 className="w-4 h-4 text-purple-600" />
                    <div>
                      <div className="font-medium text-gray-900">PNG</div>
                      <div className="text-xs text-gray-500">图片格式</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleExport('pdf')}
                    className="w-full px-4 py-3 text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all flex items-center gap-3"
                  >
                    <FileCode2 className="w-4 h-4 text-pink-600" />
                    <div>
                      <div className="font-medium text-gray-900">PDF</div>
                      <div className="text-xs text-gray-500">文档格式</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {diagramId && (
              <button
                onClick={() => setShowShareDialog(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white/80 text-purple-700 font-medium rounded-xl hover:bg-white hover:shadow-md transition-all border border-purple-200"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Share</span>
              </button>
            )}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Editor */}
      <main className="relative flex-1 p-4 sm:p-6 overflow-hidden">
        <div className="h-full bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          <MermaidEditor ref={editorRef} initialContent={code} onChange={setCode} />
        </div>
      </main>

      {/* Share Dialog */}
      {diagramId && (
        <ShareDialog
          diagramId={diagramId}
          isOpen={showShareDialog}
          onClose={() => setShowShareDialog(false)}
        />
      )}

      {/* Keyboard Shortcuts Dialog */}
      <KeyboardShortcutsDialog
        isOpen={showKeyboardShortcuts}
        onClose={() => setShowKeyboardShortcuts(false)}
      />
    </div>
  );
}

export default function EditorPage() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500">
        <div className="relative">
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-white"></div>
          <FileCode2 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-white animate-pulse" />
        </div>
      </div>
    }>
      <EditorPageContent />
    </Suspense>
  );
}
