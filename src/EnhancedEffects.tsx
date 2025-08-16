import React, { useEffect, useState } from 'react';

// Gold Particle System Component
export const GoldParticleSystem: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      <div className="gold-particle" style={{ left: '10%', animationDelay: '0s' }}></div>
      <div className="gold-particle" style={{ left: '20%', animationDelay: '1s' }}></div>
      <div className="gold-particle" style={{ left: '30%', animationDelay: '2s' }}></div>
      <div className="gold-particle" style={{ left: '40%', animationDelay: '3s' }}></div>
      <div className="gold-particle" style={{ left: '50%', animationDelay: '4s' }}></div>
      <div className="gold-particle" style={{ left: '60%', animationDelay: '5s' }}></div>
      <div className="gold-particle" style={{ left: '70%', animationDelay: '6s' }}></div>
      <div className="gold-particle" style={{ left: '80%', animationDelay: '7s' }}></div>
    </div>
  );
};

// Matrix-style Gold Rain Effect
export const MatrixGoldRain: React.FC = () => {
  const [drops, setDrops] = useState<Array<{ id: number; left: number; delay: number; char: string }>>([]);

  useEffect(() => {
    const characters = ['$', '₿', '●', '◆', '★', '⚡', '💎', '🏆'];
    const newDrops = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 3,
      char: characters[Math.floor(Math.random() * characters.length)]
    }));
    setDrops(newDrops);
  }, []);

  return (
    <div className="matrix-gold-rain">
      {drops.map((drop) => (
        <div
          key={drop.id}
          className="matrix-gold-drop"
          style={{
            left: `${drop.left}%`,
            animationDelay: `${drop.delay}s`,
            animationDuration: `${3 + Math.random() * 2}s`
          }}
        >
          {drop.char}
        </div>
      ))}
    </div>
  );
};

// Holographic Loading Spinner
export const HolographicSpinner: React.FC<{ size?: 'small' | 'medium' | 'large' }> = ({ size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-10 h-10',
    large: 'w-16 h-16'
  };

  return (
    <div className={`holographic-spinner ${sizeClasses[size]} mx-auto`}></div>
  );
};

// Trade Success Animation
export const TradeSuccessAnimation: React.FC<{ isVisible: boolean; onComplete: () => void }> = ({ 
  isVisible, 
  onComplete 
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onComplete();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="trade-success-animation">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-4xl text-[#FFD700] font-bold gold-text-glow">✓</div>
      </div>
    </div>
  );
};

// Enhanced Gold Border Component
export const EnhancedGoldBorder: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`cyberpunk-border-enhanced ${className}`}>
      {children}
    </div>
  );
};

// Gold Gradient Background Component
export const GoldGradientBackground: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`gold-gradient-bg ${className}`}>
      {children}
    </div>
  );
};

// Enhanced Button Component
export const EnhancedGoldButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}> = ({ 
  children, 
  onClick, 
  className = '', 
  disabled = false,
  type = 'button'
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`cyberpunk-btn-enhanced ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {children}
    </button>
  );
};

// Gold Text Glow Component
export const GoldTextGlow: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <span className={`gold-text-glow ${className}`}>
      {children}
    </span>
  );
};

// Enhanced Scrollable Container
export const GoldScrollableContainer: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`gold-scrollbar overflow-y-auto ${className}`}>
      {children}
    </div>
  );
};

// Success Toast with Gold Animation
export const GoldSuccessToast: React.FC<{ message: string; isVisible: boolean; onClose: () => void }> = ({ 
  message, 
  isVisible, 
  onClose 
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="cyberpunk-border-enhanced bg-[#050a0e] p-4 rounded-lg shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 bg-[#FFD700] rounded-full flex items-center justify-center">
            <span className="text-[#050a0e] font-bold text-sm">✓</span>
          </div>
          <span className="text-[#FFE4B5] font-mono">{message}</span>
        </div>
      </div>
    </div>
  );
};

// Loading State with Holographic Spinner
export const GoldLoadingState: React.FC<{ message?: string; size?: 'small' | 'medium' | 'large' }> = ({ 
  message = 'Loading...', 
  size = 'medium' 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <HolographicSpinner size={size} />
      <p className="text-[#FFE4B5] font-mono gold-text-glow">{message}</p>
    </div>
  );
};

// Enhanced Card Component
export const EnhancedGoldCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`cyberpunk-border-enhanced gold-gradient-bg p-6 ${className}`}>
      {children}
    </div>
  );
};

// Success trigger function for trades
export const triggerTradeSuccess = (callback: () => void) => {
  callback();
};

// Enhanced Gold Loading State with Particles
export const GoldLoadingStateWithParticles: React.FC<{ message?: string; size?: 'small' | 'medium' | 'large' }> = ({ 
  message = 'Loading...', 
  size = 'medium' 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4 relative">
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="gold-particle" style={{ left: '20%', animationDelay: '0s' }}></div>
        <div className="gold-particle" style={{ left: '40%', animationDelay: '1s' }}></div>
        <div className="gold-particle" style={{ left: '60%', animationDelay: '2s' }}></div>
        <div className="gold-particle" style={{ left: '80%', animationDelay: '3s' }}></div>
      </div>
      
      <HolographicSpinner size={size} />
      <p className="text-[#FFE4B5] font-mono gold-text-glow relative z-10">{message}</p>
    </div>
  );
};

// Enhanced Gold Card with Hover Effects
export const EnhancedGoldCardWithHover: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`cyberpunk-border-enhanced gold-gradient-bg p-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#FFD70020] ${className}`}>
      {children}
    </div>
  );
};

