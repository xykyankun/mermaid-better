import Link from 'next/link';
import { Home, Search, FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Content */}
      <div className="relative text-center max-w-2xl">
        {/* 404 Number */}
        <div className="mb-8">
          <div className="inline-block relative">
            <h1 className="text-9xl md:text-[12rem] font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              404
            </h1>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-32 h-32 bg-white/50 rounded-full flex items-center justify-center backdrop-blur-sm">
                <FileQuestion className="w-16 h-16 text-purple-600 animate-bounce" />
              </div>
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            页面未找到
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            抱歉，您访问的页面不存在或已被移除。
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Home className="w-5 h-5" />
              返回首页
            </Link>
            <Link
              href="/templates"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white text-gray-700 font-semibold rounded-xl shadow-md hover:shadow-lg border-2 border-gray-200 hover:border-purple-300 transform hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Search className="w-5 h-5" />
              浏览模板
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { href: '/', label: '首页' },
            { href: '/templates', label: '模板库' },
            { href: '/editor', label: '编辑器' },
            { href: '/dashboard', label: 'Dashboard' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-3 bg-white/60 backdrop-blur-sm rounded-xl text-gray-700 font-medium hover:bg-white hover:shadow-md transition-all border border-white/20"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
