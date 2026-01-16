import * as Icons from 'lucide-react';
import React from 'react';

interface CategoryCardProps {
  name: string;
  icon: string;
  onClick?: () => void;
}

export function CategoryCard({ name, icon, onClick }: CategoryCardProps) {
  // Dynamic icon loading logic (preserved from your code)
  const Icon = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[icon] || Icons.Package;

  return (
    <button
      onClick={onClick}
      className="group flex flex-col items-center gap-3 min-w-[100px] p-2"
    >
      {/* The White Square Card */}
      <div className="w-24 h-24 flex items-center justify-center bg-white rounded-[1.5rem] shadow-sm border border-gray-100 transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-1 group-hover:border-blue-100 group-active:scale-95">
        
        {/* The Inner Blue Circle */}
        <div className="w-12 h-12 flex items-center justify-center bg-blue-50 rounded-full group-hover:bg-blue-100 transition-colors">
          <Icon className="w-6 h-6 text-blue-500" />
        </div>
        
      </div>

      {/* Label Text */}
      <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">
        {name}
      </span>
    </button>
  );
}