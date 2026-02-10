'use client';

import { useState, useEffect } from 'react';
import { neonClient } from '@/lib/neon/client';
import { X, Copy, Check, Eye, Globe, Lock, Info, Share2 } from 'lucide-react';

interface ShareDialogProps {
  diagramId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ShareDialog({ diagramId, isOpen, onClose }: ShareDialogProps) {
  const { data: session } = neonClient.auth.useSession();
  const [isPublic, setIsPublic] = useState(false);
  const [shareToken, setShareToken] = useState<string | null>(null);
  const [viewCount, setViewCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && session?.user?.id) {
      fetchShareStatus();
    }
  }, [isOpen, diagramId, session]);

  const fetchShareStatus = async () => {
    if (!session?.user?.id) return;

    try {
      const response = await fetch(
        `/api/diagrams/${diagramId}/share?userId=${session.user.id}`
      );
      if (response.ok) {
        const data = await response.json();
        setIsPublic(data.is_public);
        setShareToken(data.share_token);
        setViewCount(data.view_count);
      }
    } catch (error) {
      console.error('Error fetching share status:', error);
    }
  };

  const toggleSharing = async () => {
    if (!session?.user?.id) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/diagrams/${diagramId}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isPublic: !isPublic,
          userId: session.user.id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsPublic(data.is_public);
        setShareToken(data.share_token);
        setViewCount(data.view_count);
      } else {
        alert('Failed to update sharing settings');
      }
    } catch (error) {
      console.error('Error toggling sharing:', error);
      alert('Failed to update sharing settings');
    } finally {
      setLoading(false);
    }
  };

  const copyShareLink = () => {
    if (!shareToken) return;

    const shareUrl = `${window.location.origin}/share/${shareToken}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  const shareUrl = shareToken ? `${window.location.origin}/share/${shareToken}` : '';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-8 w-full max-w-lg shadow-2xl border border-white/20 transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Share2 className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              分享图表
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Public/Private Toggle */}
        <div className="mb-6">
          <div className="flex items-center justify-between p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-gray-200 hover:border-purple-300 transition-all">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md ${
                isPublic
                  ? 'bg-gradient-to-br from-green-500 to-green-600'
                  : 'bg-gradient-to-br from-gray-500 to-gray-600'
              }`}>
                {isPublic ? <Globe className="w-6 h-6 text-white" /> : <Lock className="w-6 h-6 text-white" />}
              </div>
              <div>
                <p className="font-bold text-gray-900 text-lg">
                  {isPublic ? '公开' : '私密'}
                </p>
                <p className="text-sm text-gray-600">
                  {isPublic
                    ? '任何人都可以通过链接查看'
                    : '只有你能访问这个图表'}
                </p>
              </div>
            </div>
            <button
              onClick={toggleSharing}
              disabled={loading}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all shadow-md ${
                isPublic ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gray-300'
              } ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform ${
                  isPublic ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Share Link */}
        {isPublic && shareToken && (
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              分享链接
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-sm font-mono focus:border-purple-500 focus:outline-none transition-all"
              />
              <button
                onClick={copyShareLink}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all shadow-md ${
                  copied
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg transform hover:scale-[1.02]'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>已复制</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>复制</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Stats */}
        {isPublic && (
          <div className="mb-6 p-5 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-md">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {viewCount}
                </p>
                <p className="text-sm font-medium text-gray-600">
                  总查看次数
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="mb-6 p-4 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-900 leading-relaxed">
              <strong className="font-bold">提示：</strong>分享的图表是只读的。查看者可以查看、复制和导出图表，但无法编辑。
            </p>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 font-semibold rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all shadow-md hover:shadow-lg"
        >
          关闭
        </button>
      </div>
    </div>
  );
}
