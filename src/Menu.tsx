import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Tooltip Component with cyberpunk styling
export const Tooltip = ({ 
  children, 
  content,
  position = 'top'
}: { 
  children: React.ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
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

const CyberpunkServiceButton = ({ 
  icon, 
  label, 
  url,
  description 
}) => {
  const handleClick = (e) => {
    // Prevent event bubbling
    e.stopPropagation();
    
    if (url) {
      // Try using location.href as an alternative to window.open
      try {
        window.open(url, '_blank', 'noopener,noreferrer');
      } catch (error) {
        console.error("Error opening URL:", error);
        // Fallback to location.href
        window.location.href = url;
      }
    }
  };

  return (
    <Tooltip content={description || label} position="top">
      <motion.div 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex flex-col items-center w-20 p-2 hover:bg-[#FFD70020] border border-[#FFD70030] 
                  hover:border-[#FFD70060] rounded-lg cursor-pointer transition-all duration-300"
        onClick={handleClick}
      >
        <motion.div 
          className="w-10 h-10 rounded-full flex items-center justify-center mb-2 
                    bg-[#051014] border border-[#FFD70040] overflow-hidden"
          whileHover={{ borderColor: "#FFD700", boxShadow: "0 0 8px rgba(2,179,109,0.4)" }}
        >
          {icon}
        </motion.div>
        <span className="text-[#FFE4B5] text-xs font-mono tracking-wider">{label}</span>
      </motion.div>
    </Tooltip>
  );
};

// Dropdown component that uses portal to render outside the normal DOM hierarchy
const DropdownPortal = ({ isOpen, buttonRef, onClose, children }) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef(null);
  
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX
      });
      
      // Add event listener to close dropdown when clicking outside
      const handleClickOutside = (event) => {
        if (
          dropdownRef.current && 
          buttonRef.current && 
          !buttonRef.current.contains(event.target)
        ) {
          onClose();
        }
      };
      
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen, buttonRef, onClose]);
  
  if (!isOpen) return null;
  
  return createPortal(
    <div 
      ref={dropdownRef}
      className="fixed z-50" 
      style={{ 
        top: `${position.top}px`, 
        left: `${position.left}px`,
      }}
    >
      {children}
    </div>,
    document.body
  );
};

// Main component
const ServiceSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);

  const toggleSelector = () => {
    setIsOpen(!isOpen);
  };
  
  const closeSelector = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block">
      {/* Main button to open the selector */}
      <Tooltip content="Services" position="bottom">
        <button
          ref={buttonRef}
          onClick={toggleSelector}
          className="flex items-center justify-center p-2 overflow-hidden
                  border border-[#FFD70030] hover:border-[#FFD70060] rounded 
                  transition-all duration-300 cyberpunk-btn"
        >
        <motion.div 
          className="flex items-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Gold-themed Services Icon */}
          <div className="w-8 h-8 bg-gradient-to-br from-[#FFD700] to-[#B8860B] rounded-lg flex items-center justify-center shadow-lg">
            <svg 
              viewBox="0 0 24 24" 
              width="20" 
              height="20" 
              className="text-[#050a0e]"
              fill="currentColor"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
        </motion.div>
        </button>
      </Tooltip>

      {/* Service selector modal using portal */}
      <AnimatePresence>
        {isOpen && (
          <DropdownPortal 
            isOpen={isOpen} 
            buttonRef={buttonRef}
            onClose={closeSelector}
          >
            <motion.div 
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 10, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="mt-2 bg-[#050a0e] rounded-lg p-4 shadow-lg 
                        w-80 border border-[#FFD70040] cyberpunk-border
                        backdrop-blur-sm"
            >
              <div className="relative">
                {/* Cyberpunk scanline effect */}
                <div className="absolute top-0 left-0 w-full h-full cyberpunk-scanline pointer-events-none z-10 opacity-30"></div>
                
                {/* Glow accents in corners */}
                <div className="absolute top-0 right-0 w-3 h-3 bg-[#FFD700] opacity-50 rounded-full blur-md"></div>
                <div className="absolute bottom-0 left-0 w-3 h-3 bg-[#FFD700] opacity-50 rounded-full blur-md"></div>
                

              </div>
            </motion.div>
          </DropdownPortal>
        )}
      </AnimatePresence>
    </div>
  );
};

// Export both names for compatibility
export { ServiceSelector as CyberpunkServiceSelector };
export default ServiceSelector;