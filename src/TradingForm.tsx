import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Loader2, Move, Edit3, Check, ClipboardList } from 'lucide-react';

// Helper function to format numbers with k, M, B suffixes
const formatNumber = (num) => {
  const number = parseFloat(num);
  if (isNaN(number) || number === 0) return "0";
  
  const absNum = Math.abs(number);
  
  if (absNum >= 1000000000) {
    return (number / 1000000000).toFixed(2).replace(/\.?0+$/, '') + 'B';
  } else if (absNum >= 1000000) {
    return (number / 1000000).toFixed(2).replace(/\.?0+$/, '') + 'M';
  } else if (absNum >= 1000) {
    return (number / 1000).toFixed(2).replace(/\.?0+$/, '') + 'k';
  } else if (absNum >= 1) {
    return number.toFixed(2).replace(/\.?0+$/, '');
  } else {
    return number.toFixed(6).replace(/\.?0+$/, '');
  }
};

// Preset Button component
const PresetButton = ({ 
  value, 
  onExecute, 
  onChange,
  isLoading, 
  variant = 'buy',
  isEditMode,
  index 
}) => {
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef(null);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditMode && inputRef.current) {
      (inputRef.current as HTMLInputElement)?.focus();
    }
  }, [isEditMode]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const newValue = parseFloat(editValue);
      if (!isNaN(newValue) && newValue > 0) {
        onChange(newValue.toString());
      }
    } else if (e.key === 'Escape') {
      setEditValue(value);
    }
  };

  const handleBlur = () => {
    const newValue = parseFloat(editValue);
    if (!isNaN(newValue) && newValue > 0) {
      onChange(newValue.toString());
    } else {
      setEditValue(value);
    }
  };

  if (isEditMode) {
    return (
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value.replace(/[^0-9.]/g, ''))}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className="w-full h-8 px-2 text-xs font-mono rounded border text-center
                   bg-[#050a0e] text-[#FFE4B5] border-[#FFD700]
                   focus:outline-none focus:ring-1 focus:ring-[#FFD70040]"
        />
      </div>
    );
  }

  return (
    <button
      onClick={() => onExecute(value)}
      disabled={isLoading}
      className={`relative group px-2 py-1.5 text-xs font-mono rounded border transition-all duration-200
                min-w-[48px] h-8 flex items-center justify-center
                disabled:opacity-50 disabled:cursor-not-allowed
                ${variant === 'buy' 
                  ? 'bg-[#050a0e60] border-[#FFD70040] text-[#FFD700] hover:bg-[#FFD70020] hover:border-[#FFD700]' 
                  : 'bg-[#050a0e60] border-[#ff323240] text-[#ff3232] hover:bg-[#ff323220] hover:border-[#ff3232]'
                }`}
    >
      {isLoading ? (
        <div className="flex items-center gap-1">
          <Loader2 size={10} className="animate-spin" />
          <span>{value}</span>
        </div>
      ) : (
        value
      )}
    </button>
  );
};

