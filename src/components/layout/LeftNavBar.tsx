import React from 'react';
import { cn } from '@/lib/utils';
import {
  Bot,
  FlaskConical,
  BookOpen,
  Users,
  MessageCircle,
  BarChart3,
  Rocket,
  HelpCircle,
} from 'lucide-react';

// Astra Logo component - matches the official logo from Astra DSM 2.0
// Size: 32x32px as per design specifications
const AstraLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    className={className}
    width="32" 
    height="32" 
    viewBox="0 0 32 32" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Outer hexagon shape with gradient */}
    <path 
      d="M16 1L29.856 8.5V23.5L16 31L2.144 23.5V8.5L16 1Z" 
      fill="url(#astra-logo-gradient)"
    />
    {/* Inner hexagon overlay */}
    <path 
      d="M16 5L25.928 10.25V20.75L16 26L6.072 20.75V10.25L16 5Z" 
      fill="white"
      fillOpacity="0.15"
    />
    {/* Center hexagon (brightest) */}
    <path 
      d="M16 9L22 12.5V19.5L16 23L10 19.5V12.5L16 9Z" 
      fill="white"
      fillOpacity="0.9"
    />
    {/* Gradient definition */}
    <defs>
      <linearGradient 
        id="astra-logo-gradient" 
        x1="2" 
        y1="1" 
        x2="30" 
        y2="31" 
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0%" stopColor="#2C4FD7"/>
        <stop offset="50%" stopColor="#1C6AFB"/>
        <stop offset="100%" stopColor="#2C50D9"/>
      </linearGradient>
    </defs>
  </svg>
);

interface NavItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  href?: string;
}

interface LeftNavBarProps {
  activeItem?: string;
  onItemClick?: (id: string) => void;
}

const navItems: NavItem[] = [
  { id: 'conversations', icon: <Bot className="w-5 h-5" />, label: 'Conversations' },
  { id: 'testing', icon: <FlaskConical className="w-5 h-5" />, label: 'Testing' },
  { id: 'knowledge', icon: <BookOpen className="w-5 h-5" />, label: 'Knowledge Base' },
  { id: 'leads', icon: <Users className="w-5 h-5" />, label: 'Leads' },
  { id: 'chat', icon: <MessageCircle className="w-5 h-5" />, label: 'Chat' },
  { id: 'analytics', icon: <BarChart3 className="w-5 h-5" />, label: 'Analytics' },
];

const bottomNavItems: NavItem[] = [
  { id: 'upgrade', icon: <Rocket className="w-5 h-5" />, label: 'Upgrade' },
  { id: 'help', icon: <HelpCircle className="w-5 h-5" />, label: 'Help' },
];

export const LeftNavBar: React.FC<LeftNavBarProps> = ({
  activeItem = 'testing',
  onItemClick,
}) => {
  return (
    <nav className="w-16 h-full bg-gray-50 flex flex-col items-center">
      {/* Logo - 32x32px as per design system */}
      <div className="h-[54px] flex items-center justify-center">
        <AstraLogo className="w-8 h-8" />
      </div>

      {/* Main navigation */}
      <div className="flex-1 flex flex-col gap-1 py-1.5 w-full px-3">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onItemClick?.(item.id)}
            className={cn(
              'w-full h-10 flex items-center justify-center rounded-md transition-colors',
              activeItem === item.id
                ? 'bg-blue-100 border border-blue-300 text-blue-600'
                : 'text-gray-500 hover:bg-gray-100'
            )}
            title={item.label}
          >
            {item.icon}
          </button>
        ))}
      </div>

      {/* Bottom navigation */}
      <div className="flex flex-col gap-2 items-center pb-3 w-full px-3">
        {bottomNavItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onItemClick?.(item.id)}
            className={cn(
              'w-full h-10 flex items-center justify-center rounded-md transition-colors',
              activeItem === item.id
                ? 'bg-blue-100 border border-blue-300 text-blue-600'
                : 'text-gray-500 hover:bg-gray-100'
            )}
            title={item.label}
          >
            {item.icon}
          </button>
        ))}

        {/* User avatar */}
        <div 
          className="w-10 h-10 rounded-md flex items-center justify-center text-white text-lg font-medium"
          style={{ background: 'linear-gradient(100deg, #2C4FD7 8.95%, #1C6AFB 53.88%, #2C50D9 90.15%)' }}
        >
          A
        </div>
      </div>
    </nav>
  );
};
