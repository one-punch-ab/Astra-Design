import React from 'react';
import { ChevronRight, Globe, ChevronDown, Coins, Rocket } from 'lucide-react';
import { Button } from '@/components/ui';

interface TopNavigationProps {
  breadcrumbs?: { label: string; href?: string }[];
  credits?: { used: number; total: number };
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
  breadcrumbs = [
    { label: 'Agents', href: '/agents' },
    { label: 'Aria' },
  ],
  credits = { used: 100, total: 100 },
}) => {
  return (
    <header className="h-[54px] bg-gray-50 flex items-center justify-between px-4">
      {/* Left: Breadcrumbs */}
      <div className="flex items-center gap-3">
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            {index > 0 && <ChevronRight className="w-5 h-5 text-gray-400" />}
            <div className="flex items-center gap-1.5">
              {crumb.href ? (
                <a 
                  href={crumb.href}
                  className="text-base font-semibold text-blue-600 hover:underline"
                >
                  {crumb.label}
                </a>
              ) : (
                <span className="text-base font-semibold text-gray-900">
                  {crumb.label}
                </span>
              )}
              {index === breadcrumbs.length - 1 && (
                <>
                  <button className="p-1.5 border border-gray-300 rounded-full hover:bg-gray-100">
                    <Globe className="w-4 h-4 text-gray-500" />
                  </button>
                  <button className="p-1.5 hover:bg-gray-100 rounded">
                    <ChevronDown className="w-3 h-3 text-gray-500" />
                  </button>
                </>
              )}
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* Right: Credits and CTAs */}
      <div className="flex items-center gap-3">
        {/* Credits */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-600">Remaining credits</span>
          <div className="flex items-center gap-1.5 px-1.5 py-0.5 bg-yellow-50 border border-yellow-400 rounded-full">
            <Coins className="w-3.5 h-3.5 text-yellow-600" />
            <span className="text-xs font-medium text-gray-700">
              {credits.used}/{credits.total}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-[30px] bg-gray-200" />

        {/* Getting started button */}
        <Button variant="secondary" size="sm">
          <Rocket className="w-4 h-4" />
          Getting started
        </Button>
      </div>
    </header>
  );
};
