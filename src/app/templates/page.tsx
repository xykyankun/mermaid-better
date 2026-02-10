'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import TemplateCard from '@/components/template-card';
import type { Template } from '@/lib/neon/schema';
import { Sparkles, Search, Filter, Layout, Home, FileCode2 } from 'lucide-react';

export default function TemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/templates');
      if (!response.ok) {
        throw new Error('Failed to fetch templates');
      }
      const data = await response.json();
      setTemplates(data);
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUseTemplate = (template: Template) => {
    // Navigate to editor with template content
    router.push(`/editor?template=${template.id}`);
  };

  // Filter templates
  const filteredTemplates = templates.filter((template) => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesType = selectedType === 'all' || template.type === selectedType;
    const matchesSearch =
      searchQuery === '' ||
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesType && matchesSearch;
  });

  // Get unique categories and types
  const categories = ['all', ...new Set(templates.map((t) => t.category))];
  const types = ['all', ...new Set(templates.map((t) => t.type))];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500">
        <div className="relative">
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-white"></div>
          <Layout className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-white animate-pulse" />
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

      {/* Header */}
      <header className="relative backdrop-blur-sm bg-white/70 shadow-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Mermaid Better
                </span>
              </Link>
              <span className="hidden sm:block text-gray-300">|</span>
              <div className="flex items-center gap-2">
                <Layout className="w-5 h-5 text-purple-600" />
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">Template Library</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 font-medium rounded-xl hover:bg-white/50 transition-all"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
              <Link
                href="/editor"
                className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all"
              >
                <FileCode2 className="w-4 h-4" />
                <span>New Diagram</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="relative max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md mb-6 border border-purple-100">
            <Layout className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-gray-700">{templates.length} Professional Templates</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Start with a
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"> Template</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose from our professionally designed templates and customize them to your needs
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-12 shadow-lg border border-white/20">
          <div className="flex items-center gap-2 mb-6">
            <Filter className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Filter Templates</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative group">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search templates..."
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all appearance-none bg-white cursor-pointer"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Diagram Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all appearance-none bg-white cursor-pointer"
              >
                {types.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">{filteredTemplates.length}</span> of{' '}
              <span className="font-semibold text-gray-900">{templates.length}</span> templates
            </div>
            {(searchQuery || selectedCategory !== 'all' || selectedType !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedType('all');
                }}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Templates Grid */}
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-xl text-gray-600 mb-2">No templates found</p>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTemplates.map((template) => (
              <TemplateCard key={template.id} template={template} onUseTemplate={handleUseTemplate} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