// Tab Button component
const TabButton = ({ label, isActive, onClick, onEdit, isEditMode }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(label);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      (inputRef.current as HTMLInputElement).focus();
      (inputRef.current as HTMLInputElement).select();
    }
  }, [isEditing]);

  const handleClick = () => {
    if (isEditMode) {
      setIsEditing(true);
      setEditValue(label);
    } else {
      onClick();
    }
  };

  const handleSave = () => {
    if (editValue.trim()) {
      onEdit(editValue.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditValue(label);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <div className="flex-1">
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          className="w-full px-2 py-1 text-xs font-mono rounded
                   bg-[#050a0e] text-[#FFE4B5] border border-[#FFD700]
                   focus:outline-none focus:ring-1 focus:ring-[#FFD70040]"
        />
      </div>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`flex-1 px-3 py-1.5 text-xs font-mono rounded transition-all duration-200
                ${isActive 
                  ? 'bg-[#FFD70020] border border-[#FFD700] text-[#FFD700]' 
                  : 'bg-[#050a0e60] border border-[#FFD70020] text-[#FFE4B560] hover:border-[#FFD70040] hover:text-[#FFE4B5]'
                }
                ${isEditMode ? 'cursor-text' : 'cursor-pointer'}`}
    >
      {label}
    </button>
  );
};

const TradingCard = ({ 
  tokenAddress, 
  wallets,
  selectedDex,
  setSelectedDex,
  isDropdownOpen,
  setIsDropdownOpen,
  buyAmount,
  setBuyAmount,
  sellAmount,
  setSellAmount,
  handleTradeSubmit,
  isLoading,
  dexOptions,
  validateActiveWallets,
  getScriptName,
  countActiveWallets,
  maxWalletsConfig,
  currentMarketCap,
  tokenBalances,
  onOpenFloating,
  isFloatingCardOpen
}) => {
  const [activeMainTab, setActiveMainTab] = useState('trading'); // 'orders' or 'trading'
  const [activeTradeType, setActiveTradeType] = useState('buy');
  const [orderType, setOrderType] = useState('market');
  const [isEditMode, setIsEditMode] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Default preset tabs
  const defaultPresetTabs = [
    {
      id: 'degen',
      label: 'DEGEN',
      buyPresets: ['0.01', '0.05', '0.1', '0.5'],
      sellPresets: ['25', '50', '75', '100']
    },
    {
      id: 'diamond',
      label: 'DIAMOND',
      buyPresets: ['0.001', '0.01', '0.05', '0.1'],
      sellPresets: ['10', '25', '50', '75']
    },
    {
      id: 'yolo',
      label: 'YOLO',
      buyPresets: ['0.1', '0.5', '1', '5'],
      sellPresets: ['50', '75', '90', '100']
    }
  ];

  // Load presets from cookies
  const loadPresetsFromCookies = () => {
    try {
      const savedPresets = document.cookie
        .split('; ')
        .find(row => row.startsWith('tradingPresets='))
        ?.split('=')[1];
      
      if (savedPresets) {
        const decoded = decodeURIComponent(savedPresets);
        const parsed = JSON.parse(decoded);
        return {
          tabs: Array.isArray(parsed.tabs) ? parsed.tabs : defaultPresetTabs,
          activeTabId: parsed.activeTabId || 'degen'
        };
      }
    } catch (error) {
      console.error('Error loading presets from cookies:', error);
    }
    return {
      tabs: defaultPresetTabs,
      activeTabId: 'degen'
    };
  };

  // Save presets to cookies
  const savePresetsToCookies = (tabs, activeTabId) => {
    try {
      const presetsData = {
        tabs,
        activeTabId
      };
      const encoded = encodeURIComponent(JSON.stringify(presetsData));
      const expires = new Date();
      expires.setFullYear(expires.getFullYear() + 1); // 1 year expiry
      document.cookie = `tradingPresets=${encoded}; expires=${expires.toUTCString()}; path=/`;
    } catch (error) {
      console.error('Error saving presets to cookies:', error);
    }
  };

  // Initialize presets from cookies
  const initialPresets = loadPresetsFromCookies();
  const [presetTabs, setPresetTabs] = useState(initialPresets.tabs);
  const [activeTabId, setActiveTabId] = useState(initialPresets.activeTabId);
  const activeTab = presetTabs.find(tab => tab.id === activeTabId) || presetTabs[0];
  
  // Save presets to cookies whenever they change
  useEffect(() => {
    savePresetsToCookies(presetTabs, activeTabId);
  }, [presetTabs, activeTabId]);
  
  // Handle tab switching with cookie save
  const handleTabSwitch = (tabId) => {
    setActiveTabId(tabId);
  };
  
  // Edit preset handlers
  const handleEditBuyPreset = (index, newValue) => {
    setPresetTabs(tabs => tabs.map(tab => 
      tab.id === activeTabId 
        ? {
            ...tab,
            buyPresets: tab.buyPresets.map((preset, i) => i === index ? newValue : preset)
          }
        : tab
    ));
  };
  
  const handleEditSellPreset = (index, newValue) => {
    setPresetTabs(tabs => tabs.map(tab => 
      tab.id === activeTabId 
        ? {
            ...tab,
            sellPresets: tab.sellPresets.map((preset, i) => i === index ? newValue : preset)
          }
        : tab
    ));
  };
  
  // Edit tab label
  const handleEditTabLabel = (tabId, newLabel) => {
    setPresetTabs(tabs => tabs.map(tab => 
      tab.id === tabId ? { ...tab, label: newLabel } : tab
    ));
  };
  
  // Handle trade execution
  const handleTradeExecution = (amount, isBuy) => {
    if (isBuy) {
      setBuyAmount(amount);
      handleTradeSubmit(wallets, isBuy, selectedDex, amount, undefined);
    } else {
      setSellAmount(amount);
      handleTradeSubmit(wallets, isBuy, selectedDex, undefined, amount);
    }
  };
  
  // Custom DEX select component
  const CustomSelect = () => {
    const handleDexSelect = (dexValue, e) => {
      e.stopPropagation();
      setSelectedDex(dexValue);
      setIsDropdownOpen(false);
    };
    
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsDropdownOpen(!isDropdownOpen);
          }}
          className={`flex items-center justify-between px-1.5 py-0.5 rounded
                   bg-[#050a0e60] text-[#FFE4B5] border border-[#FFD70040]
                   hover:bg-[#FFD70020] hover:border-[#FFD70080]
                   transition-all duration-300 text-[10px] font-mono min-w-[60px]
                   ${isDropdownOpen ? 'shadow-[0_0_10px_rgba(2,179,109,0.3)]' : ''}`}
        >
          <span className="truncate flex items-center">
            {selectedDex === 'auto' ? (
              <span className="flex items-center gap-1">
                <span className="text-yellow-400 animate-pulse text-xs">⭐</span>
                <span>AUTO</span>
              </span>
            ) : (
              dexOptions.find(d => d.value === selectedDex)?.label?.toUpperCase() || 'SELECT DEX'
            )}
          </span>
          <div className={`transform transition-transform duration-300 ml-0.5 ${isDropdownOpen ? 'rotate-180' : ''}`}>
            <ChevronDown size={10} className="text-[#FFD700]" />
          </div>
        </button>

        {isDropdownOpen && (
          <div 
            className="fixed z-[9999] w-32 mt-1 rounded-md bg-[#050a0e]
                      border border-[#FFD70040] shadow-lg shadow-[#00000080]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="py-0.5">
              {dexOptions.map((dex) => (
                <button
                  key={dex.value}
                  className="w-full px-2 py-1 text-left text-[#FFE4B5] text-[10px] font-mono
                         hover:bg-[#FFD70020] transition-colors duration-200 flex items-center gap-1"
                  onClick={(e) => handleDexSelect(dex.value, e)}
                >
                  {dex.value === 'auto' ? (
                    <>
                      <span className="text-yellow-400 animate-pulse text-xs">⭐</span>
                      <span>AUTO</span>
                    </>
                  ) : (
                    dex.label.toUpperCase()
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };
  
  // Handle amount change
  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    if (activeTradeType === 'buy') {
      setBuyAmount(value);
    } else {
      setSellAmount(value);
    }
  };

  // Handle preset click
  const handlePresetClick = (preset) => {
    if (activeTradeType === 'buy') {
      setBuyAmount(preset);
      handleTradeSubmit(wallets, true, selectedDex, preset, undefined);
    } else {
      setSellAmount(preset);
      handleTradeSubmit(wallets, false, selectedDex, undefined, preset);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div 
      className="relative overflow-hidden rounded-xl shadow-xl"
      style={{
        background: "linear-gradient(135deg, rgba(9,18,23,0.8) 0%, rgba(5,10,14,0.9) 100%)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(2,179,109,0.3)"
      }}
    >
      {/* Cyberpunk corner accents */}
      <div className="absolute top-0 left-0 w-24 h-24 pointer-events-none">
        <div className="absolute top-0 left-0 w-px h-8 bg-gradient-to-b from-[#FFD700] to-transparent"></div>
        <div className="absolute top-0 left-0 w-8 h-px bg-gradient-to-r from-[#FFD700] to-transparent"></div>
      </div>
      <div className="absolute top-0 right-0 w-24 h-24 pointer-events-none">
        <div className="absolute top-0 right-0 w-px h-8 bg-gradient-to-b from-[#FFD700] to-transparent"></div>
        <div className="absolute top-0 right-0 w-8 h-px bg-gradient-to-l from-[#FFD700] to-transparent"></div>
      </div>
      <div className="absolute bottom-0 left-0 w-24 h-24 pointer-events-none">
        <div className="absolute bottom-0 left-0 w-px h-8 bg-gradient-to-t from-[#FFD700] to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-8 h-px bg-gradient-to-r from-[#FFD700] to-transparent"></div>
      </div>
      <div className="absolute bottom-0 right-0 w-24 h-24 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-px h-8 bg-gradient-to-t from-[#FFD700] to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-8 h-px bg-gradient-to-l from-[#FFD700] to-transparent"></div>
      </div>

      {/* Main Tabs - Orders and Trading */}
      {!isFloatingCardOpen && (
        <div className="flex bg-[#050a0e60] border-b border-[#FFD70020]">
          {/* Orders Tab - Smaller */}
          <button
            onClick={() => setActiveMainTab('orders')}
            className={`px-3 py-2 text-xs font-mono tracking-wider transition-all duration-200 ${
              activeMainTab === 'orders'
                ? 'bg-[#FFD70040] text-[#FFD700] border-r border-[#FFD70060]'
                : 'bg-transparent text-[#FFE4B540] hover:text-[#FFE4B560] border-r border-[#FFD70020]'
            }`}
          >
            <ClipboardList size={14} />
          </button>
          
          {/* Buy/Sell Toggle - Takes remaining space */}
          <div className="flex flex-1">
            <button
              onClick={() => {
                setActiveMainTab('trading');
                setActiveTradeType('buy');
              }}
              className={`flex-1 py-3 px-4 text-sm font-mono tracking-wider transition-all duration-200 ${
                activeMainTab === 'trading' && activeTradeType === 'buy'
                  ? 'bg-[#FFD700] text-black font-medium'
                  : 'bg-transparent text-[#FFE4B560] hover:text-[#FFE4B5]'
              }`}
            >
              BUY
            </button>
            <button
              onClick={() => {
                setActiveMainTab('trading');
                setActiveTradeType('sell');
              }}
              className={`flex-1 py-3 px-4 text-sm font-mono tracking-wider transition-all duration-200 ${
                activeMainTab === 'trading' && activeTradeType === 'sell'
                  ? 'bg-[#ff3232] text-white font-medium'
                  : 'bg-transparent text-[#ff323260] hover:text-[#ff3232]'
              }`}
            >
              SELL
            </button>
          </div>
          
          {/* Wallet Counter */}
          <div className="flex items-center px-3 py-2 border-l border-[#FFD70020]">
            <div className="flex items-center gap-1 text-xs font-mono text-[#FFE4B560]">
              <span className="text-[#FFD700]">{countActiveWallets(wallets)}</span>
              <svg 
                width="12" 
                height="12" 
                viewBox="0 0 24 24" 
                fill="none" 
                className="text-[#FFD700]"
              >
                <path 
                  d="M21 8V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2h18zM3 10v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-8H3zm13 4h2v2h-2v-2z" 
                  fill="currentColor"
                />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Order Type Tabs - Only show for trading tab */}
      {!isFloatingCardOpen && activeMainTab === 'trading' && (
        <div className="flex items-center justify-between px-4 py-2 bg-[#050a0e40] border-b border-[#FFD70010]">
          <div className="flex gap-4">
            <button
              onClick={() => setOrderType('market')}
              className={`text-xs font-mono tracking-wider transition-all duration-200 ${
                orderType === 'market'
                  ? 'text-[#FFD700] border-b-2 border-[#FFD700] pb-1'
                  : 'text-[#FFE4B560] hover:text-[#FFE4B5] pb-1'
              }`}
            >
              MARKET
            </button>
            <button
              onClick={() => setOrderType('limit')}
              className={`text-xs font-mono tracking-wider transition-all duration-200 ${
                orderType === 'limit'
                  ? 'text-[#FFD700] border-b-2 border-[#FFD700] pb-1'
                  : 'text-[#FFE4B560] hover:text-[#FFE4B5] pb-1'
              }`}
            >
              LIMIT
            </button>
          </div>
          
          {/* Action Icons - Hidden for limit orders */}
          {orderType !== 'limit' && (
            <div className="flex items-center gap-2">
              <CustomSelect />
              <button
                onClick={onOpenFloating}
                className="p-1.5 rounded hover:bg-[#FFD70020] text-[#FFE4B560] hover:text-[#FFD700] transition-all duration-200"
                title="Detach"
              >
                <Move size={14} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Orders Tab Header - Only show for orders tab */}
      {!isFloatingCardOpen && activeMainTab === 'orders' && (
        <div className="flex items-center justify-between px-4 py-2 bg-[#050a0e40] border-b border-[#FFD70010]">
          <div className="text-xs font-mono tracking-wider text-[#FFE4B5] uppercase">
            ACTIVE ORDERS
          </div>
          
          {/* Action Icons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenFloating}
              className="p-1.5 rounded hover:bg-[#FFD70020] text-[#FFE4B560] hover:text-[#FFD700] transition-all duration-200"
              title="Detach"
            >
              <Move size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      {!isFloatingCardOpen ? (
        <div className="p-3 space-y-2">
          {activeMainTab === 'orders' ? (
            /* Orders Content */
            <div className="space-y-3">
              <div className="text-center py-8">
                <div className="text-[#FFE4B560] text-sm font-mono mb-2">No active orders</div>
                <div className="text-[#FFE4B540] text-xs font-mono">Your limit orders will appear here</div>
              </div>
            </div>
          ) : (
            /* Trading Content */
            <>
              {/* Amount Input and Submit Button Row - Hidden for limit orders */}
          {orderType !== 'limit' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono tracking-wider text-[#FFE4B5] uppercase">
                  AMOUNT
                </label>
                <span className="text-xs text-[#FFE4B560] font-mono">
                  {activeTradeType === 'buy' ? 'SOL/WALLET' : '% TOKENS'}
                </span>
              </div>
              
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={activeTradeType === 'buy' ? buyAmount : sellAmount}
                    onChange={handleAmountChange}
                    placeholder="0.0"
                    disabled={!tokenAddress || isLoading}
                    className="w-full px-2 py-2 bg-[#050a0e80] border border-[#FFD70040] rounded-lg 
                             text-[#FFE4B5] placeholder-[#FFE4B560] font-mono text-sm 
                             focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD70040] 
                             transition-all duration-300 shadow-inner shadow-[#00000080]
                             disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  {isLoading && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Loader2 size={16} className="animate-spin text-[#FFD700]" />
                    </div>
                  )}
                </div>
                
                {/* Submit Button */}
                <button
                  onClick={() => handleTradeSubmit(wallets, activeTradeType === 'buy', selectedDex, activeTradeType === 'buy' ? buyAmount : undefined, activeTradeType === 'sell' ? sellAmount : undefined)}
                  disabled={!selectedDex || (!buyAmount && !sellAmount) || isLoading || !tokenAddress}
                  className={`px-4 py-2 text-sm font-mono tracking-wider rounded-lg 
                           transition-all duration-300 relative overflow-hidden whitespace-nowrap
                           disabled:opacity-50 disabled:cursor-not-allowed ${
                    activeTradeType === 'buy'
                      ? 'bg-gradient-to-r from-[#FFD700] to-[#01a35f] hover:from-[#01a35f] hover:to-[#029359] text-black font-medium shadow-md shadow-[#FFD70040] hover:shadow-[#FFD70060] disabled:from-[#FFD70040] disabled:to-[#FFD70040] disabled:shadow-none'
                      : 'bg-gradient-to-r from-[#ff3232] to-[#e62929] hover:from-[#e62929] hover:to-[#cc2020] text-white font-medium shadow-md shadow-[#ff323240] hover:shadow-[#ff323260] disabled:from-[#ff323240] disabled:to-[#ff323240] disabled:shadow-none'
                  }`}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 size={16} className="animate-spin" />
                      PROCESSING...
                    </span>
                  ) : (
                    `${activeTradeType === 'buy' ? 'BUY' : 'SELL'}`
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Preset tabs - Hidden for limit orders */}
          {orderType !== 'limit' && (
            <div className="flex gap-1 mb-2">
              {presetTabs.map((tab) => (
                <TabButton
                  key={tab.id}
                  label={tab.label}
                  isActive={tab.id === activeTabId}
                  isEditMode={isEditMode}
                  onClick={() => handleTabSwitch(tab.id)}
                  onEdit={(newLabel) => handleEditTabLabel(tab.id, newLabel)}
                />
              ))}
              <button
                onClick={() => setIsEditMode(!isEditMode)}
                className={`px-2 py-1 text-xs rounded transition-colors ${
                  isEditMode 
                    ? 'bg-[#FFD700] hover:bg-[#01a35f] text-black' 
                    : 'bg-[#050a0e60] border border-[#FFD70040] text-[#FFD700] hover:bg-[#FFD70020]'
                }`}
                title={isEditMode ? 'Save changes' : 'Edit presets'}
              >
                {isEditMode ? <Check size={12} /> : <Edit3 size={12} />}
              </button>
            </div>
          )}

          {/* Preset Buttons - Hidden for limit orders */}
          {orderType !== 'limit' && (
            <div className="grid grid-cols-4 gap-1">
              {(activeTradeType === 'buy' ? activeTab.buyPresets : activeTab.sellPresets).map((preset, index) => (
                <PresetButton
                  key={`${activeTradeType}-${index}`}
                  value={preset}
                  onExecute={() => handlePresetClick(preset)}
                  onChange={(newValue) => {
                    if (activeTradeType === 'buy') {
                      handleEditBuyPreset(index, newValue);
                    } else {
                      handleEditSellPreset(index, newValue);
                    }
                  }}
                  isLoading={isLoading}
                  variant={activeTradeType}
                  isEditMode={isEditMode}
                  index={index}
                />
              ))}
            </div>
          )}

          {/* Limit Order Inputs - Work in Progress */}
          {orderType === 'limit' && (
            <div className="space-y-3 border-[#FFD70020] relative">
              {/* Work in Progress Banner */}
              <div className="bg-[#ff323220] border border-[#ff323240] rounded-lg p-3 mb-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-[#ff3232] rounded-full animate-pulse"></div>
                  <span className="text-xs font-mono tracking-wider text-[#ff3232] uppercase font-medium">
                    WORK IN PROGRESS
                  </span>
                </div>
                <p className="text-xs font-mono text-[#ff323280] leading-relaxed">
                  Limit orders are currently under development. This feature will be available in a future update.
                </p>
              </div>
              
              {/* Labels Row */}
              <div className="flex gap-2 opacity-50">
                <div className="flex-1">
                  <label className="text-xs font-mono tracking-wider text-[#FFE4B560] uppercase">
                    SOL AMOUNT
                  </label>
                </div>
                <div className="flex-1">
                  <label className="text-xs font-mono tracking-wider text-[#FFE4B560] uppercase">
                    TOKEN AMOUNT
                  </label>
                </div>
              </div>
              
              {/* Inputs Row - Disabled */}
              <div className="flex gap-2 opacity-50">
                <input
                  type="text"
                  placeholder="0.0"
                  disabled
                  className="flex-1 min-w-0 px-2 py-2 bg-[#050a0e40] border border-[#FFD70020] rounded-lg 
                           text-[#FFE4B540] placeholder-[#FFE4B540] font-mono text-sm 
                           cursor-not-allowed"
                />
                <input
                  type="text"
                  placeholder="0.0"
                  disabled
                  className="flex-1 min-w-0 px-2 py-2 bg-[#050a0e40] border border-[#FFD70020] rounded-lg 
                           text-[#FFE4B540] placeholder-[#FFE4B540] font-mono text-sm 
                           cursor-not-allowed"
                />
              </div>
              
              {/* Create Order Button - Disabled */}
              <button
                disabled
                className="w-full px-4 py-2 text-sm font-mono tracking-wider rounded-lg 
                         bg-[#FFD70020] text-[#FFE4B540] 
                         transition-all duration-300 relative overflow-hidden
                         opacity-50 cursor-not-allowed"
              >
                CREATE ORDER (COMING SOON)
              </button>
            </div>
          )}
            </>
          )}
        </div>
      ) : (
        <div className="p-8 text-center">
          <p className="text-[#FFE4B560] text-sm font-mono tracking-wider">
            TRADING INTERFACE IS OPEN IN FLOATING MODE
          </p>
        </div>
      )}
    </div>
  );
};

export default TradingCard;