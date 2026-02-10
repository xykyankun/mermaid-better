'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import mermaid from 'mermaid';
import Link from 'next/link';
import {
  Sparkles,
  Share2,
  Copy,
  FileCode,
  Download,
  Eye,
  Home,
  Lock,
  AlertCircle,
  Check
} from 'lucide-react';

interface SharedDiagram {
  id: string;
  title: string;
  content: string;
  type: string;
  description?: string;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export default function SharePage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [diagram, setDiagram] = useState<SharedDiagram | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [renderError, setRenderError] = useState<string | null>(null);

  useEffect(() => {
    fetchSharedDiagram();
  }, [token]);

  useEffect(() => {
    if (diagram && previewRef.current) {
      renderDiagram();
    }
  }, [diagram]);

  const fetchSharedDiagram = async () => {
    try {
      const response = await fetch(`/api/share/${token}`);
      if (!response.ok) {
        if (response.status === 404) {
          setError('This shared diagram does not exist or is no longer public.');
        } else {
          setError('Failed to load shared diagram.');
        }
        setLoading(false);
        return;
      }

      const data = await response.json();
      setDiagram(data);
    } catch (err: any) {
      console.error('Error fetching diagram:', err);
      setError('Failed to load shared diagram.');
    } finally {
      setLoading(false);
    }
  };

  const renderDiagram = async () => {
    if (!previewRef.current || !diagram) return;

    try {
      setRenderError(null);
      const { svg } = await mermaid.render(`diagram-${diagram.id}`, diagram.content);
      previewRef.current.innerHTML = svg;
    } catch (error: any) {
      console.error('Mermaid rendering error:', error);
      setRenderError(error.message || 'Failed to render diagram');
    }
  };

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyCode = () => {
    if (diagram) {
      navigator.clipboard.writeText(diagram.content);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleExportSVG = () => {
    if (!previewRef.current) return;

    const svgElement = previewRef.current.querySelector('svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${diagram?.title || 'diagram'}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500">
        <div className="relative">
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-white"></div>
          <Share2 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-white animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <div className="text-center max-w-md bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-2xl border border-white/20">
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Lock className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">图表不可用</h1>
          <p className="text-gray-600 mb-8 text-lg">{error}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all"
          >
            <Home className="w-5 h-5" />
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  if (!diagram) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex flex-col">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Header */}
      <header className="relative backdrop-blur-sm bg-white/80 border-b border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            {/* Left Side */}
            <div className="flex items-center gap-4 flex-1">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Mermaid Better
                </span>
              </Link>
              <span className="hidden sm:block text-gray-300">|</span>
              <div className="flex-1">
                <h1 className="text-xl font-bold text-gray-900">{diagram.title}</h1>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                  <Eye className="w-4 h-4" />
                  <span>{diagram.view_count} 次查看</span>
                </div>
              </div>
            </div>

            {/* Right Side - Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleCopyLink}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all shadow-md ${
                  copiedLink
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-purple-300 hover:shadow-lg'
                }`}
              >
                {copiedLink ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                <span className="hidden sm:inline">{copiedLink ? '已复制' : '复制链接'}</span>
              </button>
              <button
                onClick={handleCopyCode}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all shadow-md ${
                  copiedCode
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-purple-300 hover:shadow-lg'
                }`}
              >
                {copiedCode ? <Check className="w-4 h-4" /> : <FileCode className="w-4 h-4" />}
                <span className="hidden sm:inline">{copiedCode ? '已复制' : '复制代码'}</span>
              </button>
              <button
                onClick={handleExportSVG}
                className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border-2 border-gray-200 rounded-xl font-medium hover:border-purple-300 hover:shadow-lg transition-all shadow-md"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">导出 SVG</span>
              </button>
              <Link
                href="/register"
                className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>创建自己的</span>
              </Link>
            </div>
          </div>
          {diagram.description && (
            <p className="mt-4 text-gray-600 text-sm bg-gray-50 rounded-lg p-3 border border-gray-200">
              {diagram.description}
            </p>
          )}
        </div>
      </header>

      {/* Diagram Display */}
      <main className="relative flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-6xl border border-white/20">
          {renderError ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <div className="text-xl font-bold text-red-600 mb-2">渲染错误</div>
              <p className="text-gray-600">{renderError}</p>
            </div>
          ) : (
            <div
              ref={previewRef}
              className="mermaid-preview flex items-center justify-center min-h-[400px] rounded-xl bg-white p-4"
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative backdrop-blur-sm bg-white/70 border-t border-white/20 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Mermaid Better
            </span>
          </div>
          <p className="text-sm text-gray-600">
            使用{' '}
            <Link href="/" className="text-purple-600 hover:text-purple-700 font-medium">
              Mermaid Better
            </Link>
            {' '}创建 • 基于 Mermaid.js & Next.js 构建
          </p>
        </div>
      </footer>
    </div>
  );
}
