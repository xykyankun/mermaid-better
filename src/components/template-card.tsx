'use client';

import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import type { Template } from '@/lib/neon/schema';
import { ArrowRight, Sparkles } from 'lucide-react';

interface TemplateCardProps {
  template: Template;
  onUseTemplate: (template: Template) => void;
}

export default function TemplateCard({ template, onUseTemplate }: TemplateCardProps) {
  const previewRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!previewRef.current) return;

    const renderDiagram = async () => {
      try {
        const { svg } = await mermaid.render(`template-${template.id}`, template.content);
        if (previewRef.current) {
          previewRef.current.innerHTML = svg;
        }
      } catch (error) {
        console.error('Mermaid rendering error:', error);
        if (previewRef.current) {
          previewRef.current.innerHTML = '<div class="text-red-500 text-sm">Preview unavailable</div>';
        }
      }
    };

    renderDiagram();
  }, [template.id, template.content]);

  const getCategoryGradient = (category: string) => {
    const gradients: Record<string, string> = {
      basic: 'from-blue-500 to-blue-600',
      advanced: 'from-purple-500 to-purple-600',
      technical: 'from-green-500 to-green-600',
      business: 'from-orange-500 to-orange-600',
    };
    return gradients[category] || 'from-gray-500 to-gray-600';
  };

  const getCategoryTextColor = (category: string) => {
    const colors: Record<string, string> = {
      basic: 'text-blue-700',
      advanced: 'text-purple-700',
      technical: 'text-green-700',
      business: 'text-orange-700',
    };
    return colors[category] || 'text-gray-700';
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      flowchart: '📊',
      sequence: '🔄',
      class: '📦',
      er: '🗄️',
      gantt: '📅',
      git: '🌿',
      pie: '🥧',
      journey: '🗺️',
      state: '⚡',
    };
    return icons[type] || '📄';
  };

  return (
    <div
      className={`group relative bg-white/80 backdrop-blur-sm border-2 rounded-2xl p-5 shadow-lg hover:shadow-2xl transition-all cursor-pointer transform hover:scale-[1.03] ${
        isHovered ? 'border-purple-300' : 'border-white/20'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onUseTemplate(template)}
    >
      {/* Gradient Overlay on Hover */}
      {isHovered && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/50 to-pink-50/50 rounded-2xl pointer-events-none" />
      )}

      {/* Preview */}
      <div className="relative h-52 mb-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden flex items-center justify-center border border-gray-200">
        <div
          ref={previewRef}
          className="mermaid-preview w-full h-full flex items-center justify-center p-2"
          style={{
            transform: 'scale(0.7)',
            transformOrigin: 'center',
          }}
        />
        {isHovered && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        )}
      </div>

      {/* Content */}
      <div className="relative">
        {/* Category Badge */}
        <div className="flex items-center gap-2 mb-3">
          <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${getCategoryGradient(template.category)} animate-pulse`} />
          <span className={`text-xs font-bold uppercase tracking-wider ${getCategoryTextColor(template.category)}`}>
            {template.category}
          </span>
        </div>

        {/* Title and Type */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2 group-hover:text-purple-700 transition-colors">
          <span>{getTypeIcon(template.type)}</span>
          <span className="line-clamp-1">{template.title}</span>
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
          {template.description}
        </p>

        {/* Tags */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 font-medium border border-gray-200">
            {template.type}
          </span>
          {isHovered && (
            <Sparkles className="w-4 h-4 text-purple-500 animate-pulse" />
          )}
        </div>

        {/* Use Button */}
        <button
          className={`w-full py-3 rounded-xl font-semibold transition-all transform flex items-center justify-center gap-2 ${
            isHovered
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-100 opacity-100'
              : 'bg-gray-100 text-gray-700 scale-95 opacity-0'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onUseTemplate(template);
          }}
        >
          Use Template
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