// Gold Progress Bar
export const GoldProgressBar: React.FC<{ progress: number; className?: string }> = ({ 
  progress, 
  className = '' 
}) => {
  return (
    <div className={`w-full bg-[#091217] rounded-full h-2 overflow-hidden ${className}`}>
      <div 
        className="h-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] transition-all duration-500 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      >
        <div className="h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
      </div>
    </div>
  );
};

// Gold Status Indicator
export const GoldStatusIndicator: React.FC<{ status: 'success' | 'error' | 'warning' | 'info'; message: string }> = ({ 
  status, 
  message 
}) => {
  const statusConfig = {
    success: { color: '#FFD700', icon: '✓' },
    error: { color: '#FF6B6B', icon: '✗' },
    warning: { color: '#FFA500', icon: '⚠' },
    info: { color: '#87CEEB', icon: 'ℹ' }
  };

  const config = statusConfig[status];

  return (
    <div className="flex items-center space-x-2 p-2 bg-[#091217] border border-[#FFD70030] rounded-lg">
      <div 
        className="w-3 h-3 rounded-full animate-pulse"
        style={{ backgroundColor: config.color }}
      ></div>
      <span className="text-[#FFE4B5] font-mono text-sm">{message}</span>
    </div>
  );
};

// Gold Animated Counter
export const GoldAnimatedCounter: React.FC<{ value: number; label: string; className?: string }> = ({ 
  value, 
  label, 
  className = '' 
}) => {
  const [displayValue, setDisplayValue] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setDisplayValue(prev => {
        if (prev < value) {
          return Math.min(value, prev + Math.ceil((value - prev) / 10));
        }
        return value;
      });
    }, 50);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className={`text-center ${className}`}>
      <div className="text-2xl font-bold text-[#FFD700] gold-text-glow font-mono">
        {displayValue.toLocaleString()}
      </div>
      <div className="text-xs text-[#FFE4B5] font-mono uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
};

// Gold Floating Action Button
export const GoldFloatingActionButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}> = ({ 
  children, 
  onClick, 
  className = '', 
  position = 'bottom-right' 
}) => {
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4'
  };

  return (
    <button
      onClick={onClick}
      className={`fixed ${positionClasses[position]} z-50 w-12 h-12 bg-[#FFD700] hover:bg-[#FFA500] text-[#050a0e] rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 ${className}`}
    >
      {children}
    </button>
  );
};

// Gold Data Table
export const GoldDataTable: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`overflow-hidden rounded-lg border border-[#FFD70030] ${className}`}>
      <div className="bg-[#091217] overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[#0a1419] border-b border-[#FFD70020]">
              {children}
            </tr>
          </thead>
        </table>
      </div>
    </div>
  );
};

// Gold Table Header
export const GoldTableHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <th className={`px-4 py-3 text-left text-xs font-medium text-[#FFE4B5] uppercase tracking-wider font-mono ${className}`}>
      {children}
    </th>
  );
};

// Gold Table Cell
export const GoldTableCell: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <td className={`px-4 py-3 text-sm font-mono text-[#FFE4B5] border-b border-[#FFD70010] ${className}`}>
      {children}
    </td>
  );
};

// Gold Badge
export const GoldBadge: React.FC<{ children: React.ReactNode; variant?: 'default' | 'success' | 'warning' | 'error'; className?: string }> = ({ 
  children, 
  variant = 'default',
  className = '' 
}) => {
  const variantClasses = {
    default: 'bg-[#FFD70020] text-[#FFD700] border-[#FFD70030]',
    success: 'bg-[#4CAF5020] text-[#4CAF50] border-[#4CAF5030]',
    warning: 'bg-[#FF980020] text-[#FF9800] border-[#FF980030]',
    error: 'bg-[#F4433620] text-[#F44336] border-[#F4433630]'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
};

// Gold Divider
export const GoldDivider: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`h-px bg-gradient-to-r from-transparent via-[#FFD70050] to-transparent ${className}`}></div>
  );
};

// Gold Section Header
export const GoldSectionHeader: React.FC<{ title: string; subtitle?: string; className?: string }> = ({ 
  title, 
  subtitle, 
  className = '' 
}) => {
  return (
    <div className={`mb-6 ${className}`}>
      <h2 className="text-xl font-bold text-[#FFD700] gold-text-glow font-mono mb-2">
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm text-[#FFE4B5] font-mono opacity-80">
          {subtitle}
        </p>
      )}
      <GoldDivider className="mt-3" />
    </div>
  );
};
