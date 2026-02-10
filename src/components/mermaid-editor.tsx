'use client';

import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import Editor from '@monaco-editor/react';
import mermaid from 'mermaid';

interface MermaidEditorProps {
  initialContent?: string;
  onChange?: (content: string) => void;
  onExport?: (type: 'png' | 'svg') => void;
}

export interface MermaidEditorRef {
  getSVGElement: () => SVGElement | null;
  getCode: () => string;
  hasError: () => boolean;
}

const defaultMermaidCode = `graph TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B
    C --> E[End]`;

export const MermaidEditor = forwardRef<MermaidEditorRef, MermaidEditorProps>(
  ({ initialContent, onChange, onExport }, ref) => {
  const [code, setCode] = useState(initialContent || defaultMermaidCode);
  const [error, setError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    getSVGElement: () => {
      return previewRef.current?.querySelector('svg') || null;
    },
    getCode: () => code,
    hasError: () => !!error,
  }));

  // Initialize Mermaid
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
    });
  }, []);

  // Render Mermaid diagram
  useEffect(() => {
    const renderDiagram = async () => {
      if (!previewRef.current || !code.trim()) return;

      try {
        setError(null);
        const { svg } = await mermaid.render('mermaid-preview', code);
        previewRef.current.innerHTML = svg;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to render diagram');
        previewRef.current.innerHTML = '';
      }
    };

    const debounce = setTimeout(renderDiagram, 500);
    return () => clearTimeout(debounce);
  }, [code]);

  const handleEditorChange = (value: string | undefined) => {
    const newCode = value || '';
    setCode(newCode);
    onChange?.(newCode);
  };

  const handleExportPNG = async () => {
    if (!previewRef.current || error) return;

    setIsExporting(true);
    try {
      const svgElement = previewRef.current.querySelector('svg');
      if (!svgElement) throw new Error('No SVG found');

      // Clone and prepare SVG
      const clonedSvg = svgElement.cloneNode(true) as SVGElement;

      // Get SVG dimensions
      const bbox = svgElement.getBBox();
      const width = bbox.width || parseInt(svgElement.getAttribute('width') || '800');
      const height = bbox.height || parseInt(svgElement.getAttribute('height') || '600');

      // Set explicit dimensions on cloned SVG
      clonedSvg.setAttribute('width', String(width));
      clonedSvg.setAttribute('height', String(height));
      clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

      // Inline all styles to avoid CORS issues
      const styleElement = document.createElementNS('http://www.w3.org/2000/svg', 'style');
      styleElement.textContent = `
        svg { font-family: arial, sans-serif; }
        .node rect, .node circle, .node polygon { fill: #ECECFF; stroke: #9370DB; stroke-width: 1px; }
        .edgeLabel { background-color: #e8e8e8; }
        .cluster rect { fill: #ffffde; stroke: #aaaa33; stroke-width: 1px; }
        text { font-family: arial, sans-serif; fill: #333; }
      `;
      clonedSvg.insertBefore(styleElement, clonedSvg.firstChild);

      // Create canvas
      const canvas = document.createElement('canvas');
      const scale = 2; // Higher resolution
      canvas.width = width * scale;
      canvas.height = height * scale;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });

      if (!ctx) throw new Error('Failed to get canvas context');

      // White background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.scale(scale, scale);

      // Serialize SVG to string with proper encoding
      const svgData = new XMLSerializer().serializeToString(clonedSvg);
      const encodedData = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));

      // Load SVG into image
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        try {
          ctx.drawImage(img, 0, 0, width, height);

          // Try to convert to PNG
          try {
            canvas.toBlob((blob) => {
              if (!blob) {
                alert('Failed to create image');
                setIsExporting(false);
                return;
              }

              const link = document.createElement('a');
              link.download = 'mermaid-diagram.png';
              link.href = URL.createObjectURL(blob);
              link.click();
              URL.revokeObjectURL(link.href);

              onExport?.('png');
              setIsExporting(false);
            }, 'image/png');
          } catch (blobError) {
            console.error('toBlob error:', blobError);
            // Fallback: use toDataURL
            try {
              const dataUrl = canvas.toDataURL('image/png');
              const link = document.createElement('a');
              link.download = 'mermaid-diagram.png';
              link.href = dataUrl;
              link.click();

              onExport?.('png');
              setIsExporting(false);
            } catch (dataUrlError) {
              console.error('toDataURL error:', dataUrlError);
              alert('Failed to export PNG due to security restrictions. Please try exporting as SVG instead.');
              setIsExporting(false);
            }
          }
        } catch (drawError) {
          console.error('Draw error:', drawError);
          alert('Failed to draw image. Try exporting as SVG instead.');
          setIsExporting(false);
        }
      };

      img.onerror = (e) => {
        console.error('Failed to load SVG into image:', e);
        alert('Failed to export PNG. Try exporting as SVG instead.');
        setIsExporting(false);
      };

      img.src = encodedData;
    } catch (err) {
      console.error('Failed to export PNG:', err);
      alert('Failed to export PNG: ' + (err instanceof Error ? err.message : 'Unknown error'));
      setIsExporting(false);
    }
  };

  const handleExportSVG = async () => {
    if (!previewRef.current || error) return;

    setIsExporting(true);
    try {
      const svgElement = previewRef.current.querySelector('svg');
      if (!svgElement) throw new Error('No SVG found');

      const svgData = new XMLSerializer().serializeToString(svgElement);
      const blob = new Blob([svgData], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);

      // Download the SVG
      const link = document.createElement('a');
      link.download = 'mermaid-diagram.svg';
      link.href = url;
      link.click();

      URL.revokeObjectURL(url);
      onExport?.('svg');
    } catch (err) {
      console.error('Failed to export SVG:', err);
      alert('Failed to export SVG');
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    alert('Code copied to clipboard!');
  };

  return (
    <div className="flex h-full gap-4">
      {/* Editor Panel */}
      <div className="w-1/2 flex flex-col border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700">Mermaid Code</h3>
        </div>
        <div className="flex-1">
          <Editor
            height="100%"
            defaultLanguage="mermaid"
            value={code}
            onChange={handleEditorChange}
            theme="vs-light"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
            }}
          />
        </div>
      </div>

      {/* Preview Panel */}
      <div className="w-1/2 flex flex-col border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700">Preview</h3>
          <div className="flex gap-2">
            <button
              onClick={handleCopyCode}
              className="px-3 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
            >
              Copy Code
            </button>
            <button
              onClick={handleExportSVG}
              disabled={isExporting || !!error}
              className="px-3 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExporting ? 'Exporting...' : 'Export SVG'}
            </button>
            <button
              onClick={handleExportPNG}
              disabled={isExporting || !!error}
              className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExporting ? 'Exporting...' : 'Export PNG'}
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-4 bg-white">
          {error ? (
            <div className="text-red-600 text-sm p-4 bg-red-50 rounded border border-red-200">
              <p className="font-semibold mb-2">Syntax Error:</p>
              <pre className="whitespace-pre-wrap">{error}</pre>
            </div>
          ) : (
            <div
              ref={previewRef}
              className="flex items-center justify-center min-h-full"
            />
          )}
        </div>
      </div>
    </div>
  );
});

MermaidEditor.displayName = 'MermaidEditor';
