'use client';

import { neonClient } from '@/lib/neon/client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Zap,
  Cloud,
  Download,
  GitBranch,
  PieChart,
  Users,
  TrendingUp,
  Code2,
  Layers,
  Share2,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export default function HomePage() {
  const { data: session, isPending } = neonClient.auth.useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push('/dashboard');
    }
  }, [session, router]);

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500">
        <div className="relative">
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-white"></div>
          <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-white animate-pulse" />
        </div>
      </div>
    );
  }

  if (session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Header */}
      <header className="relative backdrop-blur-sm bg-white/70 shadow-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Mermaid Better
              </h1>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => router.push('/login')}
                className="px-5 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => router.push('/register')}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md mb-8 border border-purple-100">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium text-gray-700">Powered by Monaco & Mermaid.js</span>
          </div>

          {/* Main Heading */}
          <h2 className="text-6xl md:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
            Create Beautiful
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Diagrams with Ease
            </span>
          </h2>

          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            The most powerful Mermaid diagram platform with real-time preview,
            cloud storage, and seamless collaboration.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button
              onClick={() => router.push('/register')}
              className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => router.push('/editor')}
              className="px-8 py-4 bg-white/80 backdrop-blur-sm text-gray-900 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all border-2 border-gray-200 hover:border-purple-300"
            >
              Try Live Editor
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                1000+
              </div>
              <div className="text-sm text-gray-600 font-medium">Active Users</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                10K+
              </div>
              <div className="text-sm text-gray-600 font-medium">Diagrams Created</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent mb-2">
                12
              </div>
              <div className="text-sm text-gray-600 font-medium">Templates</div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-32">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">Everything You Need</h3>
            <p className="text-xl text-gray-600">Professional diagram tools at your fingertips</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 hover:shadow-2xl hover:scale-[1.02] transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <Code2 className="w-7 h-7 text-white" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-3">Real-time Editor</h4>
              <p className="text-gray-600 leading-relaxed">
                Monaco-powered code editor with instant preview. Watch your diagrams come to life as you type.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 hover:shadow-2xl hover:scale-[1.02] transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <Cloud className="w-7 h-7 text-white" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-3">Cloud Storage</h4>
              <p className="text-gray-600 leading-relaxed">
                Secure cloud storage powered by Neon. Access your diagrams from anywhere, anytime.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 hover:shadow-2xl hover:scale-[1.02] transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <Download className="w-7 h-7 text-white" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-3">Export Anywhere</h4>
              <p className="text-gray-600 leading-relaxed">
                Export as PNG, SVG, or copy code. Perfect for documentation, presentations, and more.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 hover:shadow-2xl hover:scale-[1.02] transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <Layers className="w-7 h-7 text-white" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-3">Template Library</h4>
              <p className="text-gray-600 leading-relaxed">
                12 professionally designed templates. Start quickly and customize to your needs.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 hover:shadow-2xl hover:scale-[1.02] transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <Share2 className="w-7 h-7 text-white" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-3">Share & Collaborate</h4>
              <p className="text-gray-600 leading-relaxed">
                Generate shareable links instantly. Collaborate with your team in real-time.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 hover:shadow-2xl hover:scale-[1.02] transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-3">Version History</h4>
              <p className="text-gray-600 leading-relaxed">
                Track changes and restore previous versions. Never lose your work again.
              </p>
            </div>
          </div>
        </div>

        {/* Diagram Types */}
        <div className="mt-32">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">All Diagram Types Supported</h3>
            <p className="text-xl text-gray-600">From flowcharts to complex architectures</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Flowcharts', icon: GitBranch },
              { name: 'Sequence Diagrams', icon: Layers },
              { name: 'Class Diagrams', icon: Code2 },
              { name: 'ER Diagrams', icon: Share2 },
              { name: 'Gantt Charts', icon: TrendingUp },
              { name: 'Pie Charts', icon: PieChart },
              { name: 'User Journeys', icon: Users },
              { name: 'Mind Maps', icon: Sparkles },
            ].map(({ name, icon: Icon }) => (
              <div
                key={name}
                className="group bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center shadow-md border border-white/20 hover:shadow-xl hover:scale-[1.05] transition-all cursor-pointer"
              >
                <Icon className="w-8 h-8 mx-auto mb-3 text-purple-600 group-hover:text-blue-600 transition-colors" />
                <p className="font-semibold text-gray-900">{name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-32 text-center">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-16 shadow-2xl">
            <Sparkles className="w-16 h-16 text-white mx-auto mb-6 animate-pulse" />
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Create Amazing Diagrams?
            </h3>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of developers and teams already using Mermaid Better
            </p>
            <button
              onClick={() => router.push('/register')}
              className="group px-10 py-5 bg-white text-gray-900 text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-[1.05] active:scale-[0.98] transition-all flex items-center gap-3 mx-auto"
            >
              Start Creating Now
              <CheckCircle2 className="w-6 h-6 text-green-600 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative backdrop-blur-sm bg-white/70 mt-32 border-t border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Mermaid Better
              </span>
            </div>
            <p className="text-gray-600 text-center">
              Built with Next.js, Mermaid.js, Monaco Editor, and Neon
            </p>
            <p className="text-gray-500 text-sm">
              © 2024 Mermaid Better. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
