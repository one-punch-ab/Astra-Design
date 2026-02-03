import React, { useEffect, useState, useRef, useMemo } from 'react';
import { X, Rocket } from 'lucide-react';
import { cn } from '@/lib/utils';
import { InstallAgentModal } from './InstallAgentModal';

interface EfficiencyBannerProps {
  efficiencyScore: number;
  onDismiss: () => void;
  runCount?: number;
}

// Confetti colors - celebratory palette
const CONFETTI_COLORS = ['#10b981', '#14b8a6', '#06b6d4', '#fbbf24', '#f59e0b', '#8b5cf6', '#ec4899', '#f43f5e'];

// Confetti piece component
const ConfettiPiece: React.FC<{ delay: number; left: number; color: string }> = ({ delay, left, color }) => (
  <div
    className="confetti-piece"
    style={{
      left: `${left}%`,
      backgroundColor: color,
      animationDelay: `${delay}ms`,
    }}
  />
);

export const EfficiencyBanner: React.FC<EfficiencyBannerProps> = ({
  efficiencyScore,
  onDismiss,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const hasTriggeredConfetti = useRef(false);

  // Memoize confetti pieces so they don't regenerate on re-renders
  const confettiPieces = useMemo(() => 
    Array.from({ length: 80 }, (_, i) => ({
      id: i,
      delay: Math.random() * 2500,
      left: Math.random() * 100,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    })),
  []);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Trigger confetti celebration when banner becomes visible
  useEffect(() => {
    if (isVisible && !hasTriggeredConfetti.current) {
      hasTriggeredConfetti.current = true;
      setShowConfetti(true);
      
      // Stop confetti after animation completes
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  const handleDismiss = () => {
    setIsExiting(true);
    setShowConfetti(false);
    setTimeout(() => {
      onDismiss();
    }, 300);
  };

  return (
    <>
      {/* Confetti overlay */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {confettiPieces.map((piece) => (
            <ConfettiPiece
              key={piece.id}
              delay={piece.delay}
              left={piece.left}
              color={piece.color}
            />
          ))}
        </div>
      )}
      
      <div
        className={cn(
          'relative overflow-hidden rounded-lg border transition-all duration-300 ease-out',
          'bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50',
          'border-emerald-200',
          isVisible && !isExiting
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-2'
        )}
      >
        {/* Animated background shimmer */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
        
        <div className="relative px-4 py-3 flex items-center gap-4">
          {/* Icon */}
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-200/50">
            <Rocket className="w-5 h-5 text-white" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900">
              Your agent is ready to go live!
            </h3>
            <p className="text-sm text-gray-700 mt-0.5">
              Your agent scored{' '}
              <span className="font-bold text-gray-900">{efficiencyScore}%</span>
              {' '}and is ready to handle customer conversations like a pro.{' '}
              <button 
                onClick={() => setShowInstallModal(true)}
                className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
              >
                Install agent
              </button>
            </p>
          </div>

          {/* Score badge */}
          <div className="flex-shrink-0 hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-full border border-emerald-200 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-bold text-emerald-700">{efficiencyScore}%</span>
          </div>

          {/* Dismiss button */}
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 p-1.5 rounded-full text-emerald-600 hover:text-emerald-800 hover:bg-emerald-100 transition-colors"
            aria-label="Dismiss banner"
          >
          <X className="w-4 h-4" />
        </button>
        </div>
      </div>

      {/* Install Agent Modal */}
      <InstallAgentModal 
        open={showInstallModal} 
        onOpenChange={setShowInstallModal} 
      />
    </>
  );
};
