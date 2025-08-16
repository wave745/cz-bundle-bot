import React from 'react';

export const CaesarBotLogo: React.FC<{ size?: 'small' | 'medium' | 'large' }> = ({ size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-10 h-10',
    large: 'w-12 h-12'
  };

  const textSizes = {
    small: { main: 'text-sm', sub: 'text-xs' },
    medium: { main: 'text-lg', sub: 'text-xs' },
    large: { main: 'text-xl', sub: 'text-sm' }
  };

  return (
    <div className="bg-[#050a0e] rounded-lg p-3 border border-[#FFD70020] shadow-lg">
      <div className="flex items-center space-x-3">
        {/* Logo Icon - CaesarBotLogo.png */}
        <div className={`${sizeClasses[size]} relative`}>
          <div className="absolute inset-0 flex items-center justify-center shadow-lg logo-glow">
            <img 
              src="/CaesarBotLogo.png" 
              alt="CAESAR BOT Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          {/* Glowing effect */}
          <div className="absolute inset-0 bg-[#FFD700] rounded-full opacity-20 animate-pulse"></div>
        </div>
        
        {/* Logo Text */}
        <div className="flex flex-col">
          <div className={`${textSizes[size].main} font-bold text-[#FFD700] gold-text-glow font-mono tracking-wider`}>
            CAESAR
          </div>
          <div className={`${textSizes[size].sub} font-bold text-[#FFE4B5] font-mono tracking-widest`}>
            BOT
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaesarBotLogo;
