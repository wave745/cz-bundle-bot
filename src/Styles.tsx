import React, { useState } from 'react';

// Tooltip Component with cyberpunk styling
export const WalletTooltip: React.FC<{ 
  children: React.ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}> = ({ 
  children, 
  content,
  position = 'top'
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && (
        <div className={`absolute z-50 ${positionClasses[position]}`}>
          <div className="bg-[#051014] cyberpunk-border text-[#FFD700] text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
            {content}
          </div>
        </div>
      )}
    </div>
  );
};

// Define the application styles that will be injected
export const initStyles = () => {
  return `
  /* Background grid animation */
  @keyframes grid-pulse {
    0% { opacity: 0.1; }
    50% { opacity: 0.15; }
    100% { opacity: 0.1; }
  }

  .cyberpunk-bg {
    background-color: #050a0e;
    background-image: 
      linear-gradient(rgba(255, 215, 0, 0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 215, 0, 0.05) 1px, transparent 1px);
    background-size: 20px 20px;
    background-position: center center;
    position: relative;
    overflow: hidden;
  }

  .cyberpunk-bg::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      linear-gradient(rgba(255, 215, 0, 0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 215, 0, 0.05) 1px, transparent 1px);
    background-size: 20px 20px;
    background-position: center center;
    animation: grid-pulse 4s infinite;
    z-index: 0;
  }

  /* Glowing border effect */
  @keyframes border-glow {
    0% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.5), inset 0 0 5px rgba(255, 215, 0, 0.2); }
    50% { box-shadow: 0 0 10px rgba(255, 215, 0, 0.8), inset 0 0 10px rgba(255, 215, 0, 0.3); }
    100% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.5), inset 0 0 5px rgba(255, 215, 0, 0.2); }
  }

  .cyberpunk-border {
    border: 1px solid rgba(255, 215, 0, 0.5);
    border-radius: 4px;
    animation: border-glow 4s infinite;
  }

  /* Button hover animations */
  @keyframes btn-glow {
    0% { box-shadow: 0 0 5px #FFD700; }
    50% { box-shadow: 0 0 15px #FFD700; }
    100% { box-shadow: 0 0 5px #FFD700; }
  }

  .cyberpunk-btn {
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .cyberpunk-btn:hover {
    animation: btn-glow 2s infinite;
  }

  .cyberpunk-btn::after {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      to bottom right,
      rgba(255, 215, 0, 0) 0%,
      rgba(255, 215, 0, 0.3) 50%,
      rgba(255, 215, 0, 0) 100%
    );
    transform: rotate(45deg);
    transition: all 0.5s ease;
    opacity: 0;
  }

  .cyberpunk-btn:hover::after {
    opacity: 1;
    transform: rotate(45deg) translate(50%, 50%);
  }

  /* Glitch effect for text */
  @keyframes glitch {
    2%, 8% { transform: translate(-2px, 0) skew(0.3deg); }
    4%, 6% { transform: translate(2px, 0) skew(-0.3deg); }
    62%, 68% { transform: translate(0, 0) skew(0.33deg); }
    64%, 66% { transform: translate(0, 0) skew(-0.33deg); }
  }

  .cyberpunk-glitch {
    position: relative;
  }

  .cyberpunk-glitch:hover {
    animation: glitch 2s infinite;
  }

  /* Input focus effect */
  .cyberpunk-input:focus {
    box-shadow: 0 0 0 1px rgba(255, 215, 0, 0.7), 0 0 15px rgba(255, 215, 0, 0.5);
    transition: all 0.3s ease;
  }

  /* Card hover effect */
  .cyberpunk-card {
    transition: all 0.3s ease;
  }

  .cyberpunk-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 7px 20px rgba(0, 0, 0, 0.3), 0 0 15px rgba(255, 215, 0, 0.3);
  }

  /* Scan line effect */
  @keyframes scanline {
    0% { 
      transform: translateY(-100%);
      opacity: 0.7;
    }
    100% { 
      transform: translateY(100%);
      opacity: 0;
    }
  }

  .cyberpunk-scanline {
    position: relative;
    overflow: hidden;
  }

  .cyberpunk-scanline::before {
    content: "";
    position: absolute;
    width: 100%;
    height: 10px;
    background: linear-gradient(to bottom, 
      transparent 0%,
      rgba(255, 215, 0, 0.2) 50%,
      transparent 100%);
    z-index: 10;
    animation: scanline 8s linear infinite;
  }

  /* Split gutter styling */
  .split-custom .gutter {
    background-color: transparent;
    position: relative;
    transition: background-color 0.3s ease;
  }

  .split-custom .gutter-horizontal {
    cursor: col-resize;
  }

  .split-custom .gutter-horizontal:hover {
    background-color: rgba(2, 179, 109, 0.3);
  }

  .split-custom .gutter-horizontal::before,
  .split-custom .gutter-horizontal::after {
    content: "";
    position: absolute;
    width: 1px;
    height: 15px;
    background-color: rgba(2, 179, 109, 0.7);
    left: 50%;
    transform: translateX(-50%);
    transition: all 0.3s ease;
  }

  .split-custom .gutter-horizontal::before {
    top: calc(50% - 10px);
  }

  .split-custom .gutter-horizontal::after {
    top: calc(50% + 10px);
  }

  .split-custom .gutter-horizontal:hover::before,
  .split-custom .gutter-horizontal:hover::after {
    background-color: #FFD700;
    box-shadow: 0 0 10px rgba(2, 179, 109, 0.7);
  }

  /* Neo-futuristic table styling */
  .cyberpunk-table {
    border-collapse: separate;
    border-spacing: 0;
  }

  .cyberpunk-table thead th {
    background-color: rgba(2, 179, 109, 0.1);
    border-bottom: 2px solid rgba(2, 179, 109, 0.5);
  }

  .cyberpunk-table tbody tr {
    transition: all 0.2s ease;
  }

  .cyberpunk-table tbody tr:hover {
    background-color: rgba(2, 179, 109, 0.05);
  }

  /* Neon text effect */
  .neon-text {
    color: #FFD700;
    text-shadow: 0 0 5px rgba(2, 179, 109, 0.7);
  }

  /* Notification animation */
  @keyframes notification-slide {
    0% { transform: translateX(50px); opacity: 0; }
    10% { transform: translateX(0); opacity: 1; }
    90% { transform: translateX(0); opacity: 1; }
    100% { transform: translateX(50px); opacity: 0; }
  }

  .notification-anim {
    animation: notification-slide 4s forwards;
  }

  /* Loading animation */
  @keyframes loading-pulse {
    0% { transform: scale(0.85); opacity: 0.7; }
    50% { transform: scale(1); opacity: 1; }
    100% { transform: scale(0.85); opacity: 0.7; }
  }

  .loading-anim {
    animation: loading-pulse 1.5s infinite;
  }

  /* Button click effect */
  .cyberpunk-btn:active {
    transform: scale(0.95);
    box-shadow: 0 0 15px rgba(2, 179, 109, 0.7);
  }

  /* Menu active state */
  .menu-item-active {
    border-left: 3px solid #FFD700;
    background-color: rgba(2, 179, 109, 0.1);
  }

  /* Angle brackets for headings */
  .heading-brackets {
    position: relative;
    display: inline-block;
  }

  .heading-brackets::before,
  .heading-brackets::after {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    color: #FFD700;
    font-weight: bold;
  }

  .heading-brackets::before {
    content: ">";
    left: -15px;
  }

  .heading-brackets::after {
    content: "<";
    right: -15px;
  }

  /* Fade-in animation */
  @keyframes fadeIn {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }

  /* Enhanced Gold Particle System */
  @keyframes gold-particle-float {
    0% { 
      transform: translateY(100vh) translateX(0) rotate(0deg);
      opacity: 0;
    }
    10% { 
      opacity: 1;
    }
    90% { 
      opacity: 1;
    }
    100% { 
      transform: translateY(-100px) translateX(100px) rotate(360deg);
      opacity: 0;
    }
  }

  .gold-particle {
    position: absolute;
    width: 4px;
    height: 4px;
    background: radial-gradient(circle, #FFD700 0%, #FFA500 50%, transparent 100%);
    border-radius: 50%;
    pointer-events: none;
    z-index: 1;
    animation: gold-particle-float 8s linear infinite;
  }

  .gold-particle:nth-child(1) { animation-delay: 0s; left: 10%; }
  .gold-particle:nth-child(2) { animation-delay: 1s; left: 20%; }
  .gold-particle:nth-child(3) { animation-delay: 2s; left: 30%; }
  .gold-particle:nth-child(4) { animation-delay: 3s; left: 40%; }
  .gold-particle:nth-child(5) { animation-delay: 4s; left: 50%; }
  .gold-particle:nth-child(6) { animation-delay: 5s; left: 60%; }
  .gold-particle:nth-child(7) { animation-delay: 6s; left: 70%; }
  .gold-particle:nth-child(8) { animation-delay: 7s; left: 80%; }

  /* Enhanced Animated Gold Borders */
  @keyframes gold-border-pulse {
    0% { 
      box-shadow: 0 0 5px rgba(255, 215, 0, 0.5), inset 0 0 5px rgba(255, 215, 0, 0.2);
      border-color: rgba(255, 215, 0, 0.5);
    }
    50% { 
      box-shadow: 0 0 20px rgba(255, 215, 0, 0.8), inset 0 0 20px rgba(255, 215, 0, 0.4);
      border-color: rgba(255, 215, 0, 0.8);
    }
    100% { 
      box-shadow: 0 0 5px rgba(255, 215, 0, 0.5), inset 0 0 5px rgba(255, 215, 0, 0.2);
      border-color: rgba(255, 215, 0, 0.5);
    }
  }

  .cyberpunk-border-enhanced {
    border: 2px solid rgba(255, 215, 0, 0.5);
    border-radius: 8px;
    animation: gold-border-pulse 3s ease-in-out infinite;
    position: relative;
    overflow: hidden;
  }

  .cyberpunk-border-enhanced::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, 
      transparent 0%, 
      rgba(255, 215, 0, 0.1) 25%, 
      rgba(255, 215, 0, 0.3) 50%, 
      rgba(255, 215, 0, 0.1) 75%, 
      transparent 100%);
    border-radius: 8px;
    animation: border-sweep 4s linear infinite;
    z-index: -1;
  }

  @keyframes border-sweep {
    0% { transform: translateX(-100%) translateY(-100%); }
    100% { transform: translateX(100%) translateY(100%); }
  }

  /* Holographic Loading Spinner */
  @keyframes holographic-spin {
    0% { 
      transform: rotate(0deg);
      box-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
    }
    25% { 
      box-shadow: 0 0 30px rgba(255, 215, 0, 0.9);
    }
    50% { 
      box-shadow: 0 0 40px rgba(255, 215, 0, 1);
    }
    75% { 
      box-shadow: 0 0 30px rgba(255, 215, 0, 0.9);
    }
    100% { 
      transform: rotate(360deg);
      box-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
    }
  }

  .holographic-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid transparent;
    border-top: 3px solid #FFD700;
    border-right: 3px solid rgba(255, 215, 0, 0.5);
    border-bottom: 3px solid rgba(255, 215, 0, 0.3);
    border-radius: 50%;
    animation: holographic-spin 1s linear infinite;
    position: relative;
  }

  .holographic-spinner::before {
    content: '';
    position: absolute;
    top: -3px;
    left: -3px;
    right: -3px;
    bottom: -3px;
    border: 1px solid rgba(255, 215, 0, 0.3);
    border-radius: 50%;
    animation: holographic-spin 2s linear infinite reverse;
  }

  /* Matrix-style Gold Rain Effect */
  @keyframes matrix-gold-rain {
    0% {
      transform: translateY(-100vh) translateX(0);
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    90% {
      opacity: 1;
    }
    100% {
      transform: translateY(100vh) translateX(20px);
      opacity: 0;
    }
  }

  .matrix-gold-rain {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;
    overflow: hidden;
  }

  .matrix-gold-drop {
    position: absolute;
    color: #FFD700;
    font-family: 'Courier New', monospace;
    font-size: 14px;
    text-shadow: 0 0 5px #FFD700;
    animation: matrix-gold-rain 3s linear infinite;
  }

  /* Enhanced Button Hover Effects */
  .cyberpunk-btn-enhanced {
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    background: linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 215, 0, 0.05) 100%);
  }

  .cyberpunk-btn-enhanced:hover {
    animation: btn-glow 2s infinite;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255, 215, 0, 0.4);
  }

  .cyberpunk-btn-enhanced::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, 
      transparent 0%, 
      rgba(255, 215, 0, 0.2) 50%, 
      transparent 100%);
    transition: left 0.5s ease;
  }

  .cyberpunk-btn-enhanced:hover::before {
    left: 100%;
  }

  /* Gold Gradient Backgrounds */
  .gold-gradient-bg {
    background: linear-gradient(135deg, 
      rgba(255, 215, 0, 0.05) 0%, 
      rgba(255, 165, 0, 0.03) 25%, 
      rgba(255, 215, 0, 0.02) 50%, 
      rgba(255, 165, 0, 0.03) 75%, 
      rgba(255, 215, 0, 0.05) 100%);
    position: relative;
  }

  .gold-gradient-bg::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 50% 50%, 
      rgba(255, 215, 0, 0.1) 0%, 
      transparent 70%);
    animation: gradient-pulse 4s ease-in-out infinite;
  }

  @keyframes gradient-pulse {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 0.6; }
  }

  /* Enhanced Text Glow Effects */
  .gold-text-glow {
    text-shadow: 
      0 0 5px rgba(255, 215, 0, 0.5),
      0 0 10px rgba(255, 215, 0, 0.3),
      0 0 15px rgba(255, 215, 0, 0.2);
    animation: text-glow-pulse 3s ease-in-out infinite;
  }

  @keyframes text-glow-pulse {
    0%, 100% { 
      text-shadow: 
        0 0 5px rgba(255, 215, 0, 0.5),
        0 0 10px rgba(255, 215, 0, 0.3),
        0 0 15px rgba(255, 215, 0, 0.2);
    }
    50% { 
      text-shadow: 
        0 0 10px rgba(255, 215, 0, 0.8),
        0 0 20px rgba(255, 215, 0, 0.5),
        0 0 30px rgba(255, 215, 0, 0.3);
    }
  }

  /* Success Animation for Trades */
  @keyframes trade-success {
    0% { 
      transform: scale(0) rotate(0deg);
      opacity: 0;
    }
    50% { 
      transform: scale(1.2) rotate(180deg);
      opacity: 1;
    }
    100% { 
      transform: scale(1) rotate(360deg);
      opacity: 0;
    }
  }

  .trade-success-animation {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100px;
    height: 100px;
    background: radial-gradient(circle, #FFD700 0%, transparent 70%);
    border-radius: 50%;
    animation: trade-success 2s ease-out forwards;
    pointer-events: none;
    z-index: 9999;
  }

  /* Enhanced Scrollbar */
  .gold-scrollbar::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  .gold-scrollbar::-webkit-scrollbar-track {
    background: rgba(255, 215, 0, 0.1);
    border-radius: 4px;
  }

  .gold-scrollbar::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, #FFD700 0%, #FFA500 100%);
    border-radius: 4px;
    box-shadow: 0 0 5px rgba(255, 215, 0, 0.5);
  }

  .gold-scrollbar::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(180deg, #FFA500 0%, #FFD700 100%);
    box-shadow: 0 0 10px rgba(255, 215, 0, 0.8);
  }

  /* Logo Animations */
  .logo-glow {
    animation: logo-glow 3s ease-in-out infinite;
  }

  .logo-pulse {
    animation: logo-pulse 2s ease-in-out infinite;
  }

  @keyframes logo-glow {
    0%, 100% {
      box-shadow: 0 0 10px rgba(255, 215, 0, 0.3), 0 0 20px rgba(255, 215, 0, 0.1);
    }
    50% {
      box-shadow: 0 0 20px rgba(255, 215, 0, 0.6), 0 0 40px rgba(255, 215, 0, 0.3), 0 0 60px rgba(255, 215, 0, 0.1);
    }
  }

  @keyframes logo-pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
  }
  `;
};