'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { neonClient } from '@/lib/neon/client';
import type { Diagram } from '@/lib/neon/schema';
import ShareDialog from '@/components/share-dialog';
import {
  Sparkles,
  Plus,
  Layout,
  LogOut,
  Edit3,
  Share2,
  Trash2,
  FileCode2,
  Clock,
  TrendingUp,
  Zap,
  Home,
  Search,
  Filter,
  X,
  SlidersHorizontal
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = neonClient.auth.useSession();
  const [diagrams, setDiagrams] = useState<Diagram[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [shareDialogDiagramId, setShareDialogDiagramId] = useState<string | null>(null);

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'updated' | 'created' | 'title'>('updated');
  const [showFilters, setShowFilters] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!sessionLoading && !session) {
      router.push('/login');
    }
  }, [session, sessionLoading, router]);

  // Fetch diagrams when component mounts
  useEffect(() => {
    if (session) {
      fetchDiagrams();
    }
  }, [session]);

  const fetchDiagrams = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await neonClient
        .from('diagrams')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Failed to fetch diagrams:', error);
      } else {
        setDiagrams(data || []);
      }
    } catch (error) {
      console.error('Failed to fetch diagrams:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this diagram?')) return;

    try {
      const { error } = await neonClient
        .from('diagrams')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Failed to delete diagram:', error);
        alert('Failed to delete diagram');
      } else {
        setDiagrams(diagrams.filter(d => d.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete diagram:', error);
      alert('Failed to delete diagram');
    }
  };

  const handleLogout = async () => {
    await neonClient.auth.signOut();
    router.push('/login');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getDiagramTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      flowchart: 'Flowchart',
      sequence: 'Sequence Diagram',
      class: 'Class Diagram',
      er: 'ER Diagram',
      gantt: 'Gantt Chart',
      pie: 'Pie Chart',
      journey: 'User Journey',
      gitgraph: 'Git Graph',
      mindmap: 'Mind Map',
    };
    return labels[type] || type;
  };

  // Filter and sort diagrams
  const filteredDiagrams = diagrams
    .filter(diagram => {
      // Search filter
      const matchesSearch = searchQuery === '' ||
        diagram.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (diagram.description?.toLowerCase().includes(searchQuery.toLowerCase()) || false);

      // Type filter
      const matchesType = selectedType === 'all' || diagram.type === selectedType;

      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'updated':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  // Get unique diagram types
  const diagramTypes = Array.from(new Set(diagrams.map(d => d.type)));

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedType('all');
    setSortBy('updated');
  };

  if (sessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500">
        <div className="relative">
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-white"></div>
          <Home className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-white animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 sm:p-8 mb-8 border border-white/20">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    我的图表
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">
                    欢迎回来, {session?.user?.email}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => router.push('/')}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 font-medium rounded-xl hover:bg-white/50 transition-all"
              >
                <Home className="w-4 h-4" />
                <span>首页</span>
              </button>
              <button
                onClick={() => router.push('/templates')}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 font-medium rounded-xl hover:bg-white/50 transition-all"
              >
                <Layout className="w-4 h-4" />
                <span>模板库</span>
              </button>
              <button
                onClick={() => router.push('/editor')}
                className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>新建图表</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 font-medium rounded-xl hover:bg-red-50 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>退出</span>
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-8 border border-white/20">
          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="搜索图表标题或描述..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/60 backdrop-blur-sm border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-5 py-3 bg-white/60 border-2 border-gray-200 rounded-xl hover:border-purple-300 hover:bg-white transition-all"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="font-medium">筛选</span>
              {(selectedType !== 'all' || sortBy !== 'updated') && (
                <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
              )}
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-purple-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Type Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    图表类型
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-4 py-2 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="all">全部类型</option>
                    {diagramTypes.map(type => (
                      <option key={type} value={type}>
                        {getDiagramTypeLabel(type)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    排序方式
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'updated' | 'created' | 'title')}
                    className="w-full px-4 py-2 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="updated">最近更新</option>
                    <option value="created">创建时间</option>
                    <option value="title">名称</option>
                  </select>
                </div>
              </div>

              {/* Clear Filters */}
              {(searchQuery || selectedType !== 'all' || sortBy !== 'updated') && (
                <button
                  onClick={clearFilters}
                  className="mt-4 w-full px-4 py-2 bg-white text-purple-700 font-medium rounded-xl hover:bg-purple-50 transition-all border-2 border-purple-200"
                >
                  清除所有筛选
                </button>
              )}
            </div>
          )}

          {/* Results Info */}
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <div>
              显示 <span className="font-bold text-purple-700">{filteredDiagrams.length}</span> 个图表
              {filteredDiagrams.length !== diagrams.length && (
                <span className="text-gray-500"> (共 {diagrams.length} 个)</span>
              )}
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                <FileCode2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">总图表数</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {diagrams.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">最近更新</p>
                <p className="text-lg font-bold text-gray-900">
                  {diagrams.length > 0 ? formatDate(diagrams[0].updatedAt.toString()).split(',')[0] : '-'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center shadow-md">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">活跃度</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">
                  高
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Diagrams Grid */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className="relative inline-block">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
              <Zap className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-purple-600 animate-pulse" />
            </div>
            <p className="text-gray-600 mt-4 text-lg font-medium">加载中...</p>
          </div>
        ) : filteredDiagrams.length === 0 && diagrams.length > 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-12 text-center border border-white/20">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                没有找到匹配的图表
              </h3>
              <p className="text-gray-600 mb-8 text-lg">
                试试修改搜索条件或清除筛选
              </p>
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all"
              >
                <X className="w-5 h-5" />
                清除筛选
              </button>
            </div>
          </div>
        ) : diagrams.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-12 text-center border border-white/20">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileCode2 className="w-12 h-12 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                还没有图表
              </h3>
              <p className="text-gray-600 mb-8 text-lg">
                开始创建你的第一个 Mermaid 图表吧！
              </p>
              <button
                onClick={() => router.push('/editor')}
                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all"
              >
                <Plus className="w-5 h-5" />
                创建第一个图表
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDiagrams.map((diagram) => (
              <div
                key={diagram.id}
                className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden border border-white/20 transform hover:scale-[1.02]"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900 line-clamp-2 flex-1 group-hover:text-purple-700 transition-colors">
                      {diagram.title}
                    </h3>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md ml-2">
                      {getDiagramTypeLabel(diagram.type)}
                    </span>
                  </div>

                  {/* Description */}
                  {diagram.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {diagram.description}
                    </p>
                  )}

                  {/* Date */}
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
                    <Clock className="w-3.5 h-3.5" />
                    <span>更新于 {formatDate(diagram.updatedAt.toString())}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/editor?id=${diagram.id}`)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-[1.02] transition-all"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>编辑</span>
                    </button>
                    <button
                      onClick={() => setShareDialogDiagramId(diagram.id)}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-purple-700 font-medium rounded-xl hover:shadow-md transition-all border-2 border-purple-200"
                      title="分享"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(diagram.id)}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-red-600 font-medium rounded-xl hover:bg-red-50 hover:shadow-md transition-all border-2 border-red-200"
                      title="删除"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Share Dialog */}
      {shareDialogDiagramId && (
        <ShareDialog
          diagramId={shareDialogDiagramId}
          isOpen={!!shareDialogDiagramId}
          onClose={() => setShareDialogDiagramId(null)}
        />
      )}
    </div>
  );
}
